import React, { useEffect, useRef, useState, useMemo, useLayoutEffect } from "react";
import { Avatar, Button, Dropdown, Empty, Image, Menu, message, Modal, Popconfirm, Space, Spin, Tooltip, Typography } from "antd";
import { CommentOutlined, CopyOutlined, DeleteOutlined, DownloadOutlined, DownOutlined, EllipsisOutlined, ExclamationCircleOutlined, FileExcelOutlined, FileGifOutlined, FileImageOutlined, FileJpgOutlined, FileOutlined, FilePdfOutlined, FilePptOutlined, FileWordOutlined, FileZipOutlined, LeftOutlined, PaperClipOutlined, PictureOutlined, RetweetOutlined, RightOutlined, RotateLeftOutlined, RotateRightOutlined, SwapOutlined, UndoOutlined, UserOutlined, ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { deleteMessage, downloadFileMsg, getMessages, markAsRead, recallMessage } from "../../../api/ui/chat";
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
function ChatArea({ chatId, chat, setChat, sentMessage, onReplyMessage }) {
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
  const [hoveredMsgId, setHoveredMsgId] = useState(null);

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

  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  useEffect(() => {
    if (totalImages === 0) return;
    const container = containerRef.current;
    if (!container) return;
    const imgs = container.querySelectorAll('img');
    imgs.forEach(img => {
      img.onload = () => {
        setImagesLoaded(prev => prev + 1);
      };
      // Nếu ảnh đã cache sẵn
      if (img.complete) {
        setImagesLoaded(prev => prev + 1);
      }
    });
  }, [totalImages]);

  useEffect(() => {
    if (totalImages > 0 && imagesLoaded >= totalImages) {
      const container = containerRef.current;
      if (!container) return;
      container.scrollTop = container.scrollHeight;
    }
  }, [imagesLoaded, totalImages]);

  // ⏳ Chờ ảnh load xong rồi mới scroll
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const imgs = container.querySelectorAll('img');
    if (!hasRefresh.current) {
      const deltaHeight = container.scrollHeight - prevScrollHeightRef.current;
      container.scrollTop = prevScrollTopRef.current + deltaHeight;
    } else {
      setTotalImages(imgs.length);
      setImagesLoaded(0);
      container.scrollTop = container.scrollHeight;
    }
    hasRefresh.current = false;
  }, [messages]);

  // Scroll handler
  const handleScroll = (e) => {
    if (e.currentTarget.scrollTop === 0) {
      loadMoreMessages();
    }
    const atBottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= e.currentTarget.clientHeight + 200;
    setShowScrollBtn(!atBottom);
  };

  const scrollToBottom = () => {
    const el = containerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    setChat({ ...chat, unread_count: 0 })
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
    const channel = echo.private(`user.${userProfile?.id}`)
    //Listen Event Message Sent
    channel.listen('MessageSent', msg => {
      console.log(msg);

      if (msg.sender_id == userProfile.id) return;
      if (msg.chat_id === chatId) {
        setIncomingMessage(msg);
      }
    });
    channel.listen('MessageRecall', msg => {
      setMessages(prev => prev.map(e => e.id === msg.id ? { ...msg, isMine: msg.sender_id == userProfile?.id } : e));
    });
    return () => {
      channel.stopListening('MessageSent');
      channel.stopListening('MessageRecall');
      echo.leave(`chat.${chatId}`);  // hoặc echo.leaveChannel(...) tùy phiên bản
    };
  }, [chatId, userProfile?.id]);

  //Update messages when receiving new message
  useEffect(() => {
    if (!incomingMessage) return;
    setMessages(prev => {
      if (prev.some(e => e.id === incomingMessage.id)) {
        return prev;
      }
      return [...prev, { ...incomingMessage, isMine: incomingMessage.sender_id == userProfile?.id }];
    });
  }, [incomingMessage, userProfile?.id]);

  useEffect(() => {
    if (!sentMessage) return;
    setMessages(prev => {
      if (prev.some(e => e.id === sentMessage.id)) {
        return prev;
      }
      return [...prev, { ...sentMessage, isMine: sentMessage.sender_id == userProfile?.id }];
    });
  }, [sentMessage]);

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

  const deleteMsg = async (id, chatId) => {
    const res = await deleteMessage(id, chatId);
    if (res.success) {
      setMessages(prev => prev.filter(e => e.id !== id));
    }
  }

  const recall = async (id, chatId) => {
    Modal.confirm({
      title: 'Bạn có chắc muốn thu hồi tin nhắn này?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const res = await recallMessage(id, chatId);
        setMessages(prev => prev.map(e => e.id === id ? { ...res.data, isMine: res.data.sender_id == userProfile?.id } : e));
      },
      centered: true,
    });

  }

  const contentMenu = (msg) => ({
    items: [
      {
        key: "reply",
        icon: <CommentOutlined style={{ fontSize: 16 }} />,
        label: "Trả lời",
        onClick: () => {
          onReplyMessage(msg);
        },
      },
      {
        key: "copy",
        icon: <CopyOutlined style={{ fontSize: 16 }} />,
        label: "Copy",
        onClick: () => {
          navigator.clipboard.writeText(msg.content_text);
          message.success('Copied to clipboard');
        },
        hidden: !msg.content_text
      },
      {
        key: "recall",
        icon: <UndoOutlined style={{ fontSize: 16 }} />,
        label: 'Thu hồi',
        style: {
          color: 'red'
        },
        onClick: () => recall(msg.id, chatId),
        hidden: !msg.isMine
      },
      // {
      //   key: "delete",
      //   label: <Popconfirm title="Bạn có chắc muốn xoá tin nhắn này?" arrow={false} onConfirm={() => deleteMsg(msg.id)}><span style={{ width: '100%', display: 'flex' }}><DeleteOutlined /> Xoá</span></Popconfirm>,
      //   style: {
      //     color: 'red'
      //   },
      //   hidden: !msg.isMine
      // },
    ].filter(e => !e.hidden)
  });

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
                      {group?.sender?.name}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: isMineGroup ? "row-reverse" : "row",
                      alignItems: "flex-start",
                      maxWidth: 'inherit',
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
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: '100%' }}>
                      {group.items.map((msg, i) => {
                        const isHovered = hoveredMsgId === msg.id;
                        return (
                          <div
                            key={msg.id}
                            style={{ marginBottom: 4, display: 'flex', flexDirection: 'column', alignItems: msg.isMine ? 'flex-end' : 'flex-start', position: 'relative' }}
                            onMouseEnter={() => setHoveredMsgId(msg.id)}
                            onMouseLeave={() => setHoveredMsgId(null)}
                          >
                            {!msg.deleted_at ?
                              <div style={{ maxWidth: '70%', position: 'relative', display: 'flex', flexDirection: msg.isMine ? 'row-reverse' : 'row', alignItems: 'center' }}>
                                {/* Message bubble */}
                                <div
                                  style={{
                                    background: msg.content_text ? (msg.isMine ? '#1890ff' : '#f0f0f0'): '',
                                    color: msg.isMine ? '#fff' : '#000',
                                    padding: '8px 12px',
                                    borderRadius: 8,
                                    marginBottom: 0,
                                    width: '100%',
                                    position: 'relative',
                                    minWidth: 60,
                                    boxSizing: 'border-box',
                                    wordBreak: 'break-word',
                                  }}
                                >
                                  {/* Reply preview */}
                                  {msg?.reply_to && (
                                    <div style={{
                                      background: '#e6f4ff',
                                      border: '1px solid #91d5ff',
                                      borderRadius: 6,
                                      padding: 8,
                                      position: 'relative',
                                      maxWidth: '100%',
                                      justifySelf: msg.isMine ? 'flex-end' : 'flex-start',
                                      marginBottom: 6,
                                    }}>
                                      <div style={{ fontSize: 13, color: '#1890ff', fontWeight: 500, marginBottom: 2, whiteSpace: 'nowrap' }}>
                                        Trả lời {msg?.reply_to?.sender?.name || ''}
                                      </div>
                                      <div style={{
                                        color: '#00000087',
                                        fontSize: 14,
                                        marginBottom: 2,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '100%'
                                      }}>
                                        {msg?.reply_to?.type === 'image' ? <><PictureOutlined />Hình ảnh</> : msg?.reply_to?.type === 'file' ? <><PaperClipOutlined />{(msg.reply_to.attachments[0].file_name ?? '')}</> : msg.reply_to.content_text}
                                      </div>
                                    </div>
                                  )}
                                  {/* Text content */}
                                  {msg.content_text && (
                                    <div className={`message ${msg.isMine ? 'mine' : ''}`}> <MessageViewer contentJson={msg.content_json} /> </div>
                                  )}
                                  {/* Image attachments */}
                                  {(msg.attachments ?? []).filter(e => e.type === 'image').length > 0 &&
                                    <div style={{
                                      marginBottom: 8,
                                      display: 'grid',
                                      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
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
                                              <SwapOutlined rotate={90} onClick={onFlipY} />
                                              <SwapOutlined onClick={onFlipX} />
                                              <RotateLeftOutlined onClick={onRotateLeft} />
                                              <RotateRightOutlined onClick={onRotateRight} />
                                              <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                                              <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                                            </Space>
                                          ),
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
                                  {/* File attachments */}
                                  {(msg.attachments ?? []).filter(e => e.type === 'link').length > 0 &&
                                    (msg.attachments ?? []).filter(e => e.type === 'file').map(file => (
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
                                          alignItems: 'flex-end',
                                        }}
                                      >
                                        {displayIconFileType(file?.file_type)}
                                        <span
                                          style={{
                                            color: msg.isMine ? '#ffffff' : '#1890ff',
                                            textDecoration: 'underline',
                                            cursor: 'pointer',
                                            display: 'inline-block',
                                            maxWidth: '100%',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            verticalAlign: 'middle',
                                          }}
                                          title={file?.file_name}
                                        >
                                          {file?.file_name}
                                        </span>
                                        <Button type="default" icon={<DownloadOutlined style={{ fontSize: 18 }} />} size="small" style={{ marginLeft: 8 }} onClick={() => downloadFile(file)}></Button>
                                      </div>
                                    ))
                                  }
                                  {/* Action buttons on hover */}
                                  {isHovered && (
                                    <div
                                      style={{
                                        position: 'absolute',
                                        top: 8,
                                        right: msg.isMine ? 'calc(100% + 8px)' : undefined,
                                        left: !msg.isMine ? 'calc(100% + 8px)' : undefined,
                                        display: 'flex',
                                        gap: 4,
                                        zIndex: 10,
                                      }}
                                    >
                                      <Button shape="circle" size="small" onClick={() => onReplyMessage(msg)} icon={<CommentOutlined style={{ fontSize: 16 }} />} />
                                      {msg.content_text && <Button shape="circle" size="small" onClick={() => {
                                        navigator.clipboard.writeText(msg.content_text);
                                        message.success('Copied to clipboard');
                                      }} icon={<CopyOutlined style={{ fontSize: 16 }} />} />}
                                      <Dropdown menu={contentMenu(msg)} trigger={['click']} placement={msg.isMine ? 'bottomRight' : 'bottomLeft'}>
                                        <Button shape="circle" size="small" icon={<EllipsisOutlined style={{ fontSize: 16 }} />} />
                                      </Dropdown>
                                    </div>
                                  )}
                                </div>
                              </div>
                              :
                              <div style={{ maxWidth: '70%' }}>
                                <div
                                  style={{
                                    background: msg.isMine ? '#1890ff' : '#f0f0f0',
                                    color: msg.isMine ? '#fff' : '#000',
                                    padding: '8px 12px',
                                    borderRadius: 8,
                                    marginBottom: 0,
                                    width: '100%',
                                  }}
                                >
                                  <div className={`message ${msg.isMine ? 'mine' : ''}`} style={{ color: msg.isMine ? '#dbcece' : '#00000087' }}>Tin nhắn đã bị thu hồi</div>
                                </div>
                              </div>
                            }
                            {/* Timestamp */}
                            {i === group.items.length - 1 && <span style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>
                              {formatTimestamp(msg.created_at)}
                            </span>}
                          </div>
                        );
                      })}
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