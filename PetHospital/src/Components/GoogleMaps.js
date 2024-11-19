import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import Modal from './modal.js';
import * as S from './GoogleMaps.style';

// libraries 배열을 컴포넌트 외부에 선언
const LIBRARIES = ['places'];

const KEYWORD_LIST = [
  { id: 1, value: '동물병원', emoji: '🧑‍⚕️' },
  { id: 2, value: '애완동물용품점', emoji: '🛍️' },
];

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 109px)',
};

const GoogleMaps = () => {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [keyword, setKeyword] = useState('동물병원');
  const [center, setCenter] = useState(null); // 내 위치로 중심을 설정할 상태 변수 추가

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCSjbFqHrJU_PwTjym1qDvG8qAwfII35lw",
    libraries: LIBRARIES, // 배열을 변수로 전달
  });

  // 내 위치를 얻고 지도 중심 설정
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(userLocation); // 내 위치로 중심 설정
      });
    }
  }, []);

  // 장소 검색
  useEffect(() => {
    if (map && center) {
      const service = new window.google.maps.places.PlacesService(map);
      const request = {
        location: center,
        radius: '5000', // 5km 반경으로 검색
        keyword,
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlaces(results);
        }
      });
    }
  }, [map, center, keyword]);

  // Place Details API 호출 (선택한 장소에 대한 상세 정보 가져오기)
  const fetchPlaceDetails = (placeId) => {
    if (!placeId) return;

    const service = new window.google.maps.places.PlacesService(map);
    const request = { placeId };

    service.getDetails(request, (details, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setSelectedPlace(details); // 상세 정보를 selectedPlace에 저장
      }
    });
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <S.MapContainer>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center || { lat: 37.5904, lng: 126.9344 }} // 내 위치가 설정되면 그 위치로, 아니면 기본 서울로
        zoom={14}
        onLoad={(mapInstance) => setMap(mapInstance)}
      >
        <Marker
          position={center || { lat: 37.5904, lng: 126.9344 }} // 내 위치가 설정되면 그 위치로, 아니면 기본 서울로
          icon={{
            url: 'https://cdn-icons-png.flaticon.com/128/7124/7124723.png',
            scaledSize: new window.google.maps.Size(50, 50),
          }}
        />
        {places.map((place) => (
          <Marker
            key={place.place_id}
            position={place.geometry.location}
            onClick={() => fetchPlaceDetails(place.place_id)} // 클릭 시 Place Details API 호출
          />
        ))}
      </GoogleMap>
      <S.SearchBtns>
        {KEYWORD_LIST.map((item) => (
          <S.KeywordBtn
            key={item.id}
            onClick={() => setKeyword(item.value)}
            selected={item.value === keyword}
          >
            {item.value} {item.emoji}
          </S.KeywordBtn>
        ))}
      </S.SearchBtns>
      {selectedPlace && (
        <Modal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}
    </S.MapContainer>
  );
};

export default GoogleMaps;
