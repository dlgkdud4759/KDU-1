import React from 'react';
import { InfoWindow } from '@react-google-maps/api';

const InfoWindowComponent = ({ location, onClose }) => {
  return (
    <InfoWindow
      position={location.coordinates}
      onCloseClick={onClose}
    >
      <div>
        <h2>{location.name}</h2>
        <p>주소: {location.address}</p>
        <p>연락처: {location.phone}</p>
        <p>별점: {location.rating}</p>
        <p>유형: {location.type === 'veterinary' ? '동물병원' : '반려동물 샵'}</p>
      </div>
    </InfoWindow>
  );
};

export default InfoWindowComponent;
