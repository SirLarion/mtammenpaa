use actix_files::NamedFile;
use actix_web::{get, web, HttpRequest, HttpResponse};
use minijinja::context;
use serde::Deserialize;
use sqlx::Row;

use crate::{
    error::AppError,
    types::{AppCtx, Media, PageKind, Post, PostPreview, PreviewMeta},
    util::{build_page, build_preview_item, get_generated_colors},
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
    let out = build_page(&ctx.jinja, PageKind::Index, is_htmx_req(&req))?;
    Ok(HttpResponse::Ok().body(web::Bytes::from_owner(out)))
}

#[get("/about")]
pub async fn about(req: HttpRequest, ctx: web::Data<AppCtx>) -> Result<HttpResponse, AppError> {
    ctx.db_pool.acquire().await?;
    let data = sqlx::query("SELECT content FROM posts WHERE title = 'About';")
        .fetch_one(&ctx.db_pool)
        .await?;
    let content: String = data.try_get("content")?;

    let out = build_page(&ctx.jinja, PageKind::About { content }, is_htmx_req(&req))?;
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

    let latest = sqlx::query_as::<_, PostPreview>(
        "SELECT endpoint, preview FROM posts WHERE published_at NOT NULL ORDER BY published_at DESC LIMIT 1;",
    )
    .fetch_one(&ctx.db_pool)
    .await?;

    let template = ctx.jinja.get_template("showcase.html")?;

    Ok(HttpResponse::Ok().body(web::Bytes::from_owner(
        template.render(context! { random, latest })?,
    )))
}

#[get("/posts")]
pub async fn posts(req: HttpRequest, ctx: web::Data<AppCtx>) -> Result<HttpResponse, AppError> {
    ctx.db_pool.acquire().await?;

    let posts = sqlx::query_as::<_, PostPreview>(
        "SELECT endpoint, preview 
        FROM posts 
        WHERE title != 'About' AND published_at NOT NULL 
        ORDER BY published_at DESC 
        LIMIT 10;",
    )
    .fetch_all(&ctx.db_pool)
    .await?;

    let (df_posts, posts): (Vec<_>, Vec<_>) = posts
        .into_iter()
        .partition(|p| p.endpoint.contains("digital-fabrication"));

    let content = ctx
        .jinja
        .get_template("previewList.html")?
        .render(context! { df_posts, posts })?;

    let out = build_page(&ctx.jinja, PageKind::List { content }, is_htmx_req(&req))?;

    Ok(HttpResponse::Ok().body(web::Bytes::from_owner(out)))
}

#[get("/posts/{category}/{post_name}")]
pub async fn get_post(req: HttpRequest, ctx: web::Data<AppCtx>) -> Result<HttpResponse, AppError> {
    ctx.db_pool.acquire().await?;

    let Post { title, content } =
        sqlx::query_as::<_, Post>("SELECT title, content FROM posts WHERE endpoint = $1;")
            .bind(req.path())
            .fetch_one(&ctx.db_pool)
            .await?;

    let out = build_page(
        &ctx.jinja,
        PageKind::Post { title, content },
        is_htmx_req(&req),
    )?;
    Ok(HttpResponse::Ok().body(web::Bytes::from_owner(out)))
}

#[get("/media/{file}")]
pub async fn get_media(
    info: web::Path<String>,
    ctx: web::Data<AppCtx>,
) -> Result<HttpResponse, AppError> {
    ctx.db_pool.acquire().await?;
    let path = info.into_inner();

    let media = sqlx::query_as::<_, Media>("SELECT mime, data FROM media WHERE path = $1;")
        .bind(path)
        .fetch_one(&ctx.db_pool)
        .await?;

    let mime_type: mime::Mime = media.mime.parse()?;
    let data: Vec<u8> = hex::decode(media.data)?;

    Ok(HttpResponse::Ok()
        .content_type(mime_type)
        .body(web::Bytes::from_iter(data.into_iter())))
}
