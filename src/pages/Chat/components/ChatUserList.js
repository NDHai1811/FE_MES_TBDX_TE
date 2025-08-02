import { Avatar, Badge, Button, Tooltip } from "antd"
import { fullNameToColor } from "../chat_helper"
import { KeyOutlined, PlusOutlined } from "@ant-design/icons"
import AddUserGroupChat from "./Popup/AddUserGroupChat"
import { useEffect, useState } from "react"
import { getUsers } from "../../../api"
import { useProfile } from "../../../components/hooks/UserHooks"

export default function ChatUserList({ chat, users = [] }) {
    const { userProfile } = useProfile();
    const [openPopupAddUser, setOpenPopupAddUser] = useState(false);
    const openPopup = () => {
        setOpenPopupAddUser(true);
    }
    useEffect(() => {
        users.map((e, i) => ({ ...e, value: e.id, label: (`${e.name} - ID: ${e.username}`), key: i, disabled: e.id == userProfile.id }))
    }, [users])
    return (
        <div style={{
            padding: 16,
            overflow: 'auto',
            gap: 8,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Button icon={<PlusOutlined />} block type='dashed' onClick={() => openPopup()}>Thêm thành viên</Button>
            {(chat.participants ?? []).map(user => {
                return (
                    <div style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                        <Badge
                            status={"default"}
                            count={chat?.creator?.username === user?.username ?
                                <div style={{ color: '#faad14', backgroundColor: 'grey', padding: 4, borderRadius: '50%' }}>
                                    <Tooltip title="Người tạo phòng" placement="right">
                                        <KeyOutlined style={{ fontSize: 12 }} />
                                    </Tooltip>
                                </div>
                                : null}
                            offset={[-8, 32]}
                        >
                            <Avatar size={40} src={user?.avatar} style={{ backgroundColor: fullNameToColor(user?.name) }}>
                                {user?.name?.trim().split(/\s+/).pop()[0].toUpperCase()}
                            </Avatar>
                        </Badge> <span style={{ marginLeft: 8 }}>{user?.name}</span>
                    </div>
                )
            })}
            {chat && <AddUserGroupChat users={users} open={openPopupAddUser} setOpen={setOpenPopupAddUser} chat={chat} />}
        </div>)
}