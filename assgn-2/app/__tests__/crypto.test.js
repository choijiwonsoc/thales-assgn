import { handleHash, verifySignature, generateKeyPair, signMessage } from "../cryptoUtils";

const nodeCrypto = require("crypto");
if (typeof global.crypto !== "object") {
  global.crypto = {};
}
if (typeof global.crypto.getRandomValues !== "function") {
  global.crypto.getRandomValues = (array) => {
    const bytes = nodeCrypto.randomBytes(array.length);
    for (let i = 0; i < array.length; i++) {
      array[i] = bytes[i];
    }
    return array;
  };
}

jest.mock("expo-crypto", () => {
  const cryptoEngine = require("crypto");
  return {
    CryptoDigestAlgorithm: {
      SHA256: "SHA-256",
    },
    digestStringAsync: jest.fn(async (algorithm, data) => {
      if (algorithm === "SHA-256") {
        return cryptoEngine.createHash("sha256").update(data).digest("hex");
      }
      return "";
    }),
  };
});


describe('Mobile Cryptographic Core Engine - Validation Vectors', () => {

    // 1. SHA-256 Test Vectors
    describe('SHA-256 Tests', () => {
        test('Verifies industry standard vector "abc"', async () => {
            const hash = await handleHash('abc');
            expect(hash).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
        });

        test('Verifies empty string hash vector', async () => {
            const hash = await handleHash('');
            expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
        });
    });

    // 2. ECDSA P-256 Pipeline Integration Tests
    describe('ECDSA P-256 Pipeline', () => {
        test('Executes end-to-end keygen, signature generation, and verification', async () => {
            const payload = "Mobile Transaction Token Verification";
            
            const keys = await generateKeyPair();
            expect(keys.pubHex).toBeDefined();

            const signature = await signMessage(payload, keys.rawPair);
            expect(signature).toBeDefined();

            const isValid = await verifySignature(keys.pubHex, payload, signature);
            expect(isValid).toBe(true);
        });
    });
});