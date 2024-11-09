import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { collection, getDocs, query, where } from 'firebase/firestore'; // firestore에서 필요한 함수 가져오기
import { firestore } from '../Firebase'; // firestore를 import

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState(null); // 사용자 위치
  const [locations, setLocations] = useState([]);         // 동물병원 위치 데이터

  // 위치 권한 요청
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  };

  // 현재 위치 가져오기
  useEffect(() => {
    const getLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.warn('위치 권한이 필요합니다.');
        return;
      }

      try {
        const { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setUserLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (error) {
        console.error('위치를 가져오지 못했습니다:', error);
      }
    };

    getLocation();
  }, []);

  // Firebase에서 동물병원 데이터 가져오기
  useEffect(() => {
    const fetchLocations = async () => {
      if (!userLocation) return;

      const locationQuery = query(
        collection(firestore, 'Location'), // firestore 인스턴스를 사용
        where('type', 'in', ['veterinary', 'pet shop'])
      );

      const querySnapshot = await getDocs(locationQuery);
      const allLocations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLocations(allLocations);
    };

    fetchLocations();
  }, [userLocation]);

  return (
    <View style={styles.container}>
      {userLocation && (
        <MapView style={styles.map} initialRegion={userLocation} showsUserLocation={true}>
          {locations.map((location) => (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.coordinates.latitude,
                longitude: location.coordinates.longitude,
              }}
              title={location.name}
              description={location.address}
            >
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.title}>{location.name}</Text>
                  <Text>{location.address}</Text>
                  <Text>{location.phone}</Text>
                  {location.rating && <Text>Rating: {location.rating}</Text>}
                  {location.reviews && (
                    <View>
                      <Text>Reviews:</Text>
                      {location.reviews.map((review, index) => (
                        <Text key={index}>- {review}</Text>
                      ))}
                    </View>
                  )}
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  callout: {
    width: 200,
  },
  title: {
    fontWeight: 'bold',
  },
});

export default MapComponent;
