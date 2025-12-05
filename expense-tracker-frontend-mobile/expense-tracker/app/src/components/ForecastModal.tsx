import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { FutureTransaction, Purchase } from "../types";
import ExpenseForm from "./ForecastForm";
import { modalStyles } from "../styles/modalStyles";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: string; due_date: string; expense_type: string; description: string; }) => void;
};

export default function ForecastModal({ visible, onClose, onSubmit }: Props) {

  const handleSubmit = (expense: FutureTransaction) => {
    onSubmit(expense);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={modalStyles.modalBackground}>
        <View style={modalStyles.modalBox}>
          <ExpenseForm
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </View>
      </View>
    </Modal>
  );
}

