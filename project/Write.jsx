import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { SvgXml } from "react-native-svg";
import { Picker } from "@react-native-picker/picker";
import { firestore } from "../Firebase"; // firebase.js에서 Firestore 가져오기
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore"; // Firestore 관련 함수들 추가
import { getAuth } from "firebase/auth"; // Firebase Authentication 가져오기

const svgStringBack = `
<svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.74996 19.34C10.1139 19.7544 10.0737 20.3852 9.65996 20.75C9.24556 21.114 8.61471 21.0737 8.24996 20.66L0.249955 11.66C-0.0816908 11.2825 -0.0816908 10.7175 0.249955 10.34L8.24996 1.34C8.48059 1.05366 8.84975 0.916976 9.21124 0.984074C9.57274 1.05117 9.86826 1.31123 9.98078 1.66126C10.0933 2.01129 10.0047 2.39484 9.74996 2.66L2.33996 11L9.74996 19.34Z" fill="#111111"/>
</svg>`;

const Write = ({ navigation }) => {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const auth = getAuth(); // Firebase 인증 인스턴스

  // 게시물 저장 함수
  const handleSubmit = async () => {
    if (!category || !title || !content) {
      Alert.alert("알림", "모든 필드를 채워주세요!");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("알림", "로그인 후 게시글을 작성해주세요.");
      return;
    }

    try {
      // pets 컬렉션에서 현재 로그인된 사용자의 userId 값 가져오기
      const q = query(
        collection(firestore, "pets"),
        where("userId", "==", user.uid) // "userId"가 로그인된 사용자의 UID와 일치하는 문서 찾기
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("알림", "사용자 정보가 없습니다.");
        return;
      }

      const petData = querySnapshot.docs[0].data(); // 첫 번째 문서 데이터 가져오기

      // Firestore에 데이터 추가
      await addDoc(collection(firestore, "posts"), {
        category,
        title,
        content,
        createdAt: serverTimestamp(),
        authorUid: user.uid, // 작성자의 UID 추가
        petOwnerId: petData.userId, // pets 컬렉션에서 가져온 userId 추가
      });

      Alert.alert("성공", "게시글이 저장되었습니다!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("오류", "저장에 실패했습니다.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS에서는 "padding", Android에서는 "height"로 설정
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
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
                <Picker.Item label="강아지" value="강아지" />
                <Picker.Item label="고양이" value="고양이" />
              </Picker>
            </View>

            <TextInput
              style={styles.input}
              placeholder="제목"
              placeholderTextColor="#aaa"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="내용을 입력하세요."
              placeholderTextColor="#aaa"
              multiline={true}
              numberOfLines={5}
              value={content}
              onChangeText={setContent}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>작성 완료</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  backButton: {
    right: 10,
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
