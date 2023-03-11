import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API,
  authDomain: "gowhere-5a866.firebaseapp.com",
  databaseURL:
    "https://gowhere-5a866-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "gowhere-5a866",
  storageBucket: "gowhere-5a866.appspot.com",
  messagingSenderId: "795299881946", // check what is this
  appId: "1:141807194757:web:ae0277ef2b415d34700fec", // check what is this
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);
export const storage = getStorage();
export const auth = getAuth(firebaseApp);
