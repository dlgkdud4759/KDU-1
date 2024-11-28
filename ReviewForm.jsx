import React, { useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { TextInput, TouchableOpacity, Text, Alert, StyleSheet, View } from 'react-native';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { firestore, auth } from '../Firebase';

const ReviewForm = () => {
    const [review, setReview] = useState('');
    const [userName, setUserName] = useState('');
    const route = useRoute();
    const navigation = useNavigation();
    const { place } = route.params;

    console.log('place', place);

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

    // 리뷰 작성 함수
    const handleAddReview = async () => {
        if (!review.trim()) {
            Alert.alert('리뷰 내용을 입력해주세요.');
            return;
        }

        if (!place?.placeId) {
            Alert.alert('장소 정보가 없습니다. 장소를 확인해주세요.');
            return;  // placeId가 없으면 리뷰 작성하지 않음
        }

        try {
            const newReview = {
                text: review,
                placeId: place.placeId,
                userName: userName || 'Unknown',
                userId: auth.currentUser?.uid || 'unknown',
                createdAt: new Date().toISOString(),
            };

            await addDoc(reviewsCollection, newReview);
            setReview('');
            Alert.alert('리뷰가 작성되었습니다!');

            navigation.goBack();
        } catch (error) {
            console.error('리뷰 작성 중 오류 발생:', error);
        }
    };

    return (
        <View style={styles.reviewForm}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{place?.name || '이름 없음'}</Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder="리뷰를 작성해주세요."
                value={review}
                onChangeText={setReview}
                multiline={true}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAddReview}>
                <Text style={styles.submitText}>작성하기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    reviewForm: {
        top: '10%',
        paddingLeft: '5%',
        paddingRight: '5%',
    },
    titleContainer: {
        height: 30,
        marginBottom: 50,
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0075FF',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        minHeight: 250,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#ABC4FF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        shadowOpacity: 0.2,
        shadowOffset: {
            height: 2,
        }
    },
    submitText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ReviewForm;