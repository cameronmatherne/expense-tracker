import { View, StyleSheet, Animated, Text, Alert, TouchableWithoutFeedback, TouchableOpacity, Pressable } from "react-native";
import PurchaseModal from "./PurchaseModal";
import BalanceModal from "./BalanceModal";
import { useState } from "react";
import { Balance, FutureTransaction, Purchase } from "../types";
import { deletePurchase, getBalance, getExpenses, getSpent, getPurchases, insertExpense, insertPurchase, updateBalance } from "../services/api";
import ExpenseModal from "./ForecastModal";
import ForecastModal from "./ForecastModal";

type TaskBarProps = {
    purchaseModalVisible: boolean;
    setPurchaseModalVisible: (visible: boolean) => void;
    balanceModalVisible: boolean;
    setBalanceModalVisible: (visible: boolean) => void;
    expenseModalVisible: boolean;
    setExpenseModalVisible: (visible: boolean) => void;

    handlePurchaseSubmit:  (data: { 
        amount: string; 
        date: string; 
        bucket_id: number; 
        description: string;
    }) => void;
    handleUpdateBalance:  (data: {
        id: number,
        amount: string,
    }) => void;
    handleExpenseSubmit: (data: {
        amount: string;
        due_date: string;
        expense_type: string;
        description: string;
    }) => void;
};

export default function TaskBar(
    { 
        handlePurchaseSubmit,
        handleUpdateBalance,
        handleExpenseSubmit,
        purchaseModalVisible,
        setPurchaseModalVisible,
        balanceModalVisible,
        setBalanceModalVisible,
        expenseModalVisible,
        setExpenseModalVisible,
}: TaskBarProps)
{
    
    return (
        <View>
            <View style={styles.buttonContainer}> 
                <Pressable style={styles.button} onPress={() => setPurchaseModalVisible(true)}>
                    <Text>Add Purchase</Text>
                </Pressable>
        
                <Pressable style={styles.balanceButton} onPress={() => setBalanceModalVisible(true)}>
                    <Text>Edit Balance</Text>
                </Pressable>
    
    
                <Pressable style={styles.button} onPress={() => setExpenseModalVisible(true)}>
                    <Text>Add Expense </Text>
                </Pressable>
    
            </View>
            <View style={styles.modal}> 
                <PurchaseModal
                    visible={purchaseModalVisible}
                    onClose={() => setPurchaseModalVisible(false)}
                    onSubmit={handlePurchaseSubmit}
                />

                <BalanceModal
                    visible={balanceModalVisible}
                    onClose={() => setBalanceModalVisible(false)}
                    onSubmit={handleUpdateBalance}
                />

                <ForecastModal
                    visible={expenseModalVisible}
                    onClose={() => setExpenseModalVisible(false)}
                    onSubmit={handleExpenseSubmit}
                />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    expenseModal: {

    },
    balanceModal: { 

    },
    purchaseModal: {

    },
    modal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.3)"

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
        marginBottom: 15,
    }
});
