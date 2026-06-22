import { View, Text, TextInput, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    width: "90%",
    maxWidth: 450,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
    copyBtn: {
    backgroundColor: "#0070f3",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  copyBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});
