// hooks/useChatRealtime.js
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementUnread, resetUnread, addMessage, recallMessage, setFilesInActiveChat, setChats, setActiveChat } from '../store/chat/chatSlice';
import echo from '../helpers/echo';
import { useProfile } from '../components/hooks/UserHooks';
import { fullNameToColor, getDescriptionMessage } from '../pages/Chat/chat_helper';
import { CloseOutlined, TeamOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, notification, Typography } from 'antd';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { getChatList, getFiles } from '../api/ui/chat';
const {Text} = Typography;

export default function useChatRealtime() {
    const dispatch = useDispatch();
    const { userProfile } = useProfile();
    const {activeChatId, chats} = useSelector(state => state.chatSlice);
    const history = useHistory();

    // Dùng ref để lưu trữ channel hiện tại
    const currentChannel = useRef(null);

    useEffect(() => {
        console.log('joined channel', !!currentChannel.current);
        console.log('chat id', activeChatId);
        if (!userProfile?.id) return;

        // Nếu đã có channel trước đó, cleanup
        if (currentChannel.current) {
            console.log('cleanup previous channel');
            currentChannel.current.stopListening('MessageSent');
            currentChannel.current.stopListening('MessageRead');
            currentChannel.current.stopListening('MessageRecall');
            currentChannel.current.stopListening('ChatUpdated');
        }

        // Tạo channel mới
        currentChannel.current = echo.private(`user.${userProfile.id}`);
        
        // Lắng nghe tin nhắn mới
        currentChannel.current.listen('MessageSent', (msg) => {
            console.log('get message');
            openMessageNotification(msg);
            if (activeChatId === msg.chat_id) {
                dispatch(addMessage({ ...msg, isMine: msg.sender_id == userProfile?.id }));
            }
            dispatch(incrementUnread(msg));
            fetchFilesInChat(activeChatId);
        });

        // Lắng nghe sự kiện đánh dấu đã đọc
        currentChannel.current.listen('MessageRead', (e) => {
            console.log('read message');
            // dispatch(resetUnread(e.chat_id));
        });

        // Lắng nghe sự kiện thu hồi tin nhắn
        currentChannel.current.listen('MessageRecall', (msg) => {
            console.log('recall message event received:', msg);
            console.log('recall message payload format:', {
                id: msg.id,
                chat_id: msg.chat_id,
                hasId: !!msg.id,
                hasChatId: !!msg.chat_id
            });
            dispatch(recallMessage({...msg, isMine: msg.sender_id == userProfile?.id}));
            fetchFilesInChat(activeChatId);
        });

        // Lắng nghe sự kiện đánh dấu đã đọc
        currentChannel.current.listen('ChatUpdated', (e) => {
            console.log(e);
            if(activeChatId === e.id){
                dispatch(setActiveChat(e))
            }
            fetchChatList();
        });

        // Cleanup khi component unmount hoặc dependencies thay đổi
        return () => {
            console.log('stop listening');
            if (currentChannel.current) {
                currentChannel.current.stopListening('MessageSent');
                currentChannel.current.stopListening('MessageRead');
                currentChannel.current.stopListening('MessageRecall');
                currentChannel.current.stopListening('ChatUpdated');
                currentChannel.current = null;
            }
        };
    }, [userProfile?.id, activeChatId, dispatch]);

    notification.config({
        stack: {
            threshold: 1,
        }
    })
    const openMessageNotification = (message) => {
        const chat = chats.find(e=>message.chat_id === e.id);
        if(chat?.muted !== 'N' && chat?.muted !== null) return;
        if(window.location.pathname.includes('ui/chat')) return;
        notification.open({
            key: message?.id,
            description: <RenderMessageNotification message={message} notification={notification} />,
            // duration: 0,
            showProgress: true,
            style: {
                padding: 8,
                width: 300
            },
            className: 'custom-message-notification',
            onClick: () => {
                history.push('/ui/chat/' + message.chat_id);
                notification.destroy(message?.id)
            },
            stack: {
                threshold: 1,
            },
            maxCount: 3,
            closeIcon: false
        });
    };

    const RenderMessageNotification = ({ message, notification }) => {
        console.log(message);

        const chat = message.chat;
        return (
            <div
                key={message.id}
                style={{
                    cursor: "pointer",
                    // padding: 5,
                    borderRadius: "8px",
                    // margin: "4px 8px",
                    position: "relative",
                    lineHeight: 0,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ position: "relative" }}>
                        <Badge
                            dot={chat.type === "private" && chat.isOnline}
                            status={chat.type === "private" && chat.isOnline ? "success" : "default"}
                            offset={[-8, 32]}
                        >
                            <Avatar size={50} src={chat.avatar} icon={chat.type === "group" ? <TeamOutlined /> : undefined} style={{ backgroundColor: fullNameToColor(chat?.name) }}>
                                {chat.type === "group" ? <TeamOutlined /> : chat?.name?.trim().split(/\s+/).pop()[0].toUpperCase()}
                            </Avatar>
                        </Badge>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Text strong style={{ fontSize: "18px" }} ellipsis>
                                {chat.name}
                            </Text>
                            <Button type='text' icon={<CloseOutlined />} onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                notification.destroy(message.id)
                            }}></Button>
                        </div>
                        <Text type="secondary" style={{ fontSize: "16px", width: chat?.unread_count ? "85%" : "100%" }} ellipsis>
                            {getDescriptionMessage(message, chat, userProfile)}
                        </Text>
                    </div>
                </div>
            </div>
        )
    }

    const fetchFilesInChat = async (chat_id) => {
        if(!window.location.pathname.includes('ui/chat/'+chat_id)) return;
        const res = await getFiles({}, chat_id);
        if(res.success){
            dispatch(setFilesInActiveChat(res.data))
        }
    }

    const fetchChatList = async () => {
        var res = await getChatList();
        dispatch(setChats(res.data ?? []));
        if (!(res.data ?? []).find(e => e.id === activeChatId)) {
            history.push('/ui/chat');
        }
    }
}
