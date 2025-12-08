import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Balance } from "../types";
import { formatMoney } from "../services/util";

type Props = {
  balance: Balance;
  spent: string | null;
  budget: string | null;
  forecasted: string | null;
};


// export type Balance = {
//   id: number;
//   amount: number;
//   account_type: string;
//   user_name: string;
// };


export default function BalanceCard({ balance, spent, budget, forecasted }: Props) {
  const budgetNum = budget ? Number(budget) : 0;
  const spentNum = spent ? Number(spent) : 0;
  const balanceNum = balance ? Number(balance) : 0;
  return (
    <View style={styles.container}>
      <Text style={styles.balanceText}>Account Balance: ${balance.amount}</Text>
      <Text style={styles.balanceText}>
        Projected Balance:  
          <Text style={{ color: (balanceNum + spentNum) < 0 ? "red" : "green" }}> {formatMoney(Number(balance.amount) + Number(forecasted))}
          </Text>
      </Text>
      <Text style={styles.balanceText}>
        Spending: <Text style={{ color: (budgetNum - spentNum) < 0 ? "red" : "green" }}>${(budgetNum - spentNum).toFixed(2)} 
          <Text style={{color: "black"}}> / ${budget} </Text>
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    alignItems: "flex-start", 
    textAlign: "left",
    justifyContent: "center",
  },
  subContainer: {
    flexDirection: "row",
    marginLeft: 20, 
    gap: 10,
  },
  balanceText: { 
    fontSize: 18,
    marginBottom: 5 
  },
  totalSpent: { 
    fontSize: 18, 
    color: "red",
  },
});
