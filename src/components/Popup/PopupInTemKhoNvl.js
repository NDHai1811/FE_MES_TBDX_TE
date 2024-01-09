import React, { useState, useRef, useEffect } from "react";
import { Modal, Row, Col, Table, Input, Button, message } from "antd";
import "./PopupQuetQr.css";
import { handleNGMaterial, sendResultPrint } from "../../api/oi/warehouse";
import ScanQR from "../Scanner";
import { DeleteOutlined } from "@ant-design/icons";

const SCAN_TIME_OUT = 1000;

function PopupInTemKhoNvl(props) {
  const { visible, setVisible, setCurrentScan } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const list = JSON.parse(window.localStorage.getItem("NhapLaiNvl"));
  const [materials, setMaterials] = useState(list || []);
  const [currentData, setCurrentData] = useState("");
  const scanRef = useRef();

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
    const resData = materials.map((val) => ({
      ...val,
      so_kg: parseInt(val.so_kg, 10),
    }));

    sendResultPrint({data: resData})
      .then((res) => {
        console.log({ res });
        if(res.success){
          window.localStorage.removeItem("NhapLaiNvl");
          setVisible(false);
        }
        
        // setCurrentScan([
        //   {
        //     material_id: res.data.parent_id,
        //     so_kg: res.data.so_kg,
        //     locator_id: res.data.locator_id,
        //   },
        // ]);
      })
      .catch((err) => console.log("Gửi dữ liệu in tem thất bại: ", err));
  };

  useEffect(() => {
    if (currentData) {
      if (materials.length < 3) {
        if (materials.length > 0) {
          setMaterials([
            ...materials,
            { material_id: currentData, so_kg: "", locator_id: "" },
          ]);
        } else {
          setMaterials([
            { material_id: currentData, so_kg: "", locator_id: "" },
          ]);
        }
      }
    }
  }, [currentData]);

  const handleOk = () => {
    sendResult();
  };

  const save = () => {
    if (materials.length > 0) {
      window.localStorage.setItem("NhapLaiNvl", JSON.stringify(materials));
      handleCancel();
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onScan = (result) => {
    if (!list) {
      setCurrentData(result);
    } else {
      if (scanRef.current) {
        clearTimeout(scanRef.current);
      }
      scanRef.current = setTimeout(() => {
        if (materials.some((e) => !e.locator_id)) {
          const item = materials.find((val) => !val.locator_id);
          const newData = materials.map((val) => {
            if (val.material_id === item.material_id) {
              val.locator_id = result;
            }
            return {
              ...val,
            };
          });
          setMaterials(newData);
        }
      }, SCAN_TIME_OUT);
    }
  };

  const moveToKho13 = () => {
    const resData = materials.map((val) => ({
      ...val,
      so_kg: parseInt(val.so_kg, 10),
    }));

    handleNGMaterial({data: resData})
      .then((res) => {
        console.log({ res });
        setMaterials([]);
        handleCancel();
      })
      .catch((err) => console.log("Gửi dữ liệu in tem thất bại: ", err));
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
        onCancel={handleCancel}
      >
        <Row className="mt-2">
          <Col span={24}>
            <ScanQR isHideButton={true} onResult={(res) => onScan(res)} />
          </Col>
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
