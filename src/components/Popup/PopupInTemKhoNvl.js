import React, { useState, useRef, useEffect } from "react";
import { Modal, Row, Col, Table, Input, Button, message } from "antd";
import "./PopupQuetQr.css";
import { getScanList, handleNGMaterial, sendResultPrint, sendResultReimport } from "../../api/oi/warehouse";
import ScanQR from "../Scanner";
import { DeleteOutlined } from "@ant-design/icons";

const SCAN_TIME_OUT = 1000;

function PopupInTemKhoNvl(props) {
  const { visible, setVisible, setCurrentScan, getLogs, getOverAll } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const NhapLaiNvl = JSON.parse(window.localStorage.getItem("NhapLaiNvl"));
  const list = NhapLaiNvl?.data;
  const scanTarget = NhapLaiNvl?.target ?? 'material_id';
  const [materials, setMaterials] = useState(list || []);
  const [currentData, setCurrentData] = useState("");
  const scanRef = useRef();
  const [currentValue, setCurrentValue] = useState("");

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
      render: (text, record, index) => (
        <Input
          type="number"
          value={record.so_kg}
          onChange={(e) => onChangeQuantity(e.target.value, index)}
          placeholder="Nhập kg..."
          style={{ width: 100 }}
          min={0}
          disabled={list}
        />
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

  const onChangeQuantity = (value, index) => {
    const newItems = materials.map((val, i) => {
      if (i === index) {
        val.so_kg = value;
      }
      return { ...val };
    });
    setMaterials(newItems);
  };

  const handleDelete = (index) => {
    const newData = [...materials];
    newData.splice(index, 1);
    setMaterials(newData);
  };

  const sendResult = () => {
    if (materials.length <= 0) {
      messageApi.warning('Không có dữ liệu')
      return 0;
    }
    if (materials.some(e => !e.so_kg || e <= 0)) {
      messageApi.warning('Số lượng nhập kho không được bằng 0');
      return 0;
    }
    if (materials.some(e => !e.locator_id)) {
      messageApi.warning('Chưa nhập đầy đủ vị trí');
      return 0;
    }
    sendResultReimport(materials)
      .then((res) => {
        if (res.success) {
          window.localStorage.removeItem("NhapLaiNvl");
          setVisible(false);
          getLogs?.();
          getOverAll?.();
        }
      })
      .catch((err) => console.log("Gửi dữ liệu in tem thất bại: ", err));
  };

  const getData = async () => {
    if (scanTarget === 'material_id' && materials.some(e => e.id === currentData)) {
      messageApi.warning('Đã quét mã cuộn này');
      setCurrentData("")
      return 0;
    }
    var res = await getScanList({ [scanTarget]: currentData })
    if (res.success) {
      if (scanTarget === 'locator_id') {
        if (materials.some(e => !e.locator_id)) {
          const item = materials.find((val) => !val.locator_id);
          const newData = materials.map((val) => {
            if (val.material_id === item.material_id) {
              val.locator_id = currentData;
            }
            return {
              ...val,
            };
          });
          setMaterials(newData);
        }
      } else {
        setMaterials(oldData => [...oldData, res.data]);
      }
    }
    setCurrentData("")
  }

  useEffect(() => {
    if (currentData) {
      getData();
    }
  }, [currentData]);

  const handleOk = () => {
    sendResult();
  };

  const save = () => {
    if (materials.length > 0) {
      window.localStorage.setItem("NhapLaiNvl", JSON.stringify({ data: materials, target: 'locator_id' }));
      handleClose();
    }
  };

  const handleCancel = () => {
    window.localStorage.removeItem("NhapLaiNvl");
    setVisible(false);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const onScan = (result) => {
    if (scanRef.current) {
      clearTimeout(scanRef.current);
    }
    scanRef.current = setTimeout(() => {
      setCurrentData(result)
    }, SCAN_TIME_OUT);
  };

  const moveToKho13 = () => {
    console.log(materials);
    if (materials.some(e => !e.so_kg || e.so_kg <= 0)) {
      messageApi.warning('Số lượng nhập kho không được bằng 0');
      return 0;
    }
    handleNGMaterial({ data: materials })
      .then((res) => {
        console.log({ res });
        setMaterials([]);
        window.localStorage.removeItem("NhapLaiNvl");
        handleCancel();
      })
      .catch((err) => console.log("Gửi dữ liệu in tem thất bại: ", err));
  };
  const handleEnterPress = () => {
    setCurrentData(currentValue);
    setCurrentValue("");
  };
  const onChangeValue = (e) => {
    const inputValue = e.target.value;
    setCurrentValue(inputValue);
  };
  return (
    <div>
      {contextHolder}
      <Modal
        title="Nhập lại"
        open={visible}
        footer={[
          <Button onClick={handleCancel}>Huỷ</Button>,
          <Button type="primary" danger onClick={moveToKho13}>
            Khu 13
          </Button>,
          <Button type="primary" onClick={!list ? save : handleOk}>
            {!list ? "Lưu" : "Xong"}
          </Button>,
        ]}
        onCancel={handleClose}
      >
        <Row className="mt-2">
          <Col span={24}>
            <ScanQR isHideButton={true} onResult={(res) => onScan(res)} />
          </Col>
          <Input
            placeholder="Nhập giá trị"
            onPressEnter={handleEnterPress}
            style={{ marginTop: 16, height: 50 }}
            value={currentValue}
            onChange={onChangeValue}
          />
          <Col span={24}>
            <Table
              size="small"
              pagination={false}
              bordered
              className="mt-3"
              locale={{ emptyText: "Trống" }}
              columns={columns}
              dataSource={materials}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default PopupInTemKhoNvl;
