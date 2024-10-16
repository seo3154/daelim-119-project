// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-e8OouC92QNo_oxhGH_bD752GjwneT4g",
  authDomain: "instadaelim-a13d9.firebaseapp.com",
  projectId: "instadaelim-a13d9",
  storageBucket: "instadaelim-a13d9.appspot.com",
  messagingSenderId: "968393852170",
  appId: "1:968393852170:web:a431bda4afee6beb59e6f3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inistialize Firebase Authentication
// export const auth = getAuth(app); -> web

// auth for react-native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// firestore
// Storage
const storage = getStorage(app);

export { auth, storage };
