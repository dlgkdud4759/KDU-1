import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Alert, StyleSheet, Animated } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { Stop } from './SvgIcon';
import { SvgXml } from 'react-native-svg';
import { firestore } from '../Firebase';
import { collection, addDoc, getDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const Walk = () => {
    const [region, setRegion] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [walkPath, setWalkPath] = useState([]);
    const [distance, setDistance] = useState(0); // 총 거리
    const [startTime, setStartTime] = useState(null); // 산책 시작 시간
    const [isWalking, setIsWalking] = useState(false); // 산책 상태
    const locationSubscriptionRef = useRef(null);
    const translateY = useRef(new Animated.Value(200)).current;

    // 위치 추적 시작
    const startWalk = () => {
        setStartTime(new Date());
        setIsWalking(true);
        setDistance(0);
        animateSlideUp();
    };

    // 위치 추적 종료
    const endWalk = () => {
        if (locationSubscriptionRef.current) {
            locationSubscriptionRef.current.remove();
        }
        setIsWalking(false);
        animateSlideDown();

        // 산책 데이터 저장 로직 추가
        const walkData = {
            distance,
            startTime,
            endTime: new Date(),
            path: walkPath,
        };
        saveWalkData(walkData);

        setWalkPath([]);
        setDistance(0);
        setStartTime(null);
    };

    const saveWalkData = async (walkData) => {
        try {
            const auth = getAuth(); // Firebase Authentication 가져오기
            const userId = auth.currentUser?.uid; // 현재 로그인된 사용자 ID 가져오기
    
            if (!userId) {
                Alert.alert('로그인이 필요합니다.', '로그인 후 다시 시도해주세요.');
                return;
            }

            const walksCollection = collection(firestore, 'walks');
            const docRef = await addDoc(walksCollection, { ...walkData, userId });
            console.log('Walk data saved successfully with ID:', docRef.id);
            
            // 문서 조회 (getDoc)
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                console.log('Document data:', docSnapshot.data());
            } else {
                console.log('No such document!');
            }
            
            console.log('Walk data saved successfully with ID:', docRef.id);
            Alert.alert('Walk data saved successfully!');
        } catch (error) {
            console.log('Error saving walk data:', error);
            Alert.alert('Error saving walk data:', error.message);
        }
    };

    // 애니메이션 시작
    const animateSlideUp = () => {
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    // 애니메이션 종료
    const animateSlideDown = () => {
        Animated.timing(translateY, {
            toValue: 200,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    // 산책 시작 시 위치 추적 시작
    useEffect(() => {
        const getLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                locationSubscriptionRef.current = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        timeInterval: 5000, // 1초마다 위치 업데이트
                        distanceInterval: 10, // 1미터 이동할 때마다 위치 업데이트
                    },
                    (location) => {
                        setUserLocation(location.coords);

                        // 경로 추가
                        setWalkPath((prevPath) => {
                            const updatedPath = [...prevPath, location.coords];

                            // 거리 계산 및 누적
                            if (updatedPath.length > 1) {
                                const lastCoords = updatedPath[updatedPath.length - 2];
                                const newDistance = calculateDistance(
                                    lastCoords.latitude,
                                    lastCoords.longitude,
                                    location.coords.latitude,
                                    location.coords.longitude
                                );
                                setDistance((prevDistance) => prevDistance + newDistance);
                            }

                            return updatedPath;
                        });

                        // 지도 업데이트
                        setRegion({
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.006,
                            longitudeDelta: 0.006,
                        });
                    }
                );
            } else {
                Alert.alert(
                    '위치 권한 필요',
                    '위치 권한을 허용해 주세요.',
                    [
                        { text: '취소', style: 'cancel' },
                        { text: '설정 열기', onPress: () => Linking.openSettings() }
                    ]
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

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371; // 지구 반경 (km)
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000; // 거리 (m)
    };

    // 위치 정보가 없으면 로딩 중 메시지 표시
    if (!region) {
        return <Text>Loading map...</Text>;
    }

    return (
        <View style={styles.container}>
            <MapView style={styles.map} region={region} showsUserLocation followUserLocation>
                {/* 산책 경로를 Polyline으로 표시 */}
                {walkPath.length > 1 && (
                    <Polyline
                        coordinates={walkPath}
                        strokeColor="#ABC4FF"
                        strokeWidth={5}
                    />
                )}
            </MapView>
            <Animated.View style={[styles.slideUpBar, { transform: [{ translateY }] }]}>
                <Text style={styles.endText}>{(distance / 1000).toFixed(2)}{"\n"} 거리 (km)</Text>
                <TouchableOpacity style={styles.endButton} onPress={endWalk}>
                    <SvgXml xml={Stop} style={styles.stopIcon} />
                </TouchableOpacity>
                <Text style={styles.endText}>{startTime ? (
                    <>
                        {`${String(Math.floor((new Date() - startTime) / 1000 / 60 / 60)).padStart(2, '0')} : ${String(Math.floor((new Date() - startTime) / 1000 / 60) % 60).padStart(2, '0')}`}
                        {"\n"}
                        시간
                    </>
                ) : '00 : 00\n시간'}</Text>
            </Animated.View>
            {!isWalking && (
                <TouchableOpacity style={styles.startButton} onPress={startWalk}>
                    <Text style={styles.startButtonText}>산책하기</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    slideUpBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#ABC4FF',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
    },
    startButton: {
        position: 'absolute',
        bottom: 0,
        paddingTop: 20,
        paddingBottom: 40,
        backgroundColor: '#ABC4FF',
        padding: 15,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
    },
    startButtonText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    endText: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        paddingTop: 17,
        paddingHorizontal: 20,
        textAlign: 'center',
        lineHeight: 28,
    },
    endButton: {
        width: '20%',
        height: '70%',
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 100,
    },
    stopIcon: {
        bottom: 10.5,
    }
});

export default Walk;