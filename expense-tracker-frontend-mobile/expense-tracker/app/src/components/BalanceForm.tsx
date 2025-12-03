import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { Balance } from "../types";



type BalanceFormProps = {
    onSubmit: (id: number, balance: string) => void;
    onCancel: () => void;
};

function BalanceForm({onSubmit, onCancel}: BalanceFormProps) {
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {

        if (!amount || isNaN(Number(amount))) {
            setError("Amount must be a number greater than zero");
            return;
        };

        const formattedAmount = parseFloat(amount).toFixed(2);
    
        onSubmit(1, formattedAmount);

        setAmount("");
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
                    style={styles.input}
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

export default BalanceForm;

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: "#ccc",   // light gray
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: "white",
    },
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
        gap: 20,
    },
 
});
