import { Ionicons } from "@expo/vector-icons";
import {
  useFocusEffect,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import styles from "../../../../styles/post/PostStyles";
import { useCallback, useState, useEffect } from "react";
import _axios from "../../../../api";
import {
  ReplyCommentIdProvider,
  useReplyCommentId,
} from "../../../../components/post/ReplyCommentIdContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useUserId from "../../../../hooks/useUserId"; // 커스텀 훅 불러오기

const Post = () => {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [newComment, setNewComment] = useState(""); // 새 댓글 내용 저장
  const [replyComment, setReplyComment] = useState(""); // 대댓글 내용 저장

  const userId = useUserId(); // 커스텀 훅으로 userId 불러오기
  const { selectedComment, setSelectedComment } = useReplyCommentId();

  const pathname = usePathname();
  const router = useRouter();

  // selectedComment가 변경될 때마다 replyComment 초기화
  useEffect(() => {
    if (selectedComment) {
      setReplyComment(""); // selectedComment가 변경될 때만 실행
    }
  }, [selectedComment]);

  useFocusEffect(
    useCallback(() => {
      const getData = async () => {
        _axios
          .get(`/post/${id}`)
          .then((response) => {
            setData({
              id: response.data.id,
              private: Boolean(response.data.is_private),
              user: response.data.author_id,
              title: response.data.title,
              content: response.data.description,
              timestamp: response.data.timestamp,
              image: response.data.image,
              comments: response.data.comments,
              commentsCount: response.data.comments_count,
            });
          })
          .catch((error) => {
            router.replace("community");
          });
      };

      getData();
    }, [id])
  );

  // 댓글 또는 대댓글 추가 로직
  const handleAddComment = async (isReply) => {
    const commentContent = isReply ? replyComment : newComment;
    if (!commentContent) {
      console.log("댓글 내용이 있어야합니다.");
      return;
    }

    try {
      let data = JSON.stringify({
        post_id: id,
        content: commentContent,
        parent_id: isReply ? selectedComment : null,
      });
      const response = await _axios.post("/comment", data);

      // 댓글 추가 후 댓글 목록만 다시 불러옴
      const updatedPost = await _axios.get(`/post/${id}`);
      setData((prev) => ({
        ...prev,
        comments: updatedPost.data.comments,
        commentsCount: updatedPost.data.comments_count,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setNewComment("");
      setReplyComment("");
      setSelectedComment(null);
    }
  };

  const handleRemoveComment = async (targetCommentId) => {
    try {
      const response = await _axios.delete(`/comment/${targetCommentId}`);

      // 댓글 삭제 후 댓글 목록만 다시 불러옴
      const updatedPost = await _axios.get(`/post/${id}`);
      setData((prev) => ({
        ...prev,
        comments: updatedPost.data.comments,
        commentsCount: updatedPost.data.comments_count,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const renderReplies = (replies) => {
    return replies.map((reply, index) => (
      <View
        key={index}
        style={styles.replyItem} // 대댓글 스타일 적용
      >
        <View style={styles.replyIndent}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: 28,
            }}
          >
            <Text style={styles.commentUser}>{reply.author_id}</Text>
            {reply.author_id === userId && (
              <TouchableOpacity
                hitSlop={8}
                onPress={() => handleRemoveComment(reply.comment_id)}
              >
                <Text style={{ color: "red", fontSize: 24, fontWeight: 700 }}>
                  ×
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.replyTimestamp}>{reply.created_at}</Text>
          <Text style={styles.replyContent}>{reply.content}</Text>
        </View>
      </View>
    ));
  };

  // comment_id를 선택한 후 대댓글 초기화는 useEffect에서 처리
  const handleReply = (comment) => {
    setSelectedComment(comment.comment_id);
  };

  if (!data) {
    return <></>;
  }

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        {data.image && (
          <Image
            source={{ uri: data.image }}
            style={styles.image}
          />
        )}
        <Text style={styles.title}>{data.title}</Text>
        <View style={styles.privateStatusContainer}>
          <Ionicons
            name={data.private ? "lock-closed" : "earth-sharp"}
            size={16}
            color="#666"
            style={styles.privateStatusIcon}
          />
          <Text style={styles.privateStatusText}>
            {data.private ? "비공개" : "공개"}
          </Text>
        </View>
        <Text style={styles.userInfo}>
          {data.user} • {data.timestamp}
        </Text>
        <Text style={styles.content}>{data.content}</Text>
      </View>

      {/* 비공개 채팅 버튼 */}
      <View style={styles.chatButtonContainer}>
        <TouchableOpacity
          onPress={() => router.push(`${pathname}/chat`)}
          style={styles.chatButtonTouchArea}
          hitSlop={4}
        >
          <Text style={styles.chatButtonText}>비공개 채팅</Text>
        </TouchableOpacity>
      </View>

      {/* 댓글 입력 필드 */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChangeText={(text) => setNewComment(text)}
        />
        <TouchableOpacity
          style={styles.commentButton}
          onPress={() => handleAddComment(false)}
        >
          <Text style={styles.commentButtonText}>댓글 작성</Text>
        </TouchableOpacity>
      </View>

      {/* 댓글 렌더링 */}
      <View style={styles.commentContainer}>
        <Text style={styles.commentTitle}>댓글 {data.commentsCount}개</Text>
        {data.comments.map((comment, index) => (
          <View
            key={index}
            style={styles.commentItem} // 댓글 스타일 적용
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: 28,
              }}
            >
              <Text style={styles.commentUser}>{comment.author_id}</Text>
              {comment.author_id === userId && (
                <TouchableOpacity
                  hitSlop={8}
                  onPress={() => handleRemoveComment(comment.comment_id)}
                >
                  <Text style={{ color: "red", fontSize: 24, fontWeight: 700 }}>
                    ×
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.commentTimestamp}>{comment.created_at}</Text>
            <Text style={styles.commentContent}>{comment.content}</Text>
            <TouchableOpacity
              style={styles.replyButton} // 스타일 적용
              onPress={() => handleReply(comment)} // 대댓글 작성 핸들러
            >
              <Text style={styles.replyButtonText}>답글 달기</Text>
            </TouchableOpacity>
            {selectedComment === comment.comment_id && (
              <>
                {/* 대댓글 입력 필드 */}
                <View style={styles.commentInputContainer}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="댓글을 입력하세요..."
                    value={replyComment}
                    onChangeText={(text) => setReplyComment(text)}
                  />
                  <TouchableOpacity
                    style={styles.commentButton}
                    onPress={() => handleAddComment(true)}
                  >
                    <Text style={styles.commentButtonText}>댓글 작성</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* 하위 댓글 렌더링 */}
            {comment.replies && comment.replies.length > 0 && (
              <View style={styles.repliesContainer}>
                {renderReplies(comment.replies)}
              </View>
            )}
          </View>
        ))}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default function PostWithReplyCommentIdProvider() {
  return (
    <ReplyCommentIdProvider>
      <Post />
    </ReplyCommentIdProvider>
  );
}
