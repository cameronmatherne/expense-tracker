export type Balance = {
  id: number;
  amount: string;
  account_type: string;
  user_name: string;
};

export type Purchase = {
  id: number;
  amount: string;
  date: string;
  bucket_id: number;
  description: string;
}

export type Bucket = {
  id: number;
  name: string;
  limit_amount: number;
  curent_amount: number;
  created_at: string;
  updated_at: string;
}

export type FutureTransaction = {
  id: number;
  amount: string;
  due_date: string;
  expense_type: string;
  description: string;
}