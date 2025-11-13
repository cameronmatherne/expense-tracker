
mod db;
mod handlers;
mod models;
use dotenvy::dotenv;
use postgres::{Client, NoTls, Error};
use std::env;
use sqlx::postgres::PgPoolOptions;
use crate::handlers::*;
use axum::{
    routing::{get, post, put, delete},
    Router,
    extract::{Json, Path},
    response::{IntoResponse, Response},
    http::StatusCode,
};

#[tokio::main]
async fn main() {
    // Load environment variables from .env file
    dotenv().ok();  

    let app = Router::new()
        .route("/get_buckets", get(get_buckets))
        .route("/create_bucket", post(create_bucket))
        .route("/delete_bucket/{id}", delete(delete_bucket))
        .route("/update_bucket/{id}", put(update_bucket))
        .route("/create_transaction", post(create_transaction));

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();

}
