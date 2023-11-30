import React, { useState } from "react";
import { Modal, Row, Col } from "antd";
import {
  QrcodeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import "./PopupQuetQr.css";

function PopupQuetQr(props) {
  const [value, setValue] = useState(null);

  const { visible, setVisible } = props;

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Modal
        title="Mapping"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row className="table-row">
          <Col
            span={8}
            className="table-cell"
            style={{ paddingTop: 8, paddingBottom: 8 }}
          >
            Tiêu đề
          </Col>
          <Col
            span={8}
            className="table-cell"
            style={{ borderLeftWidth: 0, paddingTop: 8, paddingBottom: 8 }}
          >
            {!value && <QrcodeOutlined style={{ fontSize: "24px" }} />}
          </Col>
          <Col
            span={8}
            className="table-cell"
            style={{ borderLeftWidth: 0, paddingTop: 8, paddingBottom: 8 }}
          >
            {value ? (
              <CheckCircleOutlined
                disabled
                style={{ color: "green", fontSize: "24px" }}
              />
            ) : (
              <CloseCircleOutlined
                disabled
                style={{ color: "red", fontSize: "24px" }}
              />
            )}
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default PopupQuetQr;
