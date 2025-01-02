import React from "react";
import { Modal, Row, Col, Table, Popconfirm } from "antd";
import "./PopupQuetQr.css";
import ScanQR from "../Scanner";
import { useState } from "react";
import { useEffect } from "react";
import {
  checkLoSX,
  getInfoPallet,
  sendStorePallet,
  updatePallet,
} from "../../api/oi/warehouse";

import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
function PopupScanPallet(props) {
  const {
    visible,
    setVisible,
    setResData,
    setSelectedItem,
    setListCheck,
    setResult,
  } = props;
  const [currentResult, setCurrentResult] = useState("");
  const [data, setData] = useState([]);
  const [palletId, setPalletId] = useState("");
  const [item, setItem] = useState({pallet_id: "", so_luong: 0, locator_id: ""});
  const [loading, setLoading] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState(0);
  useEffect(()=>{
    setTotalQuantity(data?.reduce((sum, val) => sum + parseInt(val?.so_luong), 0));
  }, [data])
  const columns = [
    {
      title: palletId ?? "Mã pallet",
      children: [
        {
          title: "STT",
          dataIndex: "index",
          key: "index",
          align: "center",
          render: (value, record, index) => index + 1,
        },
        {
          title: "Mã lô sản xuất",
          dataIndex: "lo_sx",
          key: "lo_sx",
          align: "center",
          render: (value) => value || "-",
        },
      ],
    },
    {
      title: totalQuantity,
      align: "center",
      children: [
        {
          title: "Số lượng",
          dataIndex: "so_luong",
          key: "so_luong",
          align: "center",
          render: (value) => value,
        },
      ],
    },
    {
      title: "Tác vụ",
      align: "center",
      render: (_, record, index) => (
        <DeleteOutlined
          onClick={() => handleDelete(index)}
          style={{
            color: "red",
            marginLeft: 8,
            fontSize: 18,
          }}
        />
      )
    },
  ];

  useEffect(() => {
    (async () => {
      if (currentResult) {
        if (palletId) {
          const result = JSON.parse(currentResult);
          const res = await checkLoSX({ lo_sx: result.lo_sx });
          const isExisted = data?.some((val) => val?.lo_sx === result.lo_sx);
          console.log(res);
          if (!isExisted && res.success == true) {
            setData((prevData) => [
              ...prevData,
              { lo_sx: result.lo_sx, so_luong: result.so_luong },
            ]);
          }
        } else {
          const res = await getInfoPallet({ pallet_id: currentResult });
          if (res.success == true) {
            setPalletId(res?.data?.id);
            setData(res?.data?.losxpallet);
            setItem({...item, pallet_id: res.data.id, so_luong: res.data.so_luong, locator_id: res.data.locator_id});
          }
        }
      }
    })();
  }, [currentResult]);

  const handleDelete = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  const sendResult = () => {
    const totalQuantity = data.reduce((sum, val) => sum + val.so_luong, 0);
    const arr = [];
    data.forEach((val) => {
      arr.push({ lo_sx: val.lo_sx, so_luong: val.so_luong });
    });

    const resData = {
      pallet_id: palletId,
      number_of_lot: data.length,
      so_luong: totalQuantity,
      inp_arr: arr,
    };
    setLoading(true);
    updatePallet(resData)
      .then((res) => {
        setSelectedItem([
          {
            pallet_id: item.pallet_id,
            locator_id: item.locator_id,
            so_luong: totalQuantity,
          },
        ]);
        setListCheck([res.data]);
        setResult?.(res.data);
      })
      .catch((err) => console.log("Gửi dữ liệu thất bại: ", err))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOk = () => {
    setVisible(false);
    if (data.length > 0) {
      sendResult();
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onScanResult = (val) => {
    setCurrentResult(val);
  };

  return (
    <div>
      <Modal
        title="Quét mã"
        open={visible}
        onOk={handleOk}
        okText="Lưu"
        onCancel={handleCancel}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ disabled: data.length <= 0, loading: loading }}
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

export default PopupScanPallet;
