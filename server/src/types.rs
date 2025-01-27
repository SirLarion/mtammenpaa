use serde::{Deserialize, Serialize};
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

// #[derive(Debug, FromRow, Type)]
// pub struct Post {
//     id: u32,
//     pub path: String,
//     pub endpoint: String,
//     // tags: Option<Vec<Tag>>,
// }

#[derive(Debug, FromRow, Type)]
pub struct PostMeta {
    pub endpoint: String,
    pub path: String,
}

#[derive(Debug, FromRow, Type, Serialize)]
pub struct PostPreview {
    pub endpoint: String,
    pub preview: String,
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

#[derive(Clone, Serialize)]
pub struct NavItem {
    pub name: &'static str,
    pub endpoint: &'static str,
    pub active: bool,
}

#[derive(Clone, FromRow, Type, Serialize, Deserialize)]
pub struct PreviewMeta {
    pub path: String,
    pub img_urls: String,
    pub img_alt: String,
    pub display_name: String,
    pub description: String,
}

#[derive(Clone, FromRow, Type, Serialize, Deserialize)]
pub struct PreviewItem {
    pub sources: String,
    pub display_name: String,
    pub description: String,
}
