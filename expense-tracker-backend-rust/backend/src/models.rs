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
pub struct Transaction {
    pub id: i32,
    pub amount: Decimal,
    pub date: NaiveDateTime,
    pub bucket_id: i32, // foreign key → bucket.id
}

// #[derive(sqlx::FromRow, Serialize, Deserialize, Debug, Clone)]
// pub struct Expense {
//     pub id: i32,
//     pub amount: Decimal,
//     pub date: NaiveDateTime,
// }

#[derive(sqlx::FromRow, Serialize, Deserialize, Debug, Clone)]
pub struct ForecastedTransaction {
    pub id: i32,
    pub amount: Decimal,
    pub due_date: NaiveDateTime,
    // either deposit or withdrawal 
    pub type: String, 
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
pub struct CreateTransaction {
    pub amount: Decimal,
    pub bucket_id: i32,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateExpense {
    pub amount: Decimal,
    pub due_date: NaiveDateTime,
    pub type: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateBalance {
    pub amount: Decimal,
    pub account_type: String,
    pub user_name: String,
}

#[derive (Serialize, Deserialize, Debug)]
pub struct UpdateTransaction {
    pub amount: Option<Decimal>,
    pub bucket_id: Option<i32>,
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