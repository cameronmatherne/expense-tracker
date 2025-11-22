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
