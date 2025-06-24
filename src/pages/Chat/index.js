"use client"

import { useEffect, useState } from "react"
import { Avatar, Badge, Divider, Drawer, Empty, Layout } from "antd"
import ChatSidebar from "./components/ChatSidebar"
import ChatArea from "./components/ChatArea"
import ChatInput from "./components/ChatInput"
import "./chat.css"
import { ArrowLeftOutlined, LeftOutlined, MenuOutlined, TeamOutlined } from "@ant-design/icons"
import { getUsers } from "../../api"
import { getChatList, sendMessage, uploadFiles } from "../../api/ui/chat"
import { useProfile } from "../../components/hooks/UserHooks"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import echo from "../../helpers/echo"

const { Header, Sider, Content } = Layout

function Chat() {
  const { chat_id } = useParams();
  const { userProfile } = useProfile();
  const [activeRoom, setActiveRoom] = useState()

  const [collapsedSidebar, setCollapsedSidebar] = useState({ width: 320, showBtn: false });

  // Real-time subscription
  useEffect(() => {
    if (!chat_id) return;
    const channel = echo.private(`chat.${chat_id}`);
    channel.listen('MessageSent', e => {
      console.log(e);
      const msg = {
        ...e,
        isMine: e.sender.username === userProfile.username,
      };
      setNewestMessage(msg);
    });
    channel.error(err => {
      console.error('Echo error:', err);
    });
    return () => {
      channel.stopListening('MessageSent');
      echo.leave(`chat.${chat_id}`);  // hoặc echo.leaveChannel(...) tùy phiên bản
    };
  }, [chat_id]);

  const [users, setUsers] = useState([]);
  const fecthUser = async () => {
    var res = await getUsers();
    setUsers(res.filter(e => e.username !== userProfile?.username).map((e, i) => ({ ...e, value: e.id, label: (`${e.name} - ID: ${e.username}`), key: i })))
  }

  const [chatList, setChatList] = useState([]);
  const fetchChatList = async () => {
    var res = await getChatList();
    setChatList(res.data);
  }

  useEffect(() => {
    fecthUser();
    fetchChatList();
  }, []);

  useEffect(() => {
    const room = chatList.find(e => e.id === chat_id);
    if (room) {
      setActiveRoom(room);
    }
  }, [chat_id, chatList]);

  const refreshSidebar = async () => {
    fetchChatList();
  }

  const [newestMessage, setNewestMessage] = useState();
  const handleSendMessage = async (message) => {
    console.log("Gửi tin nhắn:", message)
    console.log("Đến:", activeRoom?.name)
    console.log("Loại chat:", activeRoom?.type)
    // Tạo form data để gửi
    const formData = new FormData();
    formData.append("chat_id", activeRoom?.id);
    formData.append("content_json", JSON.stringify(message.content_json));
    formData.append("content_text", message.content_text);
    if((message.images ?? []).length > 0){
      formData.append("type", 'image');
    }else{
      formData.append("type", 'text');
    }
    (message.images ?? []).forEach((img, idx) => {
      formData.append(`files[${idx}]`, img);
    });
    (message.mentions ?? []).forEach((user, idx) => {
      formData.append(`mentions[${idx}]`, user);
    });
    var res = await sendMessage(formData, activeRoom?.id);
    if (res?.success && res?.data) {
      setNewestMessage(res.data);
    }
  }

  const handleSendFileMessage = async (file) => {
    // Tạo form data để gửi
    const formData = new FormData();
    formData.append("chat_id", activeRoom?.id);
    formData.append("type", 'file');
    formData.append(`files[0]`, file);
    var res = await sendMessage(formData, activeRoom?.id);
    if (res?.success && res?.data) {
      setNewestMessage(res.data);
    }
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
        onCollapse={(collapsed, type) => {
          if (!collapsed) {
            setCollapsedSidebar({ ...collapsedSidebar, showBtn: false, showDrawer: false, sidebarState: 'hidden' })
          } else {
            setCollapsedSidebar({ ...collapsedSidebar, showBtn: false, showDrawer: false, sidebarState: 'show' })
          }
        }}
      >
        <ChatSidebar
          users={users}
          chatList={chatList}
          refresh={refreshSidebar}
        />
      </Sider>
      {!activeRoom?.id ?
        <Content style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Empty
            description="No chat selected yet. Start a conversation!"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}
          />
        </Content>
        :
        <Layout style={{ position: 'relative', overflowY: 'hidden' }}>
          <Drawer
            placement="left"
            getContainer={false}
            open={collapsedSidebar.showDrawer}
            styles={{ body: { padding: 0 }, header: { display: 'none' } }}
            onClose={() => setCollapsedSidebar({ ...collapsedSidebar, showBtn: true, showDrawer: false })}
          >
            <ChatSidebar
              users={users}
              chatList={chatList}
              refresh={refreshSidebar}
              isShowingDrawer={collapsedSidebar.showDrawer}
              onClose={() => setCollapsedSidebar({ ...collapsedSidebar, showBtn: true, showDrawer: false })}
            />
          </Drawer>
          <Header style={{ background: "#fff", padding: "0 16px", borderBottom: "1px solid #f0f0f0", display: 'flex', alignItems: 'center' }}>
            {collapsedSidebar.sidebarState === 'show' && <MenuOutlined style={{ fontSize: 18, marginRight: 8 }} onClick={() => setCollapsedSidebar({ ...collapsedSidebar, showBtn: true, showDrawer: true })} />}
            <h1 style={{ margin: 0, fontSize: "18px", display: 'flex', alignItems: 'center' }}>
              {activeRoom && <Badge
                dot={activeRoom.type === "private" && activeRoom.isOnline}
                status={activeRoom.type === "private" && activeRoom.isOnline ? "success" : "default"}
                offset={[-8, 32]}
              >
                <Avatar size={48} src={activeRoom.avatar} icon={activeRoom.type === "group" ? <TeamOutlined /> : undefined}>
                  {activeRoom.type === "group" ? <TeamOutlined /> : activeRoom?.name?.charAt(0)}
                </Avatar>
              </Badge>} <span style={{ marginLeft: 8 }}>{activeRoom?.name}</span>
            </h1>
          </Header>
          <Divider style={{ margin: 0 }} />
          <Content style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <ChatArea chatId={activeRoom?.id} chat={activeRoom} newMessage={newestMessage} />
            <ChatInput onSendMessage={handleSendMessage} onSendFileMessage={handleSendFileMessage} chatUsers={activeRoom.participants ?? []}/>
          </Content>
        </Layout>
      }
    </Layout>
  )
}

export default Chat
