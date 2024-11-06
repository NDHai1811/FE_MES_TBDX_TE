import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  message
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  deleteMachines,
  exportMachines
} from "../../../api";
import { deleteVOC, getVOC, updateVOC } from "../../../api/oi/voc";
import { useProfile } from "../../../components/hooks/UserHooks";
import { baseURL } from "../../../config";

const VOCRegister = () => {
  document.title = "VOC";
  const [listCheck, setListCheck] = useState([]);
  const [openMdl, setOpenMdl] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [dataRecord, setDataRecord] = useState();
  const [form] = Form.useForm();
  const [params, setParams] = useState({});
  const col_detailTable = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "left",
      render: (value, item, index) => index + 1,
      width: 60,
      fixed: "left",
    },
    {
      title: "VOC.No",
      dataIndex: "no",
      key: "no",
      align: "left",
      fixed: "left",
      width: 110,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      align: "left",
      width: 200,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      align: "left",
      width: 200,
    },
    {
      title: "Đề xuất",
      dataIndex: "solution",
      key: "solution",
      align: "left",
      width: 200,
    },
    {
      title: "Người ý kiến",
      dataIndex: "registered_by",
      key: "registered_by",
      align: "left",
      width: 120,
      render: (_, record) => record?.register?.name,
    },
    {
      title: "Ngày ý kiến",
      dataIndex: "registered_at",
      key: "registered_at",
      align: "left",
      width: 120,
      render: (value) => value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '',
    },
    {
      title: "Nội dung phản hồi",
      dataIndex: "reply",
      key: "reply",
      align: "left",
      width: 200,
    },
    {
      title: "Người phản hồi",
      dataIndex: "replied_by",
      key: "replied_by",
      align: "left",
      width: 120,
      render: (_, record) => record?.replier?.name,
    },
    {
      title: "Ngày phản hồi",
      dataIndex: "replied_at",
      key: "replied_at",
      align: "left",
      width: 120,
      render: (value) => value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '',
    },
    {
      title: "Kết quả phản hồi",
      dataIndex: "status",
      key: "status",
      align: "center",
      fixed: "right",
      width: 110,
      render: (value) => {
        switch (value) {
          case 1:
            return <Tag color="green">Đã phản hồi</Tag>;
          default:
            return <Tag color="warning">Đang chờ</Tag>;
        }
      }
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      align: "center",
      fixed: "right",
      width: 100,
      render: (text, record) => (
        <Space>
          <EditOutlined
            style={{ color: "blue", fontSize: 18 }}
            onClick={() => editRecord(record)}
          />
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => deleteRecord(record)}>
            <DeleteOutlined style={{ color: "red", fontSize: 18 }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  function btn_click() {
    loadListTable(params);
  }

  const [data, setData] = useState([]);
  const loadListTable = async (params) => {
    setLoading(true);
    const res = await getVOC(params);
    setData(
      (res?.data || []).map((e) => {
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

  const onFinish = async (values) => {
    if (isEdit) {
      const res = await updateVOC(values, dataRecord?.id);
      if (res) {
        form.resetFields();
        setOpenMdl(false);
        setDataRecord(null);
        loadListTable(params);
      }
    }
  };

  const deleteRecord = async (record) => {
    if (record?.id) {
      await deleteVOC(record.id);
      loadListTable(params);
    }
  };

  const editRecord = (record) => {
    setIsEdit(true);
    setDataRecord(record);
    form.setFieldsValue({ ...record });
    setOpenMdl(true);
  };
  const [loading, setLoading] = useState(false);
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys);
    },
  };
  const { userProfile } = useProfile();
  const items = [
    {
      key: 'registered_by',
      label: 'Người ý kiến',
      children: dataRecord?.register?.name,
    },
    {
      key: 'registered_at',
      label: 'Ngày ý kiến',
      children: dataRecord?.registered_at ? dayjs(dataRecord.registered_at).format('DD/MM/YYYY HH:mm') : '',
    },
    {
      key: 'content',
      label: 'Nội dung',
      children: dataRecord?.content,
      span: 2,
    },
    {
      key: 'solution',
      label: 'Đề xuất',
      children: dataRecord?.solution,
      span: 2,
    },
  ];

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
                  <Button hidden htmlType="submit"></Button>
                </Form>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Card
            style={{ height: "100%" }}
            bodyStyle={{ paddingBottom: 0 }}
            className="custom-card scroll"
            title="VOC"
          >
            <Spin spinning={loading}>
              <Table
                size="small"
                bordered
                pagination={true}
                columns={col_detailTable}
                dataSource={data}
                scroll={{
                  x: 2000,
                  y: 'calc(100vh - 290px)',
                }}
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
        <div style={{ padding: '0 16px' }}>
          <Descriptions style={{ marginBottom: '10px' }} size="small" items={items} column={2} layout="horizontal" bordered />
        </div>
        <Form
          style={{ margin: "0 15px" }}
          layout="vertical"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            name="reply"
            label="Nội dung phản hồi"
            rules={[{ required: true, message: "Vui lòng nhập" }]}
          >
            <Input.TextArea placeholder="Vui lòng nhập" rows={4} />
          </Form.Item>
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

export default VOCRegister;
