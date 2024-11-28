import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ModalComponent from './modal';
import { auth, firestore } from '../Firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { SvgXml } from 'react-native-svg';
import { Home, Map, Commu, Compass } from './SvgIcon';

const MapComponent = ({ navigation }) => {
    const [region, setRegion] = useState(null);
    const [searchLocation, setSearchLocation] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const locationSubscriptionRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [googlePlacesResults, setGooglePlacesResults] = useState([]);
    const [review, setReview] = useState(''); // 리뷰 입력 상태
    const [reviews, setReviews] = useState([]); // 리뷰 리스트 상태
    const [placeId, setPlaceId] = useState(null);
    const currentUser = auth.currentUser; // 현재 로그인한 사용자 정보
    const mapRef = useRef(null);

    // 사용자 위치를 가져오는 함수
    useEffect(() => {
        const getLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                // 처음 위치를 가져와서 화면을 설정
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
    
                setUserLocation(location.coords);  // 현재 위치를 저장
                setRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.07,
                    longitudeDelta: 0.07,
                });
                setIsLoading(false);
            } else {
                console.error("위치 권한이 거부되었습니다.");
                setIsLoading(false); // 권한 거부 시 로딩 종료
            }
        };
    
        getLocation();
    }, []);

    const fetchPlaceDetails = async (placeId) => {
        try {
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=AIzaSyCgGMhjFmQHbpQdw6XGWwC1-Sy20KBvseo`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.status === 'OK' && data.result) {
                return data.result; // 장소 세부 정보 반환
            } else {
                console.error('장소 세부 정보를 가져오는 중 오류 발생:', data.status);
                return null;
            }
        } catch (error) {
            console.error('장소 세부 정보를 가져오는 중 오류 발생:', error);
            return null;
        }
    };

    // Firebase에서 리뷰를 불러오는 함수
    const fetchReviews = async (placeId) => {
        try {
            const reviewsRef = collection(firestore, 'reviews');
            const q = query(reviewsRef, where('placeId', '==', placeId));
            const querySnapshot = await getDocs(q);
            const fetchedReviews = querySnapshot.docs.map(doc => doc.data());
            setReviews(fetchedReviews);
        } catch (error) {
            console.error('리뷰를 가져오는 중 오류 발생:', error);
        }
    };

    // 필터 선택 시 Google Places API를 호출하여 마커 업데이트
    useEffect(() => {
        const fetchGooglePlaces = async () => {
            if (!selectedFilter) {
                setGooglePlacesResults([]);
                return;
            }

            const query = selectedFilter === '동물병원' ? 'pet hospital' : 'pet shop';
            const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${userLocation.latitude},${userLocation.longitude}&radius=5000&key=AIzaSyCgGMhjFmQHbpQdw6XGWwC1-Sy20KBvseo`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                // 데이터 필터링
                const filteredResults = data.results.filter(place => {
                    const isConvenienceStore = place.types.includes("convenience_store");
                    // 제외할 키워드 배열
                    const excludedKeywords = ["편의점", "다이소", "백화점", "마트", "슈퍼"];
                    // 이름에 제외할 키워드가 포함되어 있는지 확인
                    const hasExcludedName = excludedKeywords.some(keyword => place.name.includes(keyword));
                    return !isConvenienceStore && !hasExcludedName;
                });

                setGooglePlacesResults(filteredResults); // 필터링된 결과로 상태 업데이트
            } catch (error) {
                console.error('Google Places API 호출 중 오류 발생:', error);
            }
        };

        if (userLocation) {
            fetchGooglePlaces();
        }
    }, [selectedFilter, userLocation]);

    useEffect(() => {
        if (searchLocation && mapRef.current) {
            mapRef.current.animateToRegion(
                {
                    latitude: searchLocation.latitude,
                    longitude: searchLocation.longitude,
                    latitudeDelta: 0.01, // 줌 설정
                    longitudeDelta: 0.01,
                },
                500 // 애니메이션 지속 시간 (ms)
            );
        }
    }, [searchLocation]);

    const handlePlaceSelect = async (data, details) => {
        const placeDetails = details || await fetchPlaceDetails(data.place_id);
        if (!placeDetails) {
            console.error('장소 세부 정보를 가져올 수 없습니다.');
            return;
        }
    
        const { lat, lng } = placeDetails.geometry.location;
        setSearchLocation({ latitude: lat, longitude: lng });
        setSelectedPlace({
            name: placeDetails.name || '장소 이름 없음',
            address: placeDetails.formatted_address || '주소 없음',
            latitude: lat,
            longitude: lng,
            rating: placeDetails.rating || '정보 없음',
            totalRatings: placeDetails.user_ratings_total || '정보 없음',
            placeId: data.place_id,
        });
    
        setModalVisible(true);
        await fetchReviews(data.place_id);
    };

    const handleMarkerPress = async (place) => {
        try {
            const placeDetails = await fetchPlaceDetails(place.place_id);
            if (!placeDetails) {
                console.error("Place details could not be retrieved.");
                return;
            }

            const { lat, lng } = placeDetails.geometry.location;

            // setSelectedPlace 상태 업데이트
            setSelectedPlace({
                name: placeDetails.name || "장소 이름 없음",
                address: placeDetails.formatted_address || "주소 없음",
                latitude: lat,
                longitude: lng,
                rating: placeDetails.rating || "정보 없음",
                totalRatings: placeDetails.user_ratings_total || "정보 없음",
                formatted_phone_number: placeDetails.formatted_phone_number || null,
                placeId: place.place_id,
            });

            // setSelectedPlace가 완료된 후 모달 열기
            setTimeout(() => {
                setModalVisible(true);
                fetchReviews(place.place_id); // 리뷰 가져오기
            }, 0);  // 상태 업데이트가 완료될 때까지 기다림
        } catch (error) {
            console.error("Error fetching place details:", error);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4287f5" />
                <Text>Loading map...</Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <GooglePlacesAutocomplete
                    placeholder="동물병원, 애견샵 등 장소 검색"
                    query={{
                        key: 'AIzaSyCgGMhjFmQHbpQdw6XGWwC1-Sy20KBvseo',
                        language: "ko",
                        components: "country:kr",
                        types: 'establishment',
                        fields: 'name,rating,user_ratings_total,formatted_phone_number,geometry',
                    }}
                    textInputProps={{
                        returnKeyType: 'search',
                    }}
                    fetchDetails={true}
                    onPress={(data, details) => handlePlaceSelect(data, details)}
                    renderRow={(data) => {
                        const name = data.structured_formatting?.main_text;
                        return name ? (
                            <Text style={{ padding: 10 }}>{name}</Text>
                        ) : null; // 상호명이 없으면 제외
                    }}
                    styles={{
                        container: {
                            position: 'absolute',
                            top: 40,
                            left: 0,
                            right: 0,
                            left: '5%',
                            right: '5%',
                            zIndex: 1,
                            width: '90%',
                        },
                        textInput: {
                            height: 50,
                            fontSize: 16,
                            borderColor: '#DDD',
                            borderWidth: 1,
                            borderRadius: 15,
                            paddingLeft: 40,
                            marginTop: 12,
                        },
                    }}
                />
                <View style={styles.filterContainer}>
                    {['동물병원', '애견용품점'].map((filter) => (
                        <Text
                            key={filter}
                            style={[styles.filterButton, selectedFilter === filter && styles.activeFilterButton]}
                            onPress={() => setSelectedFilter(selectedFilter === filter ? null : filter)}
                        >
                            {filter}
                        </Text>
                    ))}
                </View>
                <MapView style={styles.map} ref={mapRef} region={region} showsUserLocation={true} followUserLocation={false}>
                    {searchLocation && searchLocation.latitude && searchLocation.longitude && (
                        <Marker
                            coordinate={{
                                latitude: searchLocation.latitude,
                                longitude: searchLocation.longitude,
                            }}
                            title={selectedPlace.name}
                            description={selectedPlace.address}
                        />
                    )}
                    {googlePlacesResults.map((place) => (
                        <Marker
                            key={place.place_id}
                            coordinate={{
                                latitude: place.geometry.location.lat,
                                longitude: place.geometry.location.lng,
                            }}
                            pinColor={selectedFilter === '동물병원' ? '#FF5733' : '#4287f5'}
                            title={place.name}
                            description={place.vicinity}
                            onPress={() => handleMarkerPress(place)}
                        />
                    ))}
                </MapView>
                <ModalComponent
                    visible={modalVisible}
                    place={selectedPlace}
                    onClose={() => setModalVisible(false)}
                />
                <View style={styles.footer}>
                    <View style={styles.navItem}>
                        <TouchableOpacity onPress={() => navigation.navigate("Main")}>
                            <SvgXml xml={Home} width="36" height="36" style={styles.icon} />
                            <Text style={styles.navText}>홈</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.navItem}>
                        <TouchableOpacity onPress={() => console.log("Navigation to Map")}>
                            <SvgXml xml={Map} width="36" height="36" style={styles.icon} />
                            <Text style={styles.navText}>지도</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.navItem}>
                        <TouchableOpacity onPress={() => console.log("Navigation to Commu")}>
                            <SvgXml xml={Commu} width="36" height="36" style={styles.icon} />
                            <Text style={styles.navText}>커뮤니티</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
        width: '100%',
    },
    filterContainer: {
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        zIndex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    filterButton: {
        padding: 10,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        backgroundColor: '#FFFFFF',
        color: 'black',
        fontSize: 14,
        fontWeight: '500',
        shadowOpacity: 0.2,
        shadowOffset: {
            height: 2,
        }
    },
    activeFilterButton: {
        borderWidth: 1,
        borderColor: '#FFA86B',
        backgroundColor: '#FFD991',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
        width: '100%',
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    icon: {
        alignItems: 'center',
        marginBottom: 8,
    },
    navText: {
        fontSize: 18,
        textAlign: 'center',
        color: 'rgba(0, 0, 0, 0.7)',
        marginBottom: 15,
    },
});

export default MapComponent;