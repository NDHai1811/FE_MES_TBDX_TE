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
} from "antd";
import React, { useState, useEffect } from "react";
import { getCustomers } from "../../../api/ui/main";
import {
    createProductPlan,
    getListProductPlan,
    handleOrder,
    handlePlan,
} from "../../../api/ui/manufacture";
import dayjs from "dayjs";
import { getOrders } from "../../../api";
import { getMachineList } from "../../../api/ui/machine";

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
    const [openMdlPlan, setOpenMdlPlan] = useState(false);
    const [listPlan, setListPlan] = useState([]);

    const loadListOrders = async () => {
        setLoadingOrders(true);
        const res = await getOrders(orderParams);
        setData(res);
        setLoadingOrders(false);
    };

    const loadListPlans = async () => {
        setLoadingPlans(true);
        lsxParams.machine_id = 'S01';
        const res = await getListProductPlan(lsxParams);
        setListPlan(res);
        setLoadingPlans(false);
    };

    const onFinish = async (values) => {
        const res = await createProductPlan({ data: previewPlan });
        if (res) {
            window.location.href = '/ui/manufacture/ke-hoach-san-xuat';
        }
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
        setPreviewPlan(res.data);
        setOpenMdlOrder(false);
        setLoadingPlans(false);

    };
    const insertLSX = async () => {
        if (listCheck.length <= 0) {
            message.info('Cần chọn ít nhất 1 lô sản xuất');
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
            plan_id: listCheck,
            machine_id: planParams.machine_id,
            start_time: dayjs(planParams.start_date).format('YYYY-MM-DD HH:mm:ss'),
        }
        setLoadingPlans(true)
        const res = await handlePlan(inp);
        setPreviewPlan(res.data);
        setOpenMdlPlan(false);
        setLoadingPlans(false);

    };

    useEffect(() => {
        (async () => {
            const res1 = await getMachineList();
            setListMachines(res1.data.map((e) => ({ ...e, label: e.name, value: e.id })))
            const res2 = await getCustomers();
            setListCustomers(res2.data.map((e) => ({ ...e, label: e.name, value: e.name_input })))
        })();
    }, []);

    const openModal = async () => {
        if (!planParams.machine_id) {
            message.info('Chưa chọn máy');
        }
        if (planParams.machine_id == 'S01') {
            setData([]);
            setOpenMdlOrder(true);
            loadListOrders();
        } else {
            setListPlan([]);
            setOpenMdlPlan(true);
            loadListPlans();
        }
    }
    const columnKHSX = [
        {
            title: 'Thứ tự ưu tiên',
            dataIndex: 'thu_tu_uu_tien',
            key: 'thu_tu_uu_tien',
            align: 'center',
            fixed: 'left',
            width: '20%',
        },
        {
            title: 'Lô sản xuất',
            dataIndex: 'lo_sx',
            key: 'lo_sx',
            align: 'center',
            width: '20%',
        },
        {
            title: 'MDH',
            dataIndex: 'mdh',
            key: 'mdh',
            align: 'center',
            width: '40%',
        },
        {
            title: 'MQL',
            dataIndex: 'mql',
            key: 'mql',
            align: 'center',
            width: '40%',
        },
        {
            title: 'Số lượng',
            dataIndex: 'sl_kh',
            key: 'sl_kh',
            align: 'center',
            width: '20%',
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'thoi_gian_bat_dau',
            key: 'thoi_gian_bat_dau',
            align: 'center',
            width: '25%',
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'thoi_gian_ket_thuc',
            key: 'thoi_gian_ket_thuc',
            align: 'center',
            width: '25%',
        },
    ]
    const col_detailTable = [
        {
            title: 'Ngày đặt hàng',
            dataIndex: 'ngay_dat_hang',
            key: 'ngay_dat_hang',
            align: 'center',
            fixed: 'left'
        },
        {
            title: 'Khách hàng',
            dataIndex: 'khach_hang',
            key: 'khach_hang',
            align: 'center',
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: 'mdh',
            key: 'mdh',
            align: 'center',
        },
        {
            title: 'Đơn hàng',
            dataIndex: 'order',
            key: 'order',
            align: 'center',
        },
        {
            title: 'Mã quản lý',
            dataIndex: 'mql',
            key: 'mql',
            align: 'center',
        },
        {
            title: 'Dài',
            dataIndex: 'dai',
            key: 'dai',
            align: 'center',
        },
        {
            title: 'Rộng',
            dataIndex: 'rong',
            key: 'rong',
            align: 'center',
        },
        {
            title: 'Cao',
            dataIndex: 'cao',
            key: 'cao',
            align: 'center',
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: 'mdh',
            key: 'mdh',
            align: 'center',
        },
        {
            title: 'Số lượng',
            dataIndex: 'sl',
            key: 'sl',
            align: 'center',
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            align: 'center',
        },
        {
            title: 'Ghi chú 1',
            dataIndex: 'note_1',
            key: 'note_1',
            align: 'center',
        },
        {
            title: 'Hạn giao',
            dataIndex: 'han_giao',
            key: 'han_giao',
            align: 'center',
        },
        {
            title: 'Ghi chú 2',
            dataIndex: 'note_2',
            key: 'note_2',
            align: 'center',
        }
    ];
    const col_detailTable_plan = [
        {
            title: 'Lô sản xuất',
            dataIndex: 'lo_sx',
            key: 'lo_sx',
            align: 'center',
            fixed: 'left'
        },
        {
            title: 'Ngày đặt hàng',
            dataIndex: 'ngay_dat_hang',
            key: 'ngay_dat_hang',
            align: 'center',
            fixed: 'left'
        },
        {
            title: 'Khách hàng',
            dataIndex: 'khach_hang',
            key: 'khach_hang',
            align: 'center',
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: 'mdh',
            key: 'mdh',
            align: 'center',
        },
        {
            title: 'Đơn hàng',
            dataIndex: 'order',
            key: 'order',
            align: 'center',
        },
        {
            title: 'Mã quản lý',
            dataIndex: 'mql',
            key: 'mql',
            align: 'center',
        },
        {
            title: 'Dài',
            dataIndex: 'dai',
            key: 'dai',
            align: 'center',
        },
        {
            title: 'Rộng',
            dataIndex: 'rong',
            key: 'rong',
            align: 'center',
        },
        {
            title: 'Cao',
            dataIndex: 'cao',
            key: 'cao',
            align: 'center',
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: 'mdh',
            key: 'mdh',
            align: 'center',
        },
        {
            title: 'Số lượng',
            dataIndex: 'sl',
            key: 'sl',
            align: 'center',
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            align: 'center',
        },
        {
            title: 'Ghi chú 1',
            dataIndex: 'note_1',
            key: 'note_1',
            align: 'center',
        },
        {
            title: 'Hạn giao',
            dataIndex: 'han_giao',
            key: 'han_giao',
            align: 'center',
        },
        {
            title: 'Ghi chú 2',
            dataIndex: 'note_2',
            key: 'note_2',
            align: 'center',
        }
    ];
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setListCheck(selectedRowKeys);
        },
    };

    useEffect(() => {
        (async () => {
            loadListOrders();
        })()
    }, [orderParams])

    useEffect(() => {
        (async () => {
            loadListPlans();
        })()
    }, [lsxParams])
    return (
        <>
            <Row style={{ padding: "8px", height: "90vh" }} gutter={[8, 8]}>
                <Col span={24}>
                    <Card
                        style={{ height: "100%" }}
                        title="Tạo kế hoạch sản xuất"
                        extra={<Button type="primary" onClick={() => form.submit()}>Tạo KHSX</Button>}
                    >
                        <Form
                            layout="vertical"
                            form={form}
                            onFinish={onFinish}
                        >
                            <Row gutter={[16, 16]}>
                                <Col span={7}>
                                    <Form.Item
                                        label="Chọn máy"
                                        className="mb-3"
                                        rules={[{ required: true }]}
                                    >
                                        <Select showSearch placeholder="Chọn máy" options={listMachines} onChange={value => setPlanParams({ ...planParams, machine_id: value })} />
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
                                    <Button type="primary" onClick={() => openModal()}>Chọn danh sách</Button>
                                </Col>
                            </Row>
                        </Form>
                        <Table size='small' bordered
                            pagination={false}
                            columns={columnKHSX}
                            scroll={
                                {
                                    y: '80vh'
                                }
                            }
                            dataSource={previewPlan} />
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
                        <Col span={8}>
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
                                        setOrderParams({ ...orderParams, customer_id: value })
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
                        <Col span={8}>
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
                        <Col span={8}>
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
                    pagination={false}
                    scroll={
                        {
                            x: '130vw',
                            y: '60vh'
                        }
                    }
                    rowSelection={rowSelection}
                    columns={col_detailTable}
                    dataSource={data.map(e => ({ ...e, key: e.id }))} />
            </Modal>
            <Modal
                title={'Danh sách lô sản xuất'}
                open={openMdlPlan}
                onCancel={() => setOpenMdlPlan(false)}
                footer={null}
                width={'80vw'}
            >
                <Form layout="vertical">
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
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
                                        setLSXParams({ ...lsxParams, customer_id: value })
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
                        <Col span={8}>
                            <Form.Item
                                label="Bắt đầu"
                                className="mb-3"
                            >
                                <DatePicker
                                    allowClear={false}
                                    placeholder="Bắt đầu"
                                    style={{ width: "100%" }}
                                    onChange={(value) =>
                                        setLSXParams({ ...lsxParams, start_date: value })
                                    }
                                    value={lsxParams.start_date}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Kết thúc"
                                className="mb-3"
                            >
                                <DatePicker
                                    allowClear={false}
                                    placeholder="Kết thúc"
                                    style={{ width: "100%" }}
                                    onChange={(value) =>
                                        setLSXParams({ ...lsxParams, end_date: value })
                                    }
                                    value={lsxParams.end_date}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Button type="primary" className="mb-1" onClick={insertLSX}>Thêm lô sản xuất</Button>
                <Table size='small' bordered
                    loading={loadingPlans}
                    pagination={false}
                    scroll={
                        {
                            x: '130vw',
                            y: '60vh'
                        }
                    }
                    rowSelection={rowSelection}
                    columns={col_detailTable_plan}
                    dataSource={listPlan.map(e => ({ ...e, key: e.id }))} />
            </Modal>
        </>
    );
};

export default TaoKeHoachSanXuat;
