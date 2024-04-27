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
  Typography,
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
import { useProfile } from "../../../components/hooks/UserHooks";
import EditableTable from "../../../components/Table/EditableTable";

const Customer = () => {
  document.title = "Quản lý khách hàng";
  const { userProfile } = useProfile();
  const [listCheck, setListCheck] = useState([]);
  const [openMdl, setOpenMdl] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [params, setParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPage, setTotalPage] = useState(1);
  const [editingKey, setEditingKey] = useState("");
  const onUpdate = async (values) => {
    const res = await updateCustomer(values);
    btn_click(page, pageSize);
  };
  const onCreate = async (values) => {
    const res = await createCustomer(values);
    btn_click();
  };

  const onDetele = async (record) => {
    await deleteCustomer({ id: record.id });
    loadListTable();
  };
  const columns = [
    {
      title: "Tên viết tắt",
      dataIndex: "short_name",
      key: "short_name",
      align: "center",
      editable: true,
    },
    {
      title: "Mã KH",
      dataIndex: "customer_id",
      key: "customer_id",
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

  function btn_click(page = 1, pageSize = 20) {
    setPage(page);
    setPageSize(pageSize)
    loadListTable({ ...params, page, pageSize });
  }

  const [data, setData] = useState([]);
  const loadListTable = async (params) => {
    setLoading(true);
    const res = await getCustomer(params);
    setData(
      res.data.map((e) => {
        return { ...e, key: e.id };
      })
    );
    setTotalPage(res.totalPage)
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
  const onDelete = async (ids) => {
    const res = await deleteCustomer(ids);
    setListCheck([]);
    btn_click(page, pageSize);
  };
  const tableRef = useRef();
  const onInsert = () => {
    tableRef.current.create();
  };
  const [form] = Form.useForm();
  const rowSelection = {
    selectedRowKeys: listCheck,
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys);
    },
  };
  const [exportLoading, setExportLoading] = useState(false);
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportCustomer(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
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
  return (
    <>
      {contextHolder}
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Card style={{ height: "100%" }} bodyStyle={{ padding: 0 }} className="custom-card" actions={[
              <Button
                type="primary"
                onClick={() => btn_click()}
                style={{ width: "80%" }}
              >
                Tìm kiếm
              </Button>
            ]}>
              <Divider>Điều kiện truy vấn</Divider>
              <div className="mb-3">
                <Form style={{ margin: "0 15px" }} layout="vertical" onFinish={() => btn_click()}>
                  <Form.Item label={"Mã KH"} className="mb-3">
                    <Input
                      placeholder={"Nhập mã KH"}
                      onChange={(e) =>
                        setParams({ ...params, id: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label={"Tên KH"} className="mb-3">
                    <Input
                      placeholder={"Nhập tên KH"}
                      onChange={(e) =>
                        setParams({ ...params, name: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label={"Tên KH rút gọn"} className="mb-3">
                    <Input
                      placeholder={"Nhập tên KH rút gọn"}
                      onChange={(e) =>
                        setParams({ ...params, short_name: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Button hidden htmlType="submit"></Button>
                </Form>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Card
            style={{ height: "100%" }}
            title="Quản lý khách hàng"
            extra={
              <Space>
                <Upload
                  showUploadList={false}
                  name="files"
                  action={baseURL + "/api/customer/import"}
                  headers={{
                    authorization: "Bearer " + userProfile.token,
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
                <Button
                  type="primary"
                  onClick={exportFile}
                  loading={exportLoading}
                >
                  Export Excel
                </Button>
                <Button type="primary" onClick={onInsert}>
                  Thêm
                </Button>
                <Popconfirm
                  title="Xoá bản ghi"
                  description={
                    "Bạn có chắc xoá " + listCheck.length + " bản ghi đã chọn?"
                  }
                  onConfirm={() => onDelete(data.reduce(function (filtered, option, index) {
                    if (listCheck.includes(index)) {
                      var someNewValue = option.id
                      filtered.push(someNewValue);
                    }
                    return filtered;
                  }, []))}
                  okText="Có"
                  cancelText="Không"
                  placement="bottomRight"
                >
                  <Button type="primary" disabled={listCheck.length <= 0}>
                    Xoá
                  </Button>
                </Popconfirm>
              </Space>
            }
            className="custom-card scroll"
          >
            <EditableTable
              bordered
              loading={loading}
              columns={columns}
              dataSource={data}
              className="h-100"
              rowSelection={rowSelection}
              size="small"
              ref={tableRef}
              pagination={{
                current: page,
                size: "small",
                total: totalPage,
                pageSize: pageSize,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                  btn_click(page, pageSize)
                },
              }}
              onUpdate={onUpdate}
              onCreate={onCreate}
              setDataSource={setData}
              onDelete={(record) => onDelete([record.id])}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Customer;
