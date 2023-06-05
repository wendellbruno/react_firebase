import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDbfXCn0K5KjWrxMmv-VrMrJILK9x4toKo",
    authDomain: "cursoreact-fdfdb.firebaseapp.com",
    projectId: "cursoreact-fdfdb",
    storageBucket: "cursoreact-fdfdb.appspot.com",
    messagingSenderId: "736976873626",
    appId: "1:736976873626:web:048e992367a119fb939723",
    measurementId: "G-1KZT3LBFYZ"
  };

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export { db, auth }