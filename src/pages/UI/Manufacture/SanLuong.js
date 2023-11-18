import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  PlusOutlined,
  FileExcelOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
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
} from "antd";
import { Pie } from "@ant-design/charts";
import { baseURL } from "../../../config";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import React, { useState, useRef, useEffect } from "react";
import {
  getLines,
  getMachineOfLine,
  getCustomers,
  getProducts,
  getStaffs,
  getLoSanXuat,
  getWarehouses,
  getCaSanXuats,
  getDataFilterUI,
} from "../../../api/ui/main";
import {
  deleteRecordProductPlan,
  exportInfoCongDoan,
  getInfoCongDoan,
  getListProductPlan,
  storeProductPlan,
  updateInfoCongDoan,
  updateProductPlan,
} from "../../../api";
import dayjs from "dayjs";

const { Sider } = Layout;
const { RangePicker } = DatePicker;

const SanLuong = () => {
  document.title = "Quản lý sản lượng";
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
    console.log(e);
    if (!e.target.checked) {
      setselectedRecord();
    } else {
      setselectedRecord(e.target.value);
    }
  };
  const [selectedRecord, setselectedRecord] = useState();
  useEffect(() => {
    console.log(selectedRecord);
  }, [selectedRecord]);
  const col_detailTable = [
    {
      title: "Chọn",
      dataIndex: "select",
      key: "select",
      render: (value, item, index) => (
        <Checkbox
          checked={selectedRecord === item.id}
          value={item.id}
          onChange={onChangeChecbox}
        ></Checkbox>
      ),
      align: "center",
      width: 60,
      fixed: "left",
    },
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center",
      render: (value, item, index) => index + 1,
      width: 60,
      fixed: "left",
    },
    {
      title: "Mã pallet/thùng",
      dataIndex: "lot_id",
      key: "lot_id",
      align: "center",
      fixed: "left",
    },
    {
      title: "Công đoạn",
      dataIndex: "line",
      key: "line",
      align: "center",
      render: (value, item, index) => value.name,
      fixed: "left",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "thoi_gian_bat_dau",
      key: "thoi_gian_bat_dau",
      align: "center",
    },
    {
      title: "Thời gian bấm máy",
      dataIndex: "thoi_gian_bam_may",
      key: "thoi_gian_bam_may",
      align: "center",
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "thoi_gian_ket_thuc",
      key: "thoi_gian_ket_thuc",
      align: "center",
    },
    {
      title: "Sản lượng đầu vào vào hàng",
      dataIndex: "sl_dau_vao_chay_thu",
      key: "sl_dau_vao_chay_thu",
      align: "center",
    },
    {
      title: "Sản lượng đầu ra vào hàng",
      dataIndex: "sl_dau_ra_chay_thu",
      key: "sl_dau_ra_chay_thu",
      align: "center",
    },
    {
      title: "Sản lượng đầu vào thực tế",
      dataIndex: "sl_dau_vao_hang_loat",
      key: "sl_dau_vao_hang_loat",
      align: "center",
    },
    {
      title: "Sản lượng đầu ra thực tế",
      dataIndex: "sl_dau_ra_hang_loat",
      key: "sl_dau_ra_hang_loat",
      align: "center",
    },
    {
      title: "Số lượng tem vàng",
      dataIndex: "sl_tem_vang",
      key: "sl_tem_vang",
      align: "center",
    },
    {
      title: "Số lượng NG",
      dataIndex: "sl_ng",
      key: "sl_ng",
      align: "center",
    },
  ];
  const formFields = [
    {
      title: "Mã pallet/thùng",
      key: "lot_id",
      disabled: true,
    },
    {
      title: "Công đoạn",
      key: "line_id",
      hidden: true,
      disabled: true,
    },
    {
      title: "Công đoạn",
      key: "line",
      ignore: true,
      disabled: true,
    },
    {
      title: "Thời gian bắt đầu",
      key: "thoi_gian_bat_dau",
    },
    {
      title: "Thời gian bấm máy",
      key: "thoi_gian_bam_may",
    },
    {
      title: "Thời gian kết thúc",
      key: "thoi_gian_ket_thuc",
    },
    {
      title: "Sản lượng đầu vào vào hàng",
      key: "sl_dau_vao_chay_thu",
    },
    {
      title: "Sản lượng đầu ra vào hàng",
      key: "sl_dau_ra_chay_thu",
    },
    {
      title: "Sản lượng đầu vào thực tế",
      key: "sl_dau_vao_hang_loat",
    },
    {
      title: "Sản lượng đầu ra thực tế",
      key: "sl_dau_ra_hang_loat",
    },
    {
      title: "Số lượng tem vàng",
      key: "sl_tem_vang",
    },
    {
      title: "Số lượng NG",
      key: "sl_ng",
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
      const res5 = await getCustomers();
      setListCustomers(
        res5.data.map((e) => {
          return { ...e, label: e.name, value: e.id };
        })
      );
      const res2 = await getProducts();
      setListNameProducts(
        res2.data.map((e) => {
          return { ...e, label: e.name, value: e.id };
        })
      );
      const res3 = await getLoSanXuat();
      setListLoSX(
        Object.values(res3.data).map((e) => {
          return { label: e, value: e };
        })
      );
    })();
  }, []);

  function btn_click() {
    loadListTable(params);
  }

  // useEffect(()=>{
  //     (async ()=>{
  //         var res = await getDataFilterUI({khach_hang: params.khach_hang});
  //         if(res.success){
  //             setListNameProducts(res.data.product.map(e => {
  //                 return { ...e, label: e.name, value: e.id }
  //             }));
  //             setListLoSX(Object.values(res.data.lo_sx).map(e => {
  //                 return { label: e, value: e }
  //             }));
  //         }
  //     })()
  // }, [params.khach_hang])

  const [data, setData] = useState([]);
  const loadListTable = async (params) => {
    setLoading(true);
    const res = await getInfoCongDoan(params);
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
    const res = await updateInfoCongDoan(values);
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
    if (!selectedRecord) {
      message.info("Chọn 1 bản ghi để chỉnh sửa");
    } else {
      const result = data.find((record) => record.id === selectedRecord);
      form.setFieldsValue({ ...result, line: result.line.name });
      setOpenMdlEdit(true);
    }
  };
  const insertRecord = () => {};
  const [loadingExport, setLoadingExport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportInfoCongDoan(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
  return (
    <>
      {contextHolder}
      <Row style={{ padding: "8px", height: "90vh" }} gutter={[8, 8]}>
        <Col span={3}>
          <Card style={{ height: "100%" }} bodyStyle={{ paddingInline: 0 }}>
            <div className="mb-3">
              <Form style={{ margin: "0 15px" }} layout="vertical">
                <Form.Item label="Công đoạn" className="mb-3">
                  <Select
                    allowClear
                    value={params.line_id}
                    onChange={(value) =>
                      setParams({ ...params, line_id: value })
                    }
                    placeholder="Nhập công đoạn"
                    options={listLines}
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
                <Form.Item label="Mã pallet/thùng" className="mb-3">
                  <Input
                    allowClear
                    onChange={(e) =>
                      setParams({ ...params, lot_id: e.target.value })
                    }
                    placeholder="Nhập mã"
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
        <Col span={21}>
          <Card
            style={{ height: "100%" }}
            title="Sản lượng"
            extra={
              <Space>
                <Upload
                  showUploadList={false}
                  name="files"
                  action={baseURL + "/api/info-cong-doan/import"}
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
                <Button type="primary" onClick={editRecord}>
                  Edit
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
                  x: "130vw",
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
            {formFields.map((e) => {
              if (e.key !== "select" && e.key !== "stt")
                return (
                  <Col span={!e.hidden ? 12 : 0}>
                    <Form.Item
                      name={e.key}
                      className="mb-3"
                      label={e.title}
                      hidden={e.hidden}
                    >
                      <Input disabled={e.disabled}></Input>
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

export default SanLuong;
