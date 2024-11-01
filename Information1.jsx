import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Modal, Image, TouchableOpacity } from 'react-native';
import { db } from '../Firebase'; // Firebase 설정 가져오기
import { collection, addDoc } from 'firebase/firestore'; // Firestore 관련 함수 임포트
import { SvgXml } from 'react-native-svg';
import ProfileImageUploader from './ProfileImageUploader';

const svgString = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M29.9637 15.625L27.9112 4.625C27.8611 4.35688 27.7566 4.10184 27.6042 3.87558C27.4519 3.64932 27.2548 3.45662 27.0252 3.30933C26.7956 3.16204 26.5383 3.06328 26.2691 3.01911C26 2.97495 25.7246 2.98631 25.46 3.0525L25.4212 3.06375L18.8562 5.00001H13.1437L6.57871 3.07L6.53996 3.05875C6.27533 2.99256 5.99996 2.9812 5.73078 3.02536C5.4616 3.06953 5.2043 3.16829 4.97471 3.31558C4.74511 3.46287 4.54807 3.65557 4.3957 3.88183C4.24334 4.10809 4.13886 4.36313 4.08871 4.63125L2.03621 15.625C1.94844 16.0653 2.01359 16.5224 2.22089 16.9206C2.42819 17.3188 2.76521 17.6344 3.17621 17.815C3.43942 17.9357 3.72539 17.9988 4.01496 18C4.36155 17.9998 4.70173 17.9066 4.99996 17.73V23C4.99996 24.3261 5.52674 25.5979 6.46443 26.5355C7.40211 27.4732 8.67388 28 9.99996 28H22C23.326 28 24.5978 27.4732 25.5355 26.5355C26.4732 25.5979 27 24.3261 27 23V17.7313C27.2979 17.9075 27.6376 18.0007 27.9837 18.0013C28.2736 18.0004 28.56 17.9378 28.8237 17.8175C29.2352 17.6368 29.5726 17.3208 29.7799 16.9221C29.9873 16.5233 30.0521 16.0657 29.9637 15.625ZM3.99996 16L6.05371 5.00001L11.3125 6.54625L3.99996 16ZM22 26H17V24.4138L18.7075 22.7075C18.8951 22.5199 19.0005 22.2654 19.0005 22C19.0005 21.7346 18.8951 21.4801 18.7075 21.2925C18.5198 21.1049 18.2653 20.9994 18 20.9994C17.7346 20.9994 17.4801 21.1049 17.2925 21.2925L16 22.5863L14.7075 21.2925C14.5198 21.1049 14.2653 20.9994 14 20.9994C13.7346 20.9994 13.4801 21.1049 13.2925 21.2925C13.1048 21.4801 12.9994 21.7346 12.9994 22C12.9994 22.2654 13.1048 22.5199 13.2925 22.7075L15 24.4138V26H9.99996C9.20431 26 8.44125 25.6839 7.87864 25.1213C7.31603 24.5587 6.99996 23.7957 6.99996 23V15.3888L13.49 7H18.5087L25 15.3888V23C25 23.7957 24.6839 24.5587 24.1213 25.1213C23.5587 25.6839 22.7956 26 22 26ZM28 16L20.6875 6.54625L25.9462 5.00001L28 16ZM13 17.5C13 17.7967 12.912 18.0867 12.7472 18.3334C12.5823 18.58 12.3481 18.7723 12.074 18.8858C11.7999 18.9994 11.4983 19.0291 11.2073 18.9712C10.9164 18.9133 10.6491 18.7704 10.4393 18.5607C10.2295 18.3509 10.0867 18.0836 10.0288 17.7926C9.9709 17.5017 10.0006 17.2001 10.1141 16.926C10.2277 16.6519 10.4199 16.4176 10.6666 16.2528C10.9133 16.088 11.2033 16 11.5 16C11.8978 16 12.2793 16.158 12.5606 16.4393C12.8419 16.7206 13 17.1022 13 17.5ZM22 17.5C22 17.7967 21.912 18.0867 21.7472 18.3334C21.5823 18.58 21.3481 18.7723 21.074 18.8858C20.7999 18.9994 20.4983 19.0291 20.2073 18.9712C19.9164 18.9133 19.6491 18.7704 19.4393 18.5607C19.2295 18.3509 19.0867 18.0836 19.0288 17.7926C18.9709 17.5017 19.0006 17.2001 19.1141 16.926C19.2277 16.6519 19.4199 16.4176 19.6666 16.2528C19.9133 16.088 20.2033 16 20.5 16C20.8978 16 21.2793 16.158 21.5606 16.4393C21.8419 16.7206 22 17.1022 22 17.5Z" fill="#343330"/>
</svg>`;

const svgString1 =`
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 17.5C12 17.7967 11.912 18.0867 11.7472 18.3334C11.5824 18.58 11.3481 18.7723 11.074 18.8858C10.7999 18.9994 10.4983 19.0291 10.2074 18.9712C9.91639 18.9133 9.64912 18.7704 9.43934 18.5607C9.22956 18.3509 9.0867 18.0836 9.02882 17.7926C8.97094 17.5017 9.00065 17.2001 9.11418 16.926C9.22771 16.6519 9.41997 16.4176 9.66665 16.2528C9.91332 16.088 10.2033 16 10.5 16C10.8978 16 11.2794 16.158 11.5607 16.4393C11.842 16.7206 12 17.1022 12 17.5ZM21.5 16C21.2033 16 20.9133 16.088 20.6666 16.2528C20.42 16.4176 20.2277 16.6519 20.1142 16.926C20.0007 17.2001 19.9709 17.5017 20.0288 17.7926C20.0867 18.0836 20.2296 18.3509 20.4393 18.5607C20.6491 18.7704 20.9164 18.9133 21.2074 18.9712C21.4983 19.0291 21.7999 18.9994 22.074 18.8858C22.3481 18.7723 22.5824 18.58 22.7472 18.3334C22.912 18.0867 23 17.7967 23 17.5C23 17.1022 22.842 16.7206 22.5607 16.4393C22.2794 16.158 21.8978 16 21.5 16ZM29 6V17C29 23.6163 23.1688 29 16 29C8.83125 29 3 23.6163 3 17V6C3.00018 5.60458 3.11758 5.21808 3.33736 4.88935C3.55713 4.56062 3.86942 4.30442 4.23476 4.15312C4.6001 4.00182 5.00209 3.96222 5.38993 4.03931C5.77777 4.1164 6.13405 4.30674 6.41375 4.58625C6.43125 4.60375 6.44625 4.62 6.46125 4.6375L8.625 7.125C10.8374 5.73886 13.3955 5.0037 16.0063 5.0037C18.617 5.0037 21.1751 5.73886 23.3875 7.125L25.5387 4.6375C25.5537 4.62 25.5688 4.60375 25.5863 4.58625C25.866 4.30674 26.2222 4.1164 26.6101 4.03931C26.9979 3.96222 27.3999 4.00182 27.7652 4.15312C28.1306 4.30442 28.4429 4.56062 28.6626 4.88935C28.8824 5.21808 28.9998 5.60458 29 6ZM27 6L24.305 9.10001C24.1401 9.29072 23.9093 9.41214 23.6588 9.43996C23.4082 9.46777 23.1564 9.39993 22.9538 9.25C22.3437 8.79887 21.689 8.41143 21 8.09375V11C21 11.2652 20.8946 11.5196 20.7071 11.7071C20.5196 11.8946 20.2652 12 20 12C19.7348 12 19.4804 11.8946 19.2929 11.7071C19.1054 11.5196 19 11.2652 19 11V7.38125C18.3439 7.2125 17.675 7.09877 17 7.04125V11C17 11.2652 16.8946 11.5196 16.7071 11.7071C16.5196 11.8946 16.2652 12 16 12C15.7348 12 15.4804 11.8946 15.2929 11.7071C15.1054 11.5196 15 11.2652 15 11V7.04125C14.325 7.09877 13.6561 7.2125 13 7.38125V11C13 11.2652 12.8946 11.5196 12.7071 11.7071C12.5196 11.8946 12.2652 12 12 12C11.7348 12 11.4804 11.8946 11.2929 11.7071C11.1054 11.5196 11 11.2652 11 11V8.09375C10.311 8.41143 9.6563 8.79887 9.04625 9.25C8.84403 9.40037 8.59249 9.46884 8.34196 9.44172C8.09143 9.41461 7.86037 9.2939 7.695 9.10375L5 6V17C5 22.2075 9.40125 26.5 15 26.9588V24.4138L13.2925 22.7063C13.1997 22.6133 13.1261 22.5031 13.0758 22.3817C13.0256 22.2603 12.9998 22.1303 12.9999 21.9989C12.9999 21.8676 13.0259 21.7376 13.0762 21.6162C13.1265 21.4949 13.2002 21.3847 13.2931 21.2919C13.4808 21.1044 13.7352 20.9991 14.0004 20.9993C14.1318 20.9993 14.2618 21.0253 14.3831 21.0756C14.5045 21.1259 14.6147 21.1996 14.7075 21.2925L16 22.585L17.2925 21.2925C17.3853 21.1996 17.4955 21.1259 17.6169 21.0756C17.7382 21.0253 17.8682 20.9993 17.9996 20.9993C18.1309 20.9992 18.261 21.025 18.3823 21.0752C18.5037 21.1254 18.614 21.1991 18.7069 21.2919C18.7998 21.3847 18.8735 21.4949 18.9238 21.6162C18.9741 21.7376 19.0001 21.8676 19.0001 21.9989C19.0002 22.1303 18.9744 22.2603 18.9242 22.3817C18.8739 22.5031 18.8003 22.6133 18.7075 22.7063L17 24.4138V26.9588C22.5988 26.4975 27 22.2088 27 17V6Z" fill="#343330"/>
</svg>`;

const svgString2 =`
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.25 21.5C14.5302 21.5 18 18.0302 18 13.75C18 9.46979 14.5302 6 10.25 6C5.96979 6 2.5 9.46979 2.5 13.75C2.5 18.0302 5.96979 21.5 10.25 21.5Z" stroke="#292D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21.5 2.5L16 8" stroke="#292D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 2.5H21.5V9" stroke="#292D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const svgString3 =`
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 16C15.866 16 19 12.866 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 12.866 8.13401 16 12 16Z" stroke="#292D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 16V22" stroke="#292D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 19H9" stroke="#292D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const svgString4 = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_262_605)">
<path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM17 13H13V17H11V13H7.00001V11H11V7H13V11H17V13Z" fill="#FFE69E"/>
</g>
<defs>
<clipPath id="clip0_262_605">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>`;

const svgString5 = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.45439 9.65383C5.23337 7.54084 4.01341 6.31783 2.61841 6.31783V6.31984C2.53422 6.31975 2.45012 6.32406 2.36641 6.33283C0.869406 6.48681 -0.199579 7.98081 0.0324057 10.2198C0.256421 12.3618 1.55139 13.9998 2.97442 13.9998C3.03887 14 3.10333 13.9966 3.16741 13.9899C4.66741 13.8338 5.68839 11.8898 5.45439 9.65383ZM2.95839 11.9878C2.37381 11.4966 2.09275 10.8078 2.02141 10.0118C2.02141 9.50823 2.01662 9.01136 2.24041 8.56379C2.36476 8.32989 2.51641 8.32581 2.57439 8.31981L2.61859 8.31906C2.95558 8.31906 3.36437 8.89478 3.46539 9.86078C3.53458 10.6132 3.42794 11.386 2.95839 11.9878Z" fill="black"/>
<path d="M8.46702 8.45002C8.53804 8.45002 8.60802 8.45002 8.67904 8.439C10.326 8.26702 11.452 6.13102 11.1951 3.669C10.9521 1.34602 9.61002 0 8.07604 0C7.98383 9.375e-05 7.89172 0.0050625 7.80003 0.015C6.15205 0.186 4.97404 1.82902 5.23105 4.29202C5.47804 6.648 6.90004 8.45002 8.46702 8.45002ZM7.49104 2.36002C7.59177 2.1615 7.78499 2.02641 8.00605 2.00002C8.02935 1.99856 8.05274 1.99856 8.07604 2.00002C8.54005 2.00002 9.07602 2.64502 9.20605 3.87703C9.29947 4.59361 9.18711 5.32195 8.88205 5.97703C8.70004 6.32203 8.51704 6.44203 8.46707 6.44705C8.21005 6.44705 7.38308 5.63306 7.22005 4.08103C7.1158 3.49317 7.21119 2.88736 7.49104 2.36002Z" fill="black"/>
<path d="M15.3648 8.439C15.4358 8.44598 15.5068 8.45002 15.5768 8.45002C17.1418 8.45002 18.5668 6.65002 18.8128 4.29202C19.0698 1.82902 17.8918 0.186 16.2458 0.015C16.1538 0.0050625 16.0613 4.6875e-05 15.9688 0C14.4338 0 13.0918 1.34602 12.8488 3.669C12.5918 6.13102 13.7178 8.26898 15.3648 8.439ZM14.8388 3.876C14.9668 2.64502 15.5008 2.00002 15.9688 2.00002C15.9918 1.99852 16.0148 1.99852 16.0378 2.00002C16.2586 2.02617 16.4519 2.16089 16.5528 2.35903C16.8337 2.88605 16.9292 3.49219 16.8238 4.08005C16.6618 5.63203 15.8338 6.44606 15.5728 6.44606C15.5268 6.44606 15.3438 6.32105 15.1618 5.97605C14.8567 5.32097 14.7446 4.59248 14.8388 3.876Z" fill="black"/>
<path d="M12.0008 11C7.45879 11 3.00079 15.641 2.99479 20.369C2.87081 23.568 5.59481 24.727 8.89481 23.547C10.9066 22.861 13.089 22.861 15.1008 23.547C15.8759 23.8087 16.6837 23.9612 17.5008 24C20.3938 24 21.0008 22.025 21.0008 20.369C21.0008 15.641 16.5428 11 12.0008 11ZM12.0008 21C9.74681 20.643 4.77679 23.833 5.00081 20.369C5.00081 16.719 8.53383 13 12.0008 13C15.4678 13 19.0008 16.7191 19.0008 20.369C19.2268 23.83 14.2658 20.647 12.0008 21Z" fill="black"/>
<path d="M21.9713 7.39071L21.9708 7.39268C21.8889 7.37313 21.8061 7.35799 21.7226 7.34716C20.2305 7.1516 18.8456 8.35868 18.5547 10.5908C18.2785 12.7267 19.1606 14.6193 20.5452 14.9476C20.608 14.9626 20.6714 14.9742 20.7354 14.9824C22.2309 15.1766 23.6729 13.5207 23.9611 11.291C24.2335 9.18405 23.3286 7.71255 21.9713 7.39071ZM21.978 11.0336C21.8717 11.7815 21.5897 12.5089 20.9939 12.9862C20.5384 12.3733 20.4239 11.6383 20.5381 10.8473C20.6543 10.3573 20.7643 9.87274 21.0852 9.48893C21.2602 9.29004 21.4087 9.32102 21.4665 9.32857L21.5097 9.33809C21.8376 9.4158 22.1026 10.0703 21.978 11.0336Z" fill="black"/>
</svg>`;

