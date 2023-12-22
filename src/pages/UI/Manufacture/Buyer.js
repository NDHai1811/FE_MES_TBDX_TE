import {
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
  Space,
  Modal,
  Spin,
  Popconfirm,
  Typography,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useEffect } from "react";
import {
  createOrder,
  deleteOrders,
  exportOrders,
  updateOrder,
} from "../../../api";
import { getBuyers } from "../../../api/ui/manufacture";
import "../style.scss";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Vui lòng nhập ${title}!`,
            },
          ]}
          initialValue={record?.[dataIndex]}
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const formFields = [
  {
    title: "Mã buyer",
    dataIndex: "id",
    key: "id",
    align: "center",
    fixed: "left",
  },
  {
    title: "Mã khách hàng",
    dataIndex: "customer_id",
    key: "customer_id",
    align: "center",
  },
  {
    title: "Buyer viết tắt",
    dataIndex: "buyer_vt",
    key: "buyer_vt",
    align: "center",
  },
  {
    title: "Phân loại",
    dataIndex: "type",
    key: "type",
    align: "center",
  },
  {
    title: "Kết cấu giấy",
    dataIndex: "ket_cau_giay",
    key: "ket_cau_giay",
    align: "center",
  },
  {
    title: "Ghi chú",
    dataIndex: "note",
    key: "note",
    align: "center",
  },
  {
    title: "Mặt F",
    dataIndex: "ma_cuon_f",
    key: "ma_cuon_f",
    align: "center",
  },
  {
    title: "Sóng E",
    dataIndex: "ma_cuon_se",
    key: "ma_cuon_se",
    align: "center",
  },
  {
    title: "Láng E",
    dataIndex: "ma_cuon_le",
    key: "ma_cuon_le",
    align: "center",
  },
  {
    title: "Sóng B",
    dataIndex: "ma_cuon_sb",
    key: "ma_cuon_sb",
    align: "center",
  },
  {
    title: "Láng B",
    dataIndex: "ma_cuon_lb",
    key: "sl",
    align: "center",
  },
  {
    title: "Sóng C",
    dataIndex: "ma_cuon_sc",
    key: "ma_cuon_sc",
    align: "center",
  },
  {
    title: "Láng C",
    dataIndex: "ma_cuon_lc",
    key: "ma_cuon_lc",
    align: "center",
  },
];

const Buyer = () => {
  document.title = "Quản lý Buyer";
  const [listCheck, setListCheck] = useState([]);
  const [openMdl, setOpenMdl] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [params, setParams] = useState({});
  const [data, setData] = useState([]);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;

  const col_detailTable = [
    {
      title: "Mã buyer",
      dataIndex: "id",
      key: "id",
      align: "center",
      fixed: "left",
      editable: true,
    },
    {
      title: "Mã khách hàng",
      dataIndex: "customer_id",
      key: "customer_id",
      align: "center",
      editable: true,
    },
    {
      title: "Buyer viết tắt",
      dataIndex: "buyer_vt",
      key: "buyer_vt",
      align: "center",
      editable: true,
    },
    {
      title: "Phân loại",
      dataIndex: "type",
      key: "type",
      align: "center",
      editable: true,
    },
    {
      title: "Kết cấu giấy",
      dataIndex: "ket_cau_giay",
      key: "ket_cau_giay",
      align: "center",
      editable: true,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      align: "center",
      editable: true,
    },
    {
      title: "Mặt F",
      dataIndex: "ma_cuon_f",
      key: "ma_cuon_f",
      align: "center",
      editable: true,
    },
    {
      title: "Sóng E",
      dataIndex: "ma_cuon_se",
      key: "ma_cuon_se",
      align: "center",
      editable: true,
    },
    {
      title: "Láng E",
      dataIndex: "ma_cuon_le",
      key: "ma_cuon_le",
      align: "center",
      editable: true,
    },
    {
      title: "Sóng B",
      dataIndex: "ma_cuon_sb",
      key: "ma_cuon_sb",
      align: "center",
      editable: true,
    },
    {
      title: "Láng B",
      dataIndex: "ma_cuon_lb",
      key: "sl",
      align: "center",
      editable: true,
    },
    {
      title: "Sóng C",
      dataIndex: "ma_cuon_sc",
      key: "ma_cuon_sc",
      align: "center",
      editable: true,
    },
    {
      title: "Láng C",
      dataIndex: "ma_cuon_lc",
      key: "ma_cuon_lc",
      align: "center",
      editable: true,
    },
    {
      title: "Hành động",
      dataIndex: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Lưu
            </Typography.Link>
            <Popconfirm title="Bạn có chắc chắn muốn hủy?" onConfirm={cancel}>
              <a>Hủy</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Sửa
          </Typography.Link>
        );
      },
    },
  ];

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const mergedColumns = col_detailTable.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    (async () => {
      loadListTable(params);
    })();
  }, []);

  function btn_click() {
    loadListTable(params);
  }

  const loadListTable = async (params) => {
    setLoading(true);
    const res = await getBuyers(params);
    setData(
      res.map((e) => {
        return { ...e, key: e.id };
      })
    );
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

  const onFinish = async (values) => {
    if (isEdit) {
      const res = await updateOrder(values);
      if (res) {
        form.resetFields();
        setOpenMdl(false);
        loadListTable(params);
      }
    } else {
      const res = await createOrder(values);
      if (res) {
        form.resetFields();
        setOpenMdl(false);
        loadListTable(params);
      }
    }
  };

  const deleteRecord = async () => {
    if (listCheck.length > 0) {
      const res = await deleteOrders(listCheck);
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
      form.setFieldsValue({ ...result });
      setOpenMdl(true);
    }
  };

  const insertRecord = () => {
    setIsEdit(false);
    form.resetFields();
    setOpenMdl(true);
  };

  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportOrders(params);
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
                <Form.Item label="Mã buyer" className="mb-3">
                  <Input
                    allowClear
                    onChange={(e) =>
                      setParams({ ...params, id: e.target.value })
                    }
                    placeholder="Nhập mã buyer"
                  />
                </Form.Item>
                <Form.Item label="Mã khách hàng" className="mb-3">
                  <Input
                    allowClear
                    onChange={(e) =>
                      setParams({ ...params, customer_id: e.target.value })
                    }
                    placeholder="Nhập mã khách hàng"
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
            title="Quản lý đơn hàng"
            extra={
              <Space>
                <Upload
                  showUploadList={false}
                  name="files"
                  action={baseURL + "/api/upload-buyer"}
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
              <Form form={form} component={false}>
                <Table
                  size="small"
                  bordered
                  pagination={{ position: ["bottomRight"] }}
                  scroll={{
                    x: "130vw",
                    y: "80vh",
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
              if (e.key !== "select" && e.key !== "stt") {
                if (e?.children?.length > 0) {
                  return e.children.map((c, index) => {
                    return (
                      <Col span={!c.hidden ? 12 / e.children.length : 0}>
                        <Form.Item
                          name={[e.key, c.key]}
                          className="mb-3"
                          label={e.title + " - " + c.title}
                          hidden={c.hidden}
                          rules={[{ required: c.required }]}
                        >
                          {!c.isTrueFalse ? (
                            <Input
                              disabled={
                                c.disabled || (isEdit && c.key === "id")
                              }
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
                  });
                } else {
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
                }
              }
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

export default Buyer;
