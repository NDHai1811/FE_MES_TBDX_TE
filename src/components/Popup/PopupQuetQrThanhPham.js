import React from "react";
import { Modal, Row, Col, Table, message } from "antd";
import "./PopupQuetQr.css";
import ScanQR from "../Scanner";
import { useState } from "react";
import { importData } from "../../api/oi/warehouse";
import { useEffect } from "react";
import { DeleteOutlined } from "@ant-design/icons";

function PopupQuetQrThanhPham(props) {
  const { visible, setVisible, getLogs } = props;
  const [data, setData] = useState([{ pallet_id: "", locator_id: "" }]);
  const [currentData, setCurrentData] = useState("");

  const columns = [
    {
      title: "Mã tem",
      dataIndex: "pallet_id",
      key: "pallet_id",
      align: "center",
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
      render: (text, record) =>
        record.pallet_id && (
          <DeleteOutlined
            style={{ color: "red", fontSize: 18 }}
            onClick={handleDelete}
          />
        ),
    },
  ];

  useEffect(() => {
    if (currentData) {
      const newData = data.map((val) => {
        if (!val.pallet_id) {
          val.pallet_id = currentData;
        } else {
          val.locator_id = currentData;
        }
        return { ...val };
      });
      setData(newData);
    }
  }, [currentData]);

  const handleDelete = () => {
    setData([{ pallet_id: "", locator_id: "" }]);
  };

  const sendResult = () => {
    importData(data[0])
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          getLogs?.();
          message.success("Nhập kho thành phẩm thành công!");
          handleCancel();
        }
      })
      .catch((err) => {
        console.log("Nhập kho thành phẩm thất bại: ", err);
        message.error("Nhập kho thành phẩm thất bại!");
      });
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
        title="Quét mã"
        open={visible}
        onOk={sendResult}
        okText={"Lưu"}
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

export default PopupQuetQrThanhPham;
