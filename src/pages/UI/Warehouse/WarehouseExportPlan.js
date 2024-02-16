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
  Select,
  InputNumber,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useEffect } from "react";
import {
  deleteBuyers,
  getUsers,
  getVehicles,
} from "../../../api";
import "../style.scss";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { getWarehouseFGExportList, updateWarehouseFGExport } from "../../../api/ui/warehouse";
import { useProfile } from "../../../components/hooks/UserHooks";

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
          popupMatchSelectWidth={options.length > 0 ? 200 : 0}
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
  const [listVehicles, setListVehicles] = useState([]);
  const [listUsers, setListUsers] = useState([]);
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
      render: (value)=>{
        const item = listVehicles.find(e=>e.user1 === value);
        return item?.driver?.name
      },
      width: '15%'
    },
    {
      title: "Số xe",
      dataIndex: "so_xe",
      key: "so_xe",
      align: "center",
      editable: hasEditColumn("so_xe"),
      width: '15%'
    },
    {
      title: "Người xuất",
      dataIndex: "nguoi_xuat",
      key: "nguoi_xuat",
      align: "center",
      editable: hasEditColumn("nguoi_xuat"),
      render: (value)=>{
        const item = listUsers.find(e=>e.id == value);
        return item?.name
      },
      width: '15%'
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
        var res = await updateWarehouseFGExport(row);
        if(res){
          loadListTable();
        }
        setEditingKey("");
      } else {
        // await createBuyers(row);
        const items = [row, ...data.filter((val) => val.key !== key)];
        if(res){
          loadListTable();
        }
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
        inputType:
          col.dataIndex === "tai_xe" ||
            col.dataIndex === "so_xe" ||
            col.dataIndex === "nguoi_xuat"
            ? "select"
            : "text",
        options: options(col.dataIndex),
        onSelect:
          col.dataIndex === "tai_xe" ||
            col.dataIndex === "so_xe"
            ? onSelectDriverVehicle
            : onSelect,
      }),
    };
  });
  const options = (dataIndex) => {
    let filteredOptions = [];
    switch (dataIndex) {
      case "tai_xe":
        filteredOptions = listVehicles.map(e => ({ ...e, value: e?.user1, label: e?.driver?.name }));
        break;
      case "so_xe":
        filteredOptions = listVehicles.map(e => ({ ...e, value: e?.id, label: e?.id }));
        break;
      case "nguoi_xuat":
        filteredOptions = listUsers.map(e => ({ ...e, value: e?.id, label: e?.name }));
        break;
      default:
        break;
    }
    return filteredOptions;
  };

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    (async () => {
      loadListTable(params);
      const res1 = await getVehicles();
      setListVehicles(res1);
      const res2 = await getUsers();
      setListUsers(res2);
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

  const exportFile = async () => {
    // setExportLoading(true);
    // const res = await exportOrders(params);
    // if (res.success) {
    //   window.location.href = baseURL + res.data;
    // }
    // setExportLoading(false);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys);
    },
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
  const onSelectDriverVehicle = (value, dataIndex) => {
    const items = data.map((e) => {
      if (e.key === editingKey) {
        var target = null;
        if (dataIndex === 'tai_xe') {
          target = listVehicles.find(e=>e.user1 === value);
        } else {
          target = listVehicles.find(e=>e.id === value);
        }
        form.setFieldsValue({ ...e, so_xe: target?.id, tai_xe: target?.user1})
        return { ...e, so_xe: target?.id, tai_xe: target?.user1}
      } else {
        return e;
      }
    });
    setData(items)
  }
  const { userProfile } = useProfile();
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
          </div>
        </Col>
        <Col span={20}>
          <Card
            style={{ height: "100%" }}
            title="Kế hoạch xuất kho"
            bodyStyle={{ paddingBottom: 0 }}
            className="custom-card scroll"
            extra={
              <Space>
                <Upload
                  showUploadList={false}
                  name="files"
                  action={baseURL + "/api/upload-ke-hoach-xuat-kho"}
                  headers={{
                    authorization: "Bearer " + userProfile.token,
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
                    y: window.innerHeight * 0.55,
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
