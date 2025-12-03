import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { Balance, Expense, Transaction } from "../types";



type ExpenseFormProps = {
    onSubmit: (Expense: Expense) => void;
    onCancel: () => void;
};

function ExpenseForm({onSubmit, onCancel}: ExpenseFormProps) {
    const [amount, setAmount] = useState("");
    const [due_date, setDate] = useState("");
    const [type, setBucketId] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {

        if (!amount || isNaN(Number(amount))) {
            setError("Amount must be a number greater than zero");
            return;
        };

        const formattedAmount = parseFloat(amount).toFixed(2);

    
        onSubmit({
            amount: amount, 
            due_date: due_date, 
            type: type} as Expense);

        setAmount("");
        setDate("");
        setBucketId("");
        setError("");
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputFields}>
                <TextInput 
                    placeholder="Amount"
                    keyboardType="decimal-pad"
                    value={amount}
                    onChangeText={setAmount}
                   
                /> 
                <TextInput 
                    placeholder="Due Date (MM/DD)" 
                    value={due_date}
                    onChangeText={setDate}
           
                /> 
                <TextInput 
                    placeholder="Type" 
                    value={type}
                    onChangeText={setBucketId}
                
                /> 
                {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
            </View>
            <View style={styles.lowerButtons}> 
                <Pressable onPress={handleSubmit}> 
                    <Text>Submit</Text> 
                </Pressable>
                <Pressable onPress={onCancel}> 
                    <Text>Cancel</Text> 
                </Pressable>
            </View>
        </View>
    );
}

export default ExpenseForm;

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    inputFields: {
        marginBottom: 15,
    },
    lowerButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
});
