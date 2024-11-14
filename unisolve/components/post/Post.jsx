import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  useFocusEffect,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import Input from "../../components/form/Input";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
} from "react-native";
import styles from "../../styles/post/PostStyles";
import { useCallback, useState, useEffect } from "react";
import _axios from "../../api";
import LevelImage from "../../components/tabs/me/LevelImage";
import {
  ReplyCommentIdProvider,
  useReplyCommentId,
} from "../../components/post/ReplyCommentIdContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useUserId from "../../hooks/useUserId"; // 커스텀 훅 불러오기
import formatAuthor from "../../utils/formatAuthor";
import { mainColor } from "../../constants/Colors";
import CommentSection from "../../components/post/CommentSection";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useTranslation } from "react-i18next";
import "../../i18n";

const Post = ({ sheetRef, setMode, post, snackBar, getList }) => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);

  const [ban, setBan] = useState(false);

  const [newComment, setNewComment] = useState(""); // 새 댓글 내용 저장
  const [replyComment, setReplyComment] = useState(""); // 대댓글 내용 저장
  const [modalVisible, setModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [commentID, setCommentID] = useState(null);
  const [process, setProcess] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editing, setEditing] = useState(false);

  const [editPost, setEditPost] = useState(false);

  const { userId } = useUserId(); // 커스텀 훅으로 userId 불러오기
  const { selectedComment, setSelectedComment } = useReplyCommentId();

  const [isPrivate, setIsPrivate] = useState(false);

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
          .get(`/posts/${post}`)
          .then((response) => {
            setBan(response.data.data.ban);
            setData({
              id: response.data.data.id,
              private: Boolean(response.data.data.is_private),
              authorId: formatAuthor(response.data.data.author_id),
              nickname: formatAuthor(
                response.data.data.author_nickname ||
                  `${response.data.data.author_id}_temp_nickname`
              ),
              private: response.data.data.is_private,
              category: response.data.data.category,
              title: response.data.data.title,
              content: response.data.data.description,
              timestamp: response.data.data.timestamp,
              image: response.data.data.image,
              comments: response.data.data.comments,
              commentsCount: response.data.data.comments_count,
            });
          })
          .catch((error) => {
            router.replace("community");
          });
      };

      getData();
    }, [post])
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
        post_id: post,
        content: commentContent,
        parent_id: isReply ? selectedComment : null,
      });
      const response = await _axios.post("/comments", data);

      // 댓글 추가 후 댓글 목록만 다시 불러옴
      const updatedPost = await _axios.get(`/posts/${post}`);
      setData((prev) => ({
        ...prev,
        comments: updatedPost.data.data.comments,
        commentsCount: updatedPost.data.data.comments_count,
      }));
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
      const updatedPost = await _axios.get(`/posts/${post}`);
      setData((prev) => ({
        ...prev,
        comments: updatedPost.data.data.comments,
        commentsCount: updatedPost.data.data.comments_count,
      }));
    } catch { }
  };

  const handleUpdateComment = async (targetCommentId) => {
    try {
      const response = await _axios.put(`/comments/${targetCommentId}`, {
        content: editComment,
      });
      if (response.data.data.status === "success") {
        setEditComment("");
        setEditing(false);
        // 댓글 수정 후 댓글 목록만 다시 불러옴
        const updatedPost = await _axios.get(`/posts/${post}`);
        setData((prev) => ({
          ...prev,
          comments: updatedPost.data.data.comments,
          commentsCount: updatedPost.data.data.comments_count,
        }));
      }
      snackBar(t("Function.edit"));
    } catch { }
  };

  const handleReport = async () => {
    if (reportReason.length < 1 || process) return;
    try {
      setProcess(true);
      const response = await _axios.post(`/reports`, {
        post_id: post,
        comment_id: commentID || null,
        reason: reportReason,
      });
      setProcess(false);
      setModalVisible(false);
      setCommentID(null);
      if (response.data.status === "success") {
        setReportReason("");
        snackBar(t("Function.report_success"));
      }
    } catch (error) {
      setProcess(false);
      setModalVisible(false);
      snackBar(t("Function.report_failed"));
    }
  };

  // comment_id를 선택한 후 대댓글 초기화는 useEffect에서 처리
  const handleReply = (comment) => {
    setSelectedComment(comment.comment_id);
  };

  const handleRemovePost = async () => {
    try {
      const response = await _axios.delete(`/posts/${post}`);
      if (response) {
        sheetRef.current?.collapse();
        snackBar(t("Function.delete_success"));
        getList(1, null, null);
      } else {
        snackBar(t("Function.delete_failed"));
      }
    } catch { snackBar(t("Function.delete_failed")); }
  };

  const handleUpdatePost = async () => {
    try {
      if (editTitle.length < 1 || editContent.length < 1 || process) return;
      setModalVisible(false);
      setEditTitle("");
      setEditContent("");
      setEditing(false);
      setProcess(true);
      setIsPrivate(false);
      const response = await _axios.put(`/posts/${post}`, {
        title: editTitle,
        content: editContent,
        toggle_privacy: isPrivate,
      });
      if (response.data.status === "success") {
        // 게시글 수정 후 다시 불러오기
        const updatedPost = await _axios.get(`/posts/${post}`);
        setData((prev) => ({
          ...prev,
          private: updatedPost.data.data.is_private,
          title: updatedPost.data.data.title,
          content: updatedPost.data.data.description,
          timestamp: updatedPost.data.data.timestamp,
          comments: updatedPost.data.data.comments,
          commentsCount: updatedPost.data.data.comments_count,
        }));
      }
      snackBar(t("Function.edit"));
      setProcess(false);
    } catch (error) {
      setProcess(false);
    }
  };

  if (!data) {
    return <></>;
  }

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <LevelImage exp={2} size={36} />
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.userInfo}>{formatAuthor(data.nickname)}</Text>
              <Text style={styles.userInfo}>{data.timestamp}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            {formatAuthor(data.authorId) === formatAuthor(userId) ? (
              <>
                <TouchableOpacity
                  onPress={() => { setMode("chat"); }}
                  hitSlop={4}
                >
                  <Entypo name="chat" size={30} color={mainColor} />
                </TouchableOpacity>
                <TouchableOpacity
                  hitSlop={8}
                  onPress={() => {
                    setEditPost(true);
                    setEditTitle(data.title);
                    setEditContent(data.content);
                    setModalVisible(true);
                  }}
                >
                  <Text style={{ fontSize: 24 }}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  hitSlop={8}
                  onPress={() => handleRemovePost()}
                >
                  <Text style={{ fontSize: 24 }}>❌</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                hitSlop={8}
                onPress={() => {
                  setEditPost(false);
                  setModalVisible(true);
                }}
              >
                <Text style={{ fontSize: 24 }}>🚨</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.categoryContainer}>
        <Text style={styles.category}>
            <MaterialIcons name="category" size={15} color="#AAA" />
            {data.category}
          </Text>
          <Text style={styles.category}>
            <MaterialIcons name={data.private ? "lock" : "lock-open"} size={15} color="#AAA" />
            {data.private ? t("Function.private") : t("Function.public")}
          </Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{data.title}</Text>
        </View>
        <Text style={styles.content}>{data.content}</Text>
        {data.image && (
          <Image source={{ uri: data.image }} style={styles.image} />
        )}
      </View>

      {/* 댓글 렌더링 */}
      <View style={styles.commentContainer}>
        <Text style={styles.commentTitle}>
          {t("Function.comment")} {data.commentsCount}
          {t("Function.count")}
        </Text>
        <View style={styles.commentInputContainer}>
          <Input
            placeholder={
              ban ? t("Function.forbidden") : t("Function.input_content")
            }
            content={newComment}
            onChangeText={(text) => setNewComment(text)}
            buttonDisabled={ban}
            buttonText={t("Function.regist")}
            buttonOnPress={() => handleAddComment(false)}
            disabled={ban}
            textArea={true}
          />
        </View>
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
                  {data.private ? 
                    <View style={styles.submitContainer}>
                    <TouchableOpacity
                      style={{
                        height: 30,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                      hitSlop={4}
                      onPress={() => {
                        setIsPrivate(!isPrivate);
                      }}
                    >
                      <MaterialCommunityIcons
                        name={isPrivate ? "checkbox-marked" : "checkbox-blank-outline"}
                        size={24}
                        color="black"
                      />
                      <Text style={{}}>{`${t("Function.public")}로 전환하기(전환 후 비공개로 변경 불가)`}</Text>
                    </TouchableOpacity>
                  </View> : null}
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
                <Text style={styles.buttonTextSmall}>
                  {t("Function.cancel")}
                </Text>
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
    </KeyboardAwareScrollView>
  );
};

export default function PostWithReplyCommentIdProvider({ sheetRef, setMode, post, snackBar, getList }) {
  return (
    <ReplyCommentIdProvider>
      <Post sheetRef = {sheetRef} setMode = {setMode} post={post} snackBar={snackBar} getList={getList}/>
    </ReplyCommentIdProvider>
  );
}
