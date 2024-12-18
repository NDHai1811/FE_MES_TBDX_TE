import {
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
  Modal,
  Spin,
  Popconfirm,
  Space,
  Badge,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useEffect, useRef } from "react";
import {
  createPermissions,
  createRoles,
  deletePermissions,
  deleteRoles,
  exportPermissions,
  exportRoles,
  getPermissions,
  getRolesList,
  updatePermissions,
  updateRoles,
} from "../../../api";
import { authProtectedRoutes } from "../../../routes/allRoutes";
import { useProfile } from "../../../components/hooks/UserHooks";
import { PlusOutlined } from "@ant-design/icons";

const Permissions = () => {
  document.title = "Quản lý phân quyền";
  const { userProfile } = useProfile();
  const [listCheck, setListCheck] = useState([]);
  const [openMdl, setOpenMdl] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [params, setParams] = useState({});
  const col_detailTable = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center",
      width: 50,
      render: (value, record, index) => index + 1,
    },
    {
      title: "Tên quyền",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 170
    },
    {
      title: "Chức năng",
      dataIndex: "permissions",
      key: "permissions",
      align: "center",
      render: (value) => (
        <Space wrap style={{ justifyContent: "center" }}>
          {(value ?? []).map((e) => (
            <Badge count={e?.name}></Badge>
          ))}
        </Space>
      ),
    },
  ];
  const formFields = [
    {
      key: "id",
      hidden: true,
    },
    {
      title: "Tên",
      key: "name",
      required: true,
    },
    {
      title: "Slug",
      key: "slug",
    },
  ];

  function btn_click() {
    loadListTable(params);
  }

  const [data, setData] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const loadListTable = async (params) => {
    setLoading(true);
    const res = await getRolesList(params);
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
      fetchPermission();
    })();
  }, []);

  const fetchPermission = async () => {
    var res = await getPermissions();
    setPermissions(res.map(e => ({ ...e, value: e.id, label: e.name })));
  }

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
      const res = await updateRoles(values);
      console.log(res);
      if (res) {
        form.resetFields();
        setOpenMdl(false);
        loadListTable(params);
      }
    } else {
      const res = await createRoles(values);
      console.log(res);
      if (res) {
        form.resetFields();
        setOpenMdl(false);
        loadListTable(params);
      }
    }
    setListCheck([])
  };

  const deleteRecord = async () => {
    if (listCheck.length > 0) {
      const res = await deleteRoles(listCheck);
      setListCheck([]);
      loadListTable(params);
    } else {
      message.info("Chưa chọn bản ghi cần xóa");
    }
  };
  const editRecord = () => {
    setIsEdit(true);
    if (listCheck.length !== 1) {
      message.info("Chọn 1 bản ghi để chỉnh sửa");
    } else {
      const result = data.find((record) => record.id === listCheck[0]);
      form.setFieldsValue({ ...result, permissions: (result?.permissions??[]).map(e=>e.id) });
      setOpenMdl(true);
    }
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
    const res = await exportRoles(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
  const rowSelection = {
    selectedRowKeys: listCheck,
    type: 'radio',
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys);
    },
  };
  const [name, setName] = useState('');
  const inputRef = useRef(null);
  const onNameChange = (event) => {
    setName(event.target.value);
  };
  const addPermisson = async (e) => {
    e.preventDefault();
    var res = await createPermissions({ name });
    fetchPermission();
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
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
                  <Form.Item label="Tên quyền" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, name: e.target.value })
                      }
                      placeholder="Nhập tên quyền"
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
            title="Quản lý phân quyền"
            className="custom-card scroll"
            extra={
              <Space>
                <Upload
                  showUploadList={false}
                  name="files"
                  action={baseURL + "/api/roles/import"}
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
                <Button
                  type="primary"
                  onClick={editRecord}
                  disabled={listCheck.length <= 0}
                >
                  Edit
                </Button>
                <Button type="primary" onClick={insertRecord}>
                  Insert
                </Button>
                <Popconfirm
                  title="Xoá bản ghi"
                  description={
                    "Bạn có chắc xoá " + listCheck.length + " bản ghi đã chọn?"
                  }
                  onConfirm={deleteRecord}
                  okText="Có"
                  cancelText="Không"
                  placement="bottomRight"
                >
                  <Button type="primary" disabled={listCheck.length <= 0}>
                    Delete
                  </Button>
                </Popconfirm>
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
                rowSelection={rowSelection}
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
          <Row gutter={[16, 8]}>
            <Col span={0}>
              <Form.Item
                hidden
                name={"id"}
                className="mb-3"
              >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={"name"}
                className="mb-3"
                label={"Tên quyền"}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item
                name={"permissions"}
                className="mb-3"
                label={"Chức năng"}
              >
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  options={permissions}
                  popupMatchSelectWidth={permissions.length ? 400 : true}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <Space style={{ padding: '0 8px 4px' }}>
                        <Input
                          placeholder="Thêm chức năng"
                          ref={inputRef}
                          value={name}
                          onChange={onNameChange}
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                        <Button type="text" icon={<PlusOutlined />} onClick={addPermisson}>Thêm</Button>
                      </Space>
                    </>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit">
              Lưu lại
            </Button>
          </Form.Item>
        </Form>
      </Modal >
    </>
  );
};

export default Permissions;
