import React, { useState } from "react";
import { Modal, Row, Col, Table, Input, Button, Space, message } from "antd";
import "./PopupQuetQr.css";
import { handleNGMaterial, sendResultPrint } from "../../api/oi/warehouse";
import ScanButton from "../Button/ScanButton";
import ScanQR from "../Scanner";

function PopupInTemKhoNvl(props) {
  const { visible, setVisible, data, setCurrentScan } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [value, setValue] = useState("");

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
      render: () => (
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Nhập kg..."
          style={{ width: 100 }}
        />
      ),
    },
  ];

  const sendResult = () => {
    sendResultPrint({
      material_id: data?.[0]?.material_id,
      so_kg: parseInt(value, 10),
    })
      .then((res) => {
        console.log(res.data);
        setCurrentScan([
          {
            material_id: res.data.parent_id,
            so_kg: res.data.so_kg,
            locator_id: res.data.locator_id,
          },
        ]);
      })
      .catch((err) => console.log("Gửi dữ liệu in tem thất bại: ", err));
  };

  const handleOk = () => {
    sendResult();
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const [material, setMaterial] = useState()

  const onScan = (result) => {
    const target = data.find(e=>e.material_id === result);
    if(target){
      setMaterial(target);
      setValue(target?.so_kg)
    }else{
      messageApi.error('Không tìm thấy mã cuộn TBDX');
    }
    
  }

  const moveToKho13 = async () => {
    var res = await handleNGMaterial({
      material_id: material.material_id,
      so_kg: parseInt(value, 10),
    })
  }
  return (
    <div>
      {contextHolder}
      <Modal
        title="Nhập lại"
        open={visible}
        // onOk={handleOk}
        // okText="Lưu"
        footer={[
            <Button onClick={handleCancel}>Huỷ</Button>,
            <Button type="primary" danger onClick={moveToKho13}>Khu 13</Button>,
            <Button type="primary" onClick={handleOk}>Lưu</Button>
        ]}
        onCancel={handleCancel}
        // cancelButtonProps={{ style: { display: "none" } }}
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
              locale={{emptyText: 'Trống'}}
              columns={columns}
              dataSource={material ? [material] : []}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default PopupInTemKhoNvl;
