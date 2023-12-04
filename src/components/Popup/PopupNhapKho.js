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
      <span style={{ color: record.isScanLocation ? "black" : "gray" }}>
        {value}
      </span>
    ),
  },
];

function PopupNhapKhoNvl(props) {
  const { visible, setVisible, setCurrentScan } = props;
  const list = JSON.parse(window.localStorage.getItem("ScanNhapNvl"));
  const [data, setData] = useState(list || []);
  const [currentData, setCurrentData] = useState("");

  useEffect(() => {
    if (currentData) {
      getData();
    }
  }, [currentData]);

  const getData = () => {
    getScanList({ material_id: currentData })
      .then((res) => {
        if (res.data.length > 1) {
          const items = data?.map((val) => {
            if (val.material_id === currentData) {
              val.status = 1;
            }
            return {
              ...val,
            };
          });
          setData(
            data?.length > 0
              ? items
              : res.data?.map((val) => ({ ...val, isScanLocation: false }))
          );
        } else if (res.data.length === 1) {
          window.localStorage.setItem(
            "ScanNhapNvl",
            JSON.stringify(
              res.data?.map((val) => ({ ...val, isScanLocation: false }))
            )
          );
          handleCancel();
        }
        setCurrentScan([res.data[0]]);
      })
      .catch((err) => {
        console.log("Lấy danh sách scan thất bại: ", err);
        message.error("Mã cuộn không tồn tại");
      });
  };

  const sendResult = () => {
    const materialIds = data
      ?.filter((item) => item.status === 1)
      .map((val) => val.material_id);
    const resData = {
      material_id: materialIds,
      locator_id: data[0].locator_id,
    };
    sendResultScan(resData)
      .then((res) => {
        console.log(res);
        window.localStorage.removeItem("ScanNhapNvl");
      })
      .catch((err) => console.log("Gửi dữ liệu thất bại: ", err));
  };

  const onScanLocation = (value) => {
    const id = data.find(
      (val) => val.locator_id === value && !val.isScanLocation
    )?.material_id;

    const items = data.map((val) => {
      if (val.material_id === id) {
        val.isScanLocation = true;
      }
      return { ...val };
    });

    setData(items);
  };

  const handleOk = () => {
    if (list) {
      sendResult();
    } else {
      window.localStorage.setItem("ScanNhapNvl", JSON.stringify(data));
    }
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onScanResult = (value) => {
    if (list) {
      const isLocation = data.filter((val) => val.locator_id === value);
      if (isLocation?.length > 0) {
        onScanLocation(value);
      } else {
        message.error(
          "Vị trí hiện tại không đúng, xin vui lòng quét vị trí lại"
        );
      }
    } else {
      setCurrentData(value);
    }
  };

  return (
    <div>
      <Modal
        title="In Tem"
        open={visible}
        onOk={handleOk}
        okText={list ? "Gửi dữ liệu" : "Lưu"}
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
