import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { Purchase } from "../types";
import TransactionForm from "./PurchaseForm";
import { modalStyles } from "../styles/modalStyles";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: string; date: string; bucket_id: number; description: string }) => void;
};

export default function PurchaseModal({ visible, onClose, onSubmit }: Props) {

  const handleSubmit = (purchase: Purchase) => {
    onSubmit(purchase);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.modalBackground}>
        <View style={modalStyles.modalBox}>
          <TransactionForm
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </View>
      </View>
    </Modal>
  );
}
