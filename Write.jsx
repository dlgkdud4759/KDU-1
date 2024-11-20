import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { SvgXml } from "react-native-svg";
import { Picker } from '@react-native-picker/picker';


const svgStringBack = `
<svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.74996 19.34C10.1139 19.7544 10.0737 20.3852 9.65996 20.75C9.24556 21.114 8.61471 21.0737 8.24996 20.66L0.249955 11.66C-0.0816908 11.2825 -0.0816908 10.7175 0.249955 10.34L8.24996 1.34C8.48059 1.05366 8.84975 0.916976 9.21124 0.984074C9.57274 1.05117 9.86826 1.31123 9.98078 1.66126C10.0933 2.01129 10.0047 2.39484 9.74996 2.66L2.33996 11L9.74996 19.34Z" fill="#111111"/>
</svg>`;

const Write = ({ navigation }) => {
  const [category, setCategory] = useState(""); // 드롭다운 값 저장

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <SvgXml xml={svgStringBack} width="24" height="24" />
        </TouchableOpacity>
        <Text style={styles.headerText}>게시판 작성</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>게시판 선택</Text>
        <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={category}
          style={styles.picker}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="카테고리를 선택하세요" value="" />
          <Picker.Item label="강아지" value="dog" />
          <Picker.Item label="고양이" value="cat" />
        </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="제목"
          placeholderTextColor="#aaa"
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="내용을 입력하세요."
          placeholderTextColor="#aaa"
          multiline={true}
          numberOfLines={5}
        />

        <TouchableOpacity style={styles.fileButton}>
          <Text style={styles.fileButtonText}>파일첨부</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>작성 완료</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pickerWrapper: {
    borderWidth: 1, // 테두리 두께
    borderColor: "#ccc", // 테두리 색상
    borderRadius: 5, // 둥근 테두리
    marginBottom: 20, // 아래 여백
  },
  picker: {
    height: 60,
    borderColor: "#ccc",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  textArea: {
    height: 300,
    textAlignVertical: "top",
  },
  fileButton: {
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  fileButtonText: {
    color: "#007bff",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#FFE69E",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export default Write;
