import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth"; // initializeAuth를 사용하지 않고 getAuth로 직접 초기화
import { getFirestore, collection, getDocs } from "firebase/firestore"; // collection과 getDocs 함수 임포트
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCSjbFqHrJU_PwTjym1qDvG8qAwfII35lw",
  authDomain: "pet-tracker-65ea5.firebaseapp.com",
  projectId: "pet-tracker-65ea5",
  storageBucket: "pet-tracker-65ea5.appspot.com", // 수정된 storageBucket
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
  auth = getAuth(app); // getAuth로 초기화
} else {
  app = getApp(); // 이미 초기화된 앱 가져오기
  auth = getAuth(app); // 기존 초기화된 Auth 가져오기
}

// Firestore 초기화
firestore = getFirestore(app);

// Storage 초기화
storage = getStorage(app);

export const fetchProducts = async () => {
  try {
    const productsCollection = collection(firestore, "products");
    const productsSnapshot = await getDocs(productsCollection);
    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return products;
  } catch (error) {
    console.error("Firestore에서 데이터를 가져오는 중 오류 발생:", error.message);
    throw error;
  }
};

// app, auth, firestore, storage를 내보내기
export { app, auth, firestore, storage }; // firestore도 내보내기
