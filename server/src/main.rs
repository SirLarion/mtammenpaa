use actix_files::Files;
use actix_web::{web, App, HttpServer};

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
        App::new()
            .app_data(web::Data::new(AppCtx {
                db_pool: pool.clone(),
            }))
            .service(routes::index)
            .service(routes::about)
            .service(routes::query_posts)
            .service(Files::new("/", "./client"))
    })
    .bind((ip, port))?;

    Ok(server.run().await?)
}
