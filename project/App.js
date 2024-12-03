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
import MapComponent from './src/components/MapComponent';
import Product from './src/components/Product';
import Wnanstj from './src/components/Wnanstj';
import Community from './src/components/Community';
import Write from './src/components/Write';
import Adopt from './src/components/Adopt';
import WalkPage from './src/components/WalkPage';
import Walk from './src/components/walk';
import WalkLog from './src/components/WalkLog';
import PostDetail from "./src/components/PostDetail";
import EditPost from './src/components/EditPost';
import ProductDetail from './src/components/ProductDetail';
import Wlfqud from './src/components/Wlfqud';
import ProductDetails from './src/components/ProductDetails';
import ReviewForm from './src/components/ReviewForm';
import Purchase from './src/components/Purchase';

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
        <Stack.Screen name="MapComponent" component={MapComponent} options={{ headerShown: false }} />
        <Stack.Screen name="Product" component={Product} options={{ headerShown: false }} />
        <Stack.Screen name="Wnanstj" component={Wnanstj} options={{ headerShown: false }} />
        <Stack.Screen name="Community" component={Community} options={{ headerShown: false }} />
        <Stack.Screen name="Write" component={Write} options={{ headerShown: false }} />
        <Stack.Screen name="Adopt" component={Adopt} options={{ headerShown: false }} />
        <Stack.Screen name="Walk" component={Walk} options={{ headerShown: false }} />
        <Stack.Screen name="WalkLog" component={WalkLog} options={{ headerShown: false }} />
        <Stack.Screen name="WalkPage" component={WalkPage} options={{ headerShown: false }} />
        <Stack.Screen name="PostDetail" component={PostDetail} options={{ headerShown: false }} />
        <Stack.Screen name="EditPost" component={EditPost} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ headerShown: false }} />
        <Stack.Screen name="Wlfqud" component={Wlfqud} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
        <Stack.Screen name="ReviewForm" component={ReviewForm} options={{ headerShown: false }} />
        <Stack.Screen name="Purchase" component={Purchase} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
