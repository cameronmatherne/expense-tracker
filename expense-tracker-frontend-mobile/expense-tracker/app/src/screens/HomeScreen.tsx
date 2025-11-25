// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Image, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";  

import { Balance, Transaction } from "../types";
import { getBalance, getTransactions } from "../services/api";
import BalanceCard from "../components/BalanceCard";
import TransactionList from "../components/TransactionList";
import TransactionModal from "../components/TransactionModal";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const balanceResult = await getBalance();
      setBalance(balanceResult);

      const transactionResults = await getTransactions();
      if (transactionResults) setTransactions(transactionResults);

      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Loading balance...</Text>
      </View>
    );
  }

  if (!balance) {
    return (
      <View style={styles.container}>
        <Text>Error fetching balance.</Text>
      </View>
    );
  }

  const handleTransactionSubmit = (data: { amount: number; date: string; bucket_id: number }) => {
    console.log("New transaction:", data);



  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.topHeader}>
        <View> 
          <Image source={require("../assets/images/logo.png")} style={styles.logo} />
        </View>
      </SafeAreaView>
      <View style={styles.bodySectionTop}>
        <BalanceCard balance={balance} />

        <View> 
          <Pressable style={styles.button} onPress={() => setTransactionModalVisible(true)}>
            <Text>Add Transaction</Text>
          </Pressable>

          <TransactionModal
            visible={transactionModalVisible}
            onClose={() => setTransactionModalVisible(false)}
            onSubmit={handleTransactionSubmit}
          />

          <Pressable style={styles.balanceButton} onPress={() => setTransactionModalVisible(true)}>
            <Text>Edit Balance</Text>
          </Pressable>
        </View> 

      </View>

      <View style={styles.bodySectionBottom}>
        <Text style={{ fontSize: 18 }}>Recent Transactions:</Text>
        <TransactionList transactions={transactions} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  logo: { 
    width: 150, 
    height: 150, 
    marginTop: 70,
  },
  loading: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  topHeader: { 
    flex: 0.5, 
    paddingHorizontal: 20, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  bodySectionTop: { 
    flex: 0.5, 
    padding: 20, 
    borderRadius: 12, 
    backgroundColor: "#f4f4f4", 
    alignItems: "center",
  },
  bodySectionBottom: { 
    flex: 1, 
    padding: 20, 
    borderRadius: 12, 
    backgroundColor: "#f4f4f4"
   },
  button: { 
    padding: 12, 
    borderRadius: 12, 
    backgroundColor: "#2c82ff", 
    marginTop: 10, 
    alignItems: "center" 
  },
  balanceButton: {
    padding: 12, 
    borderRadius: 12, 
    backgroundColor: "#2c82ff", 
    marginTop: 10, 
    alignItems: "center",
  },
});
