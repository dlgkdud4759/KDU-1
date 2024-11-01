import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Login from './src/components/Login';  
import Information from "./src/components/Information";
import Membership from './src/components/Membership';  
import Information1 from './src/components/Information1'; 
import Information2 from './src/components/Information2';  
import Main from './src/components/Main';  

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("Login");

  const handleLoginNavigation = (screen) => {
    setCurrentScreen(screen); // 로그인 후 받은 화면으로 이동
  };

  const handleSignupNavigation = () => {
    setCurrentScreen("Membership");
  };

  const handleBackToLogin = () => {
    setCurrentScreen("Login");
  };

  const handleBackToInformation = () => {
    setCurrentScreen("Information");
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  const handleInformation1Navigation = () => {
    setCurrentScreen("Information1");
  };

  const handleInformation2Navigation = () => {
    setCurrentScreen("Information2");
  };

  const handleMainNavigation = () => {
    setCurrentScreen("Main");
  };

  return (
    <View style={styles.container}>
      {currentScreen === "Login" && (
        <Login
          onNavigate={handleLoginNavigation} // 화면 전환 함수 수정
          onNavigateToMembership={handleSignupNavigation}
        />
      )}
      {currentScreen === "Information" && (
        <Information
          onNavigate={handleNavigate}
          onNavigateToInformation1={handleInformation1Navigation}
        />
      )}
      {currentScreen === "Membership" && (
        <Membership onBack={handleBackToLogin} />
      )}
      {currentScreen === "information1" && (
        <Information1 
          onBack={handleBackToInformation} 
          onSuccess={handleMainNavigation} // 성공 시 Main으로 이동
        />
      )}
      {currentScreen === "Information2" && (
        <Information2
          onBack={handleBackToInformation}
          onNavigate={handleMainNavigation}
        />
      )}
      {currentScreen === "Main" && (
        <Main />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
