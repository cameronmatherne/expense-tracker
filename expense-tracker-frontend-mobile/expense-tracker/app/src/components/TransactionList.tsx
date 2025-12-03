  import React from "react";
  import { FlatList, View, Text, Pressable, StyleSheet } from "react-native";
  import { Transaction } from "../types";
  import { deleteTransaction } from "../services/api";

  type Props = {
    transactions: Transaction[];
    deleteTransaction: (id: number) => void;
  };

  export default function TransactionList({ transactions, deleteTransaction }: Props) {
    return (
      <View style={styles.container}> 
        <FlatList
          data={transactions}
          showsVerticalScrollIndicator={true}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listings}>
              <Text>{new Date(item.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}</Text>
              <Text style={{ paddingHorizontal: 8 }}> -${Number(item.amount).toFixed(2)}</Text>
              <View style={styles.buttonStack}> 
                <Pressable style={styles.deleteButton}>
                  <Text style={styles.deleteText}
                    onPress={() => {
                      deleteTransaction(item.id);
                    }}>
                    Delete
                  </Text>
                </Pressable>
                <Pressable style={styles.editButton}>
                  <Text style={styles.editText}
                    onPress={() => {
                      deleteTransaction(item.id);
                    }}>
                    Modify
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      height: "60%",
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
    listings: {
      display: "flex",
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
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
  });


