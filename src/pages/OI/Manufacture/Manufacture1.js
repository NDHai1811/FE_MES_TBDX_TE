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
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtZXNzeXN0ZW1AZ21haWwuY29tIiwidXNlcklkIjoiNGQxYzg5NTAtODVkOC0xMWVlLTgzOTItYTUxMzg5MTI2ZGM2Iiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJzZXNzaW9uSWQiOiJlMzg3YmYyNS05MWU2LTQxYjUtOWMyOS0xZjM2MjljYWU2N2QiLCJpc3MiOiJ0aGluZ3Nib2FyZC5pbyIsImlhdCI6MTcwMTA0Nzk2OSwiZXhwIjoxNzAxMDU2OTY5LCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMzYwY2MyMjAtODVkOC0xMWVlLTgzOTItYTUxMzg5MTI2ZGM2IiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCJ9.h_DR_3yFs92-w_WEAOCmOmzTg73U1jTAJN-jL_JXX-yOZiDdJsE6_OtgNkLSPtO4RD_slQexD47GHtSUqj1nyA";
const url = `ws://113.176.95.167:3030/api/ws/plugins/telemetry?token=${token}`;

const currentColumns = [
  {
    title: "Mã lot",
    dataIndex: "lot_id",
    key: "lot_id",
    align: "center",
  },
  {
    title: "Sản lượng kế hoạch",
    dataIndex: "san_luong_kh",
    key: "san_luong_kh",
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

const Manufacture1 = (props) => {
  document.title = "Sản xuất";
  const { machine_id } = useParams();

  const history = useHistory();
  const componentRef1 = useRef();

  const [params, setParams] = useState({
    machine_id: machine_id,
    start_date: dayjs(),
    end_date: dayjs(),
  });
  const [machineOptions, setMachineOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedLot, setSelectedLot] = useState([]);
  const [listCheck, setListCheck] = useState([]);
  const [overall, setOverall] = useState([
    { kh_ca: 0, san_luong: 0, ti_le_ca: 0, tong_phe: 0 },
  ]);
  const [isOpenQRScanner, setIsOpenQRScanner] = useState(false);
  const [isScan, setIsScan] = useState(0);
  const [socket, setSocket] = useState(null);
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
    if (machine_id) {
      getOverAllDetail();
      getListLotDetail();
    }
  }, [machine_id]);

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

  const onClickRow = (value) => {
    setSelectedLot([value]);
  };

  const getListMachine = () => {
    getMachines()
      .then((res) => setMachineOptions(res.data))
      .catch((err) => console.log("Get list machine error: ", err));
  };

  const getOverAllDetail = () => {
    setLoading(true);
    const resData = {
      machine_id: params.machine_id,
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

  const getListLotDetail = () => {
    const resData = {
      machine_id: params.machine_id,
      start_date: formatDateTime(params.start_date, COMMON_DATE_FORMAT_REQUEST),
      end_date: formatDateTime(params.end_date, COMMON_DATE_FORMAT_REQUEST),
    };
    setLoading(true);
    getLotByMachine(resData)
      .then(async (res) => {
        var check = await checkMaterialPosition({...res.data[0], machine_id});
        if(check.success){
          setSelectedLot([res.data[0]]);
        }
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

  const handleCloseMdl = () => {
    setIsOpenQRScanner(false);
    setIsScan(2);
  };

  const connectWebsocket = (deviceId) => {
    const entityId = deviceId;
    const webSocket = new WebSocket(url);

    webSocket.onopen = function () {
      const object = {
        tsSubCmds: [
          {
            entityType: "DEVICE",
            entityId: entityId,
            scope: "LATEST_TELEMETRY",
            cmdId: 10,
          },
        ],
        historyCmds: [],
        attrSubCmds: [],
      };
      const data = JSON.stringify(object);
      webSocket.send(data);
    };

    webSocket.onmessage = function (event) {
      const receivedMsg = JSON.parse(event.data);
      console.log(receivedMsg.data);
    };

    webSocket.onclose = function (event) {
      console.log("Connection is closed");
      connectWebsocket(deviceId);
    };

    webSocket.onerror = function (error) {
      console.log("WebSocket Error: ", error);
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
  };

  const onChangeStartDate = (value) => {
    setParams({ ...params, start_date: value });
  };

  const onChangeEndDate = (value) => {
    setParams({ ...params, end_date: value });
  };

  // useEffect(() => {
  //   setParams({
  //     ...params,
  //     machine_id: machineOptions.find((e) => e.line_id === machine_id)?.value,
  //   });
  // }, [machineOptions]);
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
              dataSource={selectedLot}
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
              onRow={(record, rowIndex) => {
                return {
                  onClick: () => onClickRow(record),
                };
              }}
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
