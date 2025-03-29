import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Row, UncontrolledTooltip, Form } from "reactstrap";
import SimpleBar from "simplebar-react";
import EmojiPicker from "emoji-picker-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChatMessage } from "../../common/data/chat";

// Redux Actions and Thunks
import { addMessage as onAddMessage, getChats } from "../../slices/chats/thunk";
import { addUserMessage } from "../../slices/chats/reducer";

interface Props {
  chatTitle: string;
  sessionId: string | null;
  messages: ChatMessage[];
  loading: boolean;
}

const UserChat: React.FC<Props> = ({ chatTitle, sessionId, messages, loading }) => {
  const dispatch = useDispatch<any>();
  const scrollRef = useRef<any>(null);

  const [curMessage, setCurMessage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [emoji, setEmoji] = useState<boolean>(false);

  const assistantLoading = useSelector((state: any) => state.chats.assistantLoading);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.getScrollElement().scrollTop =
        scrollRef.current.getScrollElement().scrollHeight;
    }
  }, [messages]);

  const onEmojiClick = (event: any) => {
    setCurMessage(curMessage + event.emoji);
  };

  const handleImageChange = (event: any) => {
    event.preventDefault();
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const sendMessage = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (curMessage.trim() !== "" || selectedImage !== null) {
      const newMessage: ChatMessage = {
        id: Date.now(),
        isUser: true,
        content: selectedImage ? `[image]` : curMessage.trim(),
        timestamp: new Date().toISOString(),
      };

      // First dispatch the user message immediately
      dispatch(addUserMessage(newMessage));

      // Then start the AI response process
      // The API will create a new session if the session_id starts with 'temp_'
      dispatch(onAddMessage({ sessionId, message: newMessage }));

      // After sending first message in a new chat, refresh the chat list to get the real session
      if (sessionId && sessionId.startsWith('temp_')) {
        dispatch(getChats());
      }

      setCurMessage("");
      setEmoji(false);
      setSelectedImage(null);
    }
  };

  return (
    <div className="w-100 user-chat d-flex flex-column" style={{ height: "calc(100vh - 180px)" }}>
      <Card className="mb-0 h-100 d-flex flex-column">
        {/* Fixed Header */}
        <div className="p-4 border-bottom">
          <Row>
            <Col md="4" xs="9">
              <h5 className="font-size-15 mb-1">{chatTitle}</h5>
              <p className="text-muted mb-0">
                {assistantLoading ? (
                  <><i className="mdi mdi-circle text-success align-middle me-1"></i> Assistant is typing...</>
                ) : (
                  <><i className="mdi mdi-circle text-success align-middle me-1"></i> Active</>
                )}
              </p>
            </Col>
          </Row>
        </div>

        {/* Scrollable Chat Area */}
        <div className="d-flex flex-column flex-grow-1">
          <div className="chat-conversation p-3 flex-grow-1">
            <SimpleBar
              style={{ 
                height: "calc(100vh - 380px)",
                minHeight: 0
              }}
              ref={scrollRef}
              autoHide={false}
            >
              <ul className="list-unstyled mb-0">
                {loading ? (
                  <li className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </li>
                ) : (
                  <>
                    {messages.map((message, idx) => (
                      <li
                        key={idx}
                        className={`${message.isUser ? "right" : ""}`}
                      >
                        <div className="conversation-list">
                          <div className="ctext-wrap">
                            <div className="conversation-name">
                              {message.isUser ? "You" : "Assistant"}
                            </div>
                            <p className="mb-0">{message.content}</p>
                            <p className="chat-time mb-0">
                              <i className="bx bx-time-five align-middle me-1"></i>
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                    {assistantLoading && (
                      <li>
                        <div className="conversation-list">
                          <div className="ctext-wrap">
                            <div className="conversation-name">Assistant</div>
                            <div className="dropdown-item-text">
                              <span className="spinner-grow spinner-grow-sm me-1" role="status"></span>
                              Typing...
                            </div>
                          </div>
                        </div>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </SimpleBar>
          </div>
          <div className="p-3 chat-input-section">
            <Form onSubmit={sendMessage}>
              <Row>
                <Col>
                  <div className="position-relative">
                    <input
                      type="text"
                      value={curMessage}
                      onChange={(e) => setCurMessage(e.target.value)}
                      className="form-control chat-input rounded"
                      placeholder="Enter Message..."
                      disabled={assistantLoading}
                    />
                    <div className="chat-input-links">
                      <ul className="list-inline mb-0">
                        <li className="list-inline-item">
                          <Link to="#">
                            <i
                              className="mdi mdi-emoticon-happy-outline"
                              id="Emojitooltip"
                              onClick={() => setEmoji(!emoji)}
                            />
                            <UncontrolledTooltip
                              placement="top"
                              target="Emojitooltip"
                            >
                              Emojis
                            </UncontrolledTooltip>
                          </Link>
                          {emoji && (
                            <div className="emoji-picker-container">
                              <EmojiPicker
                                onEmojiClick={onEmojiClick}
                                width={250}
                                height={382}
                              />
                            </div>
                          )}
                        </li>
                        <li className="list-inline-item">
                          <Link to="#">
                            <i
                              className="mdi mdi-file-image-outline"
                              id="Imagetooltip"
                              onClick={() => {
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = "image/*";
                                input.onchange = handleImageChange;
                                input.click();
                              }}
                            />
                            <UncontrolledTooltip
                              placement="top"
                              target="Imagetooltip"
                            >
                              Images
                            </UncontrolledTooltip>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
                <Col className="col-auto">
                  <Button
                    type="submit"
                    color="primary"
                    disabled={assistantLoading || (!curMessage.trim() && !selectedImage)}
                    className="btn-rounded chat-send w-md waves-effect waves-light"
                  >
                    <span className="d-none d-sm-inline-block me-2">Send</span>
                    <i className="mdi mdi-send float-end"></i>
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserChat;
