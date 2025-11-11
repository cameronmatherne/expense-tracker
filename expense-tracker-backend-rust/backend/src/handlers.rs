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

// pub async fn get_transactions() -> Result<Vec<Transaction>, sqlx::Error> {
//     let pool = create_pool().await;

//     let rows = query!(
//         "SELECT id, amount, date, type, payment_method FROM transaction"
//     )
//     .fetch_all(&pool)
//     .await?;

//     let transactions = rows
//         .into_iter()
//         .map(|row| Transaction {
//             id: row.id,
//             amount: row.amount,
//             date: row.date,
//             type: row.type,
//             payment_method: row.payment_method
//          })
//          .collect();
// }

// pub struct Bucket {
//     pub id: i32,
//     pub name: String,
//     pub limit_amount: f64,
//     pub current_amount: f64,
//     pub period: String,
//     pub created_at: String,
//     pub updated_at: String,
// }
