import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { Balance, Purchase } from "../types";



type PurchaseFormProps = {
    onSubmit: (purchase: Purchase) => void;
    onCancel: () => void;
};

function PurchaseForm({onSubmit, onCancel}: PurchaseFormProps) {
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [bucket_id, setBucketId] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {

        if (!amount || isNaN(Number(amount))) {
            setError("Amount must be a number greater than zero");
            return;
        };

        const formattedAmount = parseFloat(amount).toFixed(2);

        const bucketNum = parseFloat(bucket_id);
        if (!bucket_id || isNaN(bucketNum) || bucketNum <= 0) {
            setError("Bucket ID must be a number greater than zero");
            return;
        };

        if (!date || !/^\d{1,2}\/\d{1,2}$/.test(date)) {
        setError("Date must be in MM/DD format");
        return;
        }
        
        const [month, day] = date.split("/");
        const currentYear = new Date().getFullYear();
        const formattedDate = `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
        onSubmit({
            amount: formattedAmount, 
            date: formattedDate, 
            bucket_id: bucketNum,
            description: description} as Purchase);

        setAmount("");
        setDate("");
        setBucketId("");
        setDescription("");
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
                    placeholderTextColor="#555"
                    
                /> 
                <TextInput 
                    placeholder="Date (MM/DD)" 
                    value={date}
                    onChangeText={setDate}
                    style={styles.input}
                    placeholderTextColor="#555"
                /> 
                <TextInput 
                    placeholder="Category" 
                    value={bucket_id}
                    onChangeText={setBucketId}
                    style={styles.input}
                    placeholderTextColor="#555"
                /> 

                <TextInput 
                    placeholder="Description" 
                    value={description}
                    style={styles.input}
                    placeholderTextColor="#555"
                    onChangeText={setDescription}
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

export default PurchaseForm;

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
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 10,
        fontSize: 16,
        color: "#000", // input text color
    },
});