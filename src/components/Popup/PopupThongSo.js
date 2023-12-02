import React, { useEffect, useState } from "react";
import { Modal, Row, Col, Input } from "antd";
import "./PopupQuetQr.css";

function PopupThongSo(props) {
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
          span={12}
          className="table-cell"
          style={{
            paddingTop: 8,
            paddingBottom: 8,
            borderTopWidth: index === 0 ? 1 : 0,
          }}
        >
          Thông số {index}
        </Col>
        <Col
          span={12}
          className="table-cell"
          style={{
            borderLeftWidth: 0,
            paddingTop: 8,
            paddingBottom: 8,
            borderTopWidth: index === 0 ? 1 : 0,
          }}
        >
          <Input
            placeholder="Nhập thông số..."
            value={value}
            style={{ marginLeft: 8, marginRight: 8 }}
          />
        </Col>
      </Row>
    );
  };

  return (
    <div>
      <Modal
        title="Thông số"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {[...Array(5).keys()].map(renderItem)}
      </Modal>
    </div>
  );
}

export default PopupThongSo;
