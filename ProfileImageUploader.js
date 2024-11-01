import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../Firebase';  // Firebase 설정 파일 import

export default function ProfileImageUploader({ onImageUploaded }) {
  const [image, setImage] = useState(null);
  const storage = getStorage(app);

  const pickImage = async () => {
    // 미디어 라이브러리 권한 요청
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('권한 필요', '카메라 롤에 접근하기 위해 권한을 부여해야 합니다.');
      return;
    }

    // 이미지 선택
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profilePictures/${Date.now()}`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      console.log('업로드된 이미지 URL:', downloadURL);
      Alert.alert('성공', '프로필 이미지가 성공적으로 업로드되었습니다!');
      onImageUploaded(downloadURL); // 업로드된 URL을 부모 컴포넌트에 전달
    } catch (error) {
      console.error('이미지 업로드 중 오류 발생:', error);
      Alert.alert('업로드 오류', '이미지 업로드 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="프로필 이미지 선택" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100, // 선택 사항: 원형으로 만들기
    marginTop: 10,
  },
});