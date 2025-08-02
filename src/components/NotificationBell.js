// NotificationBell.tsx
import React, { useEffect, useState } from 'react';
import { Badge, Drawer, Tabs, List, Button, Popover, Divider, notification, Avatar, Typography } from 'antd';
import { BellOutlined, CloseOutlined, TeamOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getNotifications, readNotifications } from '../api/ui/notifications';
import { useProfile } from './hooks/UserHooks';
import echo from '../helpers/echo';
import { formatTimeFromNow, fullNameToColor, getDescriptionMessage } from '../pages/Chat/chat_helper';
import { useHistory, useLocation, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { getChatList, markAsRead } from '../api/ui/chat';
import { useDispatch, useSelector } from 'react-redux';
import { setChats } from '../store/chat/chatSlice';

const { Text } = Typography;

export default function NotificationBell({ color = '#fff', size = 28 }) {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [unreadMessage, setUnreadMessage] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const chats = useSelector(state => state.chatSlice.chats);

    useEffect(()=>{
        setUnreadMessage(chats.filter(e => e.unread_count > 0 && (e.muted === 'N' || e.muted === null)));
    }, [chats])

    const fetchChatList = async () => {
        var res = await getChatList();
        dispatch(setChats(res.data ?? []));
    }
    useEffect(() => {
        if (!location.pathname.includes('ui/chat')) {
            fetchChatList();
        }
    }, [dispatch, location]);

    const { userProfile } = useProfile();

    const onClickMessageNoti = (chat) => {
        history.push('/ui/chat/' + chat.id);
        setOpen(false);
    }

    const content = (
        <div>
            <Tabs defaultActiveKey="unread" size="small" style={{ width: 320 }}>
                <Tabs.TabPane key="unread" tab={"Tin nhắn"}>
                    <List
                        dataSource={unreadMessage}
                        locale={{ emptyText: 'Không có thông báo' }}
                        style={{ maxHeight: 300, overflowY: 'auto' }}
                        size='small'
                        renderItem={chat => (
                            <div
                                key={chat.id}
                                onClick={() => onClickMessageNoti(chat)}
                                // onMouseEnter={() => setIsHovered(true)}
                                // onMouseLeave={() => setIsHovered(false)}
                                style={{
                                    cursor: "pointer",
                                    // padding: 5,
                                    borderRadius: "8px",
                                    // margin: "4px 8px",
                                    position: "relative",
                                    lineHeight: 0,
                                    // ...getItemStyle(),
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <div style={{ position: "relative" }}>
                                        <Badge
                                            dot={chat.type === "private" && chat.isOnline}
                                            status={chat.type === "private" && chat.isOnline ? "success" : "default"}
                                            offset={[-8, 32]}
                                        >
                                            <Avatar size={48} src={chat.avatar} icon={chat.type === "group" ? <TeamOutlined /> : undefined} style={{ backgroundColor: fullNameToColor(chat?.name) }}>
                                                {chat.type === "group" ? <TeamOutlined /> : chat?.name?.trim().split(/\s+/).pop()[0].toUpperCase()}
                                            </Avatar>
                                        </Badge>
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                            <Text strong style={{ fontSize: "14px" }} ellipsis>
                                                {chat.name}
                                            </Text>
                                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                                {formatTimeFromNow(chat?.last_message?.created_at)}
                                            </Text>
                                        </div>
                                        <Text type="secondary" style={{ fontSize: "13px", width: chat?.unread_count ? "85%" : "100%" }} ellipsis>
                                            {getDescriptionMessage(chat?.last_message, chat, userProfile)}
                                        </Text>
                                        {chat.unread_count ? (
                                            <Badge
                                                count={chat.unread_count}
                                                style={{
                                                    position: "absolute",
                                                    right: "0",
                                                    bottom: "0",
                                                }}
                                                overflowCount={9}
                                                styles={{ root: { width: "100%" } }}
                                            />
                                        ) : null}
                                    </div>


                                </div>
                            </div>
                        )}
                    />
                </Tabs.TabPane>

                <Tabs.TabPane key="read" tab="Thông báo khác">
                    <List
                        dataSource={notifications}
                        locale={{ emptyText: 'Không có thông báo' }}
                        style={{ maxHeight: 300, overflowY: 'auto' }}
                        renderItem={item => (
                            <List.Item actions={[
                                <Button
                                    size="small"
                                    type="link"
                                    onClick={() => history.push(`/ui/chat/${item?.id}`)}
                                >
                                    Xem
                                </Button>,
                            ]}>
                                <List.Item.Meta
                                    title={item?.name}
                                    description={
                                        <>
                                            <div>{item?.content}</div>
                                            <small>{dayjs(item?.created_at).format('HH:mm DD/MM/YYYY')}</small>
                                        </>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Tabs.TabPane>
            </Tabs>
            <Divider style={{ margin: '8px 0' }} />
            <Button size="small" block onClick={() => setOpen(false)}>
                Đóng
            </Button>
        </div>
    );

    return (
        <Popover
            content={content}
            trigger="click"
            open={open}
            onOpenChange={setOpen}
        >
            <Badge count={unreadMessage.reduce((sum, chat) => sum + (chat.unread_count || 0), 0)} offset={[-5, 5]} size="small">
                <BellOutlined style={{ fontSize: size, cursor: 'pointer', color: color }} />
            </Badge>
        </Popover>
    );
}
