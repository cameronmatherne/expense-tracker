// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Image, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";  
import { Balance, Expense, Transaction } from "../types";
import { deleteTransaction, getBalance, getExpenses, getSpent, getTransactions, insertTransaction, updateBalance } from "../services/api";
import BalanceCard from "../components/BalanceCard";
import TransactionList from "../components/TransactionList";
import TransactionModal from "../components/TransactionModal";
import BalanceModal from "../components/BalanceModal";
import ExpenseModal from "../components/ExpenseModal";

const budget = "820.00";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [spent, setSpent] = useState<String | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [balanceModalVisible, setBalanceModalVisible] = useState(false);
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);


  
  useEffect(() => {
    const fetchData = async () => {
      const balanceResult = await getBalance();
      setBalance(balanceResult);

      const spentResult = await getSpent();
      setSpent(spentResult)

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

  const handleTransactionSubmit = async (data: { 
    amount: string; 
    date: string; 
    bucket_id: number 
  }) => {
    try {
      console.log("Submitting transaction:", data);

      let amountNum = parseFloat(data.amount);
      amountNum = parseFloat(amountNum.toFixed(2));

      const newTransaction = await insertTransaction(
        amountNum,
        data.date,
        data.bucket_id
      );

      console.log("Transaction created:", newTransaction);

      const updatedTransactions = await getTransactions();
      if (updatedTransactions) {
        setTransactions(updatedTransactions);
      }

      setTransactionModalVisible(false);
      
    } catch (error) {
      console.error("Error inserting transaction:", error);

    }
  };

    const handleExpenseSubmit = async (data: { 
    amount: string; 
    due_date: string; 
    type: string 
  }) => {
    try {
      console.log("Submitting transaction:", data);

      let amountNum = parseFloat(data.amount);
      amountNum = parseFloat(amountNum.toFixed(2));

      const newExpense = await insertExpenses(
        amountNum,
        data.due_date,
        data.type,
      );

      console.log("Transaction created:", newExpense);

      const updatedExpenses = await getExpenses();
      if (updatedExpenses) {
        setExpenses(updatedExpenses);
      }

      setTransactionModalVisible(false);
      
    } catch (error) {
      console.error("Error inserting transaction:", error);

    }
  };

  const handleUpdateBalance = async (data: { 
    id: number,
    amount: string,
  }) => {
    try {
      console.log("Submitting balance update:", data);

      let amountNum = parseFloat(data.amount);
      amountNum = parseFloat(amountNum.toFixed(2));

      const newBalance = await updateBalance(
        1,
        amountNum,
        "personal",
        "cameron",
      );

      console.log("Balance update transaction created:", newBalance);

      const updatedBalance = await getBalance();
      if (updatedBalance) {
        setBalance(updatedBalance);
      }

      setBalanceModalVisible(false);
      
    } catch (error) {
      console.error("Error updating balance:", error);

    }
  };
  const handleDeleteTransaction = async (id: number) => {
    try {
      await deleteTransaction(id);

      const transactions = await getTransactions();
      if (transactions) setTransactions(transactions);

      const updated = await getBalance();
      if (updated) setBalance(updated);

      const updatedSpent = await getSpent();
      if (updatedSpent) setSpent(updatedSpent);

    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };


  return (
    <SafeAreaProvider>
      <View style={styles.bodySectionTop}>
        <BalanceCard 
          balance={balance} 
          spent={spent}
          budget={budget}
        />
        <View style={styles.buttonContainer}> 
          <Pressable style={styles.button} onPress={() => setTransactionModalVisible(true)}>
            <Text>Add Transaction</Text>
          </Pressable>
  
          <TransactionModal
            visible={transactionModalVisible}
            onClose={() => setTransactionModalVisible(false)}
            onSubmit={handleTransactionSubmit}
          />
  
          <Pressable style={styles.balanceButton} onPress={() => setBalanceModalVisible(true)}>
            <Text>Edit Balance</Text>
          </Pressable>
  
          <BalanceModal
            visible={balanceModalVisible}
            onClose={() => setBalanceModalVisible(false)}
            onSubmit={handleUpdateBalance}
          />

          <Pressable style={styles.button} onPress={() => setExpenseModalVisible(true)}>
            <Text>Add Expense </Text>
          </Pressable>

          <ExpenseModal
            visible={expenseModalVisible}
            onClose={() => setExpenseModalVisible(false)}
            onSubmit={handleExpenseSubmit}
          />

        </View> 
      </View>

      <View style={styles.listContainer}>
        <View style={styles.transactionSectionBottom}>
          <Text style={{ fontSize: 18 }}>
            Recent Purchases: <Text style={{ color: "red" }}>${spent}</Text>
          </Text>
          <TransactionList 
            transactions={transactions} 
            deleteTransaction={handleDeleteTransaction}
          />
        </View>
        <View style={styles.expenseSectionButtom}>
          <Text style={{ fontSize: 18}}>Upcoming Bills/ Deposits:</Text>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
  logo: { 
    width: 100, 
    height: 100, 
    marginTop: 90,
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
    flex: .5, 
    padding: 20, 
    borderRadius: 12, 
    backgroundColor: "#f4f4f4", 
    alignItems: "center",
  },
  transactionSectionBottom: { 
    flex: 1, 
    borderRadius: 12, 
    backgroundColor: "#f4f4f4",
   },
  expenseSectionButtom: { 
    flex: 1, 
    borderRadius: 12, 
    backgroundColor: "#f4f4f4",
   },
  button: { 
    padding: 12, 
    borderRadius: 12, 
    backgroundColor: "#2c82ff", 
    alignItems: "center" 
  },
  balanceButton: {
    padding: 12, 
    borderRadius: 12, 
    backgroundColor: "#2c82ff", 
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  }
});
