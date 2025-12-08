// import React, { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES } from "react";
import { FlatList, View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { FutureTransaction, Purchase } from "../types";
import { deleteForecasted, deletePurchase } from "../services/api";
import { formatMoney } from "../services/util";
import React, { useMemo } from "react";

type Props = {
  expenses: FutureTransaction[];
  deleteForecasted: (id: number) => void;
};

export default function ForecastList({ expenses, deleteForecasted }: Props) {


  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
  }, [expenses]);


  return (
    <View style={styles.container}> 
      <FlatList
        data={sortedExpenses}
        showsVerticalScrollIndicator={true}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listings}>
            <Text>{new Date(item.due_date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}</Text>
              <Text
                style={{         
                  width: 100, 
                  textAlign: "right",    
                  paddingHorizontal: 8,
                  color: Number(item.amount) < 0 ? "red" : "green",
                }}
              >
              {formatMoney(Number(item.amount))}
            </Text>
            
            <Text style={{ 
              width: 80,
              paddingHorizontal: 8,
              alignItems: "flex-start", 
              textAlign: "left",
             }}> 
              {item.description}
            </Text>
            
            <View style={styles.buttonStack}> 
              <Pressable 
                style={styles.deleteButton} 
                onPress={() => deleteForecasted(item.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
      

            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  deleteButton: {
    borderRadius: 12,
    color: "red",
    marginLeft: "auto",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "red", 
  },
  deleteText: {
    color: "red",
  },
  buttonStack: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  listings: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  editButton: {
    borderRadius: 12,
    color: "grey",
    marginLeft: "auto",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "grey", 
  },
  editText: {
    color: "grey",
  },
});

