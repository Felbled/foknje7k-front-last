// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsTZlmfiI4xwNNvXmds8BexOV8GXpIEF8",
  authDomain: "foknje7ik-29f5f.firebaseapp.com",
  projectId: "foknje7ik-29f5f",
  storageBucket: "foknje7ik-29f5f.appspot.com",
  messagingSenderId: "271914008788",
  appId: "1:271914008788:web:4e5b4d8727b7ed2bfd3b41",
  measurementId: "G-SJFZQZN01F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fileDB = getStorage(app);
const txtDB = getFirestore(app);


export{fileDB, txtDB}
