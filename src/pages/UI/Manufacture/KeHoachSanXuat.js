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
  Space,
  Modal,
  Spin,
  Tree,
  InputNumber,
  Popconfirm,
  Typography,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useEffect } from "react";
import { getCustomers, getLoSanXuat, getOrders } from "../../../api/ui/main";
import {
  deleteRecordProductPlan,
  exportKHSX,
  getListProductPlan,
  storeProductPlan,
  updateProductPlan,
} from "../../../api/ui/manufacture";
import {
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const KeHoachSanXuat = () => {
  document.title = "Kế hoạch sản xuất";
  const history = useHistory();
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
      render: (value, item, index) => index + 1,
      align: "center",
      width: '2%'
    },
    {
      title: "Thứ tự ưu tiên",
      dataIndex: "thu_tu_uu_tien",
      key: "thu_tu_uu_tien",
      align: "center",
      width: '2%',
      editable: true
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
      width: '5%'
    },
    {
      title: "Khách hàng",
      dataIndex: "khach_hang",
      key: "khach_hang",
      align: "center",
      width: '10%'
    },
    {
      title: "MDH",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
    },
    {
      title: "L",
      dataIndex: "dai",
      key: "dai",
      align: "center",
    },
    {
      title: "W",
      dataIndex: "rong",
      key: "rong",
      align: "center",
    },
    {
      title: "H",
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
      width: '5%'
    },
    {
      title: "Ngày giao hàng",
      dataIndex: "ngay_giao_hang",
      key: "ngay_giao_hang",
      align: "center",
      width: '5%'
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
    {
      title: "Tác vụ",
      dataIndex: "action",
      key: "action",
      checked: true,
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

  function btn_click() {
    loadListTable();
  }

  useEffect(() => {
    btn_click();
  }, [])

  useEffect(() => {
    (async () => {
      const res1 = await getCustomers();
      setCustomers(res1.data.map((e) => ({ label: e.name, value: e.id })));
      const res2 = await getOrders();
      setOrders(res2.data.map((e) => ({ label: e.id, value: e.id })))
      const res3 = await getLoSanXuat();
      setLoSX(res3.data.map((e) => ({ label: e, value: e })))
    })();
  }, []);

  const [data, setData] = useState([]);
  const loadListTable = async () => {
    setLoading(true);
    const res = await getListProductPlan(params);
    setData(res.map(e=>({...e, key: e.id})));
    setLoading(false);
  };

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

  const onUpdate = async () => {
    const row = await form.validateFields();
    const item = data.find((val) => val.key === editingKey);
    const res = await updateProductPlan({...item, ...row});
    if (res) {
      form.resetFields();
      loadListTable();
      setEditingKey("");
    }
  };
  const onDetele = async (record) => {
    await deleteRecordProductPlan({ id: record.id });
    loadListTable();
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
  const onCheck = (selectedKeys, e) => {
    const filteredKeys = selectedKeys.filter(key => !itemsMenu.some(e => e.key === key));
    setParams({ ...params, machine: filteredKeys });
  }

  const [exportLoading, setExportLoading] = useState(false);
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportKHSX(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
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
            onChange={(value) => onSelect(value, dataIndex)}
            bordered
            showSearch
          />
        );
        break;
      default:
        inputNode = <Input />;
    }
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
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const isEditing = (record) => record.key === editingKey;
  const [editingKey, setEditingKey] = useState("");
  const mergedColumns = col_detailTable.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        onChange,
        onSelect,
        options: options(col.dataIndex)
      })
    };
  });
  const options = (dataIndex) => {
    var record = data.find(e => e.id === editingKey);
    let filteredOptions = [];
    return filteredOptions;
  }
  const onChange = (value, dataIndex) => {
    const items = data.map((val) => {
      if (val.key === editingKey) {
        val[dataIndex] = value;
      }
      return { ...val };
    });
    value.isValid() && setData(items);
  };
  const onSelect = (value, dataIndex) => {
    const items = data.map((val) => {
      if (val.key === editingKey) {
        val[dataIndex] = value;
      }
      return { ...val };
    });
    setData(items);
  };
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
                      setParams({ ...params, start_date: value })
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
                <Button
                  type="primary"
                  onClick={exportFile}
                  loading={exportLoading}
                >
                  Xuất file KHSX
                </Button>
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
                        loadListTable();
                        message.error(info.file.response.message);
                        setLoadingExport(false);
                      }
                    }
                  }}
                >
                  <Button
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
              <Form form={form} component={false}>
              <Table
                size="small"
                bordered
                pagination={false}
                scroll={{
                  x: "200vw",
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
              />
              </Form>
            </Spin>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default KeHoachSanXuat;
