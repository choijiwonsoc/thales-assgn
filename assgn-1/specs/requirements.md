## 1. SHA-256 Hashing Engine
* System MUST accept an arbitrary plaintext input string from the user.
* System MUST dynamically calculate the SHA-256 hash using native browser/device Web Crypto APIs.
* System MUST output the digest strictly as a lowercase HEX string.
* Wiping the plaintext field safely yields the standard empty string vector block.

## 2. ECC P-256 Key Management and Digital Signatures
* System MUST generate valid ECDSA keypairs matching the NIST P-256 curve.
* System MUST expose separate Generation and Manual Import operational views to the user.
* System MUST sign arbitrary text using the loaded private key token, returning a valid signature payload formatted as a HEX string.
* System MUST accept an input signature string, verify it against the matching payload and public key, and output a clear Boolean status UI indicator (`Valid` / `Invalid`).