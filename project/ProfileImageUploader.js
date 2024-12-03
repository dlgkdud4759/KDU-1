import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../Firebase'; 
import { SvgXml } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';

const svgString6 = `
<svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.74996 19.34C10.1139 19.7544 10.0737 20.3852 9.65996 20.75C9.24556 21.114 8.61471 21.0737 8.24996 20.66L0.249955 11.66C-0.0816908 11.2825 -0.0816908 10.7175 0.249955 10.34L8.24996 1.34C8.48059 1.05366 8.84975 0.916976 9.21124 0.984074C9.57274 1.05117 9.86826 1.31123 9.98078 1.66126C10.0933 2.01129 10.0047 2.39484 9.74996 2.66L2.33996 11L9.74996 19.34Z" fill="#111111"/>
</svg>`;

export default function ProfileImageUploader({ onImageUploaded, setShowImageUploader }) {
  const [image, setImage] = useState(null);
  const storage = getStorage(app);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('권한 필요', '카메라 롤에 접근하기 위해 권한을 부여해야 합니다.');
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    console.log('결과 객체:', result);  // 객체 구조 확인
  
    // assets 배열이 존재하고, 첫 번째 항목에 uri가 있는지 확인
    if (!result.canceled && result.assets && result.assets[0].uri) {
      const imageUri = result.assets[0].uri;
      console.log('선택된 이미지 URI:', imageUri);  // 선택된 이미지 URI 확인
      setImage(imageUri);
      uploadImage(imageUri);  // 이미지 업로드
    } else {
      console.error('이미지 URI가 없습니다.');
      Alert.alert("이미지 선택 오류", "유효한 이미지가 선택되지 않았습니다.");
    }
  };
  const uploadImage = async (uri) => {
    try {
      const fileInfo = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      const blob = new Blob([fileInfo], { type: 'image/png' });  // Base64로 읽은 파일을 Blob으로 변환
  
      const storageRef = ref(storage, `profilePictures/${Date.now()}`);  // Firebase Storage 경로 설정
      const uploadResult = await uploadBytes(storageRef, blob);  // Firebase에 업로드
  
      const downloadURL = await getDownloadURL(storageRef);  // 업로드된 이미지 URL
      console.log('업로드된 이미지 URL:', downloadURL);
      Alert.alert('성공', '프로필 이미지가 성공적으로 업로드되었습니다!');
      onImageUploaded(downloadURL);  // 업로드된 이미지 URL 전달
    } catch (error) {
      console.error('이미지 업로드 중 오류 발생:', error);
      Alert.alert('업로드 오류', `이미지 업로드 중 오류가 발생했습니다. 다시 시도해 주세요. \n${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => setShowImageUploader(false)}>
        <SvgXml xml={svgString6} width="24" height="24" style={styles.icon1}/>
      </TouchableOpacity>
      <Button title="이미지 선택" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
});
