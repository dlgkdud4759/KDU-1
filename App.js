import React from "react";
import 'react-native-get-random-values';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/components/Login';  
import Information from "./src/components/Information";
import Membership from './src/components/Membership';  
import Information1 from './src/components/Information1'; 
import Information2 from './src/components/Information2';  
import Information3 from './src/components/Information3'; 
import Main from './src/components/Main';  
import ProfileImageUploader from "./src/components/ProfileImageUploader";
import Store from './src/components/Store';
import Checkout from './src/components/Checkout';
import MapComponent from './src/components/MapComponent';
import ReviewForm from './src/components/ReviewForm';
import Product from './src/components/Product';
import WalkPage from './src/components/WalkPage';
import Walk from './src/components/walk';
import WalkLog from './src/components/WalkLog';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Information" component={Information} options={{ headerShown: false }} />
        <Stack.Screen name="Membership" component={Membership} options={{ headerShown: false }} />
        <Stack.Screen name="Information1" component={Information1} options={{ headerShown: false }} />
        <Stack.Screen name="Information2" component={Information2} options={{ headerShown: false }} />
        <Stack.Screen name="Information3" component={Information3} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileImageUploader" component={ProfileImageUploader} options={{ headerShown: false }} />
        <Stack.Screen name="Store" component={Store} options={{ headerShown: false }} />
        <Stack.Screen name="Checkout" component={Checkout} options={{ headerShown: false }} /> 
        <Stack.Screen name="MapComponent" component={MapComponent} options={{ headerShown: false }} />
        <Stack.Screen name="ReviewForm" component={ReviewForm} options={{ headerShown: false }}/>
        <Stack.Screen name="Product" component={Product} options={{ headerShown: false }} />
        
        <Stack.Screen name="Walk" component={Walk} options={{ headerShown: false }} />
        <Stack.Screen name="WalkLog" component={WalkLog} options={{ headerShown: false }} />
        <Stack.Screen name="WalkPage" component={WalkPage} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}