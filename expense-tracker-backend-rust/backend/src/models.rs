use serde::{Serialize, Deserialize};
use chrono::NaiveDateTime;
use rust_decimal::Decimal;

#[derive(sqlx::FromRow, Serialize, Deserialize, Debug, Clone)]
pub struct Bucket {
    pub id: i32,
    pub name: String,
    pub limit_amount: Decimal,
    pub current_amount: Decimal,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(sqlx::FromRow, Serialize, Deserialize, Debug, Clone)]
pub struct Purchase {
    pub id: i32,
    pub amount: Decimal,
    pub date: NaiveDateTime,
    pub bucket_id: i32, // foreign key → bucket.id
    pub description: Option<String>,
}

#[derive(sqlx::FromRow, Serialize, Deserialize, Debug, Clone)]
pub struct Expense {
    pub id: i32,
    pub amount: Decimal,
    pub due_date: String,
    pub expense_type: String,
}

#[derive(sqlx::FromRow, Serialize, Deserialize, Debug, Clone)]
pub struct ForecastedTransaction {
    pub id: i32,
    pub amount: Decimal,
    pub due_date: String,
    pub expense_type: String, 
    pub description: Option<String>,
}

#[derive(sqlx::FromRow, Serialize, Deserialize, Debug, Clone)]
pub struct CreateForecastedTransaction {
    pub amount: Decimal,
    pub due_date: String,
    pub expense_type: String, 
    pub description: String,
}


#[derive(sqlx::FromRow, Serialize, Deserialize, Debug, Clone)]
pub struct Balance {
    pub id: i32,
    pub amount: Decimal,
    pub account_type: String,
    pub user_name: String,
}


#[derive (Serialize, Deserialize, Debug)]
pub struct CreateBucket {
    pub name: String,
    pub limit_amount: Decimal,
    pub current_amount: Decimal,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreatePurchase {
    pub amount: Decimal,
    pub date: String,
    pub bucket_id: i32,
    pub description: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateExpense {
    pub amount: Decimal,
    pub due_date: String,
    pub expense_type: String,
    pub description: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateBalance {
    pub amount: Decimal,
    pub account_type: String,
    pub user_name: String,
}

#[derive (Serialize, Deserialize, Debug)]
pub struct UpdatePurchase {
    pub amount: Option<Decimal>,
    pub date: Option<String>,
    pub bucket_id: Option<i32>,
    pub description: Option<String>,
}

#[derive (Serialize, Deserialize, Debug)]
pub struct UpdateBalance {
    pub amount: Option<Decimal>,
    pub account_type: Option<String>,
    pub user_name: Option<String>,
}

#[derive (Serialize, Deserialize, Debug)]
pub struct UpdateBucket {
    pub name: Option<String>,
    pub limit_amount: Option<Decimal>,
    pub current_amount: Option<Decimal>,
}