use crate::models::{Purchase, Bucket, Balance, UpdateBalance, UpdateBucket, 
    UpdatePurchase, CreateBalance, CreateBucket, CreatePurchase, CreateExpense, Expense};
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

pub async fn get_purchases() -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    match db_get_purchases().await {
        Ok(purchases) => Ok(Json(json!({
            "purchases": purchases
        }))),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "error": format!("Database error: {}", e)
            })),
        )),
    }
}

pub async fn get_expenses() -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    match db_get_expenses().await {
        Ok(expenses) => Ok(Json(json!({
            "expenses": expenses
        }))),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "error": format!("Database error: {}", e)
            })),
        )),
    }
}


pub async fn create_purchase(
    Json(payload): Json<CreatePurchase>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    match db_create_purchase(&payload.amount, &payload.date, &payload.bucket_id, &payload.description).await {
        Ok(_) => Ok((
            StatusCode::CREATED,
            Json(json!({
                "status": "success",
                "message": "Purchase created successfully"
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

pub async fn create_expense(
    Json(payload): Json<CreateForecastedTransaction>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    match db_create_expense(payload.amount, &payload.due_date, &payload.expense_type, &payload.description).await {
        Ok(_) => Ok((
            StatusCode::CREATED,
            Json(json!({
                "status": "success",
                "message": "Transaction created successfully"
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


pub async fn update_purchase(
    Path(id): Path<i32>, 
    Json(payload): Json<UpdatePurchase>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    
    match db_modify_purchase(&id, payload.amount, payload.bucket_id, &payload.description).await { 
        Ok(purchase) => Ok((
            StatusCode::CREATED, 
            Json(purchase))
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

pub async fn delete_purchase(
    Path(id): Path<i32>, 
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {

    match db_delete_purchase(&id).await { 
    Ok(_) => Ok((
        StatusCode::OK,
        Json(json!({
            "status": "success",
            "message": format!("Purchase with id {} deleted successfully", id)
        })),
    )),
    Err(e) => Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(json!({
            "status": "error",
            "message": format!("Error trying to delete purchase with id {}: {}", id, e)
        })),
    )),
    }
}

pub async fn delete_expense(
    Path(id): Path<i32>, 
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {

    match db_delete_expense(&id).await { 
    Ok(_) => Ok((
        StatusCode::OK,
        Json(json!({
            "status": "success",
            "message": format!("Expense with id {} deleted successfully", id)
        })),
    )),
    Err(e) => Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(json!({
            "status": "error",
            "message": format!("Error trying to delete expense with id {}: {}", id, e)
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

pub async fn calculate_spent() -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    match db_calculate_spent().await {
        Ok(amount) => Ok(Json(amount)),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "error": format!("Database error: {}", e)
            })),
        )),
    }
}

pub async fn calculate_forecast() -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    match db_calculate_forecast().await {
        Ok(amount) => Ok(Json(amount)),
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
        Ok(_) => Ok((
            StatusCode::CREATED, 
            Json(json!({
                "status": "success",
                "message": "Balance updated successfully",
            })))
        ),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "status": "error",
                "message": format!("Error updating balance: {}", e)
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

pub async fn calculate_budget() -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {

    match db_calculate_budget().await { 
    Ok(_) => Ok((
        StatusCode::OK,
        Json(json!({
            "status": "success",
            "message": format!("Budget successfully created")
        })),
    )),
    Err(e) => Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(json!({
            "status": "error",
            "message": format!("Error trying to calculate bduget: {}", e)
        })),
    )),
    }
}