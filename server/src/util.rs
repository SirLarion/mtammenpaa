use std::{collections::HashMap, env, fs};

use dotenv::dotenv;
use minijinja::{context, path_loader, AutoEscape, Environment};
use palette::{color_difference::Wcag21RelativeContrast, FromColor, Hsl, Srgb};
use rand::Rng;
use serde_json::Value;

use crate::{
    error::AppError,
    types::{ClientColors, NavItem, PageKind, PreviewItem, PreviewMeta},
};

const NOESCAPE_TEMPLATES: [&str; 6] = [
    "main.html",
    "page.html",
    "post.html",
    "preview.html",
    "showcase.html",
    "previewList.html",
];

const NAV_ITEMS: [NavItem; 3] = [
    NavItem {
        name: "front",
        endpoint: "/",
        active: false,
    },
    NavItem {
        name: "about",
        endpoint: "/about",
        active: false,
    },
    NavItem {
        name: "posts",
        endpoint: "/posts",
        active: false,
    },
];

pub fn load_env() -> Result<(String, u16), AppError> {
    if cfg!(debug_assertions) {
        dotenv().ok();
    } else {
        dotenv::from_filename(".env.production").ok();
    }
    let ip: String = env::var("IPADDR")?;
    let port: u16 = env::var("PORT")?.parse()?;

    Ok((ip, port))
}

pub fn create_jinja_env() -> Environment<'static> {
    let mut env = Environment::new();
    env.set_loader(path_loader("templates"));
    env.set_auto_escape_callback(|name| {
        if NOESCAPE_TEMPLATES.contains(&name) {
            AutoEscape::None
        } else {
            AutoEscape::Html
        }
    });
    env
}

pub fn load_robots_list() -> Result<Vec<String>, AppError> {
    let raw_json = fs::read_to_string("./client/build/robots.json")?;
    let json: HashMap<String, Value> = serde_json::from_str(&raw_json)?;
    let robots: Vec<String> = json.into_keys().collect();

    Ok(robots)
}

fn has_contrast(hsl1: Hsl, hsl2: Hsl) -> bool {
    let factor = Srgb::from_color(hsl1).relative_contrast(Srgb::from_color(hsl2));
    factor >= 4.5
}

fn generate_high_contrast_color(bg: Hsl, l_delta: f32) -> Hsl {
    let h = bg.hue;
    let mut s = bg.saturation + 0.35;
    let mut l = bg.lightness + 0.4 * l_delta;
    let mut done = has_contrast(Hsl::new_srgb(h, s, l), bg);

    let mut i = 0;

    while !done && i < 100 {
        if i % 2 == 0 {
            l += 0.01 * l_delta;
        } else {
            s += 0.01;
        }
        done = has_contrast(Hsl::new_srgb(h, s, l), bg);
        i += 1;
    }

    Hsl::new_srgb(h, s, l)
}

fn get_themed_gen_colors(t: &str, h: f32) -> ClientColors {
    let is_light = t == "light";
    let s: f32 = 0.35;
    let l: f32 = if is_light { 0.85 } else { 0.15 };

    let hc =
        generate_high_contrast_color(Hsl::new_srgb(h, s, l), if is_light { -1.0 } else { 1.0 });

    // CSS has 0-100 for the range of s & l
    let (s, l) = (s * 100.0, l * 100.0);
    let (hcs, hcl) = (hc.saturation * 100.0, hc.lightness * 100.0);

    ClientColors {
        bg_rainbow: format!("hsl({}, {}%, {}%)", h, s, l),
        bg_mono: format!(
            "hsl({}, {}%, {}%)",
            h,
            s,
            if is_light { 98.0 } else { 10.0 }
        ),
        bg_monostrong: format!(
            "hsl({}, {}%, {}%)",
            h,
            s,
            if is_light { 90.0 } else { 20.0 }
        ),
        bg_rainbowlight: format!(
            "hsl({}, {}%, {}%)",
            h,
            s,
            l + if is_light { -5.0 } else { 5.0 }
        ),
        fg_rainbow: format!("hsl({}, {}%, {}%)", h, hcs, hcl),
        fg_rainbowdark: format!(
            "hsl({}, {}%, {}%)",
            h,
            hcs,
            hcl + if is_light { -15.0 } else { 15.0 }
        ),
        fg_rainbowreverse: format!(
            "hsl({}, {}%, {}%)",
            (h + 180.0) % 360.0,
            hcs,
            hcl + if is_light { -15.0 } else { 15.0 }
        ),
    }
}

pub fn get_generated_colors(h: f32) -> (ClientColors, ClientColors) {
    let light = get_themed_gen_colors("light", h);
    let dark = get_themed_gen_colors("dark", h);

    (light, dark)
}

