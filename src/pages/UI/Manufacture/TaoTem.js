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
    Tabs,
    Badge,
    DatePicker,
    Empty,
    Popconfirm,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useEffect, useRef } from "react";
import { createStampFromOrder, deleteTem, getTems, updateTem } from "../../../api/ui/manufacture";
import "../style.scss";
import { useReactToPrint } from "react-to-print";
import { getOrders, getUsers } from "../../../api";
import { getCustomers } from "../../../api/ui/main";
import { getMachineList } from "../../../api/ui/machine";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useProfile } from "../../../components/hooks/UserHooks";
import TemThanhPham from "../../OI/Manufacture/TemThanhPham";
import dayjs from "dayjs";
import EditableTable from "../../../components/Table/EditableTable";

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
                    popupMatchSelectWidth={options.length > 0 ? 200 : 0}
                    showSearch
                    optionFilterProp="label"
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
    const [orderParams, setOrderParams] = useState({ page: 1, pageSize: 20 });
    const componentRef1 = useRef();
    const [totalPage, setTotalPage] = useState(1);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
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
            width: 120
        },
        {
            title: "Khách hàng",
            dataIndex: "khach_hang",
            key: "khach_hang",
            align: "center",
            fixed: "left",
            width: 100,
        },
        {
            title: "Đơn hàng TBDX",
            dataIndex: "mdh",
            key: "mdh",
            align: "center",
            fixed: "left",
            width: 100
        },
        {
            title: "Đơn hàng KH",
            dataIndex: "order_kh",
            key: "order_kh",
            align: "center",
            fixed: "left",
            width: 120
        },
        {
            title: "SL tem",
            dataIndex: "sl_tem",
            key: "sl_tem",
            align: "center",
            fixed: "left",
            editable: true,
            width: 60
        },
        {
            title: "MQL",
            dataIndex: "mql",
            key: "mql",
            align: "center",
            fixed: "left",
            width: 60
        },
        {
            title: "Số lượng",
            dataIndex: "so_luong",
            key: "so_luong",
            align: "center",
            editable: true,
            fixed: "left",
            width: 70
        },
        {
            title: "GMO",
            dataIndex: "gmo",
            key: "gmo",
            align: "center",
            width: 150
        },
        {
            title: "PO",
            dataIndex: "po",
            key: "po",
            align: "center",
            width: 150
        },
        {
            title: "STYLE",
            dataIndex: "style",
            key: "style",
            align: "center",
            width: 150
        },
        {
            title: "STYLE NO",
            dataIndex: "style",
            key: "style",
            align: "center",
            width: 150
        },
        {
            title: "COLOR",
            dataIndex: "color",
            key: "color",
            align: "center",
            width: 150
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
            align: "center",
            editable: true,
            width: 150
        },
        {
            title: "Máy in",
            dataIndex: "machine_id",
            key: "machine_id",
            align: "center",
            width: 70,
            editable: true,
        },
        {
            title: "Nhân viên sản xuất",
            dataIndex: "nhan_vien_sx",
            key: "nhan_vien_sx",
            align: "center",
            width: 150,
            editable: true,
            render: (value) => listUsers.find(e => value == e?.value)?.label
        },
        {
            title: "Tác vụ",
            dataIndex: "action",
            key: "action",
            checked: true,
            align: "center",
            fixed: "right",
            width: 50,
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Space wrap>
                        <Typography.Link
                            onClick={() => onUpdate(record)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Lưu
                        </Typography.Link>
                        <a onClick={cancel}>Hủy</a>
                    </Space>
                ) : (
                    <Space wrap>
                        <EditOutlined
                            style={{ color: "#1677ff", fontSize: 18 }}
                            disabled={editingKey !== ""}
                            onClick={() => edit(record)}
                        />
                        <Popconfirm title="Bạn có chắc chắn muốn xoá?" onConfirm={()=>deleteRecord(record)}>
                            <DeleteOutlined
                                style={{ color: "red", fontSize: 18 }}
                                disabled={editingKey !== ""}
                            />
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];
    const deleteRecord = async (record) => {
        var res = await deleteTem(record?.id);
        if(res.success){
            loadListTable();
        }
    }
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        (async () => {
            loadListTable();
            const res1 = await getMachineList();
            setListMachines(res1.data.map((e) => ({ ...e, label: e.name + ' (' + e.id + ')', value: e.id })));
            const res2 = await getCustomers();
            setListCustomers(res2.data);
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
        fixed: 'left',
        columnWidth: 48,
        onChange: (selectedRowKeys, selectedRows) => {
            setListCheck(selectedRowKeys);
        },
    };
    useEffect(() => {
        setListTem([...data].filter(e => listCheck.includes(e.key)).map(e => {
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
        setOrders(res.data.map(e => ({ ...e, key: e.id })));
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
            width: '120px',
            fixed: "left",
        },
        {
            title: "MDH",
            dataIndex: "mdh",
            key: "mdh",
            align: "center",
            width: '100px',
            fixed: "left",
        },
        {
            title: "Order",
            dataIndex: "order",
            key: "order",
            align: "center",
            width: '120px',
            fixed: "left",
        },
        {
            title: "MQL",
            dataIndex: "mql",
            key: "mql",
            align: "center",
            width: '50px',
            fixed: "left",
        },
        {
            title: "Số lượng",
            dataIndex: "sl",
            key: "sl",
            align: "center",
            width: '80px',
            fixed: "left",
        },
        {
            title: "Kích thước",
            dataIndex: "kich_thuoc",
            key: "kich_thuoc",
            align: "center",
            width: '150px'
        },
        {
            title: "Dài",
            dataIndex: "length",
            key: "length",
            align: "center",
            width: '50px'
        },
        {
            title: "Rộng",
            dataIndex: "width",
            key: "width",
            align: "center",
            width: '55px'
        },
        {
            title: "Cao",
            dataIndex: "height",
            key: "height",
            align: "center",
            width: '50px'
        },
        {
            title: "GMO",
            dataIndex: "gmo",
            key: "gmo",
            align: "center",
            width: '180px'
        },
        {
            title: "PO",
            dataIndex: "po",
            key: "po",
            align: "center",
            width: '240px'
        },
        {
            title: "STYLE",
            dataIndex: "style",
            key: "style",
            align: "center",
            width: '180px'
        },
        {
            title: "STYLE NO",
            dataIndex: "style",
            key: "style",
            align: "center",
            width: '180px'
        },
        {
            title: "COLOR",
            dataIndex: "color",
            key: "color",
            align: "center",
            width: '180px'
        },
        {
            title: "Đợt",
            dataIndex: "dot",
            key: "dot",
            align: "center",
            width: '70px'
        },
        {
            title: "Ghi chú",
            dataIndex: "note_3",
            key: "note_3",
            align: "center",
        },
        {
            title: "Ngày thực hiện KH",
            dataIndex: "ngay_thuc_hien_kh",
            key: "ngay_thuc_hien_kh",
            align: "center",
            render: (value, item, index) => item.group_plan_order ? dayjs(item.group_plan_order.plan?.thoi_gian_bat_dau).format('DD-MM-YYYY') : '',
        },
    ];
    const selectOrdersColumns = [
        ...ordersColumn.slice(0, 5),
        {
            title: 'Số lượng định mức',
            dataIndex: 'sl_dinh_muc',
            key: "sl_dinh_muc",
            align: 'center',
            editable: true,
            inputType: 'number',
            inputProps: {
                max: (record) => record?.sl,
                min: 0
            }
        },
        ...ordersColumn.slice(5)];
    const [orderChecked, setOrderChecked] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const orderRowSelection = {
        selectedRowKeys: selectedOrders.map(e => e.id),
        fixed: true,
        onChange: (selectedRowKeys, selectedRows) => {
            setOrderChecked(selectedRowKeys);
            setSelectedOrders(prev => {
                const newArray = [...prev, ...selectedRows];
                return newArray.filter((e, index) => {
                    return index === newArray.findIndex(o => e.id === o.id);
                });
            });
        },
        onSelectAll: (selected, selectedRows, changeRows) => !selected && onDeselectOrders(changeRows),
        onSelect: (record, selected, selectedRows, nativeEvent) => !selected && onDeselectOrders([record])
    };
    const onDeselectOrders = (rows) => {
        setSelectedOrders(prev => {
            const newArray = [...prev];
            return newArray.filter((e, index) => {
                return !rows.some(o => o.id === e.id)
            });
        });
    }
    const onChangeSLDM = (rowData, editingKey) => {
        setSelectedOrders(prev => {
            const newArray = [...prev];
            return newArray.map((e, i) => {
                if (i === editingKey) {
                    return { ...e, ...rowData }
                }
                return { ...e }
            })
        });
    }
    const createStamp = async () => {
        const order_ids = [...selectedOrders].map(e => e.id)
        if (!orderParams.machine_id) {
            messageApi.info('Chưa chọn máy');
            return 0;
        }
        if (order_ids.length <= 0) {
            messageApi.info('Chưa chọn đơn hàng');
            return 0;
        }
        if (!orderParams.nhan_vien_sx) {
            messageApi.info('Chưa chọn nhân viên');
            return 0;
        }
        var res = await createStampFromOrder({ orders: selectedOrders, machine_id: orderParams.machine_id, nhan_vien_sx: orderParams.nhan_vien_sx });
        if (res.success) {
            setOpenModal(false);
            setOrderChecked([]);
            setSelectedOrders([]);
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
    const items = [
        {
            label: 'Danh sách đơn hàng',
            key: 1,
            children: <Table size='small' bordered
                loading={loadingOrders}
                pagination={{
                    current: page,
                    size: "small",
                    total: totalPage,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    onChange: (page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize);
                        setOrderParams({ ...orderParams, page: page, pageSize: pageSize });
                    },
                }}
                scroll={
                    {
                        x: '2200px',
                        y: '42vh'
                    }
                }
                tableLayout="fixed"
                rowSelection={orderRowSelection}
                columns={ordersColumn}
                dataSource={orders} />
        },
        {
            label: <Space>{'Đơn hàng đã chọn'}<Badge count={selectedOrders.length} showZero color="#1677ff" overflowCount={999} /></Space>,
            key: 2,
            children: <EditableTable size='small' bordered
                pagination={false}
                loading={loadingOrders}
                scroll={
                    {
                        x: '2200px',
                        y: '42vh'
                    }
                }
                tableLayout="fixed"
                columns={selectOrdersColumns}
                dataSource={selectedOrders}
                onDelete={(record) => onDeselectOrders([record])}
                onUpdate={onChangeSLDM}
                setDataSource={setSelectedOrders}
                summary={() => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            {selectOrdersColumns.map((e, index) => {
                                if (index === 0) {
                                    return <Table.Summary.Cell align="center" index={index}>Tổng số lượng</Table.Summary.Cell>
                                } else if (index === 4) {
                                    return <Table.Summary.Cell align="center" index={index}>{
                                        selectedOrders.reduce((sum, { sl }) => sum + parseInt(sl), 0)
                                    }</Table.Summary.Cell>
                                } else {
                                    return <Table.Summary.Cell index={index} />
                                }
                            })}
                        </Table.Summary.Row>
                    </Table.Summary>
                )} />
        }
    ];
    const extraTab = {
        right: <Button type="primary" className="tabs-extra-demo-button" onClick={() => createStamp()}>Tạo tem</Button>,
    };
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
                                        <Select
                                            allowClear
                                            showSearch
                                            onChange={(value) => {
                                                setParams({ ...params, mql: value });
                                            }}
                                            open={false}
                                            suffixIcon={null}
                                            mode="tags"
                                            placeholder="Nhập MQL"
                                            options={[]}
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
                                    onClick={() => { setOpenModal(true); setOrderParams({ page: 1, pageSize: 20 }) }}
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
                                        x: 'calc(100vw + 48px)'
                                    }}
                                    // locale={{emptyText: <Empty style={{width: '100%', display: 'flex'}} image={Empty.PRESENTED_IMAGE_SIMPLE}/>}}
                                    components={{
                                        body: {
                                            cell: data.length ? EditableCell : null,
                                        },
                                    }}
                                    virtual
                                    // rowClassName="editable-row"
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
                <TemThanhPham listCheck={listTem} ref={componentRef1} />
            </div>
            <Modal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                footer={null}
                title="Tạo tem từ đơn hàng"
                width={'98vw'}
                height={'100vh'}
                style={{
                    position: 'fixed',
                    left: '0',
                    right: '0',
                    top: '5px'
                }}
            >
                <Form layout="vertical">
                    <Row gutter={[8, 0]}>
                        <Col span={6}>
                            <Form.Item
                                label="Máy"
                                className="mb-2"
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
                                    value={orderParams.machine_id}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Nhân viên sản xuất"
                                className="mb-2"
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
                                    value={orderParams.nhan_vien_sx}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Khách hàng"
                                className="mb-2"
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
                                    value={orderParams.short_name}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="MDH"
                                className="mb-2"
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
                                    notFoundContent={null}
                                    maxTagCount={'responsive'}
                                    placeholder="Nhập mã đơn hàng"
                                    options={[]}
                                    value={orderParams.mdh}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item
                                label="MQL"
                                className="mb-3"
                            >
                                <Select
                                    mode="tags"
                                    allowClear
                                    showSearch
                                    suffixIcon={null}
                                    onChange={(value) => {
                                        setOrderParams({ ...orderParams, mql: value, page: 1 });
                                        setPage(1);
                                    }}
                                    notFoundContent={null}
                                    maxTagCount={'responsive'}
                                    placeholder="Nhập MQL"
                                    options={[]}
                                    value={orderParams.mql}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item
                                label="Kích thước"
                                className="mb-3"
                            >
                                <Input
                                    allowClear
                                    onChange={(e) => {
                                        setOrderParams({
                                            ...orderParams,
                                            kich_thuoc: e.target.value,
                                            page: 1,
                                        });
                                        setPage(1);
                                    }}
                                    placeholder="Nhập kích thước"
                                    value={orderParams.kich_thuoc}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item
                                label="Dài"
                                className="mb-3"
                            >
                                <Input
                                    allowClear
                                    onChange={(e) => {
                                        setOrderParams({
                                            ...orderParams,
                                            length: e.target.value,
                                            page: 1,
                                        });
                                        setPage(1);
                                    }}
                                    placeholder="Nhập dài"
                                    value={orderParams.length}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item
                                label="Rộng"
                                className="mb-3"
                            >
                                <Input
                                    allowClear
                                    onChange={(e) => {
                                        setOrderParams({
                                            ...orderParams,
                                            width: e.target.value,
                                            page: 1,
                                        });
                                        setPage(1);
                                    }}
                                    placeholder="Nhập rộng"
                                    value={orderParams.width}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item
                                label="Cao"
                                className="mb-3"
                            >
                                <Input
                                    allowClear
                                    onChange={(e) => {
                                        setOrderParams({
                                            ...orderParams,
                                            height: e.target.value,
                                            page: 1,
                                        });
                                        setPage(1);
                                    }}
                                    placeholder="Nhập cao"
                                    value={orderParams.height}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item
                                label="Ngày thực hiện KH"
                                className="mb-3"
                            >
                                <DatePicker
                                    allowClear
                                    style={{ width: '100%' }}
                                    onChange={(value) => {
                                        setOrderParams({
                                            ...orderParams,
                                            ngay_kh: value,
                                            page: 1,
                                        });
                                        setPage(1);
                                    }}
                                    placeholder="Chọn ngày thực hiện KH"
                                    value={orderParams.ngay_kh}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Tabs
                    type="card"
                    items={items}
                    tabBarExtraContent={extraTab}
                />
            </Modal>
        </>
    );
};

export default TaoTem;
