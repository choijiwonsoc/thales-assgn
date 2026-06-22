import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import Hash from "./hashing";
import KeyPair from "./keypair";
import * as Crypto from "expo-crypto";

if (typeof global.crypto !== "object") {
  global.crypto = {};
}
if (typeof global.crypto.getRandomValues !== "function") {
  global.crypto.getRandomValues = (array) => {
    // Get natively secure random bytes from the OS
    const randomBytes = Crypto.getRandomBytes(array.length);
    // Copy the bytes into the array that @noble/curves expects
    array.set(randomBytes);
    return array;
  };
}
export default function App() {
  return (
    <View style={styles.root}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Hash />
        <KeyPair />
        <StatusBar style="auto" />
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,               
    backgroundColor: "#fff", 
  },
  scrollContainer: {
    flexGrow: 1, 
  },
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
  },
});
