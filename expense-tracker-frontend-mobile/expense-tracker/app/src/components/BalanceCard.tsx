import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Balance } from "../types";

type Props = {
  balance: Balance;
  spent: String | null;
  budget: String | null;
};


// export type Balance = {
//   id: number;
//   amount: number;
//   account_type: string;
//   user_name: string;
// };


export default function BalanceCard({ balance, spent, budget }: Props) {
  const budgetNum = budget ? Number(budget) : 0;
  const spentNum = spent ? Number(spent) : 0;
  
  return (
    <View style={styles.container}>
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.balance}>Balance: ${balance.amount}</Text>
      <View style={styles.subContainer}>
        <Text style={styles.leftToSpend}>
          Budget Remaining: <Text style={{ color: (budgetNum - spentNum) < 0 ? "red" : "green" }}>${(budgetNum - spentNum).toFixed(2)}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: { 
    width: 125, 
    height: 125, 
    marginTop: 40,
    marginBottom: -15,
  },
  container: { 
    flex: 1,
    alignItems: "center", 
  },
  subContainer: {
    flexDirection: "row",
    marginLeft: 20, 
    gap: 10,
  },
  balance: { 
    fontSize: 26, 
    marginBottom: 5 
  },
  leftToSpend: { 
    fontSize: 18,
  },
  totalSpent: { 
    fontSize: 18, 
    color: "red",
  },
});
