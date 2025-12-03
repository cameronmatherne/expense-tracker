import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { Expense, Transaction } from "../types";
import BalanceForm from "./BalanceForm";
import ExpenseForm from "./ExpenseForm";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: string; due_date: string; type: string }) => void;
};

export default function ExpenseModal({ visible, onClose, onSubmit }: Props) {

  const handleSubmit = (expense: Expense) => {
    onSubmit(expense);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalBox}>
          <ExpenseForm
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.3)" 
  },
  modalBox: { width: "85%", 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    padding: 20,
    flexDirection: "row",
  },
  modalBoxText: { width: "85%", 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    justifyContent: "space-between",
    color: "black"
  },
});