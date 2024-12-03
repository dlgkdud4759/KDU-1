import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, Animated } from 'react-native';
import { firestore, auth } from '../Firebase';
import MapView, { Polyline } from 'react-native-maps';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { SvgXml } from 'react-native-svg';
import { Toggle } from './SvgIcon';

const WalkLog = () => {
    const [walkLogs, setWalkLogs] = useState([]);
    const [userName, setUserName] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const [totalDistance, setTotalDistance] = useState(0);
    const [totalDuration, setTotalDuration] = useState('00:00');
    const [expandedLogIndex, setExpandedLogIndex] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // 현재 년도
    const [availableYears, setAvailableYears] = useState([]); // 데이터가 있는 년도
    const [isYearPickerVisible, setIsYearPickerVisible] = useState(false);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [heightAnim] = useState(new Animated.Value(0));
    const [mapRegion, setMapRegion] = useState(null);
    const [path, setPath] = useState([]);

    const fetchWalkLogs = async () => {
        try {
            const currentUser = auth.currentUser;

            if (!currentUser) {
                console.log("No user is logged in.");
                resetState();
                return;
            }

            const userId = currentUser.uid;

            const logsRef = collection(firestore, "walks");
            const userLogsQuery = query(logsRef, where("userId", "==", userId));
            const snapshot = await getDocs(userLogsQuery);

            if (snapshot.empty) {
                console.log("No walk logs found.");
                resetState();
                return;
            }

            const logs = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    distance: (data.distance || 0) / 1000,
                    startTime: data.startTime ? new Date(data.startTime.seconds * 1000) : null,
                    endTime: data.endTime ? new Date(data.endTime.seconds * 1000) : null,
                    path: data.path || [],
                };
            });

            const sortedLogs = logs.sort((a, b) => {
                if (!a.startTime || !b.startTime) return 0;
                return b.startTime - a.startTime;
            });

            setWalkLogs(sortedLogs);

            // 데이터에서 사용 가능한 년도 추출
            const years = [...new Set(logs.map((log) => log.startTime?.getFullYear()))];
            setAvailableYears(years);

            filterLogsByDate(logs, selectedYear, selectedMonth);
        } catch (error) {
            console.error("Error fetching walk logs: ", error);
            resetState();
        }
    };

    const toggleExpandLog = (index) => {
        if (expandedLogIndex === index) {
            setExpandedLogIndex(null);
            setPath([]);
            setMapRegion(null);
        } else {
            const selectedLog = walkLogs[index];
            setExpandedLogIndex(index);
            setPath(selectedLog.path);

            if (selectedLog.path && selectedLog.path.length > 0) {
                // 중심 좌표 계산
                const latitudes = selectedLog.path.map((point) => point.latitude);
                const longitudes = selectedLog.path.map((point) => point.longitude);

                const centerLatitude =
                    latitudes.reduce((sum, lat) => sum + lat, 0) / latitudes.length;
                const centerLongitude =
                    longitudes.reduce((sum, lng) => sum + lng, 0) / longitudes.length;

                setMapRegion({
                    latitude: centerLatitude,
                    longitude: centerLongitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            }
        }
    };

    // 필터링 함수
    const filterLogsByDate = (logs, year, month) => {
        const filteredLogs = logs.filter(
            (log) =>
                log.startTime &&
                log.startTime.getFullYear() === year &&
                log.startTime.getMonth() + 1 === month
        );

        let distanceSum = 0;
        let durationSum = 0;

        filteredLogs.forEach((log) => {
            distanceSum += parseFloat(log.distance) || 0;

            if (log.startTime && log.endTime) {
                const start = new Date(log.startTime);
                const end = new Date(log.endTime);
                durationSum += Math.floor((end - start) / (1000 * 60));
            }
        });

        setTotalCount(filteredLogs.length);
        setTotalDistance(distanceSum.toFixed(1));

        const totalHours = Math.floor(durationSum / 60);
        const totalMinutes = durationSum % 60;
        setTotalDuration(
            `${totalHours.toString().padStart(2, "0")}:${totalMinutes.toString().padStart(2, "0")}`
        );
    };

    // 상태 초기화 함수
    const resetState = () => {
        setWalkLogs([]);
        setTotalCount(0);
        setTotalDistance(0);
        setTotalDuration("00:00");
    };

    // 년도 변경 핸들러
    const handleYearChange = (year) => {
        setSelectedYear(year);
        setIsYearPickerVisible(false);
        filterLogsByDate(walkLogs, year, selectedMonth);
    };

    // 월 변경 핸들러
    const handleMonthChange = (month) => {
        setSelectedMonth(month);
        filterLogsByDate(walkLogs, selectedYear, month);
    };

    const toggleFilterVisibility = () => {
        setIsFilterVisible((prevState) => !prevState);

        // 애니메이션 시작
        Animated.timing(heightAnim, {
            toValue: isFilterVisible ? 0 : 180,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const fetchUserName = async () => {
        const userId = auth.currentUser?.uid;
        console.log("현재 유저 ID:", userId); // 유저 ID 확인
        if (!userId) {
            console.log("로그인되지 않은 사용자입니다.");
            return;
        }

        try {
            // pets 컬렉션에서 특정 userId에 해당하는 데이터를 가져오기 위해 쿼리 생성
            const petsCollection = collection(firestore, 'pets');
            const q = query(petsCollection, where("userId", "==", userId));

            // 쿼리를 실행하여 해당 유저의 데이터 가져오기
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                return;
            }

            // 유저 정보가 존재하면 이름을 설정
            querySnapshot.forEach(doc => {
                setUserName(doc.data().name);
            });

        } catch (error) {
            Alert.alert('유저 정보를 불러오지 못했습니다.', error.message);
            console.error('유저 이름을 가져오는 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        fetchUserName();
    }, []);

    useEffect(() => {
        fetchWalkLogs();
    }, []);

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
                <Text style={styles.title}>{`${userName}의 ${selectedMonth}월 한 달간의 산책 기록은?`}</Text>
                <View style={styles.stats}>
                    <Text style={styles.statText}>{totalCount}{"\n"}총 횟수(회)</Text>
                    <Text style={styles.statText}>{totalDistance}{"\n"}총 거리 (km)</Text>
                    <Text style={styles.statText}>{totalDuration}{"\n"}총 시간</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.filterToggleButton}
                onPress={toggleFilterVisibility}
            >
                <Text style={styles.filterToggleButtonText}>
                    {isFilterVisible ? (
                        <SvgXml xml={Toggle} style={styles.Toggle1} />
                    ) : (
                        <SvgXml xml={Toggle} style={styles.Toggle2} />
                    )}
                </Text>
            </TouchableOpacity>

            <Animated.View
                style={[styles.filterSection, { height: heightAnim }]}
            >
                {isFilterVisible && (
                    <View style={styles.filterSection}>
                        <TouchableOpacity
                            style={styles.yearButton}
                            onPress={() => setIsYearPickerVisible(true)}
                        >
                            <Text style={styles.yearButtonText}>{selectedYear}년</Text>
                        </TouchableOpacity>
                        <Modal
                            visible={isYearPickerVisible}
                            transparent={true}
                            animationType="slide"
                        >
                            <View style={styles.modalContainer}>
                                <FlatList
                                    data={availableYears}
                                    keyExtractor={(item) => item.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.yearOption}
                                            onPress={() => handleYearChange(item)}
                                        >
                                            <Text style={styles.yearOptionText}>{item}년</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => setIsYearPickerVisible(false)}
                                >
                                    <Text style={styles.modalCloseText}>닫기</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>

                        <View style={styles.filterContainer}>
                            {[...Array(12)].map((_, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={[
                                        styles.filterButton,
                                        selectedMonth === i + 1 && styles.activeFilterButton,
                                    ]}
                                    onPress={() => handleMonthChange(i + 1)}
                                >
                                    <Text
                                        style={[
                                            styles.filterText,
                                            selectedMonth === i + 1 && styles.activeFilterText,
                                        ]}
                                    >
                                        {i + 1}월
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
            </Animated.View>

            <ScrollView style={styles.logList}>
                {walkLogs.length > 0 ? (
                    walkLogs
                        .filter((log) => log.startTime && log.startTime.getFullYear() === selectedYear && log.startTime.getMonth() + 1 === selectedMonth)
                        .map((log, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.logItem}
                                onPress={() => toggleExpandLog(index)}
                                activeOpacity={0.5}
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
                                {expandedLogIndex === index && (
                                    <Animated.View style={styles.mapContainer}>
                                        <MapView
                                            style={styles.map}
                                            initialRegion={mapRegion}
                                        >
                                            <Polyline
                                                coordinates={path}
                                                strokeWidth={3}
                                                strokeColor="#FFA86B"
                                            />
                                        </MapView>
                                    </Animated.View>
                                )}
                                <View style={styles.logDetailsContainer}>
                                    <Text style={styles.logDetails}>
                                        거리 <Text style={styles.logDetails1}>{log.distance?.toFixed(1) || 0}km</Text>
                                    </Text>
                                    <Text style={styles.logDetailsRight}>
                                        시간 <Text style={styles.logDetails1}>{formatDuration(log.endTime && log.startTime ? (log.endTime - log.startTime) / 1000 / 60 : 0)}</Text>
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))
                ) : (
                    <Text style={styles.noDataText}>산책 기록이 없습니다.</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        height: 250,
        marginVertical: 10,
    },
    map: {
        flex: 1,
        borderRadius: 10,
    },
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
        fontSize: 20,
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
    Toggle1: {
        transform: [{ rotate: '270deg' }],
    },
    Toggle2: {
        transform: [{ rotate: '90deg' }],
    },
    filterToggleButton: {
        marginTop: 5,
        borderRadius: 5,
        marginBottom: 5,
        alignItems: 'center'
    },
    filterToggleButtonText: {
        fontSize: 16,
        color: '#000'
    },
    yearOption: {
        padding: 15,
        top: 10,
        backgroundColor: '#fff',
        marginVertical: 5,
        borderRadius: 5,
        width: 200,
        height: 70,
        alignItems: 'center',
    },
    yearOptionText: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
    },
    yearButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#FFA86B',
        borderWidth: 1,
        borderColor: '#E47513',
        borderRadius: 10,
        width: '80%',
        marginLeft: '10%',
        shadowOpacity: 0.3,
        shadowOffset: {
            height: 1,
        }
    },
    yearButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalCloseButton: {
        marginTop: 20,
        paddingLeft: '10%',
        paddingRight: '10%',
        padding: 12,
        backgroundColor: '#FFA86B',
        borderRadius: 10,
        top: -30,
    },
    modalCloseText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        flexWrap: 'wrap',
    },
    filterButton: {
        padding: 10,
        margin: 5,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ccc',
    },
    activeFilterButton: {
        backgroundColor: '#FFA86B',
        borderColor: '#E47513',
    },
    filterText: {
        color: '#495507',
        fontWeight: '500',
    },
    activeFilterText: {
        color: '#FFFFFF'
    },
    logList: {
        padding: 16,
        backgroundColor: '#FAFAFB',
        zIndex: 1,
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
    logDetailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
    },
    logDetails: {
        fontSize: 14,
        marginTop: 4,
        fontWeight: 'bold',
        color: '#E47513',
    },
    logDetailsRight: {
        fontSize: 14,
        marginTop: 4,
        fontWeight: 'bold',
        color: '#E47513',
        textAlign: 'right',
    },
    logDetails1: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFA86B',
    },
});

export default WalkLog;