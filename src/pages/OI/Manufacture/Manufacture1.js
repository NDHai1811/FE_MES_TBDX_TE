import React, { useEffect, useState, useRef } from "react";
import { PrinterOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Row, Col, Button, Table, Spin, DatePicker, Modal } from "antd";

import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import SelectButton from "../../../components/Button/SelectButton";
import {
  scanPallet,
  getOverAll,
  getLotByMachine,
  checkMaterialPosition,
  scanQrCode,
} from "../../../api/oi/manufacture";
import { useReactToPrint } from "react-to-print";
import Tem from "../../UI/Manufacture/Tem";
import {
  COMMON_DATE_FORMAT,
  COMMON_DATE_FORMAT_REQUEST,
} from "../../../commons/constants";
import dayjs from "dayjs";
import ScanQR from "../../../components/Scanner";
import { formatDateTime } from "../../../commons/utils";
import { getMachines } from "../../../api/oi/equipment";

const token =
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtZXNzeXN0ZW1AZ21haWwuY29tIiwidXNlcklkIjoiNGQxYzg5NTAtODVkOC0xMWVlLTgzOTItYTUxMzg5MTI2ZGM2Iiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJzZXNzaW9uSWQiOiIxODE2MGYyMi00NmU5LTQwMmUtOTFkMC1lZjdhNDliZjY2NDQiLCJpc3MiOiJ0aGluZ3Nib2FyZC5pbyIsImlhdCI6MTcwMTIyOTIzNywiZXhwIjoxNzAxMjM4MjM3LCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMzYwY2MyMjAtODVkOC0xMWVlLTgzOTItYTUxMzg5MTI2ZGM2IiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCJ9.aR-bTzZc70GNvQ1b57ZWSmTkpvqIhHFGN_Nx5nyCXYocOliTj9syzmy54U8VkNushvTfX5DAsjG3KiA_cCRw8w";
const url = `ws://113.176.95.167:3030/api/ws/plugins/telemetry/values?token=${token}`;

const currentColumns = [
  {
    title: "Mã lot",
    dataIndex: "lot_id",
    key: "lot_id",
    align: "center",
  },
  {
    title: "SL kế hoạch",
    dataIndex: "san_luong_kh",
    key: "san_luong_kh",
    align: "center",
  },
  {
    title: "SL đầu ra",
    dataIndex: "san_luong",
    key: "san_luong",
    align: "center",
  },
  {
    title: "SL đạt",
    dataIndex: "sl_ok",
    key: "sl_ok",
    align: "center",
  },
];

