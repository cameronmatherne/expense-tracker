import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: number; date: string; bucket_id: number }) => void;
};

export default function TransactionModal({ visible, onClose, onSubmit }: Props) {
  const [amount, onChangeAmount] = useState<number | null>(0);
  const [date, onChangeDate] = useState<string | null>(null);
  const [bucket_id, onChangeId] = useState<number | null>(null);

  const handleSubmit = () => {
    if (amount && date && bucket_id) {
      onSubmit({ amount, date, bucket_id });
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalBox}>
          <View style={styles.modalBoxText}>
            <TextInput 
              placeholder="Amount"
            /> 
            <TextInput 
              placeholder="Date" 
            /> 
            <TextInput 
              placeholder="Category" 
            /> 
          </View>

          <View style={{}}> 
            <Pressable onPress={handleSubmit}><Text>Submit</Text></Pressable>
            <Pressable onPress={onClose}><Text>Cancel</Text></Pressable>
          </View>
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
