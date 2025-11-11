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
