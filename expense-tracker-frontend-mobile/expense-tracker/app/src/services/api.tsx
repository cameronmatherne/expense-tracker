import { Balance, Transaction } from "../types";

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

  // 2. Build request body
  const body = {
    amount,
    date,
    bucket_id,
  };

  // 3. Send to your API
  const response = await fetch(`${API_URL}/add_transaction`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  // 4. Handle network errors
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Failed to insert transaction: " + errorText);
  }

  // 5. Parse JSON from server
  const json = await response.json();

  // 6. Return the created transaction
  return json.transaction as Transaction;
};