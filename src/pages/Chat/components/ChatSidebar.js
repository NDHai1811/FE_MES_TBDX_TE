"use client"

import React, { useEffect, useRef, useState } from "react"
import { Layout, Button, Modal, Input, Typography, Form, Avatar, Divider, Radio, Checkbox, Col, Row, Skeleton } from "antd"
import { SearchOutlined, UserAddOutlined, UsergroupAddOutlined, CloseOutlined, MessageTwoTone } from "@ant-design/icons"
import { createChat, getChatList } from "../../../api/ui/chat"
import { useProfile } from "../../../components/hooks/UserHooks"
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min"
import ChatListItem from "./ChatListItem"
import { filterUsersByName, fullNameToColor } from "../chat_helper"
import { useDispatch, useSelector } from "react-redux"
import { setChats } from "../../../store/chat/chatSlice"

const { Sider, Header } = Layout
const { Title, Text } = Typography

function ChatSidebar({ users, isShowingDrawer = false, onClose, loading = false}) {
  const dispatch = useDispatch();
  const { chats, activeChat } = useSelector(state => state.chatSlice);
  const { userProfile } = useProfile();
  const history = useHistory();
  const { chat_id } = useParams();
  const [loadingCreate, setLoadingCreate] = useState(false);

  const handleCreatePrivateChat = async (values) => {
    setLoadingCreate(true);
    const params = { ...values, type: 'private', recipient_id: values.user_chat }
    var res = await createChat(params);
    if (res.success && res?.data?.id) {
      var resChatList = await getChatList();
      if ((resChatList.data ?? []).find(e => e.id === res?.data?.id)) {
        history.push('/ui/chat/' + res.data.id);
      }else{
        history.push('/ui/chat');
      }
      dispatch(setChats(resChatList.data ?? []));
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
      var resChatList = await getChatList();
      if ((resChatList.data ?? []).find(e => e.id === res?.data?.id)) {
        history.push('/ui/chat/' + res.data.id);
      }else{
        history.push('/ui/chat');
      }
      dispatch(setChats(resChatList.data ?? []));
    }
    formPublicChat.resetFields();
    setIsModalCreatePublicChatOpen(false);
    setLoadingCreate(false);
  }

  const [formPrivateChat] = Form.useForm();
  const [formPublicChat] = Form.useForm();

  const [isModalCreatePrivateChatOpen, setIsModalCreatePrivateChatOpen] = useState(false);
  const [isModalCreatePublicChatOpen, setIsModalCreatePublicChatOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const clearSearchField = (chat) => {
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

  return (
    <React.Fragment>
      <Layout style={{ width: "100%", borderRight: "1px solid #d9d9d9", height: "100%", backgroundColor: "#fff" }}>
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
            allowClear
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: "12px", borderRadius: "20px" }}
          />
          {/* Danh sách cuộc trò chuyện */}
        </div>
        <div style={{ height: '100%', overflowY: "auto" }}>
          {filterUsersByName(chats, searchQuery).map((e) => <ChatListItem chat={e} isSelected={e.id === activeChat?.id} onClick={clearSearchField} />)}
          {
            loading && (
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
        <Form form={formPublicChat} onFinish={handleCreatePublicChat} initialValues={{ user_chat: [userProfile.id], name: '', user_search: '' }}>
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
                      return <Checkbox {...user} disabled={user.id == userProfile.id}>
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
                      <Checkbox value={user.id} disabled={user.id == userProfile.id} checked onClick={() => formPublicChat.setFieldValue('user_chat', userChat.filter(e => e !== user.id))}>
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
