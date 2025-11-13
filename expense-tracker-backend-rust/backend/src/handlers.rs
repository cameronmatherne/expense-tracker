use crate::models::{Transaction, Bucket, Balance};
use crate::db::*;
use sqlx::query;
use serde_json::json;
use axum::{
    response::{IntoResponse, Response},
    http::StatusCode,
    Json,
    extract::Path,
};
use serde::Serialize;
use crate::models::*;

pub async fn migrate_database() -> Result<(), sqlx::Error> {
    let pool = create_pool().await;

    println! ("calling migration");
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await?;

    Ok(())
}

pub async fn get_buckets() -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    match db_get_buckets().await {
        Ok(buckets) => Ok(Json(buckets)),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "error": format!("Database error: {}", e)
            })),
        )),
    }
}

pub async fn create_bucket(
    Json(payload): Json<CreateBucket>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    match db_create_bucket(&payload.name, &payload.limit_amount, &payload.current_amount).await {
        Ok(_) => Ok((
            StatusCode::CREATED,
            Json(json!({
                "status": "success",
                "message": "Bucket created successfully"
            })),
        )),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "status": "error",
                "message": format!("Database error: {}", e)
            })),
        )),
    }
}

pub async fn update_bucket(
    Path(id): Path<i32>, 
    Json(payload): Json<UpdateBucket>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    
    match db_modify_bucket(&id, payload.name, payload.limit_amount, payload.current_amount).await { 
        Ok(bucket) => Ok((
            StatusCode::CREATED, 
            Json(bucket))
        ),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "status": "error",
                "message": format!("Error updating bucket: {}", e)
            })),
        )),
    }
}

pub async fn delete_bucket(
    Path(id): Path<i32>, 
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {

    match db_delete_bucket(&id).await { 
    Ok(_) => Ok((
        StatusCode::OK,
        Json(json!({
            "status": "success",
            "message": format!("Bucket with id {} deleted successfully", id)
        })),
    )),
    Err(e) => Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(json!({
            "status": "error",
            "message": format!("Error trying to delete bucket with id {}: {}", id, e)
        })),
    )),
    }
}

pub async fn get_transactions() -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    match db_get_transactions().await {
        Ok(transactions) => Ok(Json(transactions)),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "error": format!("Database error: {}", e)
            })),
        )),
    }
}

pub async fn create_transaction(
    Json(payload): Json<CreateTransaction>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    match db_create_transaction(&payload.amount, &payload.bucket_id).await {
        Ok(_) => Ok((
            StatusCode::CREATED,
            Json(json!({
                "status": "success",
                "message": "Bucket created successfully"
            })),
        )),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "status": "error",
                "message": format!("Database error: {}", e)
            })),
        )),
    }
}

pub async fn update_transaction(
    Path(id): Path<i32>, 
    Json(payload): Json<UpdateTransaction>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    
    match db_modify_transaction(&id, payload.amount, payload.bucket_id).await { 
        Ok(transaction) => Ok((
            StatusCode::CREATED, 
            Json(transaction))
        ),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "status": "error",
                "message": format!("Error updating transaction: {}", e)
            })),
        )),
    }
}

pub async fn delete_transaction(
    Path(id): Path<i32>, 
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {

    match db_delete_transaction(&id).await { 
    Ok(_) => Ok((
        StatusCode::OK,
        Json(json!({
            "status": "success",
            "message": format!("Transaction with id {} deleted successfully", id)
        })),
    )),
    Err(e) => Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(json!({
            "status": "error",
            "message": format!("Error trying to delete transaction with id {}: {}", id, e)
        })),
    )),
    }
}

pub async fn get_balance() -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    match db_get_balance().await {
        Ok(balance) => Ok(Json(balance)),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "error": format!("Database error: {}", e)
            })),
        )),
    }
}

pub async fn create_balance(
    Json(payload): Json<CreateBalance>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    match db_create_balance(&payload.amount, &payload.account_type, &payload.user_name).await {
        Ok(_) => Ok((
            StatusCode::CREATED,
            Json(json!({
                "status": "success",
                "message": "Balance initialized successfully"
            })),
        )),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "status": "error",
                "message": format!("Database error: {}", e)
            })),
        )),
    }
}

pub async fn update_balance(
    Path(id): Path<i32>, 
    Json(payload): Json<UpdateBalance>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    
    match db_modify_balance(&id, payload.amount, payload.account_type, payload.user_name).await { 
        Ok(balance) => Ok((
            StatusCode::CREATED, 
            Json(balance))
        ),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "status": "error",
                "message": format!("Error updating transaction: {}", e)
            })),
        )),
    }
}

pub async fn delete_balance(
    Path(id): Path<i32>, 
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {

    match db_delete_balance(&id).await { 
    Ok(_) => Ok((
        StatusCode::OK,
        Json(json!({
            "status": "success",
            "message": format!("Balance successfully cleared: {}", id)
        })),
    )),
    Err(e) => Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(json!({
            "status": "error",
            "message": format!("Error trying to delete balance with id {}: {}", id, e)
        })),
    )),
    }
}