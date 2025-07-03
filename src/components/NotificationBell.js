// NotificationBell.tsx
import React, { useEffect, useState } from 'react';
import { Badge, Drawer, Tabs, List, Button, Popover, Divider, notification, Avatar } from 'antd';
import { BellOutlined, TeamOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getNotifications } from '../api/ui/notifications';
import { useProfile } from './hooks/UserHooks';
import echo from '../helpers/echo';
import { fullNameToColor } from '../pages/Chat/chat_helper';
import { useLocation, useParams } from 'react-router-dom/cjs/react-router-dom.min';

export default function NotificationBell() {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [unread, setUnread] = useState([]);
    const [read, setRead] = useState([]);

    function groupReadNotifications(notis) {
        const groups = {};
        notis.forEach(noti => {
            if (noti.type === 'App\\Notifications\\NewMessageNotification') {
                // Gom theo chat_id
                const key = `chat_${noti.data?.chat_id}`;
                if (!groups[key]) groups[key] = [];
                groups[key].push(noti);
            } else {
                // Gom theo type
                const key = noti.type;
                if (!groups[key]) groups[key] = [];
                groups[key].push(noti);
            }
        });
        return groups;
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

    const markAsRead = (id) => {
        const noti = unread.find(e => e.id === id);
        if (noti) {
            setUnread(prev => prev.filter(n => (n.id !== id)));
            setRead(prev => [noti, ...prev]);
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
                <Avatar size={35} src={message?.sender?.avatar} icon={message?.type === "group" ? <TeamOutlined /> : undefined} style={{ backgroundColor: fullNameToColor(message?.chat?.name) }}>
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
        console.log(location);
        
        if (userProfile?.id) {
            const channel = echo.private(`App.Models.CustomUser.${userProfile.id}`)
                .notification(notif => {
                    // notif.payload.data hoặc notif.data tùy version
                    console.log('New notification:', notif);
                    if (notif?.type === 'App\\Notifications\\NewMessageNotification') {
                        if (!location?.pathname?.includes('/ui/chat')) {
                            openMessageNotification(notif.data);
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
                        dataSource={unread}
                        locale={{ emptyText: 'Không có thông báo' }}
                        style={{ maxHeight: 300, overflowY: 'auto' }}
                        renderItem={item => (
                            <List.Item
                                actions={[
                                    <Button
                                        size="small"
                                        type="link"
                                        onClick={() => markAsRead(item.id)}
                                    >
                                        Đã đọc
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta
                                    title={item?.data?.name}
                                    description={
                                        <>
                                            <div>{item?.data?.content}</div>
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
                        dataSource={read}
                        locale={{ emptyText: 'Không có thông báo đã đọc' }}
                        style={{ maxHeight: 300, overflowY: 'auto' }}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    title={item?.data?.name}
                                    description={
                                        <>
                                            <div>{item?.data?.content}</div>
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
                    <BellOutlined style={{ fontSize: 28, cursor: 'pointer', color: '#fff' }} />
                </Badge>
            </Popover>
        </>
    );
}
