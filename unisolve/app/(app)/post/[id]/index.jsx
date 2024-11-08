import { Ionicons } from "@expo/vector-icons";
import {
  useFocusEffect,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
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
import formatAuthor from "../../../../utils/formatAuthor";
import { mainColor } from "../../../../constants/Colors";
import { Snackbar, Provider as PaperProvider } from "react-native-paper";
import CommentSection from "../../../../components/post/CommentSection";

import { useTranslation } from 'react-i18next';
import "../../../../i18n";

const Post = () => {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const [data, setData] = useState(null);

  const [ban, setBan] = useState(false);

  const [newComment, setNewComment] = useState(""); // 새 댓글 내용 저장
  const [replyComment, setReplyComment] = useState(""); // 대댓글 내용 저장
  const [modalVisible, setModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [commentID, setCommentID] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [process, setProcess] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editing, setEditing] = useState(false);

  const [editPost, setEditPost] = useState(false);

  const { userId } = useUserId(); // 커스텀 훅으로 userId 불러오기
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
          .get(`/posts/${id}`)
          .then((response) => {
            setBan(response.data.ban);
            setData({
              id: response.data.id,
              private: Boolean(response.data.is_private),
              authorId: formatAuthor(response.data.author_id),
              nickname: formatAuthor(
                response.data.author_nickname ||
                  `${response.data.author_id}_temp_nickname`
              ),
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
      const response = await _axios.post("/comments", data);

      // 댓글 추가 후 댓글 목록만 다시 불러옴
      const updatedPost = await _axios.get(`/posts/${id}`);
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
      const response = await _axios.delete(`/comments/${targetCommentId}`);

      // 댓글 삭제 후 댓글 목록만 다시 불러옴
      const updatedPost = await _axios.get(`/posts/${id}`);
      setData((prev) => ({
        ...prev,
        comments: updatedPost.data.comments,
        commentsCount: updatedPost.data.comments_count,
      }));
    } catch (error) {
      // "something error 😭"
      console.log("Something Error 😭");
    }
  };

  const handleUpdateComment = async (targetCommentId) => {
    try {
      const response = await _axios.put(`/comments/${targetCommentId}`, {
        content: editComment,
      });
      if (response.data.status === "success") {
        setEditComment("");
        setEditing(false);
        // 댓글 수정 후 댓글 목록만 다시 불러옴
        const updatedPost = await _axios.get(`/posts/${id}`);
        setData((prev) => ({
          ...prev,
          comments: updatedPost.data.comments,
          commentsCount: updatedPost.data.comments_count,
        }));
      }
      setSnackbarVisible(true);
      setSnackbarMessage(t("Function.edit"));
    } catch (error) {
      // "something error 😭"
      console.log("Something Error 😭");
    }
  };

  const handleReport = async () => {
    if (reportReason.length < 1 || process) return;
    try {
      setProcess(true);
      const response = await _axios.post(`/reports`, {
        post_id: id,
        comment_id: commentID || null,
        reason: reportReason,
      });
      setProcess(false);
      setModalVisible(false);
      setCommentID(null);
      if (response.data.status === "success") {
        setReportReason("");
        setSnackbarMessage(t("Function.report_success"));
        setSnackbarVisible(true);
      }
    } catch (error) {
      setProcess(false);
      setModalVisible(false);
      setSnackbarMessage(t("Function.report_failed"));
      setSnackbarVisible(true);
    }
  };

  // comment_id를 선택한 후 대댓글 초기화는 useEffect에서 처리
  const handleReply = (comment) => {
    setSelectedComment(comment.comment_id);
  };

  const handleRemovePost = async () => {
    try {
      const response = await _axios.delete(`/posts/${id}`);

      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/community");
      }
    } catch (error) {
      // "something error 😭"
      console.log("Something Error 😭");
    }
  };

  const handleUpdatePost = async () => {
    try {
      if (editTitle.length < 1 || editContent.length < 1 || process) return;
      setModalVisible(false);
      setEditTitle("");
      setEditContent("");
      setEditing(false);
      setProcess(true);
      const response = await _axios.put(`/posts/${id}`, {
        title: editTitle,
        content: editContent,
      });
      if (response.data.status === "success") {
        // 게시글 수정 후 다시 불러오기
        const updatedPost = await _axios.get(`/posts/${id}`);
        setData((prev) => ({
          ...prev,
          title: updatedPost.data.title,
          content: updatedPost.data.description,
          timestamp: updatedPost.data.timestamp,
          comments: updatedPost.data.comments,
          commentsCount: updatedPost.data.comments_count,
        }));
      }
      setSnackbarMessage(t("Function.edit"));
      setSnackbarVisible(true);
      setProcess(false);
    } catch (error) {
      setProcess(false);
      console.log("Something Error 😭");
    }
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            minHeight: 30,
          }}
        >
          <Text style={styles.title}>{data.title}</Text>
          {formatAuthor(data.authorId) === formatAuthor(userId) ? (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                hitSlop={8}
                onPress={() => {
                  setEditPost(true);
                  setEditTitle(data.title);
                  setEditContent(data.content);
                  setModalVisible(true);
                }}
              >
                <Text style={{ fontSize: 12 }}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                hitSlop={8}
                onPress={() => handleRemovePost()}
              >
                <Text style={{ fontSize: 12 }}>❌</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              hitSlop={8}
              onPress={() => {
                setEditPost(false);
                setModalVisible(true);
              }}
            >
              <Text style={{ fontSize: 12 }}>🚨</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.privateStatusContainer}>
          <Ionicons
            name={data.private ? "lock-closed" : "earth-sharp"}
            size={16}
            color="#666"
            style={styles.privateStatusIcon}
          />
          <Text style={styles.privateStatusText}>
            {data.private ? t("Function.private") : t("Function.public")}
          </Text>
        </View>
        <Text style={styles.userInfo}>
          {formatAuthor(data.nickname)} • {data.timestamp}
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
          <Text style={styles.chatButtonText}>{t("Function.chat")}</Text>
        </TouchableOpacity>
      </View>

      {/* 게시글 댓글 입력 필드 */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={[styles.commentInput, {backgroundColor: ban ? "#ccc" : "#fff"}]}
          placeholder={ban ? t("Function.forbidden") : t("Function.input_content")}
          placeholderTextColor={"black"}
          value={newComment}
          onChangeText={(text) => setNewComment(text)}
          multiline={true}
          disabled={ban}
        />
        <TouchableOpacity
          style={[styles.commentButton, {backgroundColor: ban ? "#ccc" : mainColor}]}
          onPress={() => handleAddComment(false)}
          disabled={ban}
        >
          <Text style={styles.commentButtonText}>{t("Function.regist")}</Text>
        </TouchableOpacity>
      </View>

      {/* 댓글 렌더링 */}
      <View style={styles.commentContainer}>
        <Text style={styles.commentTitle}>{t("Function.comment")} {data.commentsCount}{t("Function.count")}</Text>
        {data.comments.map((comment, index) => (
          <CommentSection
            ban={ban}
            key={comment.comment_id}
            comment={comment}
            userId={userId}
            handleUpdateComment={handleUpdateComment}
            handleRemoveComment={handleRemoveComment}
            handleReportComment={(commentId) => {
              setEditPost(false);
              setModalVisible(true);
              setCommentID(commentId);
            }}
            handleReply={handleReply}
            handleAddComment={handleAddComment}
            selectedComment={selectedComment}
            setSelectedComment={setSelectedComment}
            replyComment={replyComment}
            setReplyComment={setReplyComment}
            isReply={false} // Top-level comment, not a reply
            setEditComment={setEditComment}
            setEditing={setEditing}
            editing={editing}
            editComment={editComment}
          />
        ))}

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setCommentID(null);
            setModalVisible(false);
            setEditTitle("");
            setEditContent("");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {editPost ? (
                <>
                  <TextInput
                    style={styles.commentInput}
                    placeholder={t("Function.title")}
                    value={editTitle}
                    onChangeText={(text) => setEditTitle(text)}
                    multiline={true}
                  />
                  <TextInput
                    style={styles.commentInput}
                    placeholder={t("Function.content")}
                    value={editContent}
                    onChangeText={(text) => setEditContent(text)}
                    multiline={true}
                  />
                </>
              ) : (
                <TextInput
                  style={styles.commentInput}
                  placeholder={t("Function.input_content")}
                  value={reportReason}
                  onChangeText={(text) => setReportReason(text)}
                  multiline={true}
                />
              )}
              <TouchableOpacity
                disabled={false}
                style={[
                  styles.buttonSmall,
                  { backgroundColor: false ? "gray" : mainColor },
                ]}
                onPress={() => {
                  setCommentID(null);
                  setModalVisible(false);
                  setEditTitle("");
                  setEditContent("");
                }}
              >
                <Text style={styles.buttonTextSmall}>{t("Function.cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={false}
                style={[
                  styles.buttonSmall,
                  { backgroundColor: false ? "gray" : mainColor },
                ]}
                onPress={() => {
                  editPost ? handleUpdatePost() : handleReport();
                }}
              >
                <Text style={styles.buttonTextSmall}>
                  {editPost ? t("Function.btn_edit") : t("Function.btn_report")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      {snackbarVisible ? (
        <View style={styles.snackbarContainer}>
          <Snackbar
            style={styles.snackbar}
            visible={snackbarVisible}
            onDismiss={() => {
              setSnackbarVisible(false);
              setSnackbarMessage("");
            }}
            duration={2000}
          >
            {snackbarMessage}
          </Snackbar>
        </View>
      ) : (
        <></>
      )}
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
