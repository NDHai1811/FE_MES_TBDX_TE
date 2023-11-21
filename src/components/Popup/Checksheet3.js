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
  const { text } = props;
  const closeModal = () => {
    setOpen(false);
    form.resetFields();
  };

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const onFinish = (values) => {
    closeModal();
    if (values.result) {
      setButtonColor("#55c23a");
    } else {
      setButtonColor("#fb4b50");
    }
  };
  const hanleClickOk = () => {
    form.setFieldValue("result", 1);
    form.submit();
  };
  const hanleClickNG = () => {
    form.setFieldValue("result", 0);
    form.submit();
  };
  const hanleClickKV = () => {
    setButtonColor("");
    closeModal();
  };
  const [buttonColor, setButtonColor] = useState("");
  return (
    <React.Fragment>
      <Button
        type={buttonColor === "" ? "default" : "primary"}
        style={{ backgroundColor: buttonColor }}
        size="large"
        className="w-100 text-wrap h-100"
        onClick={() => setOpen(true)}
      >
        {text}
      </Button>
      <Modal
        title="Chỉ tiêu kiểm tra 3"
        open={open}
        onCancel={closeModal}
        footer={
          <div className="justify-content-between d-flex">
            <strong>Kết luận</strong>
            <Space>
              <Button
                type="primary"
                style={{ backgroundColor: "#55c32a" }}
                onClick={hanleClickOk}
              >
                Duyệt
              </Button>
              <Button
                type="primary"
                style={{ backgroundColor: "#f7ac27" }}
                onClick={hanleClickKV}
              >
                Khoanh vùng
              </Button>
              <Button
                type="primary"
                style={{ backgroundColor: "#fb4b50" }}
                onClick={hanleClickNG}
              >
                NG
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{}}
          onValuesChange={console.log}
          colon={false}
          // {...formItemLayout}
        >
          <Form.Item hidden name={"result"}></Form.Item>
          {(props.checksheet ?? []).map((e, index) => {
            if (e.type === 1) {
              return (
                <Row gutter={8} className={index === 0 ? "" : "mt-2"}>
                  <Col
                    span={12}
                    style={{ paddingInline: 4 }}
                    className="d-flex justify-content-center flex-wrap align-items-lg-center"
                  >
                    <div
                      className="d-flex justify-content-center align-content-center flex-grow-1 align-items-lg-center"
                      style={{ backgroundColor: "#EBEBEB", height: "100%" }}
                    >
                      {e.hang_muc}
                    </div>
                  </Col>
                  <Col span={6}>
                    <Form.Item noStyle name={"defect" + (index + 1)}>
                      <InputNumber
                        inputMode="numeric"
                        placeholder="Nhập số"
                        min={0}
                        style={{ width: "100%" }}
                        onPressEnter={(event) => {
                          form.setFieldValue(
                            "check" + (index + 1),
                            parseInt(event.target.value) > 100
                          );
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name={"check" + (index + 1)} hidden></Form.Item>
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) =>
                        prevValues["check" + (index + 1)] !==
                        currentValues["check" + (index + 1)]
                      }
                    >
                      {({ getFieldValue }) =>
                        getFieldValue("defect" + (index + 1)) === "" ||
                        getFieldValue("defect" + (index + 1)) == null ? (
                          <Button className="w-100">OK/NG</Button>
                        ) : getFieldValue("check" + (index + 1)) ? (
                          <Button
                            className="w-100"
                            style={{
                              backgroundColor: "#55c32a",
                              color: "white",
                            }}
                          >
                            OK/NG
                          </Button>
                        ) : (
                          <Button
                            className="w-100"
                            style={{
                              backgroundColor: "#fb4b50",
                              color: "white",
                            }}
                          >
                            OK/NG
                          </Button>
                        )
                      }
                    </Form.Item>
                  </Col>
                </Row>
              );
            } else {
              return (
                <Row gutter={8} className={index === 0 ? "" : "mt-2"}>
                  <Col
                    span={12}
                    style={{ paddingInline: 4 }}
                    className="d-flex justify-content-center flex-wrap align-items-lg-center"
                  >
                    <div
                      className="d-flex justify-content-center align-content-center flex-grow-1 align-items-lg-center"
                      style={{ backgroundColor: "#EBEBEB", height: "100%" }}
                    >
                      {e.hang_muc}
                    </div>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={"check" + (index + 1)} noStyle>
                      <Radio.Group
                        style={{ float: "right", width: "100%" }}
                        className="d-flex"
                        optionType="button"
                        buttonStyle="solid"
                      >
                        <Radio.Button
                          value={1}
                          className={"positive-radio text-center"}
                          style={{ flex: 1 }}
                        >
                          OK
                        </Radio.Button>
                        <Radio.Button
                          value={0}
                          className="negative-radio text-center"
                          style={{ flex: 1 }}
                        >
                          NG
                        </Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
              );
            }
          })}
          <Divider></Divider>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default Checksheet3;