const columns = [
  {
    title: "Mã Lot",
    dataIndex: "lot_id",
    key: "lot_id",
    align: "center",
    width: "14%",
    render: (value, record, index) => value || "-",
  },
  {
    title: "Sản lượng kế hoạch",
    dataIndex: "san_luong_kh",
    key: "san_luong_kh",
    align: "center",
    width: "14%",
    render: (value, record, index) => value || "-",
  },
  {
    title: "Sản lượng đạt",
    dataIndex: "sl_ok",
    key: "sl_ok",
    align: "center",
    width: "14%",
    render: (value, record, index) => value || "-",
  },
  {
    title: "Mã layout",
    dataIndex: "layout_id",
    key: "layout_id",
    align: "center",
    width: "14%",
    render: (value, record, index) => value || "-",
  },
  {
    title: "Khách hàng",
    dataIndex: "khach_hang",
    key: "khach_hang",
    align: "center",
    width: "14%",
    render: (value, record, index) => value || "-",
  },
  {
    title: "Mã QL",
    dataIndex: "mql",
    key: "mql",
    align: "center",
    width: "14%",
    render: (value, record, index) => value || "-",
  },
  {
    title: "Lô SX",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
    width: "15%",
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
const overallColumns = [
  {
    title: "K.H Ca",
    dataIndex: "kh_ca",
    key: "kh_ca",
    align: "center",
  },
  {
    title: "SL ca",
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

const Manufacture1 = (props) => {
  document.title = "Sản xuất";
  const { machine_id } = useParams();

  const history = useHistory();
  const componentRef1 = useRef();

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
  useEffect(() => {
    (async () => {
      if (machine_id) {
        const resData = await getListLotDetail();
        setData(resData);
        setSelectedLot(resData?.[0]);
        getOverAllDetail();
        const device_id = machineOptions.find((obj) => {
          return obj.value === machine_id;
        })?.device_id;
        if (ws.current) {
          ws.current.close();
        }
        if (device_id) {
          connectWebsocket(device_id, resData);
        }
      }
    })();
  }, [machine_id, machineOptions, loadData]);

  useEffect(() => {
    if (isScan === 1) {
      setIsOpenQRScanner(true);
    } else if (isScan === 2) {
      setIsOpenQRScanner(false);
    }
  }, [isScan]);

  useEffect(() => {
    getListMachine();
  }, []);

  const getListMachine = () => {
    getMachines()
      .then((res) => setMachineOptions(res.data))
      .catch((err) => console.log("Get list machine error: ", err));
  };

  const getOverAllDetail = () => {
    setLoading(true);
    const resData = {
      machine_id: machine_id,
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
      machine_id: machine_id,
      start_date: formatDateTime(params.start_date, COMMON_DATE_FORMAT_REQUEST),
      end_date: formatDateTime(params.end_date, COMMON_DATE_FORMAT_REQUEST),
    };
    const res = await getLotByMachine(resData);
    setLoading(true);
    return res.data;
    // await getLotByMachine(resData)
    //   .then((res) => {
    //     setSelectedLot([res.data?.[0]]);
    //     setData(res.data);
    //   })
    //   .catch((err) => {
    //     console.error("Get list lot error: ", err);
    //   })
    //   .finally(() => setLoading(false));
  };

  const onChangeLine = (value) => {
    history.push("/manufacture/" + value);
  };

  const onScan = async (result) => {
    scanQrCode({ lot_id: result })
      .then()
      .catch((err) => console.log("Quét mã qr thất bại: ", err));
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

  const handlePrint = async () => {
    if (listCheck.length > 0) {
      print();
    }
  };

  const print = useReactToPrint({
    content: () => componentRef1.current,
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
      const receivedMsg = JSON.parse(event.data);
      const Pre_Counter = receivedMsg.data?.Pre_Counter
        ? parseInt(receivedMsg.data?.Pre_Counter[0][1])
        : 0;
      const Error_Counter = receivedMsg.data?.Error_Counter
        ? parseInt(receivedMsg.data.Error_Counter[0][1])
        : 0;
      let san_luong = 0;
      let sl_ok = 0;
      if (Pre_Counter > 0) {
        san_luong = Pre_Counter - resData[0]?.tong_sl_lo_sx;
      } else {
        san_luong = data[0]?.san_luong;
      }
      if (Error_Counter) {
        sl_ok =
          san_luong - (parseInt(resData[0]?.tong_ng_lo_sx) + Error_Counter);
      } else {
        sl_ok = san_luong - parseInt(resData[0]?.tong_sl_lo_sx);
      }
      console.log(Pre_Counter, Error_Counter, resData[0]);
      if (sl_ok >= resData[0]?.dinh_muc) {
        // setLoadData(!loadData);
      } else {
        const new_data = resData.map((value, index) => {
          if (index === 0) {
            value.san_luong = san_luong;
            value.sl_ok = sl_ok;
            return value;
          } else {
            return value;
          }
        });
        setData(new_data);
        setSelectedLot(new_data[0]);
      }
    };

    // webSocket.onclose = function (event) {
    //   console.log("Connection is closed");
    // };

    // webSocket.onerror = function (error) {
    //   console.log("WebSocket Error: ", error);
    // };
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
          <Col span={window.screen.width < 720 ? 7 : 5}>
            <SelectButton
              options={machineOptions}
              value={machine_id}
              label="Máy"
              onChange={onChangeLine}
            />
          </Col>
          <Col span={window.screen.width < 720 ? 17 : 19}>
            <Table
              size="small"
              pagination={false}
              bordered
              locale={{ emptyText: "Trống" }}
              className="custom-table"
              columns={overallColumns}
              dataSource={overall}
              // scroll={
              //   window.screen.width < 720
              //     ? {
              //         x: window.screen.width,
              //       }
              //     : false
              // }
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
              </div>
            </Col>
          </Row>
          <Col span={24}>
            <Table
              scroll={{
                x: "170vw",
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
