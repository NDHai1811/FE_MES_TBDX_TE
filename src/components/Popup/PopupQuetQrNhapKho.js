import React from "react";
import { Modal, Row, Col, Table } from "antd";
import "./PopupQuetQr.css";
import ScanQR from "../Scanner";
import { useState } from "react";
import { useEffect } from "react";
import {
  getQuantityLot,
  getSuggestPallet,
  sendStorePallet,
} from "../../api/oi/warehouse";

function PopupQuetQrNhapKho(props) {
  const {
    visible,
    setVisible,
    setResData,
    setSelectedItem,
    setInfo,
    setResult,
  } = props;

  const [columns, setColumns] = useState([]);
  const [currentResult, setCurrentResult] = useState("");
  const [data, setData] = useState([]);
  const [palletId, setPalletId] = useState("");
  const [item, setItem] = useState({});

  const totalQuantity = data?.reduce((sum, val) => sum + val?.so_luong, 0);

  useEffect(() => {
    getSuggestList();
  }, []);

  useEffect(() => {
    totalQuantity > 0 &&
      setColumns([
        {
          title: palletId,
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
      ]);
  }, [totalQuantity]);

  useEffect(() => {
    if (currentResult) {
      const result = JSON.parse(currentResult);
      const isExisted = data?.some((val) => val?.lo_sx === result.lo_sx);
      if (!isExisted) {
        setData((prevData) => [
          ...prevData,
          { lo_sx: result.lo_sx, so_luong: result.so_luong },
        ]);
      }
    }
  }, [currentResult]);

  // const getQuantity = () => {
  //   getQuantityLot({ lo_sx: currentResult })
  //     .then((res) => {
  //       if (res.data?.lo_sx) {
  //         setData((prevData) => [
  //           ...prevData,
  //           { lo_sx: res.data.lo_sx, so_luong: res.data.so_luong },
  //         ]);
  //       }
  //     })
  //     .catch((err) => console.log("Lấy thông tin số lượng thất bại: ", err));
  // };

  const getSuggestList = () => {
    getSuggestPallet()
      .then((res) => {
        setItem(res.data);
        setPalletId(res.data.pallet_id);
        setResData?.({
          locator_id: res.data.locator_id,
          pallet_id: res.data.pallet_id,
        });
        setColumns([
          {
            title: res.data.pallet_id,
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
            title: `${res.data.so_luong}`,
            align: "center",
            children: [
              {
                title: "Số lượng",
                dataIndex: "so_luong",
                key: "so_luong",
                align: "center",
                render: (value) => value || "-",
              },
            ],
          },
        ]);
      })
      .catch((err) => console.log("Lấy danh sách đề xuất thất bại: ", err));
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

    sendStorePallet(resData)
      .then((res) => {
        setSelectedItem([
          {
            pallet_id: item.pallet_id,
            locator_id: item.locator_id,
            so_luong: totalQuantity,
          },
        ]);
        setInfo(res.data);
        setResult?.(res.data);
      })
      .catch((err) => console.log("Gửi dữ liệu thất bại: ", err));
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
        okButtonProps={{ disabled: data.length <= 0 }}
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

export default PopupQuetQrNhapKho;
