import { ScrollView, Text } from "react-native";
import mainColor from "../../constants/Colors";
import InputProcess from "../../components/form/InputProcess";
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function ViewMessage({ setVisible, viewMessage }) {
  const { t } = useTranslation();
  return (
    <>
      <Text style={{ fontSize: 40, marginBottom: 10, textAlign: "center", fontWeight: "bold", color: mainColor, marginTop: 4 }}>{t("Function.message_view")}</Text>
      <ScrollView style={{ maxHeight: 500, overflowY: "auto"}}>
        {viewMessage}
      </ScrollView>
      <InputProcess setVisible={setVisible} onPress={() => {setVisible(false)}} noConfirm={true}/>
    </>
  );
};