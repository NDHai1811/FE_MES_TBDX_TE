import React, { useEffect, useState } from "react";
import { Row, Col, Tabs, Card, Table, Select, Form, Input, Button, Descriptions, message, DatePicker, Tag, Modal, Divider, Upload } from "antd";
import { withRouter } from "react-router-dom";
import "../style.scss";
import { useProfile } from "../../../components/hooks/UserHooks";
import dayjs from "dayjs";
import { createVOC, getVOC, getVOCTypes, uploadFileVOC } from "../../../api/oi/voc";
import { UploadOutlined } from "@ant-design/icons";

const Register = (props) => {
  document.title = "VOC";
  const { userProfile } = useProfile();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [typeOptions, setTypeOptions] = useState([]);
  const [typeSelected, setTypeSelected] = useState();
  const [vocNo, setVOCNo] = useState(`${dayjs().format('YYYYMMDD')}001`);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const res = await createVOC({
        ...values,
        voc_type_id: typeSelected,
      });
      if (res.success) {
        await getVOCNo();
        form.resetFields();
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const items = [
    {
      key: 'created_by',
      label: 'Người ý kiến',
      children: userProfile?.name || "User name",
    },
    {
      key: 'type',
      label: 'Phân loại',
      children: <Select value={typeSelected} size="small" placeholder="Phân loại" options={typeOptions} style={{ width: '100%' }} onChange={setTypeSelected} />,
    },
    {
      key: 'no',
      label: 'Số thứ tự',
      children: vocNo,
    },
    {
      key: 'date',
      label: 'Ngày ý kiến',
      children: dayjs().format('DD/MM/YYYY'),
    },
  ];

  const fetchVOCTypes = async () => {
    const res = await getVOCTypes();
    setTypeOptions((res?.data || []).map(({ id, name }) => ({ label: name, value: id })));
    if ((res?.data || []).length > 0) {
      setTypeSelected((res?.data || [])[0]?.id);
    }
  }

  const getVOCNo = async () => {
    const prefix = dayjs().format('YYYYMMDD');
    const res = await getVOC({ no: prefix });
    const strLength = String((res?.data || []).length + 1);
    const pad = "000";
    const no = pad.substring(0, pad.length - strLength.length) + strLength;
    setVOCNo(`${prefix}${no}`);
  }

  useEffect(() => {
    getVOCNo();
    fetchVOCTypes();
    loadListTable();
  }, []);

  const columns = [
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
      title: "Phân loại",
      dataIndex: "type",
      key: "type",
      align: "left",
      width: 80,
      render: (_, record) => record?.type?.name,
    },
    {
      title: "Ngày dự kiến HT",
      dataIndex: "expected_date",
      key: "expected_date",
      align: "left",
      width: 85,
      render: (value) => (value ? dayjs(value).format("DD/MM/YYYY HH:mm") : ""),
    },
    {
      title: "Chủ đề",
      dataIndex: "title",
      key: "title",
      align: "left",
      width: 120,
      // render: (text, record) => (
      //   <a onClick={() => showReplyContent(record.reply)}>{text}</a> // Sự kiện onClick hiển thị nội dung phản hồi
      // ),
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
  ];
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(false)
  const [selectedRow, setSelectedRow] = useState();
  const [openReplyModal, setOpenReplyModal] = useState(false); // State để quản lý hiển thị popup
  const [selectedReplyContent, setSelectedReplyContent] = useState(""); // Nội dung phản hồi
  const [uploading, setUploading] = useState(false);
  const showReplyContent = (content) => {
    setSelectedReplyContent(content || "Chưa có phản hồi");
    setOpenReplyModal(true);
  };
  const onRowClick = (record) => {
    setSelectedRow(record);
    showReplyContent(record.reply)// Sự kiện onClick hiển thị nội dung phản hồi
  }
  const loadListTable = async (params) => {
    setLoadingData(true);
    const res = await getVOC({ requested_by: userProfile?.username });
    setData((res?.data || []).map((e) => {
      if (selectedRow && e.id === selectedRow?.id) {
        setSelectedRow(e);
      }
      return { ...e, key: e.id }
    }));
    setLoadingData(false);
  };
  const rowClassName = (record) => {
    if (record?.id === selectedRow?.id) {
      return "table-row-light-blue";
    } else if (record?.status === 1) {
      return "table-row-grey";
    }
    return "";
  }


  return (
    <React.Fragment>
      <Row gutter={[8, 8]} style={{marginTop: 4}}>
        <Col span={24}>
          <Card title="Ý kiến người sử dụng" size="small">
            <Descriptions style={{ marginBottom: '10px' }} size="small" items={items} column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} layout="horizontal" bordered />
            <Form form={form} name="suggest_form" layout="vertical" onFinish={onFinish}>
              {typeSelected === 2 && <Form.Item
                style={{ marginBottom: '10px' }}
                name="expected_date"
                label="Ngày dự kiến hoàn thành"
                rules={[{ required: true, message: "Vui lòng nhập" }]}
              >
                <DatePicker minDate={dayjs()} format={"DD-MM-YYYY HH:mm:ss"} showTime needConfirm={false} />
              </Form.Item>}
              <Form.Item
                style={{ marginBottom: '10px' }}
                name="title"
                label="Chủ đề"
                rules={[{ required: true, message: "Vui lòng nhập" }]}
              >
                <Input placeholder="Vui lòng nhập" />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: '10px' }}
                name="content"
                label="Nội dung"
                rules={[{ required: true, message: "Vui lòng nhập" }]}
              >
                <Input.TextArea placeholder="Vui lòng nhập" rows={2} />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: '20px' }}
                name="solution"
                label="Đề xuất"
              >
                <Input.TextArea placeholder="Vui lòng nhập" rows={2} />
              </Form.Item>
              <Form.Item style={{ marginBottom: '20px', width: 300 }}>
                <Upload
                  // showUploadList={false}
                  customRequest={async ({ file, onSuccess, onError }) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    setUploading(true);
                    const res = await uploadFileVOC(formData);
                    setUploading(false);
                  }}
                ><Button icon={<UploadOutlined />} loading={uploading}>Đính kèm file/ảnh</Button></Upload>
              </Form.Item>
              <Form.Item style={{ marginBottom: '0' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  Gửi ý kiến
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="Lịch sử ý kiến" size="small">
            <Table
              loading={loadingData}
              size="small"
              bordered
              pagination
              columns={columns}
              dataSource={data}
              scroll={{ x: 1200, y: "calc(100vh - 290px)" }}
              onRow={(record, index) => {
                return {
                  onClick: () => onRowClick(record),
                };
              }}
              rowClassName={rowClassName}
            />
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
    </React.Fragment>
  );
};

export default withRouter(Register);
