import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const _axios = axios.create({
  baseURL: process.env.EXPO_PUBLIC_SERVER_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

_axios.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const formFetch = async (url, data) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}${url}`,
    {
      method: "POST",
      body: data,
      headers: {
        Authorization: token,
      },
    }
  );
  return await response.json();
};

export default _axios;
