// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Image, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";  
import { Balance, FutureTransaction, Purchase } from "../types";
import { deletePurchase, getBalance, getExpenses, getSpent, getPurchases, insertExpense, insertPurchase, updateBalance, getForecast, deleteForecasted } from "../services/api";
import BalanceCard from "../components/BalanceCard";
import BalanceModal from "../components/BalanceModal";
import ExpenseModal from "../components/ForecastModal";
import TaskBar from "../components/Taskbar";
import ForecastList from "../components/ForecastList";
import PurchaseList from "../components/PurchaseList";
import { formatMoney } from "../services/util";
import BudgetBreakdown from "../components/BudgetBreakdown";

const budget = "820.00";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [spent, setSpent] = useState<string | null>(null);
  const [forecasted, setForecasted] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [expenses, setExpenses] = useState<FutureTransaction[]>([]);
  const [remainingPercentage, setRemainingPercentage] = useState<number | null>(null);
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [balanceModalVisible, setBalanceModalVisible] = useState(false);
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const balanceResult = await getBalance();
      setBalance(balanceResult);

      const spentResult = await getSpent();
      setSpent(spentResult)

      const forecastResult = await getForecast();
      setForecasted(forecastResult);

      const purchaseResults = await getPurchases();
      if (purchaseResults) setPurchases(purchaseResults);

      const expenseResult = await getExpenses();
      if (expenseResult) setExpenses(expenseResult);
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

  const handlePurchaseSubmit = async (data: { 
    amount: string; 
    date: string; 
    bucket_id: number;
    description: string;
  }) => {
    try {
      console.log("Submitting purchase:", data);

      let amountNum = parseFloat(data.amount);
      amountNum = parseFloat(amountNum.toFixed(2));

      const newPurchase = await insertPurchase(
        amountNum,
        data.date,
        data.bucket_id,
        data.description
      );

      console.log("Purchase created:", newPurchase);

      const purchases = await getPurchases();
      if (purchases) setPurchases(purchases);

      const updated = await getBalance();
      if (updated) setBalance(updated);

      const updatedSpent = await getSpent();
      if (updatedSpent) setSpent(updatedSpent);
      setPurchaseModalVisible(false);
      
    } catch (error) {
      console.error("Error inserting purchase:", error);

    }
  };

  const handleExpenseSubmit = async (data: { 
      amount: string; 
      due_date: string; 
      expense_type: string;
      description: string;
  }) => {
    try {
      console.log("Submitting Expense:", data);

      let amountNum = parseFloat(data.amount);
      amountNum = parseFloat(amountNum.toFixed(2));

      const newExpense = await insertExpense(
        amountNum,
        data.due_date,
        data.expense_type,
        data.description
      );

      console.log("Expense created:", newExpense);

      const updatedExpenses = await getExpenses();
      if (updatedExpenses) {
        setExpenses(updatedExpenses);
      }


      const updatedForecasted = await getForecast();
      if (updatedForecasted) setForecasted(updatedForecasted);

      setPurchaseModalVisible(false);
      
    } catch (error) {
      console.error("Error inserting purchase:", error);

    }
  };

  const handleUpdateBalance = async ({id, amount}: { 
    id: number,
    amount: string,
  }) => {
    try {
      console.log("Submitting balance update:", amount);

      let amountNum = parseFloat(amount);
      amountNum = parseFloat(amountNum.toFixed(2));

      const newBalance = await updateBalance(
        1,
        amountNum,
        "personal",
        "cameron",
      );

      console.log("Balance update created:", newBalance);

      const updatedBalance = await getBalance();
      if (updatedBalance) {
        setBalance(updatedBalance);
      }

      setBalanceModalVisible(false);
      
    } catch (error) {
      console.error("Error updating balance:", error);

    }
  };
  const handleDeletePurchase = async (id: number) => {
    try {
      await deletePurchase(id);

      const purchases = await getPurchases();
      if (purchases) setPurchases(purchases);

      const updated = await getBalance();
      if (updated) setBalance(updated);

      const updatedSpent = await getSpent();
      if (updatedSpent) setSpent(updatedSpent);

    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleDeleteEexpense = async (id: number) => {
    try {
      await deleteForecasted(id);

      const expenses = await getExpenses();
      if (expenses) setExpenses(expenses);

      const updated = await getBalance();
      if (updated) setBalance(updated);

      const updatedSpent = await getSpent();
      if (updatedSpent) setSpent(updatedSpent);

      const updatedForecasted = await getForecast();
      if (updatedForecasted) setForecasted(updatedForecasted);

    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };



  return (
    <SafeAreaProvider>
      <View style={styles.bodySectionTop}>
        <Text style={styles.headerText}> Hello, Cameron</Text> 
        <View style={styles.headerView}>
          <View style={{ flex: 1 }}>
            <BalanceCard 
              balance={balance} 
              spent={spent}
              budget={budget}
              forecasted={forecasted}
            />
          </View>
          <View style={{ width: 120, alignItems: "center" }}>
            <BudgetBreakdown 
            percentage={
              (Number(budget) - Number(spent)) / 
              Number(budget) * 100
            }
            radius={40}
            />
          </View>
        </View>
      </View>
      <View style={styles.listContainer}>
        <Text style={{ fontSize: 18}}>
          Recent Purchases: <Text style={{ color: "red" }}>${Number(spent).toFixed(2)}</Text>
        </Text>
        <Text style={{ fontSize: 18}}>Upcoming Bills/ Deposits: 
          <Text style={{ color: Number(forecasted) < 0 ? "red" : "green" }}>  {formatMoney(Number(forecasted))}</Text>
        </Text>
        <ForecastList 
          expenses={expenses} 
          deleteForecasted={deleteForecasted}
        />
      </View>
      <TaskBar 
        handlePurchaseSubmit={handlePurchaseSubmit}
        handleUpdateBalance={handleUpdateBalance}
        handleExpenseSubmit={handleExpenseSubmit}
        purchaseModalVisible={purchaseModalVisible}
        setPurchaseModalVisible={setPurchaseModalVisible}
        balanceModalVisible={balanceModalVisible}
        setBalanceModalVisible={setBalanceModalVisible}
        expenseModalVisible={expenseModalVisible}
        setExpenseModalVisible={setExpenseModalVisible}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 70,
  },
  listContainer: {
    flex: 1,
    padding: 15,
    gap: 10,
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
    marginBottom: 20,
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
