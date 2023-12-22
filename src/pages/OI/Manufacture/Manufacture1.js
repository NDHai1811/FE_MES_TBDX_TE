import React, { useEffect, useState, useRef } from "react";
import { PrinterOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Row, Col, Button, Table, Spin, DatePicker, Modal, Select } from "antd";
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import {
  getOverAll,
  getLotByMachine,
  getInfoTem,
  scanQrCode,
} from "../../../api/oi/manufacture";
import { useReactToPrint } from "react-to-print";
import Tem from "./Tem";
import TemIn from "./TemIn";
import TemDan from "./TemDan";
import {
  COMMON_DATE_FORMAT,
  COMMON_DATE_FORMAT_REQUEST,
} from "../../../commons/constants";
import dayjs from "dayjs";
import ScanQR from "../../../components/Scanner";
import { formatDateTime } from "../../../commons/utils";
import { getMachines } from "../../../api/oi/equipment";

const token =
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtZXNzeXN0ZW1AZ21haWwuY29tIiwidXNlcklkIjoiNGQxYzg5NTAtODVkOC0xMWVlLTgzOTItYTUxMzg5MTI2ZGM2Iiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJzZXNzaW9uSWQiOiI4YWJkNTg2YS03NTM5LTQ4NjQtOTM0Yy02MjU5ZjdjNjc2NGMiLCJpc3MiOiJ0aGluZ3Nib2FyZC5pbyIsImlhdCI6MTcwMjAyNjQwOSwiZXhwIjoxNzAyMDM1NDA5LCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMzYwY2MyMjAtODVkOC0xMWVlLTgzOTItYTUxMzg5MTI2ZGM2IiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCJ9.QcJoS316OjEMLhkGhQj1O9FAawZylM4FkWIBx1ABQ6larZ6CL1BVKnY-q-SzY37jxJJSWC4Q2sNy5rCXi3hAvw";
const url = `ws://113.176.95.167:3030/api/ws/plugins/telemetry/values?token=${token}`;

const currentColumns = [
  {
    title: "Mã lot",
    dataIndex: "lot_id",
    key: "lot_id",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Sản lượng kế hoạch",
    dataIndex: "dinh_muc",
    key: "dinh_muc",
    align: "center",
    render: (value) => value,
  },
  {
    title: "Sản lượng đầu ra",
    dataIndex: "san_luong",
    key: "san_luong",
    align: "center",
    render: (value) => value,
  },
  {
    title: "Sản lượng đạt",
    dataIndex: "sl_ok",
    key: "sl_ok",
    align: "center",
    render: (value) => value,
  },
  {
    title: "Phán định",
    dataIndex: "phan_dinh",
    key: "phan_dinh",
    align: "center",
    render: (value) => value || "-",
  },
];

const columns = [
  {
    title: "Mã Lot",
    dataIndex: "lot_id",
    key: "lot_id",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Sản lượng kế hoạch",
    dataIndex: "dinh_muc",
    key: "dinh_muc",
    align: "center",
  },
  {
    title: "Sản lượng đầu ra",
    dataIndex: "san_luong",
    key: "san_luong",
    align: "center",
  },
  {
    title: "Sản lượng đạt",
    dataIndex: "sl_ok",
    key: "sl_ok",
    align: "center",
  },
  {
    title: "Phán định",
    dataIndex: "phan_dinh",
    key: "phan_dinh",
    align: "center",
    render: (value) => (value === 1 ? "OK" : "-"),
  },
  {
    title: "Mã layout",
    dataIndex: "layout_id",
    key: "layout_id",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Khách hàng",
    dataIndex: "khach_hang",
    key: "khach_hang",
    align: "center",
    render: (value, record, index) => value || "-",
  },
  {
    title: "Mã QL",
    dataIndex: "mql",
    key: "mql",
    align: "center",
    render: (value, record, index) => value || "-",
  },
  {
    title: "Lô SX",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
    render: (value, record, index) => value || "-",
  },
  {
    title: "Quy cách",
    dataIndex: "quy_cach",
    key: "quy_cach",
    align: "center",
    render: (value, record, index) => value || "-",
  },
];

