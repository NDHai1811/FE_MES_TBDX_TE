import React, { useRef } from "react";
import { Modal, Row, Col, Table, message } from "antd";
import "./PopupQuetQr.css";
import ScanQR from "../Scanner";
import { useState } from "react";
import { getScanList, sendResultScan } from "../../api/oi/warehouse";
import { useEffect } from "react";
import { DeleteOutlined } from "@ant-design/icons";

const SCAN_TIME_OUT = 1000;

function PopupNhapKhoNvl(props) {
  const { visible, setVisible, setCurrentScan, getLogs, getOverAll } = props;
  const ScanNhapNvl = JSON.parse(window.localStorage.getItem("ScanNhapNvl"));
  const list = ScanNhapNvl?.data;
  const [data, setData] = useState(list ?? []);
  const [currentData, setCurrentData] = useState("");
  const scanTarget = ScanNhapNvl?.target ?? 'material_id';
  const [messageApi, contextHolder] = message.useMessage();
  const scanRef = useRef();

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

  useEffect(() => {
    if (currentData) {
      getData();
    }
  }, [currentData]);

  const handleDelete = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  const getData = async () => {
    if(scanTarget === 'material_id' && data.some(e=>e.id === currentData)){
      messageApi.warning('Đã quét mã cuộn này');
      setCurrentData("");
      return 0;
    }
    var res = await getScanList({ [scanTarget]: currentData })
    if (res.success) {
      if (scanTarget === 'locator_id') {
        if (data.some(e => !e.locator_id)) {
          const item = data.find((val) => !val.locator_id);
          const newData = data.map((val) => {
            if (val.material_id === item.material_id) {
              val.locator_id = currentData;
            }
            return {
              ...val,
            };
          });
          setData(newData);
        }
      } else {
        setData(oldData => [...oldData, res.data]);
      }
    }
    setCurrentData("");
  };

  const sendResult = () => {
    if (data.length <= 0) {
      messageApi.warning('Không có dữ liệu')
      return 0;
    }
    if (data.some(e => !e.locator_id)) {
      messageApi.warning('Chưa nhập đầy đủ vị trí');
      return 0;
    }
    sendResultScan(data)
      .then((res) => {
        if (res.success) {
          window.localStorage.removeItem("ScanNhapNvl");
          getLogs?.();
          getOverAll?.();
        }
        handleCancel();
      })
      .catch((err) => console.log("Gửi dữ liệu thất bại: ", err));
  };

  const handleOk = () => {
    window.localStorage.setItem("ScanNhapNvl", JSON.stringify({ data: data, target: 'locator_id' }));
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onScanResult = (value) => {
    console.log(value);
    if (scanRef.current) {
      clearTimeout(scanRef.current);
    }
    scanRef.current = setTimeout(() => {
      setCurrentData(value)
    }, SCAN_TIME_OUT);
  };

  return (
    <div>
      {contextHolder}
      <Modal
        title="Quét mã"
        open={visible}
        onOk={!list ? handleOk : sendResult}
        okText={!list ? "Lưu" : "Xong"}
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
