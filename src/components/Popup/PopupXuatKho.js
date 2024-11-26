import React, { useCallback, useRef } from "react";
import { Modal, Row, Col, Table, message, Input } from "antd";
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
import { DeleteOutlined } from "@ant-design/icons";



function PopupXuatKhoNvl(props) {
  const { visible, setVisible, setCurrentScan } = props;
  const ScanXuatNvl = JSON.parse(window.localStorage.getItem("ScanXuatNvl"));
  const [data, setData] = useState(ScanXuatNvl);
  const [currentValue, setCurrentValue] = useState();
  const columns = [
    {
      title: "Mã cuộn",
      dataIndex: "material_id",
      key: "material_id",
      align: "center",
    },
    {
      title: "Mã NCC",
      dataIndex: "ma_cuon_ncc",
      key: "ma_cuon_ncc",
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
    {
      title: "Tác vụ",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record, index) => (
        <DeleteOutlined
          style={{ color: "red", fontSize: 18 }}
          onClick={() => handleDelete(index)}
        />
      ),
    },
  ];
  const getData = async () => {
    if (data && currentValue !== data.id) {
      sendResult({ ...data, locator_id: currentValue });
    }else{
      var res = await scanExportsNVL({ material_id: currentValue });
      if (res.success) {
        window.localStorage.setItem("ScanXuatNvl", JSON.stringify(res.data));
        setData(res.data);
        setCurrentScan(res.data);
      }
    }
    
    setCurrentValue("");
  }
  useEffect(()=>{
    if(currentValue){
      getData();
    }
  }, [currentValue])
  
  const handleDelete = (index) => {
    setData();
    window.localStorage.removeItem("ScanXuatNvl");
    setCurrentScan()
  };

  const sendResult = async (data) => {
    var res = await saveExportsNVL(data);
    if (res.success) handleCancel();
  };

  const handleCancel = () => {
    window.localStorage.removeItem("ScanXuatNvl");
    setVisible(false);
    setData();
    setCurrentScan();
  };
  const scanRef = useRef();
  const onScanResult = (value) => {
    console.log(value);
    if (scanRef.current) {
      clearTimeout(scanRef.current);
    }
    scanRef.current = setTimeout(() => {
      setCurrentValue(value);
    }, 1000);
  };
  const handleEnterPress = (event) => {
    setCurrentValue(event.target.value);
  };
  const onChangeValue = (e) => {
    // const inputValue = e.target.value;
    // setCurrentValue(inputValue);
  };
  
  return (
    <div>
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
        <Input
          placeholder="Nhập giá trị"
          onPressEnter={handleEnterPress}
          style={{ marginTop: 16, height: 50 }}
          onChange={onChangeValue}
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
