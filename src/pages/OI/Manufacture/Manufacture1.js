import React, { useEffect, useState, useRef } from "react";
import { PrinterOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Row, Col, Button, Table, Spin, Checkbox, DatePicker, Modal } from "antd";
import moment from 'moment';

import DataDetail from "../../../components/DataDetail";
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import SelectButton from "../../../components/Button/SelectButton";
import {
  getInfoPallet,
  scanPallet,
  getOverAll,
  getLotByMachine,
} from "../../../api/oi/manufacture";
import { useReactToPrint } from "react-to-print";
import Tem from "../../UI/Manufacture/Tem";
import { getMachines } from "../../../api/oi/equipment";
import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import dayjs from "dayjs";
import ScanQR from "../../../components/Scanner";

const mockData = [
  {
    lo_sx: "S231017",
    ma_lot: "S231017.04",
    sl_lot: "300",
    quy_cach: "DxRxC",
    san_luong: "200",
    sl_sau_qc: "",
    phe_qc: "",
    phe_sx: "",
  },
  {
    lo_sx: "S231017",
    ma_lot: "S231017.05",
    sl_lot: "300",
    quy_cach: "DxRxC",
    san_luong: "200",
    sl_sau_qc: "",
    phe_qc: "",
    phe_sx: "",
  },
  {
    lo_sx: "S231017",
    ma_lot: "S231017.06",
    sl_lot: "300",
    quy_cach: "DxRxC",
    san_luong: "200",
    sl_sau_qc: "",
    phe_qc: "",
    phe_sx: "",
  },
  {
    lo_sx: "S231017",
    ma_lot: "S231017.03",
    sl_lot: "300",
    quy_cach: "DxRxC",
    san_luong: "300",
    sl_sau_qc: "Chờ QC",
    phe_qc: "",
    phe_sx: "",
  },
  {
    lo_sx: "S231017",
    ma_lot: "",
    sl_lot: "300",
    quy_cach: "DxRxC",
    san_luong: "300",
    sl_sau_qc: "299",
    phe_qc: "1",
    phe_sx: "",
  },
];

