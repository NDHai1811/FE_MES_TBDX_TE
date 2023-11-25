import React, { useEffect, useState, useRef } from "react";
import { PrinterOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Row, Col, Button, Table, Spin, DatePicker, Modal, Select, Divider } from "antd";

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
  getLine,
} from "../../../api/oi/manufacture";
import { useReactToPrint } from "react-to-print";
import Tem from "../../UI/Manufacture/Tem";
import { getMachines } from "../../../api/oi/equipment";
import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import dayjs from "dayjs";
import ScanQR from "../../../components/Scanner";
import { getListMachine } from "../../../api";

const tableColumns = [
  {
    title: "Mã Lot",
    dataIndex: "ma_lot",
    key: "ma_lot",
    align: "center",
    width: "15%",
  },
  {
    title: "S.L thực",
    dataIndex: "sl_thuc",
    key: "sl_thuc",
    align: "center",
    width: "14%",
  },
  {
    title: "Phế SX",
    dataIndex: "phe_sx",
    key: "phe_sx",
    align: "center",
    width: "14%",
  },
  {
    title: "S.L 1 MQL",
    dataIndex: "sl_mql",
    key: "sl_mql",
    align: "center",
    width: "16%",
  },
  {
    title: "Số m còn lại",
    dataIndex: "so_m_con_lai",
    key: "so_m_con_lai",
    align: "center",
    width: "20%",
  },
  {
    title: "TG hoàn thành",
    dataIndex: "tg_hoan_thanh",
    key: "tg_hoan_thanh",
    align: "center",
    width: "16%",
  },
];

