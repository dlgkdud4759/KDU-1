import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Image, TextInput, Modal } from "react-native";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { SvgXml } from 'react-native-svg';

const svgString6 = `
<svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.74996 19.34C10.1139 19.7544 10.0737 20.3852 9.65996 20.75C9.24556 21.114 8.61471 21.0737 8.24996 20.66L0.249955 11.66C-0.0816908 11.2825 -0.0816908 10.7175 0.249955 10.34L8.24996 1.34C8.48059 1.05366 8.84975 0.916976 9.21124 0.984074C9.57274 1.05117 9.86826 1.31123 9.98078 1.66126C10.0933 2.01129 10.0047 2.39484 9.74996 2.66L2.33996 11L9.74996 19.34Z" fill="#111111"/>
</svg>`;

const animalApiUrl = "http://apis.data.go.kr/1543061/abandonmentPublicSrvc/abandonmentPublic";
const animalApiKey = "VnVM669Vk0l2lxG3w2A2QQVEo1i4ekEM3FtZSye+S53tmMMQ5bFMvMlvAyhVJfwMb1gaNA37HOdQqja6QmYjDQ==";

const Adopt = ({ navigation }) => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");  
  const [animalType, setAnimalType] = useState("both");  
  const [searchType, setSearchType] = useState("kind");  
  const [modalVisible, setModalVisible] = useState(false);  

 const fetchAnimalData = async (searchText = "") => {
  setLoading(true);
  setError(null);

  // "dog"와 "cat"만 필터링하도록 처리
  let upkind = "";
  if (animalType === "dog") {
    upkind = "417000";  // 개
  } else if (animalType === "cat") {
    upkind = "422400";  // 고양이
  }

  try {
    const response = await axios.get(animalApiUrl, {
      params: {
        serviceKey: animalApiKey,
        numOfRows: 30,
        pageNo: 1,
        upkind: upkind, // 개와 고양이를 포함하도록
        state: "notice",
      },
      responseType: "text",
    });

    const parser = new XMLParser();
    const parsedData = parser.parse(response.data);
    const items = parsedData.response.body.items.item;

    // 검색 유형에 따른 필터링
    const filteredItems = items.filter(item => {
      if (searchType === "kind") {
        return item.kindCd && item.kindCd.toLowerCase().includes(searchText.toLowerCase());
      } else if (searchType === "place") {
        return item.happenPlace && item.happenPlace.toLowerCase().includes(searchText.toLowerCase());
      } else if (searchType === "location") {
        return item.careAddr && item.careAddr.toLowerCase().includes(searchText.toLowerCase());
      }
      return true;
    });

    setAnimals(filteredItems);
  } catch (err) {
    console.error("데이터 로드 실패:", err);
    setError("유기 동물 정보를 불러오는 데 실패했습니다.");
  } finally {
    setLoading(false);
  }
};
  
  useEffect(() => {
    fetchAnimalData(searchText); // searchText와 animalType 변경 시마다 다시 로드
  }, [animalType, searchType, searchText]);

  const renderAnimalItem = ({ item }) => (
    <View style={styles.animalCard}>
      <Image source={{ uri: item.popfile }} style={styles.animalImage} />
      <Text style={styles.animalInfo}>품종: {item.kindCd}</Text>
      <Text style={styles.animalInfo}>성별: {item.sexCd === "M" ? "수컷" : "암컷"}</Text>
      <Text style={styles.animalInfo}>발견 장소: {item.happenPlace}</Text>
      <Text style={styles.animalInfo}>상태: {item.processState}</Text>
      <Text style={styles.animalInfo}>보호소: {item.careNm}</Text>
      <Text style={styles.animalInfo}>보호소 주소: {item.careAddr}</Text>
      <Text style={styles.animalInfo}>보호소 연락처: {item.careTel}</Text>
    </View>
  );
  const searchAgain = () => {
    fetchAnimalData(searchText); // 검색 버튼 클릭 시
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const applyFilters = () => {
    fetchAnimalData(searchText); 
    closeModal(); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <SvgXml xml={svgString6} width="24" height="24" style={styles.icon1} />
      </TouchableOpacity>
      <Text style={styles.title}>유기 동물 정보</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={searchType === "kind" ? "품종을 입력하세요" : searchType === "place" ? "발견 장소를 입력하세요" : "보호소 위치를 입력하세요"}
          value={searchText}
          onChangeText={setSearchText}
        />

        <TouchableOpacity onPress={searchAgain} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={openModal} style={styles.filterButton}>
        <Text style={styles.filterButtonText}>필터 설정</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={animals}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderAnimalItem}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>검색 필터 설정</Text>

            <View style={styles.buttonGroup}>
  <Text style={styles.buttonGroupLabel}>동물 종류:</Text>
  <TouchableOpacity 
    style={animalType === "both" ? styles.selectedButton : styles.button} 
    onPress={() => setAnimalType("both")}
  >
    <Text style={styles.buttonText}>전체</Text>
  </TouchableOpacity>
  <TouchableOpacity 
    style={animalType === "dog" ? styles.selectedButton : styles.button} 
    onPress={() => setAnimalType("dog")}
  >
    <Text style={styles.buttonText}>개</Text>
  </TouchableOpacity>
  <TouchableOpacity 
    style={animalType === "cat" ? styles.selectedButton : styles.button} 
    onPress={() => setAnimalType("cat")}
  >
    <Text style={styles.buttonText}>고양이</Text>
  </TouchableOpacity>
</View>

            <View style={styles.buttonGroup}>
              <Text style={styles.buttonGroupLabel}>검색 항목:</Text>
              <TouchableOpacity 
                style={searchType === "kind" ? styles.selectedButton : styles.button} 
                onPress={() => setSearchType("kind")}
              >
                <Text style={styles.buttonText}>품종</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={searchType === "place" ? styles.selectedButton : styles.button} 
                onPress={() => setSearchType("place")}
              >
                <Text style={styles.buttonText}>발견 장소</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={searchType === "location" ? styles.selectedButton : styles.button} 
                onPress={() => setSearchType("location")}
              >
                <Text style={styles.buttonText}>보호소 위치</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.buttonText}>설정</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.buttonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFFFFF" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
    zIndex: 999,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    height: 35,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    flex: 1,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  searchButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#FF9F00",
    borderRadius: 8,
    alignItems: "center",
  },
  searchButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  filterButton: {
    marginVertical: 20,
    backgroundColor: "#FF9F00",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  buttonGroup: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-between",
    flexWrap: 'wrap',
  },
  buttonGroupLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  button: {
    padding: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "20%",
    alignItems: "center",
    margin: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedButton: {
    padding: 6,
    backgroundColor: "#FF9F00",
    borderRadius: 8,
    width: "28%",
    alignItems: "center",
    margin: 4,
  },
  buttonText: { color: "#000", fontSize: 12, fontWeight: "bold" },
  animalCard: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
    alignItems: "center",
  },
  animalImage: { width: 180, height: 180, marginBottom: 10 },
  animalInfo: { fontSize: 12, marginBottom: 5 },
  error: { fontSize: 16, color: "red", textAlign: "center" },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  applyButton: {
    padding: 8,
    backgroundColor: "#FFE69E",
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  closeButton: {
    padding: 8,
    backgroundColor: "#FFE69E",
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
});

export default Adopt;
