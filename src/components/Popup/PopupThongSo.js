import React, { useEffect, useState } from "react";
import { Modal, Row, Col, Input, Form, message } from "antd";
import "./PopupQuetQr.css";
import { getParamaters, sendErrorInputResults } from "../../api/oi/equipment";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function PopupThongSo(props) {
  const { visible, setVisible, lo_sx, getLogs } = props;
  const { machine_id } = useParams();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();

  const messageAlert = (content, type = "error") => {
    messageApi.open({
      type,
      content,
      className: "custom-class",
      style: {
        marginTop: "50%",
      },
    });
  };

  useEffect(() => {
    if(visible){
      getParamaterList();
    }else{
      setVisible(false);
    }
  }, [visible]);

  const getParamaterList = () => {
    getParamaters({ machine_id, lo_sx })
      .then((res) => {
        setData(res.data);
        if (res.data.length === 0) {
          messageAlert("Đã mapping", "success");
        }else{
          setOpen(true);
        }
      })
      .catch((err) => console.log("Lấy danh sách thông số thất bại: ", err));
  };

  const onSendResule = (values) => {
    const resData = {
      machine_id,
      lot_id: "",
      lo_sx,
      layout_id: "",
      data: values,
    };

    sendErrorInputResults(resData)
      .then(() => {
        setVisible(false);
        getLogs?.();
      })
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
                {
                  validator: (_, value) =>
                    value >= 15 && value <= 30
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "Giá trị phải nằm trong khoảng từ 15 đến 30"
                          )
                        ),
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
      {contextHolder}
      <Modal
        title="Thông số"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {data?.map(renderItem)}
      </Modal>
    </div>
  );
}

export default PopupThongSo;
