import {
  Form,
  Modal,
  Row,
  Col,
  Button,
  Divider,
  Radio,
  Space,
  Input,
} from "antd";
import React, { useState } from "react";
import "./popupStyle.scss";
import { useEffect } from "react";
import { getChecksheetList, sendResultChecksheet } from "../../api/oi/quality";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
const Checksheet1 = (props) => {
  const { line } = useParams();
  const { text, checksheet = [], lotId } = props;
  const [isSubmited, setIsSubmited] = useState(false);
  const closeModal = () => {
    setOpen(false);
  };
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const result = Form.useWatch("result", form);
  const formItemLayout = {
    labelCol: {
      span: 18,
    },
    wrapperCol: {
      span: 6,
    },
    labelAlign: "left",
  };
  const onFinish = async (values) => {
    // if(lotId){
    values.key = checksheet.key;
    values.lot_id = lotId;
    values.line_id = line;
    console.log(values);
    var res = await sendResultChecksheet(values);
    setIsSubmited(true);
    closeModal();
    // }else{
    //     console.log('khong co pallet');
    // }
  };
  const hanleClickOk = () => {
    form.setFieldValue("result", 1);
    form.submit();
  };
  const hanleClickNG = () => {
    form.setFieldValue("result", 0);
    form.submit();
  };
  useEffect(() => {
    form.resetFields();
    setIsSubmited(false);
  }, [checksheet, line]);
  return (
    <React.Fragment>
      <Button
        disabled={!(checksheet.data ?? []).length > 0}
        type={isSubmited ? "primary" : "default"}
        danger={result === 0}
        size="large"
        className="w-100 text-wrap h-100"
        onClick={() => {
          !isSubmited && setOpen(true);
        }}
      >
        {text}
      </Button>
      <Modal
        title="Kiểm tra chỉ tiêu 1"
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
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{
            data: (checksheet.data ?? []).map((e) => {
              return { id: e.id };
            }),
          }}
          colon={false}
          {...formItemLayout}
        >
          <Form.Item hidden name={"result"}></Form.Item>
          <Form.List name={"data"}>
            {(fields, { add, remove }, { errors }) =>
              (checksheet.data ?? []).map((e, index) => {
                return (
                  <Row
                    gutter={8}
                    className={index === 0 ? "" : "mt-2"}
                    key={index}
                  >
                    <Col
                      span={12}
                      style={{ paddingInline: 4 }}
                      className="d-flex justify-content-center flex-wrap align-items-lg-center"
                    >
                      <div
                        className="d-flex justify-content-center align-content-center flex-grow-1 align-items-lg-center p-2"
                        style={{ backgroundColor: "#EBEBEB", height: "100%" }}
                      >
                        {e.hang_muc}
                      </div>
                    </Col>
                    <Col span={12}>
                      <Form.Item name={[index, "id"]} hidden></Form.Item>
                      <Form.Item
                        name={[index, "result"]}
                        noStyle
                        rules={[
                          { required: true, message: "Không được để trống" },
                        ]}
                      >
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
              })
            }
          </Form.List>
          <Divider></Divider>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default Checksheet1;
