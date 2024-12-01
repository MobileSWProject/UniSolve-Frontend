import { useState, useRef } from "react";

const refreshPoint = -20;

const useScrollRefresh = (fetchData) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollY = useRef(0);

  const handleScroll = (event) => {
    scrollY.current = event.nativeEvent.contentOffset.y;
    setCanRefresh(scrollY.current <= refreshPoint && isDragging);
  };

  const handleScrollEndDrag = async () => {
    setIsDragging(false);
    if (scrollY.current <= refreshPoint && !isRefreshing) {
      setIsRefreshing(true);
      await fetchData(); // 데이터 로드가 끝날 때까지 기다림
      setIsRefreshing(false); // 새로고침 상태 해제
      setCanRefresh(false)
    }
  };

  const handleScrollStartDrag = () => {
    setIsDragging(true);
  };

  return {
    isRefreshing,
    handleScroll,
    handleScrollEndDrag,
    canRefresh,
    handleScrollStartDrag,
  };
};

export default useScrollRefresh;
