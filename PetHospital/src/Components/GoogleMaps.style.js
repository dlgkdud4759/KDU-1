// GoogleMaps.style.js
import styled from 'styled-components';

export const MapContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

export const SearchBtns = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
`;

export const KeywordBtn = styled.button`
  margin: 5px;
  padding: 10px;
  background-color: ${props => (props.selected ? '#007bff' : '#f0f0f0')};
  color: ${props => (props.selected ? 'white' : 'black')};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

export const MoveToLocationButton = styled.button`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;
