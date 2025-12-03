import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { Transaction } from "../types";
import BalanceForm from "./BalanceForm";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { id: number, amount: string; }) => void;
};

export default function BalanceModal({ visible, onClose, onSubmit }: Props) {

  // Accept either (id, amount) or just (amount) from BalanceForm and ensure we always pass a non-null id
  const handleSubmit = (...args: any[]) => {
    const amount = typeof args[0] === "number" ? args[1] : args[0];
    onSubmit({ id: 1, amount });
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalBox}>
          <BalanceForm
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