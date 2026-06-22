import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { styles } from "./common";
import { handleHash } from "./cryptoUtils";

export default function Hash() {
  const [inputText, setInputText] = useState("");
  const [hashResult, setHashResult] = useState("");

  const handleHashMethod = async (text) => {
    setInputText(text);
    try {
      const hashString = await handleHash(text);
      setHashResult(hashString);
    } catch (err) {
      Alert.alert("Error while hashing", `${err}`)
      console.error("Error found: ", err);
    }
  };

  return (
    <View style={{ width: "80%", paddingVertical: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>SHA-256 Hashing</Text>

      <TextInput
        style={{
          borderBottomWidth: 1,
          borderColor: "#ccc",
          marginVertical: 10,
          padding: 5,
        }}
        placeholder="Type here to hash..."
        value={inputText}
        onChangeText={handleHashMethod}
        autoComplete="none"
        autoCapitalize="none"

      />

      {hashResult ? (
        <View style={styles.card}>
          <Text style={{ fontSize: 12, fontWeight: "bold", color: "#666" }}>
            Hash Result:
          </Text>
          <Text style={{ fontSize: 11, fontFamily: "monospace", marginTop: 2 }}>
            {hashResult}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
