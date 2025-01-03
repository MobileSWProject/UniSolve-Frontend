import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import decodeJWT from "../utils/decodeJWT"; // JWT 디코딩 함수

const useUserId = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const decodedToken = decodeJWT(token);
          if (decodedToken?.user_id) {
            setUserId(decodedToken.user_id); // JWT에서 user_id 추출
          } else {
            // 토큰이 유효하지 않으면 로그인 페이지로 리다이렉트
            router.replace("/");
          }
        } else {
          // 토큰이 없으면 로그인 페이지로 리다이렉트
          router.replace("/");
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
        router.replace("/");
      } finally {
        setLoading(false); // 로딩 완료 시 상태 업데이트
      }
    };

    fetchUserId();
  }, []);

  return { userId, loading }; // userId와 loading 상태를 반환
};

export default useUserId;