const Manufacture1 = (props) => {
  document.title = "Sản xuất";
  const { machine_id } = useParams();

  const history = useHistory();
  const componentRef1 = useRef();
  const componentRef2 = useRef();
  const componentRef3 = useRef();

  const [params, setParams] = useState({
    start_date: dayjs(),
    end_date: dayjs(),
  });
  const [machineOptions, setMachineOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [data, setData] = useState([]);
  const [selectedLot, setSelectedLot] = useState();
  const [lotCurrent, setLotCurrent] = useState(["12", "12"]);
  const [listCheck, setListCheck] = useState([]);
  const [deviceID, setDeviceID] = useState(
    "e9aba8d0-85da-11ee-8392-a51389126dc6"
  );
  const [overall, setOverall] = useState([
    { kh_ca: 0, san_luong: 0, ti_le_ca: 0, tong_phe: 0 },
  ]);
  const [isOpenQRScanner, setIsOpenQRScanner] = useState(false);
  const [isScan, setIsScan] = useState(0);
  const ws = useRef(null);

  const reloadData = async () =>{
    const resData = await getListLotDetail();
    setData(resData);
    if(resData?.[0]?.status === 1){
      setSelectedLot(resData?.[0]);
    }
    getOverAllDetail();
  }
  const overallColumns = [
    {
      title: "Công đoạn",
      dataIndex: "cong_doan",
      key: "cong_doan",
      align: "center",
      render: () => (
        <Select
          options={machineOptions}
          value={machine_id}
          onChange={onChangeLine}
          style={{ width: "100%" }}
          bordered={false}
        />
      ),
    },
    {
      title: "K.H Ca",
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

  useEffect(() => {
    if(machineOptions.length > 0){
      (async () => {
        if (machine_id) {
          reloadData();
        }
      })();
    }
  }, [machine_id, machineOptions, loadData]);

  useEffect(() => {
    if (machineOptions.length > 0) {
      var target = machineOptions.find(e=>e.value === machine_id);
      if(!target){
        target = machineOptions[0];
      }
      history.push('/manufacture/'+target.value);
    }
  }, [machineOptions]);

  useEffect(() => {
    if (isScan === 1) {
      setIsOpenQRScanner(true);
    } else if (isScan === 2) {
      setIsOpenQRScanner(false);
    }
  }, [isScan]);

  useEffect(() => {
    getListMachine();
    // (async ()=>{
    //   var res = await getTem();
    //   setListCheck(res) 
    // })()
    // loadDataRescursive()
  }, []);

  const loadDataRescursive = async () => {
    if(!machine_id) return;
    const resData = {
      machine_id,
      start_date: formatDateTime(params.start_date, COMMON_DATE_FORMAT_REQUEST),
      end_date: formatDateTime(params.end_date, COMMON_DATE_FORMAT_REQUEST),
    };
    const res = await getLotByMachine(resData);
    if(res.success){
      if(window.location.href.indexOf("manufacture") > -1)
      setTimeout(function() { loadDataRescursive() }, 5000);
    }
  }

  const getListMachine = () => {
    getMachines()
      .then((res) => setMachineOptions(res.data))
      .catch((err) => console.log("Get list machine error: ", err));
  };

  const getOverAllDetail = () => {
    setLoading(true);
    const resData = {
      machine_id,
      start_date: formatDateTime(params.start_date, COMMON_DATE_FORMAT_REQUEST),
      end_date: formatDateTime(params.end_date, COMMON_DATE_FORMAT_REQUEST),
    };

    getOverAll(resData)
      .then((res) => setOverall(res.data))
      .catch((err) => {
        console.error("Get over all error: ", err);
      })
      .finally(() => setLoading(false));
  };

  const getListLotDetail = async () => {
    const resData = {
      machine_id,
      start_date: formatDateTime(params.start_date, COMMON_DATE_FORMAT_REQUEST),
      end_date: formatDateTime(params.end_date, COMMON_DATE_FORMAT_REQUEST),
    };
    const res = await getLotByMachine(resData);
    setLoading(true);
    return res.data;
  };

  const onChangeLine = (value) => {
    history.push("/manufacture/" + value);
  };

  const onScan = async (result) => {
    scanQrCode({ lot_id: result, machine_id: machine_id })
      .then(reloadData())
      .catch((err) => console.log("Quét mã qr thất bại: ", err));
  };

  const rowClassName = (record, index) => {
    if (record.status === 1) {
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
  useEffect(() => {
    if (listCheck.length > 0) {
      if (machine_id === "S01") {
        print();
      } else if (machine_id == "P06" || machine_id == "P15") {
        printIn();
      } else if (machine_id == "D05" || machine_id == "D06") {
        printDan();
      }
      (async ()=>{
        setData(await getListLotDetail());
        getOverAllDetail();
      })()
    }
    setListCheck([]);
  }, [listCheck.length]);

  const handlePrint = async () => {
    const res = await getInfoTem({ machine_id: machine_id });
    if (res.data.length) {
      setListCheck(res.data);
    }
  };

  const print = useReactToPrint({
    content: () => componentRef1.current,
  });
  const printIn = useReactToPrint({
    content: () => componentRef2.current,
  });
  const printDan = useReactToPrint({
    content: () => componentRef3.current,
  });

  const handleCloseMdl = () => {
    setIsOpenQRScanner(false);
    setIsScan(2);
  };

  const connectWebsocket = (deviceId, resData) => {
    const entityId = deviceId;
    ws.current = new WebSocket(url);
    ws.current.onopen = function () {
      const object = {
        tsSubCmds: [
          {
            entityType: "DEVICE",
            entityId: entityId,
            scope: "LATEST_TELEMETRY",
            keys: "Pre_Counter,Error_Counter",
            cmdId: 10,
          },
        ],
        historyCmds: [],
        attrSubCmds: [],
      };
      const data = JSON.stringify(object);
      ws.current.send(data);
    };

    ws.current.onmessage = async function (event) {
      if(resData[0]?.status !== 1){
        return 0;
      }
      const receivedMsg = JSON.parse(event.data);
      const Pre_Counter = receivedMsg.data?.Pre_Counter
        ? parseInt(receivedMsg.data?.Pre_Counter[0][1])
        : 0;
      const Error_Counter = receivedMsg.data?.Error_Counter
        ? parseInt(receivedMsg.data.Error_Counter[0][1])
        : 0;
      let san_luong = parseInt(resData[0]?.san_luong);
      let sl_ok = parseInt(resData[0]?.sl_ok);
      let sl_ng = parseInt(resData[0]?.end_ng) - parseInt(resData[0]?.start_ng);
      if (Pre_Counter > 0) {
        san_luong = parseInt(Pre_Counter - resData[0]?.start_sl);
        if (Error_Counter) {
          sl_ng = parseInt(Error_Counter - resData[0]?.start_ng);
        }
        sl_ok = parseInt(san_luong - sl_ng);
        if (sl_ok >= resData[0]?.dinh_muc || resData[0]?.sl_ok - Pre_Counter > 10) {
          reloadData();
        } else {
          const new_data = resData.map((value, index) => {
            if (index === 0) {
              value.san_luong = isNaN(san_luong) ? 0 : san_luong;
              value.sl_ok = isNaN(sl_ok) ? 0 : sl_ok;
              return value;
            } else {
              return value;
            }
          });
          
          setData(new_data);
          setSelectedLot(new_data[0]);
        }
      }
    };
  };

  const onChangeStartDate = (value) => {
    setParams({ ...params, start_date: value });
  };

  const onChangeEndDate = (value) => {
    setParams({ ...params, end_date: value });
  };

  return (
    <React.Fragment>
      <Spin spinning={loading}>
        <Row className="mt-3" gutter={[6, 8]}>
          <Col span={24}>
            <Table
              size="small"
              pagination={false}
              bordered
              locale={{ emptyText: "Trống" }}
              className="custom-table"
              columns={overallColumns}
              dataSource={overall}
            />
          </Col>
          <Col span={24}>
            <Table
              size="small"
              pagination={false}
              bordered
              className="custom-table"
              locale={{ emptyText: "Trống" }}
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
                onChange={onChangeStartDate}
              />
            </Col>
            <Col span={9}>
              <DatePicker
                placeholder="Đến ngày"
                style={{ width: "100%" }}
                format={COMMON_DATE_FORMAT}
                defaultValue={dayjs()}
                onChange={onChangeEndDate}
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
                <TemIn listCheck={listCheck} ref={componentRef2} />
                <TemDan listCheck={listCheck} ref={componentRef3} />
              </div>
            </Col>
          </Row>
          <Col span={24}>
            <Table
              scroll={{
                x: "calc(700px + 50%)",
                y: 300,
              }}
              size="small"
              rowClassName={(record, index) =>
                "no-hover " + rowClassName(record, index)
              }
              pagination={false}
              bordered
              columns={columns}
              dataSource={data.map((e, index) => ({ ...e, key: index }))}
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
