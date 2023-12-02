import React from "react";
import { Modal, Row, Col, Table } from "antd";
import "./PopupQuetQr.css";
import ScanQR from "../Scanner";

const columns = [
  {
    title: "BBB",
    children: [
      {
        title: "STT",
        dataIndex: "index",
        key: "index",
        align: "center",
        render: (value, record, index) => index + 1,
      },
      {
        title: "Mã lot",
        dataIndex: "lot_id",
        key: "lot_id",
        align: "center",
        render: (value) => value || "-",
      },
    ],
  },
  {
    title: "480",
    align: "center",
    children: [
      {
        title: "Số lượng",
        dataIndex: "so_luong",
        key: "so_luong",
        align: "center",
        render: (value) => value || "-",
      },
    ],
  },
];

const data = [
  {
    lot_id: "S2301",
    so_luong: "50",
  },
  {
    lot_id: "S2302",
    so_luong: "30",
  },
  {
    lot_id: "S2303",
    so_luong: "40",
  },
  {
    lot_id: "",
    so_luong: "",
  },
  {
    lot_id: "",
    so_luong: "",
  },
];

function PopupInTem(props) {
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
        title="In Tem"
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

export default PopupInTem;
