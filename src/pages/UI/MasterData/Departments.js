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
  createDepaexportDepartments,
  deleteDepaexportDepartments,
  exportDepartments,
  getDepaexportDepartments,
  updateDepaexportDepartments,
  getRolePermissions,
  getDepaexportDepartmentsTree,
  getDepaex,
  exportDepartmentsportDepartmentsList,
  deleteDepartments,
  createDepartments,
  updateDepartments,
  getDepartments,
} from "../../../api";
import { useProfile } from "../../../components/hooks/UserHooks";

const Departments = () => {
  document.title = "Quản lý bộ phận";
  const [listCheck, setListCheck] = useState([]);
  const [openMdl, setOpenMdl] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [params, setParams] = useState({});
  const [permissions, setPermissions] = useState([]);
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const col_detailTable = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center",
      width: 50,
      render: (_, record, index) => index + 1
    },
    {
      title: "Tên bộ phận",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 170
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
      title: "Thuộc bộ phận",
      key: "parent_id",
      select: {
        options: options.map((e) => ({ value: e.id, label: e.name })),
      },
    },
    {
      title: "Quyền",
      key: "permissions",
      select: {
        mode: "multiple",
        options: permissions,
      },
    },
  ];

  function btn_click() {
    loadListTable(params);
  }

  const loadListTable = async (params) => {
    setLoading(true);
    var res = await getDepartments(params)
    setData(res);
    setOptions(res);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      loadListTable(params);
      var res = await getRolePermissions();
      setPermissions(res);
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
      const res = await updateDepartments(values);
      console.log(res);
      if (res) {
        form.resetFields();
        setOpenMdl(false);
        loadListTable(params);
      }
    } else {
      const res = await createDepartments(values);
      console.log(res);
      if (res) {
        form.resetFields();
        setOpenMdl(false);
        loadListTable(params);
      }
    }
    setListCheck([]);
  };

  const deleteRecord = async () => {
    if (listCheck.length > 0) {
      const res = await deleteDepartments(listCheck);
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
      const result = data.find(e => e.id === listCheck[0]);
      console.log(result);
      form.setFieldsValue({
        ...result,
        permissions: (result?.permissions ?? []).map((e) => e.id),
      });
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
    const res = await exportDepartments(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
  const rowSelection = {
    selectedRowKeys: listCheck,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRowKeys, selectedRows);
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
                      placeholder="Nhập tên bộ phận"
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
            title="Quản lý bộ phận"
            className="custom-card scroll"
            extra={
              <Space>
                {/* <Upload
                  showUploadList={false}
                  name="files"
                  action={baseURL + "/api/DepaexportDepartments/import"}
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
                </Button> */}
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
                pagination={false}
                scroll={{
                  x: "100%",
                  y: 'calc(100vh - 290px)',
                }}
                rowKey={"id"}
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
        width={400}
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
                hidden
                name={"id"}
                className="mb-3"
              >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name={"name"}
                className="mb-3"
                label={"Tên bộ phận"}
                rules={[{ required: true }]}
              >
                <Input></Input>
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

export default Departments;
