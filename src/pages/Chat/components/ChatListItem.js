import React, { useEffect, useRef, useState } from "react"
import { Layout, Menu, Button, Modal, Input, Typography, Select, Form, Tabs, Badge, Avatar, Divider } from "antd"
import { TeamOutlined, MessageOutlined, PlusOutlined, GroupOutlined, SearchOutlined, MoreOutlined } from "@ant-design/icons"
import { getUsers } from "../../../api"
import { createChat, getChatList } from "../../../api/ui/chat"
import { useProfile } from "../../../components/hooks/UserHooks"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { fullNameToColor } from "../chat_helper"

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
            if(last_message?.attachments){
                if(last_message?.attachments[0]?.file_type?.includes('image/')) {
                    otherMessage = 'Đã gửi hình ảnh';
                } else {
                    otherMessage = 'Đã gửi file';
                }
            }
            if (last_message.sender?.username === userProfile?.username) {
                lastMsgPreview = `Bạn: ${last_message.content_text ?? otherMessage ?? ''}`;
            } else {
                if (chat.type === "group") {
                    // Hiển thị tên người gửi: nội dung
                    lastMsgPreview = `${last_message.sender?.name || ''}: ${last_message.content_text ?? otherMessage ?? ''}`;
                } else if (chat.type === "private") {
                    lastMsgPreview = last_message.content_text ?? otherMessage ?? '';
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
                {chat.unread_count ? (
                <Badge
                    count={chat.unread_count}
                    style={{
                        position: "absolute",
                        right: "16px",
                        bottom: "0",
                    }}
                    styles={{root: {width: "100%"}}}
                />
            ) : null}
            </div>

            
        </div>
    </div>
}

export default ChatListItem;