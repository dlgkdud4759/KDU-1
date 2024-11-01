import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Easing, TouchableWithoutFeedback, Alert } from 'react-native';
import { auth } from '../Firebase';
import { SvgXml } from 'react-native-svg';

const svgString = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.45439 9.65383C5.23337 7.54084 4.01341 6.31783 2.61841 6.31783V6.31984C2.53422 6.31975 2.45012 6.32406 2.36641 6.33283C0.869406 6.48681 -0.199579 7.98081 0.0324057 10.2198C0.256421 12.3618 1.55139 13.9998 2.97442 13.9998C3.03887 14 3.10333 13.9966 3.16741 13.9899C4.66741 13.8338 5.68839 11.8898 5.45439 9.65383ZM2.95839 11.9878C2.37381 11.4966 2.09275 10.8078 2.02141 10.0118C2.02141 9.50823 2.01662 9.01136 2.24041 8.56379C2.36476 8.32989 2.51641 8.32581 2.57439 8.31981L2.61859 8.31906C2.95558 8.31906 3.36437 8.89478 3.46539 9.86078C3.53458 10.6132 3.42794 11.386 2.95839 11.9878Z" fill="black"/>
<path d="M8.46702 8.45002C8.53804 8.45002 8.60802 8.45002 8.67904 8.439C10.326 8.26702 11.452 6.13102 11.1951 3.669C10.9521 1.34602 9.61002 0 8.07604 0C7.98383 9.375e-05 7.89172 0.0050625 7.80003 0.015C6.15205 0.186 4.97404 1.82902 5.23105 4.29202C5.47804 6.648 6.90004 8.45002 8.46702 8.45002ZM7.49104 2.36002C7.59177 2.1615 7.78499 2.02641 8.00605 2.00002C8.02935 1.99856 8.05274 1.99856 8.07604 2.00002C8.54005 2.00002 9.07602 2.64502 9.20605 3.87703C9.29947 4.59361 9.18711 5.32195 8.88205 5.97703C8.70004 6.32203 8.51704 6.44203 8.46707 6.44705C8.21005 6.44705 7.38308 5.63306 7.22005 4.08103C7.1158 3.49317 7.21119 2.88736 7.49104 2.36002Z" fill="black"/>
<path d="M15.3648 8.439C15.4358 8.44598 15.5068 8.45002 15.5768 8.45002C17.1418 8.45002 18.5668 6.65002 18.8128 4.29202C19.0698 1.82902 17.8918 0.186 16.2458 0.015C16.1538 0.0050625 16.0613 4.6875e-05 15.9688 0C14.4338 0 13.0918 1.34602 12.8488 3.669C12.5918 6.13102 13.7178 8.26898 15.3648 8.439ZM14.8388 3.876C14.9668 2.64502 15.5008 2.00002 15.9688 2.00002C15.9918 1.99852 16.0148 1.99852 16.0378 2.00002C16.2586 2.02617 16.4519 2.16089 16.5528 2.35903C16.8337 2.88605 16.9292 3.49219 16.8238 4.08005C16.6618 5.63203 15.8338 6.44606 15.5728 6.44606C15.5268 6.44606 15.3438 6.32105 15.1618 5.97605C14.8567 5.32097 14.7446 4.59248 14.8388 3.876Z" fill="black"/>
<path d="M12.0008 11C7.45879 11 3.00079 15.641 2.99479 20.369C2.87081 23.568 5.59481 24.727 8.89481 23.547C10.9066 22.861 13.089 22.861 15.1008 23.547C15.8759 23.8087 16.6837 23.9612 17.5008 24C20.3938 24 21.0008 22.025 21.0008 20.369C21.0008 15.641 16.5428 11 12.0008 11ZM12.0008 21C9.74681 20.643 4.77679 23.833 5.00081 20.369C5.00081 16.719 8.53383 13 12.0008 13C15.4678 13 19.0008 16.7191 19.0008 20.369C19.2268 23.83 14.2658 20.647 12.0008 21Z" fill="black"/>
<path d="M21.9713 7.39071L21.9708 7.39268C21.8889 7.37313 21.8061 7.35799 21.7226 7.34716C20.2305 7.1516 18.8456 8.35868 18.5547 10.5908C18.2785 12.7267 19.1606 14.6193 20.5452 14.9476C20.608 14.9626 20.6714 14.9742 20.7354 14.9824C22.2309 15.1766 23.6729 13.5207 23.9611 11.291C24.2335 9.18405 23.3286 7.71255 21.9713 7.39071ZM21.978 11.0336C21.8717 11.7815 21.5897 12.5089 20.9939 12.9862C20.5384 12.3733 20.4239 11.6383 20.5381 10.8473C20.6543 10.3573 20.7643 9.87274 21.0852 9.48893C21.2602 9.29004 21.4087 9.32102 21.4665 9.32857L21.5097 9.33809C21.8376 9.4158 22.1026 10.0703 21.978 11.0336Z" fill="black"/>
</svg>`;

export function Main({ onNavigate, onLogout }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(-300));

  const toggleModal = () => {
    if (modalVisible) {
      Animated.timing(modalAnimation, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start(() => setModalVisible(false));
    } else {
      setModalVisible(true);
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '로그아웃을 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          onPress: () => {
            auth.signOut()
              .then(onLogout)
              .catch((error) => console.error('로그아웃 오류:', error));
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleNavigate = () => {
    toggleModal();
    const userId = auth.currentUser.uid; // 유저 ID 가져오기
    onNavigate('Information3', { userId }); // userId를 함께 전달
  };

  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.openButton} onPress={toggleModal}>
        <Text style={styles.openButtonText}>열기</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalBackground} />
            <Animated.View style={[styles.modalContent, { transform: [{ translateX: modalAnimation }] }]}>
              <TouchableWithoutFeedback>
                <View style={styles.modalInner}>
                  <View style={styles.topSeparator} />
                  <View style={styles.headerContainer}>
                    <View style={styles.circle} />
                    <View style={styles.profileTextContainer}>
                      <TouchableOpacity onPress={handleNavigate} style={styles.editButton}>
                        <Text style={styles.profileText}>정보 수정</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.nameText}>이름</Text>
                  <SvgXml xml={svgString} width="48" height="48" style={styles.icon}/>
                  <View style={styles.bottomContainer}>
                    <View style={styles.separator1} />
                    <View style={styles.logoutContainer}>
                      <TouchableOpacity onPress={handleLogout}>
                        <Text style={styles.logoutText}>로그 아웃</Text>
                      </TouchableOpacity>
                      <Text style={styles.petTrackerText}>Pet Tracker</Text>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View style={styles.header}>
        <Text style={styles.petTracker}>Pet Tracker</Text>
        <Text style={styles.text}>강아지, 고양이 이미지</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.subText1}>입양</Text>
          <Text style={styles.subText2}>펫 마켓</Text>
          <Text style={styles.subText3}>행사일정</Text>
        </View>
        <View style={[styles.row, styles.rowMargin]}>
          <Text style={styles.featureText1}>증상검사</Text>
          <Text style={styles.featureText2}>산책</Text>
        </View>
        <Text style={styles.eventText}>행사 정보</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.navItem}>
          <Text style={styles.navText}>홈</Text>
        </View>
        <View style={styles.navItem}>
          <Text style={styles.navText}>지도</Text>
        </View>
        <View style={styles.navItem}>
          <Text style={styles.navText}>게시판</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  openButton: {
    position: 'absolute',
    top: 40,
    left: 0,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  openButtonText: {
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // 모달을 아래쪽에 위치
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
  },
  modalContent: {
    height: '100%',
    width: '70%',
    backgroundColor: '#ffffff',
    padding: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start', // 위쪽에서부터 쌓이도록 변경
    flex: 1, // flex 속성 추가
  },
  modalInner: {
    flex: 1, // 모달 내부를 전체 차지하도록 설정
  },
  topSeparator: {
    height: 1, // 상단 선의 두께
    width:  210, // 상단 선의 길이
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // 상단 선의 색상 (희미하게)
    marginBottom: 20, // 상단 선과 내용 간의 간격
    top: 120,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'absolute', // 좌측 상단 끝에 붙이기 위해 position 절대값으로 설정
    top: 10, // 상단에서 떨어진 거리
    left: 20, // 좌측에서 떨어진 거리
  },
  circle: {
    width: 84, // 원의 크기 증가
    height: 84, // 원의 크기 증가
    borderRadius: 50,
    backgroundColor: 'white', // 원 색상
    borderWidth: 1, // 테두리 두께 수정 (얇게)
    borderColor: 'black', // 테두리 색상 변경
    marginRight: 20, // 원과 텍스트 사이의 간격
  },
  profileTextContainer: {
    flexDirection: 'column', // 세로로 텍스트 배치
  },
  profileText: {
    fontSize: 15,
    marginVertical: 5, // 위 아래 텍스트 간의 간격
  },
  nameText: {
    fontSize: 16,
    textAlign: 'left', // 좌측 정렬
    position: 'absolute', // 좌측 상단 끝에 붙이기 위해 position 절대값으로 설정
    top: 100, // 상단에서 떨어진 거리
    left: 48,
  },
  icon: {
    left: 37,
    top: 7,
  },
  logoutText: {
    fontSize: 16,
    textAlign: 'center', // 가운데 정렬
    marginTop: 20,
    fontWeight: 'bold',
    color: '#525252',
  },
  petTrackerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center', // 가운데 정렬
    marginTop: 10,
    color: '#9A9A9A',
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bottomContainer: {
    marginTop: 'auto', // 남은 공간을 차지하여 하단으로 이동
    paddingBottom: 5, // 하단 여백
    alignItems: 'center', // 중앙 정렬
  },
  separator1: {
    height: 1, // 선의 두께
    width: 210, // 선의 길이
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // 선의 색상 (희미하게)
  },
  logoutContainer: {
    alignItems: 'center', // 텍스트 중앙 정렬
  },
  closeButtonText: {
    fontSize: 16,
    color: 'blue',
    marginTop: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 70,
  },
  petTracker: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 1)',
    top: -30,
  },
  text: {
    fontSize: 30,
    top: 50,
  },
  subText1: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.7)',
    marginVertical: 10,
    top: -30,
    left: -20,
  },
  subText2: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.7)',
    marginVertical: 10,
    top: -30,
  },
  subText3: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.7)',
    marginVertical: 10,
    top: -30,
  },
  content: {
    alignItems: 'center',
    marginVertical: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  rowMargin: {
    marginTop: 20,
  },
  featureText1: {
    fontSize: 18,
    color: 'rgba(0, 0, 0, 0.7)',
    marginVertical: 10,
    left: -20,
  },
  featureText2: {
    fontSize: 18,
    color: 'rgba(0, 0, 0, 0.7)',
    marginVertical: 10,
  },
  eventText: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.7)',
    marginVertical: 10,
    marginTop: 20,
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
    paddingVertical: 10,
  },
  navText: {
    fontSize: 18,
    color: 'rgba(0, 0, 0, 0.7)',
  },
});

export default Main;