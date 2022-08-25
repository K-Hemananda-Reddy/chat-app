
import React from 'react';
import './App.css';
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Firestore } from 'firebase/firestore';
import { useRef, useState } from 'react';

firebase.initializeApp({
    apiKey: "AIzaSyC_Ib_HKMbBYqq7maz0P_zISwF8fU8KAOI",
    authDomain: "superchat-246d1.firebaseapp.com",
    projectId: "superchat-246d1",
    storageBucket: "superchat-246d1.appspot.com",
    messagingSenderId: "250576695053",
    appId: "1:250576695053:web:ef1b10e46887b4ab320a44",
    measurementId: "G-WR03BLHB91"
})

function App() {
  const[user]=useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
        
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle=()=>{
    const provider=new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick={signInWithGoogle}>sign In With Google</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={()=>auth.SignOut()}>Sign Out</button>
  )
}

function ChatRoom(){

  const dummy=useRef()
  const messageRef=firestore.collection('messages');
  const query=messagesRef.orderBy('createdAt').limit(25);
  const [messages]=useCollectionData(query,{idField:'id'});

  const[formValue,setFormValue]=useState('');

  const sendMessage=async(e)=>{
    e.preventDefault();
    const{uid,photoURL}=auth.currentUser;
    await messageRef.add({
      text: formValue,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
    setFormValue('');

    dummy.current.scrollIntoView({behavior:'smooth'});
  }
  return(
    <>
     <main>
      {messages&&messages.map(msg=><ChatMessage key={msg.id} message={msg}/>)}
      <div ref={dummy}></div>
     </main>
     <form>
      <input value={formValue} onChange={(e)=>setFormValue(e.target.value)}/>
      <button type="submit">send</button>
     </form>
    </>
  )
}

function ChatMessage(props){
  const {text,uid}=props.message;
  const messageClass=uid===auth
  .currentUser.uid?'sent':'received';
  return(
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="not there"/>
        <p>{text}</p>
    </div>
  )
}

export default App;
