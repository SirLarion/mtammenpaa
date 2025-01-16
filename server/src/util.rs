use dotenv::dotenv;
use minijinja::{path_loader, AutoEscape, Environment};
use palette::{color_difference::Wcag21RelativeContrast, FromColor, Hsl, Srgb};
use rand::Rng;
use std::env;

use crate::{error::AppError, types::ClientColors};

const NOESCAPE_TEMPLATES: [&str; 2] = ["main.html", "post.html"];

pub fn load_env() -> Result<(String, u16), AppError> {
    dotenv().ok();
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

fn get_generated_colors(t: &str) -> ClientColors {
    let is_light = t == "light";
    let mut rng = rand::thread_rng();

    let h: f32 = rng.gen_range(0.0..360.0);
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

pub fn create_generated_css_variables() -> String {
    let ClientColors {
        bg_rainbow,
        bg_mono,
        bg_monostrong,
        bg_rainbowlight,
        fg_rainbow,
        fg_rainbowdark,
        fg_rainbowreverse,
    } = get_generated_colors("light");

    format!(
        r#"<style>
            :root {{
                --bg-rainbow: {bg_rainbow};
                --bg-mono: {bg_mono};
                --bg-mono-strong: {bg_monostrong};
                --bg-rainbow-light: {bg_rainbowlight};
                --fg-rainbow: {fg_rainbow};
                --fg-rainbow-dark: {fg_rainbowdark};
                --fg-rainbow-reverse: {fg_rainbowreverse};
            }}
        </style>"#
    )
}
