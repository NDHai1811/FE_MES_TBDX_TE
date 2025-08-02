import React, { useEffect, useRef, useState, useMemo, useLayoutEffect } from "react";
import { Avatar, Button, Dropdown, Empty, FloatButton, Image, Menu, message, Modal, Popconfirm, Space, Spin, Tooltip, Typography } from "antd";
import { CommentOutlined, CopyOutlined, DeleteOutlined, DownloadOutlined, DownOutlined, EllipsisOutlined, ExclamationCircleOutlined, FileExcelOutlined, FileGifOutlined, FileImageOutlined, FileJpgOutlined, FileOutlined, FilePdfOutlined, FilePptOutlined, FileWordOutlined, FileZipOutlined, LeftOutlined, PaperClipOutlined, PictureOutlined, RetweetOutlined, RightOutlined, RotateLeftOutlined, RotateRightOutlined, SwapOutlined, UndoOutlined, UserOutlined, ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { deleteMessage, downloadFileMsg, getMessages, markAsRead, recallMsg } from "../../../api/ui/chat";
import { useProfile } from "../../../components/hooks/UserHooks";
import { baseURL } from "../../../config";
import MessageViewer from "./MessageViewer";
import { displayIconFileType, downloadFile, fullNameToColor } from "../chat_helper";
import echo from "../../../helpers/echo";
import { useDispatch, useSelector } from "react-redux";
import { recallMessage, resetUnread, setMessagesInActiveChat } from "../../../store/chat/chatSlice";

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
function ChatArea({ onReplyMessage }) {
  const dispatch = useDispatch();
  const {userProfile} = useProfile();
  const messages = useSelector(state => state.chatSlice.messagesInActiveChat ?? []);
  const {activeChat} = useSelector(state => state.chatSlice);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);
  const showScrollBtn = useRef(false);
  const [isShowScrollBtn, setIsShowScrollBtn] = useState(false);
  const endRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const mustFixedAtCurrentPosition = useRef(false);
  const prevScrollHeightRef = useRef(0);
  const prevScrollTopRef = useRef(0);
  const isLoadPreviousMessages = useRef(false);

  // useEffect(()=>{
  //   console.log(messages);
  // }, [messages])

  useEffect(()=>{
    mustFixedAtCurrentPosition.current = isShowScrollBtn;
  }, [isShowScrollBtn])

  // Fetch history messages
  useEffect(() => {
    // setMessages([]);
    async function fetchMessages() {
      setLoading(true);
      const res = await getMessages({ chat_id: activeChat?.id, limit: 20 });
      if(res.success){
        dispatch(setMessagesInActiveChat(res.data));
        if (res.data.length) {
          setHasMore(res.data.length === 20);
        } else {
          setHasMore(false);
        }
        mustFixedAtCurrentPosition.current = false;
      }
      setLoading(false);
    }
    if(activeChat?.id) fetchMessages();
  }, [activeChat, dispatch]);

  const loadMoreMessages = async () => {
    if (loadingOlder || !hasMore) return;
    const container = containerRef.current;
    if (!container) return;
    setLoadingOlder(true);
    prevScrollHeightRef.current = container.scrollHeight;
    // prevScrollTopRef.current = container.scrollTop;
    const res = await getMessages({ chat_id: activeChat?.id, before: messages[0].id ?? '', limit: 20 });
    const older = (res.data ?? [])
    if (older.length) {
      dispatch(setMessagesInActiveChat([...older, ...messages]));
      setHasMore(older.length === 20);
    } else {
      setHasMore(false);
    }
    setLoadingOlder(false);
    mustFixedAtCurrentPosition.current = true;
    isLoadPreviousMessages.current = true;
  };

  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;
      prevScrollHeightRef.current = container.scrollHeight;
      prevScrollTopRef.current = container.scrollTop;
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [reading, setReading] = useState(false);
  const handleReadMessage = async () => {
    let lastMessage = messages[messages.length - 1] ?? null;
    if(!reading && lastMessage){
      setReading(true);
      var res = await markAsRead({message_id: lastMessage.id, chat_id: activeChat?.id}, activeChat?.id);
      if(res.success){
        dispatch(resetUnread(activeChat?.id))
      }
      setReading(false);
    }
  }

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
    if (mustFixedAtCurrentPosition.current) {
      console.log('fixed position');
      const deltaHeight = container.scrollHeight - prevScrollHeightRef.current;
      container.scrollTop = prevScrollTopRef.current + (isLoadPreviousMessages.current ? deltaHeight : 0);
    } else {
      console.log('scoll to bottom at first')
      container.scrollTop = container.scrollHeight;
      setTotalImages(imgs.length);
      setImagesLoaded(0);
      handleReadMessage();
    }
    isLoadPreviousMessages.current = false;
  }, [messages]);

  // Scroll handler
  const isAtBottomRef = useRef(false);
  const handleScroll = (e) => {
    if (e.currentTarget.scrollTop < 100) {
      loadMoreMessages();
    }
    const atBottom = e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight - 2;
    // Chỉ log khi vừa chạm đáy (trước đó chưa ở đáy)
    if (atBottom && !isAtBottomRef.current) {
      handleReadMessage();
    }
    isAtBottomRef.current = atBottom;
    const showBtn = e.currentTarget.scrollHeight - e.currentTarget.scrollTop > e.currentTarget.clientHeight + 200;
    showScrollBtn.current = showBtn;
    setIsShowScrollBtn(showBtn);
    prevScrollHeightRef.current = e.currentTarget.scrollHeight;
    prevScrollTopRef.current = e.currentTarget.scrollTop;
    // console.log('prevScrollHeightRef', prevScrollHeightRef.current);
    // console.log('prevScrollTopRef', prevScrollTopRef.current);
  };

  const scrollToBottom = () => {
    const el = containerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    dispatch(resetUnread(activeChat?.id))
    showScrollBtn.current = false;
    setIsShowScrollBtn(false);
    // handleReadMessage();
  };

  // Nhóm tin nhắn theo ngày rồi nhóm theo người gửi
  const groups = useMemo(() => {
    if(!messages || !messages?.length) return {};
    console.log(messages);
    const result = {};
    messages?.forEach(msg => {
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

  const recall = async (id) => {
    Modal.confirm({
      title: 'Bạn có chắc muốn thu hồi tin nhắn này?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const res = await recallMsg(id, activeChat?.id);
        if(res.success){
          dispatch(recallMessage({...res.data, isMine: res.data.sender_id == userProfile?.id}));
        }
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
        onClick: () => recall(msg.id),
        hidden: !msg.isMine
      },
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
                        // marginRight: isMineGroup ? 0 : 8,
                        // marginLeft: isMineGroup ? 8 : 0,
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
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: '100%', gap: 6 }}>
                      {group.items.map((msg, i) => {
                        const isHovered = hoveredMsgId === msg.id;
                        return (
                          <div
                            key={msg.id}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isMine ? 'flex-end' : 'flex-start', position: 'relative' }}
                            onMouseEnter={() => setHoveredMsgId(msg.id)}
                            onMouseLeave={() => setHoveredMsgId(null)}
                          >
                            {!msg.deleted_at ?
                              <div style={{ maxWidth: '70%', position: 'relative', display: 'flex', flexDirection: msg.isMine ? 'row-reverse' : 'row', alignItems: 'center' }}>
                                {/* Message bubble */}
                                <div
                                  style={{
                                    background: msg.content_text ? (msg.isMine ? '#1890ff' : '#f8f9fa') : '',
                                    color: msg.isMine ? '#fff' : '#000',
                                    padding: msg.content_text ? '8px 12px' : '',
                                    borderRadius: 8,
                                    marginBottom: 0,
                                    width: '100%',
                                    position: 'relative',
                                    // minWidth: 60,
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
                                        {msg?.reply_to?.attachments?.length > 0
                                          ? (
                                            msg?.reply_to.attachments[0].type === 'image'
                                              ? <><PictureOutlined /> Hình ảnh</>
                                              : <><PaperClipOutlined />{msg?.reply_to.attachments[0].file_name ?? ''}</>
                                          )
                                          : msg?.reply_to?.content_text
                                        }
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
                                      // marginBottom: 8,
                                      display: 'grid',
                                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 2fr))',
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
                                            style={{ maxWidth: '100%', border: '1px solid #00000020', borderRadius: 8, height: '100%', aspectRatio: '4/3', objectFit: 'cover' }}
                                          />
                                        ))}
                                      </Image.PreviewGroup>
                                    </div>
                                  }
                                  {/* File attachments */}
                                  {(msg.attachments ?? []).filter(e => e.type === 'file').length > 0 &&
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
        {isShowScrollBtn && (
          <FloatButton
            size="large"
            shape="circle"
            icon={<DownOutlined />}
            onClick={scrollToBottom}
            style={{
              position: 'fixed',
              right: 24,
              bottom: 80,
              zIndex: 1000
            }}
          />
        )}
        <div ref={endRef} />
      </div>
  );
}

export default ChatArea;