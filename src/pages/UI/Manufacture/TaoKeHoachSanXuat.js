import {
    DatePicker,
    Col,
    Row,
    Card,
    Table,
    Button,
    Form,
    Select,
    Modal,
    message,
    Input,
    InputNumber,
    Typography,
    Checkbox
} from "antd";
import React, { useState, useEffect } from "react";
import { getCustomers } from "../../../api/ui/main";
import {
    createProductPlan,
    exportPreviewPlan,
    getListProductPlan,
    getOrderList,
    handleOrder,
} from "../../../api/ui/manufacture";
import dayjs from "dayjs";
import { getMachineList } from "../../../api/ui/machine";
import { baseURL } from "../../../config";
import { EditOutlined } from "@ant-design/icons";

const TaoKeHoachSanXuat = () => {
    const [listCustomers, setListCustomers] = useState([]);
    const [listMachines, setListMachines] = useState([]);
    const [listCheck, setListCheck] = useState([]);
    const [form] = Form.useForm();
    const [orderParams, setOrderParams] = useState({ start_date: dayjs(), end_date: dayjs() });
    const [lsxParams, setLSXParams] = useState({ start_date: dayjs(), end_date: dayjs() });
    const [planParams, setPlanParams] = useState({ start_date: dayjs() });
    const [data, setData] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [previewPlan, setPreviewPlan] = useState([])
    const [openMdlOrder, setOpenMdlOrder] = useState(false);
    const [listPlan, setListPlan] = useState([]);
    const [formUpdate] = Form.useForm();
    const [editingKey, setEditingKey] = useState("");
    const isEditing = (record) => record.key === editingKey;
    const loadListOrders = async () => {
        setLoadingOrders(true);
        const res = await getOrderList(orderParams);
        setData(res.data.map(e => ({ ...e, key: e.id })));
        setLoadingOrders(false);
    };

    const loadListPlans = async () => {
        setLoadingPlans(true);
        lsxParams.machine_id = 'S01';
        const res = await getListProductPlan(lsxParams);
        setListPlan(res);
        setLoadingPlans(false);
    };

    const [loadingBtn, setLoadingBtn] = useState(false);
    const onFinish = async (values) => {
        setLoadingBtn(true);
        const res = await createProductPlan({ data: previewPlan });
        if (res.success) {
            setTimeout(function () {
                window.location.href = '/ui/manufacture/ke-hoach-san-xuat';
            }, 1000);

        }
        setLoadingBtn(false);
    };

    const insertOrder = async () => {
        if (listCheck.length <= 0) {
            message.info('Cần chọn ít nhất 1 đơn hàng');
            return;
        }
        if (!planParams.machine_id) {
            message.info('Cần chọn máy');
            return;
        }
        if (!planParams.start_date) {
            message.info('Cần chọn thời gian bắt đầu');
            return;
        }
        const inp = {
            order_id: listCheck,
            machine_id: planParams.machine_id,
            start_time: dayjs(planParams.start_date).format('YYYY-MM-DD HH:mm:ss'),
        }
        setLoadingPlans(true)
        const res = await handleOrder(inp);
        if (res.success) {
            setPreviewPlan(res.data.map((e, index) => ({ ...e, key: index })));
            setOpenMdlOrder(false);
            setLoadingPlans(false);
        }
    };

    useEffect(() => {
        (async () => {
            const res1 = await getMachineList();
            setListMachines(res1.data.map((e) => ({ ...e, label: e.name + ' (' + e.id + ')', value: e.id })))
            const res2 = await getCustomers();
            setListCustomers(res2.data)
        })();
    }, []);

    const openModal = async () => {
        if (!planParams.machine_id) {
            message.info('Chưa chọn máy');
        } else {
            // if (planParams.machine_id == 'S01') {
            setData([]);
            setOpenMdlOrder(true);
            loadListOrders();
            // } else {
            //     setListPlan([]);
            //     setOpenMdlPlan(true);
            //     loadListPlans();
            // }
        }

    }
    const onUpdate = async (record) => {
        const row = await formUpdate.validateFields();
        const items = [...previewPlan].map((val) => {
            console.log(val.key === editingKey);
            if (val.key === editingKey) {
                return { ...val, ...row };
            }
            return { ...val };
        });
        setPreviewPlan(items);
        setEditingKey()
    };
    const onChange = (value, dataIndex) => {
        const items = previewPlan.map((val) => {
            if (val.key === editingKey) {
                val[dataIndex] = value;
            }
            return { ...val };
        });
        value.isValid() && setData(items);
    };
    const columnKHSX = [
        {
            title: 'Thứ tự',
            dataIndex: 'thu_tu_uu_tien',
            key: 'thu_tu_uu_tien',
            align: 'center',
            fixed: 'left',
            editable: true,
            width: '5%'
        },
        {
            title: 'Khách hàng',
            dataIndex: 'khach_hang',
            key: 'khach_hang',
            align: 'center',
            fixed: 'left',
        },
        {
            title: 'Lô sản xuất',
            dataIndex: 'lo_sx',
            key: 'lo_sx',
            align: 'center',
        },
        {
            title: 'MDH',
            dataIndex: 'mdh',
            key: 'mdh',
            align: 'center',
        },
        {
            title: 'MQL',
            dataIndex: 'mql',
            key: 'mql',
            align: 'center',
        },
        {
            title: 'Kích thước',
            dataIndex: 'kich_thuoc',
            key: 'kich_thuoc',
            align: 'center',
        },
        {
            title: 'Khổ tổng',
            dataIndex: 'kho_tong',
            key: 'kho_tong',
            align: 'center',
        },
        {
            title: 'Số lượng',
            dataIndex: 'sl_kh',
            key: 'sl_kh',
            align: 'center',
            editable: true
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'thoi_gian_bat_dau',
            key: 'thoi_gian_bat_dau',
            align: 'center',
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'thoi_gian_ket_thuc',
            key: 'thoi_gian_ket_thuc',
            align: 'center',
        },
    ]
    const col_detailTable = [
        {
            title: 'Hạn giao SX',
            dataIndex: 'han_giao_sx',
            key: 'han_giao_sx',
            align: 'center',
            width: '6%'
        },
        {
            title: 'Khách hàng',
            dataIndex: 'khach_hang',
            key: 'khach_hang',
            align: 'center',
            width: '10%'
        },
        {
            title: 'MDH',
            dataIndex: 'mdh',
            key: 'mdh',
            align: 'center',
            width: '5%'
        },
        {
            title: 'MQL',
            dataIndex: 'mql',
            key: 'mql',
            align: 'center',
            width: '3%'
        },
        {
            title: 'Dài',
            dataIndex: 'dai',
            key: 'dai',
            align: 'center',
            width: '3%'
        },
        {
            title: 'Rộng',
            dataIndex: 'rong',
            key: 'rong',
            align: 'center',
            width: '3%'
        },
        {
            title: 'Cao',
            dataIndex: 'cao',
            key: 'cao',
            align: 'center',
            width: '3%'
        },
        {
            title: 'Số lượng',
            dataIndex: 'sl',
            key: 'sl',
            align: 'center',
            width: '5%'
        },
        {
            title: 'Khổ',
            dataIndex: 'kho',
            key: 'kho',
            align: 'center',
            width: '5%'
        },
        {
            title: 'Ghi chú TBDX',
            dataIndex: 'note_2',
            key: 'note_2',
            align: 'center',
        },
        {
            title: 'Mã Layout',
            dataIndex: 'layout_id',
            key: 'layout_id',
            align: 'center',
        },
        {
            title: 'Ghi chú khách',
            dataIndex: 'note_1',
            key: 'note_1',
            align: 'center',
        },
        {
            title: 'Ghi chú sóng',
            dataIndex: 'note_3',
            key: 'note_3',
            align: 'center',
        }
    ];
    const headerCheckbox = () => (
        <Checkbox
            checked={listCheck.length === data.length}
            indeterminate={
                listCheck.length > 0 && listCheck.length < data.length
            }
            onChange={toggleSelectAll}
        />
    );
    const rowSelection = {
        selectedRowKeys: listCheck,
        onChange: (selectedRowKeys, selectedRows) => {
            setListCheck(selectedRowKeys);
        },
        fixed: true,
        columnTitle: headerCheckbox
    };



    const toggleSelectAll = () => {
        setListCheck((keys) =>
            keys.length === data.length ? [] : data.map((r) => r.key)
        );
    };

    useEffect(() => {
        (async () => {
            if (orderParams.machine_id) {
                loadListOrders();
            }
        })()
    }, [orderParams])

    useEffect(() => {
        (async () => {
            loadListPlans();
        })()
    }, [lsxParams]);
    const [exportLoading, setExportLoading] = useState(false);
    const exportFile = async () => {
        setExportLoading(true);
        const res = await exportPreviewPlan({ plans: previewPlan, start_time: planParams.start_date });
        if (res.success) {
            window.location.href = baseURL + res.data;
        }
        setExportLoading(false);
    };

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        onChange,
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
    const mergedColumns = [...columnKHSX,
    {
        title: "Tác vụ",
        dataIndex: "action",
        key: "action",
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
    }
    ].map((col) => {
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
                onChange,
            }),
        };
    });
    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        if (typeof editingKey === "number") {
            const newData = [...data];
            newData.shift();
            setData(newData);
        }
        setEditingKey("");
    };
    const [lineId, setLineId] = useState();
    useEffect(() => {
        const line_id = listMachines.find(e => planParams?.machine_id === e.id)?.line_id;
        console.log(line_id);
        setLineId(line_id);
    }, [planParams.machine_id])
    return (
        <>
            <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
                <Col span={24}>
                    <Card
                        style={{ height: "100%" }}
                        title="Tạo kế hoạch sản xuất"
                        extra={<Button type="primary" onClick={() => form.submit()} loading={loadingBtn}>Tạo KHSX</Button>}
                    >
                        <Form
                            layout="vertical"
                            form={form}
                            onFinish={onFinish}
                        >
                            <Row gutter={[8, 8]}>
                                <Col span={7}>
                                    <Form.Item
                                        label="Chọn máy"
                                        className="mb-3"
                                        rules={[{ required: true }]}
                                    >
                                        <Select showSearch placeholder="Chọn máy" options={listMachines} onChange={value => {
                                            setPlanParams({ ...planParams, machine_id: value });
                                            setOrderParams({ ...orderParams, machine_id: value });
                                        }}
                                            optionFilterProp="label" />
                                    </Form.Item>
                                </Col>
                                <Col span={7}>
                                    <Form.Item
                                        label="Chọn thời gian bắt đầu"
                                        className="mb-3"
                                        rules={[{ required: true }]}
                                    >
                                        <DatePicker
                                            showTime
                                            allowClear={false}
                                            placeholder="Bắt đầu"
                                            style={{ width: "100%" }}
                                            onChange={(value) => {
                                                setPlanParams({ ...planParams, start_date: value });
                                            }}
                                            value={planParams.start_date}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={4} style={{ marginTop: '30px' }}>
                                    <Button type="primary" onClick={() => openModal()} className="w-100">Chọn danh sách</Button>
                                </Col>
                                <Col span={4} style={{ marginTop: '30px' }}>
                                    <Button type="primary" onClick={() => exportFile()} loading={exportLoading} className="w-100">Tải file excel</Button>
                                </Col>
                            </Row>
                        </Form>
                        <Form form={formUpdate}>
                            <Table size='small' bordered
                                pagination={false}
                                columns={(lineId && (lineId == "31" || lineId == "32")) ? mergedColumns : columnKHSX}
                                components={{
                                    body: {
                                        cell: EditableCell,
                                    },
                                }}
                                dataSource={previewPlan}
                            />
                        </Form>
                    </Card >
                </Col >
            </Row >
            <Modal
                title={'Danh sách đơn hàng'}
                open={openMdlOrder}
                onCancel={() => setOpenMdlOrder(false)}
                footer={null}
                width={'80vw'}
            >
                <Form layout="vertical">
                    <Row gutter={[16, 16]}>
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
                                        setOrderParams({ ...orderParams, mdh: value });
                                    }}
                                    open={false}
                                    placeholder="Nhập mã đơn hàng"
                                    options={[]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
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
                        <Col span={6}>
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
                    </Row>
                </Form>
                <Button type="primary" className="mb-1" onClick={insertOrder}>Thêm đơn hàng</Button>
                <Table size='small' bordered
                    loading={loadingOrders}
                    pagination={true}
                    scroll={
                        {
                            x: '130vw',
                            y: '60vh'
                        }
                    }
                    rowSelection={rowSelection}
                    columns={col_detailTable}
                    dataSource={data} />
            </Modal>
        </>
    );
};

export default TaoKeHoachSanXuat;
