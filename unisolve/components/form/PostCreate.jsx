import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import styles from "../../styles/form/PostCreateStyle";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { _fetchFormData, formFetch } from "../../api";
import Input from "./Input";
import * as ImagePicker from "expo-image-picker";
import { mainColor } from "../../constants/Colors";
import ModalView from "../../components/modal/ModalView";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import DropDownPicker from "react-native-dropdown-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useTranslation } from "react-i18next";
import "../../i18n";

export default function PostCreate({ setMode, setPost, snackBar, categorys }) {
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const [items, setItems] = useState(categorys);
  const [category, setCategory] = useState("");

  const [image, setImage] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");

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
    data.append("category", value);

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
      snackBar(`${t("Stage.success")}${t("Function.register_success")}`);
      setSubmitLoading(false);
      setTimeout(() => {
        setPost(postId);
        setMode("post");
      });
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
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{}}
      >
        {/* [카메라, 사진, 사진보기 그룹] */}
        <View style={{ marginTop: 5, alignItems: "center" }}>
          <View style={{ width: "93%", flexDirection: "row", gap: 10 }}>
            {/* 카메라 버튼 */}
            <TouchableOpacity
              style={[styles.submitButton, { height: 60, width: 60 }]}
              onPress={BtnHandleFunctions.takePhoto}
            >
              <Text style={styles.submitButtonText}>
                <FontAwesome
                  name="camera"
                  size={24}
                  color="white"
                />
              </Text>
            </TouchableOpacity>
            {/* 사진 버튼 */}
            <TouchableOpacity
              style={[styles.submitButton, { height: 60, width: 60 }]}
              onPress={BtnHandleFunctions.attachPhoto}
            >
              <Text style={styles.submitButtonText}>
                <FontAwesome
                  name="photo"
                  size={24}
                  color="white"
                />
              </Text>
            </TouchableOpacity>
            {/* 사진 확인 버튼 */}
            {image && (
              <TouchableOpacity
                style={[styles.submitButton, { height: 60, width: 60 }]}
                onPress={() => {
                  setModalType("image");
                  setModalVisible(true);
                }}
              >
                <Text style={styles.submitButtonText}>
                  <Fontisto
                    name="preview"
                    size={24}
                    color="white"
                  />
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{ alignItems: "center" }}>
          {/* 제목 */}
          <Input
            title={t("Function.title")}
            content={title}
            onChangeText={setTitle}
            maxLength={32}
          />
          <View style={{ marginTop: 30 }} />
          {/* 카테고리 */}
          <View style={{ width: "93%" }}>
            <DropDownPicker
              style={{ borderWidth: 1.4 }}
              open={open}
              value={value}
              items={items}
              placeholder={t("Function.category")}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              maxHeight={200}
              onChangeValue={(value) => {
                setCategory(value);
              }}
            />
          </View>

          {/* 내용 */}
          <Input
            title={t("Function.content")}
            content={content}
            onChangeText={setContent}
            textArea={true}
          />
          <View style={{ marginTop: 10 }} />
          <View style={styles.submitContainer}>
            {/* 공개 비공개 토글 버튼 */}
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
              <Text style={{}}>{`${t("Function.private")}로 질문하기`}</Text>
              {/* <Text style={styles.submitButtonText}>
                {isPrivate ? t("Function.private") : t("Function.public")}
              </Text> */}
            </TouchableOpacity>
            <View style={{ marginTop: 10 }} />
            {/* 등록 버튼 */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                { alignSelf: "stretch", width: "100%" },
              ]}
              hitSlop={4}
              onPress={handleSubmit}
              disabled={submitLoading}
            >
              <Text style={styles.submitButtonText}>
                {t("Function.regist")}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: 30 }} />

          {modalVisible ? (
            <ModalView
              type={modalType}
              visible={modalVisible}
              setVisible={setModalVisible}
              image={{ image, setImage }}
            />
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}
