use actix_files::NamedFile;
use actix_web::{get, web, HttpRequest, HttpResponse};
use askama::Template;

use crate::{
    error::AppError,
    types::{AppCtx, Post},
    util::create_generated_css_variables,
};

#[derive(Template)]
#[template(path = "index.html", escape = "none")]
struct CssVarTemplate {
    css_vars: String,
}

#[derive(Template)]
#[template(path = "preview.html")]
struct PreviewTemplate {
    posts: Vec<String>,
}

#[get("/")]
pub async fn index(_req: HttpRequest) -> Result<HttpResponse, AppError> {
    Ok(HttpResponse::Ok().body(web::Bytes::from_owner(
        CssVarTemplate {
            css_vars: create_generated_css_variables(),
        }
        .render()?,
    )))
}

#[get("/about")]
pub async fn about(req: HttpRequest) -> Result<HttpResponse, AppError> {
    let file = NamedFile::open("./client/build/About/content.html")?;
    Ok(file.into_response(&req))
}

#[get("/query-posts")]
pub async fn query_posts(
    _req: HttpRequest,
    ctx: web::Data<AppCtx>,
) -> Result<HttpResponse, AppError> {
    ctx.db_pool.acquire().await?;

    let posts = sqlx::query_as::<_, Post>("SELECT id, path, endpoint, preview FROM posts;")
        .fetch_all(&ctx.db_pool)
        .await?;

    Ok(HttpResponse::Ok().body(web::Bytes::from_owner(
        PreviewTemplate {
            posts: posts.into_iter().map(|p| p.endpoint).collect(),
        }
        .render()?,
    )))
}
