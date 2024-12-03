import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { firestore } from "../Firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp, onSnapshot, query, where, getDocs, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { SvgXml } from 'react-native-svg';
import { getAuth } from 'firebase/auth';

const svgString6 = `
<svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.74996 19.34C10.1139 19.7544 10.0737 20.3852 9.65996 20.75C9.24556 21.114 8.61471 21.0737 8.24996 20.66L0.249955 11.66C-0.0816908 11.2825 -0.0816908 10.7175 0.249955 10.34L8.24996 1.34C8.48059 1.05366 8.84975 0.916976 9.21124 0.984074C9.57274 1.05117 9.86826 1.31123 9.98078 1.66126C10.0933 2.01129 10.0047 2.39484 9.74996 2.66L2.33996 11L9.74996 19.34Z" fill="#111111"/>
</svg>`;

const PostDetail = ({ route, navigation }) => {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isAuthor, setIsAuthor] = useState(false);
  const [userNames, setUserNames] = useState({});
  const [isLiked, setIsLiked] = useState(false); // 좋아요 상태
  const [likesCount, setLikesCount] = useState(0); // 좋아요 수
  const auth = getAuth();

  // 게시물 데이터 및 댓글 가져오기
  useEffect(() => {
    const getPostData = async () => {
      try {
        const docRef = doc(firestore, "posts", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const postData = docSnap.data();
          setPost(postData);

          const currentUserUid = auth.currentUser?.uid;
          if (postData.authorUid === currentUserUid) {
            setIsAuthor(true);
          }

          // 좋아요 상태 확인
          const likesRef = doc(firestore, "posts", postId);
          const likesDoc = await getDoc(likesRef);
          if (likesDoc.exists()) {
            const likesData = likesDoc.data().likes || [];
            setIsLiked(likesData.includes(currentUserUid)); // 현재 사용자가 좋아요를 눌렀는지 확인
            setLikesCount(likesData.length); // 좋아요 수
          }
        } else {
          Alert.alert("알림", "게시물을 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("게시물 데이터 가져오기 오류:", error);
        Alert.alert("오류", "게시물을 로드할 수 없습니다.");
      }
    };

    const commentsRef = collection(firestore, "posts", postId, "comments");
    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(fetchedComments);
    });

    getPostData();
    return () => unsubscribe();
  }, [postId]);

  // 댓글 작성자 이름 가져오기
  useEffect(() => {
    const fetchUserNames = async () => {
      const uniqueUids = [...new Set(comments.map((comment) => comment.authorUid).filter((uid) => uid))]; // undefined 제거
      const nameMap = {};

      try {
        for (const uid of uniqueUids) {
          if (!uid) continue; // UID가 유효하지 않으면 스킵
          const petsQuery = query(collection(firestore, "pets"), where("userId", "==", uid));
          const petsSnapshot = await getDocs(petsQuery);

          if (!petsSnapshot.empty) {
            const petName = petsSnapshot.docs[0].data().name; // 첫 번째 Pet 이름
            nameMap[uid] = petName || "익명";
          } else {
            nameMap[uid] = "익명";
          }
        }
        setUserNames(nameMap);
      } catch (error) {
        console.error("사용자 이름 가져오기 오류:", error);
      }
    };

    if (comments.length > 0) {
      fetchUserNames();
    }
  }, [comments]);

  // 댓글 추가 함수
  const addComment = async () => {
    if (!comment.trim()) {
      Alert.alert("알림", "댓글을 입력해주세요.");
      return;
    }

    const userUid = auth.currentUser?.uid;
    if (!userUid) {
      Alert.alert("오류", "로그인 후 댓글을 작성해주세요.");
      return;
    }

    try {
      const postRef = doc(firestore, "posts", postId);
      await addDoc(collection(postRef, "comments"), {
        text: comment,
        createdAt: serverTimestamp(),
        authorUid: userUid,
      });
      setComment("");
    } catch (error) {
      console.error("댓글 추가 실패:", error);
      Alert.alert("오류", "댓글 추가에 실패했습니다.");
    }
  };

  // 좋아요 버튼 클릭 시 처리 함수
  const toggleLike = async () => {
    const userUid = auth.currentUser?.uid;
    if (!userUid) {
      Alert.alert("오류", "로그인 후 좋아요를 눌러주세요.");
      return;
    }

    const postRef = doc(firestore, "posts", postId);

    try {
      if (isLiked) {
        // 좋아요 취소
        await updateDoc(postRef, {
          likes: arrayRemove(userUid),
        });
        setLikesCount(likesCount - 1);
      } else {
        // 좋아요 추가
        await updateDoc(postRef, {
          likes: arrayUnion(userUid),
        });
        setLikesCount(likesCount + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("좋아요 상태 업데이트 실패:", error);
      Alert.alert("오류", "좋아요 상태를 업데이트할 수 없습니다.");
    }
  };

  const editPost = () => {
    navigation.navigate("EditPost", { postId });
  };

  if (!post) return null;

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

      <View style={styles.likesContainer}>
        <TouchableOpacity onPress={toggleLike}>
          <Text style={styles.likeButton}>{isLiked ? "좋아요 취소" : "좋아요"}</Text>
        </TouchableOpacity>
        <Text>{likesCount}명</Text>
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
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",  // 기본 배경 색
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",  // 기본 테두리 색
  },
  likedButton: {
    backgroundColor: "#ff4d4d", // 좋아요 눌렀을 때 배경 색 (빨간색)
    borderColor: "#ff0000", // 테두리 색 변경
  },
  likeButtonText: {
    fontSize: 16,
    color: "#333",
    marginRight: 5,  // 텍스트와 아이콘 사이 여백
  },
  likedButtonText: {
    color: "#fff", // 좋아요 상태일 때 텍스트 색상
  },
  likeIcon: {
    width: 20,
    height: 20,
  },
});

export default PostDetail;
