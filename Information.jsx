import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Information = ({ navigation }) => {
  const handleBoxClick = (screen) => {
    navigation.navigate(screen); // React Navigation의 navigate 메서드를 사용
  };

  return (
    <View style={styles.root}>
      <TouchableOpacity
        style={styles.rectangle}
        onPress={() => handleBoxClick('Information1')}
        accessibilityLabel="반려동물 정보 입력"
      >
        <Text style={styles.largeText}>반려동물을 키우고 있어요</Text>
        <Text style={styles.smallText}>반려동물 정보 입력 후 가입</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.rectangle}
        onPress={() => handleBoxClick('Information2')}
        accessibilityLabel="입양 정보 입력"
      >
        <Text style={styles.largeText}>입양 예정이예요</Text>
        <Text style={styles.smallText}>강아지, 고양이 선택 후 가입</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.rectangle}
        onPress={() => handleBoxClick('Main')}
        accessibilityLabel="앱 둘러보기"
      >
        <Text style={styles.largeText}>앱 둘러보기</Text>
        <Text style={styles.smallText}>반려동물 정보 입력 없이 간편가입</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => handleBoxClick('signup')}
        accessibilityLabel="회원가입하기"
      >
        <Text style={styles.signupText}>가입하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  back: {
      right: 150,
      top: -200,
      },
  rectangle: {
    width: 350,
    height: 84,
    borderRadius: 10,
    backgroundColor: 'rgba(241, 241, 245, 1)',
    marginVertical: 10,
    padding: 10,
    justifyContent: 'center',
  },
  signupButton: {
    width: 350,
    height: 56,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 230, 158, 1)',
    marginVertical: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    justifyContent: 'center',
    alignItems: 'center',
    top: 30,
  },
  largeText: {
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 24,
    paddingLeft: 50,
  },
  smallText: {
    color: 'rgba(153, 153, 153, 1)',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
    paddingLeft: 50,
  },
  signupText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
  },
});

export default Information;