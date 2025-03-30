import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import { ChatMessage, ChatSession } from "../../common/data/chat";
import ChatList from "./ChatList";
import UserChat from "./UserChat";
import { useTranslation } from "react-i18next";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { getMessages as onGetMessages } from "../../slices/chats/thunk";
import { clearMessages } from "../../slices/chats/reducer";

interface ChatState {
  chats: {
    messages: ChatMessage[];
    loading: boolean;
  };
}

const Chat: React.FC = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t("Chat Assistant");
  }, [t, i18n.language]);

  const dispatch = useDispatch<any>();

  const selectProperties = createSelector(
    (state: ChatState) => state.chats,
    (chats) => ({
      messages: chats.messages,
      loading: chats.loading,
    })
  );

  const { messages, loading } = useSelector(selectProperties);

  const [chatTitle, setChatTitle] = useState<string>(t("Chat Assistant"));

  useEffect(() => {
    setChatTitle(t("Chat Assistant"));
  }, [t, i18n.language]);

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (currentSessionId) {
      dispatch(onGetMessages(currentSessionId));
    }
  }, [dispatch, currentSessionId]);

  // When user opens a chat
  const userChatOpen = (chat: ChatSession) => {
    setChatTitle(chat.session_name || t("New Chat"));
    setCurrentSessionId(chat.session_id);

    if (!chat.session_id) {
      // For new chats, just clear the messages
      dispatch(clearMessages());
    } else {
      // For existing chats, load their messages
      dispatch(onGetMessages(chat.session_id));
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg={12}>
            <div className="d-lg-flex">
              <ChatList
                userChatOpen={userChatOpen}
                currentSessionId={currentSessionId}
              />
              <UserChat
                chatTitle={chatTitle}
                sessionId={currentSessionId}
                messages={messages}
                loading={loading}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Chat;
