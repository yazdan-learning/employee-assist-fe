import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import { ChatMessage, ChatSession } from "../../common/data/chat";
import ChatList from "./ChatList";
import UserChat from "./UserChat";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { AssistantType } from "../../services/ChatService";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { getMessages as onGetMessages } from "../../slices/chats/thunk";
import { clearMessages } from "../../slices/chats/reducer";

interface ChatState {
  chats: {
    messages: ChatMessage[];
    loading: boolean;
    currentSessionId: string | null;
    currentSession: ChatSession | undefined;
    chats: ChatSession[];
  };
}

const Chat: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { assistantType = "general" } = useParams();
  const currentAssistantType = assistantType.toLowerCase() === "log" ? AssistantType.LOG : AssistantType.GENERAL;

  const dispatch = useDispatch<any>();

  const selectProperties = createSelector(
    (state: { chats: { chats: ChatSession[]; messages: ChatMessage[]; loading: boolean; currentSessionId: string | null } }) => state.chats,
    (chats) => ({
      messages: chats.messages,
      loading: chats.loading,
      currentSessionId: chats.currentSessionId,
      currentSession: chats.chats.find(chat => 
        chat.session_id === chats.currentSessionId || 
        (chat.session_id === null && chats.currentSessionId === null)
      )
    })
  );

  const { messages, loading, currentSessionId, currentSession } = useSelector(selectProperties);
  
  // Only keep document.title management
  useEffect(() => {
    document.title = currentAssistantType === AssistantType.LOG ? 
      t("Log Assist") : 
      t("Chat Assistant");
  }, [t, i18n.language, currentAssistantType]);

  useEffect(() => {
    // Clear messages and reset current session when assistant type changes
    dispatch(clearMessages());
  }, [t, i18n.language, currentAssistantType]);

  useEffect(() => {
    if (currentSessionId) {
      dispatch(onGetMessages(currentSessionId));
    }
  }, [dispatch, currentSessionId]);

  // When user opens a chat
  const userChatOpen = (chat: ChatSession) => {
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
                assistantType={currentAssistantType}
                currentSessionId={currentSessionId}
              />
              <UserChat
                chatTitle={currentAssistantType === AssistantType.LOG ? t("Log Assist") : t("Chat Assistant")}
                sessionId={currentSessionId}
                messages={messages}
                loading={loading}
                assistantType={currentAssistantType}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Chat;
