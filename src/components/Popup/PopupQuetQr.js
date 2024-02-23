import React, { useState, useMemo } from "react";
import { Modal, Row, Col, Table, message, Input } from "antd";
import "./PopupQuetQr.css";
import ScanQR from "../Scanner";
import { useEffect } from "react";
import {
  getEquipmentMappingList,
  mappingCheckMaterial,
  sendMappingResult,
} from "../../api/oi/equipment";

function PopupQuetQr(props) {
  const { visible, setVisible, loSx, setSelectedItem, getLogs } = props;
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [checkData, setCheckData] = useState([]);
  const [currentResult, setCurrentResult] = useState("");
  const [currentValue, setCurrentValue] = useState("");

  const resultQuantity = checkData?.reduce((sum, val) => {
    return val.isDone ? sum + 1 : sum;
  }, 0);

  const [messageApi, contextHolder] = message.useMessage();

  const messageAlert = (content, type = "error") => {
    messageApi.open({
      type,
      content,
      className: "custom-class",
      style: {
        marginTop: "50%",
      },
    });
  };

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

  const setCurrentData = (result) => {
    const index = data.findIndex((item) =>
      Object.values(item).some((val) => val === "")
    );
    console.log(data, index);
    const newData = data.map((val, i) => {
      if (index === i) {
        const emptyKey = Object.keys(val).find((key) => val[key] === "");
        const emptyKeys = Object.keys(val);
        const lastedEmptyKey = emptyKeys.find(
          (it, keyIndex) => keyIndex === emptyKeys.length - 1
        );

        if (emptyKey === "vi_tri") {
          // if (result === checkData[index]?.vi_tri) {
          const isLocation = checkData?.some((val) => val?.vi_tri === result && val.isDone === false);
          console.log(checkData, isLocation, result);
          if (isLocation) {
            val.vi_tri = result;
          } else {
            message.info("Mã vị trí không đúng, Vui lòng quét lại");
          }
        } else if (emptyKey === lastedEmptyKey) {
          const itemByIndex = data.find((it, itIndex) => itIndex === index);
          const nonViTriValues = Object.keys(itemByIndex).filter(
            (key) => key !== "vi_tri" && key !== lastedEmptyKey
          );
          let values = nonViTriValues.map((key) => itemByIndex[key]);
          values.push(result);

          // Xử lý khi xong tất cả 1 dòng thì gọi api để check value
          mappingCheckMaterial({
            lo_sx: loSx,
            vi_tri: itemByIndex.vi_tri,
            value: values,
          })
            .then(() => setCurrentResult(""))
            .catch(() => {
              const newData = data.map((item, i) => {
                if (i === index) {
                  const emptyValues = Object.keys(item).reduce((acc, key) => {
                    acc[key] = "";
                    return acc;
                  }, {});
                  return emptyValues;
                }
                return item;
              });
              setData(newData);
            });
          val[emptyKey] = result;
          setCheckData(
            checkData.map((it, itemIndex) => {
              if (it.vi_tri === itemByIndex.vi_tri) {
                it.isDone = true;
              }
              return { ...it };
            })
          );
        } else {
          val[emptyKey] = result;
        }
      }
      return { ...val };
    });
    setData(newData);
  };

  const handleEnterPress = () => {
    setCurrentData(currentValue);
    setCurrentValue("");
  };

  const onChangeValue = (e) => {
    const inputValue = e.target.value;
    setCurrentValue(inputValue);
  };

  const onSendResult = () => {
    sendMappingResult({ lo_sx: loSx })
      .then((res) => {
        if (res.data) {
          setSelectedItem?.((prevItems) =>
            prevItems.map((item) => ({
              ...item,
              mapping: "Đã mapping",
            }))
          );
          getLogs?.();
        }
      })
      .catch((err) => console.log("Gửi dữ liệu mapping thất bại: ", err));
  };

  useEffect(() => {
    if (currentResult) {
      setCurrentData(currentResult);
    }
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

      const list = res.data?.position?.map(() => {
        const result = keys.reduce((acc, key) => {
          acc[key] = "";
          return acc;
        }, {});
        return result;
      });
      setData(list);
      console.log()
      setCheckData(
        res.data?.position?.map((val) => ({ vi_tri: val, isDone: false }))
      );
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

  useEffect(()=>{
    console.log(data);
  }, [data])

  return (
    <div>
      {contextHolder}
      <Modal
        title="Mapping"
        open={visible}
        cancelButtonProps={{ style: { display: "none" } }}
        onCancel={cancel}
        okButtonProps={{ style: { display: "none" } }}
      >
        <ScanQR isHideButton={true} onResult={(res) => onScanResult(res)} />
        <Input
          placeholder="Nhập giá trị"
          onPressEnter={handleEnterPress}
          style={{ marginTop: 16, height: 50 }}
          value={currentValue}
          onChange={onChangeValue}
        />
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
