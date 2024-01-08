import React from "react";
import { Modal, Row, Col, Table } from "antd";
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
  const { visible, setVisible } = props;
  const list = JSON.parse(window.localStorage.getItem("ScanNhapNvl"));
  const [data, setData] = useState(list || []);
  const [currentData, setCurrentData] = useState("");

  // const [messageApi, contextHolder] = message.useMessage();

  // const messageAlert = (content, type = "error") => {
  //   messageApi.open({
  //     type,
  //     content,
  //     className: "custom-class",
  //     style: {
  //       marginTop: "50%",
  //     },
  //   });
  // };

  useEffect(() => {
    if (currentData) {
      if (!list) {
        setData([
          ...data,
          { material_id: currentData, locator_id: "", so_kg: "" },
        ]);
      } else {
        if (!data[data.length - 1].locator_id) {
          const item = data.find((val) => !val.locator_id);
          const newData = data.map((val) => {
            if (val.material_id === item.material_id) {
              val.locator_id = currentData;
            }
            return { ...val };
          });
          setData(newData);
        }
      }
    }
  }, [currentData]);

  // useEffect(() => {
  //   if (currentData) {
  //     getData();
  //   }
  // }, [currentData]);

  // const getData = () => {
  //   getScanList({ material_id: currentData })
  //     .then((res) => {
  //       if (res.data.length > 1) {
  //         const items = data?.map((val) => {
  //           if (val.material_id === currentData) {
  //             val.status = 1;
  //           }
  //           return {
  //             ...val,
  //           };
  //         });
  //         setData(
  //           data?.length > 0
  //             ? items
  //             : res.data?.map((val) => ({ ...val, isScanLocation: false }))
  //         );
  //       } else if (res.data.length === 1) {
  //         window.localStorage.setItem(
  //           "ScanNhapNvl",
  //           JSON.stringify(
  //             res.data?.map((val) => ({ ...val, isScanLocation: false }))
  //           )
  //         );
  //         handleCancel();
  //       }
  //       console.log(data, currentData);
  //       setCurrentScan(data.find((e) => e.material_id === currentData));
  //     })
  //     .catch((err) => {
  //       console.log("Lấy danh sách scan thất bại: ", err);
  //       messageAlert("Mã cuộn không tồn tại");
  //     });
  // };

  const sendResult = () => {
    const materialIds = data.map((val) => val.material_id);
    const locatorIds = data.map((val) => val.locator_id);
    const resData = {
      material_id: materialIds,
      locator_id: locatorIds,
    };

    sendResultScan(resData)
      .then((res) => {
        if (res.success) window.localStorage.removeItem("ScanNhapNvl");
        handleCancel();
      })
      .catch((err) => console.log("Gửi dữ liệu thất bại: ", err));
  };

  const handleOk = () => {
    window.localStorage.setItem("ScanNhapNvl", JSON.stringify(data));
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
      {/* {contextHolder} */}
      <Modal
        title="Quét mã"
        open={visible}
        onOk={!list ? handleOk : sendResult}
        okText={!list ? "Xong" : "Lưu"}
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
