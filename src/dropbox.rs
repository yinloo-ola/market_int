// use reqwest::{Body, Client, Url};

// pub fn upload_to_dropbox(
//     access_token: &str,
//     content: &[u8],
//     dropbox_path: &str,
// ) -> Result<(), reqwest::Error> {
//     let url = Url::parse("https://content.dropboxapi.com/2/files/upload")?;

//     let client = Client::new();

//     let body = Body::from(content);

//     let mut headers = reqwest::header::HeaderMap::new();
//     headers.insert(
//         reqwest::header::AUTHORIZATION,
//         format!("Bearer {}", access_token).parse()?,
//     );
//     headers.insert(
//         "Dropbox-API-Arg",
//         serde_json::json!({
//             "autorename": false,
//             "mode": "add",
//             "mute": false,
//             "path": dropbox_path,
//             "strict_conflict": false
//         })
//         .to_string()
//         .parse()?,
//     );
//     headers.insert(
//         reqwest::header::CONTENT_TYPE,
//         reqwest::header::HeaderValue::from_static("application/octet-stream"),
//     );

//     let req = client.post(url).headers(headers).body(body);

//     let res = req.send().await?;

//     res.error_for_status()?;

//     Ok(())
// }
