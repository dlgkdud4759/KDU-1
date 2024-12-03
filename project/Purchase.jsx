import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from "../Firebase";
import { getAuth } from "firebase/auth"; // Firebase 인증 모듈 추가

const Purchase = ({ navigation }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        // Firebase에서 로그인한 사용자 정보 가져오기
        const user = getAuth().currentUser;
        if (!user) {
          throw new Error("로그인된 사용자가 없습니다.");
        }

        const purchasesCollection = collection(firestore, 'purchases');
        // 로그인한 사용자 ID를 기준으로 쿼리
        const q = query(purchasesCollection, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        const purchaseData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPurchases(purchaseData || []);
      } catch (error) {
        console.error('구매 데이터 가져오기 오류:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text>뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>구매 목록</Text>
      </View>
      {purchases.length > 0 ? (
        <FlatList
          data={purchases}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text>구매한 상품이 없습니다.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop:30,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDescription: {
    color: '#666',
    marginVertical: 4,
  },
  itemPrice: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default Purchase;
