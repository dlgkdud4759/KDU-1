import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Dimensions, StyleSheet, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Modalize } from 'react-native-modalize';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../Firebase';
import { auth } from '../Firebase';
import { SvgXml } from 'react-native-svg';

const MapComponent = () => {
  const [region, setRegion] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const modalizeRef = useRef(null);
  const [placeInfo, setPlaceInfo] = useState(null)
  const [userLocation, setUserLocation] = useState(null);
  const locationSubscriptionRef = useRef(null);

  // 모달을 여는 함수
  const openModal = () => {
      if (modalizeRef.current) {
          modalizeRef.current.open();
      }
  };

  // 사용자 위치를 가져오는 함수
  useEffect(() => {
    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            locationSubscriptionRef.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 1000, // 1초마다 위치 업데이트
                    distanceInterval: 1, // 1미터 이동할 때마다 위치 업데이트
                },
                (location) => {
                    setUserLocation(location.coords);  // 실시간 위치 저장
                    setRegion({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    });
                }
            );
        }
    };

    getLocation();
// 컴포넌트 언마운트 시 위치 추적 중지
return () => {
  if (locationSubscriptionRef.current) {
      locationSubscriptionRef.current.remove();
  }
};
}, []);

const handlePlaceSelect = (data, details) => {
  console.log('선택된 장소:', data);
  console.log('장소의 좌표:', details.geometry.location);
  const { lat, lng } = details.geometry.location;

  // 검색된 장소의 정보를 상태에 저장
  setSearchLocation({
      latitude: lat,
      longitude: lng,
  });

  setPlaceInfo({
      name: data.structured_formatting.main_text, // 장소 이름
      address: data.structured_formatting.secondary_text, // 주소
      latitude: lat,
      longitude: lng,
  });
};

useEffect(() => {
  if (searchLocation) {
      setRegion({
          latitude: searchLocation.latitude,
          longitude: searchLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
      });
  } console.log('현재 searchLocation:', searchLocation);
}, [searchLocation]);

if (!region) {
  return <Text>Loading map...</Text>;
}

return (
  <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
          <GooglePlacesAutocomplete
              placeholder="동물병원, 애견샵 등 장소 검색"
              onPress={handlePlaceSelect}
              query={{
                  key: 'AIzaSyCgGMhjFmQHbpQdw6XGWwC1-Sy20KBvseo',
                  language: "ko",
                  components: "country:kr",
              }}
              fetchDetails={true}
              styles={{
                  container: {
                      position: 'absolute',
                      top: 40,
                      left: 0,
                      right: 0,
                      zIndex: 1,
                  },
                  textInput: {
                      height: 50,
                      fontSize: 16,
                      borderColor: '#DDD',
                      borderWidth: 1,
                      borderRadius: 15,
                      paddingLeft: 10,
                      marginTop: 12,
                  },
              }}
          />
          <MapView style={styles.map} region={region} showsUserLocation followUserLocation>
              {searchLocation && (
                  <Marker coordinate={searchLocation} onPress={openModal} pinColor="#111111"/>
              )}
          </MapView>
          <Modalize ref={modalizeRef} snapPoint={300}>
              <View style={styles.infoContainer}>
              {placeInfo ? (
                  <>
                      <Text style={styles.title}>{placeInfo.name}</Text>
                      <Text style={styles.subtitle}>{placeInfo.address}</Text>
                      <Text style={styles.details}>
                          위도: {placeInfo.latitude} | 경도: {placeInfo.longitude}
                      </Text>
                  </>
              ) : (
                  <Text>장소 정보를 불러오는 중...</Text>
              )}
                  <Button title="더보기" onPress={() => { }} />
              </View>
          </Modalize>
      </View>
  </GestureHandlerRootView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
},
marker: {
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  padding: 5,
  borderRadius: 10,
},
markerText: {
  color: 'white',
  fontWeight: 'bold',
},
infoContainer: {
  padding: 20,
},
title: {
  fontSize: 18,
  fontWeight: 'bold',
},
subtitle: {
  fontSize: 14,
  color: 'gray',
},
details: {
  marginTop: 10,
  fontSize: 12,
  color: 'gray',
},
});

export default MapComponent;
