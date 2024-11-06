import React from 'react';
import { Marker } from '@react-google-maps/api';

const UserLocationMarker = ({ userLocation }) => {
  return (
    userLocation && (
      <Marker
        position={userLocation}
        icon={{
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new window.google.maps.Size(40, 40)
        }}
        title="내 위치"
      />
    )
  );
};

export default UserLocationMarker;