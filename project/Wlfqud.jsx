import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Expo에서 제공되는 Picker
import { SvgXml } from 'react-native-svg';

const svgString1 = `
<svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M30.5719 16.5987L28.125 14.1106V8.01316C28.125 7.06875 27.3656 6.29605 26.4375 6.29605H24.75C23.8219 6.29605 23.0625 7.06875 23.0625 8.01316V8.96272L19.6875 5.53194C19.2268 5.08893 18.8049 4.57895 18 4.57895C17.1951 4.57895 16.7732 5.08893 16.3125 5.53194L5.42813 16.5987C4.90163 17.1567 4.5 17.5637 4.5 18.3158C4.5 19.2825 5.229 20.0329 6.1875 20.0329H7.875V30.3355C7.875 31.2799 8.63437 32.0526 9.5625 32.0526H12.9375C13.8695 32.0526 14.625 31.2839 14.625 30.3355V23.4671C14.625 22.5227 15.3844 21.75 16.3125 21.75H19.6875C20.6156 21.75 21.375 22.5227 21.375 23.4671V30.3355C21.375 31.2839 21.2868 32.0526 22.2188 32.0526H26.4375C27.3656 32.0526 28.125 31.2799 28.125 30.3355V20.0329H29.8125C30.771 20.0329 31.5 19.2825 31.5 18.3158C31.5 17.5637 31.0984 17.1567 30.5719 16.5987Z" stroke="black" stroke-width="2" stroke-linejoin="round"/>
</svg>`;

const svgString6 =`
<svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.74996 19.34C10.1139 19.7544 10.0737 20.3852 9.65996 20.75C9.24556 21.114 8.61471 21.0737 8.24996 20.66L0.249955 11.66C-0.0816908 11.2825 -0.0816908 10.7175 0.249955 10.34L8.24996 1.34C8.48059 1.05366 8.84975 0.916976 9.21124 0.984074C9.57274 1.05117 9.86826 1.31123 9.98078 1.66126C10.0933 2.01129 10.0047 2.39484 9.74996 2.66L2.33996 11L9.74996 19.34Z" fill="#111111"/>
</svg>`;

// 증상 유형 및 세부 옵션 정의
const symptoms = {
  대변: ['황색', '노란색', '회색', '검은색', '붉은색', '초록색'],
  소변: ['투명하거나 노란색', '혼탁한 색', '짙은 갈색', '거품이 있는 소변', '붉은색'],
  구토: ['투명한 색', '노란색', '음식 동반 구토', '흰색(거품 동반)', '초록색', '갈색', '붉은색'],
  귀피부: ['분홍색', '검은색', '붉은색', '하얀색'],
  얼굴: ['얼굴 전체가 불어남', '피부 염증이 생김'],
  눈: ['눈이 튀어나옴', '눈동자 중앙이 하얗게 변함', '눈동자 색이 변함', '빨갛게 충혈된 눈'],
  치아: ['노란색 치석', '갈색 치석', '검은색 치석'],
  피부: ['피부에 붉은 반점', '뾰루지', '피부에 딱지', '검은 반점', '종기'],
  호흡기: ['기침', '호흡 곤란', '코로 숨을 못 쉼'],
  식욕: ['식사 거부', '과도한 식욕'],
  체중: ['갑작스런 체중 증가', '갑작스런 체중 감소'],
  설사: ['물같은 대변', '묽은 대변'],
  구취: ['불쾌한 입 냄새'],
  두통: ['불안정한 행동', '목을 떨거나 경련'],
  과도한갈증: ['자주 물을 마시려는 행동'],

};

