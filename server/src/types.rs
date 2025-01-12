use sqlx::{FromRow, SqlitePool, Type};

pub struct AppCtx {
    pub db_pool: SqlitePool,
}

#[derive(Debug)]
pub enum Tag {
    Rust,
    Javascript,
    Typescript,
    React,
    Mobile,
    Electronics,
    SysAdmin,
}

#[derive(Debug, FromRow, Type)]
pub struct Post {
    id: u32,
    pub path: String,
    pub endpoint: String,
    // tags: Option<Vec<Tag>>,
    pub preview: Option<Vec<u8>>,
}
