import React, { useRef } from "react";
import { Modal, Row, Col, Table, message } from "antd";
import "./PopupQuetQr.css";
import ScanQR from "../Scanner";
import { useState } from "react";
import { getScanList, saveExportsNVL, scanExportsNVL, sendResultScan } from "../../api/oi/warehouse";
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
    render: (value, record) => (
      <span style={{ color: record.isScanLocation ? "black" : "gray" }}>
        {value}
      </span>
    ),
  },
];

function PopupXuatKhoNvl(props) {
  const { visible, setVisible, setCurrentScan } = props;
  const [data, setData] = useState([]);

  const getData = async (value) => {
    var res = await scanExportsNVL({ material_id: value });
    setData([res.data]);
    setCurrentScan(res.data);
  };

  const sendResult = (value) => {
    const materialIds = data
      ?.filter((item) => item.status === 1)
      .map((val) => val.material_id);
    const resData = {
      material_id: materialIds,
      locator_id: value,
    };
    saveExportsNVL(resData)
      .then((res) => {
        console.log(res);
        if (res.success) handleCancel();
      })
      .catch((err) => console.log("Gửi dữ liệu thất bại: ", err));
  };

  const handleOk = () => {
    window.localStorage.setItem("ScanXuatNvl", JSON.stringify(data));
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
    setData([]);
  };
  const onScanResult = (value) => {
    console.log(data);
    if(value){
      if (data.length > 0) {
        sendResult(value);
      } else {
        getData(value);
      }
    }
  };

  return (
    <div>
      <Modal
        title="Quét mã"
        open={visible}
        onCancel={handleCancel}
        okButtonProps={{ style: { display: "none" } }}
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

export default PopupXuatKhoNvl;
