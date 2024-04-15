import {
  Form,
  Modal,
  Row,
  Col,
  Button,
  Select,
  Space,
  InputNumber,
  Input,
  message,
  Tooltip,
} from "antd";
import React, { useState } from "react";
import "./popupStyle.scss";
import { useEffect } from "react";
import { getChecksheetList, getIQCChecksheetList } from "../../api/oi/quality";
const Checksheet1 = (props) => {
  const {
    text,
    selectedLot,
    onSubmit,
    machines = [],
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
  const [formData, setFormData] = useState([])

  const onFinish = () => {
    console.log(formData);
    if (selectedLot) {
      formData.forEach((e, index) => {
        if (!e.value && !e.result) {
          formData.splice(index, 1);
        }
      });
      closeModal();
      const values = {tinh_nang: formData}
      console.log(values);
      onSubmit(values);
    }
  };
  useEffect(() => {
    if (selectedLot) {
      (async () => {
        if (machines.length > 0) {
          var res = await getChecksheetList({
            machine: machines,
            lo_sx: selectedLot?.lo_sx,
          });
          setFormData(res.data);
          setChecksheet(res.data)
        } else {
          var res = await getIQCChecksheetList({
            line_id: line_id,
            lo_sx: selectedLot?.lo_sx,
            ma_ncc: selectedLot?.loai_giay + selectedLot?.dinh_luong,
          });
          setFormData(res.data);
          setChecksheet(res.data)
        }
      })();
    }
  }, [selectedLot]);
  useEffect(() => {
    form.resetFields();
    setFormData(checksheet);
  }, [selectedLot, open]);
  const [messageApi, contextHolder] = message.useMessage();
  const onSubmitFail = ({ values, errorFields, outOfDate }) => {
    // console.log(values, errorFields, outOfDate);
    messageApi.error("Chưa hoàn thành chỉ tiêu kiểm tra");
  };
  const between = (x, min, max) => {
    if(max){
      return x >= min && x <= max;
    }
    else{
      return x >= min;
    }
  }
  const onChangeData = (value, key) => {
    console.log(value, key);
    setFormData(prev=>prev.map(e=>{
      if(e.id === key){
        var result = value ? 1 : 0;
        if(value){
          if(e.deteminer_value && e.deteminer_value.toLowerCase() === value.toLowerCase()){
            result = 2;
          }
          if(e.hasOwnProperty('min') && e.hasOwnProperty('max')){
            if(between(value, e.min, e.max)) result = 1;
            else result = 2;
          }
        }
        return {...e, value: value, result: result}
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
        bodyStyle={{maxHeight: 500, overflowX:'hidden', overflowY: 'auto', paddingRight:8}}
        footer={
          <Space>
            <Tooltip title="Lô không có lỗi lầm gì, duyệt để bỏ qua kiểm tra">
              <Button
                onClick={() => {
                  onSubmit({ tinh_nang: [] });
                  closeModal();
                }}
                type="primary"
              >
                Duyệt
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
        style={{ top: 8}}
      >
        <Form
          form={form}
          onFinish={onFinish}
          colon={false}
          onFinishFailed={onSubmitFail}
        >
          {/* <Form.List name={"tinh_nang"}>
            {(fields, { add, remove }, { errors }) =>
              (checksheet ?? []).map((e, index) => {
                if (e.input) {
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
                          {e?.tieu_chuan && ". (" + e?.tieu_chuan + ")"}
                        </div>
                        <Form.Item
                          noStyle
                          name={[e.id, "name"]}
                          hidden
                          initialValue={e.name}
                          shouldUpdate={true}
                        ></Form.Item>
                      </Col>
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
                            onChange={(value) =>
                              form.setFieldValue(
                                ["tinh_nang", e.id, "result"],
                                !e?.max
                                  ? value >= parseFloat(e.min)
                                    ? 1
                                    : 2
                                  : parseFloat(value) >= parseFloat(e.min) &&
                                    value <= parseFloat(e.max)
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
                              rules={[{ required: true }]}
                            >
                              {!getFieldValue(["tinh_nang", e.id, "value"]) ? (
                                <Button className="w-100 text-center h-100 d-flex align-items-center justify-content-center">
                                  OK/NG
                                </Button>
                              ) : getFieldValue([
                                  "tinh_nang",
                                  e.id,
                                  "result",
                                ]) === 1 ? (
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
                } else {
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
                          {e?.name}
                          {e?.tieu_chuan && ". (" + e?.tieu_chuan + ")"}
                        </div>
                        <Form.Item noStyle name={[e.id, "name"]} hidden>
                          <Input value={e.name} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name={[e.id, "result"]} noStyle rules={[{ required: true }]}>
                          <Radio.Group
                            style={{
                              float: "right",
                              width: "100%",
                              height: "100%",
                            }}
                            className="d-flex"
                            optionType="button"
                            buttonStyle="solid"
                          >
                            <Radio.Button
                              value={1}
                              className={
                                "positive-radio text-center h-100 d-flex align-items-center justify-content-center"
                              }
                              style={{ flex: 1 }}
                            >
                              OK
                            </Radio.Button>
                            <Radio.Button
                              value={2}
                              className="negative-radio text-center h-100 d-flex align-items-center justify-content-center"
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
              })
            }
          </Form.List> */}
          <Form.List name={"tinh_nang"}>
            {(fields, { add, remove }, { errors }) =>
              (formData ?? []).map((e, index) => {
                var inputNode;
                var className = "text-center h-100 d-flex align-items-center justify-content-center w-100 borderd"
                switch (e.input_type) {
                  case 'select':
                    inputNode = <Select options={(e.options ?? []).map(o=>({value: o, label: o}))} className={className} placeholder="Chọn giá trị"
                    onSelect={(value)=>onChangeData(value, e.id)}/>;
                    break;
                  case 'inputnumber':
                    inputNode = <InputNumber min={0} className={className} placeholder="Nhập số" onChange={(value)=>onChangeData(value, e.id)}/>;
                    break;
                  default:
                    break;
                }
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
                        {e?.tieu_chuan && ". (" + e?.tieu_chuan + ")"}
                      </div>
                      <Form.Item
                        noStyle
                        name={[e.id, "name"]}
                        hidden
                        initialValue={e.name}
                        shouldUpdate={true}
                      ></Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        noStyle
                        name={[e.id, "value"]}
                        rules={[{ required: true }]}
                      >
                        {inputNode}
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        noStyle
                      >
                        <Button className="w-100 text-center h-100 d-flex align-items-center justify-content-center" style={!e.result ? "" : e.result === 1 ? {backgroundColor: "#55c32a",color: "white"} : {backgroundColor: "#fb4b50",color: "white"}} >
                          {!e.result ? "OK/NG" : e.result === 1 ? "OK" : "NG"}
                        </Button>
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

export default Checksheet1;
