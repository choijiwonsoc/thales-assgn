import { useState } from "react";
import { handleHash } from "./cryptoUtils";

export default function Hash(){
    const [inputText, setInputText] = useState('');
    const [hashResult, setHashResult] = useState('');

    const handleHashMethod = async (text)=>{
        setInputText(text);
        try{
            const result = await handleHash(text);
            setHashResult(result);
        }catch(err){
            alert(`Error during hashing: ${err}`)
            console.error("Error found: ", err);
        }
    }
    return(
        <div style={{
            maxWidth: '500px',
            margin: '30px auto',
            padding: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#333',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
            <h3>SHA-256 Hashing</h3>
            <textarea value = {inputText} onChange={(e)=>handleHashMethod(e.target.value)}/>
            <div style={{
                wordBreak: 'break-all', 
                overflowWrap: 'break-word'
            }}>{hashResult}</div>
        </div>
    )
}