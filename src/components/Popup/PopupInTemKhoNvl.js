import React, { useState } from "react";
import { Modal, Row, Col, Table, Input } from "antd";
import "./PopupQuetQr.css";
import { sendResultPrint } from "../../api/oi/warehouse";

function PopupInTemKhoNvl(props) {
  const { visible, setVisible, data } = props;

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
    {
      title: "Vị trí",
      dataIndex: "locator_id",
      key: "locator_id",
      align: "center",
    },
  ];

  const sendResult = () => {
    sendResultPrint({
      material_id: data?.[0]?.material_id,
      so_kg: parseInt(value, 10),
    })
      .then((res) => console.log(res.data))
      .catch((err) => console.log("Gửi dữ liệu in tem thất bại: ", err));
  };

  const handleOk = () => {
    sendResult();
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
        <Row className="mt-3">
          <Col span={24}>
            <Table
              size="small"
              pagination={false}
              bordered
              columns={columns}
              dataSource={data || []}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default PopupInTemKhoNvl;
