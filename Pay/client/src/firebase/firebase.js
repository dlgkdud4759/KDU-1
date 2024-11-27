// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Firebase Storage import

const firebaseConfig = {
  apiKey: "AIzaSyCSjbFqHrJU_PwTjym1qDvG8qAwfII35lw",
  authDomain: "pet-tracker-65ea5.firebaseapp.com",
  projectId: "pet-tracker-65ea5",
  storageBucket: "pet-tracker-65ea5.firebasestorage.app",
  messagingSenderId: "1068349352534",
  appId: "1:1068349352534:web:9756045a1e6c78512ba9f7",
  measurementId: "G-EQ83X48Q0E"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore 초기화
const db = getFirestore(app);

// Firebase Storage 초기화
const storage = getStorage(app); // Firebase Storage 초기화

// Firestore에서 제품 데이터 가져오기
export const fetchProducts = async () => {
  const productsCollection = collection(db, "products");
  const productsSnapshot = await getDocs(productsCollection); // 오타 수정: praoducts -> products
  const products = productsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return products;
};

export { db, storage }; // db와 storage 내보내기
export default app;
