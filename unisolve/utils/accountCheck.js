import _axios from "../api";
import { useTranslation } from "react-i18next";
import "../i18n";

export const accountCheck = async (value, snackBar, t, type) => {
  try {
    snackBar(`${t("Stage.process")}${t("Function.waiting")}`);
    const response = await _axios.post("/accounts/existuser", value);
    const result = response.data.isNotExist || false;
    if (type) return !result ? true : false;
    if (!result) {
      snackBar(`${t("Stage.failed")}${t("User.confirm_failed")}`);
    } else {
      snackBar(`${t("Stage.success")}${t("User.confirm_success")}`);
    }
    return result;
  } catch {
    snackBar(`${t("Stage.failed")}${t("User.error")}`);
    return false;
  }
};
