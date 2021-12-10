import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import ChatRoom from '../components/chatRoom';
import { initializeApp } from 'firebase/app';
import ChatGroup from '../components/chatGroup';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// initialization
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const auth = firebase.auth();
const db = firebase.firestore();

export default function Home() {
  const [user, setUser] = useState(() => auth.currentUser);
  // const [room, setRoom] = 

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.useDeviceLanguage();
  
    try {
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.log(error);
    }
  };
  
  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="container">
      <main>
        {user ? (
          <>
            <nav id="sign_out">
              <h2>Chat With Friends</h2>
              <button onClick={signOut}>Sign Out</button>
            </nav>
            {/* <ChatGroup user={user} db={db}/> */}

            {/* chat room component */}
            {/* TODO ChatGroupに置き換える ChatGroupの中でChatRoom */}
            {/* <ChatRoom user={user} db={db}/> */}
            <ChatGroup user={user} db={db}/>
          </>
        ) : (
          <section id="sign_in">
            <h1>Welcome to Chat Room</h1>
            <button onClick={signInWithGoogle}>Sign In With Google</button>
          </section>
        )}
      </main>
    </div>
  );
}
