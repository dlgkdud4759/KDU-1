import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { firestore } from '../Firebase';
import { collection, getDocs } from 'firebase/firestore';

const WalkLog = () => {
    const [walkLogs, setWalkLogs] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalDistance, setTotalDistance] = useState(0);
    const [totalDuration, setTotalDuration] = useState('00:00');
    const [expandedLogIndex, setExpandedLogIndex] = useState(null);

    const fetchWalkLogs = async () => {
        try {
            const logsRef = collection(firestore, "walks");
            const snapshot = await getDocs(logsRef);

            // 데이터가 없을 경우 초기화
            if (snapshot.empty) {
                console.log("No walk logs found.");
                setWalkLogs([]);
                setTotalCount(0);
                setTotalDistance(0);
                setTotalDuration("00:00");
                return;
            }

            // Firestore 데이터 매핑 및 필드 유효성 검사
            const logs = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    distance: (data.distance || 0) / 1000,
                    startTime: data.startTime ? new Date(data.startTime.seconds * 1000) : null,
                    endTime: data.endTime ? new Date(data.endTime.seconds * 1000) : null,
                };
            });
            console.log("Fetched Logs: ", logs);

            // 데이터를 startTime을 기준으로 내림차순으로 정렬
            const sortedLogs = logs.sort((a, b) => {
                if (!a.startTime || !b.startTime) return 0;
                return b.startTime - a.startTime; // 내림차순 정렬
            });

            setWalkLogs(sortedLogs); // 모든 산책 기록을 상태에 저장

            // 현재 월 기준으로 로그 필터링
            const currentMonth = new Date().getMonth(); // 현재 월 (0부터 시작)
            const filteredLogs = logs.filter(
                (log) => log.startTime && log.startTime.getMonth() === currentMonth
            );
            console.log("Filtered Logs (Current Month): ", filteredLogs);

            // 총 거리 및 시간 계산
            let distanceSum = 0;
            let durationSum = 0;

            filteredLogs.forEach((log) => {
                // 거리 계산
                distanceSum += parseFloat(log.distance) || 0; // distance 값이 없으면 0으로 처리

                // startTime과 endTime을 기반으로 duration 계산
                if (log.startTime && log.endTime) {
                    const start = new Date(log.startTime); // startTime을 Date 객체로 변환
                    const end = new Date(log.endTime); // endTime을 Date 객체로 변환
                    durationSum += Math.floor((end - start) / (1000 * 60)); // 분 단위로 계산
                } else if (log.startTime) {
                    const start = new Date(log.startTime);
                    const end = new Date(); // endTime이 없으면 현재 시간을 기준으로 사용
                    durationSum += Math.floor((end - start) / (1000 * 60)); // 분 단위 계산
                }
            });

            // 총 산책 횟수
            setTotalCount(filteredLogs.length);

            // 총 거리 (소수점 첫째 자리까지)
            setTotalDistance(distanceSum.toFixed(1));

            // 총 시간 포맷팅 (시간:분)
            const totalHours = Math.floor(durationSum / 60);
            const totalMinutes = durationSum % 60;
            setTotalDuration(
                `${totalHours.toString().padStart(2, "0")}:${totalMinutes.toString().padStart(2, "0")}`
            );
        } catch (error) {
            console.error("Error fetching walk logs: ", error);
            // 에러 발생 시 상태 초기화
            setWalkLogs([]);
            setTotalCount(0);
            setTotalDistance(0);
            setTotalDuration("00:00");
        }
    };

    useEffect(() => {
        fetchWalkLogs();
    }, []);

    const currentMonthName = new Date().toLocaleString('ko-KR', { month: 'long' });

    const toggleExpandLog = (index) => {
        setExpandedLogIndex(index === expandedLogIndex ? null : index);
    };

    const formatDuration = (duration) => {
        const hours = Math.floor(duration / 60); // 1시간을 계산
        const minutes = Math.round(duration % 60); // 나머지 분 계산 (소수점 반올림)

        if (hours > 0) {
            return `${hours}시간 ${minutes}분`; // 1시간 이상일 경우
        }
        return `${minutes}분`; // 1시간 미만일 경우
    };

    const formatWalkTime = (startTime, endTime) => {
        if (!startTime || !endTime) return "시간 정보 없음";

        const start = new Date(startTime);
        const end = new Date(endTime);
        const startFormatted = `${start.getHours()}:${start.getMinutes().toString().padStart(2, '0')}`;
        const endFormatted = `${end.getHours()}:${end.getMinutes().toString().padStart(2, '0')}`;
        return `${startFormatted} ~ ${endFormatted}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{`${currentMonthName} 한 달 간의 산책 기록은?`}</Text>
                <View style={styles.stats}>
                    <Text style={styles.statText}>{totalCount}{"\n"}총 횟수(회)</Text>
                    <Text style={styles.statText}>{totalDistance}{"\n"}총 거리 (km)</Text>
                    <Text style={styles.statText}>{totalDuration}{"\n"}총 시간</Text>
                </View>
            </View>

            {/* 여기에 11월 12월 월 단위를 골라서 볼 수 있도록 하는 필터 하나를 만들고 싶어 */}

            <ScrollView style={styles.logList}>
                {walkLogs.length > 0 ? (
                    walkLogs.map((log, index) => (
                        <View key={index}>
                            <TouchableOpacity
                                style={styles.logItem}
                                onPress={() => toggleExpandLog(index)}
                            >
                                <Text style={styles.logText}>
                                    {log.startTime?.toLocaleDateString('ko-KR', {
                                        month: '2-digit',
                                        day: '2-digit',
                                        weekday: 'short',
                                    })}
                                    {' '}
                                    {formatWalkTime(log.startTime, log.endTime)}
                                </Text>
                                <Text style={styles.logDetails}>
                                    거리 <Text style={styles.logDetails1}>{log.distance?.toFixed(1) || 0}km{"  "}</Text>
                                    시간 <Text style={styles.logDetails1}>{formatDuration(log.endTime && log.startTime ? (log.endTime - log.startTime) / 1000 / 60 : 0)}</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noDataText}>산책 기록이 없습니다.</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        borderBottomWidth: 2,
        borderBottomColor: '#ddd',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#E47513',
        marginBottom: 16,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#E47513',
        fontWeight: 'bold',
    },
    logItem: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        shadowOpacity: 0.05,
        shadowOffset: {
            height: 1,
        }
    },
    logText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#495057',
        marginBottom: 2,
    },
    logDetails: {
        fontSize: 14,
        marginTop: 4,
        fontWeight: 'bold',
        color: '#E47513',
    },
    logDetails1: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFA86B',
    },
    logList: {
        padding: 16,
    },
});

export default WalkLog;