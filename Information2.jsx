import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SvgXml } from 'react-native-svg';

const svgString = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 17.5C12 17.7967 11.912 18.0867 11.7472 18.3334C11.5824 18.58 11.3481 18.7723 11.074 18.8858C10.7999 18.9994 10.4983 19.0291 10.2074 18.9712C9.91639 18.9133 9.64912 18.7704 9.43934 18.5607C9.22956 18.3509 9.0867 18.0836 9.02882 17.7926C8.97094 17.5017 9.00065 17.2001 9.11418 16.926C9.22771 16.6519 9.41997 16.4176 9.66665 16.2528C9.91332 16.088 10.2033 16 10.5 16C10.8978 16 11.2794 16.158 11.5607 16.4393C11.842 16.7206 12 17.1022 12 17.5ZM21.5 16C21.2033 16 20.9133 16.088 20.6666 16.2528C20.42 16.4176 20.2277 16.6519 20.1142 16.926C20.0007 17.2001 19.9709 17.5017 20.0288 17.7926C20.0867 18.0836 20.2296 18.3509 20.4393 18.5607C20.6491 18.7704 20.9164 18.9133 21.2074 18.9712C21.4983 19.0291 21.7999 18.9994 22.074 18.8858C22.3481 18.7723 22.5824 18.58 22.7472 18.3334C22.912 18.0867 23 17.7967 23 17.5C23 17.1022 22.842 16.7206 22.5607 16.4393C22.2794 16.158 21.8978 16 21.5 16ZM29 6V17C29 23.6163 23.1688 29 16 29C8.83125 29 3 23.6163 3 17V6C3.00018 5.60458 3.11758 5.21808 3.33736 4.88935C3.55713 4.56062 3.86942 4.30442 4.23476 4.15312C4.6001 4.00182 5.00209 3.96222 5.38993 4.03931C5.77777 4.1164 6.13405 4.30674 6.41375 4.58625C6.43125 4.60375 6.44625 4.62 6.46125 4.6375L8.625 7.125C10.8374 5.73886 13.3955 5.0037 16.0063 5.0037C18.617 5.0037 21.1751 5.73886 23.3875 7.125L25.5387 4.6375C25.5537 4.62 25.5688 4.60375 25.5863 4.58625C25.866 4.30674 26.2222 4.1164 26.6101 4.03931C26.9979 3.96222 27.3999 4.00182 27.7652 4.15312C28.1306 4.30442 28.4429 4.56062 28.6626 4.88935C28.8824 5.21808 28.9998 5.60458 29 6ZM27 6L24.305 9.10001C24.1401 9.29072 23.9093 9.41214 23.6588 9.43996C23.4082 9.46777 23.1564 9.39993 22.9538 9.25C22.3437 8.79887 21.689 8.41143 21 8.09375V11C21 11.2652 20.8946 11.5196 20.7071 11.7071C20.5196 11.8946 20.2652 12 20 12C19.7348 12 19.4804 11.8946 19.2929 11.7071C19.1054 11.5196 19 11.2652 19 11V7.38125C18.3439 7.2125 17.675 7.09877 17 7.04125V11C17 11.2652 16.8946 11.5196 16.7071 11.7071C16.5196 11.8946 16.2652 12 16 12C15.7348 12 15.4804 11.8946 15.2929 11.7071C15.1054 11.5196 15 11.2652 15 11V7.04125C14.325 7.09877 13.6561 7.2125 13 7.38125V11C13 11.2652 12.8946 11.5196 12.7071 11.7071C12.5196 11.8946 12.2652 12 12 12C11.7348 12 11.4804 11.8946 11.2929 11.7071C11.1054 11.5196 11 11.2652 11 11V8.09375C10.311 8.41143 9.6563 8.79887 9.04625 9.25C8.84403 9.40037 8.59249 9.46884 8.34196 9.44172C8.09143 9.41461 7.86037 9.2939 7.695 9.10375L5 6V17C5 22.2075 9.40125 26.5 15 26.9588V24.4138L13.2925 22.7063C13.1997 22.6133 13.1261 22.5031 13.0758 22.3817C13.0256 22.2603 12.9998 22.1303 12.9999 21.9989C12.9999 21.8676 13.0259 21.7376 13.0762 21.6162C13.1265 21.4949 13.2002 21.3847 13.2931 21.2919C13.4808 21.1044 13.7352 20.9991 14.0004 20.9993C14.1318 20.9993 14.2618 21.0253 14.3831 21.0756C14.5045 21.1259 14.6147 21.1996 14.7075 21.2925L16 22.585L17.2925 21.2925C17.3853 21.1996 17.4955 21.1259 17.6169 21.0756C17.7382 21.0253 17.8682 20.9993 17.9996 20.9993C18.1309 20.9992 18.261 21.025 18.3823 21.0752C18.5037 21.1254 18.614 21.1991 18.7069 21.2919C18.7998 21.3847 18.8735 21.4949 18.9238 21.6162C18.9741 21.7376 19.0001 21.8676 19.0001 21.9989C19.0002 22.1303 18.9744 22.2603 18.9242 22.3817C18.8739 22.5031 18.8003 22.6133 18.7075 22.7063L17 24.4138V26.9588C22.5988 26.4975 27 22.2088 27 17V6Z" fill="#343330"/>
</svg>`;

const svgString1 = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M29.9637 15.625L27.9112 4.625C27.8611 4.35688 27.7566 4.10184 27.6042 3.87558C27.4519 3.64932 27.2548 3.45662 27.0252 3.30933C26.7956 3.16204 26.5383 3.06328 26.2691 3.01911C26 2.97495 25.7246 2.98631 25.46 3.0525L25.4212 3.06375L18.8562 5.00001H13.1437L6.57871 3.07L6.53996 3.05875C6.27533 2.99256 5.99996 2.9812 5.73078 3.02536C5.4616 3.06953 5.2043 3.16829 4.97471 3.31558C4.74511 3.46287 4.54807 3.65557 4.3957 3.88183C4.24334 4.10809 4.13886 4.36313 4.08871 4.63125L2.03621 15.625C1.94844 16.0653 2.01359 16.5224 2.22089 16.9206C2.42819 17.3188 2.76521 17.6344 3.17621 17.815C3.43942 17.9357 3.72539 17.9988 4.01496 18C4.36155 17.9998 4.70173 17.9066 4.99996 17.73V23C4.99996 24.3261 5.52674 25.5979 6.46443 26.5355C7.40211 27.4732 8.67388 28 9.99996 28H22C23.326 28 24.5978 27.4732 25.5355 26.5355C26.4732 25.5979 27 24.3261 27 23V17.7313C27.2979 17.9075 27.6376 18.0007 27.9837 18.0013C28.2736 18.0004 28.56 17.9378 28.8237 17.8175C29.2352 17.6368 29.5726 17.3208 29.7799 16.9221C29.9873 16.5233 30.0521 16.0657 29.9637 15.625ZM3.99996 16L6.05371 5.00001L11.3125 6.54625L3.99996 16ZM22 26H17V24.4138L18.7075 22.7075C18.8951 22.5199 19.0005 22.2654 19.0005 22C19.0005 21.7346 18.8951 21.4801 18.7075 21.2925C18.5198 21.1049 18.2653 20.9994 18 20.9994C17.7346 20.9994 17.4801 21.1049 17.2925 21.2925L16 22.5863L14.7075 21.2925C14.5198 21.1049 14.2653 20.9994 14 20.9994C13.7346 20.9994 13.4801 21.1049 13.2925 21.2925C13.1048 21.4801 12.9994 21.7346 12.9994 22C12.9994 22.2654 13.1048 22.5199 13.2925 22.7075L15 24.4138V26H9.99996C9.20431 26 8.44125 25.6839 7.87864 25.1213C7.31603 24.5587 6.99996 23.7957 6.99996 23V15.3888L13.49 7H18.5087L25 15.3888V23C25 23.7957 24.6839 24.5587 24.1213 25.1213C23.5587 25.6839 22.7956 26 22 26ZM28 16L20.6875 6.54625L25.9462 5.00001L28 16ZM13 17.5C13 17.7967 12.912 18.0867 12.7472 18.3334C12.5823 18.58 12.3481 18.7723 12.074 18.8858C11.7999 18.9994 11.4983 19.0291 11.2073 18.9712C10.9164 18.9133 10.6491 18.7704 10.4393 18.5607C10.2295 18.3509 10.0867 18.0836 10.0288 17.7926C9.9709 17.5017 10.0006 17.2001 10.1141 16.926C10.2277 16.6519 10.4199 16.4176 10.6666 16.2528C10.9133 16.088 11.2033 16 11.5 16C11.8978 16 12.2793 16.158 12.5606 16.4393C12.8419 16.7206 13 17.1022 13 17.5ZM22 17.5C22 17.7967 21.912 18.0867 21.7472 18.3334C21.5823 18.58 21.3481 18.7723 21.074 18.8858C20.7999 18.9994 20.4983 19.0291 20.2073 18.9712C19.9164 18.9133 19.6491 18.7704 19.4393 18.5607C19.2295 18.3509 19.0867 18.0836 19.0288 17.7926C18.9709 17.5017 19.0006 17.2001 19.1141 16.926C19.2277 16.6519 19.4199 16.4176 19.6666 16.2528C19.9133 16.088 20.2033 16 20.5 16C20.8978 16 21.2793 16.158 21.5606 16.4393C21.8419 16.7206 22 17.1022 22 17.5Z" fill="#343330"/>
</svg>`;

