import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkjSZm1qOovwRB1Hr6HrTmPhycnuAOQms",
  authDomain: "prueba-18bd8.firebaseapp.com",
  projectId: "prueba-18bd8",
  storageBucket: "prueba-18bd8.appspot.com",
  messagingSenderId: "735934106892",
  appId: "1:735934106892:web:4abed254e8eff905ab4d29",
  measurementId: "G-N2TSL3MRCX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);