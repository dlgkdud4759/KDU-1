import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Login from './src/components/Login';  
import Information from "./src/components/Information";
import Membership from './src/components/Membership';  
import Information1 from './src/components/Information1'; 
import Information2 from './src/components/Information2';  
import Main from './src/components/Main';  

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("login");

  const handleLoginNavigation = () => {
    setCurrentScreen("information");
  };

  const handleSignupNavigation = () => {
    setCurrentScreen("membership");
  };

  const handleBackToLogin = () => {
    setCurrentScreen("login");
  };

  const handleBackToInformation = () => {
    setCurrentScreen("information");
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  const handleInformation1Navigation = () => {
    setCurrentScreen("information1");
  };

  const handleInformation2Navigation = () => {
    setCurrentScreen("information2");
  };

  const handleMainNavigation = () => {
    setCurrentScreen("main");
  };

  return (
    <View style={styles.container}>
      {currentScreen === "login" && (
        <Login
          onNavigate={handleLoginNavigation}
          onNavigateToMembership={handleSignupNavigation}
        />
      )}
      {currentScreen === "information" && (
        <Information
          onNavigate={handleNavigate}
          onNavigateToInformation1={handleInformation1Navigation}
        />
      )}
      {currentScreen === "membership" && (
        <Membership onBack={handleBackToLogin} />
      )}
      {currentScreen === "information1" && (
        <Information1 
          onBack={handleBackToInformation} 
          onSuccess={handleMainNavigation} // 성공 시 Main으로 이동
        />
      )}
      {currentScreen === "information2" && (
        <Information2
          onBack={handleBackToInformation}
          onNavigate={handleMainNavigation}
        />
      )}
      {currentScreen === "main" && (
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
