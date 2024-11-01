import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Main() {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.petTracker}>{`Pet Tracker`}</Text>
        <Text style={styles.text}>{`강아지, 고양이 이미지`}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.subText1}>{`입양`}</Text>
          <Text style={styles.subText2}>{`펫 마켓`}</Text>
          <Text style={styles.subText3}>{`행사일정`}</Text>
        </View>
        <View style={[styles.row, styles.rowMargin]}>
          <Text style={styles.featureText1}>{`증상검사`}</Text>
          <Text style={styles.featureText2}>{`산책`}</Text>
        </View>
        {/* 추가된 행사일정 텍스트 */}
        <Text style={styles.eventText}>{`행사 정보`}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.navItem}>
          <Text style={styles.navText}>{`홈`}</Text>
        </View>
        <View style={styles.navItem}>
          <Text style={styles.navText}>{`지도`}</Text>
        </View>
        <View style={styles.navItem}>
          <Text style={styles.navText}>{`게시판`}</Text>
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
  header: {
    alignItems: 'center',
    marginTop: 50,
  },
  petTracker: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 1)',
    top: -10,
  },
  text: {
    fontSize: 30,
    top: 50,
  },
  subText1: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.7)',
    marginVertical: 10,
    top: -50,
    left: -20,
  },
  subText2: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.7)',
    marginVertical: 10,
    top: -50,
  },
  subText3: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.7)',
    marginVertical: 10,
    top: -50,
  },
  content: {
    alignItems: 'center',
    marginVertical: 50,
  },
  row: {
    flexDirection: 'row', // 가로로 나열
    justifyContent: 'space-around', // 항목 간의 간격을 균등하게 조정
    width: '100%', // 전체 너비 사용
  },
  rowMargin: {
    marginTop: 90, // 두 행 사이의 간격 조정
  },
  featureText1: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 1)',
    left: -20,
    top: -20,
  },
  featureText2: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 1)',
    left: -70,
    top: -20,
  },
  eventText: {
    fontSize: 30, // 행사일정 텍스트 폰트 크기
    marginVertical: 20, // 상하 여백
    top: 70,
  },
  footer: {
    flexDirection: 'row', // 가로로 나열
    justifyContent: 'space-around', // 항목 간의 간격을 균등하게 조정
    paddingVertical: 40,
    width: '100%', // 하단 내비게이션 전체 너비 사용
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 1)',
  },
});

export default Main;
