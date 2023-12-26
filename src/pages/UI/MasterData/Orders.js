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
  DatePicker,
  Spin,
  Popconfirm,
  Typography,
  InputNumber,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useEffect } from "react";
import {
  createOrder,
  deleteOrders,
  exportOrders,
  getOrders,
  updateOrder,
} from "../../../api";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "../style.scss";
import { COMMON_DATE_TABLE_FORMAT_REQUEST } from "../../../commons/constants";
import dayjs from "dayjs";
import { formatDateTime } from "../../../commons/utils";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  onChange,
  ...restProps
}) => {
  let inputNode;
  switch (inputType) {
    case "number":
      inputNode = <InputNumber />;
      break;
    default:
      inputNode = <Input />;
  }
  const dateValue = record?.[dataIndex] ? dayjs(record?.[dataIndex]) : null;
  return (
    <td {...restProps}>
      {editing ? (
        inputType === "dateTime" ? (
          <DatePicker
            format={COMMON_DATE_TABLE_FORMAT_REQUEST}
            placeholder="Chọn ngày"
            value={dateValue}
            onChange={(value) => value.isValid() && onChange(value, dataIndex)}
          />
        ) : (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            initialValue={record?.[dataIndex]}
          >
            {inputNode}
          </Form.Item>
        )
      ) : (
        children
      )}
    </td>
  );
};

