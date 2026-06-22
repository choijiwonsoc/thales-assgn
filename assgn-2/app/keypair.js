import { useState } from "react";
import { p256 } from "@noble/curves/nist";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { bytesToHex, hexToBytes } from "@noble/curves/utils";
import { styles } from "./common";
import { generateKeyPair, signMessage, verifySignature } from "./cryptoUtils";
import * as Clipboard from 'expo-clipboard'; 

export default function KeyPair() {
  const [keyPair, setKeyPair] = useState(null);
  const [message, setMessage] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [isValid, setIsValid] = useState(null);
  const [signatureHex, setSignatureHex] = useState("");

  const copyToClipboard = (textToCopy) => {
  Clipboard.setStringAsync(textToCopy)
    .then(() => {
      Alert.alert("Success", "Copied to clipboard!");
    })
    .catch((err) => {
      Alert.alert("Error", `Failed to copy: ${err}`);
    });
};


  const generateKeyPairMethod = async () => {
    try {
      const results = await generateKeyPair();
      setPrivateKey(results.privHex);
      setPublicKey(results.pubHex);
      setKeyPair(results.rawPair);
    } catch (err) {
      Alert.alert("Error generating key pair", `${err}`)
      console.log("Error generating key pair: ", err);
    }
  };

  const signMessageMethod = async () => {
    if (!keyPair || !message) {
      Alert.alert("Error", "Please enter a message")
      return;
    }
    try {
      const results = await signMessage(message, keyPair);
      setSignatureHex(results);
    } catch (err) {
      Alert.alert("Error while signing", `${err}`)
      console.error("Error while signing: ", err);
    }
  };

  const verifySignatureMethod = async () => {
    if (!publicKey || !message || !signatureHex) {
      Alert.alert("Error", "Please enter a message")
      return;
    }
    try {
      const result = await verifySignature(publicKey, message, signatureHex);
      setIsValid(result);
      console.log(result);
    } catch (err) {
      setIsValid(false);
      Alert.alert("Error while verifying", `${err}`)
      console.log("Error while verifying: ", err);
    }
  };

  return (
    <View style={{ width: "80%", paddingVertical: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
        ECDSA Key Generation
      </Text>
      <Button title="Generate Keys" onPress={generateKeyPairMethod} />

      {publicKey ? (
        <View>
          <View style={styles.card}>
            <Text style={{ fontSize: 14 }}>Pub: {publicKey}</Text>
           <Button title="Copy Text" onPress={()=>copyToClipboard(publicKey)} />
          </View>
          
          <View style={styles.card}>
            <Text style={{ fontSize: 14 }}>Priv: {privateKey}</Text>
          <Button title="Copy Text" onPress={()=>copyToClipboard(privateKey)} />
          </View>
          
        </View>
      ) : null}

      <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 15 }}>
        Sign Message
      </Text>
      <TextInput
        style={{
          borderBottomWidth: 1,
          borderColor: "#ccc",
          marginVertical: 10,
          padding: 5,
        }}
        placeholder="Type message to sign..."
        value={message}
        onChangeText={setMessage}
        autoComplete="none"
        autoCapitalize="none"
      />
      <Button title="Sign" onPress={signMessageMethod} />

      {signatureHex ? (
        <View style={styles.card}>
          <Text
            style={{
              fontSize: 14,
              marginVertical: 10,
            }}
          >
            Sig: {signatureHex}
          </Text>
        </View>
      ) : null}

      <Button title="Verify" onPress={verifySignatureMethod} />

      {isValid !== null ? (
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 10,
            color: isValid ? "green" : "red",
          }}
        >
          {isValid ? "Signature is valid!" : "Signature is invalid!"}
        </Text>
      ) : null}
    </View>
  );
}
