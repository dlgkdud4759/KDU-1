import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Easing, TouchableWithoutFeedback, Alert } from 'react-native';
import { auth } from '../Firebase';

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
    top: 20,
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
    width: 70, // 원의 크기 증가
    height: 70, // 원의 크기 증가
    borderRadius: 35,
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
    top: 80, // 상단에서 떨어진 거리
    left: 40,
  },
  logoutText: {
    fontSize: 16,
    textAlign: 'center', // 가운데 정렬
    marginTop: 20,
    fontWeight: 'bold',
  },
  petTrackerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center', // 가운데 정렬
    marginTop: 10,
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
