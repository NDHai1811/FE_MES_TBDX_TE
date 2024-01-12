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
  InputNumber,
  Typography
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useRef, useEffect } from "react";
import {
  createCustomer,
  deleteCustomer,
  exportCustomer,
  getCustomer,
  updateCustomer,
} from "../../../api";
import TemNVL from "../Warehouse/TemNVL";
import { useReactToPrint } from "react-to-print";
import { exportWarehouseTicket } from "../../../api/ui/warehouse";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined, LinkOutlined } from "@ant-design/icons";

const Customer = () => {
  document.title = "Quản lý khách hàng";
  const [listCheck, setListCheck] = useState([]);
  const [openMdl, setOpenMdl] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [params, setParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [openMdlEdit, setOpenMdlEdit] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const onUpdate = async () => {
    const row = await form.validateFields();
    console.log(row);
    const item = data.find((val) => val.key === editingKey);

    if (typeof editingKey === "number") {
      const res = await createCustomer(row);
      if (res) {
        form.resetFields();
        loadListTable(params);
        setEditingKey("");
      }
    } else {
      row.id = editingKey;
      if (listCheck.length > 0) {
        row.ids = listCheck;
      }
      const res = await updateCustomer(row);
      if (res) {
        form.resetFields();
        loadListTable();
        setEditingKey("");
        // if (listCheck.length > 0) {
        //   setListCheck([]);
        // }
      }
    }
  };

  const onDetele = async (record) => {
    await deleteCustomer({ id: record.id });
    loadListTable();
  };
  const columns = [
    {
      title: "Mã KH",
      dataIndex: "id",
      key: "id",
      align: "center",
      editable: true,
    },
    {
      title: "Tên KH",
      dataIndex: "name",
      key: "name",
      align: "center",
      editable: true,
    },
    {
      title: "Tên viết tắt",
      dataIndex: "short_name",
      key: "short_name",
      align: "center",
      editable: true,
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
  const formFields = [
    {
      title: "Mã KH",
      key: "id",

    },
    {
      title: "Tên KH",
      key: "name",
    },
    {
      title: "Tên viết tắt",
      key: "short_name",
    },
  ];

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

  function btn_click() {
    loadListTable();
  }

  const [data, setData] = useState([]);
  const loadListTable = async () => {
    setLoading(true);
    const res = await getCustomer(params);
    setData(
      res.map((e) => {
        return { ...e, key: e.id };
      })
    );
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      loadListTable();
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

  const deleteRecord = async () => {
    if (listCheck.length > 0) {
      const res = await deleteCustomer(listCheck);
      setListCheck([]);
      loadListTable(params);
    } else {
      message.info("Chưa chọn bản ghi cần xóa");
    }
  };
  const componentRef1 = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef1.current,
  });

  const onInsert = () => {
    form.resetFields();
    setData([
      {
        key: data.length + 1,
      },
      ...data,
    ]);
    setEditingKey(data.length + 1);
  };
  const [form] = Form.useForm();
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys)
    },
  };
  const [exportLoading, setExportLoading] = useState(false);
  const [exportLoading1, setExportLoading1] = useState(false);
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
  const mergedColumns = columns.map((col) => {
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
        options: []
      })
    };
  });
  return (
    <>
      {contextHolder}
      <Row style={{ padding: "8px", height: "90vh" }} gutter={[8, 8]}>
        <Col span={4}>
          <Card
            style={{ height: "100%" }}
            bodyStyle={{ paddingInline: 0, paddingTop: 0 }}
          >
            <Divider>Điều kiện truy vấn</Divider>
            <div className="mb-3">
              <Form style={{ margin: "0 15px" }} layout="vertical">
                <Form.Item
                  label={"Mã KH"}
                  className="mb-3"
                >
                  <Input
                    placeholder={"Nhập mã KH"}
                    onChange={(e) =>
                      setParams({ ...params, id: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label={"Tên KH"}
                  className="mb-3"
                >
                  <Input
                    placeholder={"Nhập tên KH"}
                    onChange={(e) =>
                      setParams({ ...params, name: e.target.value })
                    }
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
                onClick={btn_click}
                style={{ width: "80%" }}
              >
                Truy vấn
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={20}>
          <Card
            style={{ height: "100%" }}
            title="Quản lý nguyên vật liệu"
            extra={
              <Space>
                {/* <Upload
                    showUploadList={false}
                    name="file"
                    action={baseURL + "/api/customer/import"}
                    headers={{
                      authorization: "authorization-text",
                    }}
                    onChange={(info) => {
                      setExportLoading1(true);
                      if (info.file.status === "error") {
                        error();
                        setExportLoading1(false);
                      } else if (info.file.status === "done") {
                        if (info.file.response.success === true) {
                          loadListTable();
                          success();
                          setExportLoading1(false);
                        } else {
                          loadListTable();
                          message.error(info.file.response.message);
                          setExportLoading1(false);
                        }
                      }
                    }}
                  >
                    <Button type="primary" loading={exportLoading1}>
                      Upload excel
                    </Button>
                  </Upload> */}
                <Button type="primary" onClick={onInsert}>
                  Thêm
                </Button>
              </Space>
            }
          >
            <Spin spinning={loading}>
              <Form form={form} component={false}>
                <Table
                  bordered
                  columns={mergedColumns}
                  dataSource={data}
                  className="h-100"
                  rowSelection={rowSelection}
                  size="small"
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                />
              </Form>
            </Spin>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Customer;
