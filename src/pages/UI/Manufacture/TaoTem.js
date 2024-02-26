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
    Typography,
    InputNumber,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useEffect, useRef } from "react";
import { createStampFromOrder, getTems, updateTem } from "../../../api/ui/manufacture";
import "../style.scss";
import { useReactToPrint } from "react-to-print";
import TemIn from "../../OI/Manufacture/TemIn";
import { getOrders, getUsers } from "../../../api";
import { getCustomers } from "../../../api/ui/main";
import { getMachineList } from "../../../api/ui/machine";
import { EditOutlined } from "@ant-design/icons";
import { useProfile } from "../../../components/hooks/UserHooks";

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    onSelect,
    options,
    ...restProps
}) => {
    let inputNode;
    switch (inputType) {
        case "number":
            inputNode = <InputNumber />;
            break;
        case "select":
            inputNode = (
                <Select
                    value={record?.[dataIndex]}
                    options={options}
                    onChange={(value) => onSelect(value, dataIndex)}
                    bordered
                    showSearch
                />
            );
            break;
        default:
            inputNode = <Input />;
    }
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
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const TaoTem = () => {
    document.title = "Tạo tem sản xuất";
    const { userProfile } = useProfile();
    const [listCheck, setListCheck] = useState([]);
    const [listTem, setListTem] = useState([]);
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [orders, setOrders] = useState([])
    const [loadingExport, setLoadingExport] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingKey, setEditingKey] = useState("");
    const [orderParams, setOrderParams] = useState({ page: 1, pageSize: 50 });
    const componentRef1 = useRef();
    const [totalPage, setTotalPage] = useState(1);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [params, setParams] = useState({ show: 'new' });
    const optionsDisplay = [
        { value: 'new', label: 'Mới' },
        { value: 'all', label: 'Tất cả' },
    ];
    const isEditing = (record) => record.key === editingKey;
    const onUpdate = async () => {
        const item = data.find((val) => val.key === editingKey);
        const row = await form.validateFields();
        console.log({ ...item, ...row });
        const res = await updateTem({ ...item, ...row, ids: listCheck });
        if (res) {
            form.resetFields();
            loadListTable();
            setEditingKey("");
            // if (listCheck.length > 0) {
            //   setListCheck([]);
            // }
        }
    };
    const onSelect = (value, dataIndex) => {
        const items = data.map((val) => {
            if (val.key === editingKey) {
                val[dataIndex] = value;
            }
            return { ...val };
        });
        setData(items);
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
            title: "Lô sản xuất",
            dataIndex: "lo_sx",
            key: "lo_sx",
            align: "center",
            fixed: "left",
        },
        {
            title: "Khách hàng",
            dataIndex: "khach_hang",
            key: "khach_hang",
            align: "center",
        },
        {
            title: "Đơn hàng TBDX",
            dataIndex: "mdh",
            key: "mdh",
            align: "center",
        },
        {
            title: "Đơn hàng khách hàng",
            dataIndex: "order",
            key: "order",
            align: "center",
        },
        {
            title: "Số lượng tem",
            dataIndex: "sl_tem",
            key: "sl_tem",
            align: "center",
            editable: true,
        },
        {
            title: "MQL",
            dataIndex: "mql",
            key: "mql",
            align: "center",
        },
        {
            title: "Số lượng",
            dataIndex: "so_luong",
            key: "so_luong",
            align: "center",
            editable: true,
        },
        {
            title: "GMO",
            dataIndex: "gmo",
            key: "gmo",
            align: "center",
        },
        {
            title: "PO",
            dataIndex: "po",
            key: "po",
            align: "center",
        },
        {
            title: "STYLE",
            dataIndex: "style",
            key: "style",
            align: "center",
        },
        {
            title: "STYLE NO",
            dataIndex: "style",
            key: "style",
            align: "center",
        },
        {
            title: "COLOR",
            dataIndex: "color",
            key: "color",
            align: "center",
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
            align: "center",
        },
        {
            title: "Máy in",
            dataIndex: "machine_id",
            key: "machine_id",
            align: "center",
            editable: true,
        },
        {
            title: "Nhân viên sản xuất",
            dataIndex: "nhan_vien_sx",
            key: "nhan_vien_sx",
            align: "center",
            editable: true,
            width: '12%',
            render: (value) => listUsers.find(e => value == e?.value)?.label
        },
        {
            title: "Tác vụ",
            dataIndex: "action",
            key: "action",
            checked: true,
            align: "center",
            fixed: "right",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => onUpdate(record)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Lưu
                        </Typography.Link>
                        <a onClick={cancel}>Hủy</a>
                    </span>
                ) : (
                    <span>
                        <EditOutlined
                            style={{ color: "#1677ff", fontSize: 18, marginLeft: 8 }}
                            disabled={editingKey !== ""}
                            onClick={() => edit(record)}
                        />
                    </span>
                );
            },
        },
    ];
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        (async () => {
            loadListTable();
            const res1 = await getMachineList();
            setListMachines(res1.data.map((e) => ({ ...e, label: e.id, value: e.id })));
            const res2 = await getCustomers();
            setListCustomers(res2.data.map((e) => ({ ...e, label: e.name, value: e.id })));
            const res3 = await getUsers();
            setListUsers(res3.map((e) => ({ ...e, label: e.name, value: e.id })));
        })();
    }, []);

    const loadListTable = async () => {
        setLoading(true);
        const res = await getTems(params);
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
        switch (dataIndex) {
            case 'nhan_vien_sx':
                filteredOptions = listUsers;
                break;
            case 'machine_id':
                filteredOptions = listMachines;
                break;
            default:
                break;
        }
        return filteredOptions;
    }
    const print = useReactToPrint({
        content: () => componentRef1.current,
    });

    const handlePrint = async () => {
        print();
        // setListCheck([])
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
            setListCheck(selectedRowKeys);
        },
    };
    useEffect(() => {
        setListTem([...data].filter(e => listCheck.includes(e.key)).map(e => {
            console.log({ ...e, nhan_vien_sx: listUsers.find(user => user?.value == e?.nhan_vien_sx)?.label });
            return { ...e, nhan_vien_sx: listUsers.find(user => user?.value == e?.nhan_vien_sx)?.label };
        }));
    }, [listCheck, data])
    const mergedColumns = col_detailTable.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: (col.dataIndex === "nhan_vien_sx" || col.dataIndex === "machine_id") ? 'select' : "text",
                dataIndex: col.dataIndex,
                title: col.title,
                onSelect,
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
        setTotalPage(res.totalPage);
        setLoadingOrders(false);
    }
    const [listCustomers, setListCustomers] = useState([]);
    const [listUsers, setListUsers] = useState([]);
    const [listMachines, setListMachines] = useState([]);
    const ordersColumn = [
        {
            title: "Khách hàng",
            dataIndex: "short_name",
            key: "short_name",
            align: "center",
        },
        {
            title: "Đơn hàng TBDX",
            dataIndex: "mdh",
            key: "mdh",
            align: "center",
        },
        {
            title: "Đơn hàng khách hàng",
            dataIndex: "order",
            key: "order",
            align: "center",
        },
        {
            title: "MQL",
            dataIndex: "mql",
            key: "mql",
            align: "center",
        },
        {
            title: "Số lượng",
            dataIndex: "sl",
            key: "sl",
            align: "center",
        },
        {
            title: "GMO",
            dataIndex: "gmo",
            key: "gmo",
            align: "center",
        },
        {
            title: "PO",
            dataIndex: "po",
            key: "po",
            align: "center",
        },
        {
            title: "STYLE",
            dataIndex: "style",
            key: "style",
            align: "center",
        },
        {
            title: "STYLE NO",
            dataIndex: "style",
            key: "style",
            align: "center",
        },
        {
            title: "COLOR",
            dataIndex: "color",
            key: "color",
            align: "center",
        },
        {
            title: "Ghi chú",
            dataIndex: "note_3",
            key: "note_3",
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
    }, [openModal, orderParams]);
    const tableRef = useRef();
    const header = document.querySelector('.custom-card .ant-table-header');
    const pagination = document.querySelector('.custom-card .ant-pagination');
    const card = document.querySelector('.custom-card .ant-card-body');
    const [tableHeight, setTableHeight] = useState((card?.offsetHeight ?? 0) - 48 - (header?.offsetHeight ?? 0) - (pagination?.offsetHeight ?? 0));
    useEffect(() => {
        const handleWindowResize = () => {
            const header = document.querySelector('.custom-card .ant-table-header');
            const pagination = document.querySelector('.custom-card .ant-pagination');
            const card = document.querySelector('.custom-card .ant-card-body');
            setTableHeight((card?.offsetHeight ?? 0) - 48 - (header?.offsetHeight ?? 0) - (pagination?.offsetHeight ?? 0));
        };
        handleWindowResize();
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [data]);
    return (
        <>
            {contextHolder}
            <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
                <Col span={4}>
                    <div className="slide-bar">
                        <Card
                            bodyStyle={{ paddingInline: 0, paddingTop: 0 }}
                            className="custom-card scroll"
                            actions={[
                                <div
                                    layout="vertical"
                                >
                                    <Button
                                        type="primary"
                                        style={{ width: "80%" }}
                                        onClick={loadListTable}
                                    >
                                        Truy vấn
                                    </Button>
                                </div>
                            ]}
                        >
                            <Divider>Điều kiện truy vấn</Divider>
                            <div className="mb-3">
                                <Form style={{ margin: "0 15px" }} layout="vertical" onFinish={loadListTable}>
                                    <Form.Item label="Hiển thị" className="mb-3">
                                        <Select
                                            options={optionsDisplay}
                                            onChange={(value) => {
                                                setParams({
                                                    ...params,
                                                    show: value,
                                                    page: 1,
                                                });
                                            }}
                                            value={params.show}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Máy" className="mb-3">
                                        <Select
                                            options={listMachines}
                                            onChange={(value) => {
                                                setParams({
                                                    ...params,
                                                    machine_id: value,
                                                    page: 1,
                                                });
                                            }}
                                            allowClear
                                            showSearch
                                            optionFilterProp="label"
                                            value={params.machine_id}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Lô sản xuất" className="mb-3">
                                        <Input
                                            allowClear
                                            onChange={(e) => {
                                                setParams({
                                                    ...params,
                                                    lo_sx: e.target.value,
                                                    page: 1,
                                                });
                                            }}
                                            placeholder="Nhập lô sản xuất"
                                        />
                                    </Form.Item>
                                    <Form.Item label="MĐH" className="mb-3">
                                        <Select
                                            allowClear
                                            showSearch
                                            onChange={(value) => {
                                                setParams({ ...params, mdh: value });
                                            }}
                                            open={false}
                                            suffixIcon={null}
                                            mode="tags"
                                            placeholder="Nhập mã đơn hàng"
                                            options={[]}
                                        />
                                    </Form.Item>
                                    <Form.Item label="MQL" className="mb-3">
                                        <Input
                                            allowClear
                                            onChange={(e) => {
                                                setParams({
                                                    ...params,
                                                    mql: e.target.value,
                                                    page: 1,
                                                });
                                            }}
                                            placeholder="Nhập mã quản lý"
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
                        title="Quản lý tạo tem"
                        className="custom-card"
                        extra={
                            <Space>
                                <Button
                                    size="medium"
                                    type="primary"
                                    style={{ width: "100%" }}
                                    onClick={() => setOpenModal(true)}
                                >
                                    Tạo từ ĐH
                                </Button>
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
                                    action={baseURL + "/api/upload-tem"}
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
                                    ref={tableRef}
                                    pagination={false}
                                    size="small"
                                    bordered
                                    scroll={{
                                        y: tableHeight,
                                        x: "120vw"
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
                <TemIn listCheck={listTem} ref={componentRef1} />
            </div>
            <Modal open={openModal} onCancel={() => setOpenModal(false)} title="Tạo tem từ đơn hàng" width={1200}
                okText={'Tạo tem'}
                onOk={() => createStamp()}
            >
                <Form layout="vertical">
                    <Row gutter={[8, 8]}>
                        <Col span={6}>
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
                        <Col span={6}>
                            <Form.Item
                                label="Khách hàng"
                                className="mb-3"
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder="Chọn khách hàng"
                                    style={{ width: "100%" }}
                                    onChange={(value) => {
                                        setOrderParams({ ...orderParams, short_name: value, page: 1 });
                                        setPage(1);
                                    }
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
                        <Col span={6}>
                            <Form.Item
                                label="MDH"
                                className="mb-3"
                            >
                                <Select
                                    mode="tags"
                                    allowClear
                                    showSearch
                                    suffixIcon={null}
                                    onChange={(value) => {
                                        setOrderParams({ ...orderParams, mdh: value, page: 1 });
                                        setPage(1);
                                    }}
                                    open={false}
                                    placeholder="Nhập mã đơn hàng"
                                    options={[]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
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
                <Table size='small' bordered
                    loading={loadingOrders}
                    pagination={{
                        current: page,
                        size: "default",
                        total: totalPage,
                        pageSize: 50,
                        showSizeChanger: true,
                        onChange: (page, pageSize) => {
                            setPage(page);
                            setPageSize(pageSize);
                            setOrderParams({ ...orderParams, page: page, pageSize: pageSize });
                        },
                    }}
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

export default TaoTem;
