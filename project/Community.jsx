import { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { SvgXml } from 'react-native-svg';
import { collection, onSnapshot, query, where, orderBy, getDocs } from "firebase/firestore";
import { firestore } from "../Firebase"; // firebase 설정 파일에서 firestore 가져오기

const svgString = `
<svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M30.5719 16.5987L28.125 14.1106V8.01316C28.125 7.06875 27.3656 6.29605 26.4375 6.29605H24.75C23.8219 6.29605 23.0625 7.06875 23.0625 8.01316V8.96272L19.6875 5.53194C19.2268 5.08893 18.8049 4.57895 18 4.57895C17.1951 4.57895 16.7732 5.08893 16.3125 5.53194L5.42813 16.5987C4.90163 17.1567 4.5 17.5637 4.5 18.3158C4.5 19.2825 5.229 20.0329 6.1875 20.0329H7.875V30.3355C7.875 31.2799 8.63437 32.0526 9.5625 32.0526H12.9375C13.8695 32.0526 14.625 31.2839 14.625 30.3355V23.4671C14.625 22.5227 15.3844 21.75 16.3125 21.75H19.6875C20.6156 21.75 21.375 22.5227 21.375 23.4671V30.3355C21.375 31.2839 21.2868 32.0526 22.2188 32.0526H26.4375C27.3656 32.0526 28.125 31.2799 28.125 30.3355V20.0329H29.8125C30.771 20.0329 31.5 19.2825 31.5 18.3158C31.5 17.5637 31.0984 17.1567 30.5719 16.5987Z" stroke="black" stroke-width="2" stroke-linejoin="round"/>
</svg>`;

const svgString1 = `
<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.875 11.5505C7.875 6.15323 12.4631 1.875 18 1.875C23.4119 1.875 27.9175 5.96232 28.118 11.1868L28.8347 11.4257C29.5294 11.6572 30.1383 11.8601 30.6213 12.0849C31.1435 12.3278 31.6221 12.6407 31.9879 13.1483C32.3538 13.6559 32.4993 14.2089 32.5647 14.7811C32.6251 15.3104 32.625 15.9522 32.625 16.6845V25.3068C32.625 26.2209 32.6251 27.0007 32.5541 27.6264C32.4795 28.2845 32.3127 28.9312 31.8606 29.483C31.601 29.7998 31.2859 30.0667 30.9307 30.2707C30.3122 30.6259 29.6468 30.6842 28.9854 30.6496C28.3566 30.6167 27.5873 30.4884 26.6856 30.3381L26.6233 30.3277C24.684 30.0045 23.9027 29.8824 23.1411 29.9461C22.8625 29.9694 22.5857 30.011 22.3125 30.0707C21.5661 30.2337 20.8483 30.5837 19.0741 31.4708C19.0124 31.5016 18.9514 31.5321 18.891 31.5623C16.8171 32.5997 15.5393 33.2388 14.1605 33.4385C13.7458 33.4985 13.3272 33.5283 12.9082 33.5275C11.515 33.5248 10.1699 33.0762 7.98803 32.3486C7.92492 32.3275 7.86111 32.3062 7.79657 32.2847L7.22123 32.0929L7.16525 32.0743C6.4706 31.8428 5.86174 31.6399 5.3787 31.4151C4.85649 31.1722 4.37792 30.8593 4.01206 30.3517C3.6462 29.8441 3.50068 29.2911 3.43535 28.7189C3.37492 28.1896 3.37496 27.5478 3.375 26.8155L3.375 19.2859C3.37496 18.1067 3.37492 17.1127 3.47594 16.3342C3.58138 15.5216 3.81978 14.7272 4.47394 14.1297C4.66623 13.9541 4.8782 13.8013 5.10563 13.6744C5.87929 13.2427 6.7084 13.2678 7.51261 13.4247C7.67576 13.4566 7.84664 13.4958 8.02528 13.5413C7.92617 12.8726 7.875 12.2058 7.875 11.5505ZM8.62304 16.0639C7.98108 15.8569 7.48837 15.7124 7.0817 15.6331C6.48898 15.5174 6.29468 15.5875 6.20188 15.6393C6.12607 15.6816 6.05541 15.7325 5.99131 15.791C5.91285 15.8627 5.78494 16.0249 5.70723 16.6238C5.62726 17.24 5.625 18.0862 5.625 19.362V26.7566C5.625 27.5652 5.6267 28.0772 5.67083 28.4637C5.71168 28.8214 5.77851 28.9544 5.83736 29.0361C5.8962 29.1177 6.00125 29.2232 6.32774 29.3751C6.68046 29.5392 7.16563 29.7027 7.93274 29.9584L8.50808 30.1502C10.9434 30.962 11.9263 31.2756 12.9125 31.2775C13.2222 31.2781 13.5315 31.2561 13.838 31.2117C14.8137 31.0704 15.7514 30.6165 18.0678 29.4583C18.1147 29.4348 18.1611 29.4116 18.207 29.3887C19.798 28.593 20.7781 28.1028 21.8325 27.8725C22.202 27.7918 22.5765 27.7355 22.9535 27.7039C24.0289 27.6139 25.1016 27.7929 26.8418 28.0831C26.8917 28.0914 26.9421 28.0998 26.9932 28.1083C27.9745 28.2719 28.6168 28.3772 29.1029 28.4026C29.5708 28.4271 29.7315 28.3647 29.8102 28.3196C29.9286 28.2516 30.0337 28.1626 30.1202 28.057C30.1777 27.9868 30.2657 27.8384 30.3185 27.3729C30.3733 26.8892 30.375 26.2384 30.375 25.2435V16.7434C30.375 15.9348 30.3733 15.4228 30.3292 15.0363C30.2883 14.6786 30.2215 14.5456 30.1627 14.4639C30.1038 14.3823 29.9988 14.2768 29.6723 14.1249C29.3195 13.9608 28.8344 13.7973 28.0673 13.5416L27.979 13.5122C27.6937 15.4643 26.9994 17.435 25.9759 19.1939C24.6072 21.5461 22.6046 23.5948 20.0956 24.6893C18.764 25.2702 17.236 25.2702 15.9044 24.6893C13.3954 23.5948 11.3928 21.5461 10.0241 19.1939C9.44807 18.204 8.9763 17.147 8.62304 16.0639ZM18 4.125C13.5957 4.125 10.125 7.50311 10.125 11.5505C10.125 13.6766 10.7812 16.0213 11.9688 18.0623C13.1568 20.1039 14.8313 21.7664 16.804 22.627C17.562 22.9577 18.438 22.9577 19.196 22.627C21.1687 21.7664 22.8432 20.1039 24.0312 18.0623C25.2188 16.0213 25.875 13.6766 25.875 11.5505C25.875 7.50311 22.4043 4.125 18 4.125ZM18 10.125C16.9645 10.125 16.125 10.9645 16.125 12C16.125 13.0355 16.9645 13.875 18 13.875C19.0355 13.875 19.875 13.0355 19.875 12C19.875 10.9645 19.0355 10.125 18 10.125ZM13.875 12C13.875 9.72183 15.7218 7.875 18 7.875C20.2782 7.875 22.125 9.72183 22.125 12C22.125 14.2782 20.2782 16.125 18 16.125C15.7218 16.125 13.875 14.2782 13.875 12Z" fill="black"/>
</svg>`;

const svgString2 = `
<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M13.4835 7.96167C15.2534 4.35817 18.9605 1.875 23.25 1.875C29.2561 1.875 34.125 6.7439 34.125 12.75C34.125 14.3581 33.7752 15.8876 33.1465 17.264C32.9824 17.6232 32.9505 17.9625 33.0234 18.2351L33.2145 18.9492C33.8261 21.2349 31.7349 23.3261 29.4492 22.7145L28.7351 22.5234C28.5322 22.4692 28.2924 22.473 28.0349 22.5461C27.2698 29.0662 21.7257 34.125 15 34.125C12.975 34.125 11.0542 33.6656 9.33885 32.8444C8.99926 32.6818 8.6649 32.6488 8.38986 32.7224L6.5508 33.2145C4.26505 33.8261 2.17391 31.7349 2.78549 29.4492L3.27756 27.6101C3.35115 27.3351 3.31817 27.0007 3.15559 26.6612C2.33435 24.9458 1.875 23.025 1.875 21C1.875 14.2642 6.9491 8.71346 13.4835 7.96167ZM16.1025 7.92065C22.5897 8.46017 27.7371 13.7177 28.1041 20.2524C28.4978 20.2149 28.9071 20.2403 29.3167 20.3499L30.0308 20.541C30.644 20.705 31.205 20.144 31.041 19.5308L30.8499 18.8167C30.6142 17.9357 30.7678 17.0562 31.0999 16.3292C31.5973 15.2403 31.875 14.0291 31.875 12.75C31.875 7.98654 28.0135 4.125 23.25 4.125C20.2771 4.125 17.6538 5.62925 16.1025 7.92065ZM15 10.125C8.9939 10.125 4.125 14.9939 4.125 21C4.125 22.6816 4.50587 24.271 5.18501 25.6896C5.53811 26.4271 5.68618 27.3131 5.4511 28.1917L4.95904 30.0308C4.79495 30.644 5.35599 31.205 5.96924 31.041L7.8083 30.5489C8.68689 30.3138 9.57286 30.4619 10.3104 30.815C11.729 31.4941 13.3184 31.875 15 31.875C21.0061 31.875 25.875 27.0061 25.875 21C25.875 14.9939 21.0061 10.125 15 10.125Z" fill="black"/>
<path d="M11.25 21C11.25 21.8284 10.5784 22.5 9.75 22.5C8.92157 22.5 8.25 21.8284 8.25 21C8.25 20.1716 8.92157 19.5 9.75 19.5C10.5784 19.5 11.25 20.1716 11.25 21Z" fill="black"/>
<path d="M16.5 21C16.5 21.8284 15.8284 22.5 15 22.5C14.1716 22.5 13.5 21.8284 13.5 21C13.5 20.1716 14.1716 19.5 15 19.5C15.8284 19.5 16.5 20.1716 16.5 21Z" fill="black"/>
<path d="M21.75 21C21.75 21.8284 21.0784 22.5 20.25 22.5C19.4216 22.5 18.75 21.8284 18.75 21C18.75 20.1716 19.4216 19.5 20.25 19.5C21.0784 19.5 21.75 20.1716 21.75 21Z" fill="black"/>
</svg>`;
const svgString6 =`
<svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.74996 19.34C10.1139 19.7544 10.0737 20.3852 9.65996 20.75C9.24556 21.114 8.61471 21.0737 8.24996 20.66L0.249955 11.66C-0.0816908 11.2825 -0.0816908 10.7175 0.249955 10.34L8.24996 1.34C8.48059 1.05366 8.84975 0.916976 9.21124 0.984074C9.57274 1.05117 9.86826 1.31123 9.98078 1.66126C10.0933 2.01129 10.0047 2.39484 9.74996 2.66L2.33996 11L9.74996 19.34Z" fill="#111111"/>
</svg>`;
const svgString3 = `
<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24.9998 23.5867L18.7378 17.3247C20.3644 15.3353 21.1642 12.7968 20.9716 10.2343C20.7791 7.67173 19.609 5.28123 17.7034 3.55722C15.7977 1.83321 13.3024 0.90759 10.7334 0.971822C8.16447 1.03605 5.71848 2.08522 3.9014 3.90231C2.08431 5.7194 1.03514 8.16539 0.970906 10.7343C0.906674 13.3033 1.83229 15.7987 3.5563 17.7043C5.28031 19.6099 7.67081 20.78 10.2333 20.9725C12.7959 21.1651 15.3344 20.3653 17.3238 18.7387L23.5858 25.0007L24.9998 23.5867ZM10.9998 19.0007C9.41753 19.0007 7.87081 18.5315 6.55522 17.6525C5.23963 16.7734 4.21425 15.524 3.60875 14.0622C3.00324 12.6004 2.84482 10.9918 3.1535 9.43997C3.46218 7.88813 4.22411 6.46266 5.34293 5.34384C6.46175 4.22502 7.88721 3.4631 9.43906 3.15441C10.9909 2.84573 12.5994 3.00416 14.0612 3.60966C15.5231 4.21516 16.7725 5.24054 17.6515 6.55614C18.5306 7.87173 18.9998 9.41845 18.9998 11.0007C18.9974 13.1217 18.1538 15.1551 16.654 16.6549C15.1542 18.1547 13.1208 18.9983 10.9998 19.0007Z" fill="black"/>
</svg>`;

const Community = ({ navigation, onFetchTopPosts }) => {
  const [posts, setPosts] = useState([]); // 게시물 데이터를 저장하는 상태
  const [petType, setPetType] = useState(""); // 강아지/고양이 필터 상태
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태

  // Firestore에서 데이터 가져오기
  useEffect(() => {
    const fetchPostsWithCommentAndLikeCounts = async () => {
      const q = petType
        ? query(
            collection(firestore, "posts"),
            where("category", "==", petType),
            orderBy("createdAt", "desc") // 최신순 정렬
          )
        : query(
            collection(firestore, "posts"),
            orderBy("createdAt", "desc") // 최신순 정렬
          );

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const fetchedPosts = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const commentsCollection = collection(doc.ref, "comments");
            const commentsSnapshot = await getDocs(commentsCollection);
            const commentCount = commentsSnapshot.size; // 댓글 개수 가져오기

            // 좋아요 개수는 likes 필드에 저장된 유저 ID 배열의 길이로 계산
            const likes = doc.data().likes || []; // likes는 유저 ID 배열
            const likeCount = likes.length; // 유저 ID 배열의 길이로 좋아요 개수 계산

            return {
              id: doc.id,
              ...doc.data(),
              commentCount, // 댓글 개수
              likeCount,    // 좋아요 개수
            };
          })
        );
        setPosts(fetchedPosts); // 상태에 게시물 데이터 저장
        
      });

      return () => unsubscribe(); // 컴포넌트가 언마운트될 때 리스너 정리
    };

    fetchPostsWithCommentAndLikeCounts();
  }, [petType]);

  // 검색어에 맞는 게시물 필터링
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <SvgXml xml={svgString6} width="24" height="24" style={styles.icon1} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>게시판</Text>
      </View>

      <View style={styles.searchContainer}>
        <SvgXml xml={svgString3} width="24" height="24" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="검색어를 입력하세요"
          placeholderTextColor="#aaa"
          value={searchQuery} // 검색어 상태 바인딩
          onChangeText={setSearchQuery} // 검색어 변경 시 상태 업데이트
        />
      </View>

      <View style={styles.petTypeSelection}>
        <TouchableOpacity
          style={[styles.petTypeButton, petType === "강아지" && styles.selectedButton]}
          onPress={() => setPetType(petType === "강아지" ? "" : "강아지")}
        >
          <Text style={styles.petTypeButtonText}>강아지</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.petTypeButton, petType === "고양이" && styles.selectedButton]}
          onPress={() => setPetType(petType === "고양이" ? "" : "고양이")}
        >
          <Text style={styles.petTypeButtonText}>고양이</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, marginTop: 20, marginBottom: 80, }}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.postCard}
              onPress={() => navigation.navigate("PostDetail", { postId: post.id })}
            >
