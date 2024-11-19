import React from 'react';
import * as S from './Modal.style';

const Modal = ({ place, onClose }) => {
  return (
    <S.ModalOverlay>
      <S.ModalContent>
        <S.CloseButton onClick={onClose}>&times;</S.CloseButton>
        <h2>{place.name}</h2>
        <p>{place.vicinity}</p>
        {place.rating && <p>⭐ 평점: {place.rating} (리뷰 {place.user_ratings_total}개)</p>}
        
        {/* 전화번호 표시 */}
        {place.formatted_phone_number && (
          <p>📞 전화번호: {place.formatted_phone_number}</p>
        )}

        {/* 웹사이트 URL 표시 */}
        {place.website && (
          <p>
            🌐 웹사이트: <a href={place.website} target="_blank" rel="noopener noreferrer">{place.website}</a>
          </p>
        )}

        {/* 영업시간 표시 */}
        {place.opening_hours && place.opening_hours.weekday_text && (
          <div>
            <h4>영업시간</h4>
            <ul>
              {place.opening_hours.weekday_text.map((day, index) => (
                <li key={index}>{day}</li>
              ))}
            </ul>
          </div>
        )}
      </S.ModalContent>
    </S.ModalOverlay>
  );
};

export default Modal;
