import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { Purchase } from "../types";
import BalanceForm from "./BalanceForm";
import { modalStyles } from "../styles/modalStyles";


type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {id: number, amount: string; }) => void;
};

export default function BalanceModal({ visible, onClose, onSubmit }: Props) {

  const handleSubmit = (amount: string) => {
    onSubmit({ id: 1, amount });
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={modalStyles.modalBackground}>
        <View style={modalStyles.modalBox}>
          <BalanceForm
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </View>
      </View>
    </Modal>
  );
}
