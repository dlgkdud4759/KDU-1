import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// 장소 정보 추가 함수
const addLocation = async (locationData) => {
  try {
    const docRef = await addDoc(collection(db, "Location"), locationData);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// 예시 데이터
const newLocation = {
  name: "동물병원 A",
  address: "서울시 강남구",
  coordinates: { lat: 37.5665, lng: 126.9780 },
  phone: "010-1234-5678",
  rating: 4.5,
  reviews: ["친절한 병원입니다.", "의사 선생님이 아주 친절했어요!"]
};

// 장소 정보 저장
addLocation(newLocation);
