// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore, collection, getDocs} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQqFTEAPaJcp1Ra03l-E0WcJRU5dXQg6Q",
  authDomain: "react-note-41205.firebaseapp.com",
  projectId: "react-note-41205",
  storageBucket: "react-note-41205.appspot.com",
  messagingSenderId: "40069089416",
  appId: "1:40069089416:web:5507a517e0d894d188373d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const noteCollection = collection(db, "notes"); 

// async function checkFirebaseConnection() {
//     try {
//         // Attempt to read from Firestore
//         const querySnapshot = await getDocs(noteCollection);
//         if (!querySnapshot.empty) {
//             console.log("Firebase is connected and data is available.");
//         } else {
//             console.log("Firebase is connected but no data found.");
//         }
//     } catch (error) {
//         console.error("Error connecting to Firebase:", error);
//     }
// }

// checkFirebaseConnection();