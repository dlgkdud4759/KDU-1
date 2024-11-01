import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";  // Storage를 사용하기 위해 추가
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

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

// Firebase 앱이 초기화되었는지 확인
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // 이미 초기화된 앱이 있을 경우 해당 앱을 사용
}

// Firebase Auth 초기화
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Firestore 초기화
const db = getFirestore(app); // Firestore 데이터베이스 인스턴스 생성

// Storage 초기화
const storage = getStorage(app);  // Storage 인스턴스 생성

// app, auth, db를 내보내기
export { app, auth, db, storage };