const Manufacture1 = (props) => {
  document.title = "Sản xuất";
  const { line } = useParams();
  const history = useHistory();
  const [params, setParams] = useState({
    start_date: dayjs(),
    end_date: dayjs(),
  });
  const [lineOptions, setLineOptions] = useState([]);
  const [machineOptions, setMachineOptions] = useState([]);
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
      ma_lot: "S231031002",
      sl_thuc: "200",
      phe_sx: "4",
      sl_mql: "1800",
      so_m_con_lai: "-",
      tg_hoan_thanh: "15:50:00",
    },
  ]);

  useEffect(() => {
    if (socket) {
      socket.close();
    }
    if (params.machine_id) {
      getOverAllDetail();
      getListLotDetail();
      var deviceId = machineOptions.find(e=>e.value === params.machine_id)?.ma_so;
      if(deviceId){
        connectWebsocket(deviceId);
      }
    }
    
  }, params.machine_id);

  useEffect(() => {
    getListOption();
  }, []);

  const getListOption = async () => {
    setLoading(true);
    var line = (await getLine());
    setLineOptions(line.data);
    var machine = await getListMachine();
    setMachineOptions(machine);
    setLoading(false);
  }
  const getOverAllDetail = () => {
    setLoading(true);
    getOverAll({ ...params })
      .then((res) => {
        setOverall(res.data)
      })
      .catch((err) => {
        console.error("Get over all error: ", err);
      })
      .finally(() => setLoading(false));
  };

  const getListLotDetail = () => {
    setLoading(true);
    getLotByMachine({ ...params })
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
    var res = await scanPallet({ lot_id: result });
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
      // const infoPallet = await getInfoPallet({ line_id: machine_id });
      // if (infoPallet.success) {
      //   // setData(infoPallet.data);
      // }
    }
  };

  const rowClassName = (record, index) => {
    if (record.status === 1 && index === 0) {
      return "table-row-green";
    }
    if (record.status === 2) {
      return "table-row-yellow";
    }
    if (record.status === 3) {
      return "table-row-yellow blink";
    }
    if (record.status === 4) {
      return "table-row-grey";
    }
    return "";
  };

  const onClickRow = (row) => {
    setSelectedLot(row);
  };
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
    },
    {
      title: "S.L",
      dataIndex: "san_luong",
      key: "san_luong",
      align: "center",
      render: (value, record, index) =>
        value ? value : record.status === 4 ? value : "-",
    },
    {
      title: "S.L sau QC",
      dataIndex: "sl_ok",
      key: "sl_ok",
      align: "center",
      render: (value, record, index) =>
        value ? value : record.status === 4 ? value : "-",
    },
    {
      title: "Phế QC",
      dataIndex: "sl_ng_qc",
      key: "sl_ng_qc",
      align: "center",
      render: (value, record, index) =>
        value ? value : record.status === 4 ? value : "-",
    },
    {
      title: "Phế SX",
      dataIndex: "sl_ng_sx",
      key: "sl_ng_sx",
      align: "center",
      render: (value, record, index) =>
        value ? value : record.status === 4 ? value : "-",
    },
    {
      title: "Khách hàng",
      dataIndex: "khach_hang",
      key: "khach_hang",
      align: "center",
      width: "14%",
    },
    {
      title: "MQL",
      dataIndex: "mql",
      key: "mql",
      align: "center",
      width: "14%",
    },
  ];
  const overallColumns = [
    {
      title: "KH Ca",
      dataIndex: "kh_ca",
      key: "kh_ca",
      align: "center",
    },
    {
      title: "Sản lượng ca",
      dataIndex: "san_luong",
      key: "san_luong",
      align: "center",
    },
    {
      title: "% KH Ca",
      dataIndex: "ti_le_ca",
      key: "ti_le_ca",
      align: "center",
    },
    {
      title: "Tổng phế",
      dataIndex: "tong_phe",
      key: "tong_phe",
      align: "center",
    },
  ];
  const [overall, setOverall] = useState([{kh_ca: 0, san_luong: 0, ti_le_ca: 0, tong_phe: 0}]);
  const currentColumns = [
    {
      title: "Mã lot",
      dataIndex: "lot_id",
      key: "lot_id",
      align: "center",
    },
    {
      title: "S.L thực",
      dataIndex: "so_luong",
      key: "so_luong",
      align: "center",
    },
    {
      title: "Phế sản xuất",
      dataIndex: "sl_ng_sx",
      key: "sl_ng_sx",
      align: "center",
    },
    {
      title: "S.L 1 MQL",
      dataIndex: "sl_1_mql",
      key: "sl_1_mql",
      align: "center",
    },
    {
      title: "Số m còn lại",
      dataIndex: "so_m_con_lai",
      key: "so_m_con_lai",
      align: "center",
    },
    {
      title: "TG hoàn thành",
      dataIndex: "tg_ht",
      key: "tg_ht",
      align: "center",
    },
  ]
  const componentRef1 = useRef();
  const handlePrint = async () => {
    if (listCheck.length > 0) {
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
      setListCheck(selectedRows);
    },
    getCheckboxProps: (record) => {
      return { disabled: record.status !== 4 };
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

  const [socket, setSocket] = useState(null);
  const connectWebsocket = (deviceId) => {
    console.log(deviceId);
    var token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtZXNzeXN0ZW1AZ21haWwuY29tIiwidXNlcklkIjoiNGQxYzg5NTAtODVkOC0xMWVlLTgzOTItYTUxMzg5MTI2ZGM2Iiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJzZXNzaW9uSWQiOiI1YzIzYjNhOC00ZDkyLTQ4MWQtOTk2Ni0yNGUwYWZiZjQwMjUiLCJpc3MiOiJ0aGluZ3Nib2FyZC5pbyIsImlhdCI6MTcwMDg5MzQxNCwiZXhwIjoxNzAwOTAyNDE0LCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMzYwY2MyMjAtODVkOC0xMWVlLTgzOTItYTUxMzg5MTI2ZGM2IiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCJ9.Zys_15X792M_grcS9FJe0pXR5eM157RTLL-DIDtubNduaxqe-9Vg6niZ5Kb5OF4CcE_mzt1Kt3pdBlETbboxtw";
    var entityId = deviceId;
    var webSocket = new WebSocket("ws://113.176.95.167:3030/api/ws/plugins/telemetry?token=" + token);
    webSocket.onopen = function () {
      var object = {
        tsSubCmds: [
          {
            entityType: "DEVICE",
            entityId: entityId,
            scope: "LATEST_TELEMETRY",
            cmdId: 10
          }
        ],
        historyCmds: [],
        attrSubCmds: []
      };
      var data = JSON.stringify(object);
      webSocket.send(data);
      // console.log("Message is sent: " + data);
    };
    webSocket.onmessage = function (event) {
      var recived_msg = JSON.parse(event.data);
      console.log(recived_msg.data);
    };
    webSocket.onclose = function (event) {
      console.log("Connection is closed");
      connectWebsocket();
    };
    setSocket(webSocket);
    return () => {
      if (webSocket) {
        webSocket.close();
      }
      if (socket) {
        socket.close();
      }
    };
  }
  

  useEffect(()=>{
    if(data.length > 0){
      setSelectedLot(data.length > 0 ? data[0] : null)
      setListCheck(data.filter(e=>e.status === 4));
    }
  }, [data])

  useEffect(()=>{
    setParams({...params, machine_id: machineOptions.find(e=>e.line_id === line)?.value});
  }, [line, machineOptions])
  return (
    <React.Fragment>
      <Spin spinning={loading}>
        <Row className="mt-3" gutter={[6, 8]}>
          <Col span={window.screen.width < 720 ? 7 : 5}>
            <div
              style={{
                borderRadius: "8px",
                textAlign: "center",
                background: "#fff",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                height: "100%",
                justifyContent:'space-between'
              }}
              className="d-flex flex-column"
            >
              <Row style={{height:'100%'}}>
                <Col span={7}
                  style={{
                    background: "#0454a2",
                    borderRadius: '8px 0px 0px 0px',
                    color: "#fff",
                    height:'100%',
                    display: 'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    fontWeight:600
                  }}
                >
                  {'CD'}
                </Col>
                <Col span={17} className="d-flex">
                <Select options={lineOptions} style={{alignSelf:'center'}} className="w-100" bordered={false} placeholder="Chọn công đoạn" value={lineOptions.length > 0 && line && !isNaN(parseInt(line)) ? parseInt(line) : null} onChange={onChangeLine}/>
                </Col>
              </Row>
              <Divider style={{margin:0}}/>
              <Row style={{height:'100%'}}>
                <Col span={7}
                  style={{
                    background: "#0454a2",
                    borderRadius: '0px 0px 0px 8px',
                    color: "#fff",
                    height:'100%',
                    display: 'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    fontWeight:600
                  }}
                >
                  {'Máy'}
                </Col>
                <Col span={17} className="d-flex">
                  <Select options={machineOptions.filter(e=>e.line_id === line)} style={{alignSelf:'center'}} className="w-100" bordered={false} placeholder="Chọn máy" value={params.machine_id} onChange={(value)=>setParams({...params, machine_id: value})}/>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={window.screen.width < 720 ? 17 : 19}>
            <Table
              size="small"
              pagination={false}
              bordered
              locale={{emptyText: 'Trống'}}
              className="custom-table"
              columns={overallColumns}
              dataSource={overall}
              scroll={window.screen.width < 720 ? {
                x: window.screen.width,
              } : false}
            />
          </Col>
          <Col span={24}>
            <Table
              size="small"
              pagination={false}
              bordered
              className="custom-table"
              locale={{emptyText: 'Trống'}}
              columns={currentColumns}
              dataSource={selectedLot ? [selectedLot] : []}
            />
          </Col>
          <Row
            gutter={4}
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
                onClick={() => setIsScan(1)}
                icon={<QrcodeOutlined style={{ fontSize: "24px" }} />}
              />
            </Col>
            <Col span={3}>
              <Button
                size="medium"
                type="primary"
                style={{ width: "100%" }}
                onClick={handlePrint}
                icon={<PrinterOutlined style={{ fontSize: "24px" }} />}
              />
              <div className="report-history-invoice">
                <Tem listCheck={listCheck} ref={componentRef1} />
              </div>
            </Col>
          </Row>
          <Col span={24}>
            <Table
              scroll={{
                x: '170vw',
              }}
              size="small"
              rowClassName={(record, index)=>"no-hover "+rowClassName(record, index)}
              pagination={false}
              bordered
              columns={columns}
              dataSource={data.map((e, index) => {
                return { ...e, key: index };
              })}
            />
          </Col>
        </Row>
      </Spin>
      {isOpenQRScanner && (
        <Modal
          title="Quét QR"
          open={isOpenQRScanner}
          onCancel={handleCloseMdl}
          footer={null}
        >
          <ScanQR
            isScan={isOpenQRScanner}
            onResult={(res) => {
              onScan(res);
              setIsOpenQRScanner(false);
            }}
          />
        </Modal>
      )}
    </React.Fragment>
  );
};

export default Manufacture1;
