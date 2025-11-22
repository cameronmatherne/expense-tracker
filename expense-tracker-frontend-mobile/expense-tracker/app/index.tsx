import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View, Pressable, Button, Image, StyleSheet, FlatList, Modal} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

type Balance = {
  id: number;
  amount: number;
  account_type: string;
  user_name: string;
};

type Transaction = {
  id: number;
  amount: number;
  date: string;
  bucket_id: number;
}

type Bucket = {
  id: number;
  name: string;
  limit_amount: number;
  curent_amount: number;
  created_at: string;
  updated_at: string;
}

const API_URL = 'http://192.168.0.206:3000';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);



  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);

  const [amount, setAmount] = useState(false);
  const [date, setDate] = useState(false);
  const [bucket_id, setBucketId] = useState(false);

  const handleTransactionSubmit = () => {
    console.log("amount: ", amount);
    console.log("date: {} ", date);
    console.log("bucket id: {] ", bucket_id);

    setTransactionModalVisible(false);

  }

  useEffect(() => {
    const fetchData = async () => {
      const balanceResult = await getBalance();
      setBalance(balanceResult);
      console.log("balance acquired");

      const transactionResults = await getTransactions();
      setTransactions(transactionResults);
      console.log("transactions acquired");

      setLoading(false);
      setLoadingTransactions(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View
        style={styles.loading}
      >
        <ActivityIndicator size="large" />
        <Text>Loading balance...</Text>
      </View>
    );
  }

  if (!balance) {
    return (
      <View
        style={styles.container}
      >
        <Text>Error fetching balance.</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider
    >
      <View
       style={[styles.topHeader]} 
      >
        <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        />
      </View>
      {/* Second half of the screen: list of transactions  */} 
      <View
        style={[styles.bodySectionTop]} 
      >
        <View style={{ alignItems: "center", }}>
          <Text style={{ fontSize: 36, marginBottom: 10, }}>
            Balance: ${balance.amount.toFixed(2)}
          </Text>
          <Text style={{ fontSize: 18, marginBottom: 10, }}>
            Left to spend: ${balance.amount.toFixed(2)}
          </Text>
        </View>


        <View style={[styles.buttonSection]}>
          <Pressable 
            onPress={() => setTransactionModalVisible(true)}
            style={[styles.buttonTextSection]}
          >
            <Text> Add Transaction</Text>
          </Pressable>

          <Modal
            visible={transactionModalVisible}
            transparent
            animationType="slide"
            style={[styles.modalBackground]}
          >
            <View
            style={[styles.modalBox]}
            >


              <View>
                <Pressable
                  onPress={handleTransactionSubmit}
                >
                  <Text>Submit</Text>
                </Pressable>
                <Pressable
                  onPress={() => setTransactionModalVisible(false)}
                >
                  <Text> Cancel </Text>
                </Pressable>

              </View>

            </View>
          </Modal>

          <Pressable 
            onPress={() => setTransactionModalVisible(true)}
            style={({ pressed }) => [
              {
                flex: 1,
                backgroundColor: pressed ? "#2c82ff" : "#4B9EFF",  // <-- change color here
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
              }
            ]}
          >
            <Text>Edit Budget</Text>
          </Pressable>

        </View>
      </View>

      {/* Second half of the screen: list of transactions  */} 
      <View style={[styles.bodySectionBottom]}>
        <Text style={{ fontSize: 18 }}>Recent Transactions:</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 8, flex: 1, flexDirection: "row" }}>
              <Text>
                Date: {new Date(item.date).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: '2-digit',
                })}
              </Text>
              <Text style={{ paddingHorizontal: 8, }}>Amount: ${item.amount}</Text>
              <Text style={{ paddingHorizontal: 8, }}>Category: {item.bucket_id}</Text>
            </View>
          )}
        />
      </View>
  </SafeAreaProvider>
  );
}

const getBalance = async (): Promise<Balance | null> => {
  try {
      const response = await fetch(`${API_URL}/get_balance`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    console.log("Balance received: {} ", json);
    return json; 
  } catch (error) {
    console.error("Error fetching balance:", error);
    return null;
  }
};

const getTransactions = async (): Promise<Transaction[] | null> => {
  try {
      const response = await fetch(`${API_URL}/get_transactions`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    console.log("transactions: {} ", json);
    return json.transactions; 
  } catch (error) {
    console.log("error fetching transactions: {}", error);
    return null;
  }
};

const styles = StyleSheet.create({
  logo: {
    flex: .5,
    width: 150,
    height: 150,
    position: "absolute",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topHeader: {
    flex: .5,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  bodySectionTop: {
    flex: .5,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
  },
  bodySectionBottom: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#f4f4f4",
    
  },
  buttonSection: {
    flex: 1,
    padding: 12,
    flexDirection: "row",
    borderRadius: 8,
  },
  buttonTextSection: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#2c82ff",
    width: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",   
    alignItems: "center",        
    backgroundColor: "rgba(0,0,0,0.3)", 
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
})

