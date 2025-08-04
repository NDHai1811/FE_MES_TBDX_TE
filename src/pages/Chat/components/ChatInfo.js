import { BellOutlined, CalendarOutlined, CaretRightOutlined, CloseOutlined, DeleteOutlined, DownloadOutlined, FileImageOutlined, FileOutlined, LeftOutlined, LinkOutlined, LogoutOutlined, PhoneOutlined, PlayCircleOutlined, RightOutlined, SearchOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Col, Collapse, Divider, Image, Layout, List, Modal, Popconfirm, Row, Space, Switch, Tabs } from "antd";
import { Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Title from "antd/es/typography/Title";
import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { deleteChat, deleteChatHistory, getFiles, leaveChat, mutedChat, updateChat } from "../../../api/ui/chat";
import { baseURL } from "../../../config";
import AttachmentsHistory from "./Attachments/AttachmentsHistory";
import { displayIconFileType, downloadFile, fullNameToColor } from "../chat_helper";
import ChatUserList from "./ChatUserList";
import { useProfile } from "../../../components/hooks/UserHooks";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChat, setChats, setFilesInActiveChat, setMessagesInActiveChat } from "../../../store/chat/chatSlice";
const { Panel } = Collapse;

export function ChatInfo({ isOpen, setIsOpen, users = [] }) {
    const dispatch = useDispatch();
    const { activeChat, filesInActiveChat, chats } = useSelector(state => state.chatSlice)
    const { userProfile } = useProfile();
    const history = useHistory();
    const MAX_PREVIEW = 3;
    const nameChat = useRef(activeChat?.name)
    useEffect(() => {
        activeChat && fetchFilesInChat();
    }, [activeChat]);
    const fetchFilesInChat = async () => {
        console.log('prepare get files');
        if (!window.location.pathname.includes('ui/chat/' + activeChat.id)) return;
        const res = await getFiles({}, activeChat.id);
        if (res.success) {
            dispatch(setFilesInActiveChat(res.data))
        }
        console.log('got files');
    }
    const images = filesInActiveChat?.image ?? [];
    const files = filesInActiveChat?.file ?? [];
    const links = filesInActiveChat?.link ?? [];

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
        if (!activeChat?.id || !nameChat.current || nameChat.current === activeChat.name) return;
        const res = await updateChat({ name: nameChat.current }, activeChat.id);
        // Có thể reload lại thông tin chat nếu cần
        if (res?.success) {
            dispatch(setActiveChat(res.data));
        }
    }

    const handleClose = () => {
        setIsOpen(false);
    }

    const deleteHistory = async () => {
    const res = await deleteChatHistory(activeChat.id);
        if (res?.success) {
            dispatch(setMessagesInActiveChat([]));
        }
    }

    const leaveGroupChat = async () => {
        const res = await leaveChat(activeChat.id);
        if (res?.success) {
            // dispatch(setActiveChat());
            // dispatch(setChats(chats.filter(c => c.id !== res.data.id)));
            // dispatch(setMessagesInActiveChat([]));
            history.push('/ui/chat');
        }
    }

    const onChangeNotifiable = async (checked) => {
        const params = {
            is_muted: checked ? 'Y' : 'N',
        }
        const res = await mutedChat(params, activeChat.id, userProfile.id);
        if (res?.success) {
            dispatch(setActiveChat(res.data));
            dispatch(setChats(chats.map(c => c.id === res.data.id ? res.data : c)))
        }
    }
    if(!activeChat){
        return null;
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
                    <Header style={{ background: "#fff", padding: "0 8px", borderBottom: "1px solid #f0f0f0", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            {chatUserList.isShow || attachmentsHistory.isShow ?
                                <LeftOutlined style={{ fontSize: 18 }} onClick={() => {
                                    setAttachmentsHistory({ items: [], type: '', isShow: false });
                                    setChatUserList({ usersInChat: [], type: '', isShow: false });
                                }} />
                                : null}

                            <Title level={4} style={{ margin: 0 }}>
                                {chatUserList.isShow ? "Danh sách thành viên" :
                                    attachmentsHistory.isShow ? "Kho lưu trữ" :
                                        "Thông tin đoạn chat"
                                }
                            </Title>
                        </div>
                        <CloseOutlined style={{ fontSize: 18 }} onClick={() => handleClose()} />
                    </Header>
                    <Divider style={{ margin: 0 }} />
                    {/* Header với ảnh đại diện lớn */}
                    <div style={{ height: chatUserList.isShow ? '100%' : 0, overflowY: "auto" }}>
                        <ChatUserList chat={activeChat} users={users} />
                    </div>
                    <div style={{ height: attachmentsHistory.isShow ? '100%' : 0, overflowY: "auto" }}>
                        <AttachmentsHistory {...attachmentsHistory} mediaFiles={filesInActiveChat} />
                    </div>
                    <div style={{ height: '100%', overflowY: "auto", display: (chatUserList.isShow || attachmentsHistory.isShow) ? 'none' : '', padding: '16px 0' }}>
                        <div style={{ margin: 0, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            {activeChat && <><Badge
                                dot={activeChat.type === "private" && activeChat.isOnline}
                                status={activeChat.type === "private" && activeChat.isOnline ? "success" : "default"}
                                offset={[-8, 32]}
                            >
                                <Avatar size={48} src={activeChat.avatar} icon={activeChat.type === "group" ? <TeamOutlined /> : undefined} style={{ backgroundColor: fullNameToColor(activeChat?.name) }}>
                                    {activeChat.type === "group" ? <TeamOutlined /> : activeChat?.name?.charAt(0)}
                                </Avatar>
                            </Badge> <Title editable={activeChat?.type === "group" ? {
                                onChange: (value) => nameChat.current = value,
                                onEnd: onChangeNameChat
                            } : false} level={4} style={{ margin: 8 }}>{activeChat?.name}</Title></>}
                        </div>
                        <Divider style={{ margin: 0 }} />
                        {activeChat?.type === 'group' && <div style={{ padding: 16, cursor: 'pointer' }} onClick={() => setChatUserList({ ...chatUserList, isShow: true })}><TeamOutlined style={{ fontSize: 18 }} /> {activeChat?.participants?.length ?? 0} Thành viên</div>}
                        <Divider style={{ margin: 0 }} />
                        <Collapse defaultActiveKey={['1', '2', '3']} bordered={false} expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />} expandIconPosition={"end"} style={{ backgroundColor: '#f5f5f5' }}>
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
                                {images.length > 0 && (
                                    <Button
                                        type="dashed"
                                        block
                                        style={{ height: '100%', marginTop: 8 }}
                                        onClick={() => { setAttachmentsHistory({ items: images, type: 'image', isShow: true }) }}
                                    >
                                        {`Xem tất cả`}
                                    </Button>
                                )}
                                {images.length === 0 && <div style={{ textAlign: 'center', padding: 4 }}>Không có ảnh</div>}
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
                                {files.length > 0 && (
                                    <Button
                                        type="dashed"
                                        block
                                        style={{ height: '100%', marginTop: 8 }}
                                        onClick={() => { setAttachmentsHistory({ items: files, type: 'file', isShow: true }) }}
                                    >
                                        {`Xem tất cả`}
                                    </Button>
                                )}
                                {files.length === 0 && <div style={{ textAlign: 'center', padding: 4 }}>Không có file</div>}
                            </Panel>

                            {/* Links Panel */}
                            <Panel header={<strong>{`Link (${links.length})`}</strong>} key="3">
                                {links.slice(0, MAX_PREVIEW).map((link, i) => (
                                    <div key={i} style={{ margin: '8px 0px' }}>
                                        <a href={link.file_path}>{link.file_path}</a>
                                    </div>
                                ))}
                                {links.length > 0 && (
                                    <Button
                                        type="dashed"
                                        block
                                        style={{ height: '100%', marginTop: 8 }}
                                        onClick={() => { setAttachmentsHistory({ items: links, type: 'link', isShow: true }) }}
                                    >
                                        {`Xem tất cả`}
                                    </Button>
                                )}
                                {links.length === 0 && <div style={{ textAlign: 'center', padding: 4 }}>Không có link</div>}
                            </Panel>
                        </Collapse>
                        <Divider style={{ margin: 0 }} />
                        <Space direction="vertical" style={{ width: '100%', padding: 16 }}>
                            <div className="d-flex justify-content-between"><div className="d-flex gap-1"><BellOutlined style={{ fontSize: 20 }} /> Tắt thông báo</div> <Switch checked={!(activeChat?.muted === 'N' || activeChat?.muted === null)} onChange={onChangeNotifiable} /></div>
                        </Space>
                        <Divider style={{ margin: 0 }} />
                        <Space direction="vertical" style={{ width: '100%', padding: 16 }}>
                            {activeChat.type === "group" &&
                                <Popconfirm title="Bạn có chắc chắn muốn rời nhóm chat này không?" onConfirm={() => leaveGroupChat()}>
                                    <Button danger style={{ display: 'flex', alignItems: 'center', color: 'red' }}>
                                        <LogoutOutlined className="delete-btn" /> Rời đoạn chat
                                    </Button>
                                </Popconfirm>
                            }
                            {((activeChat.type === "group" && activeChat?.creator?.id == userProfile?.id) || (activeChat.type === "private")) &&
                                <Popconfirm title="Bạn có chắc chắn muốn xóa đoạn chat này không?" onConfirm={() => deleteHistory()}>
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