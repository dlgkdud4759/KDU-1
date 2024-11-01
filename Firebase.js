import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage 가져오기

// Firebase 설정 객체
const firebaseConfig = {
  apiKey: "AIzaSyD2VPWGSBDp_h0KKoJjVGbSYjNQYcVh21I",
  authDomain: "pet-tracker-ba9d3.firebaseapp.com",
  projectId: "pet-tracker-ba9d3",
  storageBucket: "pet-tracker-ba9d3.appspot.com",
  messagingSenderId: "600924952504",
  appId: "1:600924952504:web:5c100b1192b7c27587e14d",
  measurementId: "G-YVFV5TN8HB"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase Auth 초기화
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage) // AsyncStorage로 상태를 유지
});

// Firestore 초기화
const firestore = getFirestore(app); // Firestore 데이터베이스 인스턴스 생성

// app, auth, firestore를 내보내기
export { app, auth, firestore };
