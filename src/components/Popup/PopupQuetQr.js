import React, { useState, useMemo } from "react";
import { Modal, Row, Col, Table, message } from "antd";
import "./PopupQuetQr.css";
import ScanQR from "../Scanner";
import { useEffect } from "react";
import {
  getEquipmentMappingList,
  mappingCheckMaterial,
  sendMappingResult,
} from "../../api/oi/equipment";

function PopupQuetQr(props) {
  const { visible, setVisible, loSx, setSelectedItem } = props;
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [checkData, setCheckData] = useState([]);
  const [currentResult, setCurrentResult] = useState("");

  const resultQuantity = checkData?.reduce((sum, val) => {
    return val.isScan ? sum + 1 : sum;
  }, 0);

  useEffect(() => {
    getMappingList();
  }, []);

  useEffect(() => {
    if (resultQuantity === checkData.length && checkData.length > 0) {
      cancel();
      onSendResult();
    }
  }, [resultQuantity]);

  // const onCheckMaterial = async () => {
  //   return await mappingCheckMaterial({ material_id: currentResult });
  // };

  const onSendResult = () => {
    sendMappingResult({ lo_sx: loSx })
      .then((res) => {
        console.log(res.data);
        setSelectedItem?.((prevItems) =>
          prevItems.map((item) => ({
            ...item,
            mapping: "Đã mapping",
          }))
        );
      })
      .catch((err) => console.log("Gửi dữ liệu mapping thất bại: ", err));
  };

  useEffect(() => {
    (async () => {
      if (currentResult) {
        const item = checkData.find((val) => !val.isScan);
        let result = currentResult;
        if (item.check_api === 1) {
          result = await mappingCheckMaterial({ material_id: currentResult });
        }
        if (result === item.value) {
          setData(data.map((val) => ({ ...val, [item.key]: currentResult })));
          setCheckData(
            checkData.map((val) => {
              return val.key === item.key ? { ...val, isScan: true } : val;
            })
          );
        } else {
          message.error("Mã không đúng yêu cầu");
        }
      }
    })();
  }, [currentResult]);

  const getMappingList = async () => {
    try {
      const res = await getEquipmentMappingList({ lo_sx: loSx });
      const keys = res.data.key;
      const columns = res.data.label.map((item, index) => {
        const key = keys[index];
        return {
          title: item,
          dataIndex: key,
          key: key,
          align: "center",
          render: (value) => value || "-",
        };
      });
      setColumns(columns);

      const result = keys.map((key) => ({ [key]: "" }));
      setData([result]);

      const checkData = res.data.check_api.map((val, index) => ({
        check_api: val,
        value: res.data.value[index],
        isScan: false,
        key: keys[index],
      }));
      setCheckData(checkData);
    } catch (err) {
      console.log("Lấy danh sách mapping thất bại: ", err);
    }
  };

  const onScanResult = (value) => {
    setCurrentResult(value);
  };

  const cancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Modal
        title="Mapping"
        open={visible}
        cancelButtonProps={{ style: { display: "none" } }}
        onCancel={cancel}
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

export default PopupQuetQr;
