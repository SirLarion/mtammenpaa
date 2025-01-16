use std::io::Read;

use actix_files::NamedFile;
use actix_web::{get, web, HttpRequest, HttpResponse};
use minijinja::context;

use crate::{
    error::AppError,
    types::{AppCtx, Post},
    util::create_generated_css_variables,
};

#[get("/")]
pub async fn index(_req: HttpRequest, ctx: web::Data<AppCtx>) -> Result<HttpResponse, AppError> {
    let template = ctx.jinja.get_template("main.html")?;
    Ok(HttpResponse::Ok().body(web::Bytes::from_owner(
        template.render(context! {css_vars => create_generated_css_variables()})?,
    )))
}

#[get("/about")]
pub async fn about(req: HttpRequest, ctx: web::Data<AppCtx>) -> Result<HttpResponse, AppError> {
    let file = NamedFile::open("./client/build/About/content.html")?;
    if req.headers().get("HX-Request").is_some() {
        Ok(file.into_response(&req))
    } else {
        let template = ctx.jinja.get_template("post.html")?;
        let mut post = String::new();
        file.file().read_to_string(&mut post)?;

        Ok(HttpResponse::Ok().body(web::Bytes::from_owner(
            template.render(context! {css_vars => create_generated_css_variables(), post })?,
        )))
    }
}

#[get("/query-posts")]
pub async fn query_posts(
    _req: HttpRequest,
    ctx: web::Data<AppCtx>,
) -> Result<HttpResponse, AppError> {
    ctx.db_pool.acquire().await?;

    let posts_typed = sqlx::query_as::<_, Post>("SELECT id, path, endpoint, preview FROM posts;")
        .fetch_all(&ctx.db_pool)
        .await?;

    let posts: Vec<String> = posts_typed.into_iter().map(|p| p.endpoint).collect();

    let template = ctx.jinja.get_template("preview.html")?;
    Ok(HttpResponse::Ok().body(web::Bytes::from_owner(template.render(context! { posts })?)))
}