// 질병 데이터
const diseases = [
  {
    name: '장염',
    description: '장염은 대개 장에 염증이 생겨 복통, 설사, 구토 등의 증상이 나타나는 질병입니다.',
    symptoms: {
      대변: ['황색', '노란색', '초록색'],
      구토: ['노란색', '초록색'],
      피부: ['피부에 붉은 반점'],
      소변: ['혼탁한 색'],
      설사: ['물같은 대변'],
    },
    treatment: '장염이 의심되면 수분 보충과 식이 조절이 필요합니다. 가벼운 경우에는 자가 치료가 가능하나, 심각한 경우에는 수의사 방문이 필요합니다. 항생제나 소화제 처방을 받을 수 있습니다.',
  },
  {
    name: '췌장염',
    description: '췌장염은 췌장의 염증을 일으켜 소화에 영향을 미치는 질병입니다.',
    symptoms: {
      대변: ['황색', '회색'],
      구토: ['노란색', '투명한 색'],
      소변: ['짙은 갈색'],
      피부: ['피부에 딱지', '붉은 반점'],
      식욕: ['식사 거부'],
    },
    treatment: '췌장염은 대개 병원에서 진단 후 치료가 필요합니다. 수액 요법과 저지방 식단을 제공하며, 필요한 경우 약물 치료를 받을 수 있습니다. 장기간의 관리가 필요할 수 있습니다.',
  },
  {
    name: "소화불량",
    description: "소화불량은 소화 과정에 문제가 발생하는 질병으로, 구토나 설사 등의 증상이 발생합니다.",
    symptoms: {
      대변: ['황색', '노란색'],
      구토: ['노란색', '흰색(거품 동반)'],
      소변: ['붉은색'],
      피부: ['뾰루지', '피부에 붉은 반점'],
      구취: ['불쾌한 입 냄새'],
    },
    treatment: '소화불량은 식사 시간 간격을 조정하고, 저지방, 고단백질 식단을 제공하는 것이 좋습니다. 경우에 따라 소화제나 구토 억제제를 처방받을 수 있습니다.',
  },
  {
    name: "기생충 감염",
    description: "기생충 감염은 강아지의 장이나 내부 장기에 기생하는 기생충으로, 설사, 구토 등의 증상을 일으킬 수 있습니다.",
    symptoms: {
      대변: ['노란색', '초록색'],
      소변: ['혼탁한 색'],
      구토: ['노란색', '초록색'],
      피부: ['피부에 붉은 반점', '종기'],
      체중: ['갑작스런 체중 감소'],
    },
    treatment: '기생충 감염은 구충제를 통해 치료할 수 있습니다. 수의사 처방에 따라 적절한 약물 치료가 필요합니다. 환경을 깨끗이 관리하고 예방접종을 고려하는 것이 중요합니다.',
  },
  {
    name: "간 질환",
    description: "간 질환은 간 기능에 이상이 생겨 여러 증상을 일으키는 질병입니다. 간염, 간경변 등이 있습니다.",
    symptoms: {
      대변: ['초록색', '회색'],
      구토: ['초록색', '갈색'],
      소변: ['짙은 갈색'],
      눈: ['눈동자 색이 변함'],
      피부: ['검은 반점'],
      과도한갈증: ['자주 물을 마시려는 행동'],
    },
    treatment: '간 질환은 수의사의 진단을 받아 치료합니다. 약물 치료나 식이 요법이 필요하며, 심각한 경우에는 수액 요법이나 간 기능을 개선하는 치료가 요구됩니다.',
  },
  {
    name: "신장 질환",
    description: "신장 질환은 신장이 기능을 제대로 하지 못하는 질병으로, 배뇨 문제나 체액 불균형을 일으킬 수 있습니다.",
    symptoms: {
      소변: ['거품이 있는 소변', '붉은색', '혼탁한 색'],
      구토: ['노란색', '흰색(거품 동반)'],
      피부: ['피부에 붉은 반점', '종기'],
    },
    treatment: '신장 질환은 적절한 수분 공급과 식이 요법이 중요합니다. 수의사의 지시에 따라 약물 치료나 신장 기능을 지원하는 치료를 받는 것이 필요합니다.',
  },
  {
    name: "알레르기 반응",
    description: "강아지가 특정 물질에 과민반응을 일으켜 알레르기 증상이 나타나는 질병입니다.",
    symptoms: {
      귀피부: ['붉은색', '하얀색'],
      얼굴: ['얼굴 전체가 불어남'],
      피부: ['피부에 붉은 반점', '종기'],
      눈: ['빨갛게 충혈된 눈'],
      체중: ['갑작스런 체중 증가'],
    },
    treatment: '알레르기 반응은 원인 물질을 피하는 것이 가장 중요합니다. 항히스타민제나 스테로이드제를 사용하여 증상을 완화시킬 수 있습니다.',
  },
  {
    name: "호흡기 질환",
    description: "호흡기 질환은 기침과 호흡 곤란을 일으키는 질병입니다. 감기나 폐렴 등이 이에 해당합니다.",
    symptoms: {
      호흡기: ['기침', '호흡 곤란'],
      구토: ['노란색', '투명한 색'],
      소변: ['붉은색'],
      얼굴: ['얼굴 전체가 불어남'],
    },
    treatment: '호흡기 질환은 병원에서 치료를 받아야 합니다. 항생제나 기침 억제제를 사용하며, 호흡을 편하게 해주는 치료가 필요할 수 있습니다.',
  },
  {
    name: "치주 질환",
    description: "치주 질환은 강아지의 잇몸에 염증이 생겨 치아를 잃을 수도 있는 질병입니다.",
    symptoms: {
      치아: ['노란색 치석', '갈색 치석', '검은색 치석'],
      피부: ['피부에 붉은 반점'],
      구취: ['불쾌한 입 냄새'],
    },
    treatment: '치주 질환은 정기적인 치아 관리와 치석 제거가 필요합니다. 심한 경우에는 치과 치료나 치아 발치를 고려해야 합니다.',
  },
  {
    name: "피부염 및 감염",
    description: "피부염은 피부에 염증이 생기는 질병으로, 발진, 가려움증, 붓기 등의 증상이 나타납니다.",
    symptoms: {
      피부: ['뾰루지', '피부에 딱지', '붉은 반점', '종기'],
      귀피부: ['검은색', '붉은색'],
      얼굴: ['피부 염증'],
      구토: ['음식 동반 구토'],
    },
    treatment: '피부염 및 감염은 항생제와 항염증제를 사용하여 치료합니다. 필요한 경우 피부 보호를 위한 샴푸나 연고를 사용하며, 위생을 철저히 관리해야 합니다.',
  },
  {
    name: "심장 질환",
    description: "심장 질환은 심장의 기능에 이상이 생겨 혈액 순환에 문제가 생기는 질병입니다.",
    symptoms: {
      호흡기: ['기침', '호흡 곤란'],
      구토: ['노란색', '흰색 구토'],
      얼굴: ['얼굴 전체가 불어남'],
    },
    treatment: '심장 질환은 약물 치료와 식이 요법으로 관리합니다. 고지방, 고염 식이를 피하고, 심장 기능을 지원하는 약물을 사용해야 할 수 있습니다.',
  },
  {
    name: "전염성 질병",
    description: "전염성 질병은 다른 강아지나 환경을 통해 전염될 수 있는 질병으로, 감염력이 매우 강합니다.",
    symptoms: {
      얼굴: ['얼굴 전체가 불어남'],
      구토: ['갈색', '붉은색'],
      피부: ['뾰루지', '피부에 붉은 반점', '종기'],
      소변: ['혼탁한 소변', '붉은색 소변'],
      눈: ['빨갛게 충혈된 눈'],
    },
    treatment: '전염성 질병은 신속하게 병원에 방문하여 진단을 받고, 필요에 따라 격리 치료 및 항생제를 사용해야 합니다.',
  },
  // **새로 추가된 평범한 질병들**
  {
    name: '기침감기',
    description: '기침감기는 주로 상기도에서 발생하는 감염으로 기침과 콧물이 동반됩니다.',
    symptoms: {
      호흡기: ['기침'],
      구토: ['투명한 색'],
      소변: ['노란색'],
      눈: ['눈이 충혈됨'],
    },
    treatment: '기침감기는 보통 자연적으로 회복되며, 증상 완화를 위해 기침 억제제를 사용할 수 있습니다. 충분한 휴식과 수분 보충이 중요합니다.',
  },
  {
    name: '귀 염증',
    description: '귀 염증은 강아지의 귀 내부에 염증이 생겨 가려움증과 불쾌감을 유발하는 질병입니다.',
    symptoms: {
      귀피부: ['붉은색', '검은색'],
      피부: ['피부에 붉은 반점'],
      얼굴: ['귀에 가려움증'],
    },
    treatment: '귀 염증은 귀 청소와 약물 치료가 필요합니다. 필요시 항염증제나 항생제를 처방받을 수 있습니다.',
  },
  {
    name: '비만',
    description: '비만은 과도한 체지방으로 인해 다양한 건강 문제를 유발하는 질병입니다.',
    symptoms: {
      피부: ['피부에 붉은 반점'],
      대변: ['변비'],
      호흡기: ['호흡 곤란'],
    },
    treatment: '비만은 적절한 식이 요법과 운동을 통해 관리해야 합니다. 수의사와 상담하여 체중 관리 계획을 세워야 합니다.',
  },
  {
    name: '피로 및 스트레스',
    description: '스트레스나 과도한 활동으로 인한 피로는 강아지가 무기력해지고 불안감을 느끼게 할 수 있습니다.',
    symptoms: {
      피부: ['피부에 붉은 반점'],
      얼굴: ['얼굴 전체가 불어남'],
      구토: ['음식 동반 구토'],
    },
    treatment: '스트레스 관리와 휴식이 중요합니다. 필요한 경우 진정제를 처방받을 수 있으며, 환경을 조용하게 유지하는 것이 도움이 됩니다.',
  },
];



