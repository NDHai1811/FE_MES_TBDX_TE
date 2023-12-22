import {
    DatePicker,
    Col,
    Row,
    Card,
    Table,
    Divider,
    Button,
    Form,
    Input,
    Select,
    Upload,
    message,
    Checkbox,
    Space,
    Modal,
    Spin,
    Tree,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useEffect } from "react";
import { getLines } from "../../../api/ui/main";
import {
    deleteRecordProductPlan,
    getListLayout,
    getListProductPlan,
    storeProductPlan,
    updateProductPlan,
} from "../../../api/ui/manufacture";
import {
    useHistory,
    useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import dayjs from "dayjs";

const Layout = () => {
    const history = useHistory();
    const [listLines, setListLines] = useState([]);
    const [listNameProducts, setListNameProducts] = useState([]);
    const [listLoSX, setListLoSX] = useState([]);
    const [listCustomers, setListCustomers] = useState([]);
    const [selectedLine, setSelectedLine] = useState();
    const [listCheck, setListCheck] = useState([]);
    const [openMdlEdit, setOpenMdlEdit] = useState(false);
    const [titleMdlEdit, setTitleMdlEdit] = useState("Cập nhật");
    const [form] = Form.useForm();
    const [params, setParams] = useState({ date: [dayjs(), dayjs()] });
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
    const col_detailTable = [
        {
            title: "Chọn",
            dataIndex: "name1",
            key: "name1",
            render: (value, item, index) => (
                <Checkbox value={item.id} onChange={onChangeChecbox}></Checkbox>
            ),
            align: "center",
        },
        {
            title: "Mã khách hàng",
            dataIndex: "customer_id",
            key: "customer_id",
            align: "center",
        },
        {
            title: "Mã máy in và mã layout",
            dataIndex: "machine_layout_id",
            key: "machine_layout_id",
            align: "center",
        },
        {
            title: "Tên khách hàng",
            dataIndex: "khach_hang",
            key: "khach_hang",
            align: "center",
        },
        {
            title: "Tên máy",
            dataIndex: "machine_name",
            key: "machine_name",
            align: "center",
        },
        {
            title: "Mã layout",
            dataIndex: "layout_id",
            key: "layout_id",
            align: "center",
        },
        {
            title: "Lô in 1",
            dataIndex: "lo_in_1",
            key: "lo_in_1",
            align: "center",
            children: [
                {
                    title: "Mã film",
                    dataIndex: "ma_film_1",
                    key: "ma_film_1",
                    align: "center",
                },
                {
                    title: "Mã mực",
                    dataIndex: "ma_muc_1",
                    key: "ma_muc_1",
                    align: "center",
                },
                {
                    title: "Độ nhớt",
                    dataIndex: "do_nhot_1",
                    key: "do_nhot_1",
                    align: "center",
                },
                {
                    title: "Vị trí film",
                    dataIndex: "vt_film_1",
                    key: "vt_film_1",
                    align: "center",
                },
                {
                    title: "Áp lực lô film",
                    dataIndex: "al_film_1",
                    key: "al_film_1",
                    align: "center",
                },
                {
                    title: "Áp lực lô mực",
                    dataIndex: "al_muc_1",
                    key: "al_muc_1",
                    align: "center",
                },
            ]
        },
        {
            title: "Lô in 2",
            dataIndex: "lo_in_2",
            key: "lo_in_2",
            align: "center",
            children: [
                {
                    title: "Mã film",
                    dataIndex: "ma_film_2",
                    key: "ma_film_2",
                    align: "center",
                },
                {
                    title: "Mã mực",
                    dataIndex: "ma_muc_2",
                    key: "ma_muc_2",
                    align: "center",
                },
                {
                    title: "Độ nhớt",
                    dataIndex: "do_nhot_2",
                    key: "do_nhot_2",
                    align: "center",
                },
                {
                    title: "Vị trí film",
                    dataIndex: "vt_film_2",
                    key: "vt_film_2",
                    align: "center",
                },
                {
                    title: "Áp lực lô film",
                    dataIndex: "al_film_2",
                    key: "al_film_2",
                    align: "center",
                },
                {
                    title: "Áp lực lô mực",
                    dataIndex: "al_muc_2",
                    key: "al_muc_2",
                    align: "center",
                },
            ]
        },
        {
            title: "Lô in 3",
            dataIndex: "lo_in_3",
            key: "lo_in_3",
            align: "center",
            children: [
                {
                    title: "Mã film",
                    dataIndex: "ma_film_3",
                    key: "ma_film_3",
                    align: "center",
                },
                {
                    title: "Mã mực",
                    dataIndex: "ma_muc_3",
                    key: "ma_muc_3",
                    align: "center",
                },
                {
                    title: "Độ nhớt",
                    dataIndex: "do_nhot_3",
                    key: "do_nhot_3",
                    align: "center",
                },
                {
                    title: "Vị trí film",
                    dataIndex: "vt_film_3",
                    key: "vt_film_3",
                    align: "center",
                },
                {
                    title: "Áp lực lô film",
                    dataIndex: "al_film_3",
                    key: "al_film_3",
                    align: "center",
                },
                {
                    title: "Áp lực lô mực",
                    dataIndex: "al_muc_3",
                    key: "al_muc_3",
                    align: "center",
                },
            ]
        },
        {
            title: "Lô in 4",
            dataIndex: "lo_in_4",
            key: "lo_in_4",
            align: "center",
            children: [
                {
                    title: "Mã film",
                    dataIndex: "ma_film_4",
                    key: "ma_film_4",
                    align: "center",
                },
                {
                    title: "Mã mực",
                    dataIndex: "ma_muc_4",
                    key: "ma_muc_4",
                    align: "center",
                },
                {
                    title: "Độ nhớt",
                    dataIndex: "do_nhot_4",
                    key: "do_nhot_4",
                    align: "center",
                },
                {
                    title: "Vị trí film",
                    dataIndex: "vt_film_4",
                    key: "vt_film_4",
                    align: "center",
                },
                {
                    title: "Áp lực lô film",
                    dataIndex: "al_film_4",
                    key: "al_film_4",
                    align: "center",
                },
                {
                    title: "Áp lực lô mực",
                    dataIndex: "al_muc_4",
                    key: "al_muc_4",
                    align: "center",
                },
            ]
        },
        {
            title: "Lô in 5",
            dataIndex: "lo_in_5",
            key: "lo_in_5",
            align: "center",
            children: [
                {
                    title: "Mã film",
                    dataIndex: "ma_film_5",
                    key: "ma_film_5",
                    align: "center",
                },
                {
                    title: "Mã mực",
                    dataIndex: "ma_muc_5",
                    key: "ma_muc_5",
                    align: "center",
                },
                {
                    title: "Độ nhớt",
                    dataIndex: "do_nhot_5",
                    key: "do_nhot_5",
                    align: "center",
                },
                {
                    title: "Vị trí film",
                    dataIndex: "vt_film_5",
                    key: "vt_film_5",
                    align: "center",
                },
                {
                    title: "Áp lực lô film",
                    dataIndex: "al_film_5",
                    key: "al_film_5",
                    align: "center",
                },
                {
                    title: "Áp lực lô mực",
                    dataIndex: "al_muc_5",
                    key: "al_muc_5",
                    align: "center",
                },
            ]
        },
        {
            title: "Khối bế",
            dataIndex: "",
            key: "lo_in_5",
            align: "center",
            children: [
                {
                    title: "Mã khuôn",
                    dataIndex: "ma_khuon",
                    key: "ma_khuon",
                    align: "center",
                },
                {
                    title: "Vị trí lô bắt khuôn",
                    dataIndex: "vt_khuon",
                    key: "vt_khuon",
                    align: "center",
                },
                {
                    title: "Khối bế",
                    dataIndex: "al_khuon",
                    key: "al_khuon",
                    align: "center",
                },
            ]
        },
    ];
    useEffect(() => {
        (async () => {
            const res1 = await getLines();
            setListLines(
                res1.data.map((e) => {
                    return { ...e, label: e.name, value: e.id };
                })
            );
        })();
    }, []);

    function btn_click() {
        loadListTable(params);
    }

    const [data, setData] = useState([]);
    const loadListTable = async (params) => {
        setLoading(true);
        const res = await getListLayout(params);
        setData(res);
        setLoading(false);
    };
    useEffect(() => {
        (async () => {
            loadListTable(params);
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
        if (values.id) {
            const res = await updateProductPlan(values);
        } else {
            const res = await storeProductPlan(values);
        }
        setOpenMdlEdit(false);
        loadListTable(params);
    };

    const deleteRecord = async () => {
        if (listCheck.length > 0) {
            const res = await deleteRecordProductPlan(listCheck);
            setListCheck([]);
            loadListTable(params);
        } else {
            message.info("Chưa chọn bản ghi cần xóa");
        }
    };
    const editRecord = () => {
        setTitleMdlEdit("Cập nhật");
        if (listCheck.length > 1) {
            message.info("Chỉ chọn 1 bản ghi để chỉnh sửa");
        } else if (listCheck.length == 0) {
            message.info("Chưa chọn bản ghi cần chỉnh sửa");
        } else {
            const result = data.find((record) => record.id === listCheck[0]);
            form.setFieldsValue({
                id: listCheck[0],
                thu_tu_uu_tien: result.thu_tu_uu_tien,
                thoi_gian_bat_dau: result.thoi_gian_bat_dau,
                thoi_gian_ket_thuc: result.thoi_gian_ket_thuc,
                cong_doan_sx: result.cong_doan_sx,
                product_id: result.product_id,
                khach_hang: result.khach_hang,
                ca_sx: result.ca_sx,
                lo_sx: result.lo_sx,
                so_bat: result.so_bat,
                sl_nvl: result.sl_nvl,
                sl_thanh_pham: result.sl_thanh_pham,
                UPH: result.UPH,
                nhan_luc: result.nhan_luc,
            });
            setOpenMdlEdit(true);
        }
    };
    const insertRecord = () => {
        history.push("/ui/manufacture/tao-ke-hoach-san-xuat");
    };
    const [loadingExport, setLoadingExport] = useState(false);
    const [loading, setLoading] = useState(false);

    const itemsMenu = [
        {
            title: "Sóng",
            key: "30",
            children: [
                {
                    title: "Chuyền máy dợn sóng",
                    key: "S01",
                },
            ],
        },
        {
            title: "In",
            key: "31",
            children: [
                {
                    title: "Máy in P.06",
                    key: "P06",
                },
                {
                    title: "Máy in P.15",
                    key: "P15",
                },
            ],
        },
        {
            title: "Dán",
            key: "32",
            children: [
                {
                    title: "Máy dán D.05",
                    key: "D05",
                },
                {
                    title: "Máy dán D.06",
                    key: "D06",
                },
            ],
        },
    ];
    return (
        <>
            {contextHolder}
            <Row style={{ padding: "8px", height: "90vh" }} gutter={[8, 8]}>
                <Col span={4}>
                    <Card
                        style={{ height: "100%" }}
                        bodyStyle={{ paddingInline: 0, paddingTop: 0 }}
                    >
                        <div className="mb-3">
                            <Form style={{ margin: "0 15px" }} layout="vertical">
                                <Divider>Công đoạn</Divider>
                                <Form.Item className="mb-3">
                                    <Tree
                                        checkable
                                        defaultExpandedKeys={["0-0-0", "0-0-1"]}
                                        defaultSelectedKeys={["0-0-0", "0-0-1"]}
                                        defaultCheckedKeys={["0-0-0", "0-0-1"]}
                                        // onSelect={onSelect}
                                        // onCheck={onCheck}
                                        treeData={itemsMenu}
                                        style={{ maxHeight: '80px', overflowY: 'auto' }}
                                    />
                                </Form.Item>
                            </Form>
                        </div>
                        <Divider>Thời gian truy vấn</Divider>
                        <div className="mb-3">
                            <Form style={{ margin: "0 15px" }} layout="vertical">
                                {/* <RangePicker placeholder={["Bắt đầu", "Kết thúc"]} /> */}
                                <Space direction="vertical" style={{ width: "100%" }}>
                                    <DatePicker
                                        allowClear={false}
                                        placeholder="Bắt đầu"
                                        style={{ width: "100%" }}
                                        onChange={(value) =>
                                            setParams({ ...params, date: [value, params.date[1]] })
                                        }
                                        value={params.date[0]}
                                    />
                                    <DatePicker
                                        allowClear={false}
                                        placeholder="Kết thúc"
                                        style={{ width: "100%" }}
                                        onChange={(value) =>
                                            setParams({ ...params, date: [params.date[0], value] })
                                        }
                                        value={params.date[1]}
                                    />
                                </Space>
                            </Form>
                        </div>
                        <Divider>Điều kiện truy vấn</Divider>
                        <div className="mb-3">
                            <Form style={{ margin: "0 15px" }} layout="vertical">
                                <Form.Item label="Máy" className="mb-3">
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder="Nhập máy"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        onChange={(value) => setParams({ ...params, lo_sx: value })}
                                        options={listLoSX}
                                    />
                                </Form.Item>
                                <Form.Item label="Khách hàng" className="mb-3">
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder="Nhập khách hàng"
                                        onChange={(value) =>
                                            setParams({ ...params, khach_hang: value })
                                        }
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        options={listCustomers}
                                    />
                                </Form.Item>
                                <Form.Item label="Đơn hàng" className="mb-3">
                                    <Select
                                        allowClear
                                        showSearch
                                        onChange={(value) => {
                                            setParams({ ...params, ten_sp: value });
                                        }}
                                        placeholder="Nhập đơn hàng"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        options={listNameProducts}
                                    />
                                </Form.Item>
                                <Form.Item label="Lô Sản xuất" className="mb-3">
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder="Nhập lô sản xuất"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        onChange={(value) => setParams({ ...params, lo_sx: value })}
                                        options={listLoSX}
                                    />
                                </Form.Item>
                                <Form.Item label="Quy cách" className="mb-3">
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder="Nhập quy cách"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        onChange={(value) => setParams({ ...params, lo_sx: value })}
                                        options={listLoSX}
                                    />
                                </Form.Item>
                            </Form>
                        </div>

                        <div
                            style={{
                                padding: "10px",
                                textAlign: "center",
                            }}
                            layout="vertical"
                        >
                            <Button
                                type="primary"
                                style={{ width: "80%" }}
                                onClick={btn_click}
                            >
                                Truy vấn
                            </Button>
                        </div>
                    </Card>
                </Col>
                <Col span={20}>
                    <Card
                        style={{ height: "100%" }}
                        title="Kế hoạch sản xuất"
                        extra={
                            <Space>
                                <Upload
                                    showUploadList={false}
                                    name="files"
                                    action={baseURL + "/api/upload-ke-hoach-san-xuat"}
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
                                <Button type="primary" onClick={deleteRecord}>
                                    Delete
                                </Button>
                                <Button type="primary" onClick={editRecord}>
                                    Edit
                                </Button>
                                <Button type="primary" onClick={insertRecord}>
                                    Insert
                                </Button>
                            </Space>
                        }
                    >
                        <Spin spinning={loading}>
                            <Table
                                size="small"
                                bordered
                                pagination={false}
                                scroll={{
                                    x: "180vw",
                                    y: "80vh",
                                }}
                                columns={col_detailTable}
                                dataSource={data}
                            />
                        </Spin>
                    </Card>
                </Col>
            </Row>
            <Modal
                title={titleMdlEdit}
                open={openMdlEdit}
                onCancel={() => setOpenMdlEdit(false)}
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
                        <Col span={12} className="d-none">
                            <Form.Item name="id" className="mb-3 d-none">
                                <Input></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Thứ tự ưu tiên"
                                name="thu_tu_uu_tien"
                                className="mb-3"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Nhập thứ tự ưu tiên"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Ngày sản xuất (YYYY-MM-DD)"
                                name="ngay_sx"
                                className="mb-3"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Nhập ngày sản xuất"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Ngày đặt hàng (YYYY-MM-DD)"
                                name="ngay_dat_hang"
                                className="mb-3"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Nhập ngày đặt hàng"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Ngày giao hàng (YYYY-MM-DD)"
                                name="ngay_giao_hang"
                                className="mb-3"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Nhập ngày giao hàng"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Thời gian bắt đầu (YYYY-MM-DD HH:mm:ss)"
                                name="thoi_gian_bat_dau"
                                className="mb-3"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder=""></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Thời gian kết thúc (YYYY-MM-DD HH:mm:ss)"
                                name="thoi_gian_ket_thuc"
                                className="mb-3"
                                rules={[{ required: true }]}
                            >
                                <Input></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Máy"
                                name="machine_id"
                                className="mb-3"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Nhập tên máy"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Công đoạn"
                                name="cong_doan_sx"
                                className="mb-3"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Nhập công đoạn"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Mã sản phẩm"
                                name="product_id"
                                className="mb-3"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Nhập mã sản phẩm"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Khách hàng"
                                name="khach_hang"
                                className="mb-3"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Nhập khách hàng"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Ca sản xuất"
                                name="ca_sx"
                                className="mb-3"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Nhập ca sản xuất"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Lô sản xuất"
                                name="lo_sx"
                                className="mb-3"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Nhập lô sản xuất"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Số bát"
                                name="so_bat"
                                className="mb-3"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Nhập số bát"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Số lượng nguyên liệu đầu vào (tờ)"
                                name="sl_nvl"
                                className="mb-3"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Nhập số lượng nguyên liệu đầu vào (tờ)"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Kế hoạch SL thành phẩm (tờ)"
                                name="sl_thanh_pham"
                                className="mb-3"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Nhập kế hoạch SL thành phẩm (tờ)"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="UPH"
                                name="UPH"
                                className="mb-3"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="UPH"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Nhân lực"
                                name="nhan_luc"
                                className="mb-3"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Nhân lực"></Input>
                            </Form.Item>
                        </Col>
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

export default Layout;
