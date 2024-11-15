import React, { useEffect, useState } from "react";
import {
  Popconfirm,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Select,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { deleteVOC, getVOC, updateVOC, getVOCTypes } from "../../../api/oi/voc";
import { useProfile } from "../../../components/hooks/UserHooks";

const VOCRegister = () => {
  document.title = "VOC";
  const [listCheck, setListCheck] = useState([]);
  const [openMdl, setOpenMdl] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [dataRecord, setDataRecord] = useState();
  const [openReplyModal, setOpenReplyModal] = useState(false); // State để quản lý hiển thị popup
  const [selectedReplyContent, setSelectedReplyContent] = useState(""); // Nội dung phản hồi
  const [form] = Form.useForm();
  const [params, setParams] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hàm hiển thị popup nội dung phản hồi
  const showReplyContent = (content) => {
    setSelectedReplyContent(content || "Chưa có phản hồi");
    setOpenReplyModal(true);
  };

  const [typeOptions, setTypeOptions] = useState([]);

  const col_detailTable = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "left",
      render: (value, item, index) => index + 1,
      width: 30,
      fixed: "left",
    },
    {
      title: "Ngày/ giờ",
      dataIndex: "registered_at",
      key: "registered_at",
      align: "left",
      width: 85,
      render: (value) => (value ? dayjs(value).format("DD/MM/YYYY HH:mm") : ""),
    },
    {
      title: "Người ý kiến",
      dataIndex: "registered_by",
      key: "registered_by",
      align: "left",
      width: 100,
      render: (_, record) => record?.register?.name,
    },
    {
      title: "Phân loại",
      dataIndex: "type",
      key: "type",
      align: "left",
      width: 80,
      render: (_, record) => record?.type?.name,
    },
    {
      title: "Chủ đề",
      dataIndex: "title",
      key: "title",
      align: "left",
      width: 120,
      render: (text, record) => (
        <a onClick={() => showReplyContent(record.reply)}>{text}</a> // Sự kiện onClick hiển thị nội dung phản hồi
      ),
    },
    {
      title: "Kết quả phản hồi",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 95,
      render: (value) =>
        value === 1 ? (
          <Tag color="green">Đã phản hồi</Tag>
        ) : (
          <Tag color="red">Chưa phản hồi</Tag>
        ),
    },
    {
      title: "Người phản hồi",
      dataIndex: "replied_by",
      key: "replied_by",
      align: "left",
      width: 100,
      render: (_, record) => record?.replier?.name,
    },
    {
      title: "Ngày/ giờ phản hồi",
      dataIndex: "replied_at",
      key: "replied_at",
      align: "left",
      width: 120,
      render: (value) => (value ? dayjs(value).format("DD/MM/YYYY HH:mm") : ""),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      align: "center",
      fixed: "right",
      width: 70,
      render: (text, record) => (
        <Space>
          <EditOutlined
            style={{ color: "blue", fontSize: 18 }}
            onClick={() => editRecord(record)}
          />
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => deleteRecord(record)}
          >
            <DeleteOutlined style={{ color: "red", fontSize: 18 }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const statusOptions = [
    { label: "Đã phản hồi", value: 1 },
    { label: "Chưa phản hồi", value: 0 },
  ];

  const loadListTable = async (params) => {
    setLoading(true);
    const res = await getVOC(params);
    setData((res?.data || []).map((e) => ({ ...e, key: e.id })));
    setLoading(false);
  };

  const loadVOCTypes = async () => {
    const res = await getVOCTypes();
    setTypeOptions(
      Array.isArray(res?.data)
        ? res.data.map((e) => ({ ...e, key: e.id, value: e.id, label: e.name }))
        : []
    );
  };

  useEffect(() => {
    (async () => {
      loadListTable(params);
      loadVOCTypes();
    })();
  }, []);

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

  const { userProfile } = useProfile();
  const items = [
    {
      key: "registered_by",
      label: "Người ý kiến",
      children: dataRecord?.register?.name,
    },
    {
      key: "registered_at",
      label: "Ngày ý kiến",
      children: dataRecord?.registered_at
        ? dayjs(dataRecord.registered_at).format("DD/MM/YYYY HH:mm")
        : "",
    },
    {
      key: "content",
      label: "Nội dung",
      children: dataRecord?.content,
      span: 2,
    },
    {
      key: "solution",
      label: "Đề xuất",
      children: dataRecord?.solution,
      span: 2,
    },
  ];

  return (
    <>
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Card
              style={{ height: "100%" }}
              bodyStyle={{ padding: 0 }}
              className="custom-card"
              actions={[
                <Button
                  type="primary"
                  onClick={() => loadListTable(params)}
                  style={{ width: "80%" }}
                >
                  Tìm kiếm
                </Button>,
              ]}
            >
              <Divider>Tìm kiếm</Divider>
              <Form
                style={{ margin: "0 15px" }}
                layout="vertical"
                onFinish={() => loadListTable(params)}
              >
                <Form.Item label="Người ý kiến" className="mb-3">
                  <Input
                    allowClear
                    onChange={(e) =>
                      setParams({ ...params, register: e.target.value })
                    }
                    placeholder="Nhập người ý kiến"
                  />
                </Form.Item>
                <Form.Item label="Phân loại" className="mb-3">
                  <Select
                    allowClear
                    onChange={(value) => setParams({ ...params, type: value })}
                    placeholder="Chọn phân loại"
                    options={typeOptions} // Sử dụng options đã khai báo
                  />
                </Form.Item>
                <Form.Item label="Kết quả phản hồi" className="mb-3">
                  <Select
                    allowClear
                    onChange={(value) =>
                      setParams({ ...params, status: value })
                    }
                    placeholder="Chọn kết quả phản hồi"
                    options={statusOptions} // Sử dụng options đã khai báo
                  />
                </Form.Item>
                <Button hidden htmlType="submit"></Button>
              </Form>
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Card
            style={{ height: "100%" }}
            bodyStyle={{ paddingBottom: 0 }}
            className="custom-card scroll"
            title="QUẢN LÝ Ý KIẾN NGƯỜI SỬ DỤNG"
          >
            <Spin spinning={loading}>
              <Table
                size="small"
                bordered
                pagination
                columns={col_detailTable}
                dataSource={data}
                scroll={{ x: 1200, y: "calc(100vh - 290px)" }}
              />
            </Spin>
          </Card>
        </Col>
      </Row>
      <Modal
        title="Nội dung phản hồi"
        open={openReplyModal}
        onCancel={() => setOpenReplyModal(false)}
        footer={null}
      >
        <Divider style={{ marginBottom: "15px", marginTop: "10px" }}></Divider>
        <p>{selectedReplyContent}</p>
      </Modal>
      <Modal
        title={isEdit ? "Cập nhật" : "Thêm mới"}
        open={openMdl}
        onCancel={() => setOpenMdl(false)}
        footer={null}
        width={800}
      >
        <Descriptions
          style={{ marginBottom: "10px" }}
          size="small"
          items={items}
          column={2}
          layout="horizontal"
          bordered
        />
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
