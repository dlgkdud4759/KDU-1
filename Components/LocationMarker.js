import React from 'react';
import { Marker } from '@react-google-maps/api';

const LocationMarker = ({ location, onSelect }) => {
  return (
    <Marker
      position={location.coordinates}
      onClick={() => onSelect(location)}
      title={location.name}
    />
  );
};

export default LocationMarker;