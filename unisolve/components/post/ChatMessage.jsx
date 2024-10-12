import React from "react";
import { Text, View } from "react-native";


// 서버에서 만들어둔 send_message 라우터로 라우팅 필요합니다.
const ChatMessage = ({ me, message, user }) => {
  return (
    <View
      style={{
        flexDirection: me ? "row-reverse" : "row",
        gap: me ? 0 : 8,
        marginBottom: 20,
      }}
    >
      {/* 프로필 */}
      {!me && (
        <View
          style={{
            backgroundColor: "skyblue",
            width: 40,
            height: 40,
            borderRadius: 20,
          }}
        />
      )}
      <View
        style={{
          maxWidth: "64%",
          top: 4,
          gap: 8,
          alignItems: me ? "flex-end" : "flex-start",
        }}
      >
        {/* 유저 네임 */}
        {!me && <Text style={{ fontWeight: "600", fontSize: 16 }}>{user}</Text>}
        <View
          style={{
            backgroundColor: me ? "#fffacd" : "white",
            padding: 14,
            borderRadius: 12,
          }}
        >
          <Text>{message}</Text>
        </View>
      </View>
    </View>
  );
};

export default ChatMessage;