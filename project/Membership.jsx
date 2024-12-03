import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { auth } from "../Firebase"; // Firebase 설정 파일
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore"; // Firestore에서 setDoc과 doc을 임포트
import { firestore } from "../Firebase"; // Firestore 설정을 임포트

const Membership = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSendVerification = async () => {
    if (password !== confirmPassword) {
      Alert.alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 임시 계정 생성
      const tempUserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const tempUser = tempUserCredential.user;

      // 이메일 인증 요청
      await sendEmailVerification(tempUser);
      setVerificationSent(true); // 인증 요청 성공 상태로 변경
      Alert.alert(
        "이메일 인증 필요",
        "이메일 인증 링크가 발송되었습니다. 인증 완료 후 '가입하기' 버튼을 눌러주세요."
      );
    } catch (error) {
      Alert.alert("이메일 인증 요청 실패", error.message);
    }
  };

  const handleSignUp = async () => {
    if (!verificationSent) {
      Alert.alert("이메일 인증 필요", "이메일 인증 완료 후 다시 시도해주세요.");
      return;
    }

    try {
      // 현재 사용자 정보를 다시 로드하여 이메일 인증 여부 확인
      await auth.currentUser.reload();
      const user = auth.currentUser;

      if (user.emailVerified) {
        // Firestore에 사용자 정보 저장
        await setDoc(doc(firestore, "users", user.uid), {
          email: user.email,
          createdAt: new Date(),
        });
  
        Alert.alert(
          "회원가입 성공",
          "이메일 인증이 완료되었습니다. 로그인 화면으로 이동합니다.",
          [{ text: "확인", onPress: () => navigation.navigate("Login") }]
        );
      } else {
        Alert.alert("회원가입 실패", "이메일 인증이 완료되지 않았습니다.");
      }
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

      {/* 조건부 렌더링 */}
      {!verificationSent ? (
        <TouchableOpacity style={styles.verificationButton} onPress={handleSendVerification}>
          <Text style={styles.signupText}>이메일 인증 요청</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.signupText}>가입하기</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.backText}>뒤로가기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  membership: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    color: "#000",
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: "#ffffff",
    borderColor: "#999999",
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
    backgroundColor: "#ffffff",
    paddingLeft: 10,
    textAlignVertical: "center",
  },
  verificationButton: {
    width: 330,
    height: 56,
    backgroundColor: "#ffe69e",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signupButton: {
    width: 330,
    height: 56,
    backgroundColor: "#4caf50",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signupText: {
    fontSize: 20,
    color: "#000000",
  },
  backText: {
    fontSize: 16,
    color: "#000",
    marginTop: 10,
  },
});

export default Membership;
