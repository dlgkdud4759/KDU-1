import React, { useEffect, useState } from "react";
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { firestore } from "../Firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { getAuth } from "firebase/auth";  // Firebase 인증 모듈 추가

const ProductDetails = ({ navigation }) => {
  const route = useRoute();
  const { id } = route.params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImageUrl = async (gsUrl) => {
    try {
      if (!gsUrl.startsWith("gs://")) {
        throw new Error("잘못된 gs:// URL입니다.");
      }

      const bucketUrl = "gs://pet-tracker-65ea5.appspot.com/";
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

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (!id) {
          throw new Error("ID가 전달되지 않았습니다.");
        }

        console.log("상품 ID:", id);
        const productDoc = doc(firestore, "products", id);
        const productSnapshot = await getDoc(productDoc);

        if (!productSnapshot.exists()) {
          throw new Error("Firestore에서 문서를 찾을 수 없습니다.");
        }

        const data = productSnapshot.data();
        const image = data.imageUrl ? await fetchImageUrl(data.imageUrl) : null;

        setProduct({ ...data, image });
      } catch (err) {
        console.error("상품 정보를 불러오는 중 오류 발생:", err.message);
        setError(err.message || "상품 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (!id) {
      setError("잘못된 상품 ID입니다.");
      setLoading(false);
      return;
    }

    fetchProductDetails();
  }, [id]);

  const handlePayment = async () => {
    try {
      // Firebase에서 로그인한 사용자 정보를 가져옵니다.
      const user = getAuth().currentUser;
      if (!user) {
        throw new Error("로그인된 사용자가 없습니다.");
      }

      const response = await axios.post('http://192.168.199.59:5000/api/payment', {
        name: product.name,
        amount: product.price,
      });

      const paymentUrl = response.data.paymentUrl;

      // 결제 정보와 사용자 정보를 Firestore에 저장
      const purchasesCollection = collection(firestore, "purchases");
      await addDoc(purchasesCollection, {
        userId: user.uid,  // 로그인한 사용자 정보 추가
        userEmail: user.email,  // 이메일도 추가
        productId: id,
        name: product.name,
        price: product.price,
        image: product.image || "default-image-url",
        purchaseDate: new Date().toISOString(),
      });

      console.log("결제 상품 정보가 Firestore에 저장되었습니다.");

      // 결제 페이지로 이동
      Linking.openURL(paymentUrl);

      // 뒤로 가기
      navigation.goBack();
    } catch (error) {
      console.error("결제 요청 중 오류 발생:", error.response ? error.response.data : error.message);
      setError("결제 요청 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <Text>상품 정보를 불러오는 중입니다...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={styles.productDetails}>
      <Text style={styles.header}>{product.name}</Text>
      <Image
        source={{ uri: product.image || "default-image-url" }}
        style={styles.productDetailImage}
      />
      <View style={styles.productDescription}>
        <Text style={styles.descriptionText}>{product.description}</Text>
        <Text style={styles.descriptionText}>가격: {product.price.toLocaleString()} 원</Text>
        <TouchableOpacity style={styles.paymentBtn} onPress={handlePayment}>
          <Text style={{ color: 'white' }}>결제하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productDetails: {
    maxWidth: 600,
    marginHorizontal: 'auto',
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    top: 50,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  productDetailImage: {
    alignSelf: 'center',
    maxWidth: '100%',
    borderRadius: 8,
    marginBottom: 20,
  },
  productDescription: {
    marginTop: 20,
  },
  descriptionText: {
    marginVertical: 10,
  },
  paymentBtn: {
    width: '100%',
    padding: 10,
    backgroundColor: '#007bff',
    color: 'white',
    borderWidth: 0,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ProductDetails;
