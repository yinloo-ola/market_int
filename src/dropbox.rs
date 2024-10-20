use crate::http::client::{self, RequestError};
use serde::Deserialize;
use std::{collections::HashMap, env};

#[derive(Debug, Deserialize)]
pub struct DropboxResp {
    pub is_downloadable: bool,
    pub name: String,
}

pub async fn upload_to_dropbox(content: &[u8], dropbox_path: &str) -> Result<(), RequestError> {
    let token = env::var("dropbox_token").map_err(|_| RequestError::TokenNotSet)?;

    let resp = client::request::<DropboxResp>(
        client::Method::Post(Some(content.to_vec())),
        "https://content.dropboxapi.com/2/files/upload",
        HashMap::new(),
        HashMap::from([
            (
                "Dropbox-API-Arg",
                serde_json::json!({
                    "autorename": false,
                    "mode": "add",
                    "mute": false,
                    "path": dropbox_path,
                    "strict_conflict": false
                })
                .to_string()
                .as_str(),
            ),
            (
                reqwest::header::CONTENT_TYPE.as_str(),
                "application/octet-stream",
            ),
        ]),
        Some(&token),
    )
    .await?;

    log::debug!("dropbox api return: {:?}", resp);

    Ok(())
}
