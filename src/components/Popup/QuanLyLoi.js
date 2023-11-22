import { Form, Modal, Row, Col, Button, Space, InputNumber, Input } from "antd";
import React, { useState } from "react";
import "./popupStyle.scss";
import ScanButton from "../Button/ScanButton";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect } from "react";
import { scanError } from "../../api/oi/quality";
const QuanLyLoi = (props) => {
  const { line } = useParams();
  const { text, selectedLot, onSubmit } = props;
  const closeModal = () => {
    setOpen(false);
  };
  const [errorsList, setErrorsList] = useState([]);
  // useEffect(() => {
  //     (async () => {
  //         var res = await scanError();
  //         if (res.success) {
  //             setErrorsList(res.data);
  //         }
  //     })();
  // }, [line]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    if (selectedLot?.lot_id) {
      Object.keys(values["data"]).forEach((key) => {
        if (values["data"][key] == null) {
          delete values["data"][key];
        }
      });
      console.log(values);
      onSubmit({ "ngoai-quan": values });
      closeModal();
    }
  };
  useEffect(() => {
    form.resetFields();
  }, [errorsList, line]);
  const hanleClickOk = () => {
    form.setFieldValue("result", 1);
    form.submit();
  };
  const hanleClickNG = () => {
    form.setFieldValue("result", 2);
    form.submit();
  };
  const onScan = async (result) => {
    var res = await scanError({ machine_id: line, error_id: result });
    if (res.success) {
      setErrorsList([...errorsList, res.data]);
    }
  };
  return (
    <React.Fragment>
      <Button
        disabled={!selectedLot?.lot_id}
        type={"default"}
        danger={selectedLot?.phan_dinh === 2}
        size="large"
        className="w-100 text-wrap h-100"
        onClick={
          selectedLot?.phan_dinh === 0
            ? () => {
                setOpen(true);
              }
            : null
        }
      >
        {text}
      </Button>
      <Modal
        title="Bảng quản lý lỗi"
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
                style={{ backgroundColor: "#fb4b50" }}
                onClick={hanleClickNG}
              >
                NG
              </Button>
            </Space>
          </div>
        }
      >
        <ScanButton
          placeholder={"Nhập mã lỗi hoặc quét mã QR"}
          onScan={onScan}
        />
        <Form form={form} onFinish={onFinish} initialValues={{}} colon={false}>
          <Form.List name={"data"}>
            {(fields, { add, remove }, { errors }) =>
              errorsList.map((e, index) => {
                return (
                  <Row gutter={8} className={"mt-2"}>
                    <Col
                      span={8}
                      style={{ paddingInline: 4 }}
                      className="d-flex justify-content-center flex-wrap align-items-lg-center"
                    >
                      <div
                        className="d-flex justify-content-center align-content-center flex-grow-1 align-items-lg-center flex-wrap"
                        style={{ backgroundColor: "#EBEBEB", height: "100%" }}
                      >
                        {e.name}
                      </div>
                    </Col>
                    <Col span={8}>
                      <Form.Item name={e.id} noStyle>
                        <InputNumber
                          inputMode="numeric"
                          placeholder="Nhập số"
                          min={0}
                          style={{ width: "100%" }}
                          required
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevVal, curVal) => true}
                      >
                        {({ getFieldValue }) => (
                          <Form.Item
                            name={[e.key, "result"]}
                            noStyle
                            className="w-100 h-100"
                          >
                            {!getFieldValue(["data", e.key, "value"]) ? (
                              <Button className="w-100 text-center h-100 d-flex align-items-center justify-content-center">
                                OK/NG
                              </Button>
                            ) : getFieldValue(["data", e.key, "result"]) ? (
                              <Button
                                className="w-100 text-center h-100 d-flex align-items-center justify-content-center"
                                style={{
                                  backgroundColor: "#55c32a",
                                  color: "white",
                                }}
                              >
                                OK
                              </Button>
                            ) : (
                              <Button
                                className="w-100 text-center h-100 d-flex align-items-center justify-content-center"
                                style={{
                                  backgroundColor: "#fb4b50",
                                  color: "white",
                                }}
                              >
                                NG
                              </Button>
                            )}
                          </Form.Item>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                );
              })
            }
          </Form.List>
          <Form.Item name={"result"} hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default QuanLyLoi;
