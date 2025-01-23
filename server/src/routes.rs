use std::{fs, io::Read};

use actix_files::NamedFile;
use actix_web::{get, web, HttpRequest, HttpResponse};
use minijinja::context;
use rand::Rng;
use serde::Deserialize;

use crate::{
    error::AppError,
    types::{AppCtx, PostMeta, PostPreview},
    util::{build_nav, create_generated_css_variables, get_generated_colors},
};

fn is_htmx_req(req: &HttpRequest) -> bool {
    req.headers().get("HX-Request").is_some()
}

#[derive(Deserialize)]
struct FaviconRequest {
    hue: f32,
    dark: Option<bool>,
}

#[get("/favicon")]
pub async fn favicon(
    info: web::Query<FaviconRequest>,
    ctx: web::Data<AppCtx>,
) -> Result<HttpResponse, AppError> {
    let template = ctx.jinja.get_template("favicon.svg")?;
    let (light, dark) = get_generated_colors(info.hue);
    let is_light = info.dark.is_none();

    Ok(HttpResponse::Ok()
        .content_type(mime::IMAGE_SVG)
        .body(web::Bytes::from_owner(template.render(
            context! { fill => if is_light { light.fg_rainbow } else { dark.fg_rainbow } },
        )?)))
}

#[get("/")]
pub async fn index(req: HttpRequest, ctx: web::Data<AppCtx>) -> Result<HttpResponse, AppError> {
    let title = "mlt";
    let template = ctx.jinja.get_template("main.html")?;
    let nav = build_nav(&ctx.jinja, "front")?;

    let out = if is_htmx_req(&req) {
        template
            .eval_to_state(context! { title, nav })?
            .render_block("content")?
    } else {
        let hue: f32 = rand::thread_rng().gen_range(0.0..360.0);
        template
            .render(context! {css_vars => create_generated_css_variables(hue), hue, title, nav })?
    };
    Ok(HttpResponse::Ok().body(web::Bytes::from_owner(out)))
}

#[get("/about")]
pub async fn about(req: HttpRequest, ctx: web::Data<AppCtx>) -> Result<HttpResponse, AppError> {
    let file = NamedFile::open("./client/build/About/content.html")?;
    let template = ctx.jinja.get_template("post.html")?;
    let nav = build_nav(&ctx.jinja, "about")?;
    let title = "About";
    let mut post = String::new();
    file.file().read_to_string(&mut post)?;

    let out = if is_htmx_req(&req) {
        template
            .eval_to_state(context! { post, title, nav })?
            .render_block("content")?
    } else {
        let hue: f32 = rand::thread_rng().gen_range(0.0..360.0);
        template.render(
            context! {css_vars => create_generated_css_variables(hue), post, hue, title, nav },
        )?
    };
    Ok(HttpResponse::Ok().body(web::Bytes::from_owner(out)))
}

// These are hardcoded for now because why not
#[derive(Clone)]
struct ShowcaseItem {
    url: &'static str,
    img_url: &'static str,
    img_alt: &'static str,
    name: &'static str,
    description: &'static str,
}

const SHOWCASE_ITEMS: [ShowcaseItem; 4] = [
    ShowcaseItem {
        url: "https://git.tammenpaa.com/sirlarion/sol-sim",
        img_url: "https://git.tammenpaa.com/sirlarion/sol-sim/media/branch/master/documentation/screenshots/main1.png",
        img_alt: "An image of the 'sol-sim' software. A user interface is displayed with a large, empty space. There are small, bright dots with circular trails depicting the large celestial bodies of our solar system.",
        name: "sol-sim",
        description: "Solar system simulator made as a course project. The software calculates the movements of celestial bodies with regard to each other and displays them in a human-readable way. The fun part is you can add new bodies and give them whatever mass you want, leading to slingshotting smaller bodies out of the solar system at near-lightspeed. It's not a very accurate simulator."
    },
    ShowcaseItem {
        url: "https://git.tammenpaa.com/sirlarion/spaceballs",
        img_url: "https://git.tammenpaa.com/sirlarion/spaceballs/media/branch/master/aimball.png",
        img_alt: "An image of the 'Spaceballs' game. A billiards cue ball is seen in the foreground. It levitates in a spherical space with holes on the inner surface of the sphere. A line indicating hit direction points out from the ball and collides with a pyramid-like cluster of other billiards balls. The line then deflects in another direction to display how the cue ball would move when colliding with the balls.",
        name: "Spaceballs",
        description: "Billiards in 3 dimensions. What an idea right? Spaceballs was another course project made with a group of people (accreditation in the Git repo, in Finnish only — Sorry!). You use your cue ball to knock the other balls in holes, but this time the holes are scattered on the inner-surface of a sphere, inside which you float and move around in. This was a very fun project and if I had All the Time in the World™ I'd definitely make this into a finalized product."
    },
    ShowcaseItem {
        url: "https://git.tammenpaa.com/sirlarion/sddm-haxor",
        img_url: "https://git.tammenpaa.com/sirlarion/sddm-haxor/media/branch/main/preview.png",
        img_alt: "A very barebones login screen is shown. An otherwise entirely black image has two lines of white text located on the left side of the image around the top-left golden ratio point.",
        name: "sddm-haxor",
        description: "A super barebones theme for the unix-based 'SDDM' login manager. I was fed up with the wishy-washy default look of login screens and wanted something to show off what a CLI-wizard I am (can't just use a regular TTY login screen of course because ... well, I dunno it was fun making this). Still using this to log in today.", 
    },
    ShowcaseItem {
        url: "https://git.tammenpaa.com/sirlarion/miniprojects/src/branch/main/libnet",
        img_url: "https://git.tammenpaa.com/sirlarion/miniprojects/media/branch/main/libnet/img/spring_layout.png",
        img_alt: "A network graph displayed in a spherical form. It looks almost like an explosion with warm colors changing to indicate the in-degree of each node.",
        name: "libnet",
        description: r#"A course project studying the network structure of Python dependencies in Github (as indicated by 'requirements.txt' files). This was partially motivated by the <a href="https://en.wikipedia.org/wiki/Npm_left-pad_incident" target="_blank" rel="noreferrer">left-pad incident</a> a while back. Relevant xkcd <a href="https://xkcd.com/2347/" target="_blank" rel="noreferrer">#2347</a>"#
    }
];

