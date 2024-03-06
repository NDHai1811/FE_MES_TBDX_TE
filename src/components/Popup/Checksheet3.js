import {
  Form,
  Modal,
  Row,
  Col,
  Button,
  Divider,
  Radio,
  Space,
  InputNumber,
} from "antd";
import React, { useState } from "react";
import "./popupStyle.scss";
const Checksheet3 = (props) => {
  const {
    text,
    selectedLot,
    onSubmit,
    machine_id = null,
    line_id = null,
    open,
    setOpen,
  } = props;
  const [form] = Form.useForm();
  const onFinish = (values) => {
    onSubmit(values);
    setOpen(false);
  };
  return (
    <React.Fragment>
      <Modal
        title={text}
        open={open}
        onCancel={() => setOpen(false)}
        okText={"Xác nhận"}
        okButtonProps={{
          onClick: () => form.submit(),
        }}
      >
        <Form
          form={form}
          initialValues={{
            sl_ng_qc: 0,
          }}
          onFinish={onFinish}
        >
          <Form.Item name={"sl_ng_qc"}>
            <InputNumber
              style={{ width: "100%" }}
              inputMode="numeric"
              onPressEnter={() => form.submit()}
            />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default Checksheet3;
