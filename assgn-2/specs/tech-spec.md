## Architecture Overview
The solution is deployed as an isolated, client-side application requiring no backend servers or external third-party API configurations. All cryptographic execution operations occur locally using native platform primitives.

* **Web Framework:** React.js / Vite
* **Cryptographic Core:** Native W3C Web Crypto API (`window.crypto.subtle`)

## Core Architectural Workflows

### 1. Verification Flow with Raw Hex Token Imports
#### User Paste Public Hex
#### hexToBuffer Conversion
#### subtle.importKey ("spki")
#### Loaded CryptoKey Object
#### subtle.verify Engine
#### Result Validation UI
