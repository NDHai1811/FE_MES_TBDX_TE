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
  createMaterial,
  deleteMaterials,
  exportMaterials,
  getMaterials,
  updateMaterial,
} from "../../../api";
import TemNVL from "../Warehouse/TemNVL";
import { useReactToPrint } from "react-to-print";
import { exportWarehouseTicket } from "../../../api/ui/warehouse";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined, LinkOutlined } from "@ant-design/icons";

const Materials = () => {
  document.title = "Quản lý nguyên vật liệu";
  const [listCheck, setListCheck] = useState([]);
  const [openMdl, setOpenMdl] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [params, setParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [openMdlEdit, setOpenMdlEdit] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const onUpdate = async () => {
    const row = await form.validateFields();
    const item = data.find((val) => val.key === editingKey);

    if (typeof editingKey === "number") {
      const res = await createMaterial(row);
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
      const res = await updateMaterial(row);
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
    await deleteMaterials({ id: record.id });
    loadListTable();
  };
  const columns = [
    {
      title: "Mã cuộn TBDX",
      dataIndex: "id",
      key: "id",
      align: "center",
      editable: true,
    },
    {
      title: "Mã vật tư",
      dataIndex: "ma_vat_tu",
      key: "ma_vat_tu",
      align: "center",
      editable: true,
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "ten_ncc",
      key: "ten_ncc",
      align: "center",
    },
    {
      title: "Mã cuộn nhà cung cấp",
      dataIndex: "ma_cuon_ncc",
      key: "ma_cuon_ncc",
      align: "center",
      editable: true,
    },
    {
      title: "Số kg",
      dataIndex: "so_kg",
      key: "so_kg",
      align: "center",
      editable: true,
    },
    {
      title: "Loại giấy",
      dataIndex: "loai_giay",
      key: "loai_giay",
      align: "center",
      editable: true,
    },
    {
      title: "Khổ giấy",
      dataIndex: "kho_giay",
      key: "kho_giay",
      align: "center",
      editable: true,
    },
    {
      title: "Định lượng",
      dataIndex: "dinh_luong",
      key: "dinh_luong",
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
      title: "Mã cuộn TBDX",
      key: "material_id",

    },
    {
      title: "Mã vật tư",
      key: "ma_vat_tu",
    },
    {
      title: "Tên nhà cung cấp",
      key: "ten_ncc",
    },
    {
      title: "Mã cuộn nhà cung cấp",
      key: "ma_cuon_ncc",
    },
    {
      title: "Số kg",
      key: "so_kg",
    },
    {
      title: "Loại giấy",
      key: "loai_giay",
    },
    {
      title: "Khổ giấy",
      key: "kho_giay",
    },
    {
      title: "Định lượng",
      key: "dinh_luong",
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
    const res = await getMaterials(params);
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
      const res = await deleteMaterials(listCheck);
      setListCheck([]);
      loadListTable(params);
    } else {
      message.info("Chưa chọn bản ghi cần xóa");
    }
  };
  const [titleMdlEdit, setTitleMdlEdit] = useState("Cập nhật");
  const onEdit = () => {
    if (listCheck.length > 1) {
      message.info("Chỉ chọn 1 bản ghi để chỉnh sửa");
    } else if (listCheck.length == 0) {
      message.info("Chưa chọn bản ghi cần chỉnh sửa");
    } else {
      const result = data.find((record) => record.id === listCheck[0]);
      form.setFieldsValue(result);
      setOpenMdlEdit(true);
      setTitleMdlEdit("Cập nhật");
    }
  };
  const componentRef1 = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef1.current,
  });

  const onInsert = () => {
    setTitleMdlEdit("Thêm mới");
    form.resetFields();
    setOpenMdlEdit(true);
  };
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    // if (values.id) {
    //   const res = await updateWarehouseImport(values);
    // } else {
    //   const res = await createWarehouseImport(values);
    // }
    setOpenMdlEdit(false);
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys)
    },
  };
  const [exportLoading, setExportLoading] = useState(false);
  const [exportLoading1, setExportLoading1] = useState(false);
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportWarehouseTicket({ ...params, material_ids: listCheck });
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
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
                <Form.Item
                  label={"Mã cuộn TBDX"}
                  className="mb-3"
                >
                  <Input
                    placeholder={"Nhập mã cuộn TBDX"}
                  />
                </Form.Item>
                <Form.Item
                  label={"Mã cuộn NCC"}
                  className="mb-3"
                >
                  <Input
                    placeholder={"Nhập mã cuộn NCC"}
                  />
                </Form.Item>
                <Form.Item
                  label={"Loại giấy"}
                  className="mb-3"
                >
                  <Input
                    placeholder={"Nhập loại giấy"}
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
                <Button
                  type="primary"
                  onClick={exportFile}
                  loading={exportLoading}
                >
                  Xuất phiếu nhập kho
                </Button>
                <Upload
                  showUploadList={false}
                  name="file"
                  action={baseURL + "/api/upload-nhap-kho-nvl"}
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
                </Upload>
                <Button type="primary" onClick={onInsert}>
                  Thêm
                </Button>
                <Button type="primary" onClick={handlePrint}>
                  In tem NVL
                </Button>
                <div className="report-history-invoice">
                  <TemNVL
                    listCheck={data.filter(e => listCheck.includes(e.id)).map(e => ({ ...e, material_id: e.id }))}
                    ref={componentRef1}
                  />
                </div>
              </Space>
            }
          >
            <Spin spinning={loading}>
              <Form form={form}>
              <Table
                bordered
                columns={mergedColumns}
                dataSource={data}
                className="h-100"
                // rowSelection={rowSelection}
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

export default Materials;
