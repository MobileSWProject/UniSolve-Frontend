import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import Markdown from "react-native-markdown-display";
import SyntaxHighlighter from "react-native-syntax-highlighter";
import { mainColor } from "../../constants/Colors";
import formatAuthor from "../../utils/formatAuthor";

const CommentSection = ({
  comment,
  userId,
  handleUpdateComment,
  handleRemoveComment,
  handleReportComment,
  handleReply,
  handleAddComment,
  selectedComment,
  setSelectedComment,
  replyComment,
  setReplyComment,
  isReply = false,
}) => {
  const isReplying = selectedComment === comment.comment_id;

  return (
    <View
      style={{
        paddingTop: 2,
        paddingBottom: 8,
        borderBottomWidth: isReply ? 0 : 1,
        borderBottomColor: "#e0e0e0",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: 28,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          {formatAuthor(comment.author_id)}
        </Text>
        {comment.author_id.toLowerCase() === userId.toLowerCase() ? (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              hitSlop={8}
              onPress={() => handleUpdateComment(comment.comment_id)}
            >
              <Text style={{ fontSize: 12 }}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              hitSlop={8}
              onPress={() => handleRemoveComment(comment.comment_id)}
            >
              <Text style={{ fontSize: 12 }}>❌</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            hitSlop={8}
            onPress={() => handleReportComment(comment.comment_id)}
          >
            <Text style={{ fontSize: 12 }}>🚨</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={{ fontSize: 12, color: "#666", marginBottom: 5 }}>
        {comment.created_at}
      </Text>
      <Markdown
        style={{
          body: { fontSize: 14 },
          fence: { backgroundColor: "black", color: "white" },
        }}
        rules={{
          fence: (node) => {
            const language = node.sourceInfo || "text";
            const content = node.content || "";

            return (
              <ScrollView
                key={node.key}
                horizontal={true}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={true}
                style={{ width: "100%" }}
                contentContainerStyle={{
                  flexGrow: 1,
                  alignItems: "flex-start",
                }}
              >
                <View style={{ width: "100%", flexDirection: "row" }}>
                  <SyntaxHighlighter
                    key={node.key}
                    language={language}
                    highlighter={"prism"}
                    customStyle={{
                      width: "100%",
                      overflowX: "hidden",
                      overflowY: "hidden",
                    }}
                    pointerEvents="none"
                  >
                    {content}
                  </SyntaxHighlighter>
                </View>
              </ScrollView>
            );
          },
        }}
      >
        {comment.content}
      </Markdown>

      {/* Render the reply button only for top-level comments */}
      {!isReply && (
        <TouchableOpacity
          style={{
            paddingVertical: 6,
            paddingHorizontal: 8,
            backgroundColor: mainColor,
            borderRadius: 5,
            marginTop: 8,
            alignSelf: "flex-start",
          }}
          onPress={() => handleReply(comment)}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "bold" }}>
            답글 달기
          </Text>
        </TouchableOpacity>
      )}

      {/* Input box for replying */}
      {isReplying && (
        <View
          style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }}
        >
          <TextInput
            style={{
              flex: 1,
              height: 40,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 5,
              paddingHorizontal: 10,
              backgroundColor: "#fff",
            }}
            placeholder="댓글을 입력하세요..."
            placeholderTextColor={"black"}
            value={replyComment}
            onChangeText={(text) => setReplyComment(text)}
            multiline={true}
          />
          <TouchableOpacity
            style={{
              marginLeft: 10,
              backgroundColor: mainColor,
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 5,
            }}
            onPress={() => handleAddComment(true)}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>댓글 작성</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Render Replies */}
      {comment.replies &&
        comment.replies.map((reply) => (
          <View
            key={reply.comment_id}
            style={{
              marginLeft: 20,
              paddingLeft: 10,
              borderLeftWidth: 1,
              borderLeftColor: "#dcdcdc",
              marginTop: 10,
            }}
          >
            <CommentSection
              comment={reply}
              userId={userId}
              handleUpdateComment={handleUpdateComment}
              handleRemoveComment={handleRemoveComment}
              handleReportComment={handleReportComment}
              handleReply={handleReply}
              handleAddComment={handleAddComment}
              selectedComment={selectedComment}
              setSelectedComment={setSelectedComment}
              replyComment={replyComment}
              setReplyComment={setReplyComment}
              isReply={true} // Indicating this is a reply
            />
          </View>
        ))}
    </View>
  );
};

export default CommentSection;
