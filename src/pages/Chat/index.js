"use client"

import { useEffect, useState } from "react"
import { Avatar, Badge, Button, Divider, Drawer, Empty, Layout, notification, Upload } from "antd"
import ChatSidebar from "./components/ChatSidebar"
import ChatArea from "./components/ChatArea"
import ChatInput from "./components/ChatInput"
import "./chat.css"
import { ArrowLeftOutlined, InfoCircleOutlined, InfoCircleTwoTone, InfoOutlined, LeftOutlined, MenuOutlined, TeamOutlined } from "@ant-design/icons"
import { getUsers } from "../../api"
import { getChatList, getFiles, sendMessage, uploadFiles } from "../../api/ui/chat"
import { useProfile } from "../../components/hooks/UserHooks"
import { useHistory, useParams, withRouter } from "react-router-dom/cjs/react-router-dom.min"
import echo from "../../helpers/echo"
import ChatInfo from "./components/ChatInfo"
import { fullNameToColor } from "./chat_helper"
import ChatWithDragDrop from "./components/ChatWithDragDrop";
import { useDispatch, useSelector } from 'react-redux';
import { resetUnread, setActiveChat, setChats, setMessagesInActiveChat } from "../../store/chat/chatSlice"

const { Header, Sider, Content } = Layout

