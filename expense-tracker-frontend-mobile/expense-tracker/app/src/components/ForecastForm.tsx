import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { Balance, FutureTransaction, Purchase } from "../types";
import { Picker } from "@react-native-picker/picker";

type ForecastFormProps = {
    onSubmit: (Expense: FutureTransaction) => void;
    onCancel: () => void;
};

function ForecastForm({onSubmit, onCancel}: ForecastFormProps) {
    const [amount, setAmount] = useState("");
    const [due_date, setDueDate] = useState("");
    const [description, setDescription] = useState("");
    const [expense_type, setExpenseType] = useState("");
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);

    const handleSubmit = () => {

        if (!amount || isNaN(Number(amount))) {
            setError("Amount must be a number greater than zero");
            return;
        };

        const formattedAmount = parseFloat(amount).toFixed(2);

        onSubmit({
            amount, 
            due_date, 
            expense_type,
            description} as FutureTransaction);

        setAmount("");
        setDueDate("");
        setDescription("");
        setExpenseType("");
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
                    onChangeText={setDueDate}
        
                /> 

                <TextInput 
                    placeholder="Description" 
                    value={description}
                    onChangeText={setDescription}
                /> 

                <Pressable onPress={() => setOpen(!open)}>
                    <Text>{expense_type || "Select type"}</Text>
                </Pressable>

                {open && (
                <View style={{ backgroundColor: "#eee", padding: 8 }}>
                    <Pressable onPress={() => { setExpenseType("Deposit"); setOpen(false); }}>
                    <Text>Deposit</Text>
                    </Pressable>
                    <Pressable onPress={() => { setExpenseType("Withdrawal"); setOpen(false); }}>
                    <Text>Withdrawal</Text>
                    </Pressable>
                </View>
                )}



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

export default ForecastForm;

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
