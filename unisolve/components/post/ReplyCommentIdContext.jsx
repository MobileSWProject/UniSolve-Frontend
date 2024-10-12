import { createContext, useState, useContext } from "react";

const ReplyCommentIdContext = createContext();

export const ReplyCommentIdProvider = ({ children }) => {
  const [selectedComment, setSelectedComment] = useState(null);

  return (
    <ReplyCommentIdContext.Provider
      value={{ selectedComment, setSelectedComment }}
    >
      {children}
    </ReplyCommentIdContext.Provider>
  );
};

export const useReplyCommentId = () => {
  return useContext(ReplyCommentIdContext);
};
