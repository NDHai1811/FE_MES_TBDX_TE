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
  Select,
  Modal,
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
import { DeleteOutlined, EditOutlined, LinkOutlined } from "@ant-design/icons";
import "../style.scss";
import { COMMON_DATE_TABLE_FORMAT_REQUEST } from "../../../commons/constants";
import dayjs from "dayjs";
import { formatDateTime } from "../../../commons/utils";
import { getBuyers, getListLayout } from "../../../api/ui/manufacture";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  onChange,
  onSelect,
  options,
  ...restProps
}) => {
  let inputNode;
  switch (inputType) {
    case "number":
      inputNode = <InputNumber />;
      break;
    case "select":
      inputNode = (
        <Select
          value={record?.[dataIndex]}
          options={options}
          onChange={onSelect}
          bordered
          showSearch
        />
      );
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

const layoutTypes = [
  {
    label: "M",
    value: "M",
  },
  {
    label: "P8",
    value: "P8",
  },
];

const Orders = () => {
  document.title = "Quản lý đơn hàng";
  const [openMdl, setOpenMdl] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [params, setParams] = useState({});
  const [editingKey, setEditingKey] = useState("");
  const [data, setData] = useState([]);
  const isEditing = (record) => record.key === editingKey;
  const [buyers, setBuyers] = useState([]);
  const [layouts, setLayouts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputData, setInputData] = useState([
    {
      so_luong: 0,
      ngay_giao: "",
    },
  ]);

  const showInput = () => {
    setInputData([
      ...inputData,
      {
        so_luong: 0,
        ngay_giao: "",
      },
    ]);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setInputData([
      {
        so_luong: 0,
        ngay_giao: "",
      },
    ]);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setInputData([
      {
        so_luong: 0,
        ngay_giao: "",
      },
    ]);
  };

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
      title: "Mã khách hàng",
      dataIndex: "customer_id",
      key: "customer_id",
      align: "center",
      editable: true,
      fixed: "left",
      width: "3%",
    },
    {
      title: "Người đặt hàng",
      dataIndex: "nguoi_dat_hang",
      key: "nguoi_dat_hang",
      fixed: "left",
      align: "center",
      editable: true,
    },
    {
      title: "MDH",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
      editable: true,
      fixed: "left",
      width: "3%",
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      align: "center",
      editable: true,
      width: "6%",
    },
    {
      title: "MQL",
      dataIndex: "mql",
      key: "mql",
      align: "center",
      editable: true,
      width: "2%",
    },
    {
      title: "Chia máy + p8",
      dataIndex: "layout_type",
      key: "layout_type",
      align: "center",
      editable: true,
      width: "2%",
    },
    {
      title: "L",
      dataIndex: "length",
      key: "length",
      align: "center",
      editable: true,
      width: "2%",
    },
    {
      title: "W",
      dataIndex: "width",
      key: "width",
      align: "center",
      editable: true,
      width: "2%",
    },
    {
      title: "H",
      dataIndex: "height",
      key: "height",
      align: "center",
      editable: true,
      width: "2%",
    },
    {
      title: "Kích thước ĐH",
      dataIndex: "kich_thuoc",
      key: "kich_thuoc",
      align: "center",
      editable: true,
    },
    {
      title: "Đơn vị tính",
      dataIndex: "unit",
      key: "unit",
      align: "center",
      editable: true,
    },
    {
      title: "Kích thước chuẩn",
      dataIndex: "kich_thuoc_chuan",
      key: "kich_thuoc_chuan",
      align: "center",
      editable: true,
    },
    {
      title: "SL",
      dataIndex: "sl",
      key: "sl",
      align: "center",
      editable: true,
    },
    {
      title: "SLG",
      dataIndex: "slg",
      key: "slg",
      align: "center",
      editable: true,
    },
    {
      title: "SLT",
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
      title: "STYLE",
      dataIndex: "style",
      key: "style",
      align: "center",
      editable: true,
      width: "10%",
    },
    {
      title: "STYLE NO",
      dataIndex: "style_no",
      key: "style_no",
      align: "center",
      editable: true,
    },
    {
      title: "COLOR",
      dataIndex: "color",
      key: "color",
      align: "center",
      editable: true,
    },
    {
      title: "ITEM",
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
      title: "SIZE",
      dataIndex: "size",
      key: "size",
      align: "center",
      editable: true,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      align: "center",
      editable: true,
    },
    {
      title: "Thành tiền",
      dataIndex: "into_money",
      key: "into_money",
      align: "center",
      editable: true,
    },
    {
      title: "Đợt",
      dataIndex: "dot",
      key: "dot",
      align: "center",
      editable: true,
    },
    {
      title: "Xưởng giao",
      dataIndex: "xuong_giao",
      key: "xuong_giao",
      align: "center",
      editable: true,
    },
    {
      title: "Ghi chú khách hàng",
      dataIndex: "note_1",
      key: "note_1",
      align: "center",
      editable: true,
    },
    {
      title: "Ngày giao hàng trên đơn",
      dataIndex: "han_giao",
      key: "han_giao",
      align: "center",
      editable: true,
    },
    {
      title: "Ghi chú của TBDX",
      dataIndex: "note_2",
      key: "note_2",
      align: "center",
      editable: true,
    },
    {
      title: "Mã buyer",
      dataIndex: "buyer_id",
      key: "buyer_id",
      align: "center",
      editable: true,
    },
    {
      title: "Mã layout",
      dataIndex: "layout_id",
      key: "layout_id",
      align: "center",
      editable: true,
    },
    {
      title: "Tác vụ",
      dataIndex: "action",
      align: "center",
      fixed: "right",
      width: "2%",
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
            <LinkOutlined
              style={{ color: "#1677ff", fontSize: 18 }}
              onClick={showModal}
            />
            <EditOutlined
              style={{ color: "#1677ff", fontSize: 18, marginLeft: 8 }}
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

  useEffect(() => {
    getBuyerList();
    getLayouts();
  }, []);

  const getBuyerList = async () => {
    const res = await getBuyers();
    setBuyers(res.map((val) => ({ label: val.id, value: val.id })));
  };

  const getLayouts = async () => {
    const res = await getListLayout();
    setLayouts(
      res.map((val) => ({ label: val.layout_id, value: val.layout_id }))
    );
  };

  const onSelect = (value, dataIndex) => {
    const items = data.map((val) => {
      if (val.key === editingKey) {
        val[dataIndex] = value.id;
      }
      return { ...val };
    });
    setData(items);
  };

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
          col.dataIndex === "price" ||
          col.dataIndex === "rong"
            ? "number"
            : col.dataIndex === "ngay_dat_hang" || col.dataIndex === "han_giao"
            ? "dateTime"
            : col.dataIndex === "buyer_id" ||
              col.dataIndex === "layout_id" ||
              col.dataIndex === "layout_type"
            ? "select"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        onChange,
        onSelect,
        options:
          col.dataIndex === "buyer_id"
            ? buyers
            : col.dataIndex === "layout_type"
            ? layoutTypes
            : layouts,
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

  const renderInputData = (item, index) => {
    return (
      <Row key={index} style={{ flexDirection: "row", marginBottom: 8 }}>
        <Col span={12}>
          <div style={{ marginRight: 12 }}>
            <p3 style={{ display: "block" }}>Số lượng</p3>
            <InputNumber
              min={1}
              placeholder="Nhập số lượng"
              onChange={(value) => onChangeQuantity(value, index)}
              style={{ width: "100%" }}
            />
          </div>
        </Col>
        <Col span={12}>
          <div>
            <p3 style={{ display: "block" }}>Ngày giao</p3>
            <DatePicker
              format={COMMON_DATE_TABLE_FORMAT_REQUEST}
              value={item.ngay_giao}
              onChange={(value) =>
                value.isValid() && onChangeDate(value, index)
              }
              style={{ width: "100%" }}
            />
          </div>
        </Col>
      </Row>
    );
  };

  const onChangeDate = (value, index) => {
    const items = inputData.map((val, i) => {
      if (i === index) {
        val.ngay_giao = value;
      }
      return { ...val };
    });
    setInputData(items);
  };

  const onChangeQuantity = (value, index) => {
    const items = inputData.map((val, i) => {
      if (i === index) {
        val.so_luong = value;
      }
      return { ...val };
    });
    setInputData(items);
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
                <Form.Item label="Khách hàng" className="mb-3">
                  <Input
                    allowClear
                    onChange={(e) =>
                      setParams({ ...params, id: e.target.value })
                    }
                    placeholder="Nhập khách hàng"
                  />
                </Form.Item>
                <Form.Item label="MDH" className="mb-3">
                  <Input
                    allowClear
                    onChange={(e) =>
                      setParams({ ...params, code: e.target.value })
                    }
                    placeholder="Nhập MDH"
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
                {/* <Button
                  type="primary"
                  onClick={exportFile}
                  loading={exportLoading}
                >
                  Export Excel
                </Button> */}
                <Button type="primary" onClick={onAdd}>
                  Thêm đơn hàng
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
                />
              </Form>
            </Spin>
          </Card>
        </Col>
      </Row>
      <Modal
        title="Tách đơn hàng"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
      >
        <Button type="primary" onClick={showInput} style={{ marginBottom: 12 }}>
          Thêm dòng
        </Button>
        {inputData.map(renderInputData)}
      </Modal>
    </>
  );
};

export default Orders;
