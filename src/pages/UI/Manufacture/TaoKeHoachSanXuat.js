import {
    DatePicker,
    Col,
    Row,
    Card,
    Table,
    Button,
    Form,
    Input,
    Select,
    Checkbox,
    Space,
} from "antd";
import React, { useState, useEffect } from "react";
import { getCustomers } from "../../../api/ui/main";
import {
    storeProductPlan,
} from "../../../api/ui/manufacture";
import dayjs from "dayjs";
import { getOrders } from "../../../api";
import { getMachineList } from "../../../api/ui/machine";

const TaoKeHoachSanXuat = () => {
    const [listCustomers, setListCustomers] = useState([]);
    const [listMachines, setListMachines] = useState([]);
    const [listCheck, setListCheck] = useState([]);
    const [form] = Form.useForm();
    const [params, setParams] = useState({ date: [dayjs(), dayjs()] });
    const [machineID, setMachineID] = useState();
    const [startTime, setStartTime] = useState();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const onChangeChecbox = (e) => {
        if (e.target.checked) {
            if (!listCheck.includes(e.target.value)) {
                setListCheck((oldArray) => [...oldArray, e.target.value]);
            }
        } else {
            if (listCheck.includes(e.target.value)) {
                setListCheck((oldArray) =>
                    oldArray.filter((datainput) => datainput !== e.target.value)
                );
            }
        }
    };

    const loadListTable = async (params) => {
        setLoading(true);
        const res = await getOrders(params);
        setData(res);
        setLoading(false);
    };

    const onFinish = async (values) => {
        const res = await storeProductPlan(values);
        loadListTable(params);
    };

    const insertOrder = () => {
        const inp = {
            order_id: listCheck,
            machine_id: machineID,
            start_time: dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
        }
        
    };

    useEffect(() => {
        (async () => {
            const res1 = await getMachineList();
            setListMachines(
                res1.data.map((e) => {
                    return { ...e, label: e.name, value: e.id };
                })
            )
            const res2 = await getCustomers();
            setListCustomers(
                res2.data.map((e) => {
                    return { ...e, label: e.name, value: e.id };
                })
            )
        })();
    }, []);

    useEffect(() => {
        (async () => {
            loadListTable(params);
        })();
    }, []);

    const columnKHSX = [
        {
            title: 'Thứ tự ưu tiên',
            dataIndex: 'mql',
            key: 'mql',
            align: 'center',
            fixed: 'left',
            width:'40%',
        },
        {
            title: 'Lô sản xuất',
            dataIndex: 'mql',
            key: 'mql',
            align: 'center',
            width:'40%',
        },
        {
            title: 'Số lượng',
            dataIndex: 'sl',
            key: 'sl',
            align: 'center',
            width:'20%',
        },
        
    ] 
    const col_detailTable = [
        {
            title: "Chọn",
            dataIndex: "name1",
            key: "name1",
            render: (value, item, index) => (
                <Checkbox value={item.id} onChange={onChangeChecbox}></Checkbox>
            ),
            align: "center",
            fixed: 'left',
            width:'3%',
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
            title: 'Người đặt hàng',
            dataIndex: 'nguoi_dat_hang',
            key: 'nguoi_dat_hang',
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
    ]
    return (
        <>
            <Row style={{ padding: "8px", height: "90vh" }} gutter={[8, 8]}>
                <Col span={24}>
                    <Card
                        style={{ height: "100%" }}
                        title="Tạo kế hoạch sản xuất"
                    >
                        <Row gutter={[8, 8]}>
                            <Col span={12}>
                                <Card title="Thông tin kế hoạch">
                                    <Form
                                        style={{ margin: "0 15px" }}
                                        layout="vertical"
                                        form={form}
                                        onFinish={onFinish}
                                    >
                                        <Row gutter={[16, 16]}>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="Chọn máy"
                                                    name="machine_id"
                                                    className="mb-3"
                                                    rules={[{ required: true }]}
                                                >
                                                    <Select showSearch placeholder="Chọn máy" options={listMachines} onChange={value => setMachineID(value)} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="Chọn thời gian bắt đầu"
                                                    name="start_time"
                                                    className="mb-3"
                                                    rules={[{ required: true }]}
                                                >
                                                    <DatePicker
                                                        showTime
                                                        allowClear={false}
                                                        placeholder="Bắt đầu"
                                                        style={{ width: "100%" }}
                                                        onChange={(value) => {
                                                            setStartTime(value);
                                                        }}
                                                        value={params.date[0]}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                    <Table size='small' bordered
                                        pagination={false}
                                        scroll={
                                            {
                                                y: '80vh'
                                            }
                                        }
                                        columns={columnKHSX}
                                        dataSource={data} />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="Danh sách đơn hàng" extra={<Button type="primary" onClick={insertOrder}>Thêm đơn hàng</Button>}>
                                    <Space direction="horizontal" style={{ width: "100%", marginBottom: '10px' }}>
                                        <div className="d-block w-100">
                                            <label>Khách hàng</label>
                                            <Select
                                                showSearch
                                                placeholder="Chọn khách hàng"
                                                style={{ width: "100%" }}
                                                onChange={(value) =>
                                                    setParams({ ...params, date: [value, params.date[1]] })
                                                }
                                                options={listCustomers}
                                            />
                                        </div>
                                        <div className="d-block">
                                            <label>Bắt đầu</label>
                                            <DatePicker
                                                allowClear={false}
                                                placeholder="Bắt đầu"
                                                style={{ width: "100%" }}
                                                onChange={(value) =>
                                                    setParams({ ...params, date: [value, params.date[1]] })
                                                }
                                                value={params.date[0]}
                                            />
                                        </div>
                                        <div className="d-block">
                                            <label>Kết thúc</label>
                                            <DatePicker
                                                allowClear={false}
                                                placeholder="Kết thúc"
                                                style={{ width: "100%" }}
                                                onChange={(value) =>
                                                    setParams({ ...params, date: [params.date[0], value] })
                                                }
                                                value={params.date[1]}
                                            />
                                        </div>
                                    </Space>
                                    <Table size='small' bordered
                                        pagination={false}
                                        scroll={
                                            {
                                                x: '130vw',
                                                y: '80vh'
                                            }
                                        }
                                        columns={col_detailTable}
                                        dataSource={data} />
                                </Card>
                            </Col>
                        </Row>
                    </Card >
                </Col >
            </Row >
        </>
    );
};

export default TaoKeHoachSanXuat;
