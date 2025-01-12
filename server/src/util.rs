use dotenv::dotenv;
use std::env;

use crate::error::AppError;

pub fn load_env() -> Result<(String, u16), AppError> {
    dotenv().ok();
    let ip: String = env::var("IPADDR")?;
    let port: u16 = env::var("PORT")?.parse()?;

    Ok((ip, port))
}
