"use client"

import { useEffect, useState } from "react"
import { Avatar, Badge, Button, Divider, Drawer, Empty, Layout, notification } from "antd"
import ChatSidebar from "./components/ChatSidebar"
import ChatArea from "./components/ChatArea"
import ChatInput from "./components/ChatInput"
import "./chat.css"
import { ArrowLeftOutlined, InfoCircleOutlined, InfoOutlined, LeftOutlined, MenuOutlined, TeamOutlined } from "@ant-design/icons"
import { getUsers } from "../../api"
import { getChatList, getFiles, sendMessage, uploadFiles } from "../../api/ui/chat"
import { useProfile } from "../../components/hooks/UserHooks"
import { useParams, withRouter } from "react-router-dom/cjs/react-router-dom.min"
import echo from "../../helpers/echo"
import ChatInfo from "./components/ChatInfo"
import { fullNameToColor } from "./chat_helper"

const { Header, Sider, Content } = Layout
document.title = "Chat - MES UI";

function Chat() {
  const { chat_id } = useParams();
  const { userProfile } = useProfile();
  const [activeRoom, setActiveRoom] = useState()

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
    setUsers(res.filter(e => e.username !== userProfile?.username).map((e, i) => ({ ...e, value: e.id, label: (`${e.name} - ID: ${e.username}`), key: i })))
  }

  const [chatList, setChatList] = useState([]);
  const [loadingChatList, setLoadingChatList] = useState(false);
  const fetchChatList = async () => {
    setLoadingChatList(true);
    var res = await getChatList();
    setChatList(res.data);
    setLoadingChatList(false);
  }

  useEffect(() => {
    fecthUser();
    fetchChatList();
  }, []);

  useEffect(() => {
    const room = chatList.find(e => e.id === chat_id);
    if (room) {
      setActiveRoom(room);
      fetchFilesInChat();
    }
  }, [chat_id, chatList]);

  const [mediaChat, setMediaChat] = useState();
  const fetchFilesInChat = async () => {
    if (chat_id) {
      var res = await getFiles({}, chat_id);
      if (res.success) {
        setMediaChat(res.data);
      }
    }
  }

  const refreshSidebar = async () => {
    fetchChatList();
  }

  const [sentMessage, setSentMessage] = useState();
  const handleSendMessage = async (message) => {
    // Tạo form data để gửi
    const formData = new FormData();
    formData.append("chat_id", activeRoom?.id);
    formData.append("content_json", JSON.stringify(message.content_json));
    formData.append("content_text", message.content_text);
    (message.images ?? []).forEach((img, idx) => {
      formData.append(`files[${idx}]`, img);
    });
    (message.mentions ?? []).forEach((user, idx) => {
      formData.append(`mentions[${idx}]`, user);
    });
    (message.links ?? []).forEach(link => {
      formData.append('links[]', link)
    });
    formData.append('reply_to_message_id', message?.reply_to_message_id ?? null);
    var res = await sendMessage(formData, activeRoom?.id);
    if(res.success && res.data){
      const msg = res.data;
      setSentMessage(msg);
      setChatList(prev => {
        const updated = prev.filter(e => e.id !== msg.chat_id);
        const updatedChat = prev.find(e => e.id === msg.chat_id);
        if (updatedChat) {
          return [
            { ...updatedChat, last_message: msg, timestamp: msg.created_at },
            ...updated
          ];
        }
        return prev;
      })
    }
  }

  const handleSendFileMessage = async (file) => {
    // Tạo form data để gửi
    const formData = new FormData();
    formData.append("chat_id", activeRoom?.id);
    formData.append("type", 'file');
    formData.append(`files[0]`, file);
    var res = await sendMessage(formData, activeRoom?.id);
    if(res.success && res.data){
      const msg = res.data;
      setSentMessage(msg);
      setChatList(prev => {
        const updated = prev.filter(e => e.id !== msg.chat_id);
        const updatedChat = prev.find(e => e.id === msg.chat_id);
        if (updatedChat) {
          return [
            { ...updatedChat, last_message: msg, timestamp: msg.created_at },
            ...updated
          ];
        }
        return prev;
      })
    }
  }

  let localInfoChat = JSON.parse(localStorage.getItem('infoChat')) ?? {};
  const [showChatInfo, setShowChatInfo] = useState(localInfoChat?.open ?? false);

  const onToggleChatInfo = () => {
    setShowChatInfo(!showChatInfo);
  }

  useEffect(()=>{
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
                chatList={chatList}
                refresh={refreshSidebar}
                isShowingDrawer={openDrawer}
                onClose={() => setOpenDrawer(false)}
                loading={loadingChatList}
                setChatList={setChatList}
              />
            </Drawer>
          )
          :
          (
            <ChatSidebar
              users={users}
              chatList={chatList}
              refresh={refreshSidebar}
              isShowingDrawer={openDrawer}
              onClose={() => setOpenDrawer(false)}
              loading={loadingChatList}
              setChatList={setChatList}
            />
          )}
      </Sider>
      <Layout style={{ position: 'relative', overflowY: 'hidden' }} id="chat-content-layout">
        <Header style={{ background: "#fff", padding: "0 16px", borderBottom: "1px solid #f0f0f0", display: 'flex', alignItems: 'center' }}>
          {isMobile &&
            <MenuOutlined style={{ fontSize: 18, marginRight: 8 }} onClick={() => setOpenDrawer(true)} />
          }
          {activeRoom && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <h1 style={{ margin: 0, fontSize: "18px", display: 'flex', alignItems: 'center' }}>
              <Badge
                dot={activeRoom.type === "private" && activeRoom.isOnline}
                status={activeRoom.type === "private" && activeRoom.isOnline ? "success" : "default"}
                offset={[-8, 32]}
              >
                <Avatar size={48} src={activeRoom.avatar} icon={activeRoom.type === "group" ? <TeamOutlined /> : undefined} style={{ backgroundColor: fullNameToColor(activeRoom?.name) }}>
                  {activeRoom.type === "group" ? <TeamOutlined /> : activeRoom?.name?.trim().split(/\s+/).pop()[0].toUpperCase()}
                </Avatar>
              </Badge>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ marginLeft: 8 }}>{activeRoom?.name}</span>
                {activeRoom.type === "group" && <span style={{ fontSize: '13px', color: '#888', marginLeft: 8 }}>
                  {(activeRoom.participants?.length ?? 0)} thành viên
                </span>}
              </div>
            </h1>
            <div className="flex items-center gap-2">
              <InfoCircleOutlined style={{ fontSize: 18 }} onClick={onToggleChatInfo} />
            </div>
          </div>}
        </Header>
        <Divider style={{ margin: 0 }} />
        {!activeRoom?.id ?
          <Content style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Empty
              description="No chat selected yet. Start a conversation!"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}
            />
          </Content>
          :
          <Content style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <ChatArea chatId={activeRoom?.id} chat={activeRoom} sentMessage={sentMessage} onReplyMessage={onReplyMessage}/>
            <ChatInput chat={activeRoom} onSendMessage={handleSendMessage} onSendFileMessage={handleSendFileMessage} chatUsers={activeRoom.participants ?? []} replyMessage={replyMessage} setReplyMessage={setReplyMessage} />
          </Content>
        }
      </Layout>
      { activeRoom && (isMobile ?
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
            <ChatInfo chat={activeRoom} setChat={setActiveRoom} isOpen={showChatInfo} setIsOpen={setShowChatInfo} mediaChat={mediaChat} />
          </Drawer>
        )
        :
        (
          <ChatInfo chat={activeRoom} setChat={setActiveRoom} isOpen={showChatInfo} setIsOpen={setShowChatInfo} mediaChat={mediaChat}/>
        )
      )}
    </Layout>
  )
}

export default withRouter(Chat);
