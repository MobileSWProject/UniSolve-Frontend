import { View, StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";

export default function SnackBar({ visible, message, onDismiss }) {
  return (
    <View style={styles.snackbarContainer}>
      <Snackbar
        style={styles.snackbar}
        visible={visible}
        onDismiss={onDismiss}
        duration={1800}
      >
        {message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  snackbarContainer: {
    position: "absolute",
    zIndex: 999,
    top: "15%",
    width: "80%",
    alignSelf: "center",
  },
  snackbar: {
    borderRadius: 15,
  },
});