const Manufacture1 = (props) => {
  document.title = "Sản xuất";
  const { machine_id } = useParams();
  const history = useHistory();
  const [params, setParams] = useState({start_date: dayjs(), end_date: dayjs()})
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedLot, setSelectedLot] = useState();
  const [listCheck, setListCheck] = useState([]);
  const [row1, setRow1] = useState([
    {
      title: "KH ca",
      value: "10000",
    },
    {
      title: "S.L ca",
      value: "1100",
    },
    {
      title: "% KH ca",
      value: "11%",
    },
    {
      title: "Tổng Phế",
      value: "4",
      bg: "#fb4b50",
    },
  ]);
  const [row2, setRow2] = useState([
    {
      title: "Mã lot",
      value: "S231",
    },
    {
      title: "S.L thực",
      value: "200",
    },
    {
      title: "Phế SX",
      value: "4",
    },
    {
      title: "S.L 1 MQL",
      value: "1800",
    },
    {
      title: "Số m còn lại",
      value: "-",
    },
    {
      title: "T/g HT",
      value: "15:50:00",
    },
  ]);

  useEffect(() => {
    if(machine_id){
      setParams({...params, machine_id: machine_id})
    }
  }, [machine_id]);

  useEffect(()=>{
    if(machine_id){
      getOverAllDetail();
      getListLotDetail();
    }
  }, machine_id)

  useEffect(() => {
    getMachineList();
  }, []);

  const getOverAllDetail = () => {
    setLoading(true);
    getOverAll({...params, machine_id})
      .then((res) => {
        const { kh_ca, so_luong, ht_kh_ca, phe_sx } = res.data?.[0] || {};
        setRow1([
          {
            title: "KH ca",
            value: kh_ca,
          },
          {
            title: "Sản lượng ca",
            value: so_luong,
          },
          {
            title: "% KH ca",
            value: ht_kh_ca,
          },
          {
            title: "Tổng Phế",
            value: "4",
            bg: phe_sx,
          },
        ]);
      })
      .catch((err) => {
        console.error("Get over all error: ", err);
      })
      .finally(() => setLoading(false));
  };

  const getMachineList = () => {
    getMachines()
      .then((res) => {
        setOptions(res.data);
        history.push("/manufacture/" + res.data?.[0]?.value);
      })
      .catch((err) => console.log("Get machines error: ", err));
  };

  const getListLotDetail = () => {
    setLoading(true);
    getLotByMachine({...params, machine_id})
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Get list lot error: ", err);
      })
      .finally(() => setLoading(false));
  };

  const onChangeLine = (value) => {
    history.push("/manufacture/" + value);
  };

  const onScan = async (result) => {
    var res = await scanPallet({ lot_id: result, line_id: machine_id });
    if (res.success) {
      if (row2[0].value !== "") {
        setRow2([
          {
            title: "Mã lot",
            value: "",
          },
          {
            title: "Tên sản phẩm",
            value: "",
          },
          {
            title: "UPH (Ấn định)",
            value: "",
          },
          {
            title: "UPH (Thực tế)",
            value: "",
          },
          {
            title: "SL đầu ra (KH)",
            value: "",
          },
          {
            title: "SL đầu ra (TT)",
            value: "",
          },
          {
            title: "SL đầu ra (TT OK)",
            value: "",
          },
        ]);
      }
      const infoPallet = await getInfoPallet({ line_id: machine_id });
      if (infoPallet.success) {
        // setData(infoPallet.data);
      }
    }
  };

  const rowClassName = (record, index) => {
    if (record.status === 1 || index === 0) {
      return "table-row-green";
    }
    if (record.status === 3) {
      return "table-row-pink";
    }
    if (record.status === 4) {
      return "table-row-grey";
    }
    return "";
  };

  const onClickRow = (row) => {
    setSelectedLot(row);
  };

  useEffect(() => {
    if (selectedLot) {
      setRow2([
        {
          title: "Số Lot",
          value: selectedLot.lot_id,
        },
        {
          title: "KH ĐH",
          value: selectedLot.ten_sp,
        },
        {
          title: "S.L",
          value: selectedLot.uph_an_dinh,
        },
        {
          title: "HT ĐH",
          value: selectedLot.uph_thuc_te,
        },
        {
          title: "Phế SX",
          value: selectedLot.sl_dau_ra_kh,
        },
      ]);
    } else {
      setListCheck([]);
    }
  }, [selectedLot]);
  const columns = [
    {
      title: "Lô SX",
      dataIndex: "lo_sx",
      key: "lo_sx",
      align: "center",
      width: "15%",
      // render: (value, record, index) => <Checkbox></Checkbox>,
    },
    {
      title: "Mã Lot",
      dataIndex: "lot_id",
      key: "lot_id",
      align: "center",
      width: "14%",
    },
    {
      title: "Sl/Lot",
      dataIndex: "dinh_muc",
      key: "dinh_muc",
      align: "center",
      width: "14%",
    },
    {
      title: "Quy cách",
      dataIndex: "quy_cach",
      key: "quy_cach",
      align: "center",
      width: "14%",
    },
    {
      title: "S.L",
      dataIndex: "san_luong",
      key: "san_luong",
      align: "center",
      width: "14%",
      render: (value, record, index) => value ? value : record.status === 4 ? value : "-"
    },
    {
      title: "S.L sau QC",
      dataIndex: "sl_ok",
      key: "sl_ok",
      align: "center",
      width: "25%",
      render: (value, record, index) => value ? value : record.status === 4 ? value : "-"
    },
    {
      title: "Phế QC",
      dataIndex: "sl_ng_qc",
      key: "sl_ng_qc",
      align: "center",
      width: "14%",
      render: (value, record, index) => value ? value : record.status === 4 ? value : "-"
    },
    {
      title: "Phế SX",
      dataIndex: "sl_ng_sx",
      key: "sl_ng_sx",
      align: "center",
      width: "14%",
      render: (value, record, index) => value ? value : record.status === 4 ? value : "-"
    },
  ];
  const componentRef1 = useRef();
  const handlePrint = async () => {
    if(listCheck.length > 0){
      print();
    }
  };

  const print = useReactToPrint({
    content: () => componentRef1.current,
  });
  // useEffect(() => {
  //   if (listCheck.length > 0) {
  //     print();
  //   }
  // }, [listCheck]);
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRows)
    },
    getCheckboxProps: (record) => {
      return {disabled: record.status !== 4}
    },
  };
  const [isOpenQRScanner, setIsOpenQRScanner] = useState(false);
  const [isScan, setIsScan] = useState(0);
  const handleCloseMdl = () => {
    setIsOpenQRScanner(false);
    setIsScan(2);
  };
  useEffect(() => {
    if (isScan === 1) {
      setIsOpenQRScanner(true);
    } else if (isScan === 2) {
      setIsOpenQRScanner(false);
    }
  }, [isScan]);
  return (
    <React.Fragment>
      <Spin spinning={loading}>
        <Row className="mt-3" gutter={[2, 12]}>
          <Col span={5}>
            <SelectButton
              options={options}
              label="Công đoạn"
              value={machine_id}
              onChange={onChangeLine}
            />
          </Col>
          <Col span={19}>
            <DataDetail data={row1} />
          </Col>
          <Col span={24}>
            <DataDetail
              data={row2}
              scroll={{
                x: window.screen.width,
              }}
            />
          </Col>
          <Row
            gutter={4}
            className="mt-1"
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Col span={9}>
              <DatePicker
                placeholder="Từ ngày"
                style={{ width: "100%" }}
                format={COMMON_DATE_FORMAT}
                defaultValue={dayjs()}
              />
            </Col>
            <Col span={9}>
              <DatePicker
                placeholder="Đến ngày"
                style={{ width: "100%" }}
                format={COMMON_DATE_FORMAT}
                defaultValue={dayjs()}
              />
            </Col>
            <Col span={3}>
              <Button
                size="medium"
                type="primary"
                style={{ width: "100%" }}
                onClick={()=>setIsScan(1)}
                icon={<QrcodeOutlined />}
              />
            </Col>
            <Col span={3}>
              <Button
                size="medium"
                type="primary"
                style={{ width: "100%" }}
                onClick={handlePrint}
                icon={<PrinterOutlined />}
              />
              <div className="report-history-invoice">
                <Tem listCheck={listCheck} ref={componentRef1} />
              </div>
            </Col>
          </Row>
          <Col span={24}>
            <Table
              scroll={{
                x: window.screen.width,
              }}
              size="small"
              rowClassName={rowClassName}
              pagination={false}
              bordered
              rowSelection={rowSelection}
              // onRow={(record, rowIndex) => {
              //   return {
              //     onClick: (event) => onClickRow(record),
              //   };
              // }}
              columns={columns}
              dataSource={data.map((e, index)=>{return {...e, key: index}})}
            />
          </Col>
        </Row>
      </Spin>
      {isOpenQRScanner && <Modal title="Quét QR" open={isOpenQRScanner} onCancel={handleCloseMdl} footer={null}>
          <ScanQR isScan={isOpenQRScanner} onResult={(res) => { onScan(res); setIsOpenQRScanner(false); }} />
      </Modal>}
    </React.Fragment>
  );
};

export default Manufacture1;
