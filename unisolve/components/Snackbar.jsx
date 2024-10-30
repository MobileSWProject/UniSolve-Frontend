import { View } from "react-native";
import { Snackbar } from "react-native-paper";
import { styles } from "../styles/SnackBarStyle"

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