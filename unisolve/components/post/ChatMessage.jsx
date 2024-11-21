import React from "react";
import { Text, View } from "react-native";

const ChatMessage = ({ me, sender, content, sent_at }) => {
  return (
    <View style={{ flexDirection: me ? "row-reverse" : "row", gap: me ? 0 : 8, marginBottom: 20 }}>
      {!me && <View style={{ backgroundColor: "skyblue", width: 40, height: 40, borderRadius: 20 }}/>}
      <View style={{maxWidth: "64%", top: 4, gap: 8, alignItems: me ? "flex-end" : "flex-start" }}>
        {!me && <Text style={{ fontWeight: "600", fontSize: 16 }}>{sender}</Text>}
        <View style={{ backgroundColor: me ? "#fffacd" : "white", padding: 14, borderRadius: 12 }}>
          <Text>{content}</Text>
        </View>
        <Text>{sent_at}</Text>
      </View>
    </View>
  );
};

export default ChatMessage;
