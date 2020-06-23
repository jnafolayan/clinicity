import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

firebase.initializeApp({
  apiKey: "AIzaSyAT2LO95_fxvuP39_mku1nTyJ2ZIoz-z8Y",
  authDomain: "clinicity.firebaseapp.com",
  projectId: "clinicity",
});

export const firestore = firebase.firestore();
export const auth = firebase.auth();