function Chat() {
  const dispatch = useDispatch();
  const {chats, activeChat} = useSelector(state => state.chatSlice);
  document.title = "Chat - MES UI";
  const { chat_id } = useParams();
  const history = useHistory();
  const { userProfile } = useProfile();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  // Real-time subscription
  useEffect(() => {
    if (!chat_id) return;
    echo.join(`presence-chat.${chat_id}`) // Presence channel
      .here((users) => {
        console.log('Người đang trong đoạn chat:', users);
      })
      .joining((user) => {
        console.log('User vừa vào:', user);
      })
      .leaving((user) => {
        console.log('User rời đi:', user);
      })
      .listenForWhisper('activeChat', (payload) => {
        console.log(`${payload.user_name} đang xem đoạn chat ${payload.chat_id}`);
      });
    return () => {
      echo.leave(`chat.${chat_id}`);  // hoặc echo.leaveChannel(...) tùy phiên bản
    };
  }, [chat_id]);

  const [users, setUsers] = useState([]);
  const fecthUser = async () => {
    var res = await getUsers();
    setUsers(res.map((e, i) => ({ ...e, value: e.id, label: (`${e.name} - ID: ${e.username}`), key: i })))
  }

  const [loadingChatList, setLoadingChatList] = useState(false);
  const fetchChatList = async () => {
    if(loadingChatList) return;
    setLoadingChatList(true);
    var res = await getChatList();
    dispatch(setChats(res.data ?? []));
    setLoadingChatList(false);
  }

  // Fetch users và chat list lần đầu
  useEffect(() => {
    fecthUser();
    fetchChatList();
  }, [dispatch]);

  // Fetch chat list khi chat_id thay đổi
  useEffect(() => {
    // Luôn fetch chat list khi chat_id thay đổi, kể cả khi chat_id là null
    fetchChatList();
  }, [chat_id]);

  // Kiểm tra và điều hướng sau khi có chat list
  useEffect(() => {
    if (chats.length > 0 && chat_id) {
      const chatExists = chats.find(e => e.id === chat_id);
      if (!chatExists) {
        // Nếu chat_id không tồn tại, reset activeChat và messages, chuyển về trang chat chính
        dispatch(setActiveChat(null));
        dispatch(setMessagesInActiveChat([]));
        history.push('/ui/chat');
      }
    }
  }, [chats, chat_id, history, dispatch]);

  useEffect(() => {
    if(chat_id === activeChat?.id) return;
    
    // Nếu không có chat_id, reset activeChat và messages
    if (!chat_id) {
      dispatch(setActiveChat(null));
      dispatch(setMessagesInActiveChat([]));
      return;
    }
    
    const room = chats.find(e => e.id === chat_id);
    if (room) {
      dispatch(setActiveChat(room));
      dispatch(resetUnread(room.id));
    } else {
      // Nếu không tìm thấy room trong chats, reset activeChat và messages
      dispatch(setActiveChat(null));
      dispatch(setMessagesInActiveChat([]));
    }
  }, [chat_id, chats, dispatch]);

  // Cập nhật activeChat ngay khi chat_id thay đổi và có chats
  useEffect(() => {
    if (!chat_id || chats.length === 0) return;
    
    const room = chats.find(e => e.id === chat_id);
    if (room && room.id !== activeChat?.id) {
      dispatch(setActiveChat(room));
      dispatch(resetUnread(room.id));
    }
  }, [chat_id, chats, activeChat, dispatch]);

  let localInfoChat = JSON.parse(localStorage.getItem('infoChat')) ?? {};
  const [showChatInfo, setShowChatInfo] = useState(localInfoChat?.open ?? false);

  const onToggleChatInfo = () => {
    setShowChatInfo(!showChatInfo);
  }

  useEffect(() => {
    let localInfoChat = JSON.parse(localStorage.getItem('infoChat')) ?? {};
    localInfoChat['open'] = showChatInfo;
    localStorage.setItem('infoChat', JSON.stringify(localInfoChat))
  }, [showChatInfo])

  useEffect(() => {
    const handleResize = () => {
      if (!isMobile && window.innerWidth <= 992) {
        setOpenDrawer(false);
        setShowChatInfo(false);
      }
      setIsMobile(window.innerWidth <= 992);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const [replyMessage, setReplyMessage] = useState(null);
  const onReplyMessage = (msg) => {
    setReplyMessage(msg);
  }

  const [lastMessage, setLastMessage] = useState(null);
  const [lastRecalledMessage, setLastRecalledMessage] = useState(null);

  // Reset lastMessage and lastRecalledMessage after processing
  useEffect(() => {
    if (lastMessage) {
      // Reset after a short delay to ensure all components have processed it
      const timer = setTimeout(() => {
        setLastMessage(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (lastRecalledMessage) {
      // Reset after a short delay to ensure all components have processed it
      const timer = setTimeout(() => {
        setLastRecalledMessage(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [lastRecalledMessage]);

  const [pendingFiles, setPendingFiles] = useState([]);
  const handleFilesDropped = (files) => {
    const newFiles = Array.from(files).map((file, index) => ({
      uid: `${Date.now()}-${index}`,
      name: file.name,
      status: 'done',      // để AntD hiển thị luôn
      originFileObj: file,
      url: URL.createObjectURL(file), // preview ảnh
    }));
    setPendingFiles((prev) => [...prev, ...newFiles]);
  };
  const handleRemoveFile = (file) => {
    setPendingFiles((prev) => prev.filter((f) => f.uid !== file.uid));
  };
  return (
    <Layout style={{ height: "100%" }}>
      <Sider width={320} style={{
        color: '#fff',
        overflow: 'auto',
        height: '100%',
      }}
        breakpoint="lg"
        collapsedWidth={0}
      >
        {isMobile ?
          (
            <Drawer
              placement="left"
              width={320}
              getContainer={() => document.getElementById('chat-content-layout')}
              rootStyle={{ position: 'absolute' }}
              open={openDrawer}
              styles={{ body: { padding: 0 }, header: { display: 'none' } }}
              onClose={() => setOpenDrawer(false)}
            >
              <ChatSidebar
                users={users}
                isShowingDrawer={openDrawer}
                onClose={() => setOpenDrawer(false)}
                loading={loadingChatList}
              />
            </Drawer>
          )
          :
          (
            <ChatSidebar
              users={users}
              isShowingDrawer={openDrawer}
              onClose={() => setOpenDrawer(false)}
              loading={loadingChatList}
            />
          )}
      </Sider>
      <Layout style={{ position: 'relative', overflowY: 'hidden' }} id="chat-content-layout">
        <Header style={{ background: "#fff", padding: "0 16px", borderBottom: "1px solid #f0f0f0", display: 'flex', alignItems: 'center' }}>
          {isMobile &&
            <MenuOutlined style={{ fontSize: 18, marginRight: 8 }} onClick={() => setOpenDrawer(true)} />
          }
          {activeChat && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <h1 style={{ margin: 0, fontSize: "18px", display: 'flex', alignItems: 'center' }}>
              <Badge
                dot={activeChat.type === "private" && activeChat.isOnline}
                status={activeChat.type === "private" && activeChat.isOnline ? "success" : "default"}
                offset={[-8, 32]}
              >
                <Avatar size={48} src={activeChat.avatar} icon={activeChat.type === "group" ? <TeamOutlined /> : undefined} style={{ backgroundColor: fullNameToColor(activeChat?.name) }}>
                  {activeChat.type === "group" ? <TeamOutlined /> : activeChat?.name?.trim().split(/\s+/).pop()[0].toUpperCase()}
                </Avatar>
              </Badge>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ marginLeft: 8 }}>{activeChat?.name}</span>
                {activeChat.type === "group" && <span style={{ fontSize: '13px', color: '#888', marginLeft: 8 }}>
                  {(activeChat.participants?.length ?? 0)} thành viên
                </span>}
              </div>
            </h1>
            <div className="flex items-center gap-2">
              {showChatInfo ? <InfoCircleTwoTone style={{ fontSize: 18 }} onClick={onToggleChatInfo} /> : <InfoCircleOutlined style={{ fontSize: 18 }} onClick={onToggleChatInfo} />}
            </div>
          </div>}
        </Header>
        <Divider style={{ margin: 0 }} />
        {!activeChat ?
          <Content style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Empty
              description="No chat selected yet. Start a conversation!"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}
            />
          </Content>
          :
          <Content style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
            <ChatWithDragDrop onFilesDropped={handleFilesDropped}>
              <ChatArea onReplyMessage={onReplyMessage} />
              <ChatInput
                chat={activeChat}
                // onSendMessage={handleSendMessage}
                chatUsers={activeChat.participants ?? []}
                replyMessage={replyMessage}
                setReplyMessage={setReplyMessage}
                pendingFiles={pendingFiles}
                setPendingFiles={setPendingFiles}
                handleRemoveFile={handleRemoveFile}
              />
            </ChatWithDragDrop>
          </Content>
        }
      </Layout>
      {activeChat && (isMobile ?
        (
          <Drawer
            placement="right"
            width={320}
            getContainer={() => document.getElementById('chat-content-layout')}
            rootStyle={{ position: 'absolute' }}
            open={showChatInfo}
            styles={{ body: { padding: 0 }, header: { display: 'none' } }}
            onClose={() => setShowChatInfo(false)}
          >
            <ChatInfo isOpen={showChatInfo} setIsOpen={setShowChatInfo} users={users} />
          </Drawer>
        )
        :
        (
          <ChatInfo isOpen={showChatInfo} setIsOpen={setShowChatInfo} users={users}/>
        )
      )}
    </Layout>
  )
}

export default withRouter(Chat);
