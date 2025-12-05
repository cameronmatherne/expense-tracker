import { Balance, FutureTransaction, Purchase } from "../types";

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

export const getSpent = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_URL}/calculate_spent`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching balance:", error);
    return null;
  }
};

export const getForecast = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_URL}/calculate_forecast`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching forecasted balance:", error);
    return null;
  }
};

export const getPurchases = async (): Promise<Purchase[] | null> => {
  try {
    const response = await fetch(`${API_URL}/get_purchases`);

    const json = await response.json();
    return json.purchases;
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return null;
  }
};

export const getExpenses = async (): Promise<FutureTransaction[] | null> => {
  try {
    const response = await fetch(`${API_URL}/get_expenses`);
    const json = await response.json();
    return json.expenses;
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
  return json.message as string;
};



export const insertPurchase = async (
  amount: number,
  date: string,
  bucket_id: number,
  description: string
): Promise<Purchase> => {
  
  if (!amount || amount === 0) {
    throw new Error("Amount must be greater than zero");
  }

  if (!date) {
    throw new Error("Date is required");
  }

  if (!bucket_id) {
    throw new Error("Bucket ID is required");
  }

  const formattedDate = formatDateForBackend(date);

  const body = {
    amount,
    date: `${formattedDate} 00:00:00`, 
    bucket_id,
    description
  };

  const response = await fetch(`${API_URL}/create_purchase`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Purchase insertion failed:", {
      status: response.status,
      statusText: response.statusText,
      errorBody: errorText
    });
    throw new Error(`Failed to insert Purchase (${response.status}): ${errorText}`);
  }

  const json = await response.json();
  return json.purchase as Purchase;
};

export const insertExpense = async (
  amount: number,
  due_date: string,
  expense_type: string,
  description: string
  ): Promise<FutureTransaction> => {
  
  if (!amount || amount === 0) {
    throw new Error("Amount must be greater than zero");
  }

  const body = {
    amount: amount,
    due_date,
    expense_type,
    description,
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

  return json.expense as FutureTransaction;
};


export const deletePurchase = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/delete_purchase/${id}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Purchase deletion failed:", {
      status: response.status,
      statusText: response.statusText,
      errorBody: errorText
    });
    throw new Error(`Failed to delete purchase (${response.status}): ${errorText}`);
  }
};

export const deleteForecasted = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/delete_expense/${id}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Purchase deletion failed:", {
      status: response.status,
      statusText: response.statusText,
      errorBody: errorText
    });
    throw new Error(`Failed to delete expense (${response.status}): ${errorText}`);
  }
};

function addYear(md: string, year: number = 2000): string {
  const [month, day] = md.split("/");

  const mm = month.padStart(2, "0");
  const dd = day.padStart(2, "0");

  return `${year}-${mm}-${dd} 00:00:00`;
}


function formatDateForBackend(dateStr: string): string {
  // Already in YYYY-MM-DD
  if (dateStr.includes("-")) {
    return dateStr; // just return YYYY-MM-DD
  }

  // MM/DD format
  const parts = dateStr.split("/");
  if (parts.length !== 2) throw new Error(`Invalid date format: ${dateStr}`);

  const [month, day] = parts;
  if (!month || !day) throw new Error(`Invalid month/day in date: ${dateStr}`);

  const mm = month.padStart(2, "0");
  const dd = day.padStart(2, "0");
  const year = 2000; // default if backend expects

  return `${year}-${mm}-${dd}`;
}
