export type Balance = {
  id: number;
  amount: number;
  account_type: string;
  user_name: string;
};

export type Transaction = {
  id: number;
  amount: number;
  date: string;
  bucket_id: number;
}

export type Bucket = {
  id: number;
  name: string;
  limit_amount: number;
  curent_amount: number;
  created_at: string;
  updated_at: string;
}
