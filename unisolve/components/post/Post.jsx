import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import Input from "../../components/form/Input";
import { Image, Text, TouchableOpacity, View, RefreshControl} from "react-native";
import styles from "../../styles/post/PostStyles";
import { useCallback, useState, useEffect } from "react";
import _axios from "../../api";
import LevelImage from "../../components/tabs/me/LevelImage";
import { ReplyCommentIdProvider, useReplyCommentId } from "../../components/post/ReplyCommentIdContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useUserId from "../../hooks/useUserId"; // 커스텀 훅 불러오기
import formatAuthor from "../../utils/formatAuthor";
import { mainColor } from "../../constants/Colors";
import CommentSection from "../../components/post/CommentSection";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTranslation } from "react-i18next";
import "../../i18n";

const Post = ({sheetRef, setMode, post, snackBar, getList, modalVisible, setModalVisible, setModalType, setComment}) => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [ban, setBan] = useState(false);
  const [process, setProcess] = useState(false);
  const [newComment, setNewComment] = useState(""); // 새 댓글 내용 저장
  const [replyComment, setReplyComment] = useState(""); // 대댓글 내용 저장
  const [editComment, setEditComment] = useState("");
  const { userId } = useUserId(); // 커스텀 훅으로 userId 불러오기
  const { selectedComment, setSelectedComment } = useReplyCommentId();
  const [isRefreshing, setIsRefreshing] = useState(false); // 새로고침 상태 관리
  const router = useRouter();
  // selectedComment가 변경될 때마다 replyComment 초기화
  useEffect(() => {
    if (selectedComment) {
      setReplyComment(""); // selectedComment가 변경될 때만 실행
    }
  }, [selectedComment]);

  useEffect(() => {
    getData();
  }, [post]);

  const getData = async () => {
    if (process) return;
    setProcess(true);

    try {
      const response = await _axios.get(`/posts/${post}`);
      setProcess(false);
      setBan(response.data.data.ban);
      setData({
        id: response.data.data.id,
        exp: response.data.data.exp,
        private: Boolean(response.data.data.is_private),
        authorId: formatAuthor(response.data.data.author_id || null),
        nickname: formatAuthor(response.data.data.author_nickname || `@undefined`),
        authorExp: response.data.data.author_exp,
        private: response.data.data.is_private,
        category: response.data.data.category,
        title: response.data.data.title,
        content: response.data.data.description,
        timestamp: response.data.data.timestamp,
        image: response.data.data.image,
        comments: response.data.data.comments,
        commentsCount: response.data.data.comments_count,
        matched: {
          nickname: response.data.data.matched_nickname,
          status: response.data.data.matched_status,
        },
      });
    } catch (error) {
      setProcess(false);
      router.replace("community");
    }
  };

  // 댓글 또는 대댓글 추가 로직
  const handleAddComment = async (isReply) => {
    const commentContent = isReply ? replyComment : newComment;
    if (!commentContent || process) return;
    try {
      setProcess(true);
      snackBar(`${t("Stage.process")} ${t("Function.registering")}`);
      let data = JSON.stringify({
        post_id: post,
        content: commentContent,
        parent_id: isReply ? selectedComment : null,
      });
      await _axios.post("/comments", data);
      // 댓글 추가 후 댓글 목록만 다시 불러옴
      const updatedPost = await _axios.get(`/posts/${post}`);
      setData((prev) => ({
        ...prev,
        comments: updatedPost.data.data.comments,
        commentsCount: updatedPost.data.data.comments_count,
      }));
      setProcess(false);
      snackBar(`${t("Stage.success")} ${t("Function.register_success")}`);
    } catch {
      snackBar(`${t("Stage.failed")} ${t("Function.register_failed")}`);
      setProcess(false);
    } finally {
      setNewComment("");
      setReplyComment("");
      setSelectedComment(null);
    }
  };

  const handleRemoveComment = async (targetCommentId) => {
    try {
      if (process) return;
      setProcess(true);
      snackBar(`${t("Stage.process")} ${t("Function.deleting")}`);
      await _axios.delete(`/comments/${targetCommentId}`);
      // 댓글 삭제 후 댓글 목록만 다시 불러옴
      const updatedPost = await _axios.get(`/posts/${post}`);
      setData((prev) => ({
        ...prev,
        comments: updatedPost.data.data.comments,
        commentsCount: updatedPost.data.data.comments_count,
        matched: {nickname: updatedPost.data.data.matched_nickname, status: updatedPost.data.data.matched_status}
      }));
      setProcess(false);
      snackBar(`${t("Stage.success")} ${t("Function.delete_success")}`);
    } catch {
      snackBar(`${t("Stage.failed")} ${t("Function.delete_failed")}`);
      setProcess(false);
    }
  };

  // comment_id를 선택한 후 대댓글 초기화는 useEffect에서 처리
  const handleReply = (commentData) => {
    setSelectedComment(commentData.comment_id);
  };

  const handleRemovePost = async () => {
    try {
      if (process) return;
      setProcess(true);
      const response = await _axios.delete(`/posts/${post}`);
      setProcess(false);
      if (response) {
        sheetRef.current?.close();
        snackBar(`${t("Stage.success")} ${t("Function.delete_success")}`);
        getList(1, null, null);
      } else {
        snackBar(`${t("Stage.failed")} ${t("Function.delete_failed")}`);
      }
    } catch {
      setProcess(false);
      snackBar(`${t("Stage.failed")} ${t("Function.delete_failed")}`);
    }
  };

  if (!data) {
    return <></>;
  }

  return (
    <KeyboardAwareScrollView style={styles.container} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={getData} />}>
      <View style={styles.contentContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
          <View style={{ flexDirection: "row" }}>
            <LevelImage exp={data.authorExp} size={42} />
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.userInfo}>{formatAuthor(data.nickname)}</Text>
              <Text style={styles.userInfo}>{data.timestamp}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            {formatAuthor(data.authorId) === formatAuthor(userId) ? (
              <>
                <TouchableOpacity
                  disabled={!data.private || data.matched.nickname && data.matched.nickname.length > 0}
                  onPress={() => { setModalType("user"); setModalVisible(true); }}
                  hitSlop={4}
                >
                  <FontAwesome name="user" size={30} color={!data.private || data.matched.nickname ? "gray" : mainColor}/>
                  <Text>{`${data.matched.nickname ? data.matched.nickname : ""}${data.matched.nickname && !data.matched.status ? t("Function.matching_go") : "" }`}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginLeft: 5, marginRight: 5 }}
                  onPress={() => { setMode("chat");}}
                  hitSlop={4}
                >
                  <Entypo name="chat" size={30} color={mainColor} />
                </TouchableOpacity>
                <TouchableOpacity
                  hitSlop={8}
                  onPress={() => {
                    if (ban) {
                      snackBar(`${t("Stage.failed")} ${t("Function.sanction_write")}`);
                    }
                    else {
                      setMode("edit");
                    }
                  }}
                >
                  <Text style={{ fontSize: 24, color: "#fff"}}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  hitSlop={8}
                  onPress={() => handleRemovePost()}
                >
                  <Text style={{ fontSize: 24 }}>❌</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={{ marginLeft: 8 }}
                  onPress={() => { setMode("chat"); }}
                  hitSlop={4}
                >
                  <Entypo name="chat" size={30} color={mainColor} />
                </TouchableOpacity>
                <TouchableOpacity
                  hitSlop={8}
                  onPress={() => {
                    setComment(null);
                    setModalType("report");
                    setModalVisible(true);
                  }}
                >
                  <Text style={{ fontSize: 24 }}>🚨</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>
            <MaterialIcons name="category" size={15} color="#AAA" />
            {data.category}
          </Text>
          <Text style={styles.category}>
            <MaterialIcons
              name={data.private ? "lock" : "lock-open"}
              size={15}
              color="#AAA"
            />
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
            placeholder={ban ? t("Function.forbidden") : t("Function.input_content")}
            content={newComment}
            onChangeText={(text) => setNewComment(text)}
            buttonDisabled={ban || process}
            buttonText={t("Function.regist")}
            buttonOnPress={() => handleAddComment(false)}
            disabled={ban || process}
            textArea={true}
          />
        </View>
        {data.comments.map((commentData, index) => (
          <CommentSection
            disabled={process}
            ban={ban}
            key={commentData.comment_id}
            comment={commentData}
            userId={userId}
            handleUpdateComment={(commentId) => {
              setComment(commentId);
              setModalType("comment");
              setModalVisible(true);
            }}
            handleRemoveComment={handleRemoveComment}
            handleReportComment={(commentId) => {
              setComment(commentId);
              setModalType("report");
              setModalVisible(true);
            }}
            handleReply={handleReply}
            handleAddComment={handleAddComment}
            selectedComment={selectedComment}
            setSelectedComment={setSelectedComment}
            replyComment={replyComment}
            setReplyComment={setReplyComment}
            isReply={false} // Top-level comment, not a reply
            setEditComment={setEditComment}
            editComment={editComment}
          />
        ))}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default function PostWithReplyCommentIdProvider({
  sheetRef,
  setMode,
  post,
  snackBar,
  getList,
  modalVisible,
  setModalVisible,
  modalType,
  setModalType,
  setComment,
}) {
  return (
    <ReplyCommentIdProvider>
      <Post
        sheetRef={sheetRef}
        setMode={setMode}
        post={post}
        snackBar={snackBar}
        getList={getList}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        modalType={modalType}
        setModalType={setModalType}
        setComment={setComment}
      />
    </ReplyCommentIdProvider>
  );
}
