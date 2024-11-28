import React, { useState, useEffect } from 'react';
import { Modal, View, Image, Text, StyleSheet, TextInput, TouchableOpacity, Alert, PanResponder, Animated, ScrollView, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { firestore, auth } from '../Firebase';
import { useNavigation } from '@react-navigation/native';
import ReviewForm from './ReviewForm';

const formatDate = (date) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long',
  };
  const formattedDate = new Date(date).toLocaleDateString('ko-KR', options);
  return formattedDate.replace(/\./g, '.');
};

const { height } = Dimensions.get('window'); // 화면 높이 가져오기

const ModalComponent = ({ place, onClose }) => {
  const [review, setReview] = useState(''); // 리뷰 입력 상태
  const [reviews, setReviews] = useState([]); // 기존 리뷰 상태
  const [reviewCount, setReviewCount] = useState(0);
  const [slideAnim] = useState(new Animated.Value(height));
  const [isVisible, setIsVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const reviewsCollection = collection(firestore, 'reviews')

  // Firebase에서 로그인한 유저의 이름을 가져오는 함수
  const fetchUserName = async () => {
    const userId = auth.currentUser?.uid;
    console.log("현재 유저 ID:", userId); // 유저 ID 확인
    if (!userId) {
      console.log("로그인되지 않은 사용자입니다.");
      return;
    }

    try {
      // pets 컬렉션에서 특정 userId에 해당하는 데이터를 가져오기 위해 쿼리 생성
      const petsCollection = collection(firestore, 'pets');
      const q = query(petsCollection, where("userId", "==", userId)); // userId로 필터링

      // 쿼리를 실행하여 해당 유저의 데이터 가져오기
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return;
      }

      // 유저 정보가 존재하면 이름을 설정
      querySnapshot.forEach(doc => {
        setUserName(doc.data().name);  // 유저 이름 상태 업데이트
      });

    } catch (error) {
      Alert.alert('유저 정보를 불러오지 못했습니다.', error.message);
      console.error('유저 이름을 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchUserName();
  }, []);

  // Firestore에서 리뷰 데이터를 가져오는 함수
  const fetchReviews = async () => {
    if (!place?.placeId) return;

    try {
      const reviewsQuery = query(
        reviewsCollection,
        where('placeId', '==', place.placeId)
      );
      const querySnapshot = await getDocs(reviewsQuery);
      console.log("가져온 리뷰 수:", querySnapshot.size);
      setReviewCount(querySnapshot.size);

      const fetchedReviews = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log("리뷰 데이터:", data);
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setReviews(fetchedReviews);
    } catch (error) {
      console.error('리뷰 데이터를 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    if (place && place.placeId) {
      handleOpenModal();
      fetchReviews();
    }
  }, [place]);

  useEffect(() => {
    fetchUserName();
  }, []); // 빈 배열로 유지

  // 리뷰 삭제 함수
  const handleDeleteReview = async (id, userId) => {
    if (userId !== auth.currentUser?.uid) {
      Alert.alert('자신의 리뷰만 삭제할 수 있습니다.');
      return;
    }

    try {
      // 삭제하려는 리뷰의 id가 올바른지 확인
      const reviewDocRef = doc(reviewsCollection, id);
      await deleteDoc(reviewDocRef);
      Alert.alert('리뷰가 삭제되었습니다!');
      fetchReviews(); // 리뷰 목록 새로고침
    } catch (error) {
      console.error('리뷰 삭제 중 오류 발생:', error);
    }
  };

  const handleOpenModal = () => {
    setIsVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
      setReview('');
      onClose();
    });
  };

  const handleNavigateToReviewForm = () => {
    navigation.navigate('ReviewForm', { place: place });
    handleCloseModal();
  };

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={handleCloseModal}
    >
      <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
        <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{place?.name || '이름 없음'}</Text>
        <Text style={styles.address}>{place?.address || place?.vicinity || '주소 정보 없음'}</Text>
        {place?.formatted_phone_number && (
          <Text style={styles.details}>전화번호 {place.formatted_phone_number} <Text style={styles.dot}>·</Text> 방문자 리뷰 {reviewCount || 0}</Text>
        )}

        {/* 리뷰 작성 버튼 클릭 시 ReviewForm 페이지로 이동 */}
        <TouchableOpacity style={styles.ReviewButton} onPress={handleNavigateToReviewForm}>
          <Text style={styles.ReviewForm}>리뷰 작성</Text>
        </TouchableOpacity>

        {/* 작성된 리뷰 표시 (스크롤 가능) */}
        <View style={styles.reviewsContainer}>
          <Text style={styles.reviewsTitle}>작성된 리뷰 <Text style={styles.Count}>{reviewCount}</Text></Text>
          <ScrollView contentContainerStyle={styles.reviewsScroll}>
            {reviews.length > 0 ? (
              reviews.map((item) => (
                <View key={item.id} style={styles.reviewItem}>
                  <View style={styles.userInfo}>
                    <Image
                      source={{ uri: item.profileImage || 'https://placekitten.com/40/40' }} // 프로필 이미지 예시
                      style={styles.profileImage}
                    />
                    <View>
                      <Text style={styles.userName}>{item.userName}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteReview(item.id, item.userId)} style={styles.delete}>
                      <Text style={{ color: 'red' }}>삭제</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.reviewText}>{item.text}</Text>
                  <Text style={styles.reviewDate}>{formatDate(new Date(item.createdAt))}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noReviewsText}>작성된 리뷰가 없습니다.{'\n'}리뷰를 작성해주세요.</Text>
            )}
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    height: '70%',
    position: 'absolute',
    bottom: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 20,
    padding: 5,
  },
  closeText: {
    fontSize: 20,
    color: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0075FF',
    marginBottom: 10,
    textAlign: 'center',
    marginRight: 'auto',
  },
  address: {
    fontSize: 14,
    marginBottom: 3,
    textAlign: 'center',
    marginRight: 'auto',
  },
  openingHoursContainer: {
    marginTop: 10,
  },
  details: {
    fontSize: 14,
    color: '#555',
  },
  details: {
    fontSize: 14,
    marginBottom: 5,
  },
  reviewSection: {
    marginTop: 20,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ReviewButton: {
    marginLeft: 'auto',
  },
  ReviewForm: {
    fontSize: 14,
    color: '#0075FF',
    fontWeight: 'bold',
  },
  dot: {
    color: '#D9D9D9'
  },
  reviewsContainer: {
    marginTop: 20,
    maxHeight: 400,
  },
  reviewsScroll: {
    paddingBottom: 20,
  },
  reviewItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  reviewsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  Count: {
    color: '#999999',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#F1F1F5',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  delete: {
    marginLeft: 'auto',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 'auto',
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 5,
  },
  noReviewsText: {
    height: 300,
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    top: '40%',
  },
});

export default ModalComponent;