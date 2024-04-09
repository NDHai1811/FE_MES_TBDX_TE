import {
    DatePicker,
    Col,
    Row,
    Card,
    Table,
    Tag,
    Layout,
    Divider,
    Button,
    Form,
    Input,
    theme,
    Select,
    AutoComplete,
    Upload,
    message,
    Checkbox,
    Space,
    Modal,
    Spin,
    Popconfirm,
    Badge,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useRef, useEffect } from "react";
import {
    createUsers,
    createVehicles,
    deleteUsers,
    deleteVehicles,
    exportUsers,
    exportVehicles,
    getUserRoles,
    getUsers,
    getVehicles,
    updateUsers,
    updateVehicles,
} from "../../../api";
import { useProfile } from "../../../components/hooks/UserHooks";

const Vehicle = () => {
    document.title = "Quản lý xe";
    const [listCheck, setListCheck] = useState([]);
    const [openMdl, setOpenMdl] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form] = Form.useForm();
    const [params, setParams] = useState({});
    const [users, setUsers] = useState([]);
    const col_detailTable = [
        {
            title: "Phương tiện",
            dataIndex: "id",
            key: "id",
            align: "center",
        },
        {
            title: "Tải trọng",
            dataIndex: "weight",
            key: "weight",
            align: "center",
        },
        {
            title: "Lái xe",
            children: [
                {
                    title: "Họ và tên",
                    dataIndex: "user1_name",
                    key: "user1_name",
                    align: "center",
                    render: (value, record) => record?.driver?.name
                },
                {
                    title: "Mã NV",
                    dataIndex: "user1_username",
                    key: "user1_username",
                    align: "center",
                    render: (value, record) => record?.driver?.username
                },
                {
                    title: "SĐT",
                    dataIndex: "user1_phone_number",
                    key: "user1_phone_number",
                    align: "center",
                    render: (value, record) => record?.driver?.phone_number
                },
            ]
        },
        {
            title: "Phụ xe 1",
            children: [
                {
                    title: "Họ và tên",
                    dataIndex: "user2_name",
                    key: "user2_name",
                    align: "center",
                    render: (value, record) => record?.assistant_driver1?.name
                },
                {
                    title: "Mã NV",
                    dataIndex: "user2_username",
                    key: "user2_username",
                    align: "center",
                    render: (value, record) => record?.assistant_driver1?.username
                },
                {
                    title: "SĐT",
                    dataIndex: "user2_phone_number",
                    key: "user2_phone_number",
                    align: "center",
                    render: (value, record) => record?.assistant_driver1?.phone_number
                },
            ]
        },
        {
            title: "Phụ xe 2",
            children: [
                {
                    title: "Họ và tên",
                    dataIndex: "user3_name",
                    key: "user3_name",
                    align: "center",
                    render: (value, record) => record?.assistant_driver2?.name
                },
                {
                    title: "Mã NV",
                    dataIndex: "user3_username",
                    key: "user3_username",
                    align: "center",
                    render: (value, record) => record?.assistant_driver2?.username
                },
                {
                    title: "SĐT",
                    dataIndex: "user3_phone_number",
                    key: "user3_phone_number",
                    align: "center",
                    render: (value, record) => record?.assistant_driver2?.phone_number
                },
            ]
        },
    ];
    const formFields = [
        {
            title: "Biển số xe",
            key: "id",
            required: true,
        },
        {
            title: "Tải trọng",
            key: "weight",
            required: true,
        },
        {
            title: "Lái xe",
            key: "user1",
            select: {
                options: users,
            },
        },
        {
            title: "Phụ xe 1",
            key: "user2",
            select: {
                options: users,
            },
        },
        {
            title: "Phụ xe 2",
            key: "user3",
            select: {
                options: users,
            },
        },
    ];

    function btn_click() {
        loadListTable(params);
    }

    const [data, setData] = useState([]);
    const loadListTable = async (params) => {
        setLoading(true);
        const res = await getVehicles(params);
        setData(
            res.map((e) => {
                return { ...e, key: e.id };
            })
        );
        setLoading(false);
    };
    useEffect(() => {
        (async () => {
            loadListTable(params);
            var res = await getUsers();
            setUsers(res.map(e => ({ ...e, value: e?.id?.toString(), label: e?.name })));
        })();
    }, []);

    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: "success",
            content: "Upload file thành công",
        });
    };

    const error = () => {
        messageApi.open({
            type: "error",
            content: "Upload file lỗi",
        });
    };

    const onFinish = async (values) => {
        console.log(values);
        if (isEdit) {
            const res = await updateVehicles(values);
            console.log(res);
            if (res) {
                form.resetFields();
                setOpenMdl(false);
                loadListTable(params);
            }
        } else {
            const res = await createVehicles(values);
            console.log(res);
            if (res) {
                form.resetFields();
                setOpenMdl(false);
                loadListTable(params);
            }
        }
    };

    const deleteRecord = async () => {
        if (listCheck.length > 0) {
            const res = await deleteVehicles(listCheck);
            setListCheck([]);
            loadListTable(params);
        } else {
            message.info("Chưa chọn bản ghi cần xóa");
        }
    };
    const editRecord = () => {
        setIsEdit(true);
        if (listCheck.length !== 1) {
            message.info("Chọn 1 bản ghi để chỉnh sửa");
        } else {
            const result = data.find((record) => record.id === listCheck[0]);
            console.log(result);
            form.setFieldsValue({ ...result });
            setOpenMdl(true);
        }
    };
    const insertRecord = () => {
        setIsEdit(false);
        form.resetFields();
        setOpenMdl(true);
    };
    const [loadingExport, setLoadingExport] = useState(false);
    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const exportFile = async () => {
        setExportLoading(true);
        const res = await exportVehicles(params);
        if (res.success) {
            window.location.href = baseURL + res.data;
        }
        setExportLoading(false);
    };
    const rowSelection = {
        fixed: true,
        onChange: (selectedRowKeys, selectedRows) => {
            setListCheck(selectedRowKeys);
        },
    };
    const { userProfile } = useProfile();
    return (
        <>
            {contextHolder}
            <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
                <Col span={4}>
                    <div className="slide-bar">
                        <Card style={{ height: "100%" }} bodyStyle={{ padding: 0 }} className="custom-card" actions={[
                            <Button
                                type="primary"
                                onClick={btn_click}
                                style={{ width: "80%" }}
                            >
                                Tìm kiếm
                            </Button>
                        ]}>
                            <Divider>Tìm kiếm</Divider>
                            <div className="mb-3">
                                <Form
                                    style={{ margin: "0 15px" }}
                                    layout="vertical"
                                    onFinish={btn_click}
                                >
                                    <Form.Item label="Tên" className="mb-3">
                                        <Input
                                            allowClear
                                            onChange={(e) =>
                                                setParams({ ...params, name: e.target.value })
                                            }
                                            placeholder="Nhập tên nhân viên"
                                        />
                                    </Form.Item>
                                    <Button hidden htmlType="submit"></Button>
                                </Form>
                            </div>
                        </Card>
                    </div>
                </Col>
                <Col span={20}>
                    <Card
                        style={{ height: "100%" }}
                        className="custom-card"
                        title="Quản lý xe"
                        extra={
                            <Space>
                                <Upload
                                    showUploadList={false}
                                    name="files"
                                    action={baseURL + "/api/vehicles/import"}
                                    headers={{
                                        authorization: "Bearer " + userProfile.token,
                                    }}
                                    onChange={(info) => {
                                        setLoadingExport(true);
                                        if (info.file.status === "error") {
                                            setLoadingExport(false);
                                            error();
                                        } else if (info.file.status === "done") {
                                            if (info.file.response.success === true) {
                                                loadListTable(params);
                                                success();
                                                setLoadingExport(false);
                                            } else {
                                                loadListTable(params);
                                                message.error(info.file.response.message);
                                                setLoadingExport(false);
                                            }
                                        }
                                    }}
                                >
                                    <Button
                                        style={{ marginLeft: "15px" }}
                                        type="primary"
                                        loading={loadingExport}
                                    >
                                        Upload Excel
                                    </Button>
                                </Upload>
                                <Button
                                    type="primary"
                                    onClick={exportFile}
                                    loading={exportLoading}
                                >
                                    Export Excel
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={editRecord}
                                    disabled={listCheck.length <= 0}
                                >
                                    Edit
                                </Button>
                                <Button type="primary" onClick={insertRecord}>
                                    Insert
                                </Button>
                                <Popconfirm
                                    title="Xoá bản ghi"
                                    description={
                                        "Bạn có chắc xoá " + listCheck.length + " bản ghi đã chọn?"
                                    }
                                    onConfirm={deleteRecord}
                                    okText="Có"
                                    cancelText="Không"
                                    placement="bottomRight"
                                >
                                    <Button type="primary" disabled={listCheck.length <= 0}>
                                        Delete
                                    </Button>
                                </Popconfirm>
                            </Space>
                        }
                    >
                        <Spin spinning={loading}>
                            <Table
                                size="small"
                                bordered
                                pagination={true}
                                scroll={{
                                    x: "150vw",
                                    y: window.innerHeight * 0.53,
                                }}
                                columns={col_detailTable}
                                dataSource={data}
                                rowSelection={rowSelection}
                            />
                        </Spin>
                    </Card>
                </Col>
            </Row>
            <Modal
                title={isEdit ? "Cập nhật" : "Thêm mới"}
                open={openMdl}
                onCancel={() => setOpenMdl(false)}
                footer={null}
                width={800}
            >
                <Form
                    style={{ margin: "0 15px" }}
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}
                >
                    <Row gutter={[16, 16]}>
                        {formFields.map((e) => {
                            if (e.key !== "select" && e.key !== "stt")
                                return (
                                    <Col span={!e.hidden ? 12 : 0}>
                                        <Form.Item
                                            name={e.key}
                                            className="mb-3"
                                            label={e.title}
                                            hidden={e.hidden}
                                            rules={[{ required: e.required }]}
                                        >
                                            {!e.isTrueFalse ? (
                                                e.select ? (
                                                    <Select
                                                        allowClear
                                                        mode={e.select.mode}
                                                        options={e.select.options}
                                                    />
                                                ) : (
                                                    <Input
                                                        disabled={e.disabled || (isEdit && e.key === "id")}
                                                    ></Input>
                                                )
                                            ) : (
                                                <Select>
                                                    <Select.Option value={1}>Có</Select.Option>
                                                    <Select.Option value={0}>Không</Select.Option>
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                );
                        })}
                    </Row>
                    <Form.Item className="mb-0">
                        <Button type="primary" htmlType="submit">
                            Lưu lại
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default Vehicle;
