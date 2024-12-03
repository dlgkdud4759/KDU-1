import React, { useEffect, useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../Firebase'; // Firebase 설정 import
import { SvgXml } from 'react-native-svg';

const svgString6 =`
<svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.74996 19.34C10.1139 19.7544 10.0737 20.3852 9.65996 20.75C9.24556 21.114 8.61471 21.0737 8.24996 20.66L0.249955 11.66C-0.0816908 11.2825 -0.0816908 10.7175 0.249955 10.34L8.24996 1.34C8.48059 1.05366 8.84975 0.916976 9.21124 0.984074C9.57274 1.05117 9.86826 1.31123 9.98078 1.66126C10.0933 2.01129 10.0047 2.39484 9.74996 2.66L2.33996 11L9.74996 19.34Z" fill="#111111"/>
</svg>`;

const Information3 = ({ navigation, route }) => {
    const { params } = route || {}; // route가 undefined일 경우 빈 객체를 사용
    const { userId } = params || {}; // params가 undefined일 경우 빈 객체를 사용
    const [petType, setPetType] = useState('');
    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');
    const [isNeutered, setIsNeutered] = useState('');

    useEffect(() => {
        if (!userId) {
            Alert.alert('사용자 ID를 찾을 수 없습니다.');
            navigation.goBack(); // 사용자 ID가 없으면 이전 화면으로 이동
            return;
        }
        fetchPetInfo(); // 컴포넌트가 마운트되면 반려동물 정보 가져오기
    }, [userId]);

    const fetchPetInfo = async () => {
        const petsRef = collection(firestore, 'pets');
        const q = query(petsRef, where('userId', '==', userId));
    
        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const petDoc = querySnapshot.docs[0]; // 첫 번째 문서 가져오기
                const petData = petDoc.data();
                setPetType(petData.petType);
                setName(petData.name);
                setWeight(petData.weight);  // 가져온 몸무게 값에 kg을 붙이지 않고 저장
                setBirthDate(petData.birthDate);
                setGender(petData.gender);
                setIsNeutered(petData.isNeutered);
            } else {
                Alert.alert('반려동물 정보를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('반려동물 정보 가져오기 오류:', error);
            Alert.alert('정보를 가져오는 데 오류가 발생했습니다.');
        }
    };

    const handleSave = async () => {
        if (!petType || !name || !weight || !birthDate || !gender || !isNeutered) {
            Alert.alert('모든 정보를 입력해 주세요.');
            return;
        }

        const petInfo = { 
            userId, 
            petType, 
            name, 
            weight, // 몸무게를 숫자로 변환하여 저장
            birthDate, 
            gender, 
            isNeutered 
        };

        try {
            const petsRef = collection(firestore, 'pets');
            const q = query(petsRef, where('userId', '==', userId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const petDoc = querySnapshot.docs[0];
                const petDocRef = doc(firestore, 'pets', petDoc.id);
                await updateDoc(petDocRef, petInfo);
                Alert.alert("정보가 수정되었습니다.");
                
                navigation.navigate('Main', { userId }); // Main으로 이동하면서 userId 전달
            } else {
                Alert.alert('반려동물 정보를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('정보 수정 중 오류 발생:', error);
            Alert.alert("정보 수정 실패", "다시 시도해 주세요.");
        }
    };

    return (
        <View style={styles.root}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <SvgXml xml={svgString6} width="24" height="24" style={styles.icon1} />
            </TouchableOpacity>
            <Text style={styles.title}>반려동물 정보 수정</Text>
            <View style={styles.inputRow}>
                <View style={styles.petTypeContainer}>
                    <Text style={styles.label}>반려종</Text>
                </View>
                <View style={styles.petTypeSelection}>
                    <TouchableOpacity
                        style={[styles.petTypeButton, petType === '강아지' && styles.selectedButton]}
                        onPress={() => setPetType('강아지')}
                    >
                        <Text style={styles.petTypeButtonText}>강아지</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.petTypeButton, petType === '고양이' && styles.selectedButton]}
                        onPress={() => setPetType('고양이')}
                    >
                        <Text style={styles.petTypeButtonText}>고양이</Text>
                    </TouchableOpacity>
                </View>
            </View>
        
            <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                    <View style={styles.labelBox}>
                        <Text style={styles.label}>이름</Text>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.rectangle}
                        placeholder="반려동물 이름을 입력해주세요."
                        onChangeText={setName}
                        value={name}
                    />
                </View>
            </View>

            <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                    <View style={styles.labelBox}>
                        <Text style={styles.label}>생년월일</Text>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.rectangle}
                        placeholder="반려동물 생년월일(예: 010825)"
                        keyboardType="numeric"
                        onChangeText={setBirthDate}
                        value={birthDate}
                    />
                </View>
            </View>

            <View style={styles.inputRow}>
    <View style={styles.inputContainer}>
        <View style={styles.labelBox}>
            <Text style={styles.label}>몸무게</Text>
        </View>
    </View>
    <View style={styles.inputContainer}>
        <TextInput
            style={styles.rectangle}
            placeholder="몸무게를 입력해주세요."
            keyboardType="numeric"
            onChangeText={(text) => {
                // 숫자와 소수점만 허용
                const formattedWeight = text.replace(/[^0-9.]/g, '');

                // 소수점이 여러 번 입력되지 않도록 제한
                const validWeight = formattedWeight.split('.').length > 2
                    ? formattedWeight.slice(0, -1)
                    : formattedWeight;

                setWeight(validWeight);
            }}
            value={weight ? `${weight}kg` : ''} // kg을 값 뒤에 자동으로 추가
        />
    </View>
</View>


            <View style={styles.inputRow}>
                <View style={styles.petTypeContainer}>
                    <Text style={styles.label}>성별</Text>
                </View>
                <View style={styles.petTypeSelection}>
                    <TouchableOpacity
                        style={[styles.petTypeButton, gender === '남아' && styles.selectedButton]}
                        onPress={() => setGender('남아')}
                    >
                        <Text style={styles.petTypeButtonText}>남아</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.petTypeButton, gender === '여아' && styles.selectedButton]}
                        onPress={() => setGender('여아')}
                    >
                        <Text style={styles.petTypeButtonText}>여아</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputRow}>
                <View style={styles.petTypeContainer}>
                    <Text style={styles.label}>중성화</Text>
                </View>
                <View style={styles.petTypeSelection}>
                    <TouchableOpacity
                        style={[styles.petTypeButton, isNeutered === '했어요' && styles.selectedButton]}
                        onPress={() => setIsNeutered('했어요')}
                    >
                        <Text style={styles.petTypeButtonText}>했어요</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.petTypeButton, isNeutered === '안했어요' && styles.selectedButton]}
                        onPress={() => setIsNeutered('안했어요')}
                    >
                        <Text style={styles.petTypeButtonText}>안했어요</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={handleSave}>
                <Text style={styles.confirmButtonLabel}>저장</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        top: 30,
        left: 10,
        backgroundColor: 'rgba(255,255, 255, 255)',
        padding: 10,
        borderRadius: 5,
      },
    inputRow: {
        flexDirection: 'row', // 수평 정렬
        justifyContent: 'space-between', // 좌우 공간 분배
        marginBottom: 20, // 각 inputRow 간격
    },
    inputContainer: {
        flex: 1,
        marginHorizontal: 5,
    },
    title: {
        color: 'rgba(0, 0, 0, 1)',
        fontFamily: 'Roboto',
        fontSize: 24,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 130,
        top: 30,
      },
    petTypeContainer: {
        width: 90, // 반려종 텍스트의 넓이
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(153, 153, 153, 1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 30, // 버튼과의 간격
        backgroundColor: 'rgba(255, 230, 158, 1)',
    },
    label: {
        color: 'rgba(0, 0, 0, 1)',
        fontFamily: 'Roboto',
        fontSize: 15,
    },
    labelBox: {
        width: 90, // 라벨 박스의 너비
        height: 40,
        borderWidth: 1,
        borderColor: 'rgba(153, 153, 153, 1)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        right: 5,
        backgroundColor: 'rgba(255, 230, 158, 1)',
    },
    petTypeSelection: {
        flexDirection: 'row', // 버튼들을 수평으로 나열
    },
    petTypeButton: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 1,
        borderColor: 'rgba(153, 153, 153, 1)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: 90,
        height: 40,
        marginRight: 10, // 버튼 간의 간격
    },
    selectedButton: {
        backgroundColor: 'rgba(255, 230, 158, 1)',
    },
    petTypeButtonText: {
        color: 'rgba(0, 0, 0, 1)',
        fontFamily: 'Roboto',
        fontSize: 15,
    },
    rectangle: {
        width: 190,
        height: 40,
        borderWidth: 1,
        borderColor: 'rgba(153, 153, 153, 1)',
        borderRadius: 10,
        paddingLeft: 10,
        right: 45,
    },
    confirmButton: {
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: 'rgba(255, 230, 158, 1)',
    },
    confirmButtonLabel: {
        color: 'black',
        fontSize: 16,
    },
});

export default Information3;
