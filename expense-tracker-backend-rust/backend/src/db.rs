use sqlx::{PgPool, query};
use std::env;
use dotenvy::dotenv;
use crate::models::*;

pub async fn create_pool() -> PgPool {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    PgPool::connect(&database_url)
        .await
        .expect("Error creating pool")
}

pub async fn db_get_buckets() -> Result<Vec<Bucket>, sqlx::Error> {
    let pool = create_pool().await;

    let rows = query!(
        r#"
        SELECT id, name, limit_amount, current_amount, created_at, updated_at
        FROM bucket 
        "#
    )
    .fetch_all(&pool)
    .await?;

    let buckets = rows
        .into_iter()
        .map(|r| Bucket {
            id: r.id,
            name: r.name,
            limit_amount: r.limit_amount,
            current_amount: r.current_amount,
            created_at: r.created_at,
            updated_at: r.updated_at,
        })
        .collect();

    Ok(buckets)
}

pub async fn db_create_bucket(
    name: &String,
    limit: &f64,
    current: &f64,
) -> Result<(), sqlx::Error> {
    let pool = create_pool().await;

    let row = query!(
        "INSERT INTO bucket (name, limit_amount, current_amount) VALUES ($1, $2, $3)",
        name,
        limit,
        current
    )
    .execute(&pool)
    .await?;

    Ok(())
}

pub async fn db_modify_bucket(
    id: &i32,
    name: Option<String>,
    limit: Option<f64>,
    current: Option<f64>,
) -> Result<(), sqlx::Error> {
    let pool = create_pool().await;

    let row = query!(
        "UPDATE bucket SET name = $1, limit_amount = $2, current_amount = $3 WHERE id = $4",
        name,
        limit,
        current,
        id
    )
    .execute(&pool)
    .await?;

    Ok(())
}

pub async fn db_delete_bucket(
    id: &i32,
) -> Result<(), sqlx::Error> {
    let pool = create_pool().await;

    let query = query!("DELETE FROM bucket WHERE id = $1", id)
    .execute(&pool)
    .await?;

    Ok(())
}

pub async fn db_get_transactions() -> Result<Vec<Transaction>, sqlx::Error> {
    let pool = create_pool().await;

    let rows = query!(
        r#"
        SELECT id, amount, date, bucket_id
        FROM transaction 
        "#
    )
    .fetch_all(&pool)
    .await?;

    let transactions = rows
        .into_iter()
        .map(|r| Transaction {
            id: r.id,
            amount: r.amount,
            date: r.date,
            bucket_id: r.bucket_id,
        })
        .collect();

    Ok(transactions)
}

pub async fn db_create_transaction(
    amount: &f64,
    bucket_id: &i32,
) -> Result<(), sqlx::Error> {
    let pool = create_pool().await;

    let row = query!(
        "INSERT INTO transaction (amount, bucket_id) VALUES ($1, $2)",
        amount,
        bucket_id
    )
    .execute(&pool)
    .await?;

    Ok(())
}

pub async fn db_modify_transaction(
    id: &i32,
    amount: Option<f64>,
    bucket_id: Option<i32>,
) -> Result<(), sqlx::Error> {
    let pool = create_pool().await;

    let row = query!(
        "UPDATE transaction SET amount = $1, bucket_id = $2 WHERE id = $3",
        amount,
        bucket_id,
        id
    )
    .execute(&pool)
    .await?;

    Ok(())
}

pub async fn db_delete_transaction(
    id: &i32,
) -> Result<(), sqlx::Error> {
    let pool = create_pool().await;

    let query = query!("DELETE FROM transaction WHERE id = $1", id)
    .execute(&pool)
    .await?;

    Ok(())
}

pub async fn db_get_balance() -> Result<Balance, sqlx::Error> {
    let pool = create_pool().await;

    let row = query!(
        r#"
        SELECT id, amount, account_type, user_name
        FROM balance 
        "#
    )
    .fetch_one(&pool)
    .await?;

    let balance = Balance {
        id: row.id,
        amount: row.amount,
        account_type: row.account_type,
        user_name: row.user_name,
    };

    Ok(balance)
}

pub async fn db_create_balance(
    amount: &f64,
    account_type: &String,
    user_name: &String,
) -> Result<(), sqlx::Error> {
    let pool = create_pool().await;

    let row = query!(
        "INSERT INTO balance (amount, account_type, user_name) VALUES ($1, $2, $3)",
        amount,
        account_type,
        user_name
    )
    .execute(&pool)
    .await?;

    Ok(())
}

pub async fn db_modify_balance(
    id: &i32,
    amount: Option<f64>,
    account_type: Option<String>,
    user_name: Option<String>,
) -> Result<(), sqlx::Error> {
    let pool = create_pool().await;

    let row = query!(
        "UPDATE balance SET amount = $1, account_type = $2, user_name = $3 WHERE id = $4",
        amount,
        account_type,
        user_name,
        id
    )
    .execute(&pool)
    .await?;

    Ok(())
}

pub async fn db_delete_balance(
    id: &i32,
) -> Result<(), sqlx::Error> {
    let pool = create_pool().await;

    let query = query!("DELETE FROM balance WHERE id = $1", id)
    .execute(&pool)
    .await?;

    Ok(())
}

// pub async fn calculate_budget() -> Result<(), sqlx::Error> {

//     let transactions = db_get_transactions().await?;
//     let mut total_spent: f64 = 0.00;

//     for i in &transactions {
//         total_spent += transactions[i].amount; 

//     }

//     Ok(StatusCode::OK)

// }