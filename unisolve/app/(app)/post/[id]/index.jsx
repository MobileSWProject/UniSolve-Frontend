import { Ionicons } from "@expo/vector-icons";
import {
  useFocusEffect,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "../../../../styles/post/PostStyles";
import { useCallback, useState } from "react";
import _axios from "../../../../api";

const Post = () => {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState(null);

  const pathname = usePathname();
  const router = useRouter();

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

  if (!data) {
    return <></>;
  }

  const renderReplies = (replies) => {
    return replies.map((reply, index) => (
      <View
        key={index}
        style={styles.replyItem} // 대댓글 스타일 적용
      >
        <View style={styles.replyIndent}>
          <Text style={styles.replyUser}>{reply.author_id}</Text>
          <Text style={styles.replyTimestamp}>{reply.created_at}</Text>
          <Text style={styles.replyContent}>{reply.content}</Text>
        </View>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
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
      <View style={styles.chatButtonContainer}>
        <TouchableOpacity
          onPress={() => router.push(`${pathname}/chat`)}
          style={styles.chatButtonTouchArea}
          hitSlop={4}
        >
          <Text style={styles.chatButtonText}>비공개 채팅</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.commentContainer}>
        <Text style={styles.commentTitle}>댓글 {data.commentsCount}개</Text>
        {data.comments.map((comment, index) => (
          <View
            key={index}
            style={styles.commentItem} // 댓글 스타일 적용
          >
            <Text style={styles.commentUser}>{comment.author_id}</Text>
            <Text style={styles.commentTimestamp}>{comment.created_at}</Text>
            <Text style={styles.commentContent}>{comment.content}</Text>

            {/* 하위 댓글 렌더링 */}
            {comment.replies && comment.replies.length > 0 && (
              <View style={styles.repliesContainer}>
                {renderReplies(comment.replies)}
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Post;
