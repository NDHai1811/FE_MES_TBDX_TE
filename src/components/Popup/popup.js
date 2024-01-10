import { AutoComplete, Form, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { getErrorList, updateErrorStatus } from "../../api/oi/equipment";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const Popup = (props) => {
  const { machine_id } = useParams();
  const [form] = Form.useForm();
  const { visible, setVisible, selectedError, getLogs } = props;

  const [errorList, setErrorList] = useState([]);

  useEffect(() => {
    getErrors();
  }, [machine_id]);

  const getErrors = async () => {
    var res = await getErrorList({ machine_id: machine_id })
    setErrorList(res.data)
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = async (values) => {
    var res = await updateErrorStatus({ ...values, machine_id: machine_id, id: selectedError?.id });
    form.resetFields();
    setVisible(false);
    getLogs();
  }

  return (
    <React.Fragment>
      <Modal
        title="Form gợi ý"
        open={visible}
        onOk={() => form.submit()}
        onCancel={handleCancel}
      >
        <Form form={form} name="suggest_form" layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="ten_su_co"
            label="Sự cố"
            rules={[{ required: true, message: "Vui lòng nhập sự cố!" }]}
          >
            <AutoComplete
              options={errorList}
              placeholder="Nhập sự cố..."
              onSelect={(value) => form.setFieldsValue(errorList.find(e => e.value === value))}
              onChange={() => form.setFieldsValue({ nguyen_nhan: '', cach_xu_ly: '', code: '' })}
            />
          </Form.Item>
          <Form.Item name="code" hidden > <Input /> </Form.Item>
          <Form.Item
            name="nguyen_nhan"
            label="Nguyên nhân"
            rules={[{ required: true, message: "Vui lòng nhập nguyên nhân!" }]}
          >
            <Input placeholder="Nhập nguyên nhân..." />
          </Form.Item>
          <Form.Item
            name="cach_xu_ly"
            label="Cách xử lý"
            rules={[{ required: true, message: "Vui lòng nhập cách xử lý!" }]}
          >
            <Input placeholder="Nhập cách xử lý..." />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default Popup;
