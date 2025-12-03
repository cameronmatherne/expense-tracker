import { Balance, Expense, Transaction } from "../types";

const API_URL = 'http://192.168.0.206:3000';

export const getBalance = async (): Promise<Balance | null> => {
  try {
    const response = await fetch(`${API_URL}/get_balance`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching balance:", error);
    return null;
  }
};

export const getSpent = async (): Promise<String | null> => {
  try {
    const response = await fetch(`${API_URL}/calculate_spent`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching balance:", error);
    return null;
  }
};

export const getTransactions = async (): Promise<Transaction[] | null> => {
  try {
    const response = await fetch(`${API_URL}/get_transactions`);
    const json = await response.json();
    return json.transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return null;
  }
};

export const getExpenses = async (): Promise<Expense[] | null> => {
  try {
    const response = await fetch(`${API_URL}/get_expenses`);
    const json = await response.json();
    return json.transactions;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return null;
  }
};

export const updateBalance = async (id: number, amount: number, account_type: string, user_name: string): Promise<String> => {
  if (!amount || amount === 0) {
    throw new Error("Amount must be greater than zero");
  }
  
  const body = {
    amount,
    account_type,
    user_name,
  };

  const response = await fetch(`${API_URL}/update_balance/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  
  if (!response.ok) { 
    const errorText = await response.text();
    console.error("Balance update failed:", {
      status: response.status,
      statusText: response.statusText,
      errorBody: errorText
    });
    throw new Error(`Failed to update balance (${response.status}): ${errorText}`);
  }
  console.log("Response from balance update:", await response.clone().json());
  const json = await response.json();
  return json.message as String;
};


export const insertTransaction = async (
  amount: number,
  date: string,
  bucket_id: number
  ): Promise<Transaction> => {
  
  if (!amount || amount === 0) {
    throw new Error("Amount must be greater than zero");
  }

  if (!date) {
    throw new Error("Date is required");
  }

  if (!bucket_id) {
    throw new Error("Bucket ID is required");
  }

  const body = {
    amount: amount,
    date,
    bucket_id,
  };

  const response = await fetch(`${API_URL}/create_transaction`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Transaction insertion failed:", {
      status: response.status,
      statusText: response.statusText,
      errorBody: errorText
    });
    throw new Error(`Failed to insert transaction (${response.status}): ${errorText}`);
  }

  const json = await response.json();

  return json.transaction as Transaction;
};

export const insertExpense = async (
  amount: number,
  due_date: string,
  type: string
  ): Promise<Expense> => {
  
  if (!amount || amount === 0) {
    throw new Error("Amount must be greater than zero");
  }

  const body = {
    amount: amount,
    due_date,
    type,
  };

  const response = await fetch(`${API_URL}/create_expense`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Expense insertion failed:", {
      status: response.status,
      statusText: response.statusText,
      errorBody: errorText
    });
    throw new Error(`Failed to insert expense (${response.status}): ${errorText}`);
  }

  const json = await response.json();

  return json.expense as Expense;
};


export const deleteTransaction = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/delete_transaction/${id}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Transaction deletion failed:", {
      status: response.status,
      statusText: response.statusText,
      errorBody: errorText
    });
    throw new Error(`Failed to delete transaction (${response.status}): ${errorText}`);
  }
};