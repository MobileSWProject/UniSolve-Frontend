import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import styles from "../../styles/form/PostCreateStyle";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { _fetchFormData, formFetch } from "../../api";
import Input from "./Input";
import * as ImagePicker from "expo-image-picker";
import SnackBar from "../Snackbar";
import { mainColor } from "../../constants/Colors";
import ModalView from "../../components/modal/ModalView";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";

import { useTranslation } from 'react-i18next';
import "../../i18n";

export default function PostCreate() {
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [image, setImage] = useState(null);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");

  const snackBar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const router = useRouter();

  // 버튼을 눌렀을 때 동작할 함수를 모아놓았습니다.
  const BtnHandleFunctions = {
    // 사진 촬영하기
    takePhoto: async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        console.log("Camera permissions not granted");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    },
    // 사진 첨부하기
    attachPhoto: async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.log("Media library permissions not granted");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    },
    // 바로 질문하기
    askQuestionImmediately: () => {
      setImage(null);
    },
  };

  // 이미지 및 폼 데이터 전송
  const handleSubmit = async () => {
    if (title.trim() === "" || content.trim() === "") {
      snackBar(`${t("Stage.failed")}${t("Function.empty")}`);
      return;
    }
    const data = new FormData();
    data.append("title", title);
    data.append("content", content);
    data.append("is_private", Number(isPrivate));

    if (image) {
      if (Platform.OS === "web") {
        data.append("image", image);
      } else {
        data.append("image", {
          uri: image,
          name: "image.jpg",
          type: "image/jpeg",
        });
      }
    }

    snackBar(`${t("Stage.process")}${t("Function.registering")}`);
    setSubmitLoading(true);
    try {
      const response = await formFetch("/posts", data);
      const postId = response.postId;
      setSubmitLoading(false);
      setTimeout(() => router.push(`/post/${postId}`));
    } catch (error) {
      console.log("Error during submission:", error);
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 401)
      ) {
        router.replace("/notfound");
      }
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <SnackBar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => setSnackbarVisible(false)}
      />
      <KeyboardAwareScrollView style={styles.container}>
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                flex: 1,
                left: 15,
                marginRight: 15,
                backgroundColor: isPrivate ? "#000" : mainColor,
              },
            ]}
            hitSlop={4}
            onPress={() => {
              setIsPrivate(!isPrivate);
            }}
          >
            <Text style={styles.submitButtonText}>
              {isPrivate ? t("Function.private") : t("Function.public")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitButton}
            hitSlop={4}
            onPress={handleSubmit}
            disabled={submitLoading}
          >
            <Text style={styles.submitButtonText}>{t("Function.regist")}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Input
            title={t("Function.title")}
            content={title}
            onChangeText={setTitle}
            maxLength={32}
          />
          <Input
            title={t("Function.content")}
            content={content}
            onChangeText={setContent}
            textArea={true}
          />
          <Text style={styles.textTo}>{t("Function.attachment")}</Text>
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={BtnHandleFunctions.takePhoto}
            >
              <Text style={styles.submitButtonText}>
                <FontAwesome name="camera" size={24} color="white" />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={BtnHandleFunctions.attachPhoto}
            >
              <Text style={styles.submitButtonText}>
                <FontAwesome name="photo" size={24} color="white" />
              </Text>
            </TouchableOpacity>
            {image && (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  setModalType("image");
                  setModalVisible(true);
                }}
              >
                <Text style={styles.submitButtonText}>
                  <Fontisto name="preview" size={24} color="white" />
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {modalVisible ? (
            <ModalView
              type={modalType}
              visible={modalVisible}
              setVisible={setModalVisible}
              image={{image, setImage}}
            />
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}
