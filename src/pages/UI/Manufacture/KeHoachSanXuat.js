import {
  DatePicker,
  Col,
  Row,
  Card,
  Table,
  Layout,
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
import { getCustomers, getLines, getLoSanXuat, getOrders } from "../../../api/ui/main";
import {
  deleteRecordProductPlan,
  getListProductPlan,
  storeProductPlan,
  updateProductPlan,
} from "../../../api/ui/manufacture";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import dayjs from "dayjs";
import { getMachineList } from "../../../api/ui/machine";

const KeHoachSanXuat = () => {
  document.title = "Kế hoạch sản xuất";
  const history = useHistory();
  const [listCheck, setListCheck] = useState([]);
  const [openMdlEdit, setOpenMdlEdit] = useState(false);
  const [titleMdlEdit, setTitleMdlEdit] = useState("Cập nhật");
  const [form] = Form.useForm();
  const [params, setParams] = useState({ start_date: dayjs(), end_date: dayjs() });
  const [machines, setMachines] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loSX, setLoSX] = useState([]);
  const col_detailTable = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (value, item, index) => index+1,
      align: "center",
      width:'2%'
    },
    {
      title: "Thứ tự ưu tiên",
      dataIndex: "thu_tu_uu_tien",
      key: "thu_tu_uu_tien",
      align: "center",
      width:'2%'
    },
    {
      title: "Lô sx",
      dataIndex: "lo_sx",
      key: "lo_sx",
      align: "center",
    },
    {
      title: "Máy sx",
      dataIndex: "machine_id",
      key: "machine_id",
      align: "center",
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "ngay_dat_hang",
      key: "ngay_dat_hang",
      align: "center",
      width:'5%'
    },
    {
      title: "Khách hàng",
      dataIndex: "khach_hang",
      key: "khach_hang",
      align: "center",
      width:'10%'
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "ma_don_hang",
      key: "ma_don_hang",
      align: "center",
    },
    {
      title: "Dài",
      dataIndex: "dai",
      key: "dai",
      align: "center",
    },
    {
      title: "Rộng",
      dataIndex: "rong",
      key: "rong",
      align: "center",
    },
    {
      title: "Cao",
      dataIndex: "cao",
      key: "cao",
      align: "center",
    },
    {
      title: "Số lượng kế hoạch",
      dataIndex: "sl_kh",
      key: "sl_kh",
      align: "center",
    },
    {
      title: "Số m tới",
      dataIndex: "so_m_toi",
      key: "so_m_toi",
      align: "center",
    },
    {
      title: "Ngày sản xuất",
      dataIndex: "ngay_sx",
      key: "ngay_sx",
      align: "center",
      width:'5%'
    },
    {
      title: "Ngày giao hàng",
      dataIndex: "ngay_giao_hang",
      key: "ngay_giao_hang",
      align: "center",
      width:'5%'
    },
    {
      title: "Ghi chú",
      dataIndex: "ghi_chu",
      key: "ghi_chu",
      align: "center",
    },
    {
      title: "Mã quản lý",
      dataIndex: "mql",
      key: "mql",
      align: "center",
    },
    {
      title: "Số lớp",
      dataIndex: "so_lop",
      key: "so_lop",
      align: "center",
    },
    {
      title: "Kho",
      dataIndex: "kho",
      key: "kho",
      align: "center",
    },
    {
      title: "SL thực tế",
      dataIndex: "sl_thuc_te",
      key: "sl_thuc_te",
      align: "center",
    },
    {
      title: "Kết cấu giấy",
      dataIndex: "ket_cau_giay",
      key: "ket_cau_giay",
      align: "center",
    },
    {
      title: "PAD",
      dataIndex: "pad",
      key: "pad",
      align: "center",
    },
    {
      title: "Số dao",
      dataIndex: "so_dao",
      key: "so_dao",
      align: "center",
    },
    {
      title: "Số dao kế hoạch",
      dataIndex: "so_dao_kh",
      key: "so_dao_kh",
      align: "center",
    },
    {
      title: "Dải tấm",
      dataIndex: "dai_tam",
      key: "dai_tam",
      align: "center",
    },
    {
      title: "Nhóm máy",
      dataIndex: "nhom_may",
      key: "nhom_may",
      align: "center",
    },
    {
      title: "Số thân",
      dataIndex: "so_than",
      key: "so_than",
      align: "center",
    },
    {
      title: "Layout",
      dataIndex: "layout_id",
      key: "layout_id",
      align: "center",
    },
    {
      title: "Film",
      dataIndex: "film_id",
      key: "film_id",
      align: "center",
    },
    {
      title: "Khuôn",
      dataIndex: "khuon_id",
      key: "khuon_id",
      align: "center",
    },
  ];

  function btn_click() {
    loadListTable(params);
  }

  useEffect(() => {
    (async () => {
      const res1 = await getCustomers();
      setCustomers(res1.data.map((e) => ({ ...e, label: e.name, value: e.id })));
      const res2 = await getOrders();
      setOrders(res2.data.map((e) => ({ ...e, label: e.id, value: e.id })))
      const res3 = await getLoSanXuat();
      setLoSX(res3.data.map((e) => ({ label: e, value: e })))
    })();
  }, []);

  const [data, setData] = useState([]);
  const loadListTable = async (params) => {
    setLoading(true);
    const res = await getListProductPlan(params);
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
  const onSelect = (selectedKeys, e) => {
    const { selected, node } = e;

    // Check if the node is a parent and if it is selected
    if (node.props.isLeaf || !selected) {
      // If it's a leaf node or the parent node is deselected, update selected keys directly
      console.log(selectedKeys);
    } else {
      // If it's a parent node and is selected, exclude it from the selection
      const filteredKeys = selectedKeys.filter(key => key !== node.key);
      console.log(filteredKeys);
    }
  }
  const onCheck = (selectedKeys, e) => {
    console.log(selectedKeys);
    const filteredKeys = selectedKeys.filter(key => !itemsMenu.some(e=>e.key === key));
    setParams({...params, machine: filteredKeys});
  }
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
                    onSelect={onSelect}
                    onCheck={onCheck}
                    treeData={itemsMenu}
                    // style={{ maxHeight: '80px', overflowY: 'auto' }}
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
                      setParams({ ...params, start_date: value})
                    }
                    value={params.start_date}
                  />
                  <DatePicker
                    allowClear={false}
                    placeholder="Kết thúc"
                    style={{ width: "100%" }}
                    onChange={(value) =>
                      setParams({ ...params, end_date: value })
                    }
                    value={params.end_date}
                  />
                </Space>
              </Form>
            </div>
            <Divider>Điều kiện truy vấn</Divider>
            <div className="mb-3">
              <Form style={{ margin: "0 15px" }} layout="vertical">
                <Form.Item label="Khách hàng" className="mb-3">
                  <Select
                    allowClear
                    showSearch
                    placeholder="Nhập khách hàng"
                    onChange={(value) =>
                      setParams({ ...params, customer_id: value })
                    }
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    popupMatchSelectWidth={customers.length > 0 ? 400 : 0}
                    options={customers}
                  />
                </Form.Item>
                <Form.Item label="Đơn hàng" className="mb-3">
                  <Select
                    allowClear
                    showSearch
                    onChange={(value) => {
                      setParams({ ...params, order_id: value });
                    }}
                    placeholder="Nhập đơn hàng"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={orders}
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
                    options={loSX}
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
                <Button type="primary" onClick={insertRecord}>
                  Tạo kế hoạch
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
                  x: "200vw",
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

export default KeHoachSanXuat;
