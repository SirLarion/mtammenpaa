use actix_files::Files;
use actix_web::{middleware, web, App, HttpServer};

mod db;
mod error;
mod routes;
mod types;
mod util;

use error::AppError;
use types::*;
use util::*;

#[tokio::main]
async fn main() -> Result<(), AppError> {
    let (ip, port) = load_env()?;

    let pool = db::create_pool().await?;
    db::run_migrations(&pool).await?;

    let server = HttpServer::new(move || {
        let jinja_env = create_jinja_env();
        App::new()
            .app_data(web::Data::new(AppCtx {
                db_pool: pool.clone(),
                jinja: jinja_env,
            }))
            .wrap(middleware::Compress::default())
            .service(routes::index)
            .service(routes::favicon)
            .service(routes::about)
            .service(routes::posts)
            .service(routes::showcase)
            .service(routes::get_post)
            .service(Files::new("/", "./client"))
    })
    .bind((ip, port))?;

    Ok(server.run().await?)
}
