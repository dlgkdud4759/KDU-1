import React, { useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { TextInput, TouchableOpacity, Text, Alert, StyleSheet, View, Image, Keyboard, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { firestore, auth } from '../Firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { SvgXml } from 'react-native-svg';
import { Back, Camera } from './SvgIcon';

const ReviewForm = () => {
    const [review, setReview] = useState('');
    const [userName, setUserName] = useState('');
    const [imageUri, setImageUri] = useState([]);
    const route = useRoute();
    const navigation = useNavigation();
    const { place } = route.params;

    const reviewsCollection = collection(firestore, 'reviews');
    const storage = getStorage();

    const generateFileName = (uri) => {
        const timestamp = Date.now();
        const extension = uri.split('.').pop(); // 파일 확장자 추출
        return `${timestamp}.${extension}`;
    };

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

    // 이미지 선택 함수
    const handleImagePick = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permission.granted) {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.CameraType.Images,
                allowsMultipleSelection: true, // 다중 선택 활성화
                quality: 1,
            });

            if (!result.canceled) {
                const uris = result.assets.map(asset => asset.uri); // 선택한 이미지 URI 배열
                setImageUri(uris); // 배열로 상태 업데이트
            }
        } else {
            Alert.alert('이미지 선택 권한이 없습니다.');
        }
    };

    // Firebase에 이미지 업로드 함수
    const uploadImage = async (uri) => {
        try {
            console.log('이미지 업로드 시작:', uri);

            // URI로부터 Blob을 생성
            const response = await fetch(uri);
            if (!response.ok) {
                throw new Error(`fetch 응답 실패: ${response.status}`);
            }
            const blob = await response.blob();
            console.log('Blob 생성 성공:', blob);

            // 업로드할 파일 이름 생성
            const fileName = generateFileName(uri);
            const fileRef = ref(storage, `reviewImages/${fileName}`);
            console.log('Firebase Storage 참조:', fileRef);

            // 이미지 업로드
            const uploadResult = await uploadBytes(fileRef, blob);
            console.log('이미지 업로드 성공:', uploadResult);

            // 업로드된 이미지의 다운로드 URL 가져오기
            const downloadURL = await getDownloadURL(uploadResult.ref);
            console.log('다운로드 URL:', downloadURL);

            return downloadURL; // URL 반환
        } catch (error) {
            console.error('이미지 업로드 중 오류 발생:', error);
            Alert.alert('이미지 업로드 실패', error.message); // 오류 메시지 사용자에게 표시
            throw error; // 에러를 상위로 전달
        }
    };

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
            let imageUrls = []; // 이미지 URL 배열
            if (imageUri && Array.isArray(imageUri)) {
                // 여러 이미지 업로드 처리
                for (let uri of imageUri) {
                    const imageUrl = await uploadImage(uri); // 이미지 URL 업로드
                    if (imageUrl) {
                        imageUrls.push(imageUrl);
                    }
                }
            }

            const newReview = {
                text: review,
                placeId: place.placeId,
                userName: userName || 'Unknown',
                userId: auth.currentUser?.uid || 'unknown',
                createdAt: new Date().toISOString(),
                imageUrls: imageUrls, // 이미지 URL 배열을 포함
            };

            // Firestore에 리뷰 추가
            await addDoc(reviewsCollection, newReview);
            setReview('');
            setImageUri([]); // 배열 초기화
            Alert.alert('리뷰 작성 완료!');

            navigation.goBack();
        } catch (error) {
            console.error('리뷰 작성 중 오류 발생:', error);
        }
    };

    const handleDismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
            <View style={styles.reviewForm}>
                <View style={styles.titleContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <SvgXml xml={Back} style={styles.icon}></SvgXml>
                    </TouchableOpacity>
                    <Text style={styles.title}>리뷰 작성</Text>
                </View>

                <Text style={styles.name}>{place?.name || '이름 없음'}</Text>
                <Text style={styles.thx}>방문해 주셔서 감사합니다.</Text>

                <View style={styles.imageContainer}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.imageScrollContainer}
                    >
                        <View style={styles.imagePreviewContainer}>
                            {Array.isArray(imageUri) &&
                                imageUri.map((uri, index) => (
                                    <TouchableWithoutFeedback key={index} onPress={() => console.log('Image touched')}>
                                        <Image source={{ uri }} style={styles.imagePreview} />
                                    </TouchableWithoutFeedback>
                                ))}
                        </View>
                    </ScrollView>
                </View>

                <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
                    <SvgXml xml={Camera} style={styles.icon1}></SvgXml>
                    <Text style={styles.imageButtonText}> 사진 업로드</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="리뷰를 작성해 주세요."
                    value={review}
                    onChangeText={setReview}
                    multiline={true}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleAddReview}>
                    <Text style={styles.submitText}>작성 완료</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    reviewForm: {
        flex: 1,
        paddingLeft: '5%',
        paddingRight: '5%',
    },
    titleContainer: {
        top: 30,
        paddingBottom: 20,
        marginBottom: '25%',
        marginLeft: '-10%',
        marginRight: '-10%',
        borderBottomWidth: 1,
        borderBottomColor: '#D9D9D9',
    },
    backButton: {
        top: 25,
        width: '8%',
        marginLeft: '7%',
        padding: 3,
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    name: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0075FF',
        top: '-4%',
    },
    thx: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
        color: '#ABC4FF',
        top: '-3%',
    },
    imageContainer: {
        width: 'auto',
        height: 150,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagePreviewContainer: {
        flexDirection: 'row',
    },
    imagePreview: {
        width: 150,
        height: 150,
        marginHorizontal: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    imageButton: {
        marginTop: 15,
        backgroundColor: '#FFA86B',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowOpacity: 0.2,
        shadowOffset: {
            height: 2,
        }
    },
    imageButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#999999',
        borderRadius: 5,
        padding: 10,
        marginTop: 20,
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
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ReviewForm;