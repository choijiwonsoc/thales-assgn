
## 1. SHA-256 Hashing Engine
* System MUST accept an arbitrary plaintext input string via a mobile native virtual keyboard text input field.
* System MUST dynamically calculate the SHA-256 hash asynchronously using secure native device modules (`expo-crypto`).
* System MUST output the digest strictly as a lowercase HEX string.
* Wiping the text input field safely yields the standard empty string vector block (`e3b0c442...`).

## 2. ECC P-256 Key Management and Digital Signatures
* System MUST generate valid ECDSA keypairs matching the NIST P-256 (`secp256r1`) curve using a verified high-performance cryptographic module (e.g., `@noble/curves`).
* System MUST sign arbitrary text using the loaded private key token, returning a valid signature payload formatted as a HEX string.
* System MUST accept an input signature string, verify it against the matching payload and public key, and output a clear, color-coded native UI Boolean status banner (`✓ Signature is valid!` / `✗ Signature is invalid!`).
* System MUST provide a "Copy to Clipboard" utility button directly underneath output HEX fields, utilizing native OS clipboard bridges to ease string transfers inside simulators.