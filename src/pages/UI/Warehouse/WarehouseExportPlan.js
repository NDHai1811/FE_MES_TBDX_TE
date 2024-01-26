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
import "../style.scss";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { getWarehouseFGExportList } from "../../../api/ui/warehouse";

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

const WarehouseExportPlan = () => {
  document.title = "Kế hoạch xuất kho";
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
    "ngay_xuat",
    "customer_id",
    "mdh",
    "mql",
    "so_luong",
    "tai_xe",
    "so_xe",
    "nguoi_xuat",
  ]);
  const isEditing = (record) => record.key === editingKey;

  const hasEditColumn = (value) => {
    return keys.some((val) => val === value);
  };

  const col_detailTable = [
    {
      title: "Ngày xuất",
      dataIndex: "ngay_xuat",
      key: "ngay_xuat",
      align: "center",
      fixed: "left",
      render: (value, item) => dayjs(value).format('DD/MM/YYYY')
    },
    {
      title: "Mã khách hàng",
      dataIndex: "customer_id",
      key: "customer_id",
      align: "center",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
      editable: hasEditColumn("mdh"),
    },
    {
      title: "Mã quản lý",
      dataIndex: "mql",
      key: "mql",
      align: "center",
      editable: hasEditColumn("mql"),
    },
    {
      title: "Số lượng",
      dataIndex: "so_luong",
      key: "so_luong",
      align: "center",
      editable: hasEditColumn("so_luong"),
    },
    {
      title: "Tài xế",
      dataIndex: "tai_xe",
      key: "tai_xe",
      align: "center",
      editable: hasEditColumn("tai_xe"),
    },
    {
      title: "Số xe",
      dataIndex: "so_xe",
      key: "so_xe",
      align: "center",
      editable: hasEditColumn("so_xe"),
    },
    {
      title: "Người xuất",
      dataIndex: "nguoi_xuat",
      key: "nguoi_xuat",
      align: "center",
      editable: hasEditColumn("nguoi_xuat"),
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
        ngay_xuat: "",
        mdh: "",
        mql: "",
        so_luong: "",
        tai_xe: "",
        so_xe: "",
        nguoi_xuat: "",
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
        row.id = editingKey;
        if (listCheck.length > 0) {
          row.ids = listCheck;
        }
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
    const res = await getWarehouseFGExportList(params);
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
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Card
              bodyStyle={{ paddingInline: 0, paddingTop: 0 }}
              className="custom-card scroll"
              actions={[
                <div
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
              ]}
            >
              <Divider>Tìm kiếm</Divider>
              <div className="mb-3">
                <Form
                  style={{ margin: "0 15px" }}
                  layout="vertical"
                  onFinish={btn_click}
                >
                  <Form.Item label="Mã khách hàng" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, customer_id: e.target.value })
                      }
                      placeholder="Nhập mã khách hàng"
                    />
                  </Form.Item>
                  <Form.Item label="Mã đơn hàng" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, mdh: e.target.value })
                      }
                      placeholder="Nhập mã đơn hàng"
                    />
                  </Form.Item>
                  <Form.Item label="Mã quản lý" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, mql: e.target.value })
                      }
                      placeholder="Nhập mã quản lý"
                    />
                  </Form.Item>
                  <Button
                    hidden
                    htmlType="submit"
                  >
                  </Button>
                </Form>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Card
            style={{ height: "100%" }}
            title="Kế hoạch xuất kho"
            className="custom-card scroll"
            extra={
              <Space>
                <Upload
                  showUploadList={false}
                  name="files"
                  action={baseURL + "/api/upload-ke-hoach-xuat-kho"}
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
                    y: window.innerHeight*0.55,
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

export default WarehouseExportPlan;
