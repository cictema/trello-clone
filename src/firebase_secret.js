import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

// ADD FIREBASE CONFIGURATION HERE
const firebaseConfig = {
    apiKey: "AIzaSyCOew4VSIi9eCtQtJ14cs1UpAxisJMHcSs",
    authDomain: "trelloclone-6f3d4.firebaseapp.com",
    projectId: "trelloclone-6f3d4",
    storageBucket: "trelloclone-6f3d4.appspot.com",
    messagingSenderId: "149595172888",
    appId: "1:149595172888:web:bfa9cc5778013e4473136d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db}