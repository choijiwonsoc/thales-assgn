import { useState } from "react";
import { generateKeyPair, signMessage, verifySignature, importPublicKey, importPrivateKey } from "./cryptoUtils";

export default function KeyPair() {
    const [keyPair, setKeyPair] = useState(null);
    const [message, setMessage] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [signatureHex, setSignatureHex] = useState('');
    const [isValid, setIsValid] = useState(null);
    const [mode, setMode] = useState('generate');

    const generateKeyPairMethod = async () => {
        try {
            const results = await generateKeyPair();
            setKeyPair(results.rawPair);
            setPublicKey(results.pubHex);
            setPrivateKey(results.privHex);
            setIsValid(null);

        } catch (err) {
            alert(`Error generating key pair: ${err}`)
            console.log("Error generating key pair: ", err);
        }
    }

    const handleImportKeys = async()=>{
        if (!publicKey || !privateKey) {
            alert("Please paste both keys first!");
            return;
        }
        try{
            const pubKeyObj = await importPublicKey(publicKey);
            const privKeyObj = await importPrivateKey(privateKey);
            setKeyPair({
                publicKey: pubKeyObj,
                privateKey: privKeyObj
            })
            setIsValid(null);
        }catch (err) {
            alert(`Error importing key pair: ${err}`)
            console.log("Error importing key pair: ", err);
        }
    }

    const signMessageMethod = async () => {
        if (!keyPair || !message) { return; }
        try {
            const results = await signMessage(message, keyPair);
            
            setSignatureHex(results);
        } catch (err) {
            alert(`Error while signing: ${err}`)
            console.err("Error while signing: ", err);
        }
    }

    const verifySignatureMethod = async () => {
        if (!keyPair || !message || !signatureHex) {
            return;
        }
        try {
            const result = await verifySignature(keyPair, message, signatureHex);
            setIsValid(result);
        } catch (err) {
            setIsValid(false);
            alert(`Error while verifying: ${err}`)
            console.log("Error while verifying: ", err);
        }
    }

    const buttonStyle = {
        backgroundColor: '#0070f3',
        color: 'white',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '14px',
        width: '100%'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '12px',
        fontWeight: '600',
        color: '#666',
        marginBottom: '4px'
    };

    return (
        <div style={{
            width:"400px",
            margin: '30px auto',
            padding: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#333',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
            {/* Key Generation Section */}
            <section style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '18px' }}>ECDSA Key Generation</h3>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', backgroundColor: '#f0f0f0', padding: '4px', borderRadius: '6px', justifyContent:'center' }}>
                    <button onClick={()=>{ setMode('generate'); setKeyPair(null); setPublicKey(''); setPrivateKey(''); }}>Generate</button>
                    <button onClick={()=>{ setMode('import'); setKeyPair(null); setPublicKey(''); setPrivateKey(''); }}>Import Keys</button>
                </div>
                

                {mode == "generate" ? (
                    <div style={{ marginTop: '12px' }}>
                        <button onClick={generateKeyPairMethod} style={buttonStyle}>Generate P-256 Keypair</button>
                        <label style={labelStyle}>Public Key</label>
                        <textarea readOnly value={publicKey} rows={4} />

                        <label style={labelStyle}>Private Key</label>
                        <textarea readOnly value={privateKey} rows={4} />
                    </div>
                ):(
                    <div>
                        <label style={labelStyle}>Paste Public Key (Hex)</label>
                        <textarea 
                            value={publicKey} 
                            placeholder="Paste spki public key hex here..."
                            onChange={(e) => setPublicKey(e.target.value)} 
                            rows={4} 
                
                        />

                        <label style={labelStyle}>Paste Private Key (Hex)</label>
                        <textarea 
                            value={privateKey} 
                            placeholder="Paste pkcs8 private key hex here..."
                            onChange={(e) => setPrivateKey(e.target.value)} 
                            rows={4} 
           
                        />
                        
                        <button onClick={handleImportKeys} style={{ ...buttonStyle, backgroundColor: '#28a745', marginTop: '15px' }}>
                            Load & Verify Pasted Keys
                        </button>
                    </div>
                )}
            </section>

            <section style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '18px' }}>Sign Message</h3>
                <input
                    type="text"
                    placeholder="Type message to sign..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        boxSizing: 'border-box',
                        fontSize: '14px'
                    }}
                />
                <button onClick={()=>signMessageMethod(message, keyPair)} disabled={!message} style={buttonStyle}>Sign</button>

                {signatureHex && (
                    <div style={{ marginTop: '12px' }}>
                        <label style={labelStyle}>Signature (Hex)</label>
                        <textarea readOnly value={signatureHex} rows={4} />
                    </div>
                )}
            </section>

            <section>
                <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '18px' }}>Verify Signature</h3>
                <button onClick={()=>verifySignatureMethod(keyPair, message, signatureHex)} disabled={!signatureHex} style={buttonStyle}>Verify</button>

                {isValid !== null && (
                    <div style={{
                        marginTop: '15px',
                        padding: '12px',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        backgroundColor: isValid ? '#e6f4ea' : '#fce8e6',
                        color: isValid ? '#137333' : '#c5221f',
                        border: `1px solid ${isValid ? '#a8dab5' : '#fad2cf'}`
                    }}>
                        {isValid ? "✓ Signature is valid!" : "✗ Signature is invalid!"}
                    </div>
                )}
            </section>
        </div>
    );


}