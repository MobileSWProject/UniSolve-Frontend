import { decode as atob } from "base-64";

// JWT 디코딩 함수
const decodeJWT = (token) => {
  if (!token) {
    console.log("JWT 토큰이 없습니다.");
    return null;
  }

  const tokenParts = token.split(".");

  if (tokenParts.length !== 3) {
    console.log("유효하지 않은 JWT 토큰입니다.");
    return null;
  }

  try {
    const payload = tokenParts[1]; // JWT의 두 번째 부분은 페이로드입니다.
    const decodedPayload = atob(payload); // Base64 URL 디코딩
    const jsonPayload = JSON.parse(decodedPayload); // JSON 형식으로 변환

    return jsonPayload; // JWT 페이로드를 JSON 객체로 반환
  } catch (error) {
    console.error("JWT 디코딩 중 오류 발생:", error);
    return null;
  }
};

export default decodeJWT;
