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
import { getLines } from "../../../api/ui/main";
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

const KeHoachSanXuat = () => {
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
      title: "Thứ tự ưu tiên",
      dataIndex: "thu_tu_uu_tien",
      key: "thu_tu_uu_tien",
      align: "center",
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
    },
    {
      title: "Khách hàng",
      dataIndex: "khach_hang",
      key: "khach_hang",
      align: "center",
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
    },
    {
      title: "Ngày giao hàng",
      dataIndex: "ngay_giao_hang",
      key: "ngay_giao_hang",
      align: "center",
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
  useEffect(() => {
    (async () => {
      const res1 = await getLines();
      setListLines(
        res1.data.map((e) => {
          return { ...e, label: e.name, value: e.id };
        })
      );
      // const res2 = await getProducts();
      // setListIdProducts(res2.data.map(e => {
      //       return { ...e, label: e.id, value: e.id }
      // }));
      // setListNameProducts(res2.data.map(e => {
      //       return { ...e, label: e.name, value: e.id }
      // }));
      // const res3 = await getLoSanXuat();
      // setListLoSX(res3.data.map(e => {
      //       return { ...e, label: e, value: e }
      // }));
      // const res4 = await getStaffs();
      // setListStaffs(res4.data.map(e => {
      //       return { ...e, label: e.name, value: e.id }
      // }))
      // const res5 = await getCustomers();
      // setListCustomers(
      //   res5.data.map((e) => {
      //     return { ...e, label: e.name, value: e.id };
      //   })
      // );
    })();
  }, []);

  function btn_click() {
    loadListTable(params);
  }

  // useEffect(() => {
  //   (async () => {
  //     var res = await getDataFilterUI({ khach_hang: params.khach_hang });
  //     if (res.success) {
  //       setListNameProducts(
  //         res.data.product.map((e) => {
  //           return { ...e, label: e.name, value: e.id };
  //         })
  //       );
  //       setListLoSX(
  //         Object.values(res.data.lo_sx).map((e) => {
  //           return { label: e, value: e };
  //         })
  //       );
  //     }
  //   })();
  // }, [params.khach_hang]);

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

export default KeHoachSanXuat;
