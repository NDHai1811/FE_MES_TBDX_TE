import React, { useEffect, useRef, useState, useMemo, useLayoutEffect } from "react";
import { Avatar, Button, Empty, Image, Space, Spin, Tooltip } from "antd";
import { DownloadOutlined, DownOutlined, LeftOutlined, RightOutlined, RotateLeftOutlined, RotateRightOutlined, SwapOutlined, UndoOutlined, UserOutlined, ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { downloadFileMsg, getMessages } from "../../../api/ui/chat";
import { useProfile } from "../../../components/hooks/UserHooks";
import { baseURL } from "../../../config";
import MessageViewer from "./MessageViewer";

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
    return messageDate.toLocaleDateString([], { hour: '2-digit', minute: '2-digit' });
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
function ChatArea({ chatId, chat, newMessage = null }) {
  const { userProfile } = useProfile();
  const [messages, setMessages] = useState([]);

  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const endRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [hasRefresh, setHasRefresh] = useState(false);

  // Fetch history
  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      const res = await getMessages({ chat_id: chatId, limit: 20 });
      const withFlag = (res.data ?? []).map((msg) => ({
        ...msg,
        isMine: msg.sender.username === userProfile.username,
      }));
      setMessages(withFlag);
      if (withFlag.length) {
        setHasMore(withFlag.length === 20);
      }
      // scroll to bottom after initial load
      if (containerRef.current) {
        const el = containerRef.current;
        if (!el) return;
        // timeout to wait for render
        setTimeout(() => {
          el.scrollTop = el.scrollHeight;
        }, 0);
      }
      setHasRefresh(true);
      setLoading(false);
    }
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    if (!newMessage) return;
    const msg = { ...newMessage, isMine: newMessage.sender.username === userProfile.username };
    setMessages(prev => [...prev, msg]);
  }, [newMessage, userProfile]);

  // // Auto scroll to bottom on new messages
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  // Group messages by sender and time gap (30s)
  const groups = useMemo(() => {
    const result = [];
    messages.forEach((msg) => {
      const lastGroup = result[result.length - 1];
      const isNewGroup =
        !lastGroup ||
        new Date(msg.created_at) - new Date(lastGroup.items[lastGroup.items.length - 1].created_at) > 30000 ||
        lastGroup.sender.username !== msg.sender.username;
      if (isNewGroup) {
        result.push({ sender: msg.sender, items: [msg] });
      } else {
        lastGroup.items.push(msg);
      }
    });
    return result;
  }, [messages]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (containerRef.current && messages.length && hasRefresh) {
        const el = containerRef.current;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // endRef.current?.scrollIntoView({ behavior: 'smooth' });
            el.scrollTop = el.scrollHeight;
          });
        });
        setHasRefresh(false);
      }
    }, 500); // hoặc 100ms nếu nội dung lớn
    return () => clearTimeout(timeout);
  }, [hasRefresh, messages]);
  // Auto-scroll to bottom on new messages only when already at bottom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // If user is near bottom, scroll down on new messages
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 50;
    if (atBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // Load older messages when scrolling to top
  const loadOlder = async () => {
    if (loadingOlder || !hasMore) return;
    const el = containerRef.current;
    if (!el) return;
    setLoadingOlder(true);
    console.log('load older');
    const prevScrollHeight = el.scrollHeight;
    const res = await getMessages({ chat_id: chatId, before: messages[0].id ?? '', limit: 20 });
    const older = (res.data ?? []).map(m => ({
      ...m,
      isMine: m.sender.username === userProfile.username
    }));
    if (older.length) {
      setMessages(prev => [...older, ...prev]);
      setHasMore(older.length === 20);
      // maintain scroll position after prepending
      requestAnimationFrame(() => {
        const newScrollHeight = el.scrollHeight;
        el.scrollTop = newScrollHeight - prevScrollHeight;
      });
    } else {
      setHasMore(false);
    }
    setLoadingOlder(false);
  };

  // Scroll handler
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    if (el.scrollTop < 100 && hasMore) loadOlder();
    // show button if not at bottom
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 50;
    setShowScrollBtn(!atBottom);
  };

  const scrollToBottom = () => {
    const el = containerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    setShowScrollBtn(false);
  };

  if (!messages.length) {
    return <div style={{ flex: 1, overflowY: "auto", padding: "16px", background: "#0000000d", overflowX: 'hidden' }}>
      {loading ? <Spin style={{ height: '100%', width: '100%', alignContent: 'center' }} /> : <Empty description="No messages yet" style={{ height: '100%', alignContent: 'center' }} />}
    </div>
  }

  const downloadFile = async (file) => {
    const response = await downloadFileMsg(`/download/${file.file_path}`); // trả về blob
    const blob = new Blob([response.data]); // response.data là dữ liệu blob

    // Tạo URL tạm
    const url = window.URL.createObjectURL(blob);

    // Tạo thẻ <a> và kích hoạt tải
    const a = document.createElement('a');
    a.href = url;
    a.download = file.file_name;
    document.body.appendChild(a);
    a.click();

    // Dọn dẹp
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const renderMentionsById = (content, mentions = []) => {
    if (!mentions.length) return content;

    // Map user id to name for quick lookup
    const mentionMap = mentions.reduce((acc, m) => {
      acc[m.id] = m.name;
      return acc;
    }, {});
    // Regex tìm các từ bắt đầu bằng @ + số
    const regex = /@(\d+)/g;
    // Dùng replace với React fragment
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const [fullMatch, userId] = match;
      const name = mentionMap[userId];
      // Thêm phần trước @
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }
      // Thêm phần mention (đã chuyển @5 -> @Nguyễn Văn A)
      if (name) {
        parts.push(
          <span key={match.index} style={{ color: '#1677ff', fontWeight: 500 }}>
            @{name}
          </span>
        );
      } else {
        // fallback nếu không tìm thấy
        parts.push(fullMatch);
      }
      lastIndex = regex.lastIndex;
    }
    // Thêm phần còn lại
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return <>{parts}</>;
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px",
        background: "#0000000d",
        overflowX: 'hidden',
        // backgroundImage: `url(${bgChat})`,
      }}
    >
      {loadingOlder && (
        <div style={{ textAlign: 'center', marginBottom: 8 }}><Spin size="small" /></div>
      )}
      {groups.map((group, idx) => {
        const isMineGroup = group.items[0].isMine;
        const currentGroupDate = new Date(group.items[0].created_at).toDateString();
        const previousGroupDate = idx > 0 ? new Date(groups[idx - 1].items[0].created_at).toDateString() : null;

        // Check if we need to show a date divider
        const showDateDivider = previousGroupDate !== currentGroupDate;

        return (
          <React.Fragment key={idx}>
            {/* Date Divider */}
            {showDateDivider && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '20px 0',
                alignItems: 'center'
              }}>
                <div style={{
                  background: '#f0f0f0',
                  padding: '6px 16px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#666',
                  fontWeight: '500'
                }}>
                  {formatDateDivider(group.items[0].created_at)}
                </div>
              </div>
            )}

            <div style={{ marginBottom: "16px" }}>
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
                    size={40}
                    src={group.items[0].sender.avatar}
                    icon={<UserOutlined />}
                  />
                </div>
                {/* Messages */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  {group.items.map((msg, i) => (
                    <div key={msg.id} style={{ marginBottom: 4, display: 'flex', flexDirection: 'column', alignItems: msg.isMine ? 'flex-end' : 'flex-start' }}>
                      <Tooltip title={formatTimestamp(msg.created_at)} placement={msg.isMine ? "left" : "right"} color="#00000073" mouseLeaveDelay={0} mouseEnterDelay={0.2} getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                        <div style={{ maxWidth: '70%' }}>
                          {/* Text content */}
                          {msg.content_json && (
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
                                <MessageViewer contentJson={msg.content_json}/>
                              </div>
                            </div>
                          )}

                          {/* Image attachments */}
                          {(msg.attachments ?? []).filter(e => e.file_type === 'image/png').length > 0 &&
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
                                {msg.attachments.filter(e => e.file_type === 'image/png').map((att, index) => (
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
                          {(msg.attachments ?? []).filter(e => e.file_type !== 'image/png').length > 0 &&
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
                              <span
                                style={{
                                  color: msg.isMine ? '#ffffff' : '#1890ff',       // trắng nếu là của mình
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                }}
                                onClick={() => downloadFile((msg.attachments ?? [])[0])}
                              >
                                {(msg.attachments ?? [])[0]?.file_name}
                              </span>
                            </div>
                          }
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
          </React.Fragment>
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
            position: 'absolute',
            bottom: 80,
            right: 24,
            zIndex: 1000
          }}
        />
      )}
      <div ref={endRef} />
    </div>
  );
}

export default ChatArea;