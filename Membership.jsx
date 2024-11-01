// src/components/Membership.jsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { auth } from "../Firebase"; // 경로 수정
import { createUserWithEmailAndPassword } from "firebase/auth"; // auth에서 가져오기

const Membership = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      Alert.alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert("회원가입 성공!", "회원가입이 완료되었습니다.", [
          {
            text: "확인",
            onPress: onBack, // 로그인 화면으로 돌아가기
          },
        ]);
      })
      .catch((error) => {
        Alert.alert("회원가입 실패", error.message);
      });
  };

  return (
    <View style={styles.membership}>
      <Text style={styles.title}>회원가입</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="비밀번호 재확인"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.signupText}>가입하기</Text>
      </TouchableOpacity>

      {/* 뒤로가기 버튼 */}
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.backText}>뒤로가기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  membership: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    color: '#000',
    marginBottom: 20,
    padding: 20,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderColor: '#999999',
    borderWidth: 1,
    borderRadius: 10,
    height: 56,
    width: 360,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  input: {
    height: 54,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    paddingLeft: 10,
  },
  signupButton: {
    width: 364,
    height: 56,
    backgroundColor: '#ffe69e',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 56,
  },
  signupText: {
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '900',
  },
  backText: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
  },
});

export default Membership;