const SymptomChecker = ({navigation}) => {
  const [currentStep, setCurrentStep] = useState(0); // 단계
  const [selectedSymptoms, setSelectedSymptoms] = useState([]); // 선택한 증상 유형
  const [selectedOptions, setSelectedOptions] = useState({}); // 각 증상 유형의 선택된 옵션
  const [possibleDiseases, setPossibleDiseases] = useState([]); // 가능한 질병 목록

  // 증상 유형 선택 처리
  const handleSymptomTypeSelect = (type) => {
    if (selectedSymptoms.includes(type)) {
      setSelectedSymptoms(selectedSymptoms.filter((symptom) => symptom !== type)); // 선택 취소
    } else if (selectedSymptoms.length < 7) {
      setSelectedSymptoms([...selectedSymptoms, type]); // 선택 추가
    }
  };

  // 증상 값 변경 처리
  const handleOptionChange = (value, type) => {
    setSelectedOptions({ ...selectedOptions, [type]: value });
  };

  // 가능성 있는 질병 확인
  const checkPossibleDiseases = () => {
    const matchingDiseases = diseases.map((disease) => {
      let matchCount = 0;
      // 각 질병의 증상과 사용자가 선택한 증상 비교
      Object.keys(disease.symptoms).forEach((type) => {
        if (selectedSymptoms.includes(type)) {
          const matchedOptions = disease.symptoms[type].filter((option) =>
            selectedOptions[type]?.includes(option)
          );
          matchCount += matchedOptions.length;
        }
      });
      return { ...disease, matchCount }; // 질병 정보와 매칭된 증상 갯수 반환
    });

    const sortedDiseases = matchingDiseases
      .filter((disease) => disease.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);
    setPossibleDiseases(sortedDiseases);
    setCurrentStep(2); // 세 번째 단계로 이동
  };

  const handleRestart = () => {
    setCurrentStep(0); // 첫 번째 단계로 이동
    setSelectedSymptoms([]); // 증상 초기화
    setSelectedOptions({}); // 옵션 초기화
    setPossibleDiseases([]); // 가능한 질병 초기화
  };

  const handleBack = () => {
    setCurrentStep(0); // 첫 번째 단계로 이동
  };

  return (
    <View style={styles.container}>
      {currentStep === 0 ? (
        // 첫 번째 단계: 증상 유형 선택
        <ScrollView style={styles.scrollView}>
                      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <SvgXml xml={svgString6} width="24" height="24" style={styles.icon1}/>
        </TouchableOpacity>
          <Text style={styles.titleText}>증상 검사</Text>
          <View style={styles.separator} />
          <Text style={styles.subTitleText}>증상 유형을 선택하세요 (최대 7개):</Text>
          <View style={styles.symptomGrid}>
            {Object.keys(symptoms).map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.symptomButton, selectedSymptoms.includes(type) && styles.selectedSymptom]}
                onPress={() => handleSymptomTypeSelect(type)}
              >
                <Text style={styles.symptomText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : currentStep === 1 ? (
        // 두 번째 단계: 세부 증상 옵션 선택
        <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <SvgXml xml={svgString6} width="24" height="24" style={styles.icon1}/>
        </TouchableOpacity>
          <Text style={styles.titleText}>증상 옵션 선택</Text>
          <View style={styles.separator} />
          {selectedSymptoms.map((type) => (
            <View key={type} style={styles.optionContainer}>
              <Text style={styles.optionTitle}>{type}의 증상을 선택하세요:</Text>
              <Picker
                selectedValue={selectedOptions[type] || ''}
                style={styles.picker}
                onValueChange={(value) => handleOptionChange(value, type)} // 증상 유형과 값 전달
              >
                <Picker.Item label="선택하세요" value="" />
                {symptoms[type].map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          ))}
        </ScrollView>
      ) : (
// 세 번째 단계: 결과 및 질병 목록 표시
<ScrollView style={styles.scrollView}>
<TouchableOpacity style={styles.home} onPress={() => navigation.goBack()}>
          <SvgXml xml={svgString1} width="32" height="32" style={styles.icon1}/>
        </TouchableOpacity>
  <Text style={styles.titleText}>유추한 질병</Text>
  <View style={styles.separator} />
  
  {/* 질병 목록을 박스 형태로 표시 */}
  <View style={styles.diseaseListContainer}>
    {possibleDiseases.map((disease) => (
      <View key={disease.name} style={styles.diseaseCard}>
        {/* 질병 이름과 일치한 증상 수 */}
        <Text style={styles.diseaseTitle}>
          {disease.name} (일치하는 증상 수: {disease.matchCount})
        </Text>
        
        {/* 질병 설명 */}
        <Text style={styles.diseaseDescription}>{disease.description}</Text>

        {/* 질병에 대한 치료법 */}
        <Text style={styles.diseaseTreatment}>{disease.treatment}</Text>
      </View>
    ))}
  </View>
</ScrollView>
      )}

      {/* 버튼은 항상 하단에 고정됩니다. */}
      <View style={styles.footer}>
        {currentStep === 0 && (
          <TouchableOpacity
            style={[styles.nextButton, selectedSymptoms.length > 0 && styles.nextButtonActive]}
            disabled={selectedSymptoms.length === 0}
            onPress={() => setCurrentStep(1)}
          >
            <Text style={styles.nextButtonText}>다음</Text>
          </TouchableOpacity>
        )}
        {currentStep === 1 && (
          <TouchableOpacity
            style={[styles.nextButton, Object.keys(selectedOptions).length === selectedSymptoms.length && styles.nextButtonActive]}
            disabled={Object.keys(selectedOptions).length !== selectedSymptoms.length}
            onPress={checkPossibleDiseases} // 질병 확인
          >
            <Text style={styles.nextButtonText}>결과 보기</Text>
          </TouchableOpacity>
        )}
{currentStep === 2 && (
          // 세 번째 단계에서 "다시 하기" 버튼
          <TouchableOpacity
            style={[styles.nextButton, styles.retryButton]}
            onPress={handleRestart} // 상태 초기화 후 첫 번째 단계로 돌아가기
          >
            <Text style={styles.nextButtonText}>다시 하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};



// 스타일시트
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
     justifyContent: 'space-between'
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: -5,
    backgroundColor: 'rgba(255,255, 255, 255)',
    padding: 10,
    borderRadius: 5,
    zIndex:10,
  },
 home: {
    position: 'absolute',
    top: 10,
    left: 270,
    backgroundColor: 'rgba(255,255, 255, 255)',
    padding: 10,
    borderRadius: 5,
    zIndex:10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    marginTop:20,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 20,
  },
  subTitleText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  symptomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  symptomButton: {
    width: '30%',
    height: 80,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedSymptom: {
    backgroundColor: '#ffa726',
    borderColor: '#ff9800',
  },
  symptomText: {
    fontSize: 16,
    color: '#000',
  },
  optionContainer: {
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  nextButton: {
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#ccc',
    alignItems: 'center',
  },
  nextButtonActive: {
    backgroundColor: '#ffa726',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  result: {
  },
  resultScroll: {
    marginVertical: 10,
  },
  diseaseListContainer: {
    paddingBottom: 20, // 스크롤 끝에서 여백 추가
  },
  // 각 질병 정보를 담을 카드 스타일
  diseaseCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  diseaseText: {
    fontSize: 18,
    padding: 10,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  diseaseDetailContainer: {
    flex: 1,
    padding: 20,
  },
  diseaseDescription: {
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#76C7C0',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 20,
    marginBottom: 50,
  },
});

export default SymptomChecker;
