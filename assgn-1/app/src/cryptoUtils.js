
export async function handleHash(text) {
  try {
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(text);

    const hashBuffer = await window.crypto.subtle.digest("SHA-256", dataBytes);
    const hexString = bufferToHex(hashBuffer);
    return hexString;
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
    const pair = await window.crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      true,
      ["sign", "verify"],
    );

    const pubBuffer = await window.crypto.subtle.exportKey(
      "spki",
      pair.publicKey,
    );
    const privBuffer = await window.crypto.subtle.exportKey(
      "pkcs8",
      pair.privateKey,
    );
    return {
        pubHex: bufferToHex(pubBuffer),
        privHex: bufferToHex(privBuffer),
        rawPair: pair
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
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message);
    const signatureBuffer = await window.crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      keyPair.privateKey,
      messageBytes,
    );
    return bufferToHex(signatureBuffer);
  } catch (err) {
    console.err("Error while signing: ", err);
  }
};

export async function verifySignature(keyPair, message, signatureHex){
  if (!keyPair || !message || !signatureHex) {
    return;
  }
  try {
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message);
    const signatureBytes = hexToBuffer(signatureHex);

    const result = await window.crypto.subtle.verify(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      keyPair.publicKey,
      signatureBytes,
      messageBytes,
    );
    return result;
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