
mod db;
mod handlers;
mod models;
use dotenvy::dotenv;
use postgres::{Client, NoTls, Error};
use std::env;
use sqlx::postgres::PgPoolOptions;
use crate::handlers::*;
use tower_http::cors::{CorsLayer, Any};
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


    // let cors = CorsLayer::new()
    //     .allow_origin(Any)
    //     .allow_methods(Any)
    //     .allow_headers(Any);

    let cors = CorsLayer::permissive(); 

    let app = Router::new()
        .route("/get_buckets", get(get_buckets))
        .route("/create_bucket", post(create_bucket))
        .route("/delete_bucket/{id}", delete(delete_bucket))
        .route("/update_bucket/{id}", put(update_bucket))
        .route("/get_purchases", get(get_purchases))
        .route("/create_purchase", post(create_purchase))
        .route("/update_purchase/{id}", put(update_purchase))
        .route("/delete_purchase/{id}", delete(delete_purchase))
        .route("/get_balance", get(get_balance))
        .route("/calculate_spent", get(calculate_spent))
        .route("/calculate_forecast", get(calculate_forecast))
        .route("/create_balance", post(create_balance))
        .route("/update_balance/{id}", put(update_balance))
        .route("/delete_balance/{id}", delete(delete_balance))
        .route("/calculate_budget", get(calculate_budget))
        .route("/create_expense", post(create_expense))
        .route("/delete_expense/{id}", delete(delete_expense))
        .route("/get_expenses", get(get_expenses))
        .layer(cors);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();

}