<View style={styles.postLeft}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postContent} numberOfLines={3}>
            {post.content}
          </Text>
          <Text style={styles.postCategory}>카테고리: {post.category}</Text>
          <Text style={styles.commentCount}>댓글: {post.commentCount}개</Text>
        </View>
        <View style={styles.likeCountContainer}>
          <Text style={styles.likeCount}>좋아요: {post.likeCount}개</Text>
        </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResults}>검색 결과가 없습니다.</Text>
        )}
      </ScrollView>
      <View>
        <TouchableOpacity style={styles.circle} onPress={() => navigation.navigate("Write")} />
      </View>
      <View style={styles.footer}>
        <View style={styles.navItem}>
          <SvgXml xml={svgString} width="36" height="36" style={styles.icon} />
          <Text style={styles.navText}>홈</Text>
        </View>
        <View style={styles.navItem}>
          <TouchableOpacity onPress={() => navigation.navigate("MapComponent")}>
            <SvgXml xml={svgString1} width="36" height="36" style={styles.icon} />
            <Text style={styles.navText}>지도</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.navItem}>
          <TouchableOpacity onPress={() => navigation.navigate("Community")}>
            <SvgXml xml={svgString2} width="36" height="36" style={styles.icon} />
            <Text style={styles.navText}>게시판</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    position: "relative", // 버튼 위치 계산을 위한 상대 위치 기준
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255,255, 255, 255)',
    padding: 10,
    borderRadius: 5,
  },
  header: {
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: 'center',
  },
  searchContainer: {
    alignItems: "center",
    borderRadius: 50,
    height: 40,
    marginBottom: 20,
    paddingHorizontal: -3,
    top: 20,
  },
  searchIcon: {
    position: 'absolute',
    top: 18,
    left: 70,
    zIndex: 1, // 아이콘이 텍스트 필드 위에 있도록 설정
  },
  searchInput: {
    width: 250,
    height: 50,
    borderColor: '#999999',
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    marginVertical: 5,
    paddingLeft: 50,
  },
  actionButton: {
    alignSelf: "center", // 화면 중앙 정렬
    backgroundColor: "#007BFF",
    borderRadius: 50,
    padding: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#f8f8f8",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    marginTop: 4,
    fontSize: 16,
    color: "#555",
  },
  icon: {
    marginBottom: 4,
  },
  circle: {
    width: 60, // 원의 크기
    height: 60, // 원의 크기
    borderRadius: 50,
    backgroundColor: "#FFCA96", // 원 색상
    position: "absolute", // 절대 위치로 설정하여 화면 안에 위치
    bottom: 100, // 화면 하단에 위치
    right: 20, // 화면 오른쪽에 위치
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // 안드로이드에서 그림자 추가
  },
  petTypeSelection: {
    flexDirection: 'row',
    justifyContent: 'center', // 버튼을 중앙 정렬
    marginBottom: 20, // 검색창과의 간격을 위해 여백 추가
    top: 30,
  },
  petTypeButtonText: {
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Roboto',
    fontSize: 15,
  },
  selectedButton: {
    backgroundColor: '#FFE69E', // 선택된 버튼 배경색
  },
  petTypeButton: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderColor: 'rgba(153, 153, 153, 1)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: 40,
    marginRight: 10,
  },
  postCard: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    flexDirection: 'row', // 왼쪽과 오른쪽으로 분리
    justifyContent: 'space-between', // 왼쪽과 오른쪽을 공간으로 구분
  },
  postLeft: {
    flex: 1, // 왼쪽 영역이 나머지 공간을 차지하도록 설정
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  postContent: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  postCategory: {
    fontSize: 14,
    color: "#999",
    marginBottom: 5,
  },
  commentCount: {
    fontSize: 12,
    color: '#000',
    marginBottom: 10,
  },
  likeCountContainer: {
    justifyContent: 'center', // 세로 중앙 정렬
    alignItems: 'flex-end', // 오른쪽 정렬
  },
  likeCount: {
    fontSize: 14,
    color: '#ff8c00', // 좋아요 색상 (원하는 색상으로 변경 가능)
    fontWeight: 'bold',
  },
});


export default Community;
