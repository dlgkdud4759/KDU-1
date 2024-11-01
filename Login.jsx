import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { auth } from "../Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = ({ onNavigate, onNavigateToMembership }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert("로그인 성공", "환영합니다!");
        onNavigate(); // 로그인 성공 시 Information 화면으로 이동
      })
      .catch((error) => {
        Alert.alert("로그인 실패", error.message);
      });
  };

  return (
    <View style={styles.login}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="아이디 (이메일)"
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

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Pet Tracker</Text>

      {/* 회원가입 버튼 */}
      <TouchableOpacity onPress={onNavigateToMembership}>
        <Text style={styles.signupText}>회원가입</Text>
      </TouchableOpacity>

      <Text style={styles.forgotPasswordText}>비밀번호를 잊으셨나요?</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  login: {
    backgroundColor: '#ffffff',
    height: '100%',
    width: '100%',
    padding: 20,
  },
  inputContainer: {
    borderRadius: 10,
    height: 56,
    marginBottom: 20,
    paddingHorizontal: 10,
    top: 300,
  },
  input: {
    height: 56,
    borderColor: '#999999',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginVertical: 5,
    paddingLeft: 10,
  },
  title: {
      fontSize: 42,
      color: '#000',
    textAlign: 'center',
    top: -50,
        marginTop: 20,
      },
  loginButton: {
    backgroundColor: '#ffe69e',
    borderRadius: 10,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    top: 350,
  },
  loginButtonText: {
    fontSize: 20,
    color: '#000',
  },
  signupText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    marginTop: 10,
    right: 150,
    top: 140,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    left: 110,
        top: 125,
  }
});

export default Login;
