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
  const { visible, setVisible, setCurrentScan } = props;
  const [data, setData] = useState([]);

  const getData = async (value) => {
    var res = await scanExportsNVL({ material_id: value });
    if (res.success) {
      setData([res.data]);
      setCurrentScan(res.data);
      window.localStorage.setItem("ScanXuatNvl", JSON.stringify(res.data));
    }
  };

  useEffect(() => {
    window.localStorage.removeItem("ScanXuatNvl");
  }, []);
  const [messageApi, contextHolder] = message.useMessage();

  const messageAlert = (content, type = "error") => {
    messageApi.open({
      type,
      content,
      className: "custom-class",
      style: {
        marginTop: "50%",
      },
    });
  };

  const sendResult = async (data) => {
    var res = await saveExportsNVL(data);
    if (res.success) handleCancel();
  };

  const handleOk = () => {
    window.localStorage.setItem("ScanXuatNvl", JSON.stringify(data));
    setVisible(false);
  };

  const handleCancel = () => {
    window.localStorage.removeItem("ScanXuatNvl");
    setVisible(false);
    setData([]);
  };
  const onScanResult = useCallback(
    (value, data) => {
      console.log(data);
      if (value) {
        const data = JSON.parse(window.localStorage.getItem("ScanXuatNvl"));
        if (data) {
          if (data.locator_id === value) {
            sendResult(data);
          } else {
            messageAlert("Vị trí không đúng");
          }
        } else {
          getData(value);
        }
      }
    },
    [data]
  );

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
          onResult={(res) => onScanResult(res, data)}
        />
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

export default PopupXuatKhoNvl;
