import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { firestore } from "../Firebase";
import { Picker } from "@react-native-picker/picker";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { SvgXml } from "react-native-svg";

const svgStringBack = `
<svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.74996 19.34C10.1139 19.7544 10.0737 20.3852 9.65996 20.75C9.24556 21.114 8.61471 21.0737 8.24996 20.66L0.249955 11.66C-0.0816908 11.2825 -0.0816908 10.7175 0.249955 10.34L8.24996 1.34C8.48059 1.05366 8.84975 0.916976 9.21124 0.984074C9.57274 1.05117 9.86826 1.31123 9.98078 1.66126C10.0933 2.01129 10.0047 2.39484 9.74996 2.66L2.33996 11L9.74996 19.34Z" fill="#111111"/>
</svg>`;

const EditPost = ({ route, navigation }) => {
  const { postId } = route.params; // 게시물 ID 받아오기
  const [post, setPost] = useState(null); // 게시물 데이터
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const auth = getAuth();

  useEffect(() => {
    const getPostData = async () => {
      const docRef = doc(firestore, "posts", postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();
        setPost(postData);
        setCategory(postData.category);
        setTitle(postData.title);
        setContent(postData.content);
      } else {
        Alert.alert("알림", "게시물을 찾을 수 없습니다.");
      }
    };

    getPostData();
  }, [postId]);

  const handleSubmit = async () => {
    if (!category || !title || !content) {
      Alert.alert("알림", "모든 필드를 채워주세요!");
      return;
    }
  
    try {
      const docRef = doc(firestore, "posts", postId);
      await updateDoc(docRef, {
        category,
        title,
        content,
        updatedAt: new Date(), // 수정된 시간을 업데이트
      });
  
      Alert.alert("성공", "게시물이 수정되었습니다!");
      navigation.navigate('PostDetail', { postId }); // 수정된 게시물 상세 페이지로 이동
    } catch (error) {
      console.error("게시물 수정 실패:", error);
      Alert.alert("오류", "게시물 수정에 실패했습니다.");
    }
  };
  
  if (!post) return null; // 데이터가 없으면 렌더링 하지 않음

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
            <Text style={styles.headerText}>게시물 수정</Text>
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
            <Text style={styles.submitButtonText}>수정 완료</Text>
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

export default EditPost;
