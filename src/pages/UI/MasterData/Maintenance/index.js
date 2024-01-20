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
} from "antd";
import { baseURL } from "../../../../config";
import React, { useState, useRef, useEffect } from "react";
import {
  createMaintenance,
  deleteMaintenance,
  exportMaintenance,
  getListMachine,
  getMaintenance,
  updateMaintenance,
} from "../../../../api";
import { useHistory, useParams } from "react-router-dom";

const Maintenance = () => {
  document.title = "Bảo trì bảo dưỡng";
  const history = useHistory();
  const [listCheck, setListCheck] = useState([]);
  const [openMdl, setOpenMdl] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [params, setParams] = useState({});
  const col_detailTable = [
    {
      title: "Tên kế hoạch",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Thiết bị",
      dataIndex: "machine",
      key: "machine",
      align: "center",
      render: (value) => value?.name,
    },
  ];
  function btn_click() {
    loadListTable(params);
  }

  const [data, setData] = useState([]);
  const loadListTable = async (params) => {
    setLoading(true);
    const res = await getMaintenance(params);
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

  const deleteRecord = async () => {
    if (listCheck.length > 0) {
      const res = await deleteMaintenance(listCheck);
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
      history.push("maintenance/edit/" + listCheck[0]);
    }
  };
  const insertRecord = () => {
    history.push("maintenance/create");
  };
  const [loadingExport, setLoadingExport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportMaintenance(params);
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
        <Col span={4}>
          <div className="slide-bar">
            <Card style={{ height: "100%" }} bodyStyle={{ padding: 0 }}>
              <Divider>Tìm kiếm</Divider>
              <div className="mb-3">
                <Form
                  style={{ margin: "0 15px" }}
                  layout="vertical"
                  onFinish={btn_click}
                >
                  <Form.Item label="Mã" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, id: e.target.value })
                      }
                      placeholder="Nhập mã"
                    />
                  </Form.Item>
                  <Form.Item label="Tên" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, name: e.target.value })
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
          </div>
        </Col>
        <Col span={20}>
          <Card
            style={{ height: "100%" }}
            title="Bảo trì bảo dưỡng"
            extra={
              <Space>
                {/* <Upload
                                showUploadList={false}
                                name='files'
                                action={baseURL + "/api/jig/import"}
                                headers={{
                                    authorization: 'authorization-text',
                                }}
                                onChange={(info) => {
                                    setLoadingExport(true);
                                    if (info.file.status === 'error') {
                                            setLoadingExport(false);
                                            error()
                                    } else if (info.file.status === 'done') {
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
                                <Button style={{ marginLeft: '15px' }} type="primary" loading={loadingExport}>
                                    Upload Excel
                                </Button>
                            </Upload> */}
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
                pagination={false}
                scroll={{
                  x: "100%",
                  y: "80vh",
                }}
                columns={col_detailTable}
                dataSource={data}
                rowSelection={rowSelection}
              />
            </Spin>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Maintenance;
