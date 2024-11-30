import React from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import Markdown from "react-native-markdown-display";
import SyntaxHighlighter from "react-native-syntax-highlighter";
import LevelImage from "../../components/tabs/me/LevelImage";
import { styles } from "../../styles/post/ChatStyle";
import { useTranslation } from "react-i18next";
import "../../i18n";

function markDown(content) {
  return (
    <Markdown
      rules={{
        fence: (node) => {
          const language = node.sourceInfo || "text";
          const markContent = node.content || "";
          return (
            <ScrollView
              key={node.key}
              horizontal={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={true}
              style={{ width: "100%" }}
              contentContainerStyle={{ flexGrow: 1, alignItems: "flex-start" }}
            >
              <View style={{ width: "100%", flexDirection: "row" }}>
                <SyntaxHighlighter
                  key={node.key}
                  language={language}
                  highlighter={"prism"}
                  customStyle={{ width: "100%", overflowX: "hidden", overflowY: "hidden" }}
                  pointerEvents="none"
                >
                  {markContent}
                </SyntaxHighlighter>
              </View>
            </ScrollView>
          );
        },
      }}
    >
      {content}
    </Markdown>
  )
}

const ChatMessage = ({ me, sender, content, sent_at, exp, setModalVisible, setModalType, setViewMessage }) => {
  const { t } = useTranslation();
  return (
    <View style={{ flexDirection: me ? "row-reverse" : "row", gap: me ? 0 : 8, marginBottom: 20, marginTop: 10 }}>
      {!me && <LevelImage exp={sender === "ai-bot" ? -1 : exp} size={42} />}
      <View style={{maxWidth: "64%", top: 4, gap: 8, alignItems: me ? "flex-end" : "flex-start" }}>
        {!me && <Text style={{ fontWeight: "600", fontSize: 16 }}>{sender}</Text>}
        <View style={{ backgroundColor: me ? "#fffacd" : "white", marginLeft: 5 }}>
          <ScrollView style={styles.messageContent}>
            {markDown(content)}
          </ScrollView>
          {
            content.length >= 300 ?
            <TouchableOpacity
              style={styles.messageContent}
              onPress={() => { setViewMessage(markDown(content)); setModalType("message"); setModalVisible(true); }}
            >
              <Text>{t("Function.message_view_btn")}</Text>
            </TouchableOpacity> :
            null
          }
          <View>
            <Text style={{ color: "#AAA", backgroundColor: me ? "#FFF" : null, display: "flex", marginLeft: !me ? "auto" : null}}>{sent_at}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ChatMessage;
