import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firebase Storage에서 gs:// URL을 https://로 변환하여 다운로드 URL을 가져오는 함수
  const fetchImageUrl = async (gsUrl) => {
    try {
      if (!gsUrl.startsWith("gs://")) {
        throw new Error("잘못된 gs:// URL입니다.");
      }

      const bucketUrl = "gs://pet-tracker-65ea5.appspot.com/"; // 실제 Firebase Storage 버킷 URL을 사용
      const filePath = gsUrl.replace(bucketUrl, "");

      if (!filePath) {
        throw new Error("경로를 추출할 수 없습니다.");
      }

      const storage = getStorage();
      const storageRef = ref(storage, filePath);
      return await getDownloadURL(storageRef); // 다운로드 URL 반환
    } catch (error) {
      console.error("이미지 URL을 가져오는 중 오류 발생:", error.message);
      return "https://via.placeholder.com/150"; // 오류 시 기본 이미지 URL 설정
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products");
        const productsSnapshot = await getDocs(productsCollection);

        const productsList = await Promise.all(
          productsSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const imageUrl = data.imageUrl
              ? await fetchImageUrl(data.imageUrl)
              : "https://via.placeholder.com/150"; // 이미지가 없는 경우 기본 이미지 설정
            return {
              id: doc.id,
              ...data,
              image: imageUrl, // 이미지 URL을 반환
            };
          })
        );
        setProducts(productsList);
      } catch (error) {
        console.error("상품 목록을 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>상품 목록을 불러오는 중입니다...</p>;

  return (
    <div className="product-list">
      <h2>상품 목록</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>가격: {product.price.toLocaleString()} 원</p>
              <Link to={`/product/${product.id}`}>
                <button className="details-btn">상세 보기</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
