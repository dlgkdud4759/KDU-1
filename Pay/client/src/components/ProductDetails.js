import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import axios from "axios";
import "./ProductDetails.css"; // CSS 파일 임포트

const ProductDetails = () => {
  const { id } = useParams(); // URL에서 제품 ID 가져오기
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가

  // 이미지 URL 가져오기
  const fetchImageUrl = async (gsUrl) => {
    try {
      if (!gsUrl.startsWith("gs://")) {
        throw new Error("잘못된 gs:// URL입니다.");
      }

      const bucketUrl = "gs://pet-tracker-65ea5.appspot.com/"; // Firebase Storage 버킷 URL
      const filePath = gsUrl.replace(bucketUrl, "");

      if (!filePath) {
        throw new Error("경로를 추출할 수 없습니다.");
      }

      const storage = getStorage();
      const storageRef = ref(storage, filePath);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("이미지 URL을 가져오는 중 오류 발생:", error.message);
      return null;
    }
  };

  // 상품 정보 불러오기
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productDoc = doc(db, "products", id);
        const productSnapshot = await getDoc(productDoc);
        if (productSnapshot.exists()) {
          const data = productSnapshot.data();
          // imageUrl을 Firestore에서 가져온 후, URL로 변환
          const image = data.imageUrl ? await fetchImageUrl(data.imageUrl) : null;
          setProduct({ ...data, image: image });
        } else {
          setError("상품 정보를 찾을 수 없습니다.");
        }
      } catch (err) {
        setError("상품 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // 결제 처리
  const handlePayment = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/payment", {
        name: product.name,
        amount: product.price, // 상품의 가격을 결제 금액으로 사용
      });
      // 결제 페이지로 리디렉션
      window.location.href = response.data.paymentUrl; // Toss 결제 페이지로 이동
    } catch (error) {
      console.error("결제 요청 중 오류 발생:", error);
      setError("결제 요청 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>상품 정보를 불러오는 중입니다...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-details">
      <h2>{product.name}</h2>
      <img src={product.image || "default-image-url"} alt={product.name} className="product-detail-image" />
      <div className="product-description">
        <p>{product.description}</p>
        <p>가격: {product.price.toLocaleString()} 원</p>
        {/* 기존 버튼을 그대로 사용 */}
        <button onClick={handlePayment} className="payment-btn">
          결제하기
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
