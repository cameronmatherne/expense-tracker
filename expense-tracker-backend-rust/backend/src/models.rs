use serde::{Serialize, Deserialize};
use chrono::NaiveDateTime;

#[derive(sqlx::FromRow, Serialize, Deserialize, Debug, Clone)]
pub struct Bucket {
    pub id: i32,
    pub name: String,
    pub limit_amount: f64,
    pub current_amount: f64,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(sqlx::FromRow, Serialize, Deserialize, Debug, Clone)]
pub struct Transaction {
    pub id: i32,
    pub amount: f64,
    pub date: NaiveDateTime,
    pub bucket_id: i32, // foreign key → bucket.id
}

#[derive(sqlx::FromRow, Serialize, Deserialize, Debug, Clone)]
pub struct Balance {
    pub id: i32,
    pub amount: f64,
    pub account_type: String,
    pub user_name: String,
}


#[derive (Serialize, Deserialize, Debug)]
pub struct CreateBucket {
    pub name: String,
    pub limit_amount: f64,
    pub current_amount: f64,
}

#[derive (Serialize, Deserialize, Debug)]
pub struct NewTransaction {
    pub amount: f64,
    pub transaction_type: String,
    pub payment_method: String,
    pub expense_category: Option<String>,
}

#[derive (Serialize, Deserialize, Debug)]
pub struct UpdateTransaction {
    pub amount: Option<f64>,
    pub transaction_type: Option<String>,
    pub payment_method: Option<String>,
    pub expense_category: Option<String>,
}

#[derive (Serialize, Deserialize, Debug)]
pub struct UpdateBucket {
    pub name: Option<String>,
    pub limit_amount: Option<f64>,
    pub current_amount: Option<f64>,
}