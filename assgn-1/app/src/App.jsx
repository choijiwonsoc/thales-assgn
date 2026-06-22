import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Hash from './hashing'
import KeyPair from './keypair'

function App() {

  return (
    <>
      <section id="center">
        <div>
          <Hash/>
          <KeyPair/>
        </div>

      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
