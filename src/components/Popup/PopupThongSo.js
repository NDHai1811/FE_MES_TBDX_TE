import React, { useEffect, useState } from "react";
import { Modal, Row, Col, Input, Form } from "antd";
import "./PopupQuetQr.css";
import { getParamaters, sendErrorInputResults } from "../../api/oi/equipment";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function PopupThongSo(props) {
  const { visible, setVisible } = props;
  const { machine_id } = useParams();
  const [form] = Form.useForm();

  const [data, setData] = useState([]);

  useEffect(() => {
    getParamaterList();
  }, []);

  const getParamaterList = () => {
    getParamaters({ machine_id })
      .then((res) => setData(res))
      .catch((err) => console.log("Lấy danh sách thông số thất bại: ", err));
  };

  const onSendResule = (values) => {
    const resData = {
      machine_id,
      lot_id: "",
      layout_id: "",
      data: values,
    };

    sendErrorInputResults(resData)
      .then(setVisible(false))
      .catch((err) => console.log("Gửi kết quả nhập lỗi thất bại: ", err));
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onSendResule(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const renderItem = (item, index) => {
    return (
      <Row className="table-row">
        <Col
          span={12}
          className="table-cell"
          style={{
            paddingTop: 8,
            paddingBottom: 8,
            borderTopWidth: index === 0 ? 1 : 0,
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          {item.name}
        </Col>
        <Col
          span={12}
          className="table-cell"
          style={{
            borderLeftWidth: 0,
            padding: 8,
            paddingBottom: 0,
            borderTopWidth: index === 0 ? 1 : 0,
            paddingTop: 16,
          }}
        >
          <Form form={form} name="suggest_form" layout="vertical">
            <Form.Item
              name={`${item.parameter_id}`}
              initialValue={item.value}
              rules={[
                {
                  required: true,
                  message: `Vui lòng nhập ${item.name.toLowerCase()}`,
                },
              ]}
            >
              <Input placeholder="Nhập thông số..." type="number" />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    );
  };

  return (
    <div>
      <Modal
        title="Thông số"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {data?.map(renderItem)}
      </Modal>
    </div>
  );
}

export default PopupThongSo;
