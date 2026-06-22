import { useState } from "react";
import { p256 } from "@noble/curves/nist";
import { View, Text, TextInput, Button } from "react-native";
import { bytesToHex, hexToBytes } from "@noble/curves/utils";
import { styles } from "./common";

export default function KeyPair() {
  const [keyPair, setKeyPair] = useState(null);
  const [message, setMessage] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [isValid, setIsValid] = useState(null);
  const [signatureHex, setSignatureHex] = useState("");

  const generateKeyPair = async () => {
    try {
      const { secretKey, publicKey: pubKeyBytes } = p256.keygen();
      setPrivateKey(bytesToHex(secretKey));
      setPublicKey(bytesToHex(pubKeyBytes));
      setKeyPair(secretKey);
    } catch (err) {
      Alert.alert("Error generating key pair", `${err}`)
      console.log("Error generating key pair: ", err);
    }
  };

  const signMessage = async () => {
    if (!keyPair || !message) {
      return;
    }
    try {
      const msg = new TextEncoder().encode(message);
      const sig = p256.sign(msg, keyPair);
      const sigHex = bytesToHex(sig);
      setSignatureHex(sigHex);
    } catch (err) {
      Alert.alert("Error while signing", `${err}`)
      console.error("Error while signing: ", err);
    }
  };

  const verifySignature = async () => {
    if (!keyPair || !message || !signatureHex) {
      return;
    }
    try {
      const msg = new TextEncoder().encode(message);
      const ver = p256.verify(
        hexToBytes(signatureHex),
        msg,
        hexToBytes(publicKey),
      );
      setIsValid(ver);
      console.log(ver);
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
      <Button title="Generate Keys" onPress={generateKeyPair} />

      {publicKey ? (
        <View>
          <View style={styles.card}>
            <Text style={{ fontSize: 14 }}>Pub: {publicKey}</Text>
           
          </View>
          
          <View style={styles.card}>
            <Text style={{ fontSize: 14 }}>Priv: {privateKey}</Text>
          
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
      />
      <Button title="Sign" onPress={signMessage} />

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

      <Button title="Verify" onPress={verifySignature} />

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
