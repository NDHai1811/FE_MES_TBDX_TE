import { AutoComplete, Form, Input, Modal, Button } from "antd";
import React, { useState } from "react";

const options = [
  { value: "Cúp điện theo lịch" },
  { value: "Mất pha" },
  { value: "Đứt dây điện" },
];

const errorOptions = [
  { value: "Mất điện" },
  { value: "Sản phẩm mới (duyệt mẫu)" },
  { value: "Bảo trì (định kỳ)" },
  { value: "Vệ sinh 5S" },
  { value: "Nghỉ giữa ca" },
  { value: "Đổi đơn hàng" },
  { value: "Thiếu người" },
  { value: "Thiếu nguyên vật liệu" },
  { value: "Nguyên vật liệu không đạt" },
  { value: "Vệ sinh giao ca" },
  { value: "Lô hư" },
  { value: "Hết đơn hàng" },
  { value: "Máy hư" },
];

const Popup = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        console.log(values);
        setVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <React.Fragment>
      <Button type="default" onClick={() => setVisible(true)}>
        Popup
      </Button>
      <Modal
        title="Form gợi ý"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} name="suggest_form">
          <Form.Item
            name="nguyenNhan"
            label="Nguyên nhân"
            rules={[{ required: true, message: "Vui lòng nhập nguyên nhân!" }]}
          >
            <AutoComplete
              placeholder="Nhập nguyên nhân..."
              options={options}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                -1
              }
            />
          </Form.Item>
          <Form.Item
            name="suCo"
            label="Sự cố"
            rules={[{ required: true, message: "Vui lòng nhập sự cố!" }]}
          >
            <AutoComplete
              options={errorOptions}
              placeholder="Nhập sự cố..."
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                -1
              }
            />
          </Form.Item>
          <Form.Item
            name="cachXuLy"
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
