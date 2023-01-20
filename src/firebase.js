import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-d0suoFOYrdwtMqiXmNryQNuRJs9aqeY",
  authDomain: "online-sound-board.firebaseapp.com",
  projectId: "online-sound-board",
  storageBucket: "online-sound-board.appspot.com",
  messagingSenderId: "551647982150",
  appId: "1:551647982150:web:df6220434d7e0db0345047",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
