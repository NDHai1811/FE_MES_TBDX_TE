import React, { useEffect, useRef, useState } from "react"
import { Layout, Menu, Button, Modal, Input, Typography, Select, Form, Tabs, Badge, Avatar, Divider } from "antd"
import { TeamOutlined, MessageOutlined, PlusOutlined, GroupOutlined, SearchOutlined, MoreOutlined } from "@ant-design/icons"
import { getUsers } from "../../../api"
import { createChat, getChatList } from "../../../api/ui/chat"
import { useProfile } from "../../../components/hooks/UserHooks"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

const { Sider, Header } = Layout
const { Title, Text } = Typography

const ChatListItem = ({ chat, isSelected, onClick }) => {
    const [isHovered, setIsHovered] = useState(false)
    const { userProfile } = useProfile();
    const getItemStyle = () => {
        if (isSelected) {
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

    // Format last message preview
    const lastMessage = (last_message = null) => {
        let lastMsgPreview = '';
        if (last_message) {
            let otherMessage = '';
            switch (last_message.type) {
                case 'image':
                    otherMessage = 'Đã gửi hình ảnh';
                    break;
                case 'file':
                    otherMessage = 'Đã gửi tài liệu';
                    break;
                default:
                    break;
            }
            if (last_message.sender?.username === userProfile?.username) {
                lastMsgPreview = `Bạn: ${last_message.content ?? otherMessage ?? ''}`;
            } else {
                if (chat.type === "group") {
                    // Hiển thị tên người gửi: nội dung
                    lastMsgPreview = `${last_message.sender?.name || ''}: ${last_message.content ?? otherMessage ?? ''}`;
                } else if (chat.type === "private") {
                    lastMsgPreview = last_message.content ?? otherMessage ?? '';
                }
            }

        }
        return lastMsgPreview;
    }


    return <div
        key={chat.id}
        onClick={() => onClick(chat)}
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
                    <Avatar size={48} src={chat.avatar} icon={chat.type === "group" ? <TeamOutlined /> : undefined}>
                        {chat.type === "group" ? <TeamOutlined /> : chat.name.charAt(0)}
                    </Avatar>
                </Badge>
                {/* {chat.type === "group" && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: -2,
                            right: -2,
                            backgroundColor: "#666",
                            color: "white",
                            fontSize: "10px",
                            borderRadius: "50%",
                            width: "18px",
                            height: "18px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "2px solid white",
                        }}
                    >
                        {chat.memberCount}
                    </div>
                )} */}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <Text strong style={{ fontSize: "14px" }} ellipsis>
                        {chat.name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        {chat?.last_message?.from_now}
                    </Text>
                </div>
                <Text type="secondary" style={{ fontSize: "13px" }} ellipsis>
                    {lastMessage(chat?.last_message)}
                </Text>
                {/* {chat.type === "group" && (
                    <Text type="secondary" style={{ fontSize: "11px", display: "block" }}>
                        {(chat.participants ?? []).length} thành viên
                    </Text>
                )} */}
            </div>

            {chat.unreadCount && (
                <Badge
                    count={chat.unreadCount}
                    style={{
                        position: "absolute",
                        right: "16px",
                        top: "16px",
                    }}
                />
            )}
        </div>
    </div>
}

export default ChatListItem;