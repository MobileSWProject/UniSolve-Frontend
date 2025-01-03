import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";
import SyntaxHighlighter from "react-native-syntax-highlighter";
import { mainColor } from "../../constants/Colors";
import formatAuthor from "../../utils/formatAuthor";
import Input from "../../components/form/Input";
import { useTranslation } from "react-i18next";
import "../../i18n";

const CommentSection = ({
  ban,
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
  setEditComment,
  editComment,
  disabled,
}) => {
  const isReplying = selectedComment === comment.comment_id;
  const { t } = useTranslation();

  return (
    <View style={{ paddingTop: 2, paddingBottom: 8, borderBottomWidth: isReply ? 0 : 1, borderBottomColor: "#e0e0e0" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 28 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{formatAuthor(comment.author_nickname || `${comment.author_id}_temp_nickname`)}</Text>
        {comment.author_id.toLowerCase() === userId.toLowerCase() ? (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              disabled = {disabled}
              hitSlop={8}
              onPress={() => {handleUpdateComment(comment.comment_id);}}
            >
              <Text style={{ fontSize: 12 }}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled = {disabled}
              hitSlop={8}
              onPress={() => {handleRemoveComment(comment.comment_id);}}
            >
              <Text style={{ fontSize: 12 }}>❌</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            disabled = {disabled}
            hitSlop={8}
            onPress={() => handleReportComment(comment.comment_id)}
          >
            <Text style={{ fontSize: 12 }}>🚨</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={{ fontSize: 12, color: "#666", marginBottom: 5 }}>{comment.created_at}</Text>
      <Markdown style={{ body: { fontSize: 14 }, fence: { backgroundColor: "black", color: "white" }, code_inline: { backgroundColor: "opacity", border: "none", fontWeight: 700, padding: 0 }, }}
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
            {t("Function.reply")}
          </Text>
        </TouchableOpacity>
      )}

      {/* Input box for replying */}
      {isReplying && (
        <View style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }}>
          <Input
            placeholder={ban ? t("Function.forbidden") : t("Function.input_content")}
            content={replyComment}
            onChangeText={(text) => setReplyComment(text)}
            buttonDisabled={ban}
            buttonText={t("Function.regist")}
            buttonOnPress={() => handleAddComment(true)}
            disabled={ban}
            textArea={true}
            comment={true}
          />
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
              setEditComment={setEditComment}
              editComment={editComment}
            />
          </View>
        ))}
    </View>
  );
};

export default CommentSection;
