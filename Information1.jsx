import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { db } from '../Firebase'; // Firebase 설정 가져오기
import { collection, addDoc } from 'firebase/firestore'; // Firestore 관련 함수 임포트

export function Information1({ onBack, onSuccess }) {
  const [petType, setPetType] = useState('');
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [isNeutered, setIsNeutered] = useState('');

  const handleConfirm = async () => {
    if (!name || !weight || !birthDate || !petType || !gender || !isNeutered) {
      alert("모든 필드를 채워주세요.");
      return; // 입력이 완료되지 않은 경우 함수 종료
    }

    const petInfo = { petType, name, weight, birthDate, gender, isNeutered };
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

      <View style={styles.petTypeContainer}>
        <Text style={styles.label}>반려종</Text>
        <View style={styles.petTypeSelection}>
          <TouchableOpacity
            style={[styles.petTypeButton, petType === '강아지' && styles.selectedButton]}
            onPress={() => setPetType('강아지')}
          >
            <Text style={styles.petTypeButtonText}>강아지</Text>
          </TouchableOpacity>
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
        <TouchableOpacity
          style={[styles.genderButton, gender === '남아' && styles.selectedButton]}
          onPress={() => setGender('남아')}
        >
          <Text style={styles.genderButtonText}>남아</Text>
        </TouchableOpacity>
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
       right : 10,
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
       marginLeft: 10, // 첫 번째 버튼의 왼쪽 여백을 0으로 설정
       left: 40,
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
  },
  genderButtonText: {
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Roboto',
    fontSize: 15,
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
    paddingHorizontal: 10,
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
    fontWeight: '500',
  },
  title: {
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
    top: -90,
  },
});

export default Information1;