fn create_themed_variables(t: &str, colors: ClientColors) -> String {
    let prefix = if t == "light" { "l" } else { "d" };
    let ClientColors {
        bg_rainbow,
        bg_mono,
        bg_monostrong,
        bg_rainbowlight,
        fg_rainbow,
        fg_rainbowdark,
        fg_rainbowreverse,
    } = colors;

    format!(
        r#"                
        --{prefix}-bg-rainbow: {bg_rainbow};
        --{prefix}-bg-mono: {bg_mono};
        --{prefix}-bg-mono-strong: {bg_monostrong};
        --{prefix}-bg-rainbow-light: {bg_rainbowlight};
        --{prefix}-fg-rainbow: {fg_rainbow};
        --{prefix}-fg-rainbow-dark: {fg_rainbowdark};
        --{prefix}-fg-rainbow-reverse: {fg_rainbowreverse};
        "#
    )
}

fn create_generated_css_variables(h: f32) -> String {
    let (light, dark) = get_generated_colors(h);
    let light_vars = create_themed_variables("light", light);
    let dark_vars = create_themed_variables("dark", dark);

    format!(
        r#"<style>
            :root {{
                {light_vars}
                {dark_vars}
            }}
        </style>"#
    )
}

pub fn build_preview_item(jinja: &Environment, meta: &PreviewMeta) -> Result<String, AppError> {
    let PreviewMeta {
        path,
        img_urls,
        img_alt,
        display_name,
        description,
    } = meta;
    let sources: String;

    let is_external = path.starts_with("http");

    // Multiple img source definitions
    if img_urls.contains(",") {
        sources = img_urls
            .split(",")
            .map(|src| {
                if !is_external {
                    format!("/build/{path}/{src}")
                } else {
                    src.to_string()
                }
            })
            .fold(
                Ok(String::new()),
                |acc: Result<String, AppError>, curr: String| {
                    let Ok(acc) = acc else {
                        return acc;
                    };

                    let file = curr
                        .split("/")
                        .last()
                        .ok_or(AppError::BuildError(format!("invalid image url")))?;

                    let mut width = "1x".to_string();
                    let mut media = "".to_string();
                    let is_small = file.contains("-small");
                    let is_dark = file.contains("-dark");

                    if !(is_small || is_dark) {
                        return Ok(format!(
                            r#"{acc}<img src="{curr}" alt="{img_alt}" width="960" />"#
                        ));
                    }
                    if file.contains("-dark") {
                        media = "(prefers-color-scheme: dark)".to_string();
                    }
                    if file.contains("-small") {
                        width = "480w".to_string();
                        if media == "".to_string() {
                            media = "(max-width: 480px)".to_string();
                        } else {
                            media = media + " and (max-width: 480px)"
                        }
                    }
                    if !(file.contains("-dark") || file.contains("-small")) {}

                    Ok(format!(
                        r#"{acc}<source srcset="{curr} {width}" media="{media}" />"#
                    ))
                },
            )?
    } else {
        sources = format!(r#"<img src="{img_urls}" alt="{img_alt}" width="960" />"#);
    }
    let icon_svg = fs::read_to_string("./client/assets/link-external.svg")?;

    let preview = PreviewItem {
        sources,
        display_name: display_name.to_string(),
        description: description.to_string(),
    };

    let template = jinja.get_template("preview.html")?;
    Ok(template.render(
        context! { preview, display_icon => if is_external { icon_svg } else { String::new() } },
    )?)
}

pub fn build_page(
    jinja: &Environment,
    page: PageKind,
    is_partial: bool,
) -> Result<String, AppError> {
    let (template_name, nav_item, title, content_opt) = match page {
        PageKind::Index => ("main.html", "front", "mlt".to_string(), None),
        PageKind::About { content } => ("post.html", "about", "About".to_string(), Some(content)),
        PageKind::List { content } => ("page.html", "posts", "Posts".to_string(), Some(content)),
        PageKind::Post { title, content } => ("post.html", "none", title, Some(content)),
    };
    let nav = build_nav(jinja, nav_item)?;
    let template = jinja.get_template(template_name)?;

    let out = if is_partial {
        let ctx = content_opt.map_or_else(
            || context! { title, nav },
            |c| context! { title, nav, content => c },
        );
        template.eval_to_state(ctx)?.render_block("content")?
    } else {
        let dev = cfg!(debug_assertions);
        let hue: f32 = rand::thread_rng().gen_range(0.0..360.0);
        let css_vars = create_generated_css_variables(hue);
        let ctx = content_opt.map_or_else(
            || context! { css_vars, hue, title, nav, dev },
            |c| context! { css_vars, hue, title, nav, dev, content => c },
        );
        template.render(ctx)?
    };

    Ok(out)
}

fn build_nav(jinja: &Environment, active_name: &str) -> Result<String, AppError> {
    let template = jinja.get_template("nav.html")?;
    Ok(template.render(context! {
        nav_items => NAV_ITEMS
            .iter()
            .map(|i| {
                let item = i.clone();
                if item.name == active_name {
                    NavItem { active: true, ..item }
                } else {
                    item
                }
            }).collect::<Vec<NavItem>>()
    })?)
}
