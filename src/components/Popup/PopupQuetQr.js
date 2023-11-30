import React, { useState } from "react";
import { Modal, Row, Col } from "antd";
import {
  QrcodeOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./PopupQuetQr.css";
import ScanQR from "../Scanner";

function PopupQuetQr(props) {
  const [value, setValue] = useState(null);

  const { visible, setVisible } = props;

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const renderItem = (item, index) => {
    return (
      <Row className="table-row">
        <Col
          span={8}
          className="table-cell"
          style={{
            paddingTop: 8,
            paddingBottom: 8,
            borderTopWidth: 0,
          }}
        >
          Chỉ tiêu {index}
        </Col>
        <Col
          span={8}
          className="table-cell"
          style={{
            borderLeftWidth: 0,
            paddingTop: 8,
            paddingBottom: 8,
            borderTopWidth: 0,
          }}
        >
          {value || "-"}
        </Col>
        <Col
          span={8}
          className="table-cell"
          style={{
            borderLeftWidth: 0,
            paddingTop: 8,
            paddingBottom: 8,
            borderTopWidth: 0,
          }}
        >
          {value ? (
            <CheckOutlined
              disabled
              style={{ color: "green", fontSize: "24px" }}
            />
          ) : (
            <CloseOutlined
              disabled
              style={{ color: "red", fontSize: "24px" }}
            />
          )}
        </Col>
      </Row>
    );
  };

  return (
    <div>
      <Modal
        title="Mapping"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ScanQR />
        {[...Array(5).keys()].map(renderItem)}
      </Modal>
    </div>
  );
}

export default PopupQuetQr;
