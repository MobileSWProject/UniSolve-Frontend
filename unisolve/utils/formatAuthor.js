export default function formatAuthor(str) {
  if (!str) return ""; // 빈 문자열 체크

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