#[get("/random-showcase")]
pub async fn random_showcase(ctx: web::Data<AppCtx>) -> Result<HttpResponse, AppError> {
    let i = rand::thread_rng().gen_range(0..SHOWCASE_ITEMS.len());
    let ShowcaseItem {
        url,
        img_url,
        img_alt,
        name,
        description,
    } = SHOWCASE_ITEMS[i].clone();
    let template = ctx.jinja.get_template("showcase.html")?;

    Ok(HttpResponse::Ok().body(web::Bytes::from_owner(
        template.render(context! { url, img_url, img_alt, name, description })?,
    )))
}

#[get("/posts")]
pub async fn posts(req: HttpRequest, ctx: web::Data<AppCtx>) -> Result<HttpResponse, AppError> {
    ctx.db_pool.acquire().await?;

    let meta_posts = sqlx::query_as::<_, PostMeta>(
        "SELECT endpoint, path FROM posts ORDER BY updated_at DESC LIMIT 10;",
    )
    .fetch_all(&ctx.db_pool)
    .await?;

    let posts = meta_posts
        .into_iter()
        .map(|post| {
            let PostMeta { endpoint, path } = post;
            let preview =
                fs::read_to_string(format!("./client/build/{path}/preview.html").to_string())?;
            Ok(PostPreview { endpoint, preview })
        })
        .collect::<Result<Vec<PostPreview>, AppError>>()?;

    let (df_posts, posts): (Vec<_>, Vec<_>) = posts
        .into_iter()
        .partition(|p| p.endpoint.contains("digital-fabrication"));

    let nav = build_nav(&ctx.jinja, "posts")?;

    let template = ctx.jinja.get_template("previewList.html")?;

    let out = if is_htmx_req(&req) {
        template
            .eval_to_state(context! { df_posts, posts, nav })?
            .render_block("content")?
    } else {
        let hue: f32 = rand::thread_rng().gen_range(0.0..360.0);
        template.render(
            context! {css_vars => create_generated_css_variables(hue), df_posts, posts, hue, nav },
        )?
    };

    Ok(HttpResponse::Ok().body(web::Bytes::from_owner(out)))
}

#[get("/posts/{category}/{post_name}")]
pub async fn get_post(req: HttpRequest, ctx: web::Data<AppCtx>) -> Result<HttpResponse, AppError> {
    ctx.db_pool.acquire().await?;

    let PostMeta { path, .. } =
        sqlx::query_as::<_, PostMeta>("SELECT endpoint, path FROM posts WHERE endpoint = $1;")
            .bind(req.path())
            .fetch_one(&ctx.db_pool)
            .await?;

    let post = fs::read_to_string(format!("./client/build/{path}/content.html"))?;

    let template = ctx.jinja.get_template("post.html")?;
    let nav = build_nav(&ctx.jinja, "none")?;
    let title = req.path();

    let out = if is_htmx_req(&req) {
        template
            .eval_to_state(context! { post, title, nav })?
            .render_block("content")?
    } else {
        let hue: f32 = rand::thread_rng().gen_range(0.0..360.0);
        template.render(
            context! {css_vars => create_generated_css_variables(hue), post, hue, title, nav },
        )?
    };
    Ok(HttpResponse::Ok().body(web::Bytes::from_owner(out)))
}
