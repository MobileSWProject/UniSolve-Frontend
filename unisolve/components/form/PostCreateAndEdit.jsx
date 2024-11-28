import { useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import styles from "../../styles/form/PostCreateStyle";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { _fetchFormData, formFetch } from "../../api";
import Input from "./Input";
import * as ImagePicker from "expo-image-picker";
import ModalView from "../modal/ModalView";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import DropDownPicker from "react-native-dropdown-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";
import _axios from "../../api";
import "../../i18n";
import { mainColor } from "../../constants/Colors";

export default function PostCreateAndEdit({ mode, setMode, post, setPost, snackBar, categorys }) {
  const { t } = useTranslation();
  const [process, setProcess] = useState(false);
  const [Private, setPrivate] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const router = useRouter();

  useEffect(()=>{
    setItems([...categorys])
  },[categorys])

  useFocusEffect(
    useCallback(() => {
      if (mode === "edit") {
        const getData = async () => {
          await _axios.get(`/posts/${post}`).then((response) => {
            setTitle(response.data.data.title);
            setContent(response.data.data.description);
            setImage(response.data.data.image);
            setPrivate(response.data.data.is_private);
          })
          .catch(() => {
            setMode("post");
          });
        };
        getData();
      }
    }, [])
  );

  const handleUpdate = async () => {
    try {
      if (title.length < 1 || content.length < 1 || process) return;
      setProcess(true);      
      const response = await _axios.put(`/posts/${post}`, {
        title: title,
        content: content,
        toggle_privacy: isPrivate,
        image: image
      });
      setProcess(false);
      if (response.data.status === "success") {
        snackBar(t("Function.edit"));
        setMode("post");
      } else {
        snackBar(t("Function.edit_failed"));
        setProcess(false);
      }
    } catch (error) {
      snackBar(t("Function.edit_failed"));
      setProcess(false);
    }
  };

  // 버튼을 눌렀을 때 동작할 함수를 모아놓았습니다.
  const BtnHandleFunctions = {
    // 사진 촬영하기
    takePhoto: async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        snackBar(t("Function.permission_camera"));
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
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        snackBar(t("Function.permission_image"));
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
    if (!value || value <= 0) {
      snackBar(`${t("Stage.failed")}${t("Function.empty_category")}`);
      return;
    }
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
        data.append("image", { uri: image, name: "image.jpg", type: "image/jpeg" });
      }
    }

    snackBar(`${t("Stage.process")}${t("Function.registering")}`);
    setProcess(true);
    try {
      const response = await formFetch("/posts", data);
      const postId = response.postId;
      snackBar(`${t("Stage.success")}${t("Function.register_success")}`);
      setTimeout(() => { setPost(postId); setMode("post"); setProcess(false); }, 2000);
    } catch {
      snackBar(t("User.error"));
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        router.replace("/notfound");
      }
      setProcess(false);
    }
  };

  return (
    <>
      <KeyboardAwareScrollView style={styles.container} contentContainerStyle={{}}>
        {/* [카메라, 사진, 사진보기 그룹] */}
        <View style={{ marginTop: 5, alignItems: "center" }}>
          <View style={{ width: "93%", flexDirection: "row", gap: 10 }}>
          { mode !== "edit" ?
            <>
              {/* 카메라 버튼 */} 
              <TouchableOpacity style={[styles.submitButton, { height: 60, width: 60 }]} onPress={BtnHandleFunctions.takePhoto}>
                <Text style={styles.submitButtonText}>
                  <FontAwesome name="camera" size={24} color="white"/>
                </Text>
              </TouchableOpacity>
              {/* 사진 버튼 */}
              <TouchableOpacity style={[styles.submitButton, { height: 60, width: 60 }]} onPress={BtnHandleFunctions.attachPhoto} >
                <Text style={styles.submitButtonText}>
                  <FontAwesome name="photo" size={24} color="white"/>
                </Text>
              </TouchableOpacity> 
            </> :
            null
          }
            {/* 사진 확인 버튼 */}
            {
              image &&
                <TouchableOpacity style={[styles.submitButton, { height: 60, width: 60 }]} onPress={() => { setModalType("image"); setModalVisible(true); }}>
                  <Text style={styles.submitButtonText}>
                    <Fontisto name="preview" size={24} color="white"/>
                  </Text>
                </TouchableOpacity>
            }
          </View>
        </View>

        <View style={{ alignItems: "center" }}>
          {/* 제목 */}
          <Input title={t("Function.title")} content={title} onChangeText={setTitle} maxLength={32}/>
          <View style={{ marginTop: 30 }} />
          {/* 카테고리 */}
          { 
            mode !== "edit" ? 
            <View style={{ width: "93%", zIndex: 99 }}>
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
                onChangeValue={(value) => { setCategory(value); }}
                listMode="SCROLLVIEW"
              />
            </View> :
            null
          }
          {/* 내용 */}
          <Input title={t("Function.content")} content={content} onChangeText={setContent} textArea={true}/>
          <View style={{ marginTop: 10 }} />
            <View style={styles.submitContainer}>
            {/* 공개 비공개 토글 버튼 */}
            {
              mode !== "edit" || mode === "edit" && Private ?
              <TouchableOpacity
                style={{ height: 30, flexDirection: "row", alignItems: "center", gap: 4 }}
                hitSlop={4}
                onPress={() => { setIsPrivate(!isPrivate); }}
              >
              <MaterialCommunityIcons name={isPrivate ? "checkbox-marked" : "checkbox-blank-outline"} size={24} color={isPrivate && mode === "edit" ? "red" : "black"} />
              <View>
                <Text style={{fontSize: 20, fontWeight: "bold", color: isPrivate && mode === "edit" ? "red" : "black"}}>{mode === "edit" ? `${t("Function.public_convert")}` : `${t("Function.private_convert")}`}</Text>
                {mode === "edit" ? <Text style={{color: isPrivate ? "red" : "black"}}>{t("Function.public_convert_alert")}</Text> : null}
              </View>
              </TouchableOpacity> :
              null
            }
            <View style={{ marginTop: 10 }} />
            {/* 등록 버튼 */}
            <TouchableOpacity
              style={[ styles.submitButton, { alignSelf: "stretch", width: "100%", backgroundColor: process ? "gray" : mainColor }]}
              hitSlop={4}
              onPress={() => {mode === "edit" ? handleUpdate() : handleSubmit() }}
              disabled={process}
            >
              <Text style={styles.submitButtonText}>{mode === "edit" ? t("Function.btn_edit") : t("Function.regist")}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: 30 }} />

          {
            modalVisible ?
            <ModalView
              type={modalType}
              visible={modalVisible}
              setVisible={setModalVisible}
              image={{ image, setImage }}
            /> :
            null
          }
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}
