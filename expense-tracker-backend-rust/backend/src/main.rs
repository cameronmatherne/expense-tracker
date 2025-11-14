
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
        .route("/get_transactions", get(get_transactions))
        .route("/create_transaction", post(create_transaction))
        .route("/update_transaction/{id}", put(update_transaction))
        .route("/delete_transaction/{id}", delete(delete_transaction))
        .route("/get_balance", get(get_balance))
        .route("/create_balance", post(create_balance))
        .route("/update_balance{id}", put(update_balance))
        .route("/delete_balance/{id}", delete(delete_balance))
        
        ;

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();

}
