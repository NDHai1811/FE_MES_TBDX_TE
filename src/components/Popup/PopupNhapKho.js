import React from "react";
import { Modal, Row, Col, Table, message } from "antd";
import "./PopupQuetQr.css";
import ScanQR from "../Scanner";
import { useState } from "react";
import { getScanList, sendResultScan } from "../../api/oi/warehouse";
import { useEffect } from "react";

const columns = [
  {
    title: "Mã cuộn",
    dataIndex: "material_id",
    key: "material_id",
    align: "center",
    render: (value, record) => (
      <span style={{ color: record.status === 1 ? "black" : "gray" }}>
        {value}
      </span>
    ),
  },
  {
    title: "Số kg",
    dataIndex: "so_kg",
    key: "so_kg",
    align: "center",
    render: (value, record) => (
      <span style={{ color: record.status === 1 ? "black" : "gray" }}>
        {value}
      </span>
    ),
  },
  {
    title: "Vị trí",
    dataIndex: "locator_id",
    key: "locator_id",
    align: "center",
    render: (value, record) => (
      <span style={{ color: record.status === 1 ? "black" : "gray" }}>
        {value}
      </span>
    ),
  },
];

function PopupNhapKhoNvl(props) {
  const { visible, setVisible, setCurrentScan } = props;
  const items = JSON.parse(window.localStorage.getItem("ScanNhapNvl"));
  const [data, setData] = useState(items || []);
  const [currentData, setCurrentData] = useState("");

  useEffect(() => {
    if (currentData) {
      getData();
    }
  }, [currentData]);

  const getData = () => {
    getScanList({ material_id: currentData })
      .then((res) => {
        const response = JSON.parse(window.localStorage.getItem("ScanNhapNvl"));
        if (response?.length > 0) {
          response.map((val) => {
            if (val.material_id === currentData) {
              val.status = 1;
            }
            return { ...val };
          });
        }
        window.localStorage.setItem(
          "ScanNhapNvl",
          response?.length > 0
            ? JSON.stringify(response)
            : JSON.stringify(res.data)
        );
        setData(response?.length > 0 ? response : res.data);
        setCurrentScan([res.data[0]]);
      })
      .catch((err) => console.log("Lấy danh sách scan thất bại: ", err));
  };

  const sendResult = () => {
    const resData = data
      ?.filter((item) => item.status === 1)
      .map((val) => ({ material_id: val.material_id }));
    sendResultScan(resData)
      .then((res) => console.log(res))
      .catch((err) => console.log("Gửi dữ liệu thất bại: ", err));
  };

  const handleOk = () => {
    sendResult();
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onScanResult = (value) => {
    setCurrentData(value);
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
        <ScanQR isHideButton={true} onResult={(res) => onScanResult(res)} />
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

export default PopupNhapKhoNvl;