const Orders = () => {
  document.title = "Quản lý đơn hàng";
  const [listCheck, setListCheck] = useState([]);
  const [openMdl, setOpenMdl] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [params, setParams] = useState({});
  const [editingKey, setEditingKey] = useState("");
  const [data, setData] = useState([]);
  const isEditing = (record) => record.key === editingKey;

  const col_detailTable = [
    {
      title: "Ngày đặt hàng",
      dataIndex: "ngay_dat_hang",
      key: "ngay_dat_hang",
      align: "center",
      fixed: "left",
      editable: true,
    },
    {
      title: "Khách hàng",
      dataIndex: "khach_hang",
      key: "khach_hang",
      align: "center",
      editable: true,
    },
    {
      title: "Người đặt hàng",
      dataIndex: "nguoi_dat_hang",
      key: "nguoi_dat_hang",
      align: "center",
      editable: true,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
      editable: true,
    },
    {
      title: "Đơn hàng",
      dataIndex: "order",
      key: "order",
      align: "center",
      editable: true,
    },
    {
      title: "Mã quản lý",
      dataIndex: "mql",
      key: "mql",
      align: "center",
      editable: true,
    },
    {
      title: "Dài",
      dataIndex: "dai",
      key: "dai",
      align: "center",
      editable: true,
    },
    {
      title: "Rộng",
      dataIndex: "rong",
      key: "rong",
      align: "center",
      editable: true,
    },
    {
      title: "Cao",
      dataIndex: "cao",
      key: "cao",
      align: "center",
      editable: true,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
      editable: true,
    },
    {
      title: "Số lượng",
      dataIndex: "sl",
      key: "sl",
      align: "center",
      editable: true,
    },
    {
      title: "Số lượng giao",
      dataIndex: "slg",
      key: "slg",
      align: "center",
      editable: true,
    },
    {
      title: "Số lượng thực",
      dataIndex: "slt",
      key: "slt",
      align: "center",
      editable: true,
    },
    {
      title: "TMO",
      dataIndex: "tmo",
      key: "tmo",
      align: "center",
      editable: true,
    },
    {
      title: "PO",
      dataIndex: "po",
      key: "po",
      align: "center",
      editable: true,
    },
    {
      title: "Style",
      dataIndex: "style",
      key: "style",
      align: "center",
      editable: true,
    },
    {
      title: "Style no",
      dataIndex: "style_no",
      key: "style_no",
      align: "center",
      editable: true,
    },
    {
      title: "Màu",
      dataIndex: "color",
      key: "color",
      align: "center",
      editable: true,
    },
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      align: "center",
      editable: true,
    },
    {
      title: "RM",
      dataIndex: "rm",
      key: "rm",
      align: "center",
      editable: true,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      align: "center",
      editable: true,
    },
    {
      title: "Ghi chú 1",
      dataIndex: "note_1",
      key: "note_1",
      align: "center",
      editable: true,
    },
    {
      title: "Hạn giao",
      dataIndex: "han_giao",
      key: "han_giao",
      align: "center",
      editable: true,
    },
    {
      title: "Ghi chú 2",
      dataIndex: "note_2",
      key: "note_2",
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
              onClick={() => onUpdate(record)}
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
              style={{ color: "#1677ff", fontSize: 18 }}
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            />
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa?"
              onConfirm={() => onDetele(record)}
            >
              <DeleteOutlined
                style={{
                  color: "red",
                  marginLeft: 8,
                  fontSize: 18,
                }}
              />
            </Popconfirm>
          </span>
        );
      },
    },
  ];
  const formFields = [
    {
      title: "Ngày đặt hàng",
      dataIndex: "ngay_dh",
      key: "ngay_dh",
      align: "center",
      fixed: "left",
    },
    {
      title: "Khách hàng",
      dataIndex: "khach_hang",
      key: "khach_hang",
      align: "center",
    },
    {
      title: "Người đặt hàng",
      dataIndex: "nguoi_dh",
      key: "nguoi_dh",
      align: "center",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
    },
    {
      title: "Đơn hàng",
      dataIndex: "order",
      key: "order",
      align: "center",
    },
    {
      title: "Mã quản lý",
      dataIndex: "mql",
      key: "mql",
      align: "center",
    },
    {
      title: "Dài",
      dataIndex: "l",
      key: "l",
      align: "center",
    },
    {
      title: "Rộng",
      dataIndex: "w",
      key: "w",
      align: "center",
    },
    {
      title: "Cao",
      dataIndex: "h",
      key: "h",
      align: "center",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "sl",
      key: "sl",
      align: "center",
    },
    {
      title: "Số lượng giao",
      dataIndex: "slg",
      key: "slg",
      align: "center",
    },
    {
      title: "Số lượng thực",
      dataIndex: "slt",
      key: "slt",
      align: "center",
    },
    {
      title: "TMO",
      dataIndex: "tmo",
      key: "tmo",
      align: "center",
    },
    {
      title: "PO",
      dataIndex: "po",
      key: "po",
      align: "center",
    },
    {
      title: "Style",
      dataIndex: "style",
      key: "style",
      align: "center",
    },
    {
      title: "Style no",
      dataIndex: "style_no",
      key: "style_no",
      align: "center",
    },
    {
      title: "Màu",
      dataIndex: "color",
      key: "color",
      align: "center",
    },
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      align: "center",
    },
    {
      title: "RM",
      dataIndex: "rm",
      key: "rm",
      align: "center",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      align: "center",
    },
    {
      title: "Dot",
      dataIndex: "dot",
      key: "dot",
      align: "center",
    },
    {
      title: "Fac",
      dataIndex: "fac",
      key: "fac",
      align: "center",
    },
    {
      title: "Ghi chú",
      dataIndex: "ghi_chu",
      key: "ghi_chu",
      align: "center",
    },
    {
      title: "Hạn giao",
      dataIndex: "han_giao",
      key: "han_giao",
      align: "center",
    },
    {
      title: "Ngày giao",
      dataIndex: "ngay_giao",
      key: "ngay_giao",
      align: "center",
    },
    {
      title: "Ghi chú 2",
      dataIndex: "ghi_chu_2",
      key: "ghi_chu_2",
      align: "center",
    },
    {
      title: "Xe giao",
      dataIndex: "xe_giao",
      key: "xe_giao",
      align: "center",
    },
    {
      title: "Xuất hàng",
      dataIndex: "xuat_hang",
      key: "xuat_hang",
      align: "center",
    },
  ];

  const mergedColumns = col_detailTable.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "cao" ||
          col.dataIndex === "dai" ||
          col.dataIndex === "mdh" ||
          col.dataIndex === "mql" ||
          col.dataIndex === "order" ||
          col.dataIndex === "price" ||
          col.dataIndex === "rong"
            ? "number"
            : col.dataIndex === "ngay_dat_hang" || col.dataIndex === "han_giao"
            ? "dateTime"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        onChange,
      }),
    };
  });

  const onChange = (value, dataIndex) => {
    const items = data.map((val) => {
      if (val.key === editingKey) {
        val[dataIndex] = value;
      }
      return { ...val };
    });
    value.isValid() && setData(items);
  };

  function btn_click() {
    loadListTable(params);
  }

  const onAdd = () => {
    form.resetFields();
    setData([
      {
        key: data.length + 1,
        khach_hang: "",
        nguoi_dat_hang: "",
        mdh: "",
        order: "",
        sl: "",
        slg: "",
        slt: "",
        tmo: "",
        po: "",
        style: "",
        style_no: "",
        color: "",
        item: "",
        rm: "",
        size: "",
        note_1: "",
        note_2: "",
      },
      ...data,
    ]);
    setEditingKey(data.length + 1);
  };

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    if (typeof editingKey === "number") {
      const newData = [...data];
      newData.shift();
      setData(newData);
    }
    setEditingKey("");
  };

  const loadListTable = async (params) => {
    setLoading(true);
    const res = await getOrders(params);
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
    if (isEdit) {
      values.id = editingKey;
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

  const onUpdate = async () => {
    const row = await form.validateFields();
    const item = data.find((val) => val.key === editingKey);

    if (item) {
      row.ngay_dat_hang = formatDateTime(
        item?.ngay_dat_hang,
        COMMON_DATE_TABLE_FORMAT_REQUEST
      );
      row.han_giao = formatDateTime(
        item?.han_giao,
        COMMON_DATE_TABLE_FORMAT_REQUEST
      );
      !item?.ngay_dat_hang && delete row?.ngay_dat_hang;
      !item?.han_giao && delete row?.han_giao;
    }

    if (typeof editingKey === "number") {
      const res = await createOrder(row);
      if (res) {
        form.resetFields();
        loadListTable(params);
        setEditingKey("");
      }
    } else {
      row.id = editingKey;
      const res = await updateOrder(row);
      if (res) {
        form.resetFields();
        loadListTable(params);
        setEditingKey("");
      }
    }
  };

  const onDetele = async (record) => {
    await deleteOrders({ id: record.id });
    loadListTable(params);
  };

  const [loadingExport, setLoadingExport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
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
                <Form.Item label="Mã lỗi" className="mb-3">
                  <Input
                    allowClear
                    onChange={(e) =>
                      setParams({ ...params, id: e.target.value })
                    }
                    placeholder="Nhập mã"
                  />
                </Form.Item>
                <Form.Item label="Code" className="mb-3">
                  <Input
                    allowClear
                    onChange={(e) =>
                      setParams({ ...params, code: e.target.value })
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
            title="Quản lý đơn hàng"
            extra={
              <Space>
                <Upload
                  showUploadList={false}
                  name="files"
                  action={baseURL + "/api/orders/import"}
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
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  rowClassName="editable-row"
                  scroll={{
                    x: "250vw",
                    y: "80vh",
                  }}
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

export default Orders;
