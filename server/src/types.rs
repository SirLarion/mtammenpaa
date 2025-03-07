use serde::{Deserialize, Serialize};
use sqlx::{FromRow, SqlitePool, Type};

pub struct AppCtx {
    pub db_pool: SqlitePool,
    pub jinja: minijinja::Environment<'static>,
    pub robots: Vec<String>,
}

pub enum PageKind {
    Index,
    About { content: String },
    List { content: String },
    Post { title: String, content: String },
}

#[derive(Debug)]
pub enum Tag {
    Fab,
    Rust,
    Javascript,
    Typescript,
    React,
    Mobile,
    Electronics,
    SysAdmin,
}
#[derive(Debug, FromRow, Type)]
pub struct Media {
    pub mime: String,
    pub data: String,
}

#[derive(Debug, FromRow, Type)]
pub struct Post {
    pub title: String,
    pub content: String,
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
