use sqlx::SqlitePool;

use crate::error::AppError;

pub async fn create_pool() -> Result<SqlitePool, AppError> {
    let pool = SqlitePool::connect("db.sqlite").await?;
    Ok(pool)
}

pub async fn run_migrations(pool: &SqlitePool) -> Result<(), AppError> {
    pool.acquire().await?;
    sqlx::migrate!().run(pool).await?;
    Ok(())
}
