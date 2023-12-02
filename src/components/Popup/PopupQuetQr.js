import React, { useState } from "react";
import { Modal, Row, Col, Table } from "antd";
import "./PopupQuetQr.css";
import ScanQR from "../Scanner";

const columns = [
  {
    title: "Vị trí",
    dataIndex: "vi_tri",
    key: "vi_tri",
    align: "center",
    width: "25%",
  },
  {
    title: "Mã film",
    dataIndex: "film_id",
    key: "film_id",
    align: "center",
    width: "25%",
  },
  {
    title: "Mã mực",
    dataIndex: "ma_muc",
    key: "ma_muc",
    align: "center",
    width: "25%",
  },
  {
    title: "OK/NG",
    dataIndex: "ok_ng",
    key: "ok_ng",
    align: "center",
    width: "25%",
  },
];

const data = [
  {
    vi_tri: "Khối in",
    film_id: "",
    ma_muc: "",
    ok_ng: "",
  },
];

function PopupQuetQr(props) {

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
        open={visible}
        onOk={handleOk}
        okText="Lưu"
        onCancel={handleCancel}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <ScanQR isHideButton={true} />
        <Row className="mt-3">
          <Col span={24}>
            <Table
              // scroll={{
              //   x: "170vw",
              // }}
              size="small"
              pagination={false}
              bordered
              columns={columns}
              dataSource={data}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default PopupQuetQr;
