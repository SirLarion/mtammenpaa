use sqlx::{FromRow, SqlitePool, Type};

pub struct AppCtx {
    pub db_pool: SqlitePool,
    pub jinja: minijinja::Environment<'static>,
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

pub struct ClientColors {
    pub bg_rainbow: String,
    pub bg_mono: String,
    pub bg_monostrong: String,
    pub bg_rainbowlight: String,
    pub fg_rainbow: String,
    pub fg_rainbowdark: String,
    pub fg_rainbowreverse: String,
}
