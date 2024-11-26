import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { firestore } from "../Firebase"; // Firestore 가져오기
import { doc, getDoc, collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore"; // Firestore 함수 
import { SvgXml } from 'react-native-svg';
import { getAuth } from 'firebase/auth'; // Firebase Authentication 가져오기

const svgString6 =`
<svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.74996 19.34C10.1139 19.7544 10.0737 20.3852 9.65996 20.75C9.24556 21.114 8.61471 21.0737 8.24996 20.66L0.249955 11.66C-0.0816908 11.2825 -0.0816908 10.7175 0.249955 10.34L8.24996 1.34C8.48059 1.05366 8.84975 0.916976 9.21124 0.984074C9.57274 1.05117 9.86826 1.31123 9.98078 1.66126C10.0933 2.01129 10.0047 2.39484 9.74996 2.66L2.33996 11L9.74996 19.34Z" fill="#111111"/>
</svg>`;

const PostDetail = ({ route, navigation }) => {
  const { postId } = route.params; // 게시물 ID 받아오기
  const [post, setPost] = useState(null); // 게시물 데이터 저장
  const [comment, setComment] = useState(""); // 댓글 입력 값 저장
  const [comments, setComments] = useState([]); // 댓글 목록 저장
  const [isAuthor, setIsAuthor] = useState(false); // 현재 사용자가 글 작성자인지 여부 확인
  const [userNames, setUserNames] = useState({}); // 사용자 이름 저장

  const auth = getAuth(); // Firebase 인증 인스턴스

  // 게시물 및 댓글 데이터 가져오기
  useEffect(() => {
    const getPostData = async () => {
      const docRef = doc(firestore, "posts", postId); // 선택한 게시물의 참조
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();
        setPost(postData);

        // 현재 로그인한 사용자와 작성자가 동일한지 확인
        const currentUserUid = auth.currentUser ? auth.currentUser.uid : null;
        if (postData.authorUid === currentUserUid) {
          setIsAuthor(true); // 작성자일 경우 수정 버튼 보이기
        }
      } else {
        Alert.alert("알림", "게시물을 찾을 수 없습니다.");
      }
    };

    // 댓글을 실시간으로 받아오기
    const commentsRef = collection(firestore, "posts", postId, "comments");
    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => doc.data());
      setComments(fetchedComments); // 실시간 댓글 업데이트
    });

    getPostData();

    return () => unsubscribe(); // 컴포넌트 언마운트 시 리스너 정리
  }, [postId]);

  // 댓글 작성자 이름 가져오기
  useEffect(() => {
    const getUserName = async (uid) => {
      const userDocRef = doc(firestore, "users", uid); // 사용자의 "users" 컬렉션에서 데이터 가져오기
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return userDoc.data().name || "익명"; // 사용자가 이름을 설정하지 않았다면 "익명"
      } else {
        return "익명";
      }
    };

    // 댓글 작성자의 이름을 가져와 저장
    const fetchUserNames = async () => {
      const nameMap = {};
      for (const comment of comments) {
        const userName = await getUserName(comment.authorUid);
        nameMap[comment.authorUid] = userName;
      }
      setUserNames(nameMap); // 이름을 상태에 저장
    };

    fetchUserNames();
  }, [comments]);

  // 댓글 추가 함수
  const addComment = async () => {
    if (!comment.trim()) {
      Alert.alert("알림", "댓글을 입력해주세요.");
      return;
    }

    try {
      const postRef = doc(firestore, "posts", postId);
      const newComment = await addDoc(collection(postRef, "comments"), {
        text: comment,
        createdAt: serverTimestamp(),
        authorUid: auth.currentUser.uid, // 댓글 작성자의 UID 추가
      });

      setComment(""); // 댓글 입력 초기화
      Alert.alert("성공", "댓글이 추가되었습니다!");
    } catch (error) {
      console.error("댓글 추가 실패:", error);
      Alert.alert("오류", "댓글 추가에 실패했습니다.");
    }
  };

  // 게시물 수정 버튼 클릭 시 처리
  const editPost = () => {
    navigation.navigate("EditPost", { postId });
  };

  if (!post) return null; // 게시물 데이터가 로드되지 않았을 경우

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <SvgXml xml={svgString6} width="24" height="24" style={styles.icon1} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>게시글</Text>
      </View>

      <View style={styles.postContainer}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postContent}>{post.content}</Text>
        <Text style={styles.postCategory}>카테고리: {post.category}</Text>
      </View>

      <View style={styles.commentsContainer}>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <View key={index} style={styles.commentCard}>
              <Text style={styles.commentAuthor}>{userNames[comment.authorUid] || "익명"}</Text>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noComments}>댓글이 없습니다.</Text>
        )}
      </View>

      <TextInput
        style={styles.commentInput}
        placeholder="댓글을 입력하세요"
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <TouchableOpacity style={styles.commentButton} onPress={addComment}>
        <Text style={styles.commentButtonText}>댓글 추가</Text>
      </TouchableOpacity>

      {isAuthor && (
        <TouchableOpacity style={styles.editButton} onPress={editPost}>
          <Text style={styles.editButtonText}>게시물 수정</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: -10,
    backgroundColor: 'rgba(255,255, 255, 255)',
    padding: 10,
    borderRadius: 5,
  },
  header: {
    width: "100%",
    padding: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  postContainer: {
    marginBottom: 20,
  },
  postTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  postContent: {
    fontSize: 16,
    marginBottom: 20,
  },
  postCategory: {
    fontSize: 14,
    color: "#555",
    margintop: 10,
  },
  commentsContainer: {
    marginBottom: 10,
  },
  commentCard: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginBottom: 10,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  commentText: {
    fontSize: 14,
  },
  noComments: {
    fontSize: 14,
    color: "#aaa",
  },
  commentInput: {
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  commentButton: {
    backgroundColor: "#FFE69E",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  commentButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  editButton: {
    backgroundColor: "#FFE69E",
    borderRadius: 5,
    padding: 10,
    marginBottom: 30,
    alignItems: "center",
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export default PostDetail;
