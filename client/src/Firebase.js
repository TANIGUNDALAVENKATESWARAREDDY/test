
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA0cPNSmNOXeiFRPS2WVqG2pASUpO0LLXo",
  authDomain: "vissms-36011.firebaseapp.com",
  projectId: "vissms-36011",
  storageBucket: "vissms-36011.appspot.com",
  messagingSenderId: "1054135130636",
  appId: "1:1054135130636:web:f182c45e549813b2e46c29",
  measurementId: "G-1YH3TDVQJ3"
};


export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);