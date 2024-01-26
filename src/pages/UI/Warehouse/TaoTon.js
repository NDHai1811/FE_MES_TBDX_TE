import {
    Col,
    Row,
    Card,
    Table,
    Divider,
    Button,
    Form,
    Input,
    Upload,
    message,
    Space,
    Spin,
    Modal,
    Select,
    DatePicker,
    Popconfirm,
    Typography,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useEffect, useRef } from "react";
import { createStampFromOrder, getOrderList, getTems, updateTem } from "../../../api/ui/manufacture";
import "../style.scss";
import { useReactToPrint } from "react-to-print";
import TemPallet from "../../../pages/OI/Warehouse/TemPallet"
import dayjs from "dayjs";
import { getOrders, getUsers } from "../../../api";
import { getCustomers } from "../../../api/ui/main";
import { getMachineList } from "../../../api/ui/machine";
import { EditOutlined } from "@ant-design/icons";
import { getTemPallet } from "../../../api/ui/warehouse";

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    initialValue={record?.[dataIndex]}
                >
                    <Input />
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const TaoTon = () => {
    document.title = "Tạo dữ liệu tồn kho";
    const [listCheck, setListCheck] = useState([]);
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [orders, setOrders] = useState([])
    const [loadingExport, setLoadingExport] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingKey, setEditingKey] = useState("");
    const [orderParams, setOrderParams] = useState({ start_date: dayjs(), end_date: dayjs() });
    const componentRef1 = useRef();
    const isEditing = (record) => record.key === editingKey;
    const onUpdate = async () => {
        const item = data.find((val) => val.key === editingKey);
        const row = await form.validateFields();
        const res = await updateTem({ ...item, ...row });
        if (res) {
            form.resetFields();
            loadListTable();
            setEditingKey("");
            // if (listCheck.length > 0) {
            //   setListCheck([]);
            // }
        }
    };
    const cancel = () => {
        setEditingKey("");
    };
    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.key);
    };
    const col_detailTable = [
        {
            title: "Mã pallet",
            dataIndex: "pallet_id",
            key: "pallet_id",
            align: "center",
        },
        {
            title: "Mã vị trí",
            dataIndex: "locator_id",
            key: "locator_id",
            align: "center",
        },
        {
            title: "Khách hàng",
            dataIndex: "khach_hang",
            key: "khach_hang",
            align: "center",
        },
        {
            title: "Số lượng",
            dataIndex: "so_luong",
            key: "so_luong",
            align: "center",
        },
    ];
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        (async () => {
            loadListTable();
            const res1 = await getMachineList();
            setListMachines(res1.data.map((e) => ({ ...e, label: e.name + ' (' + e.id + ')', value: e.id })));
            const res2 = await getCustomers();
            setListCustomers(res2.data.map((e) => ({ ...e, label: e.name, value: e.id })));
            const res3 = await getUsers();
            setListUsers(res3.map((e) => ({ ...e, label: e.name, value: e.username })));
        })();
    }, []);

    const loadListTable = async () => {
        setLoading(true);
        const res = await getTemPallet();
        setData(res.map(e => ({ ...e, key: e.id })));
        setLoading(false);
    };


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
    const options = (dataIndex) => {
        var record = data.find(e => e.id === editingKey);
        let filteredOptions = [];
        return filteredOptions;
    }
    const print = useReactToPrint({
        content: () => componentRef1.current,
    });

    const handlePrint = async () => {
        print();
        setListCheck([])
    };
    const onChange = (value, dataIndex) => {
        const items = data.map((val) => {
            if (val.key === editingKey) {
                val[dataIndex] = value;
            }
            return { ...val };
        });
        value.isValid() && setData(items);
    };
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            const arr = selectedRows.map((value) => {
                if (value.losxpallet) {
                    return value.losxpallet
                }
            })
            setListCheck(arr);
        },
    };
    const mergedColumns = col_detailTable.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: "text",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                options: options(col.dataIndex)
            })
        };
    });

    const [openModal, setOpenModal] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const searchOrder = async () => {
        setLoadingOrders(true);
        const res = await getOrders(orderParams);
        setOrders(res.data);
        setLoadingOrders(false);
    }
    const [listCustomers, setListCustomers] = useState([]);
    const [listUsers, setListUsers] = useState([]);
    const [listMachines, setListMachines] = useState([]);
    const ordersColumn = [
        {
            title: "Mã pallet",
            dataIndex: "pallet_id",
            key: "pallet_id",
            align: "center",
        },
        {
            title: "Mã vị trí",
            dataIndex: "locator_id",
            key: "locator_id",
            align: "center",
        },
        {
            title: "Khách hàng",
            dataIndex: "khach_hang",
            key: "khach_hang",
            align: "center",
        },
        {
            title: "Số lượng",
            dataIndex: "so_luong",
            key: "so_luong",
            align: "center",
        },
    ];
    const [orderChecked, setOrderChecked] = useState([])
    const orderRowSelection = {
        selectedRowKeys: orderChecked,
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(selectedRows, selectedRowKeys);
            setOrderChecked(selectedRowKeys);
        },
    };
    const createStamp = async () => {
        if (!orderParams.machine_id) {
            messageApi.info('Chưa chọn máy');
            return 0;
        }
        if (orderChecked.length <= 0) {
            messageApi.info('Chưa chọn đơn hàng');
            return 0;
        }
        if (!orderParams.nhan_vien_sx) {
            messageApi.info('Chưa chọn nhân viên');
            return 0;
        }
        var res = await createStampFromOrder({ order_ids: orderChecked, machine_id: orderParams.machine_id, nhan_vien_sx: orderParams.nhan_vien_sx });
        if (res.success) {
            setOpenModal(false);
            setOrderChecked([]);
            loadListTable();
        }
    }
    useEffect(() => {
        openModal && searchOrder()
    }, [openModal]);
    useEffect(() => {
        console.log(orderParams);
    }, [orderParams])
    return (
        <>
            {contextHolder}
            <Row style={{ padding: "8px", height: "90vh" }} gutter={[8, 8]}>
                <Col span={24}>
                    <Card
                        style={{ height: "100%" }}
                        title="Quản lý tạo tồn kho thành phẩm"
                        extra={
                            <Space>
                                <Button
                                    size="medium"
                                    type="primary"
                                    onClick={handlePrint}
                                >
                                    In tem
                                </Button>
                                <Upload
                                    showUploadList={false}
                                    name="files"
                                    action={baseURL + "/api/upload-ton-kho"}
                                    headers={{
                                        authorization: "authorization-text",
                                    }}
                                    onChange={(info) => {
                                        setLoadingExport(true);
                                        if (info.file.status === "error") {
                                            setLoadingExport(false);
                                            error();
                                        } else if (info.file.status === "done") {
                                            if (info.file.response.success === true) {
                                                loadListTable();
                                                success();
                                                setLoadingExport(false);
                                            } else {
                                                loadListTable();
                                                message.error(info.file.response.message);
                                                setLoadingExport(false);
                                            }
                                        }
                                    }}
                                >
                                    <Button
                                        type="primary"
                                        loading={loadingExport}
                                    >
                                        Upload Excel
                                    </Button>
                                </Upload>
                            </Space>
                        }
                    >
                        <Spin spinning={loading}>
                            <Form form={form} component={false}>
                                <Table
                                    pagination={false}
                                    size="small"
                                    bordered
                                    scroll={{
                                        y: "70vh",
                                    }}
                                    components={{
                                        body: {
                                            cell: EditableCell,
                                        },
                                    }}
                                    rowClassName="editable-row"
                                    columns={mergedColumns}
                                    dataSource={data}
                                    rowSelection={rowSelection}
                                />
                            </Form>
                        </Spin>
                    </Card>
                </Col>
            </Row>
            <div className="report-history-invoice">
                <TemPallet listCheck={listCheck} ref={componentRef1} />
            </div>
            <Modal open={openModal} onCancel={() => setOpenModal(false)} title="Tạo tem từ đơn hàng" width={1000}
                okText={'Tạo tem'}
                onOk={() => createStamp()}
            >
                <Form layout="vertical">
                    <Row gutter={[8, 8]}>
                        <Col span={4}>
                            <Form.Item
                                label="Máy"
                                className="mb-3"
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder="Chọn máy"
                                    style={{ width: "100%" }}
                                    onChange={(value) => {
                                        setOrderParams({ ...orderParams, machine_id: value })
                                    }

                                    }
                                    filterOption={(input, option) =>
                                        (option?.label ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    options={listMachines}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                label="Khách hàng"
                                className="mb-3"
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder="Chọn khách hàng"
                                    style={{ width: "100%" }}
                                    onChange={(value) =>
                                        setOrderParams({ ...orderParams, short_name: value })
                                    }
                                    filterOption={(input, option) =>
                                        (option?.label ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    popupMatchSelectWidth={listCustomers.length > 0 ? 400 : 0}
                                    options={listCustomers}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                label="MDH"
                                className="mb-3"
                            >
                                <Input
                                    allowClear
                                    onChange={(e) =>
                                        setOrderParams({ ...orderParams, mdh: e.target.value })
                                    }
                                    placeholder="Nhập MDH"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                label="Bắt đầu"
                                className="mb-3"
                            >
                                <DatePicker
                                    allowClear={false}
                                    placeholder="Bắt đầu"
                                    style={{ width: "100%" }}
                                    onChange={(value) =>
                                        setOrderParams({ ...orderParams, start_date: value })
                                    }
                                    value={orderParams.start_date}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                label="Kết thúc"
                                className="mb-3"
                            >
                                <DatePicker
                                    allowClear={false}
                                    placeholder="Kết thúc"
                                    style={{ width: "100%" }}
                                    onChange={(value) =>
                                        setOrderParams({ ...orderParams, end_date: value })
                                    }
                                    value={orderParams.end_date}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                label="Nhân viên sản xuất"
                                className="mb-3"
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder="Chọn người sản xuất"
                                    style={{ width: "100%" }}
                                    onChange={(value) =>
                                        setOrderParams({ ...orderParams, nhan_vien_sx: value })
                                    }
                                    filterOption={(input, option) =>
                                        (option?.label ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    popupMatchSelectWidth={listUsers.length > 0 ? 400 : 0}
                                    options={listUsers}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Button type="primary" className="mb-1" onClick={searchOrder}>Tìm kiếm</Button>
                <Table size='small' bordered
                    loading={loadingOrders}
                    pagination={false}
                    scroll={
                        {
                            x: '130vw',
                            y: '60vh'
                        }
                    }
                    tableLayout="fixed"
                    rowSelection={orderRowSelection}
                    columns={ordersColumn}
                    dataSource={orders.map(e => ({ ...e, key: e.id }))} />
            </Modal>
        </>
    );
};

export default TaoTon;
