import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { Transaction } from "../types";
import TransactionForm from "./TransactionForm";
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: string; date: string; bucket_id: number }) => void;
};

export default function TransactionModal({ visible, onClose, onSubmit }: Props) {

  const handleSubmit = (transaction: Transaction) => {
    onSubmit(transaction);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalBox}>
          <TransactionForm
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
