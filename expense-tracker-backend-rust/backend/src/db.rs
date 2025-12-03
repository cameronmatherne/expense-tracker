use sqlx::{PgPool, query};
use std::env;
use dotenvy::dotenv;
use crate::models::*;
use rust_decimal::Decimal;
use rust_decimal_macros::dec;
use crate::models::{Transaction, Bucket, Balance, UpdateBalance, UpdateBucket, 
    UpdateTransaction, CreateBalance, CreateBucket, CreateTransaction, CreateExpense, Expense};



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
    limit: &Decimal,
    current: &Decimal,
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
    limit: Option<Decimal>,
    current: Option<Decimal>,
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
    amount: &Decimal,
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

pub async fn db_create_expense(
    amount: &Decimal,
    due_date: &NaiveDateTime,
    type: &String,
) -> Result<(), sqlx::Error> {
    let pool = create_pool().await;

    let row = query!(
        "INSERT INTO expenses (amount, due_date, type) VALUES ($1, $2, $3)",
        amount,
        due_date,
        type    
    )
    .execute(&pool)
    .await?;

    Ok(())
}

pub async fn db_modify_transaction(
    id: &i32,
    amount: Option<Decimal>,
    bucket_id: Option<i32>,
) -> Result<(), sqlx::Error> {
    let pool = create_pool().await;

    // let amount = Decimal::from_str(&amount_string)?;

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

pub async fn db_delete_expense(
    id: &i32,
) -> Result<(), sqlx::Error> {
    let pool = create_pool().await;

    let query = query!("DELETE FROM expenses WHERE id = $1", id)
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

pub async fn db_calculate_spent() -> Result<Decimal, sqlx::Error> {
    let pool = create_pool().await;

    let row = query!(
        r#"
        SELECT SUM(amount) as total_amount
        FROM transaction 
        "#
    )
    .fetch_one(&pool)
    .await?;

    let total_amount = row.total_amount.unwrap_or(dec!(0.0));

    Ok(total_amount)
}

pub async fn db_create_balance(
    amount: &Decimal,
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
    amount: Option<Decimal>,
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

pub async fn db_calculate_budget() -> Result<(), sqlx::Error> {

    let mut income: Decimal = dec!(2120.00);

    let mut personal: Decimal = dec!(2120.00) * dec!(0.25);
    println! ("income bucketed for personal spending: {} ", personal);
    let mut savings: Decimal = dec!(2120.00) * dec!(0.25);
    println! ("income bucketed for savings: {}", savings);
    let mut bills: Decimal = dec!(2120.00) * dec!(0.50);
    println! ("income budgeted for bills: {} ", bills);

    let transactions = db_get_transactions().await?;
    let balance = db_get_balance().await?;
    println!("current balance: {:?} ", balance);
    let mut total_spent: Decimal = transactions.iter().map(|item| item.amount).sum();
    
    Ok(())
}