// firebase.js
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // firestore 모듈 가져오기
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCSjbFqHrJU_PwTjym1qDvG8qAwfII35lw",
  authDomain: "pet-tracker-65ea5.firebaseapp.com",
  projectId: "pet-tracker-65ea5",
  storageBucket: "pet-tracker-65ea5.appspot.com",
  messagingSenderId: "1068349352534",
  appId: "1:1068349352534:web:9756045a1e6c78512ba9f7",
  measurementId: "G-EQ83X48Q0E"
};

let app;
let auth;
let firestore;
let storage;

// Firebase 앱이 이미 초기화되었는지 확인
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);

  // Firebase Auth 초기화 (AsyncStorage 설정 포함)
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  app = getApp(); // 이미 초기화된 앱 가져오기
  auth = getAuth(app); // 기존 초기화된 Auth 가져오기
}

// Firestore 초기화
firestore = getFirestore(app);

// Storage 초기화
storage = getStorage(app);

// app, auth, firestore, storage를 내보내기
export { app, auth, firestore, storage }; // firestore도 내보내기
