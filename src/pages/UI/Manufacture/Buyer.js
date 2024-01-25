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
  Popconfirm,
  Typography,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useEffect } from "react";
import {
  createBuyers,
  createOrder,
  deleteBuyers,
  exportOrders,
  updateBuyers,
  updateOrder,
} from "../../../api";
import { getBuyers } from "../../../api/ui/manufacture";
import "../style.scss";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "../style.scss";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
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
  const [type, setType] = useState("");
  const [keys, setKeys] = useState([
    "id",
    "customer_id",
    "buyer_vt",
    "phan_loai_1",
    "so_lop",
    "ket_cau_giay",
    "note",
    "ma_cuon_f",
    "ma_cuon_se",
    "ma_cuon_le",
    "ma_cuon_sb",
    "ma_cuon_lb",
    "ma_cuon_sc",
    "ma_cuon_lc",
  ]);
  const isEditing = (record) => record.key === editingKey;

  const hasEditColumn = (value) => {
    return keys.some((val) => val === value);
  };

  const col_detailTable = [
    {
      title: "Mã buyer",
      dataIndex: "id",
      key: "id",
      align: "center",
      fixed: "left",
      editable: hasEditColumn("id"),
    },
    {
      title: "Mã khách hàng",
      dataIndex: "customer_id",
      key: "customer_id",
      align: "center",
      editable: hasEditColumn("customer_id"),
    },
    {
      title: "Buyer viết tắt",
      dataIndex: "buyer_vt",
      key: "buyer_vt",
      align: "center",
      editable: hasEditColumn("buyer_vt"),
    },
    {
      title: "Phân loại 1",
      dataIndex: "phan_loai_1",
      key: "phan_loai_1",
      align: "center",
      editable: hasEditColumn("phan_loai_1"),
    },
    {
      title: "Số lớp",
      dataIndex: "so_lop",
      key: "so_lop",
      align: "center",
      editable: hasEditColumn("so_lop"),
    },
    {
      title: "Kết cấu giấy",
      dataIndex: "ket_cau_giay",
      key: "ket_cau_giay",
      align: "center",
      editable: hasEditColumn("ket_cau_giay"),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      align: "center",
      editable: hasEditColumn("note"),
    },
    {
      title: "Mặt F",
      dataIndex: "ma_cuon_f",
      key: "ma_cuon_f",
      align: "center",
      editable: hasEditColumn("ma_cuon_f"),
    },
    {
      title: "Sóng E",
      dataIndex: "ma_cuon_se",
      key: "ma_cuon_se",
      align: "center",
      editable: hasEditColumn("ma_cuon_se"),
    },
    {
      title: "Láng E",
      dataIndex: "ma_cuon_le",
      key: "ma_cuon_le",
      align: "center",
      editable: hasEditColumn("ma_cuon_le"),
    },
    {
      title: "Sóng B",
      dataIndex: "ma_cuon_sb",
      key: "ma_cuon_sb",
      align: "center",
      editable: hasEditColumn("ma_cuon_sb"),
    },
    {
      title: "Láng B",
      dataIndex: "ma_cuon_lb",
      key: "sl",
      align: "center",
      editable: hasEditColumn("ma_cuon_lb"),
    },
    {
      title: "Sóng C",
      dataIndex: "ma_cuon_sc",
      key: "ma_cuon_sc",
      align: "center",
      editable: hasEditColumn("ma_cuon_sc"),
    },
    {
      title: "Láng C",
      dataIndex: "ma_cuon_lc",
      key: "ma_cuon_lc",
      align: "center",
      editable: hasEditColumn("ma_cuon_lc"),
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
          <span>
            <EditOutlined
              style={{ color: "#1677ff", fontSize: 20 }}
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            />
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa?"
              onConfirm={() => deleteItem(record.key)}
            >
              <DeleteOutlined
                style={{
                  color: "red",
                  marginLeft: 8,
                  fontSize: 20,
                }}
              />
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const deleteItem = async (key) => {
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      const res = await deleteBuyers({ id: key });
      newData.splice(index, 1);
      setData(newData);
    }
  };

  const onAdd = () => {
    form.resetFields();
    const newData = [
      {
        key: data.length + 1,
        id: "",
        customer_id: "",
        buyer_vt: "",
        phan_loai_1: "",
        ket_cau_giay: "",
        note: "",
        ma_cuon_f: "",
        ma_cuon_se: "",
        ma_cuon_le: "",
        ma_cuon_sb: "",
        ma_cuon_lb: "",
        ma_cuon_sc: "",
        ma_cuon_lc: "",
      },
      ...data,
    ];
    setData(newData);
    setEditingKey(data.length + 1);
    setType("add");
  };

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
    setType("update");
  };
  const cancel = () => {
    if (typeof editingKey === "number") {
      const newData = [...data];
      newData.shift();
      setData(newData);
    }
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (type === "update") {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
          key: row.id,
        });
        await updateBuyers(row);
        setData(newData);
        setEditingKey("");
      } else {
        await createBuyers(row);
        const items = [row, ...data.filter((val) => val.key !== key)];
        setData(items);
        setEditingKey("");
      }
      form.resetFields();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const mergedColumns = col_detailTable?.map((col) => {
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
      res.reverse().map((e) => {
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
        <Col span={4}>
          <div className="slide-bar">
            <Card
              style={{ height: "100%" }}
              bodyStyle={{ padding: 0 }}
              className="custom-card scroll"
              actions={[
                <div layout="vertical">
                  <Button
                    type="primary"
                    style={{ width: "80%" }}
                    onClick={btn_click}
                  >
                    Truy vấn
                  </Button>
                </div>,
              ]}
            >
              <Divider>Tìm kiếm</Divider>
              <div className="mb-3">
                <Form
                  style={{ margin: "0 15px" }}
                  layout="vertical"
                  // onFinish={btn_click}
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
                </Form>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Card
            style={{ height: "100%" }}
            bodyStyle={{ paddingBottom: 0 }}
            className="custom-card scroll"
            title="Quản lý Buyer"
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
                <Button type="primary" onClick={onAdd}>
                  Insert
                </Button>
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
    </>
  );
};

export default Buyer;
