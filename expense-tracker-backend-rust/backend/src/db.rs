use sqlx::{PgPool, query};
use std::env;
use sqlx::Error;
use dotenvy::dotenv;
use crate::models::*;
use rust_decimal::Decimal;

use rust_decimal_macros::dec;
use chrono::{NaiveDateTime, NaiveDate, Local, Datelike};
use crate::models::{Purchase, Bucket, Balance, UpdateBalance, UpdateBucket, 
    UpdatePurchase, CreateBalance, CreateBucket, CreatePurchase, CreateExpense, Expense, ForecastedTransaction};



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

pub async fn db_get_purchases() -> Result<Vec<Purchase>, sqlx::Error> {
    let pool = create_pool().await;

    let rows = query!(
        r#"
        SELECT id, amount, date, bucket_id, description
        FROM transaction 
        "#
    )
    .fetch_all(&pool)
    .await?;

    let purchases = rows
        .into_iter()
        .map(|r| Purchase {
            id: r.id,
            amount: r.amount,
            date: r.date,
            bucket_id: r.bucket_id,
            description: r.description,
        })
        .collect();

    Ok(purchases)
}

pub async fn db_get_expenses() -> Result<Vec<ForecastedTransaction>, sqlx::Error> {
    let pool = create_pool().await;

    let rows = query!(
        r#"
        SELECT id, amount, due_date, expense_type, description
        FROM expenses 
        "#
    )
    .fetch_all(&pool)
    .await?;

    let expenses = rows
        .into_iter()
        .map(|r| ForecastedTransaction {
            id: r.id,
            amount: r.amount,
            due_date: r.due_date.to_string(),
            expense_type: r.expense_type,
            description: r.description,
        })
        .collect();

    Ok(expenses)
}

pub async fn db_create_purchase(
    amount: &Decimal,
    date: &str,  
    bucket_id: &i32,
    description: &String,
) -> Result<(), sqlx::Error> {
    let pool = create_pool().await;

    let dt = NaiveDateTime::parse_from_str(date, "%Y-%m-%d %H:%M:%S")
        .map_err(|e| sqlx::Error::Protocol(format!("Invalid date format: {}", e).into()))?;

    query!(
        "INSERT INTO transaction (amount, date, bucket_id, description) VALUES ($1, $2, $3, $4)",
        amount,
        dt,
        bucket_id,
        description
    )
    .execute(&pool)
    .await?;

    Ok(())
}


pub async fn db_create_expense(
    amount: Decimal,
    due_date: &String,
    expense_type: &String,
    description: &String,
) -> Result<(), sqlx::Error> {
    let pool = create_pool().await;

    let mut amount = amount;

    let parts: Vec<u32> = due_date
        .split('/')
        .map(|x| x.parse().unwrap())
        .collect();

    let year = Local::now().year();

    let date = NaiveDate::from_ymd_opt(year, parts[0], parts[1]).unwrap();
    let datetime = date.and_hms_opt(0, 0, 0).unwrap();

    if expense_type == "Withdrawal" {
        amount = -amount;
    } 

    let row = query!(
        "INSERT INTO expenses (amount, due_date, expense_type, description) VALUES ($1, $2, $3, $4)",
        amount,
        datetime,
        expense_type,
        description    
    )
    .execute(&pool)
    .await?;

    Ok(())
}

pub async fn db_modify_purchase(
    id: &i32,
    amount: Option<Decimal>,
    bucket_id: Option<i32>,
    description: &Option<String>
) -> Result<(), sqlx::Error> {
    let pool = create_pool().await;

    // let amount = Decimal::from_str(&amount_string)?;

    let row = query!(
        "UPDATE transaction SET amount = $1, bucket_id = $2, description = $3 WHERE id = $4",
        amount,
        bucket_id,
        description.as_deref().unwrap_or(""), // converts &Option<String> -> &str
        id
    )
    .execute(&pool)
    .await?;

    Ok(())
}

pub async fn db_delete_purchase(
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

pub async fn db_calculate_forecast() -> Result<Decimal, sqlx::Error> {
    let pool = create_pool().await;

    let row = query!(
        r#"
        SELECT SUM(amount) as total_amount
        FROM expenses 
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

    let purchases = db_get_purchases().await?;
    let balance = db_get_balance().await?;
    println!("current balance: {:?} ", balance);
    let mut total_spent: Decimal = purchases.iter().map(|item| item.amount).sum();
    
    Ok(())
}

fn convert_mmdd_to_naive_datetime(md: &str) -> Result<NaiveDateTime, Error> {
    let parts: Vec<&str> = md.split('/').collect();
    if parts.len() != 2 {
        return Err(Error::Protocol(format!("Invalid date format: {}", md).into()));
    }

    let month: u32 = parts[0]
        .parse()
        .map_err(|_| Error::Protocol("Invalid month".into()))?;

    let day: u32 = parts[1]
        .parse()
        .map_err(|_| Error::Protocol("Invalid day".into()))?;

    let date = NaiveDate::from_ymd_opt(2000, month, day)
        .ok_or_else(|| Error::Protocol("Invalid month/day combination".into()))?;

    Ok(date.and_hms_opt(0, 0, 0).unwrap())
}