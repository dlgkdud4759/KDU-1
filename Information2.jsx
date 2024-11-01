import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export function Information2({ onBack, onNavigate }) { // onBack 추가
  const [selectedAnimal, setSelectedAnimal] = useState(null); // 선택된 동물 상태 관리

  const handleAnimalSelect = (animal) => {
    setSelectedAnimal(animal); // 강아지나 고양이를 선택하면 상태에 저장
  };

  const handleSignup = () => {
    if (selectedAnimal) {
      onNavigate('main'); // 선택된 동물이 있을 때 Main으로 이동
    } else {
      alert('반려동물을 선택해 주세요.'); // 선택하지 않았을 때 알림
    }
  };

  const handleGoBack = () => {
    onBack(); // 이전 화면으로 이동
  };

  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>뒤로가기</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>
        {`입양 예정인 반려동물을 선택해 주세요\n선택하신 정보는 회원가입 후 마이페이지에서\n변경하실 수 있습니다.`}
      </Text>

      <View style={styles.animalSelectionContainer}>
        <TouchableOpacity
          style={[styles.animalBox, selectedAnimal === '강아지' && styles.selectedBox]}
          onPress={() => handleAnimalSelect('강아지')}
        >
          <Text style={styles.animalText}>강아지</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.animalBox, selectedAnimal === '고양이' && styles.selectedBox]}
          onPress={() => handleAnimalSelect('고양이')}
        >
          <Text style={styles.animalText}>고양이</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.group34} onPress={handleSignup}>
        <Text style={styles.buttonText}>{`가입하기`}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(200, 200, 200, 1)',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    color: 'rgba(153, 153, 153, 1)',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 40,
  },
  animalSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  animalBox: {
    width: 140,
    height: 180,
    borderRadius: 10,
    backgroundColor: 'rgba(241, 241, 245, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  selectedBox: {
    backgroundColor: 'rgba(200, 200, 255, 1)', // 선택된 동물은 색을 변경
  },
  animalText: {
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '600',
  },
  group34: {
    width: 364,
    height: 56,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 230, 158, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default Information2;
