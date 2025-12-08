import React from "react";
import { FlatList, View, Text, Pressable, StyleSheet } from "react-native";
import { Purchase } from "../types";
import { formatMoney } from "../services/util";

type Props = {
  purchases: Purchase[];
  deletePurchase: (id: number) => void;
};

export default function PurchaseList({ purchases , deletePurchase }: Props) {
  return (
    <View style={styles.container}> 
      <FlatList
        data={purchases}
        showsVerticalScrollIndicator={true}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listings}>
            <Text>
              {new Date(item.date).toLocaleDateString('en-US', { 
                month: '2-digit', 
                day: '2-digit' 
              })}
            </Text>
            <Text style={styles.amount}> {formatMoney(Number(item.amount))}</Text>
            <Text style={styles.description}> {item.description}</Text>
            <View style={styles.buttonStack}> 
              <Pressable 
                style={styles.deleteButton} 
                onPress={() => deletePurchase(item.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  amount: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    paddingHorizontal: 20,
  },
  description: {
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4, 

  },
  deleteButton: {
    borderRadius: 12,
    color: "red",
    marginLeft: "auto",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "red", 
  },
  deleteText: {
    color: "red",
  },
  buttonStack: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  editButton: {
    borderRadius: 12,
    color: "grey",
    marginLeft: "auto",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "grey", 
  },
  editText: {
    color: "grey",
  },
  listings: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap", // allow items to go to next line
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  }
});


