"use client"

import React, { useEffect, useRef, useState } from "react"
import { Layout, Menu, Button, Modal, Input, Typography, Select, Form, Tabs, Badge, Avatar, Divider, Radio, Checkbox, Col, Row, Skeleton } from "antd"
import { TeamOutlined, MessageOutlined, PlusOutlined, GroupOutlined, SearchOutlined, MoreOutlined, UserOutlined, UserAddOutlined, UsergroupAddOutlined, LeftOutlined, CloseOutlined, MessageTwoTone } from "@ant-design/icons"
import { getUsers } from "../../../api"
import { createChat, getChatList } from "../../../api/ui/chat"
import { useProfile } from "../../../components/hooks/UserHooks"
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min"
import ChatListItem from "./ChatListItem"
import { filterUsersByName, fullNameToColor } from "../chat_helper"
import echo from "../../../helpers/echo"

const { Sider, Header } = Layout
const { Title, Text } = Typography

function ChatSidebar({ users, chatList, setChatList, refresh, isShowingDrawer = false, onClose, loading = false }) {
  const { userProfile } = useProfile();
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
    formPrivateChat.resetFields();
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
    formPublicChat.resetFields();
    setIsModalCreatePublicChatOpen(false);
    setLoadingCreate(false);
  }

  const [formPrivateChat] = Form.useForm();
  const [formPublicChat] = Form.useForm();

  const [isModalCreatePrivateChatOpen, setIsModalCreatePrivateChatOpen] = useState(false);
  const [isModalCreatePublicChatOpen, setIsModalCreatePublicChatOpen] = useState(false);

  const [activeRoom, setActiveRoom] = useState();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const room = chatList.find(e => e.id === chat_id);
    if (room) {
      setActiveRoom(room);
    }
  }, [chat_id, chatList]);

  const onSelectChat = (chat) => {
    setChatList(prev => prev.map(e => {
      if (e.id === chat.id) {
        return { ...e, unread_count: 0 }; // Đặt số lượng tin nhắn chưa đọc về 0 khi chọn chat
      }
      return e;
    }));
    setSearchQuery('');
    history.push('/ui/chat/' + chat.id);
  }

  const userChat = Form.useWatch('user_chat', formPublicChat) ?? [];
  const chatName = Form.useWatch('name', formPublicChat) ?? [];
  const [userSearch, setNewSearch] = useState('');

  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 992);
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (userProfile?.id) {
      const channel = echo.private(`user.${userProfile?.id}`)
      channel.listen('MessageSent', msg => {
        if (msg?.sender_id == userProfile?.id) return;
        setChatList(prev => {
          const updated = prev.filter(e => e.id !== msg.chat_id);
          const updatedChat = prev.find(e => e.id === msg.chat_id);
          if (updatedChat) {
            const newChat = { ...updatedChat, last_message: msg, isMine: msg.sender_id == userProfile?.id };
            if (newChat.id !== chat_id) {
              console.log('update unread count', msg);
              newChat.unread_count = (newChat.unread_count ?? 0) + 1;
            }
            return [
              newChat,
              ...updated
            ];
          }
          return prev;
        })
      });
      channel.listen('MessageRecall', msg => {
        setChatList(prev => {
          return prev.map(e => {
            if (e.id === msg.chat_id && e.last_message?.id == msg?.id) {
              return { ...e, last_message: { ...msg, isMine: msg.sender_id == userProfile?.id } };
            }
            return e;
          });
        })
      });
      return () => {
        echo.leave(`user.${userProfile?.id}`);
      };
    }
  }, [userProfile?.id, chat_id]);

  return (
    <React.Fragment>
      <Layout style={{ width: "100%", borderRight: "1px solid #d9d9d9", height: "100%" }}>
        <Header style={{ background: "#fff", padding: "0 8px", borderBottom: "1px solid #f0f0f0", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', whiteSpace: 'break-spaces' }}>
            <MessageTwoTone style={{ fontSize: 30 }} /> Đoạn chat
          </Title>
          <div>
            <Button icon={<UserAddOutlined />} type="text" onClick={() => setIsModalCreatePrivateChatOpen(true)} />
            <Button icon={<UsergroupAddOutlined />} type="text" onClick={() => setIsModalCreatePublicChatOpen(true)} />
            {isShowingDrawer && <CloseOutlined style={{ fontSize: 18 }} onClick={onClose} />}
          </div>
        </Header>
        <Divider style={{ margin: 0 }} />
        <div style={{ padding: "8px 8px 0", borderBottom: "1px solid #f0f0f0", backgroundColor: "white", lineHeight: 0 }}>
          {/* Thanh tìm kiếm */}
          <Input
            placeholder="Tìm kiếm chat..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: "12px", borderRadius: "20px" }}
          />
          {/* Danh sách cuộc trò chuyện */}
        </div>
        <div style={{ height: '100%', overflowY: "auto" }}>
          {filterUsersByName(chatList, searchQuery).map((e) => <ChatListItem chat={e} isSelected={e.id === activeRoom?.id} onClick={onSelectChat} />)}
          {
            chatList.length === 0 && loading && (
              <>
                <Skeleton loading={loading} active avatar style={{ padding: 12 }}><ChatListItem chat={null} /></Skeleton>
                <Skeleton loading={loading} active avatar style={{ padding: 12 }}><ChatListItem chat={null} /></Skeleton>
              </>
            )
          }
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
          <div style={{
            border: '1px solid #00000020',
            borderRadius: 8,
            overflow: 'auto',
            height: 400,
            position: 'relative'
          }}>
            <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', padding: 8, zIndex: 9999 }}>
              <Input placeholder="Tìm kiếm tài khoản" value={userSearch} style={{ marginBottom: 8 }} addonBefore={<SearchOutlined />} allowClear onChange={(e) => setNewSearch(e.target.value)} />
            </div>
            <Form.Item name="user_chat">
              <Radio.Group
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  padding: '0 8px'
                }}
              >
                {filterUsersByName(users, userSearch).map(user => {
                  return <Radio {...user}>
                    {isLargeScreen && <Avatar size={40} src={user?.avatar} style={{ backgroundColor: fullNameToColor(user?.name) }}>
                      {user?.name?.trim().split(/\s+/).pop()[0].toUpperCase()}
                    </Avatar>}
                    <span
                      style={{
                        marginLeft: 8,
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        verticalAlign: 'middle'
                      }}
                      title={user?.name}
                    >
                      {user?.name}
                    </span>
                  </Radio>
                })}
              </Radio.Group>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Tạo phòng chat chung mới"
        open={isModalCreatePublicChatOpen}
        onOk={() => formPublicChat.submit()}
        confirmLoading={loadingCreate}
        onCancel={() => { setIsModalCreatePublicChatOpen(false); formPublicChat.resetFields(); }}
        okText="Tạo"
        okButtonProps={{ disabled: chatName === '' || userChat.length <= 0 }}
        width={700}
      >
        <Form form={formPublicChat} onFinish={handleCreatePublicChat} initialValues={{ user_chat: [], name: '', user_search: '' }}>
          <Form.Item name="name" rules={[{ required: true, message: 'Vui lòng nhập tên phòng chat' }]}>
            <Input placeholder="Nhập tên phòng chat" />
          </Form.Item>
          <Row gutter={8}>
            <Col span={12}>
              <div style={{
                border: '1px solid #00000020',
                borderRadius: 8,
                overflow: 'auto',
                height: 400,
                position: 'relative'
              }}>
                <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', padding: 8, zIndex: 9999 }}>
                  <p>Danh sách tài khoản</p>
                  <Form.Item noStyle>
                    <Input placeholder="Tìm kiếm tài khoản" value={userSearch} addonBefore={<SearchOutlined />} allowClear onChange={(e) => setNewSearch(e.target.value)} />
                  </Form.Item>
                </div>
                <Form.Item name="user_chat" shouldUpdate style={{ margin: '0 8px' }}>
                  <Checkbox.Group
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    {filterUsersByName(users, userSearch).map(user => {
                      return <Checkbox {...user}>
                        {isLargeScreen && <Avatar size={40} src={user?.avatar} style={{ backgroundColor: fullNameToColor(user?.name) }}>
                          {user?.name?.trim().split(/\s+/).pop()[0].toUpperCase()}
                        </Avatar>}
                        <span
                          style={{
                            marginLeft: 8,
                            display: 'inline-block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            verticalAlign: 'middle'
                          }}
                          title={user?.name}
                        >
                          {user?.name}
                        </span>
                      </Checkbox>
                    })}
                  </Checkbox.Group>
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <div style={{
                border: '1px solid #00000020',
                borderRadius: 8,
                overflow: 'auto',
                height: 400,
              }}>
                <p style={{ position: 'sticky', top: 0, backgroundColor: 'white', padding: 8, zIndex: 9999 }}>Đã chọn</p>
                <div style={{
                  margin: '0 8px',
                  gap: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}>
                  {users.filter(e => userChat.includes(e.id)).map(user => {
                    return (
                      <Checkbox value={user.id} checked onClick={() => formPublicChat.setFieldValue('user_chat', userChat.filter(e => e !== user.id))}>
                        {isLargeScreen && <Avatar size={40} src={user?.avatar} style={{ backgroundColor: fullNameToColor(user?.name) }}>
                          {user?.name?.trim().split(/\s+/).pop()[0].toUpperCase()}
                        </Avatar>}
                        <span
                          style={{
                            marginLeft: 8,
                            display: 'inline-block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            verticalAlign: 'middle'
                          }}
                          title={user?.name}
                        >
                          {user?.name}
                        </span>
                      </Checkbox>
                    )
                  })}
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal>
    </React.Fragment>
  )
}

export default ChatSidebar
