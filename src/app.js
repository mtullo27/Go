import React, { useState } from "react";
import { signInWithGoogle, logOut} from './firebaseConfig';
import Button from "@mui/material/Button";

import './App.css';

function App() {
  const openUrl = (e) =>{
    window.open("http://localhost:3001/")
  }
  return (
    <div className="App">
      <header className="App-header">
        <label id="userEmail">Please Sign On</label>
        <Button onClick = {signInWithGoogle} id="signOnButton">Sign In</Button>
        <Button onClick = {logOut} id = "logOutButton">Log Out</Button>
        <Button onClick={openUrl}> go to google </Button>
      </header>
    </div>
  );
}

export default App;