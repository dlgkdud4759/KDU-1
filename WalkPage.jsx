import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Back, Foot1, Foot2, Foot3, Foot4 } from './SvgIcon';
import { SvgXml } from 'react-native-svg';
import Walk from './walk';
import WalkLog from './WalkLog';

const WalkPage = ({ navigation }) => {
    // 현재 선택된 탭 상태
    const [selectedTab, setSelectedTab] = useState('산책하기');
    const translateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // 탭 전환 애니메이션
        const width = Dimensions.get('window').width / 2;
        Animated.spring(translateX, {
            toValue: selectedTab === '산책하기' ? 0 : width,
            useNativeDriver: true,
        }).start();
    }, [selectedTab]);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <SvgXml xml={Back} width="24" height="24" style={styles.icon} />
                </TouchableOpacity>
                <View style={styles.header}>
                    <Animated.View style={[styles.animatedTab, { transform: [{ translateX }], borderBottomColor: selectedTab === '산책하기' ? '#ABC4FF' : '#E47513' },]} />
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === '산책하기' && styles.selectedTab]}
                        onPress={() => setSelectedTab('산책하기')}
                    >
                        {selectedTab === '산책하기' && (
                            <SvgXml xml={Foot1} style={styles.icon1} />
                        )}
                        <Text
                            style={[
                                styles.tabText,
                                selectedTab === '산책하기' && styles.selectedTabText,
                            ]}
                        >
                            산책하기
                        </Text>
                        {selectedTab === '산책하기' && (
                            <SvgXml xml={Foot2} style={styles.icon1} />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === '산책일지' && styles.selectedTab]}
                        onPress={() => setSelectedTab('산책일지')}
                    >
                        {selectedTab === '산책일지' && (
                            <SvgXml xml={Foot3} style={styles.icon1} />
                        )}
                        <Text
                            style={[
                                styles.tabText,
                                selectedTab === '산책일지' && styles.selectedTabText1,
                            ]}
                        >
                            산책일지
                        </Text>
                        {selectedTab === '산책일지' && (
                            <SvgXml xml={Foot4} style={styles.icon1} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            {selectedTab === '산책하기' ? <Walk /> : <WalkLog />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        paddingTop: 55,
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        width: '8%',
        marginLeft: 15,
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 40,
        borderTopWidth: 1,
        borderColor: '#D9D9D9',
    },
    tab: {
        marginTop: 5,
        marginBottom: 5,
        padding: 10,
    },
    tabText: {
        fontSize: 20,
        color: '#D9D9D9',
        fontWeight: 'bold',
    },
    animatedTab: {
        position: 'absolute',
        width: Dimensions.get('window').width / 2,
        height: '102%',
        borderBottomColor: '#ABC4FF',
        borderBottomWidth: 3,
    },
    icon1: {
    },
    selectedTab: {
        flexDirection: 'row',
    },
    selectedTabText: {
        marginLeft: 2,
        marginRight: 2,
        color: '#ABC4FF',
    },
    selectedTabText1: {
        marginLeft: 2,
        marginRight: 2,
        color: '#E47513',
    },
});

export default WalkPage;