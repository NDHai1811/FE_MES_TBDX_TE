import {
  Form,
  Modal,
  Row,
  Col,
  Button,
  Tooltip,
  Radio,
  Space,
  InputNumber,
  Input,
  message,
} from "antd";
import React, { useState } from "react";
import "./popupStyle.scss";
import { useEffect } from "react";
import { getIQCErrorList, scanError } from "../../api/oi/quality";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import ScanButton from "../Button/ScanButton";
import { CloseOutlined } from "@ant-design/icons";

const Checksheet4 = (props) => {
  const { line } = useParams();
  const {
    text,
    selectedLot,
    onSubmit,
    machine_id = null,
    line_id = null,
    open,
    setOpen,
  } = props;
  const closeModal = () => {
    setOpen(false);
    form.resetFields();
  };
  // const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [checksheet, setChecksheet] = useState([]);

  const onFinish = async ({phan_dinh = 0}) => {
    if (selectedLot) {
      errorsList.forEach((e, index) => {
        if (!e.value && !e.result) {
          errorsList.splice(index, 1);
        }
      });
      const values = { ngoai_quan: errorsList }
      if(phan_dinh){
        values.phan_dinh = phan_dinh;
      }
      closeModal();
      onSubmit(values);
    }
  };
  useEffect(() => {
    form.resetFields();
    setErrorsList(checksheet);
  }, [open]);

  const [errorsList, setErrorsList] = useState([]);
  const getErrorList = async () => {
    var res = await getIQCErrorList();
    if (res.success) {
      setErrorsList(res.data);
      setChecksheet(res.data);
    }
  };
  useEffect(() => {
    getErrorList();
  }, [selectedLot, line]);
  const [messageApi, contextHolder] = message.useMessage();
  const onSubmitFail = ({ values, errorFields, outOfDate }) => {
    // console.log(values, errorFields, outOfDate);
    messageApi.error("Chưa hoàn thành chỉ tiêu kiểm tra");
  };
  const between = (x, min, max) => {
    if (max) {
      return x >= min && x <= max;
    }
    else {
      return x >= min;
    }
  }
  const onChangeData = (value, key) => {
    console.log(value, key);
    setErrorsList(prev => prev.map(e => {
      if (e.id === key) {
        var result = value ? 1 : 0;
        if (value) {
          if (e.hasOwnProperty('min') && e.hasOwnProperty('max')) {
            if (between(value, e.min, e.max)) result = 1;
            else result = 2;
          }
        }
        if (e.input_type) {
          return { ...e, value: value, result: value }
        }
        return { ...e, value: value, result: result }
      }
      return e;
    }))
  }
  return (
    <React.Fragment>
      {contextHolder}
      <Modal
        title={"Kiểm tra " + (text ?? "")}
        open={open}
        onCancel={closeModal}
        centered
        bodyStyle={{ maxHeight: 500, overflowX: 'hidden', overflowY: 'auto', paddingRight: 8 }}
        footer={
          <Space>
            <Tooltip title="Không có lỗi gì, chọn để bỏ qua kiểm tra">
              <Button
                onClick={() => {
                  onSubmit({ tinh_nang: [] });
                  closeModal();
                }}
                style={{ backgroundColor: "#55c32a", color: "white" }}
                type="primary"
              >
                OK
              </Button>
            </Tooltip>
            <Tooltip title="Phán định NG">
              <Button
                onClick={() => {
                  onFinish({ phan_dinh: 2 });
                  closeModal();
                }}
                danger
                type="primary"
              >
                NG
              </Button>
            </Tooltip>
            <Tooltip title="Lưu lại các chỉ tiêu đã kiểm tra">
              <Button onClick={() => form.submit()} type="primary">
                Lưu
              </Button>
            </Tooltip>
            <Button onClick={() => setOpen(false)}>Huỷ</Button>
          </Space>
        }
        width={500}
      >
        <Form
          form={form}
          onFinish={onFinish}
          colon={false}
          className="mt-3"
          onFinishFailed={onSubmitFail}
        >
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
                      <Form.Item noStyle name={[e.id, "name"]} hidden><Input /></Form.Item>
                    </Col>
                    {e.input_type === 'radio' ?
                      <Col span={12}>
                        <Form.Item
                          noStyle
                          name={[e.id, "value"]}
                          rules={[{ required: true }]}
                        >
                          <Radio.Group
                            size="large"
                            name={e.id}
                            className=" text-center h-100 d-flex align-items-center justify-content-center"
                            onChange={(event) => onChangeData(event.target.value, e.id)} optionType="button" buttonStyle="solid">
                            <Radio value={1} className="w-100" style={e.result === 1 && { backgroundColor: "#55c32a", color: "white" }}>OK</Radio>
                            <Radio value={2} className="w-100" style={e.result === 2 && { backgroundColor: "#fb4b50", color: "white" }}>NG</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      :
                      <>
                        <Col span={6}>
                          <Form.Item
                            noStyle
                            name={[e.id, "value"]}
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              className=" text-center h-100 d-flex align-items-center justify-content-center"
                              inputMode="numeric"
                              placeholder="Nhập số"
                              min={0}
                              style={{ width: "100%" }}
                              onChange={(value) => onChangeData(value, e.id)}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            noStyle
                          >
                            <Button className="w-100 text-center h-100 d-flex align-items-center justify-content-center" style={!e.result ? "" : e.result === 1 ? { backgroundColor: "#55c32a", color: "white" } : { backgroundColor: "#fb4b50", color: "white" }} >
                              {!e.result ? "OK/NG" : e.result === 1 ? "OK" : "NG"}
                            </Button>
                          </Form.Item>
                        </Col>
                      </>
                    }
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

export default Checksheet4;
