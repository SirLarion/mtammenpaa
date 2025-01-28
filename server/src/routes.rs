use actix_files::NamedFile;
use actix_web::{get, web, HttpRequest, HttpResponse};
use minijinja::context;
use rand::Rng;
use serde::Deserialize;
use std::{fs, io::Read};

use crate::types::PreviewMeta;
use crate::util::{build_preview_item, get_preview_meta};
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

#[get("/showcase")]
pub async fn showcase(ctx: web::Data<AppCtx>) -> Result<HttpResponse, AppError> {
    ctx.db_pool.acquire().await?;
    let random_data = sqlx::query_as::<_, PreviewMeta>(
        "SELECT path, img_urls, img_alt, display_name, description FROM showcase_items ORDER BY RANDOM() LIMIT 1;"
    ).fetch_one(&ctx.db_pool).await?;

    let random = PostPreview {
        endpoint: random_data.path.clone(),
        preview: build_preview_item(&ctx.jinja, &random_data)?,
    };

    let latest_data = sqlx::query_as::<_, PostMeta>(
        "SELECT endpoint, path FROM posts ORDER BY updated_at DESC LIMIT 1;",
    )
    .fetch_one(&ctx.db_pool)
    .await?;

    let latest = PostPreview {
        endpoint: latest_data.endpoint.clone(),
        preview: build_preview_item(&ctx.jinja, &get_preview_meta(latest_data.path)?)?,
    };

    let template = ctx.jinja.get_template("showcase.html")?;

    Ok(HttpResponse::Ok().body(web::Bytes::from_owner(
        template.render(context! { random, latest })?,
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
            Ok(PostPreview {
                endpoint,
                preview: build_preview_item(&ctx.jinja, &get_preview_meta(path)?)?,
            })
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
    let meta = get_preview_meta(path)?;

    let template = ctx.jinja.get_template("post.html")?;
    let nav = build_nav(&ctx.jinja, "none")?;
    let title = meta.display_name;

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
