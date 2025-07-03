// NotificationBell.tsx
import React, { useEffect, useState } from 'react';
import { Badge, Drawer, Tabs, List, Button, Popover, Divider, notification, Avatar } from 'antd';
import { BellOutlined, TeamOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getNotifications, readNotifications } from '../api/ui/notifications';
import { useProfile } from './hooks/UserHooks';
import echo from '../helpers/echo';
import { fullNameToColor } from '../pages/Chat/chat_helper';
import { useHistory, useLocation, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { markAsRead } from '../api/ui/chat';

export default function NotificationBell({ color = '#fff', size = 28 }) {
    const location = useLocation();
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [unread, setUnread] = useState([]);
    const [read, setRead] = useState([]);

    const lastMessage = (last_message = null, chat = null) => {
        let lastMsgPreview = '';
        if (last_message) {
            let otherMessage = '';
            if (last_message?.attachments) {
                if (last_message?.attachments[0]?.file_type?.includes('image/')) {
                    otherMessage = 'Đã gửi hình ảnh';
                } else {
                    otherMessage = 'Đã gửi file';
                }
            }
            if (last_message.sender?.username === userProfile?.username) {
                lastMsgPreview = `Bạn: ${last_message.content_text ?? otherMessage ?? ''}`;
            } else {
                if (chat?.type === "group") {
                    // Hiển thị tên người gửi: nội dung
                    lastMsgPreview = `${last_message.sender?.name || ''}: ${last_message.content_text ?? otherMessage ?? ''}`;
                } else if (chat?.type === "private") {
                    lastMsgPreview = last_message.content_text ?? otherMessage ?? '';
                }
            }
        }
        return lastMsgPreview;
    }

    function groupReadNotifications(notis) {
        const groups = {};
        notis.forEach(noti => {
            const isChat = noti.type === 'App\\Notifications\\NewMessageNotification';
            if (isChat) {
                const key = isChat ? `chat_${noti.data?.chat_id}` : noti.type;
                if (!groups[key]) {
                    groups[key] = {
                        name: isChat ? (noti.data?.chat?.type === 'private' ? (noti.data?.sender?.name ?? '') : noti.data?.chat?.name) : noti.type,
                        type: noti.type,
                        content: lastMessage(noti.data, noti.data?.chat),
                        created_at: noti.created_at,
                        id: isChat ? noti.data?.chat_id : noti.id,
                        count: 1,
                        message_id: noti.data?.id,
                        notification_ids: [noti.id],
                    };
                } else {
                    // Nếu thông báo này mới hơn, cập nhật content và created_at
                    if (new Date(noti.created_at) > new Date(groups[key].created_at)) {
                        groups[key].content = lastMessage(noti.data, noti.data?.chat);
                        groups[key].message_id = noti.data?.id;
                        groups[key].created_at = noti.created_at;
                    }
                    groups[key].count += 1;
                    groups[key].notification_ids.push(noti.id);
                }
            }
        });
        return Object.values(groups);
    }

    const fetchNotifications = async () => {
        var res = await getNotifications();
        // console.log(groupReadNotifications(res.data.unread ?? []))
        setUnread(res.data.unread ?? []);
        setRead(res.data.read ?? []);
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    const readNotification = async (noti) => {
        if (noti?.type === 'App\\Notifications\\NewMessageNotification') {
            const params = {
                chat_id: noti?.id,
                user_id: userProfile?.id,
                message_id: noti?.message_id
            };
            await markAsRead(params, noti?.id);
            await readNotifications({ ids: noti?.notification_ids });
            await fetchNotifications();
            history.push(`/ui/chat/${noti?.id}`);
        } else {
            return;
        }
    };

    const { userProfile } = useProfile();
    const [api, contextHolder] = notification.useNotification({
        stack: { threshold: 3 }
    });
    const openMessageNotification = (message) => {
        api.open({
            key: message?.id ?? new Date(),
            message: <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar size={35} src={message?.sender?.avatar} icon={message?.chat?.type === "group" ? <TeamOutlined /> : undefined} style={{ backgroundColor: fullNameToColor(message?.chat?.name) }}>
                    {message?.chat?.type === "group" ? <TeamOutlined /> : message?.name?.trim().split(/\s+/).pop()[0].toUpperCase()}
                </Avatar>{message?.chat?.name ?? 'AAA'}
            </div>,
            description: message?.chat?.type === "group" ? `${message?.sender?.name}: ${message?.content_text}` : (message?.content_text ?? 'BBBB'),
            // duration: 0,
            showProgress: true,
            style: {
                padding: 8
            }
        });
    };
    // useEffect(() => {
    //     openMessageNotification();
    // }, [])

    useEffect(() => {
        if (userProfile?.id) {
            echo.private(`App.Models.CustomUser.${userProfile.id}`)
                .notification(notif => {
                    // notif.payload.data hoặc notif.data tùy version
                    console.log('New notification:', notif);
                    if (notif?.type === 'App\\Notifications\\NewMessageNotification') {
                        if (!location?.pathname?.includes('/ui/chat')) {
                            // openMessageNotification(notif.data);
                            fetchNotifications();
                        }
                    }
                });

            return () => {
                echo.leave(`App.Models.CustomUser.${userProfile?.id}`);
            };
        }
    }, [userProfile?.id, location]);

    const content = (
        <div>
            <Tabs defaultActiveKey="unread" size="small" style={{ width: 320 }}>
                <Tabs.TabPane key="unread" tab={<span>Chưa đọc <Badge count={unread.length} /></span>}>
                    <List
                        dataSource={groupReadNotifications(unread)}
                        locale={{ emptyText: 'Không có thông báo' }}
                        style={{ maxHeight: 300, overflowY: 'auto' }}
                        size='small'
                        renderItem={item => (
                            <List.Item
                                actions={[
                                    <Button
                                        size="small"
                                        type="link"
                                        onClick={() => readNotification(item)}
                                    >
                                        Xem
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta
                                    title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{item?.name} <Badge count={item.count}></Badge></div>}
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

                <Tabs.TabPane key="read" tab="Đã đọc">
                    <List
                        dataSource={groupReadNotifications(read)}
                        locale={{ emptyText: 'Không có thông báo đã đọc' }}
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
        <>
            {contextHolder}
            <Popover
                content={content}
                trigger="click"
                open={open}
                onOpenChange={setOpen}
            >
                <Badge count={unread.length} offset={[-5, 5]} size="small">
                    <BellOutlined style={{ fontSize: size, cursor: 'pointer', color: color }} />
                </Badge>
            </Popover>
        </>
    );
}
