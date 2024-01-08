import React, { useCallback, useRef } from "react";
import { Modal, Row, Col, Table, message } from "antd";
import "./PopupQuetQr.css";
import ScanQR from "../Scanner";
import { useState } from "react";
import {
  getScanList,
  saveExportsNVL,
  scanExportsNVL,
  sendResultScan,
} from "../../api/oi/warehouse";
import { useEffect } from "react";

const columns = [
  {
    title: "Mã cuộn",
    dataIndex: "material_id",
    key: "material_id",
    align: "center",
  },
  {
    title: "Số kg",
    dataIndex: "so_kg",
    key: "so_kg",
    align: "center",
  },
  {
    title: "Vị trí",
    dataIndex: "locator_id",
    key: "locator_id",
    align: "center",
    render: (value, record) => <span style={{ color: "gray" }}>{value}</span>,
  },
];

function PopupXuatKhoNvl(props) {
  const { visible, setVisible, setCurrentScan, data, setData } = props;

  const getData = async (value) => {
    var res = await scanExportsNVL({ material_id: value });
    if (res.success) {
      window.localStorage.setItem("ScanXuatNvl", JSON.stringify(res.data));
      setData(res.data);
      setCurrentScan(res.data);
    }
  }
  const [messageApi, contextHolder] = message.useMessage();

  const sendResult = async (data) => {
    var res = await saveExportsNVL(data);
    if (res.success) handleCancel();
  };

  const handleCancel = () => {
    window.localStorage.removeItem("ScanXuatNvl");
    setVisible(false);
    setData();
  };
  const onScanResult = (value) => {
    const data = JSON.parse(window.localStorage.getItem("ScanXuatNvl"));
    if (value && data) {
      if(value !== data.material_id){
        sendResult({ ...data, locator_id: value });
      }
    } else if(value && !data) {
      getData(value);
    }
  };

  return (
    <div>
      {contextHolder}
      <Modal
        title="Quét mã"
        open={visible}
        onCancel={handleCancel}
        okButtonProps={{ style: { display: "none" } }}
      >
        <ScanQR
          isHideButton={true}
          onResult={(res) => onScanResult(res)}
        />
        <Row className="mt-3">
          <Col span={24}>
            <Table
              size="small"
              pagination={false}
              bordered
              columns={columns}
              dataSource={data ? [data] : []}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default PopupXuatKhoNvl;
