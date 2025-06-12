import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import Spinners from "../../Components/Common/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  getSessions as onGetChats,
  deleteSession,
  renameSession,
} from "../../slices/chats/thunk";
import { ChatSession } from "../../common/data/chat";
import { clearMessages } from "../../slices/chats/reducer";
import { useTranslation } from "react-i18next";
import { AssistantType } from "../../services/ChatService";

interface Props {
  userChatOpen: (chat: ChatSession) => void;
  currentSessionId: string | null;
  assistantType: AssistantType;
}

const ChatList: React.FC<Props> = ({ userChatOpen, assistantType }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [searchText, setSearchText] = useState("");

  const selectProperties = createSelector(
    (state: { chats: { chats: ChatSession[]; loading: boolean; currentSessionId: string | null } }) =>
      state.chats,
    (chats) => ({
      chats: chats.chats,
      loading: chats.loading,
      currentSessionId: chats.currentSessionId
    })
  );

  const { chats, loading, currentSessionId: reduxCurrentSessionId } = useSelector(selectProperties);
  const [isLoading, setLoading] = useState(loading);

  // Use Redux currentSessionId instead of prop
  const activeSessionId = reduxCurrentSessionId;
  console.log('[ChatList] Active Session:', { activeSessionId });

  useEffect(() => {
    console.log('[ChatList] Loading chats for assistant type:', assistantType);
    dispatch(onGetChats(assistantType));
  }, [dispatch, assistantType]);

  const handleNewChat = () => {
    console.log('[ChatList] Starting new chat');
    dispatch(clearMessages());
  };

  const toggleDropdown = (sessionId: string | null) => {
    setDropdownOpen(dropdownOpen === sessionId ? null : sessionId);
  };

  const handleDelete = async (sessionId: string) => {
    await dispatch(deleteSession(sessionId));
    setDropdownOpen(null);
  };

  const handleRename = (chat: ChatSession) => {
    setEditingChatId(chat.session_id);
    setEditingName(chat.session_name);
    setDropdownOpen(null);
  };

  const handleRenameSubmit = async (chat: ChatSession) => {
    if (chat.session_id && editingName.trim()) {
      await dispatch(
        renameSession({
          sessionId: chat.session_id,
          newName: editingName.trim(),
        })
      );
      setEditingChatId(null);
      setEditingName("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, chat: ChatSession) => {
    if (e.key === "Enter") {
      handleRenameSubmit(chat);
    } else if (e.key === "Escape") {
      setEditingChatId(null);
      setEditingName("");
    }
  };

  // Filter chats based on search text
  const filteredChats = chats.filter(chat => 
    chat.session_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="chat-leftsidebar me-lg-4" style={{maxWidth: '220px', minWidth: '180px'}}>
      <div className="d-flex flex-column h-100">
        <div className="chat-leftsidebar-nav flex-grow-1">
          <div className="px-2 pt-4 pb-4">
            <div className="d-flex align-items-center mb-2">
              <h5 className="font-size-14 mb-0">{t("Chat Assistant")}</h5>
              <div className="d-flex align-items-center ms-auto">
                <Button
                  color="none"
                  className="p-0 me-3 border-0"
                  onClick={handleNewChat}
                  title={t("New Chat")}
                >
                  <i className="bx bx-edit-alt fs-4"></i>
                </Button>
              </div>
            </div>
            <div className="mb-4">
              <div className="position-relative search-box">
                <Input
                  type="text"
                  className="form-control bg-light border-0 rounded-pill"
                  placeholder={t("Search sessions")}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ paddingLeft: "40px", height: "38px" }}
                />
                <i
                  className="bx bx-search search-icon position-absolute"
                  style={{
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
              </div>
            </div>

            <ul className="list-unstyled chat-list">
              {isLoading ? (
                <Spinners setLoading={setLoading} />
              ) : (
                <SimpleBar style={{ height: "calc(100vh - 180px)" }}>
                  {filteredChats.map((chat, index) => (
                    <li
                      key={chat.session_id || `new-chat-${index}`}
                      className={`mb-2 ${
                        (chat.session_id === activeSessionId) || 
                        (chat.session_id === null && activeSessionId === null) ? "active" : ""
                      }`}
                    >
                      <div className="d-flex align-items-center">
                        <Link
                          to="#"
                          onClick={() => userChatOpen(chat)}
                          className="d-flex align-items-center rounded p-2 text-decoration-none flex-grow-1"
                        >
                          <i className="bx bx-message-square-dots fs-4 me-2"></i>
                          <div className="flex-grow-1 overflow-hidden text-truncate">
                            {editingChatId === chat.session_id ? (
                              <Input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, chat)}
                                className="form-control form-control-sm"
                                autoFocus
                              />
                            ) : (
                              <h5
                                className="text-truncate font-size-12 mb-0"
                                style={{ maxWidth: "110px", fontWeight: 400 }}
                              >
                                {chat.session_name || t("New Chat")}
                              </h5>
                            )}
                          </div>
                        </Link>
                        {chat.session_id && (
                          <Dropdown
                            isOpen={dropdownOpen === chat.session_id}
                            toggle={() => toggleDropdown(chat.session_id)}
                            className="ms-2"
                          >
                            <DropdownToggle
                              color="none"
                              className="p-0 border-0"
                            >
                              <i className="bx bx-dots-vertical-rounded fs-4 text-muted"></i>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                              <DropdownItem onClick={() => handleRename(chat)}>
                                <i className="bx bx-edit-alt me-2"></i>{" "}
                                {t("Edit Chat Name")}
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => handleDelete(chat.session_id!)}
                              >
                                <i className="bx bx-trash me-2"></i>{" "}
                                {t("Delete Chat")}
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        )}
                      </div>
                    </li>
                  ))}
                </SimpleBar>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
