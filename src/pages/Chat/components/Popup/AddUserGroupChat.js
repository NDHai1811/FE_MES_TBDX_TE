import { SearchOutlined } from "@ant-design/icons";
import { Avatar, Checkbox, Col, Form, Input, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import { filterUsersByName, fullNameToColor } from "../../chat_helper";
import { updateChat } from "../../../../api/ui/chat";
import { useProfile } from "../../../../components/hooks/UserHooks";

const AddUserGroupChat = ({ users = [], open, setOpen, chat }) => {
    const { userProfile } = useProfile();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (values) => {
        setLoading(true);
        values.members = values.user_chat;
        var res = await updateChat(values, chat?.id);
        form.resetFields();
        setLoading(false);
        setOpen(false);
    }
    const userChat = Form.useWatch('user_chat', form) ?? [];
    const userSearch = Form.useWatch('user_search', form) ?? '';
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 992);
    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth > 992);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <Modal
            title="Thêm thành viên"
            open={open}
            onOk={() => form.submit()}
            confirmLoading={loading}
            onCancel={() => { setOpen(false); form.resetFields(); }}
            okText="Xác nhận"
            okButtonProps={{ disabled: userChat.length <= 0 }}
            width={700}
        >
            <Form form={form} onFinish={handleSubmit} initialValues={{
                user_chat: (chat.participants ?? []).map(e => e.id),
                name: '',
                user_search: ''
            }}>
                <Row gutter={12}>
                    <Col span={12}>
                        <div style={{
                            border: '1px solid #00000020',
                            borderRadius: 8,
                            padding: 16,
                            overflow: 'auto',
                            height: 400
                        }}>
                            <p>Danh sách tài khoản</p>
                            <Form.Item name="user_search" noStyle>
                                <Input placeholder="Tìm kiếm tài khoản" style={{ marginBottom: 8 }} addonBefore={<SearchOutlined />} allowClear />
                            </Form.Item>
                            <Form.Item name="user_chat" shouldUpdate>
                                <Checkbox.Group
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 8,
                                    }}
                                >
                                    {filterUsersByName(users, userSearch).map(user => {
                                        return <Checkbox value={user.id} disabled={user.disabled}>
                                            {isLargeScreen && <Avatar size={40} src={user?.avatar} style={{ backgroundColor: fullNameToColor(user?.name) }}>
                                                {user?.name?.trim().split(/\s+/).pop()[0].toUpperCase()}
                                            </Avatar>} <span style={{ marginLeft: 8 }}>{user?.name}</span>
                                        </Checkbox>
                                    })}
                                </Checkbox.Group>
                            </Form.Item>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={{
                            border: '1px solid #00000020',
                            borderRadius: 8,
                            padding: 16,
                            overflow: 'auto',
                            height: 400,
                            gap: 8,
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <p>Đã chọn</p>
                            {users.filter(e => userChat.includes(e.id)).map(user => {
                                return (
                                    <Checkbox value={user.id} disabled={user.disabled} checked onClick={() => form.setFieldValue('user_chat', userChat.filter(e => e !== user.id))}>
                                        {isLargeScreen && <Avatar size={40} src={user?.avatar} style={{ backgroundColor: fullNameToColor(user?.name) }}>
                                            {user?.name?.trim().split(/\s+/).pop()[0].toUpperCase()}
                                        </Avatar>}<span style={{ marginLeft: 8 }}>{user?.name}</span>
                                    </Checkbox>
                                )
                            })}
                        </div>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default AddUserGroupChat;