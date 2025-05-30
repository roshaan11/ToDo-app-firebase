import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth,validatePassword,signOut,updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"
import { setLogLevel,getFirestore, where, getDocs, collection,doc,getDoc,deleteDoc, addDoc,setDoc,serverTimestamp,query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"; 


const firebaseConfig = {
  apiKey: "AIzaSyAO1ojMZjWZ-YVvd15achMTjWjol3fOON8",
  authDomain: "todo-app-11d0b.firebaseapp.com",
  projectId: "todo-app-11d0b",
  storageBucket: "todo-app-11d0b.firebasestorage.app",
  messagingSenderId: "567131265504",
  appId: "1:567131265504:web:5255c74ea5443fb505f385",
  measurementId: "G-EERTRYJ58R"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

setLogLevel('error');

export{
    auth,
    validatePassword,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    updateProfile,
    signOut,
    getFirestore,
    db,
    addDoc,
    doc,
    setDoc,
    getDoc,
    collection,
    serverTimestamp,
    query, orderBy, onSnapshot, where, getDocs,deleteDoc
}
