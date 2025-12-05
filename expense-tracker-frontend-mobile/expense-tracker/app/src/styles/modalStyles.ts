import { StyleSheet } from "react-native";

export const modalStyles = StyleSheet.create({
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