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
  Popconfirm,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useRef, useEffect } from "react";
import {
  createSpecProduct,
  deleteSpecProduct,
  exportSpecProduct,
  getSpecProduct,
  updateSpecProduct,
} from "../../../api";

const SpecProduct = () => {
  document.title = "Quản lý thông số sản phẩm";
  const [listCheck, setListCheck] = useState([]);
  const [openMdl, setOpenMdl] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [params, setParams] = useState({});
  const col_detailTable = [
    {
      title: "Mã hàng ",
      dataIndex: "id",
      key: "id",
      align: "center",
      fixed: "left",
    },
    {
      title: "Tên ",
      dataIndex: "name",
      key: "name",
      align: "center",
      fixed: "left",
    },
    {
      title: "Mã nguyên liệu",
      dataIndex: "material_id",
      key: "material_id",
      align: "center",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      align: "center",
      render: (value, item, index) => value?.name,
    },
    {
      title: "Ver",
      dataIndex: "ver",
      key: "ver",
      align: "center",
    },
    {
      title: "His",
      dataIndex: "his",
      key: "his",
      align: "center",
    },
    {
      title: "Nhiệt độ phòng",
      dataIndex: "nhiet_do_phong",
      key: "nhiet_do_phong",
      align: "center",
    },
    {
      title: "Độ ẩm phòng",
      dataIndex: "do_am_phong",
      key: "do_am_phong",
      align: "center",
    },
    {
      title: "Độ ẩm giấy",
      dataIndex: "do_am_giay",
      key: "do_am_giay",
      align: "center",
    },
    {
      title: "Số tờ/pallet",
      dataIndex: "dinh_muc",
      key: "dinh_muc",
      align: "center",
    },
    {
      title: "Thời gian bảo ôn",
      dataIndex: "thoi_gian_bao_on",
      key: "thoi_gian_bao_on",
      align: "center",
    },
    {
      title: "Chiều dài thùng(mm)",
      dataIndex: "chieu_dai_thung",
      key: "chieu_dai_thung",
      align: "center",
    },
    {
      title: "Chiều rộng thùng(mm)",
      dataIndex: "chieu_rong_thung",
      key: "chieu_rong_thung",
      align: "center",
    },
    {
      title: "Chiều cao thùng(mm)",
      dataIndex: "chieu_cao_thung",
      key: "chieu_cao_thung",
      align: "center",
    },
    {
      title: "Thể tích thùng(m3)",
      dataIndex: "the_tich_thung",
      key: "the_tich_thung",
      align: "center",
    },
    {
      title: "Định mức thùng",
      dataIndex: "dinh_muc_thung",
      key: "dinh_muc_thung",
      align: "center",
    },
    {
      title: "Nhiệt độ phòng ủ",
      dataIndex: "u_nhiet_do_phong",
      key: "u_nhiet_do_phong",
      align: "center",
    },
    {
      title: "Độ ẩm phòng ủ",
      dataIndex: "u_do_am_phong",
      key: "u_do_am_phong",
      align: "center",
    },
    {
      title: "Độ ẩm giấy ủ",
      dataIndex: "u_do_am_giay",
      key: "u_do_am_giay",
      align: "center",
    },
    {
      title: "Thời gian ủ",
      dataIndex: "u_thoi_gian_u",
      key: "u_thoi_gian_u",
      align: "center",
    },
    {
      title: "Number of bin",
      dataIndex: "number_of_bin",
      key: "number_of_bin",
      align: "center",
    },
    {
      title: "KT khổ dài",
      dataIndex: "kt_kho_dai",
      key: "kt_kho_dai",
      align: "center",
    },
    {
      title: "KT khổ rộng",
      dataIndex: "kt_kho_rong",
      key: "kt_kho_rong",
      align: "center",
    },
  ];
  const formFields = [
    {
      title: "Mã sản phẩm",
      key: "id",
      required: true,
    },
    {
      title: "Tên",
      key: "name",
      required: true,
    },
    {
      title: "Mã nguyên liệu",
      key: "material_id",
      required: true,
    },
    {
      title: "Khách hàng",
      key: "customer",
      required: true,
    },
    {
      title: "Ver",
      key: "ver",
      required: true,
    },
    {
      title: "His",
      key: "his",
      required: true,
    },
    {
      title: "Nhiệt độ phòng",
      key: "nhiet_do_phong",
      required: true,
    },
    {
      title: "Độ ẩm phòng",
      key: "do_am_phong",
      required: true,
    },
    {
      title: "Độ ẩm giấy",
      key: "do_am_giay",
      required: true,
    },
    {
      title: "Số tờ/pallet",
      key: "dinh_muc",
      required: true,
    },
    {
      title: "Thời gian bảo ôn",
      key: "thoi_gian_bao_on",
      required: true,
    },
    {
      title: "Chiều dài thùng(mm)",
      key: "chieu_dai_thung",
      required: true,
    },
    {
      title: "Chiều rộng thùng(mm)",
      key: "chieu_rong_thung",
      required: true,
    },
    {
      title: "Chiều cao thùng(mm)",
      key: "chieu_cao_thung",
      required: true,
    },
    {
      title: "Thể tích thùng(m3)",
      key: "the_tich_thung",
      required: true,
    },
    {
      title: "Định mức thùng",
      key: "dinh_muc_thung",
      required: true,
    },
    {
      title: "Nhiệt độ phòng ủ",
      key: "u_nhiet_do_phong",
      required: true,
    },
    {
      title: "Độ ẩm phòng ủ",
      key: "u_do_am_phong",
      required: true,
    },
    {
      title: "Độ ẩm giấy ủ",
      key: "u_do_am_giay",
      required: true,
    },
    {
      title: "Thời gian ủ",
      key: "u_thoi_gian_u",
      required: true,
    },
    {
      title: "Number of bin",
      key: "number_of_bin",
      required: true,
    },
    {
      title: "KT khổ dài",
      key: "kt_kho_dai",
      required: true,
    },
    {
      title: "KT khổ rộng",
      key: "kt_kho_rong",
      required: true,
    },
  ];

  function btn_click() {
    loadListTable(params);
  }

  const [data, setData] = useState([]);
  const loadListTable = async (params) => {
    setLoading(true);
    const res = await getSpecProduct(params);
    setData(
      res.map((e) => {
        return { ...e, key: e.id };
      })
    );
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
    console.log(values);
    if (isEdit) {
      const res = await updateSpecProduct(values);
      console.log(res);
      if (res) {
        form.resetFields();
        setOpenMdl(false);
        loadListTable(params);
      }
    } else {
      const res = await createSpecProduct(values);
      console.log(res);
      if (res) {
        form.resetFields();
        setOpenMdl(false);
        loadListTable(params);
      }
    }
  };

  const deleteRecord = async () => {
    if (listCheck.length > 0) {
      const res = await deleteSpecProduct(listCheck);
      setListCheck([]);
      loadListTable(params);
    } else {
      message.info("Chưa chọn bản ghi cần xóa");
    }
  };
  const editRecord = () => {
    setIsEdit(true);
    if (listCheck.length !== 1) {
      message.info("Chọn 1 bản ghi để chỉnh sửa");
    } else {
      const result = data.find((record) => record.id === listCheck[0]);
      form.setFieldsValue({ ...result, customer: result?.customer?.name });
      setOpenMdl(true);
    }
  };
  const insertRecord = () => {
    setIsEdit(false);
    form.resetFields();
    setOpenMdl(true);
  };
  const [loadingExport, setLoadingExport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportSpecProduct(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys);
    },
  };
  return (
    <>
      {contextHolder}
      <Row style={{ padding: "8px", height: "90vh" }} gutter={[8, 8]}>
        <Col span={3}>
          <Card style={{ height: "100%" }} bodyStyle={{ padding: 0 }}>
            <Divider>Tìm kiếm</Divider>
            <div className="mb-3">
              <Form
                style={{ margin: "0 15px" }}
                layout="vertical"
                onFinish={btn_click}
              >
                <Form.Item label="Mã" className="mb-3">
                  <Input
                    allowClear
                    onChange={(e) =>
                      setParams({ ...params, id: e.target.value })
                    }
                    placeholder="Nhập mã"
                  />
                </Form.Item>
                <Form.Item label="Tên" className="mb-3">
                  <Input
                    allowClear
                    onChange={(e) =>
                      setParams({ ...params, name: e.target.value })
                    }
                    placeholder="Nhập tên"
                  />
                </Form.Item>
                <Form.Item style={{ textAlign: "center" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "80%" }}
                  >
                    Tìm kiếm
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </Col>
        <Col span={21}>
          <Card
            style={{ height: "100%" }}
            title="Quản lý thông số sản phẩm"
            extra={
              <Space>
                <Upload
                  showUploadList={false}
                  name="files"
                  action={baseURL + "/api/spec-product/import"}
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
                <Button
                  type="primary"
                  onClick={editRecord}
                  disabled={listCheck.length <= 0}
                >
                  Edit
                </Button>
                <Button type="primary" onClick={insertRecord}>
                  Insert
                </Button>
                <Popconfirm
                  title="Xoá bản ghi"
                  description={
                    "Bạn có chắc xoá " + listCheck.length + " bản ghi đã chọn?"
                  }
                  onConfirm={deleteRecord}
                  okText="Có"
                  cancelText="Không"
                  placement="bottomRight"
                >
                  <Button type="primary" disabled={listCheck.length <= 0}>
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            }
          >
            <Spin spinning={loading}>
              <Table
                size="small"
                bordered
                pagination={{ position: ["topRight", "bottomRight"] }}
                scroll={{
                  x: "130vw",
                  y: "80vh",
                }}
                columns={col_detailTable}
                dataSource={data}
                rowSelection={rowSelection}
              />
            </Spin>
          </Card>
        </Col>
      </Row>
      <Modal
        title={isEdit ? "Cập nhật" : "Thêm mới"}
        open={openMdl}
        onCancel={() => setOpenMdl(false)}
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
                      rules={[{ required: e.required }]}
                    >
                      {!e.isTrueFalse ? (
                        <Input
                          disabled={e.disabled || (isEdit && e.key === "id")}
                        ></Input>
                      ) : (
                        <Select>
                          <Select.Option value={1}>Có</Select.Option>
                          <Select.Option value={0}>Không</Select.Option>
                        </Select>
                      )}
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

export default SpecProduct;
