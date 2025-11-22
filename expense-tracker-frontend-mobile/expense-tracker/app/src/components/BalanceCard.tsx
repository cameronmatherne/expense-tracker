import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Balance } from "../types";

type Props = {
  balance: Balance;
};

export default function BalanceCard({ balance }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.balance}>Balance: ${balance.amount.toFixed(2)}</Text>
      <Text style={styles.leftToSpend}>Left to spend: ${balance.amount.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginBottom: 20 },
  balance: { fontSize: 36, marginBottom: 10 },
  leftToSpend: { fontSize: 18 },
});
