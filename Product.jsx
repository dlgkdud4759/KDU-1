import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const Product= ({ route, navigation }) => {
  const { productId } = route.params;  // 상품 ID를 가져옵니다.
  const product = products.find(item => item.id === productId);  // 상품 정보 찾기

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <Text style={styles.productPrice}>{`₩${product.price.toLocaleString()}`}</Text>

      <TouchableOpacity
        style={styles.paymentButton}
        onPress={() => navigation.navigate('Checkout', { product })}
      >
        <Text style={styles.paymentButtonText}>결제하기</Text>
      </TouchableOpacity>
    </View>
  );
};  

export default Product;