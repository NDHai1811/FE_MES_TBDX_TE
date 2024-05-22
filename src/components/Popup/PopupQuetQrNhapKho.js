import React from "react";
import { Modal, Row, Col, Table, message, Typography } from "antd";
import "./PopupQuetQr.css";
import ScanQR from "../Scanner";
import { useState } from "react";
import { useEffect } from "react";
import {
  checkLoSX,
  getQuantityLot,
  getSuggestPallet,
  sendStorePallet,
} from "../../api/oi/warehouse";
import { LoadingOutlined } from "@ant-design/icons";

function PopupQuetQrNhapKho(props) {
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
  const [item, setItem] = useState({});
  const [isChecking, setIsChecking] = useState(false)
  const totalQuantity = data?.reduce((sum, val) => sum + parseInt(val?.so_luong), 0);
  const [messageApi, contextHolder] = message.useMessage();
  
  const columns = [
    // {
    //   title: palletId,
    //   children: [
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
    //   ],
    // },
    // {
    //   title: isChecking ? <LoadingOutlined/> : totalQuantity,
    //   align: "center",
    //   children: [
        {
          title: "Số lượng",
          dataIndex: "so_luong",
          key: "so_luong",
          align: "center",
          render: (value) => value,
        },
    //   ],
    // },
  ];

  // useEffect(() => {
  //   getSuggestList();
  // }, []);

  useEffect(() => {
    (async () => {
      if (currentResult && !isChecking) {
        const result = JSON.parse(currentResult);
        const isExisted = data?.some((val) => val?.lo_sx === result.lo_sx);
        if(isExisted){
          messageApi.warning('Đã quét lô này');
          return 0;
        }
        setIsChecking(true);
        const res = await checkLoSX({ lo_sx: result.lo_sx, list_losx: data.map(e=>e.lo_sx) });
        if (!isExisted && res.success == true) {
          setData((prevData) => [
            ...prevData,
            { lo_sx: result.lo_sx, so_luong: result.so_luong },
          ]);
        }
        setIsChecking(false)
        setCurrentResult();
      }
    })()
  }, [currentResult]);

  const getSuggestList = () => {
    getSuggestPallet()
      .then((res) => {
        setItem(res.data);
        setPalletId(res.data.pallet_id);
        setResData?.({
          locator_id: res.data.locator_id,
          pallet_id: res.data.pallet_id,
        });
      })
      .catch((err) => console.log("Lấy danh sách đề xuất thất bại: ", err));
  };

  const sendResult = () => {
    const totalQuantity = data.reduce((sum, val) => sum + parseInt(val.so_luong), 0);
    const arr = [];
    data.forEach((val) => {
      arr.push({ lo_sx: val.lo_sx, so_luong: val.so_luong });
    });

    const resData = {
      // pallet_id: palletId,
      // number_of_lot: data.length,
      // so_luong: totalQuantity,
      inp_arr: arr,
    };

    sendStorePallet(resData)
      .then((res) => {
        if (res.success) {
          setSelectedItem([
            {
              pallet_id: item.pallet_id,
              locator_id: item.locator_id,
              so_luong: totalQuantity,
            },
          ]);
          setVisible(false);
          setListCheck([res.data]);
          setResult?.(res.data);
        }

      })
      .catch((err) => console.log("Gửi dữ liệu thất bại: ", err));
  };

  const handleOk = () => {
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
      {contextHolder}
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
              summary={(pageData) => {
                let sum = 0;
                pageData.forEach(({ so_luong }) => {
                  sum += so_luong;
                });
        
                return data.length ? (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={2} align="center"><strong>Tổng số lượng</strong></Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="center">{sum}</Table.Summary.Cell>
                  </Table.Summary.Row>
                ) : null;
              }}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default PopupQuetQrNhapKho;
