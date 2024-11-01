import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { auth } from "../Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { SvgXml } from 'react-native-svg';

const svgString = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.45439 9.65383C5.23337 7.54084 4.01341 6.31783 2.61841 6.31783V6.31984C2.53422 6.31975 2.45012 6.32406 2.36641 6.33283C0.869406 6.48681 -0.199579 7.98081 0.0324057 10.2198C0.256421 12.3618 1.55139 13.9998 2.97442 13.9998C3.03887 14 3.10333 13.9966 3.16741 13.9899C4.66741 13.8338 5.68839 11.8898 5.45439 9.65383ZM2.95839 11.9878C2.37381 11.4966 2.09275 10.8078 2.02141 10.0118C2.02141 9.50823 2.01662 9.01136 2.24041 8.56379C2.36476 8.32989 2.51641 8.32581 2.57439 8.31981L2.61859 8.31906C2.95558 8.31906 3.36437 8.89478 3.46539 9.86078C3.53458 10.6132 3.42794 11.386 2.95839 11.9878Z" fill="black"/>
<path d="M8.46702 8.45002C8.53804 8.45002 8.60802 8.45002 8.67904 8.439C10.326 8.26702 11.452 6.13102 11.1951 3.669C10.9521 1.34602 9.61002 0 8.07604 0C7.98383 9.375e-05 7.89172 0.0050625 7.80003 0.015C6.15205 0.186 4.97404 1.82902 5.23105 4.29202C5.47804 6.648 6.90004 8.45002 8.46702 8.45002ZM7.49104 2.36002C7.59177 2.1615 7.78499 2.02641 8.00605 2.00002C8.02935 1.99856 8.05274 1.99856 8.07604 2.00002C8.54005 2.00002 9.07602 2.64502 9.20605 3.87703C9.29947 4.59361 9.18711 5.32195 8.88205 5.97703C8.70004 6.32203 8.51704 6.44203 8.46707 6.44705C8.21005 6.44705 7.38308 5.63306 7.22005 4.08103C7.1158 3.49317 7.21119 2.88736 7.49104 2.36002Z" fill="black"/>
<path d="M15.3648 8.439C15.4358 8.44598 15.5068 8.45002 15.5768 8.45002C17.1418 8.45002 18.5668 6.65002 18.8128 4.29202C19.0698 1.82902 17.8918 0.186 16.2458 0.015C16.1538 0.0050625 16.0613 4.6875e-05 15.9688 0C14.4338 0 13.0918 1.34602 12.8488 3.669C12.5918 6.13102 13.7178 8.26898 15.3648 8.439ZM14.8388 3.876C14.9668 2.64502 15.5008 2.00002 15.9688 2.00002C15.9918 1.99852 16.0148 1.99852 16.0378 2.00002C16.2586 2.02617 16.4519 2.16089 16.5528 2.35903C16.8337 2.88605 16.9292 3.49219 16.8238 4.08005C16.6618 5.63203 15.8338 6.44606 15.5728 6.44606C15.5268 6.44606 15.3438 6.32105 15.1618 5.97605C14.8567 5.32097 14.7446 4.59248 14.8388 3.876Z" fill="black"/>
<path d="M12.0008 11C7.45879 11 3.00079 15.641 2.99479 20.369C2.87081 23.568 5.59481 24.727 8.89481 23.547C10.9066 22.861 13.089 22.861 15.1008 23.547C15.8759 23.8087 16.6837 23.9612 17.5008 24C20.3938 24 21.0008 22.025 21.0008 20.369C21.0008 15.641 16.5428 11 12.0008 11ZM12.0008 21C9.74681 20.643 4.77679 23.833 5.00081 20.369C5.00081 16.719 8.53383 13 12.0008 13C15.4678 13 19.0008 16.7191 19.0008 20.369C19.2268 23.83 14.2658 20.647 12.0008 21Z" fill="black"/>
<path d="M21.9713 7.39071L21.9708 7.39268C21.8889 7.37313 21.8061 7.35799 21.7226 7.34716C20.2305 7.1516 18.8456 8.35868 18.5547 10.5908C18.2785 12.7267 19.1606 14.6193 20.5452 14.9476C20.608 14.9626 20.6714 14.9742 20.7354 14.9824C22.2309 15.1766 23.6729 13.5207 23.9611 11.291C24.2335 9.18405 23.3286 7.71255 21.9713 7.39071ZM21.978 11.0336C21.8717 11.7815 21.5897 12.5089 20.9939 12.9862C20.5384 12.3733 20.4239 11.6383 20.5381 10.8473C20.6543 10.3573 20.7643 9.87274 21.0852 9.48893C21.2602 9.29004 21.4087 9.32102 21.4665 9.32857L21.5097 9.33809C21.8376 9.4158 22.1026 10.0703 21.978 11.0336Z" fill="black"/>
</svg>
`;

const svgString1 = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 13C11.6955 12.9964 11.3973 13.0862 11.1454 13.2573C10.8936 13.4284 10.7001 13.6725 10.5912 13.9568C10.4823 14.2411 10.4631 14.552 10.5361 14.8476C10.6092 15.1431 10.7711 15.4092 11 15.61V17C11 17.2652 11.1054 17.5196 11.2929 17.7071C11.4804 17.8946 11.7348 18 12 18C12.2652 18 12.5196 17.8946 12.7071 17.7071C12.8946 17.5196 13 17.2652 13 17V15.61C13.2289 15.4092 13.3908 15.1431 13.4639 14.8476C13.5369 14.552 13.5177 14.2411 13.4088 13.9568C13.2999 13.6725 13.1064 13.4284 12.8546 13.2573C12.6027 13.0862 12.3045 12.9964 12 13ZM17 9V7C17 5.67392 16.4732 4.40215 15.5355 3.46447C14.5979 2.52678 13.3261 2 12 2C10.6739 2 9.40215 2.52678 8.46447 3.46447C7.52678 4.40215 7 5.67392 7 7V9C6.20435 9 5.44129 9.31607 4.87868 9.87868C4.31607 10.4413 4 11.2044 4 12V19C4 19.7956 4.31607 20.5587 4.87868 21.1213C5.44129 21.6839 6.20435 22 7 22H17C17.7956 22 18.5587 21.6839 19.1213 21.1213C19.6839 20.5587 20 19.7956 20 19V12C20 11.2044 19.6839 10.4413 19.1213 9.87868C18.5587 9.31607 17.7956 9 17 9ZM9 7C9 6.20435 9.31607 5.44129 9.87868 4.87868C10.4413 4.31607 11.2044 4 12 4C12.7956 4 13.5587 4.31607 14.1213 4.87868C14.6839 5.44129 15 6.20435 15 7V9H9V7ZM18 19C18 19.2652 17.8946 19.5196 17.7071 19.7071C17.5196 19.8946 17.2652 20 17 20H7C6.73478 20 6.48043 19.8946 6.29289 19.7071C6.10536 19.5196 6 19.2652 6 19V12C6 11.7348 6.10536 11.4804 6.29289 11.2929C6.48043 11.1054 6.73478 11 7 11H17C17.2652 11 17.5196 11.1054 17.7071 11.2929C17.8946 11.4804 18 11.7348 18 12V19Z" fill="black"/>
</svg>`;

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
      <SvgXml xml={svgString} width="24" height="24" style={styles.icon}/>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
      <SvgXml xml={svgString1} width="24" height="24" style={styles.icon}/>
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
  icon: {
    position: 'absolute',
    top: 20,
    left: 25,
    zIndex: 1, // 아이콘이 텍스트 필드 위에 있도록 설정
  },
  input: {
    height: 56,
    borderColor: '#999999',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginVertical: 5,
    paddingLeft: 50,
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
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '700',
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