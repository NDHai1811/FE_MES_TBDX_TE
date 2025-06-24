"use client"

import React, { useEffect, useRef, useState } from "react"
import { Layout, Menu, Button, Modal, Input, Typography, Select, Form, Tabs, Badge, Avatar, Divider } from "antd"
import { TeamOutlined, MessageOutlined, PlusOutlined, GroupOutlined, SearchOutlined, MoreOutlined, UserOutlined, UserAddOutlined, UsergroupAddOutlined, LeftOutlined, CloseOutlined } from "@ant-design/icons"
import { getUsers } from "../../../api"
import { createChat, getChatList } from "../../../api/ui/chat"
import { useProfile } from "../../../components/hooks/UserHooks"
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min"
import ChatListItem from "./ChatListItem"

const { Sider, Header } = Layout
const { Title, Text } = Typography

function ChatSidebar({users, chatList, refresh, isShowingDrawer = false, onClose}) {
  const history = useHistory();
  const { chat_id } = useParams();
  const [loadingCreate, setLoadingCreate] = useState(false);

  const handleCreatePrivateChat = async (values) => {
    setLoadingCreate(true);
    const params = { ...values, type: 'private', recipient_id: values.user_chat }
    var res = await createChat(params);
    if (res.success && res?.data?.id) {
      await refresh();
      history.push('/ui/chat/' + res.data.id);
    }
    setIsModalCreatePrivateChatOpen(false);
    setLoadingCreate(false);
  }

  const handleCreatePublicChat = async (values) => {
    setLoadingCreate(true);
    const params = { ...values, type: 'group', members: values.user_chat }
    var res = await createChat(params);
    if (res.success && res?.data?.id) {
      await refresh();
      history.push('/ui/chat/' + res.data.id);
    }
    setIsModalCreatePublicChatOpen(false);
    setLoadingCreate(false);
  }

  const [formPrivateChat] = Form.useForm();
  const [formPublicChat] = Form.useForm();

  const [isModalCreatePrivateChatOpen, setIsModalCreatePrivateChatOpen] = useState(false);
  const [isModalCreatePublicChatOpen, setIsModalCreatePublicChatOpen] = useState(false);

  const [activeRoom, setActiveRoom] = useState();

  const [searchQuery, setSearchQuery] = useState();

  useEffect(()=>{
    const room = chatList.find(e=>e.id === chat_id);
    if(room){
      setActiveRoom(room);
    }
  }, [chat_id, chatList]);

  const onSelectChat = (chat) => {
    setActiveRoom(chat);
    history.push('/ui/chat/' + chat.id);
  }

  return (
    <React.Fragment>
      <Layout style={{ width: "100%", borderRight: "1px solid #d9d9d9", height: "100%" }}>
        <Header style={{ background: "#fff", padding: "0 16px", borderBottom: "1px solid #f0f0f0", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={4} style={{ margin: 0 }}>
            Đoạn chat
          </Title>
          <div>
            <Button icon={<UserAddOutlined />} type="text" onClick={()=>setIsModalCreatePrivateChatOpen(true)}/>
            <Button icon={<UsergroupAddOutlined />} type="text" onClick={()=>setIsModalCreatePublicChatOpen(true)}/>
            {isShowingDrawer && <CloseOutlined style={{fontSize: 18}} onClick={onClose}/>}
          </div>
        </Header>
        <Divider style={{ margin: 0 }} />
        <div style={{ padding: "16px 16px 0", borderBottom: "1px solid #f0f0f0", backgroundColor: "white", lineHeight: 0 }}>
          {/* Thanh tìm kiếm */}
          <Input
            placeholder="Tìm kiếm trong Messenger"
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: "12px", borderRadius: "20px" }}
          />
          {/* Danh sách cuộc trò chuyện */}
        </div>
        <div style={{ height: "calc(100% - 180px)", overflowY: "auto" }}>
          {chatList.map((e) => <ChatListItem chat={e} isSelected={e.id === activeRoom?.id} onClick={onSelectChat} />)}
        </div>
      </Layout>

      <Modal
        title="Tạo phòng chat riêng mới"
        open={isModalCreatePrivateChatOpen}
        onOk={() => formPrivateChat.submit()}
        confirmLoading={loadingCreate}
        onCancel={() => { setIsModalCreatePrivateChatOpen(false); formPrivateChat.resetFields(); }}
        okText="Tạo"
      >
        <Form form={formPrivateChat} onFinish={handleCreatePrivateChat}>
          <Form.Item name="user_chat">
            <Select options={users} placeholder="Nhập tên hoặc mã tài khoản" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Tạo phòng chat riêng mới"
        open={isModalCreatePublicChatOpen}
        onOk={() => formPublicChat.submit()}
        confirmLoading={loadingCreate}
        onCancel={() => { setIsModalCreatePublicChatOpen(false); formPrivateChat.resetFields(); }}
        okText="Tạo"
      >
        <Form form={formPublicChat} onFinish={handleCreatePublicChat}>
          <Form.Item name="name">
            <Input placeholder="Nhập tên phòng chat" />
          </Form.Item>
          <Form.Item name="user_chat">
            <Select mode="multiple" options={users} placeholder="Nhập tên hoặc mã tài khoản" />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  )
}

export default ChatSidebar
