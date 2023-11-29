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
  Input,
} from "antd";
import React, { useState } from "react";
import "./popupStyle.scss";
import { useEffect } from "react";
import { getChecksheetList, scanError } from "../../api/oi/quality";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import ScanButton from "../Button/ScanButton";
const Checksheet2 = (props) => {
  const { line } = useParams();
  const { text, selectedLot, onSubmit, machine_id } = props;
  const closeModal = () => {
    setOpen(false);
  };
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [checksheet, setChecksheet] = useState([]);

  const onFinish = async (values) => {
    if (selectedLot?.lot_id) {
      Object.keys(values["ngoai_quan"] ?? {}).forEach((key) => {
        const isNullish = Object.values(values["ngoai_quan"][key]).every((value) => {
          if (!value) {
            return true;
          }
          return false;
        });
        if (isNullish) {
          delete values["ngoai_quan"][key];
        }
      });
      console.log(values);
      closeModal();
      onSubmit(values);
    }
  };
  useEffect(() => {
    if (machine_id) {
      (async () => {
        var res = await getChecksheetList({ machine_id: machine_id });
        setChecksheet(res.data);
      })();
    }
  }, [machine_id]);
  useEffect(() => {
    form.resetFields();
  }, [checksheet, line]);
  const hanleClickOk = () => {
    form.setFieldValue("result", 1);
    form.submit();
  };
  const hanleClickNG = () => {
    form.setFieldValue("result", 2);
    form.submit();
  };
  const [errorsList, setErrorsList] = useState([]);
  const onScan = async (result) => {
    var res = await scanError({ machine_id: machine_id, error_id: result });
    if (res.success) {
      setErrorsList([...errorsList, res.data]);
    }
  };
  return (
    <React.Fragment>
      <Button
        disabled={!selectedLot?.lot_id}
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
        title={"Kiểm tra"}
        open={open}
        onCancel={closeModal}
        footer={
          (
            <Space>
              <Button onClick={() => onSubmit({ ngoai_quan: {result: 1} })} type="primary">Duyệt</Button>
              <Button onClick={() => form.submit()} type="primary">Lưu</Button>
              <Button onClick={() => setOpen(false)}>Huỷ</Button>
            </Space>
          )
        }
        width={500}
      >
        <ScanButton
          placeholder={"Nhập mã lỗi hoặc quét mã QR"}
          onScan={onScan}
        />
        <Form form={form} onFinish={onFinish} colon={false} className="mt-3">
          <Form.List name={"ngoai_quan"}>
            {(fields, { add, remove }, { errors }) =>
              (errorsList ?? []).map((e, index) => {
                return (
                  <Row gutter={8} className={index === 0 ? "" : "mt-2"}>
                    <Col
                      span={12}
                      style={{ paddingInline: 4 }}
                      className="d-flex justify-content-center flex-wrap align-items-lg-center"
                    >
                      <div
                        className="d-flex justify-content-center align-content-center flex-grow-1 align-items-lg-center p-2"
                        style={{
                          backgroundColor: "#EBEBEB",
                          height: "100%",
                          flexWrap: "wrap",
                        }}
                      >
                        {e.name}
                      </div>
                    </Col>
                    <Col span={6}>
                      <Form.Item noStyle name={[e.id, "value"]}>
                        <InputNumber
                          className=" text-center h-100 d-flex align-items-center justify-content-center"
                          inputMode="numeric"
                          placeholder="Nhập số"
                          min={0}
                          style={{ width: "100%" }}
                          onChange={(value) =>
                            form.setFieldValue(
                              ["ngoai_quan", e.id, "result"],
                              parseFloat(value) >=
                                parseFloat(e.tieu_chuan) -
                                parseFloat(e.delta) &&
                                value <=
                                parseFloat(e.tieu_chuan) +
                                parseFloat(e.delta)
                                ? 1
                                : 2
                            )
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevVal, curVal) => true}
                      >
                        {({ getFieldValue }) => (
                          <Form.Item
                            name={[e.id, "result"]}
                            noStyle
                            className="w-100 h-100"
                          >
                            {!getFieldValue(["ngoai_quan", e.id, "value"]) ? (
                              <Button className="w-100 text-center h-100 d-flex align-items-center justify-content-center">
                                OK/NG
                              </Button>
                            ) : getFieldValue(["ngoai_quan", e.id, "result"]) === 1 ? (
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

export default Checksheet2;
