import React, { useEffect, useState } from "react";
import { Row, Col, Tabs, Card, Table, Select, Form, Input, Button, Descriptions, message } from "antd";
import { withRouter } from "react-router-dom";
import "../style.scss";
import { useProfile } from "../../../components/hooks/UserHooks";
import dayjs from "dayjs";
import { createVOC, getVOC, getVOCTypes } from "../../../api/oi/voc";

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
  }, []);

  return (
    <React.Fragment>
      <Card title="Ý kiến người sử dụng" size="small">
        <Descriptions style={{ marginBottom: '10px' }} size="small" items={items} column={2} layout="horizontal" bordered />
        <Form form={form} name="suggest_form" layout="vertical" onFinish={onFinish}>
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
    </React.Fragment>
  );
};

export default withRouter(Register);
