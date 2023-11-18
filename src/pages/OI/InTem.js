import React, { useEffect, useState, useRef } from "react";
import { QrcodeOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Button,
  Table,
  Modal,
  Input,
  Form,
  InputNumber,
  message,
  Space,
  Select,
} from "antd";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import dayjs from "dayjs";
import TemThung from "./Warehouse/TemThung";
import { useReactToPrint } from "react-to-print";
import { listProduct, taoTem } from "../../api";

const InTem = (props) => {
  document.title = "In Tem";
  const [data, setData] = useState([]);
  const [listTem, setListTem] = useState([]);
  const [options, setOptions] = useState([]);
  const [form] = Form.useForm();
  const componentRef1 = useRef();
  useEffect(() => {
    (async () => {
      const res = await listProduct();
      setOptions(res);
    })();
  }, []);
  const handlePrint = useReactToPrint({
    content: () => componentRef1.current,
  });
  const onFinish = async (values) => {
    const res = await taoTem(values);
    setListTem(res);
  };
  useEffect(() => {
    if (listTem.length > 0) {
      handlePrint();
      setListTem([]);
    }
  }, [listTem.length]);

  return (
    <React.Fragment>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row className="mt-3 ml-10" gutter={[24, 0]}>
          <Col span={12}>
            <Form.Item label="Lô sản xuất" name="lo_sx">
              <Input placeholder="Nhập lô sản xuất" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Tên sản phẩm" name="product_id">
              <Select
                options={options}
                placeholder="Chọn tên sản phẩm"
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Số thùng" name="number_bin">
              <InputNumber
                placeholder="Nhập số lượng thùng"
                className="w-100"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Số lượng" name="so_luong">
              <InputNumber
                placeholder="Nhập số lượng trên thùng"
                className="w-100"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Button type="primary" htmlType="submit" className="w-100">
              In Tem
            </Button>
          </Col>
        </Row>
      </Form>
      <div className="report-history-invoice">
        <TemThung listCheck={listTem} ref={componentRef1} />
      </div>
    </React.Fragment>
  );
};

export default InTem;
