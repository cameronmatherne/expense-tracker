import React from "react";
import { FlatList, View, Text } from "react-native";
import { Transaction } from "../types";

type Props = {
  transactions: Transaction[];
};

export default function TransactionList({ transactions }: Props) {
  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ paddingVertical: 8, flexDirection: "row" }}>
          <Text>Date: {new Date(item.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}</Text>
          <Text style={{ paddingHorizontal: 8 }}>Amount: ${item.amount}</Text>
          <Text style={{ paddingHorizontal: 8 }}>Category: {item.bucket_id}</Text>
        </View>
      )}
    />
  );
}
