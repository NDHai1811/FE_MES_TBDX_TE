import React, { useEffect, useState, useRef } from "react";
import { PrinterOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Button,
  Table,
  Spin,
  DatePicker,
  Modal,
  Select,
} from "antd";
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import {
  getOverAll,
  getLotByMachine,
  scanQrCode,
  startStopProduce,
  getTrackingStatus,
  getCurrentManufacturing,
} from "../../../api/oi/manufacture";
import { useReactToPrint } from "react-to-print";
import TemTest from "./TemTest";
import Tem from "./Tem";
import TemIn from "./TemIn";
import TemDan from "./TemDan";
import {
  COMMON_DATE_FORMAT,
} from "../../../commons/constants";
import dayjs from "dayjs";
import ScanQR from "../../../components/Scanner";
import { getTem } from "../../../api";


const columns = [
  {
    title: "Lô SX",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
    render: (value, record, index) => value || "-",
  },
  {
    title: "MDH",
    dataIndex: "mdh",
    key: "mdh",
    align: "center",
    render: (value, record, index) => value || "-",
  },
  {
    title: "Khách hàng",
    dataIndex: "khach_hang",
    key: "khach_hang",
    align: "center",
    render: (value, record, index) => value || "-",
  },
  {
    title: "Số lớp",
    dataIndex: "so_lop",
    key: "so_lop",
    align: "center",
    render: (value, record, index) => value || "-",
  },
  {
    title: "Khổ tổng",
    dataIndex: "kho_tong",
    key: "kho_tong",
    align: "center",
    render: (value, record, index) => value || "-",
  },
  {
    title: "Dài tấm",
    dataIndex: "dai_tam",
    key: "dai_tam",
    align: "center",
    render: (value, record, index) => value || "-",
  },
  {
    title: "SL kế hoạch",
    dataIndex: "san_luong_kh",
    key: "san_luong_kh",
    align: "center",
  },
  {
    title: "SL đầu ra",
    dataIndex: "sl_dau_ra_hang_loat",
    key: "sl_dau_ra_hang_loat",
    align: "center",
  },
  {
    title: "SL đạt",
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
];

const Manufacture1 = (props) => {
  document.title = "Sản xuất máy Sóng";
  const { machine_id } = useParams();
  const currentColumns = [
    {
      title: "Lô SX",
      dataIndex: "lo_sx",
      key: "lo_sx",
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "Sản lượng kế hoạch",
      dataIndex: "san_luong_kh",
      key: "san_luong_kh",
      align: "center",
      render: (value) => value,
    },
    {
      title: "Sản lượng đầu ra",
      dataIndex: "sl_dau_ra_hang_loat",
      key: "sl_dau_ra_hang_loat",
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
  const history = useHistory();
  const componentRef1 = useRef();
  const componentRef2 = useRef();
  const componentRef3 = useRef();

  const [params, setParams] = useState({
    machine_id: machine_id,
    start_date: dayjs(),
    end_date: dayjs(),
  });
  const { machineOptions = [] } = props
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedLot, setSelectedLot] = useState();
  const [listCheck, setListCheck] = useState([]);
  const [listTem, setListTem] = useState([]);
  const [isPause, setIsPasue] = useState(true);
  const [overall, setOverall] = useState([
    { kh_ca: 0, san_luong: 0, ti_le_ca: 0, tong_phe: 0 },
  ]);

  const reloadData = async () => {
    getListLotDetail();
    getOverAllDetail();
  };
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
    (async () => {
      var res = await getTrackingStatus({ machine_id: machine_id });
      if (res.success) {
        setIsPasue(!res.data?.status)
      }
      // var tem = await getTem();
      // setListTem(tem);
    })();
  }, []);

  useEffect(() => {
    reloadData();
  }, [params, machine_id]);

  var timeout;
  const loadDataRescursive = async (machine_id, selectedLot) => {
    if (!machine_id || isPause) return;
    const res = await getCurrentManufacturing({ machine_id });
    console.log(selectedLot?.lo_sx, res.data?.lo_sx);
    if (selectedLot?.lo_sx !== res.data?.lo_sx) {
      reloadData();
    }
    setData(prev => prev.map(e => {
      if (e?.lo_sx === res.data?.lo_sx) {
        return { ...e, ...res.data }
      }
      return e;
    }))
    setSelectedLot(res.data);
    if (res.success) {
      if (window.location.href.indexOf("/oi/manufacture") > -1)
        timeout = setTimeout(function () {
          loadDataRescursive(machine_id, selectedLot);
        }, 3000);
    }
  };
  useEffect(() => {
    clearTimeout(timeout);
    console.log('changed lo_sx', selectedLot);
    !isPause && loadDataRescursive(machine_id, selectedLot, isPause);
    return () => clearTimeout(timeout);
  }, [isPause, selectedLot?.lo_sx]);



  const getOverAllDetail = () => {
    setLoading(true);
    getOverAll(params)
      .then((res) => setOverall(res.data))
      .catch((err) => {
        console.error("Get over all error: ", err);
      })
      .finally(() => setLoading(false));
  };

  const getListLotDetail = async () => {
    setLoading(true);
    const res = await getLotByMachine(params);
    setData(res.data.map((e, index) => ({ ...e, key: e.lo_sx })))
  };

  const onChangeLine = (value) => {
    window.location.href = ("/oi/manufacture/" + value);
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

  const handlePrint = async () => {
    if (listTem.length > 0) {
      if (machine_id === "S01") {
        print();
      } else if (machine_id == "P06" || machine_id == "P15") {
        printIn();
      } else if (machine_id == "D05" || machine_id == "D06") {
        printDan();
      }
      setListCheck([]);
      setListTem([]);
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


  const onChangeStartDate = (value) => {
    setParams({ ...params, start_date: value });
  };

  const onChangeEndDate = (value) => {
    setParams({ ...params, end_date: value });
  };


  const rowSelection = {
    selectedRowKeys: listCheck,
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys)
      setListTem(selectedRows);
    },

  };

  const onClickRow = (record) => {
    record.status <= 1 && isPause && setSelectedLot(record);
  }

  const onClickBtn = async () => {
    var res = await startStopProduce({ lo_sx: selectedLot?.lo_sx, is_pause: !isPause, machine_id: machine_id });
    if (res.success) {
      setIsPasue(!isPause);
      reloadData();
    }
  }
  const tableRef = useRef();
  return (
    <React.Fragment>
      <Spin spinning={loading}>
        <Row className="mt-1" gutter={[6, 8]}>
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
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => { tableRef.current?.scrollTo({ key: selectedLot?.lo_sx }); },
                };
              }}
            />
          </Col>
          <Col span={6}>
            <DatePicker
              allowClear={false}
              placeholder="Từ ngày"
              style={{ width: "100%" }}
              format={COMMON_DATE_FORMAT}
              defaultValue={dayjs()}
              onChange={onChangeStartDate}
            />
          </Col>
          <Col span={6}>
            <DatePicker
              allowClear={false}
              placeholder="Đến ngày"
              style={{ width: "100%" }}
              format={COMMON_DATE_FORMAT}
              defaultValue={dayjs()}
              onChange={onChangeEndDate}
            />
          </Col>
          <Col span={6}><Button type="primary" onClick={onClickBtn} className="w-100">{isPause ? 'Bắt đầu' : 'Dừng'}</Button></Col>
          <Col span={6}>
            <Button
              size="medium"
              type="primary"
              style={{ width: "100%" }}
              onClick={handlePrint}
              icon={<PrinterOutlined style={{ fontSize: "24px" }} />}
            />
            <div className="report-history-invoice">
              {/* <TemTest listCheck={listTem} ref={componentRef1} /> */}
              <Tem listCheck={listTem} ref={componentRef1} />
              <TemIn listCheck={listTem} ref={componentRef2} />
              <TemDan listCheck={listTem} ref={componentRef3} />
            </div>
          </Col>
          <Col span={24}>
            <Table
              scroll={{
                // x: "calc(700px + 50%)",
                y: 300,
              }}
              size="small"
              rowClassName={(record, index) =>
                "no-hover " + rowClassName(record, index)
              }
              ref={tableRef}
              pagination={false}
              bordered
              columns={columns}
              rowSelection={rowSelection}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => { onClickRow(record) },
                };
              }}
              dataSource={data}
            />
          </Col>
        </Row>
      </Spin>
    </React.Fragment>
  );
};

export default Manufacture1;
