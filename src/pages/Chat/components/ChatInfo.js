import { CalendarOutlined, CaretRightOutlined, CloseOutlined, DeleteOutlined, DownloadOutlined, FileImageOutlined, FileOutlined, LeftOutlined, LinkOutlined, LogoutOutlined, PhoneOutlined, PlayCircleOutlined, RightOutlined, SearchOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Col, Collapse, Divider, Image, Layout, List, Modal, Popconfirm, Row, Space } from "antd";
import { Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Title from "antd/es/typography/Title";
import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { deleteChat, getFiles, updateChat } from "../../../api/ui/chat";
import { baseURL } from "../../../config";
import AttachmentsHistory from "./Attachments/AttachmentsHistory";
import { displayIconFileType, downloadFile, fullNameToColor } from "../chat_helper";
import ChatUserList from "./ChatUserList";
import { useProfile } from "../../../components/hooks/UserHooks";
const { Panel } = Collapse;

export function ChatInfo({ chat, setChat, isOpen, setIsOpen, mediaChat }) {
    const { userProfile } = useProfile();
    const history = useHistory();
    const MAX_PREVIEW = 3;
    const nameChat = useRef(chat?.name)

    useEffect(() => {
        setAttachmentsHistory({ items: [], type: '', isShow: false });
        setChatUserList({ usersInChat: [], type: '', isShow: false });
        nameChat.current = chat?.name
    }, [chat])

    const images = mediaChat?.images ?? [];
    const files = mediaChat?.files ?? [];
    const links = mediaChat?.links ?? [];

    const [attachmentsHistory, setAttachmentsHistory] = useState({
        items: [],
        type: '',
        isShow: false
    })
    const [chatUserList, setChatUserList] = useState({
        usersInChat: [],
        isShow: false,
    });

    const onChangeNameChat = async () => {
        if (!chat?.id || !nameChat.current || nameChat.current === chat.name) return;
        const res = await updateChat({ name: nameChat.current }, chat.id);
        // Có thể reload lại thông tin chat nếu cần
        if (res?.success) {
            setChat(res.data);
        }
    }

    const handleClose = () => {
        setIsOpen(false);
    }

    const deleteGroupChat = async () => {
        const res = await deleteChat(chat.id);
        if (res?.success) {
            window.location.href = '/ui/chat';
        }
    }

    const leaveGroupChat = async () => {
        const res = await leaveGroupChat(chat.id);
        if (res?.success) {
            window.location.href = '/ui/chat';
        }
    }

    return (
        <React.Fragment>
            <Sider width={isOpen ? 320 : 0} style={{
                backgroundColor: '#fff',
                overflow: 'hidden',
                height: '100%',
            }}
                theme="light"
            >
                <Layout style={{ borderLeft: "1px solid #d9d9d9", height: "100%", width: '100%' }}>
                    <Header style={{ background: "#fff", padding: "0 16px", borderBottom: "1px solid #f0f0f0", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {chatUserList.isShow || attachmentsHistory.isShow ?
                            <LeftOutlined style={{ fontSize: 18 }} onClick={() => {
                                setAttachmentsHistory({ items: [], type: '', isShow: false });
                                setChatUserList({ usersInChat: [], type: '', isShow: false });
                            }} />
                            :
                            <Title level={4} style={{ margin: 0 }}>
                                Thông tin đoạn chat
                            </Title>
                        }
                        <CloseOutlined style={{ fontSize: 18 }} onClick={() => handleClose()} />
                    </Header>
                    <Divider style={{ margin: 0 }} />
                    {/* Header với ảnh đại diện lớn */}
                    <div style={{ height: chatUserList.isShow ? '100%' : 0, overflowY: "auto" }}>
                        <ChatUserList {...chatUserList} chat={chat} />
                    </div>
                    <div style={{ height: attachmentsHistory.isShow ? '100%' : 0, overflowY: "auto" }}>
                        <AttachmentsHistory {...attachmentsHistory} />
                    </div>
                    <div style={{ height: '100%', overflowY: "auto", display: (chatUserList.isShow || attachmentsHistory.isShow) ? 'none' : '', padding: '16px 0' }}>
                        <div style={{ margin: 0, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            {chat && <><Badge
                                dot={chat.type === "private" && chat.isOnline}
                                status={chat.type === "private" && chat.isOnline ? "success" : "default"}
                                offset={[-8, 32]}
                            >
                                <Avatar size={48} src={chat.avatar} icon={chat.type === "group" ? <TeamOutlined /> : undefined} style={{ backgroundColor: fullNameToColor(chat?.name) }}>
                                    {chat.type === "group" ? <TeamOutlined /> : chat?.name?.charAt(0)}
                                </Avatar>
                            </Badge> <Title editable={chat?.type === "group" ? {
                                onChange: (value) => nameChat.current = value,
                                onEnd: onChangeNameChat
                            } : false} level={4} style={{ margin: 0 }}>{nameChat.current}</Title></>}
                        </div>
                        <Divider style={{ margin: 0 }} />
                        {chat?.type === 'group' && <div style={{ padding: 16, cursor: 'pointer' }} onClick={() => setChatUserList({ usersInChat: chat?.participants ?? [], isShow: true })}><TeamOutlined style={{ fontSize: 18 }} /> {chat?.participants?.length ?? 0} Thành viên</div>}
                        <Divider style={{ margin: 0 }} />
                        <Collapse defaultActiveKey={['1', '2', '3']} bordered={false} expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />} expandIconPosition={"end"}>
                            {/* Images Panel */}
                            <Panel header={<strong>{`Ảnh (${images.length})`}</strong>} key="1">
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: 2,
                                    }}
                                >
                                    <Image.PreviewGroup>
                                        {images.slice(0, MAX_PREVIEW).map((img, i) => (
                                            <div
                                                key={img.id}
                                                style={{
                                                    width: '100%',
                                                    aspectRatio: '1 / 1',      // ép ô vuông
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    borderRadius: 4,
                                                }}
                                            >
                                                <Image
                                                    src={`${baseURL}/storage/${img.file_path}`}
                                                    width="100%"
                                                    style={{
                                                        width: '100%', height: '100%',
                                                        objectFit: 'contain',
                                                        border: '1px solid #00000020',
                                                        borderRadius: 8
                                                    }}
                                                    wrapperStyle={{ display: 'flex', height: '100%' }}
                                                />
                                            </div>
                                        ))}
                                    </Image.PreviewGroup>
                                </div>
                                {images.length > MAX_PREVIEW ? (
                                    <Button
                                        type="dashed"
                                        block
                                        style={{ height: '100%', marginTop: 8 }}
                                        onClick={() => { setAttachmentsHistory({ items: images, type: 'image', isShow: true }) }}
                                    >
                                        {`Xem thêm (+${images.length - MAX_PREVIEW})`}
                                    </Button>
                                ) : <div style={{textAlign: 'center', padding: 4}}>Không có ảnh</div>}
                            </Panel>

                            {/* Files Panel */}
                            <Panel header={<strong>{`File (${files.length})`}</strong>} key="2">
                                {files.slice(0, MAX_PREVIEW).map((file, i) => (
                                    <div
                                        style={{
                                            padding: '8px',
                                            borderRadius: 8,
                                            marginBottom: 0,
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                            justifyContent: 'space-between',
                                            border: '1px solid #00000020',
                                            display: 'flex',
                                            marginTop: i === 0 ? 0 : 8
                                        }}
                                    >
                                        <div>
                                            {displayIconFileType(file?.file_type)}
                                            <span
                                                style={{
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {file?.file_name}
                                            </span>
                                        </div>
                                        <Button type="default" icon={<DownloadOutlined style={{ fontSize: 18 }} />} size="small" style={{ marginLeft: 8 }} onClick={() => downloadFile(file)}></Button>
                                    </div>
                                ))}
                                {files.length > MAX_PREVIEW ? (
                                    <Button
                                        type="dashed"
                                        block
                                        style={{ height: '100%', marginTop: 8 }}
                                        onClick={() => { setAttachmentsHistory({ items: files, type: 'file', isShow: true }) }}
                                    >
                                        {`Xem thêm (+${files.length - MAX_PREVIEW})`}
                                    </Button>
                                ) : <div style={{textAlign: 'center', padding: 4}}>Không có file</div>}
                            </Panel>

                            {/* Links Panel */}
                            <Panel header={<strong>{`Link (${links.length})`}</strong>} key="3">
                                {links.slice(0, MAX_PREVIEW).map((link, i) => (
                                    <div key={i}>
                                        <a href={link.file_path}>{link.file_path}</a>
                                    </div>
                                ))}
                                {links.length > MAX_PREVIEW ? (
                                    <Button
                                        type="dashed"
                                        block
                                        style={{ height: '100%', marginTop: 8 }}
                                        onClick={() => { setAttachmentsHistory({ items: links, type: 'link', isShow: true }) }}
                                    >
                                        {`Xem thêm (+${links.length - MAX_PREVIEW})`}
                                    </Button>
                                ) : <div style={{textAlign: 'center', padding: 4}}>Không có link</div>}
                            </Panel>
                        </Collapse>
                        <Divider style={{ margin: 0 }} />
                        <Space direction="vertical" style={{ width: '100%', padding: 16 }}>
                            {chat.type === "group" &&
                                <Popconfirm title="Bạn có chắc chắn muốn rời nhóm chat này không?" onConfirm={() => leaveGroupChat(chat.id)}>
                                    <Button danger style={{ display: 'flex', alignItems: 'center', color: 'red' }}>
                                        <LogoutOutlined className="delete-btn" /> Rời đoạn chat
                                    </Button>
                                </Popconfirm>
                            }
                            {((chat.type === "group" && chat.creator.id == userProfile?.id) || (chat.type === "private")) &&
                                <Popconfirm title="Bạn có chắc chắn muốn xóa đoạn chat này không?" onConfirm={() => deleteGroupChat(chat.id)}>
                                    <Button danger style={{ display: 'flex', alignItems: 'center', color: 'red' }}>
                                        <DeleteOutlined className="delete-btn" /> Xóa lịch sử trò chuyện
                                    </Button>
                                </Popconfirm>
                            }
                        </Space>
                    </div>
                </Layout>
            </Sider>
        </React.Fragment>
    )
}

export default ChatInfo;