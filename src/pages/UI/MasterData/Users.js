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
  Badge,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useRef, useEffect } from "react";
import {
  createUsers,
  deleteUsers,
  disableUsers,
  enableUsers,
  exportUsers,
  getDepartments,
  getUserRoles,
  getUsers,
  updateUsers,
} from "../../../api";
import { useProfile } from "../../../components/hooks/UserHooks";
import { CheckSquareTwoTone, DeleteOutlined, EditOutlined, StopOutlined, SyncOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

const Users = () => {
  document.title = "Quản lý tài khoản";
  const [listCheck, setListCheck] = useState([]);
  const [openMdl, setOpenMdl] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [params, setParams] = useState({});
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState();
  const col_detailTable = [
    {
      title: "Tài khoản",
      dataIndex: "username",
      key: "username",
      align: "center",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Bộ phận",
      dataIndex: "department_name",
      key: "department_name",
      align: "center",
    },
    {
      title: "Phân quyền",
      dataIndex: "roles",
      key: "roles",
      align: "center",
      render: (value) => (
        <Space wrap style={{ justifyContent: "center" }}>
          {(value ?? []).map((e) => (
            <Badge count={e?.name}></Badge>
          ))}
        </Space>
      ),
    },
    {
      title: "User chức năng",
      dataIndex: "function_user",
      key: "function_user",
      align: "center",
      render: (value) => value ? <CheckSquareTwoTone style={{ fontSize: 18 }} /> : null
    },
    {
      title: "Số lần truy cập trong ngày",
      dataIndex: "login_times_in_day",
      key: "login_times_in_day",
      align: "center",
    },
    {
      title: "Thời gian sử dụng trong ngày (phút)",
      dataIndex: "usage_time",
      key: "usage_time",
      align: "center",
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (value, record) => (
        <Space size="middle">
          <EditOutlined
            className="edit-btn"
            onClick={() => editRecord(record)}
          />
          {record?.deleted_at ? <SyncOutlined className="check-btn" onClick={() => enableRecord(record)} title="Khôi phục" /> : <StopOutlined className="delete-btn" onClick={() => disableRecord(record)} title="Vô hiệu" />}
          <Popconfirm
            title="Xoá tài khoản vĩnh viễn"
            description="Bạn có chắc xoá tài khoản này?"
            onConfirm={() => deleteRecord(record)}
            placement="topRight"
            okText="Có"
            cancelText="Không"
          >
            <DeleteOutlined className="delete-btn" title="Xoá" />
          </Popconfirm>
        </Space>
      ),
    }
  ];

  function btn_click() {
    loadListTable(params);
  }

  const [data, setData] = useState([]);
  const loadListTable = async (params) => {
    setLoading(true);
    const res = await getUsers({ ...params, all_user: true });
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
      var res = await getUserRoles();
      setRoles(res);
      var departmentRequest = await getDepartments();
      setDepartments(departmentRequest.map(e => ({ ...e, value: e.id, label: e.name })));
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
    console.log(values);
    if (isEdit) {
      const res = await updateUsers(values);
      console.log(res);
      if (res) {
        form.resetFields();
        setOpenMdl(false);
        loadListTable(params);
      }
    } else {
      const res = await createUsers(values);
      console.log(res);
      if (res) {
        form.resetFields();
        setOpenMdl(false);
        loadListTable(params);
      }
    }
    setListCheck([])
  };

  const deleteRecord = async (record) => {
    const res = await deleteUsers({ id: record?.id });
    setListCheck([]);
    loadListTable(params);
  };

  const disableRecord = async (record) => {
    const res = await disableUsers({ id: record?.id });
    setListCheck([]);
    loadListTable(params);
  };

  const enableRecord = async (record) => {
    const res = await enableUsers({ id: record?.id });
    setListCheck([]);
    loadListTable(params);
  };

  const editRecord = (record) => {
    form.setFieldsValue({ ...record, roles: record?.roles.map((e) => e.id) });
    setOpenMdl(true);
    setIsEdit(true);
  };
  const insertRecord = () => {
    setIsEdit(false);
    form.resetFields();
    setOpenMdl(true);
  };
  const [loadingExport, setLoadingExport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportUsers(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
  const rowSelection = {
    type: 'radio',
    selectedRowKeys: listCheck,
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys);
    },
  };
  const { userProfile } = useProfile();
  return (
    <>
      {contextHolder}
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Card style={{ height: "100%" }} bodyStyle={{ padding: 0 }} className="custom-card" actions={[
              <Button
                type="primary"
                onClick={btn_click}
                style={{ width: "80%" }}
              >
                Tìm kiếm
              </Button>
            ]}>
              <Divider>Tìm kiếm</Divider>
              <div className="mb-3">
                <Form
                  style={{ margin: "0 15px" }}
                  layout="vertical"
                  onFinish={btn_click}
                >
                  <Form.Item label="Tên" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, name: e.target.value })
                      }
                      placeholder="Nhập tên nhân viên"
                    />
                  </Form.Item>
                  <Form.Item label="Mã nhân viên" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, username: e.target.value })
                      }
                      placeholder="Nhập mã nhân viên"
                    />
                  </Form.Item>
                  <Form.Item label="Bộ phận" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, department_name: e.target.value })
                      }
                      placeholder="Nhập bộ phận"
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
            title="Quản lý tài khoản"
            className="custom-card scroll"
            extra={
              <Space>
                <Upload
                  showUploadList={false}
                  name="files"
                  action={baseURL + "/api/users/import"}
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
                {/* <Button
                  type="primary"
                  onClick={editRecord}
                  disabled={listCheck.length <= 0}
                >
                  Edit
                </Button> */}
                <Button type="primary" onClick={insertRecord}>
                  Insert
                </Button>
                {/* <Popconfirm
                  title="Xoá bản ghi"
                  description={
                    "Bạn có chắc xoá " + listCheck.length + " bản ghi đã chọn?"
                  }
                  onConfirm={() => deleteRecord()}
                  okText="Có"
                  cancelText="Không"
                  placement="bottomRight"
                >
                  <Button type="primary" disabled={listCheck.length <= 0}>
                    Delete
                  </Button>
                </Popconfirm> */}
              </Space>
            }
          >
            <Spin spinning={loading}>
              <Table
                size="small"
                bordered
                pagination={true}
                scroll={{
                  x: "100%",
                  y: 'calc(100vh - 290px)',
                }}
                columns={col_detailTable}
                dataSource={data}
                // rowSelection={rowSelection}
              />
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
            <Col span={0}>
              <Form.Item
                name={"id"}
                className="mb-3"
                hidden
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={"username"}
                className="mb-3"
                label={"Mã nhân viên"}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={"name"}
                className="mb-3"
                label={"Họ và tên"}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={"phone_number"}
                className="mb-3"
                label={"SĐT"}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={"department_id"}
                className="mb-3"
                label={"Bộ phận"}
              >
                <Select
                  options={departments}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={"roles"}
                className="mb-3"
                label={"Phân quyền"}
              >
                <Select
                  mode="multiple"
                  options={roles}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                valuePropName="checked"
                name={"function_user"}
                className="mb-3"
                label={"User chức năng"}
              >
                <Checkbox>Xác nhận</Checkbox>
              </Form.Item>
            </Col>
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

export default withRouter(Users);
