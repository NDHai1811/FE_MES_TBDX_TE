import React, { useEffect, useRef, useState } from "react"
import { Layout, Menu, Button, Modal, Input, Typography, Select, Form, Tabs, Badge, Avatar, Divider } from "antd"
import { TeamOutlined } from "@ant-design/icons"
import { formatTimeFromNow, fullNameToColor, getDescriptionMessage } from "../chat_helper"
import { useProfile } from "../../../components/hooks/UserHooks"
import { useDispatch, useSelector } from "react-redux"
import { resetUnread, setActiveChat } from "../../../store/chat/chatSlice"
const { Title, Text } = Typography

const ChatListItem = ({ chat, onClick }) => {
    const dispatch = useDispatch();
    const activeChatId = useSelector(state => state.chatSlice.activeChatId);
    const {userProfile} = useProfile();
    const [isHovered, setIsHovered] = useState(false);
    
    const getItemStyle = () => {
        if (activeChatId === chat.id) {
            return {
                backgroundColor: "#e6f4ff",
                borderLeft: "4px solid #1677ff",
                boxShadow: "0 2px 8px rgba(22, 119, 255, 0.15)",
            }
        }

        if (isHovered) {
            return {
                backgroundColor: "#f8f9fa",
                borderLeft: "4px solid transparent",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
            }
        }

        return {
            backgroundColor: "transparent",
            borderLeft: "4px solid transparent",
            transform: "translateX(0px)",
            boxShadow: "none",
        }
    }

    const onClickChat = (chat) => {
        onClick(chat);
        dispatch(setActiveChat(chat));
        dispatch(resetUnread(chat.id));
    }

    return <div
        key={chat.id}
        onClick={() => onClickChat(chat)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
            cursor: "pointer",
            padding: 5,
            borderRadius: "8px",
            margin: "4px 8px",
            position: "relative",
            lineHeight: 0,
            ...getItemStyle(),
        }}
    >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ position: "relative" }}>
                <Badge
                    dot={chat.type === "private" && chat.isOnline}
                    status={chat.type === "private" && chat.isOnline ? "success" : "default"}
                    offset={[-8, 32]}
                >
                    <Avatar size={48} src={chat.avatar} icon={chat.type === "group" ? <TeamOutlined /> : undefined} style={{backgroundColor: fullNameToColor(chat?.name)}}>
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
                    styles={{root: {width: "100%"}}}
                />
            ) : null}
            </div>

            
        </div>
    </div>
}

export default ChatListItem;