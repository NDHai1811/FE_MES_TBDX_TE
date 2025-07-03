import React, { useEffect, useRef, useState, useMemo, useLayoutEffect } from "react";
import { Avatar, Button, Empty, Image, message, Space, Spin, Tooltip } from "antd";
import { DownloadOutlined, DownOutlined, FileExcelOutlined, FileGifOutlined, FileImageOutlined, FileJpgOutlined, FileOutlined, FilePdfOutlined, FilePptOutlined, FileWordOutlined, FileZipOutlined, LeftOutlined, RightOutlined, RotateLeftOutlined, RotateRightOutlined, SwapOutlined, UndoOutlined, UserOutlined, ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { downloadFileMsg, getMessages, markAsRead } from "../../../api/ui/chat";
import { useProfile } from "../../../components/hooks/UserHooks";
import { baseURL } from "../../../config";
import MessageViewer from "./MessageViewer";
import { displayIconFileType, downloadFile, fullNameToColor } from "../chat_helper";
import echo from "../../../helpers/echo";

/**
 * Format timestamp based on whether it's today or not
 */
const formatTimestamp = (timestamp) => {
  const messageDate = new Date(timestamp);
  const today = new Date();

  // Check if message is from today
  const isToday = messageDate.toDateString() === today.toDateString();

  if (isToday) {
    // Show only time for today's messages
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    // Show date and time for other days
    return messageDate.toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }
};

/**
 * Format date for divider display
 */
const formatDateDivider = (timestamp) => {
  const messageDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (messageDate.toDateString() === today.toDateString()) {
    return "Hôm nay";
  } else if (messageDate.toDateString() === yesterday.toDateString()) {
    return "Hôm qua";
  } else {
    return messageDate.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

/**
 * ChatArea with message grouping and username displayed above each group
 */
function ChatArea({ chatId, chat, sentMessage }) {
  const { userProfile } = useProfile();
  const [messages, setMessages] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState();
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const endRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const hasRefresh = useRef(false);

  // Fetch history messages
  useEffect(() => {
    setMessages([]);
    async function fetchMessages() {
      setLoading(true);
      const res = await getMessages({ chat_id: chatId, limit: 20 });
      setMessages(res.data);
      if (res.data.length) {
        setHasMore(res.data.length === 20);
      } else {
        setHasMore(false);
      }
      hasRefresh.current = true;
      setLoading(false);
    }
    fetchMessages();
  }, [chatId]);

  // Load older messages when scrolling to top
  const prevScrollHeightRef = useRef(0);
  const prevScrollTopRef = useRef(0);
  const loadMoreMessages = async () => {
    if (loadingOlder || !hasMore) return;
    const container = containerRef.current;
    if (!container) return;
    setLoadingOlder(true);
    prevScrollHeightRef.current = container.scrollHeight;
    prevScrollTopRef.current = container.scrollTop;
    const res = await getMessages({ chat_id: chatId, before: messages[0].id ?? '', limit: 20 });
    const older = (res.data ?? [])
    if (older.length) {
      setMessages(prev => [...older, ...prev]);
      setHasMore(older.length === 20);
    } else {
      setHasMore(false);
    }
    setLoadingOlder(false);
  };

  // ⏳ Chờ ảnh load xong rồi mới scroll
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if(!hasRefresh.current){
      const deltaHeight = container.scrollHeight - prevScrollHeightRef.current;
      container.scrollTop = prevScrollTopRef.current + deltaHeight;
    } else {
      container.scrollTop = container.scrollHeight;
    }
    hasRefresh.current = false;
  }, [messages]);

  // Scroll handler
  const handleScroll = (e) => {
    if (e.currentTarget.scrollTop === 0) {
      loadMoreMessages();
    }
    const atBottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= e.currentTarget.clientHeight + 50;
    setShowScrollBtn(!atBottom);
  };

  const scrollToBottom = () => {
    const el = containerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    setShowScrollBtn(false);
  };

  // Nhóm tin nhắn theo ngày rồi nhóm theo người gửi
  const groups = useMemo(() => {
    const result = {};
    messages.forEach(msg => {
      const dateKey = new Date(msg.created_at).toDateString();
      if (!result[dateKey]) {
        result[dateKey] = [];
      }
      result[dateKey].push(msg);
    });

    return Object.entries(result).map(([date, msgs]) => {
      const subResult = [];
      msgs.forEach((msg) => {
        const lastGroup = subResult[subResult.length - 1];
        const isNewGroup =
          !lastGroup ||
          new Date(msg.created_at) - new Date(lastGroup.items[lastGroup.items.length - 1].created_at) > 30000 ||
          lastGroup.sender.username !== msg.sender.username;
        if (isNewGroup) {
          subResult.push({ sender: msg.sender, items: [msg], isMine: msg.isMine });
        } else {
          lastGroup.items.push(msg);
        }
      });
      return {
        sender: msgs[0].sender,
        items: subResult,
        created_at: msgs[0].created_at,
        isMine: msgs[0].isMine,
      }
    });
  }, [messages]);

  // Nhận tin nhắn mới từ Echo
  useEffect(() => {
    if (!chatId) return;
    const channel = echo.private(`chat.${chatId}`);
    //Listen Event Message Sent
    channel.listen('MessageSent', msg => {
      if (msg.sender.id == userProfile.id) return;
      if (msg.chat_id === chatId) {
        setIncomingMessage(msg);
      }
    });
    return () => {
      channel.stopListening('MessageSent');
      echo.leave(`chat.${chatId}`);  // hoặc echo.leaveChannel(...) tùy phiên bản
    };
  }, [chatId, userProfile?.id]);

  //Update messages when receiving new message
  useEffect(() => {
    if (!incomingMessage) return;
    setMessages(prev => [...prev, { ...incomingMessage, isMine: incomingMessage.sender_id == userProfile.id }]);
  }, [incomingMessage, userProfile]);

  useEffect(() => {
    if (!sentMessage) return;
    setMessages(prev => [...prev, { ...sentMessage, isMine: sentMessage.sender_id == userProfile.id }]);
  }, [sentMessage, userProfile]);

  // Mark last message as read when user is focused and last message is not read
  useEffect(() => {
    if (messages.length === 0 || !userProfile?.id) return;
    const lastMsg = messages[messages.length - 1];
    if (
      document.hasFocus() &&
      lastMsg?.sender_id !== userProfile?.id &&
      !lastMsg?.read // optional check
    ) {
      const params = {
        chat_id: chat.id,
        user_id: userProfile?.id,
        message_id: lastMsg.id
      };
      markAsRead(params, params.chat_id);
    }
  }, [messages, userProfile?.id]);

  

  return (
    !messages.length ?
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", background: "#0000000d", overflowX: 'hidden' }}>
        {loading ? <Spin style={{ height: '100%', width: '100%', alignContent: 'center' }} /> : <Empty description="No messages yet" style={{ height: '100%', alignContent: 'center' }} />}
      </div>
      :
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          background: "#0000000d",
          overflowX: 'hidden',
          position: 'relative',
          // backgroundImage: `url(${bgChat})`,
        }}
      >
        {loadingOlder && (
          <div style={{ textAlign: 'center', marginBottom: 8 }}><Spin size="small" /></div>
        )}
        {groups.map((subGroups, idx) => {
          const currentGroupDate = new Date(subGroups.created_at).toDateString();
          const previousGroupDate = idx > 0 ? new Date(groups[idx - 1].created_at).toDateString() : null;

          // Check if we need to show a date divider
          const showDateDivider = previousGroupDate !== currentGroupDate;

          return (
            <div key={idx}>
              {/* Date Divider */}
              {showDateDivider && (
                <div style={{ position: 'sticky', top: 0, zIndex: 1000, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                  <div style={{
                    background: '#f0f0f0',
                    padding: '6px 16px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#666',
                    fontWeight: '500',
                    border: '1px solid #00000020',
                  }}>
                    {formatDateDivider(subGroups.created_at)}
                  </div>
                </div>
              )}
              {subGroups.items.map((group, idx) => {
                const isMineGroup = group.isMine;

                return <div style={{ marginBottom: "16px" }}>
                  {/* Username above avatar and messages */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: isMineGroup ? "flex-end" : "flex-start",
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ fontSize: "12px", color: "#888" }}>
                      {group.sender.name}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: isMineGroup ? "row-reverse" : "row",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: 48,
                        marginRight: isMineGroup ? 0 : 8,
                        marginLeft: isMineGroup ? 8 : 0,
                        textAlign: "center",
                      }}
                    >
                      <Avatar
                        size={38}
                        src={group.items[0].sender.avatar}
                        style={{ backgroundColor: fullNameToColor(group.items[0]?.sender?.name) }}
                      >{group.items[0]?.sender?.name?.trim().split(/\s+/).pop()[0].toUpperCase()}</Avatar>
                    </div>
                    {/* Messages */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      {group.items.map((msg, i) => (
                        <div key={msg.id} style={{ marginBottom: 4, display: 'flex', flexDirection: 'column', alignItems: msg.isMine ? 'flex-end' : 'flex-start' }}>
                          <Tooltip open={false} title={formatTimestamp(msg.created_at)} trigger={'click'} placement={msg.isMine ? "left" : "right"} color="#00000073" mouseLeaveDelay={0} mouseEnterDelay={0.2} getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                            <div style={{ maxWidth: '70%' }}>
                              {/* Text content */}
                              {msg.content_text && (
                                <div
                                  style={{
                                    background: msg.isMine ? '#1890ff' : '#f0f0f0',
                                    color: msg.isMine ? '#fff' : '#000',
                                    padding: '8px 12px',
                                    borderRadius: 8,
                                    marginBottom: 0,
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                  }}
                                >
                                  <div className={`message ${msg.isMine ? 'mine' : ''}`}>
                                    <MessageViewer contentJson={msg.content_json} />
                                  </div>
                                </div>
                              )}

                              {/* Image attachments */}
                              {(msg.attachments ?? []).filter(e => e.file_type.includes('image/')).length > 0 &&
                                <div style={{
                                  marginBottom: 8,
                                  // border: "1px solid #0000005e",
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                  gap: 2,
                                }}>
                                  <Image.PreviewGroup
                                    preview={{
                                      toolbarRender: (
                                        _,
                                        {
                                          transform: { scale },
                                          actions: {
                                            onActive,
                                            onFlipY,
                                            onFlipX,
                                            onRotateLeft,
                                            onRotateRight,
                                            onZoomOut,
                                            onZoomIn,
                                            onReset,
                                          },
                                        },
                                      ) => (
                                        <Space size={12} className="toolbar-wrapper">
                                          {/* <LeftOutlined
                                          onClick={() => (onActive === null || onActive === void 0 ? void 0 : onActive(-1))}
                                        />
                                        <RightOutlined
                                          onClick={() => (onActive === null || onActive === void 0 ? void 0 : onActive(1))}
                                        /> */}
                                          {/* <DownloadOutlined onClick={onDownload} /> */}
                                          <SwapOutlined rotate={90} onClick={onFlipY} />
                                          <SwapOutlined onClick={onFlipX} />
                                          <RotateLeftOutlined onClick={onRotateLeft} />
                                          <RotateRightOutlined onClick={onRotateRight} />
                                          <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                                          <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                                          {/* <UndoOutlined onClick={onReset} /> */}
                                        </Space>
                                      ),
                                      // onChange: index => {
                                      //   setCurrent(index);
                                      // },
                                    }}>
                                    {(msg.attachments ?? []).filter(e => e.file_type.includes('image/')).map((att, index) => (
                                      <Image
                                        key={index}
                                        src={`${baseURL}/storage/${att.file_path}`}
                                        alt={att.file_name}
                                        style={{ maxWidth: '100%', border: '1px solid #00000020', borderRadius: 8 }}
                                      />
                                    ))}
                                  </Image.PreviewGroup>
                                </div>
                              }
                              {(msg.attachments ?? []).filter(e => !e.file_type.includes('image/') && !e.file_type.includes('text/link')).length > 0 &&
                                (msg.attachments ?? []).filter(e => !e.file_type.includes('image/') && !e.file_type.includes('text/link')).map(file =>
                                (
                                  <div
                                    style={{
                                      background: msg.isMine ? '#1890ff' : '#f0f0f0',
                                      color: msg.isMine ? '#fff' : '#000',
                                      padding: '8px 12px',
                                      borderRadius: 8,
                                      marginBottom: 0,
                                      whiteSpace: 'pre-wrap',
                                      wordBreak: 'break-word',
                                      width: '100%',
                                      display: 'flex',
                                      alignItems: 'flex-end'
                                    }}
                                  >
                                    {displayIconFileType(file?.file_type)}
                                    <span
                                      style={{
                                        color: msg.isMine ? '#ffffff' : '#1890ff',
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                        display: 'inline-block',
                                        maxWidth: '100%',           // hoặc giá trị phù hợp với giao diện của bạn
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        verticalAlign: 'middle'
                                      }}
                                      title={file?.file_name}
                                    >
                                      {file?.file_name}
                                    </span>
                                    <Button type="default" icon={<DownloadOutlined style={{ fontSize: 18 }} />} size="small" style={{ marginLeft: 8 }} onClick={() => downloadFile(file)}></Button>
                                  </div>
                                )
                                )}
                            </div>
                          </Tooltip>
                          {/* Timestamp */}
                          {i === group.items.length - 1 && <span style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>
                            {formatTimestamp(msg.created_at)}
                          </span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              })}
            </div>
          );
        }
        )}
        {/* Floating Scroll Button */}
        {showScrollBtn && (
          <Button
            size="large"
            shape="circle"
            icon={<DownOutlined />}
            onClick={scrollToBottom}
            style={{
              position: 'sticky',
              bottom: 0,
              float: 'right',
              zIndex: 1000
            }}
          />
        )}
        <div ref={endRef} />
      </div>
  );
}

export default ChatArea;