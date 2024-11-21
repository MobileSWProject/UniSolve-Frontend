import { StyleSheet } from "react-native";
import { mainColor } from "../../../constants/Colors";

export const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    me: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 15,
    },
    meText: {
        fontSize: 48, // fontSize: 'em은 부모 요소의 값, 24이므로 3em인 72가 됨',
        fontWeight: "bold",
    },
    meSubText: {
        fontSize: 24, // fontSize: 'em은 부모 요소의 값, 24이므로 3em인 72가 됨',
        fontWeight: "bold",
        color: "gray",
    },
    head: {
        height: 40,
        backgroundColor: mainColor,
        textAlign: "center",
    },
    headText: {
        margin: 6,
        color: "white",
        textAlign: "center",
    },
    text: {
        margin: 6,
        textAlign: "center",
    },
    buttonSmall: {
        marginTop: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        height: 35,
    },
    buttonTextSmall: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 14,
    },
});