const svgString2 =`
<svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.74996 19.34C10.1139 19.7544 10.0737 20.3852 9.65996 20.75C9.24556 21.114 8.61471 21.0737 8.24996 20.66L0.249955 11.66C-0.0816908 11.2825 -0.0816908 10.7175 0.249955 10.34L8.24996 1.34C8.48059 1.05366 8.84975 0.916976 9.21124 0.984074C9.57274 1.05117 9.86826 1.31123 9.98078 1.66126C10.0933 2.01129 10.0047 2.39484 9.74996 2.66L2.33996 11L9.74996 19.34Z" fill="#111111"/>
</svg>`;


export function Information2({ onBack, onNavigate }) { // onBack 추가
  const [selectedAnimal, setSelectedAnimal] = useState(null); // 선택된 동물 상태 관리

  const handleAnimalSelect = (animal) => {
    setSelectedAnimal(animal); // 강아지나 고양이를 선택하면 상태에 저장
  };

  const handleSignup = () => {
    if (selectedAnimal) {
      onNavigate('main'); // 선택된 동물이 있을 때 Main으로 이동
    } else {
      alert('반려동물을 선택해 주세요.'); // 선택하지 않았을 때 알림
    }
  };

  const handleGoBack = () => {
    onBack(); // 이전 화면으로 이동
  };

  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <SvgXml xml={svgString2} width="24" height="24" style={styles.icon1}/>
      </TouchableOpacity>

      <Text style={styles.info}>
      <Text style={styles.infoText}>
        {`입양 예정인 반려동물을 선택해 주세요.\n`}
      </Text>
      <Text style={styles.infoText1}>
        {`선택하신 정보는 회원가입 후 마이페이지에서\n변경하실 수 있습니다.`}
      </Text>
      </Text>

      <View style={styles.animalSelectionContainer}>
        <TouchableOpacity
          style={[styles.animalBox, selectedAnimal === '강아지' && styles.selectedBox]}
          onPress={() => handleAnimalSelect('강아지')}
        >
          <SvgXml xml={svgString1} width="64" height="64" style={styles.icon}/>
          <Text style={styles.animalText}>강아지</Text>
          <Text style={styles.animalText1}>강아지 등록</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.animalBox, selectedAnimal === '고양이' && styles.selectedBox]}
          onPress={() => handleAnimalSelect('고양이')}
        >
        <SvgXml xml={svgString} width="64" height="64" style={styles.icon}/>
          <Text style={styles.animalText}>고양이</Text>
          <Text style={styles.animalText1}>고양이 등록</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.group34} onPress={handleSignup}>
        <Text style={styles.buttonText}>{`가입하기`}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    borderRadius: 5,
  },
  info: {
    textAlign: 'left',
    marginBottom: 40,
  },
  infoText: {
    color: '#111111',
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  infoText1: {
    color: '#999999',
  },
  animalSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  animalBox: {
    width: 140,
    height: 180,
    borderRadius: 10,
    backgroundColor: 'rgba(241, 241, 245, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  selectedBox: {
    backgroundColor: 'rgba(200, 200, 255, 1)', // 선택된 동물은 색을 변경
  },
  icon: {
    marginBottom: 16,
  },
  animalText: {
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
  },
  animalText1: {
    color: '#999999',
    fontsize: 10,
  },
  group34: {
    width: 364,
    height: 56,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 230, 158, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default Information2;
