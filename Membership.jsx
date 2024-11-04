import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { auth } from "../Firebase"; // 경로 수정
import { createUserWithEmailAndPassword } from "firebase/auth"; // auth에서 가져오기
import { setDoc, doc } from "firebase/firestore"; // Firestore에서 setDoc과 doc을 임포트
import { firestore } from "../Firebase"; // Firestore 설정을 임포트

const Membership = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore에 사용자 정보 저장
      await setDoc(doc(firestore, "users", user.uid), {
        email: user.email,
        isInfoCompleted: false, // 정보 입력이 완료되지 않았음을 나타냄
      });

      Alert.alert("회원가입 성공!", "회원가입이 완료되었습니다.", [
        {
          text: "확인",
          onPress: () => navigation.navigate("Login"), // 로그인 화면으로 이동
        },
      ]);
    } catch (error) {
      Alert.alert("회원가입 실패", error.message);
    }
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

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
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
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderColor: '#999999',
    borderWidth: 1,
    borderRadius: 10,
    height: 56,
    width: 330,
    marginVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    paddingLeft: 10,
    textAlignVertical: 'center', // 글씨를 수직 중앙 정렬
  },
  signupButton: {
    width: 330,
    height: 56,
    backgroundColor: '#ffe69e',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 20,
    color: '#000000',
  },
  backText: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
  },
});

export default Membership;