export function Information1({ onBack, onSuccess }) {
  const [petType, setPetType] = useState('');
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [isNeutered, setIsNeutered] = useState('');
  const [profileImage, setProfileImage] = useState(null); // 프로필 이미지 상태 추가
  const [showImageUploader, setShowImageUploader] = useState(false); // 이미지 업로더 표시 상태 추가

  const handleImageUploaded = (url) => {
    setProfileImage(url); // 업로드된 이미지 URL 저장
    setShowImageUploader(false); // 업로더 숨기기
  };

  const handleConfirm = async () => {
    if (!name || !weight || !birthDate || !petType || !gender || !isNeutered) {
      alert("모든 필드를 채워주세요.");
      return; // 입력이 완료되지 않은 경우 함수 종료
    }

    const petInfo = { petType, name, weight, birthDate, gender, isNeutered, profileImage };
    try {
      const docRef = await addDoc(collection(db, 'pets'), petInfo);
      console.log('반려동물 정보가 저장되었습니다:', petInfo, '문서 ID:', docRef.id);
      alert("정보가 저장되었습니다.");
      // 저장 성공 후 Main 화면으로 이동 
      onSuccess(); // Main 화면으로 이동
    } catch (error) {
      console.error('정보 저장 중 오류 발생:', error);
    }
  };

  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.back}>뒤로가기</Text>
      </TouchableOpacity>
      <Text style={styles.title}>반려동물 정보 입력</Text>

      <View style={styles.profileContainer}>
      <SvgXml xml={svgString5} width="48" height="48" style={styles.icon3}/>
      <View style={styles.iconContainer}>
      <TouchableOpacity onPress={() => setShowImageUploader(true)}>
      <SvgXml xml={svgString4} width="28" height="28" style={styles.icon2}/>
      </TouchableOpacity>
      </View>
        <View style={styles.profile}>
          {profileImage && (
            <Image source={{ uri: profileImage }} style={styles.imagePreview} />
          )}
        </View>
      </View>

      <Modal visible={showImageUploader} animationType="slide">
        <ProfileImageUploader onImageUploaded={handleImageUploaded} />
      </Modal>

      <View style={styles.petTypeContainer}>
        <Text style={styles.label}>반려종</Text>
        <View style={styles.petTypeSelection}>
        <SvgXml xml={svgString} width="28" height="28" style={styles.icon}/>
          <TouchableOpacity
            style={[styles.petTypeButton, petType === '강아지' && styles.selectedButton]}
            onPress={() => setPetType('강아지')}
          >
            <Text style={styles.petTypeButtonText}>강아지</Text>
          </TouchableOpacity>
          <SvgXml xml={svgString1} width="28" height="28" style={styles.icon}/>
          <TouchableOpacity
            style={[styles.petTypeButton, petType === '고양이' && styles.selectedButton]}
            onPress={() => setPetType('고양이')}
          >
            <Text style={styles.petTypeButtonText}>고양이</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.rectangle}
        placeholder="반려동물 이름을 입력해주세요."
        onChangeText={setName}
        value={name}
      />

      <TextInput
        style={styles.rectangle}
        placeholder="몸무게를 입력해주세요."
        keyboardType="numeric"
        onChangeText={setWeight}
        value={weight}
      />

      <TextInput
        style={styles.rectangle}
        placeholder="반려동물 생년월일(예: 010825)"
        onChangeText={setBirthDate}
        value={birthDate}
      />

      <View style={styles.genderContainer}>
        <Text style={styles.label}>반려동물 성별</Text>
        <SvgXml xml={svgString2} width="24" height="24" style={styles.icon1}/>
        <TouchableOpacity
          style={[styles.genderButton, gender === '남아' && styles.selectedButton]}
          onPress={() => setGender('남아')}
        >
          <Text style={styles.genderButtonText}>남아</Text>
        </TouchableOpacity>
        <SvgXml xml={svgString3} width="24" height="24" style={styles.icon1}/>
        <TouchableOpacity
          style={[styles.genderButton, gender === '여아' && styles.selectedButton]}
          onPress={() => setGender('여아')}
        >
          <Text style={styles.genderButtonText}>여아</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.neuteringContainer}>
        <Text style={styles.label}>중성화 여부</Text>
        <TouchableOpacity
          style={[styles.neuteringButton, isNeutered === '했어요' && styles.selectedButton]}
          onPress={() => setIsNeutered('했어요')}
        >
          <Text style={styles.neuteringButtonText}>했어요</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.neuteringButton, isNeutered === '안 했어요' && styles.selectedButton]}
          onPress={() => setIsNeutered('안 했어요')}
        >
          <Text style={styles.neuteringButtonText}>안 했어요</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonLabel}>확인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 20,
    top: 120,
  },
  back: {
        right: 10,
        top: -100,
  },
  profileContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    width: 84,
    height: 84,
    borderRadius: '50',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    backgroundColor: '#ffffff',
    top: 90,
    left: 30,
    zIndex: 1,
    width: 32,  // 아이콘의 너비를 설정
    height: 32, // 아이콘의 높이를 설정
    borderRadius: 16, // 둥글게 만들기 (높이와 너비의 절반)
  },
  icon2: {
    width: '100%',
    height: '100%',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  icon3: {
    top: 97,
    zIndex: 1,
  },
  petTypeContainer: {
    width: 324,
        height: 46,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(153, 153, 153, 1)',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
  },
  petTypeSelection: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  petTypeButton: {
    width: 90,
       height: 30,
       flexShrink: 0,
       borderBottomLeftRadius: 100,
       borderBottomRightRadius: 100,
       borderTopLeftRadius: 100,
       borderTopRightRadius: 100,
       borderRadius: 10,
       borderWidth: 1,
       borderColor: 'rgba(153, 153, 153, 1)',
       backgroundColor: 'rgba(255, 255, 255, 1)',
       justifyContent: 'center',
       alignItems: 'center',
       marginLeft: -20, // 첫 번째 버튼의 왼쪽 여백을 0으로 설정
       right : 10,
  },
  icon: {
    top: 1,
    left: 5,
    zIndex: 1, // 아이콘이 텍스트 필드 위에 있도록 설정
  },
  genderContainer: {
    width: 324,
        height: 46,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(153, 153, 153, 1)',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
  },
  genderButton: {
   width: 80,
       height: 30,
       flexShrink: 0,
       borderBottomLeftRadius: 100,
       borderBottomRightRadius: 100,
       borderTopLeftRadius: 100,
       borderTopRightRadius: 100,
       borderRadius: 10,
       borderWidth: 1,
       borderColor: 'rgba(153, 153, 153, 1)',
       backgroundColor: 'rgba(255, 255, 255, 1)',
       justifyContent: 'center',
       alignItems: 'center',
       marginLeft: -13, // 첫 번째 버튼의 왼쪽 여백을 0으로 설정
       left: 40,
  },
  icon1: {
    top: 0,
    left: 60,
    zIndex: 1, // 아이콘이 텍스트 필드 위에 있도록 설정
  },
  neuteringContainer: {
    width: 324,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(153, 153, 153, 1)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    marginVertical: 10,
    paddingHorizontal: 10,
            borderStyle: 'solid',
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
  },
  neuteringButton: {
     width: 80,
          height: 30,
          flexShrink: 0,
          borderBottomLeftRadius: 100,
          borderBottomRightRadius: 100,
          borderTopLeftRadius: 100,
          borderTopRightRadius: 100,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: 'rgba(153, 153, 153, 1)',
          backgroundColor: 'rgba(255, 255, 255, 1)',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 10, // 첫 번째 버튼의 왼쪽 여백을 0으로 설정
          left: 40,
  },
  selectedButton: {
    backgroundColor: '#FFE69E', // 선택된 버튼 배경색
  },
  petTypeButtonText: {
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Roboto',
    fontSize: 15,
    left: 15,
  },
  genderButtonText: {
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Roboto',
    fontSize: 15,
    left: 15,
  },
  neuteringButtonText: {
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Roboto',
    fontSize: 15,
  },
  rectangle: {
    width: 324,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(153, 153, 153, 1)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    marginVertical: 10,
    paddingHorizontal: 25,
  },
  label: {
    width: 70,
    height: 24,
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Roboto',
    fontSize: 15,
    fontStyle: 'normal',
    left: 15,
  },
  confirmButton: {
    backgroundColor: '#FFE69E', // 확인 버튼 배경색
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonLabel: {
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '900',
  },
  title: {
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: -135,
    top: -90,
  },
});

export default Information1;