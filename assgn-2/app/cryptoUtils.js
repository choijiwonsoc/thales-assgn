
import * as Crypto from "expo-crypto"
import { p256 } from "@noble/curves/nist";
import { bytesToHex, hexToBytes } from "@noble/curves/utils";

export async function handleHash(text) {
  try {
      const hashString = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        text,
      );
      return hashString;
    } catch (err) {
      console.error("Error found: ", err);
    }
}

const hexToBuffer = (hexString) => {
        const matches = hexString.match(/.{1,2}/g) || [];
        return new Uint8Array(matches.map(byte => parseInt(byte, 16)));
    };

const bufferToHex=(buffer)=>{
    return Array.from(new Uint8Array(buffer))
        .map(byte=>byte.toString(16).padStart(2, '0'))
        .join('');

}

export async function generateKeyPair() {
  
  try {
    const { secretKey, publicKey: pubKeyBytes } = p256.keygen();
    return {
        pubHex: bufferToHex(pubKeyBytes),
        privHex: bufferToHex(secretKey),
        rawPair: secretKey
    };
  } catch (err) {
    console.log("Error generating key pair: ", err);
  }
};

export async function signMessage(message, keyPair){
  if (!keyPair || !message) {
    return;
  }
  try {
      const msg = new TextEncoder().encode(message);
      const sig = p256.sign(msg, keyPair);
      const sigHex = bytesToHex(sig);
      return sigHex;
    } catch (err) {
      console.error("Error while signing: ", err);
    }
};

export async function verifySignature(publicKey, message, signatureHex){
  if (!publicKey || !message || !signatureHex) {
    return;
  }
  try {
      const msg = new TextEncoder().encode(message);
      const ver = p256.verify(
        hexToBytes(signatureHex),
        msg,
        hexToBytes(publicKey),
      );
      return ver;
    } catch (err) {
      console.log("Error while verifying: ", err);
    }
};

export async function importPublicKey(pubHex){
    const pubBuffer = hexToBuffer(pubHex);
    return await window.crypto.subtle.importKey(
        "spki",
        pubBuffer,
        {name:"ECDSA", namedCurve:"P-256"},
        true,
        ["verify"]

    );
}

export async function importPrivateKey(privHex){
    const privBuffer = hexToBuffer(privHex);
    return await window.crypto.subtle.importKey(
        "pkcs8",
        privBuffer,
        {name:"ECDSA", namedCurve:"P-256"},
        true,
        ["sign"]
    );
}