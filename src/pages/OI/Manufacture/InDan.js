import React, { useEffect, useState, useRef } from "react";
import { PrinterOutlined, QrcodeOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Button,
  Table,
  Spin,
  DatePicker,
  Modal,
  Select,
  InputNumber,
  message,
} from "antd";
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
import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import dayjs from "dayjs";
import ScanQR from "../../../components/Scanner";
import TemGiayTam from "./TemGiayTam";
import TemThanhPham from "./TemThanhPham";

const columns = [
  {
    title: "Lô SX",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
    render: (value, record, index) => value || "-",
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
    title: "MQL",
    dataIndex: "mql",
    key: "mql",
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

const InDan = (props) => {
  document.title = "Sản xuất máy tự động";
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
  const [loadData, setLoadData] = useState(false);
  const [data, setData] = useState([]);
  const [selectedLot, setSelectedLot] = useState();
  const [listCheck, setListCheck] = useState([]);
  const [listTem, setListTem] = useState([]);
  const [deviceID, setDeviceID] = useState(
    "e9aba8d0-85da-11ee-8392-a51389126dc6"
  );
  const [overall, setOverall] = useState([
    { kh_ca: 0, san_luong: 0, ti_le_ca: 0, tong_phe: 0 },
  ]);
  const [isOpenQRScanner, setIsOpenQRScanner] = useState(false);
  const [isScan, setIsScan] = useState(0);
  const ws = useRef(null);

  const reloadData = async () => {
    const resData = await getListLotDetail();
    setData(resData);
    if (resData?.[0]?.status === 1) {
      setSelectedLot(resData?.[0]);
    }
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
    if (isScan === 1) {
      setIsOpenQRScanner(true);
    } else if (isScan === 2) {
      setIsOpenQRScanner(false);
    }
  }, [isScan]);

  var timeout;
  useEffect(() => {
    clearTimeout(timeout)
    const loadDataRescursive = async (params, machine_id) => {
      if (!machine_id) return;
      const res = await getLotByMachine(params);
      setData(res.data);
      if (res.data[0]?.status === 1) {
        setSelectedLot(res.data[0]);
      } else {
        setSelectedLot(null);
      }
      if (res.success) {
        if (window.location.href.indexOf("manufacture") > -1)
          timeout = setTimeout(function () {
            loadDataRescursive(params, machine_id);
          }, 5000);
      }
    };
    loadDataRescursive(params, machine_id);
    return () => clearTimeout(timeout);
  }, [params.start_date, params.end_date, params.machine_id]);

  const loadDataRescursive = async (params, machine_id) => {
    console.log(params, machine_id);
    if (!machine_id) return;
    const res = await getLotByMachine(params);
    setData(res.data);
    if (res.data[0]?.status === 1) {
      setSelectedLot(res.data[0]);
    } else {
      setSelectedLot(null);
    }
    if (res.success) {
      if (window.location.href.indexOf("manufacture") > -1)
        timeout = setTimeout(function () {
          loadDataRescursive(params, machine_id);
        }, 5000);
    }
  };

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
    const res = await getLotByMachine(params);
    setLoading(true);
    return res.data;
  };

  const onChangeLine = (value) => {
    window.location.href = ("/oi/manufacture/" + value);
  };

  const onScan = async (result) => {
    const lo_sx = JSON.parse(result).lo_sx;
    scanQrCode({ lo_sx: lo_sx, machine_id: machine_id })
      .then((response) => response.success && reloadData())
      .catch((err) => console.log("Quét mã qr thất bại: ", err));
    setIsOpenQRScanner(false);
    setIsScan(2)
  };

  const rowClassName = (record, index) => {
    if (record.status === 1) {
      return "table-row-green";
    }
    if (record.status === 2) {
      return "table-row-yellow";
    }
    if (record.status === 3) {
      return "table-row-yellow";
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
      } else {
        printThanhPham();
      }
      setListCheck([]);
      setListTem([]);
    }
  };

  const print = useReactToPrint({
    content: () => componentRef1.current,
  });
  const printThanhPham = useReactToPrint({
    content: () => componentRef2.current,
  });

  const handleCloseMdl = () => {
    setIsOpenQRScanner(false);
    setIsScan(2);
  };

  const onChangeStartDate = (value) => {
    setParams({ ...params, start_date: value });
  };

  const onChangeEndDate = (value) => {
    setParams({ ...params, end_date: value });
  };

  const [visiblePrint, setVisiblePrint] = useState();
  const [quantity, setQuantity] = useState();
  const openMdlPrint = () => {
    if (typeof (selectedLot) != 'undefined') {
      setVisiblePrint(true);
      setQuantity(selectedLot?.san_luong);
    } else {
      message.info('Chưa chọn lô in tem');
    }
  }

  const onConfirmPrint = async () => {
    if (selectedLot.so_luong < quantity) {
      message.error('Số lượng nhập vượt quá số lượng thực tế');
    } else {
      const res = { ...selectedLot, so_luong: quantity };
      setListCheck([res]);
      setSelectedLot();
      setQuantity("");
      setVisiblePrint(false);
    }
  };
  const rowSelection = {
    selectedRowKeys: listCheck,
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys)
      setListTem(selectedRows);
    },
    // getCheckboxProps: (record) => ({
    //   disabled: !record?.id
    // }),
  };
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
            />
          </Col>
          <Col span={9}>
            <DatePicker
              allowClear={false}
              placeholder="Từ ngày"
              style={{ width: "100%" }}
              format={COMMON_DATE_FORMAT}
              defaultValue={dayjs()}
              onChange={onChangeStartDate}
            />
          </Col>
          <Col span={9}>
            <DatePicker
              allowClear={false}
              placeholder="Đến ngày"
              style={{ width: "100%" }}
              format={COMMON_DATE_FORMAT}
              defaultValue={dayjs()}
              onChange={onChangeEndDate}
            />
          </Col>
          <Col span={2}>
            <Button
              size="medium"
              type="primary"
              style={{ width: "100%" }}
              onClick={() => setIsScan(1)}
              icon={<QrcodeOutlined style={{ fontSize: "24px" }} />}
            />
          </Col>
          <Col span={2}>
            <Button
              size="medium"
              type="primary"
              style={{ width: "100%" }}
              onClick={handlePrint}
              icon={<PrinterOutlined style={{ fontSize: "24px" }} />}
            />
            <div className="report-history-invoice">
              <TemGiayTam listCheck={listTem} ref={componentRef1} />
              <TemThanhPham listCheck={listTem} ref={componentRef2} />
            </div>
          </Col>
          <Col span={2}>
            <Button
              size="medium"
              type="primary"
              style={{ width: "100%" }}
              onClick={openMdlPrint}
            >
              IN TEM
            </Button>
          </Col>
        </Row>
        <Col span={24} className="mt-2">
          <Table
            scroll={{
              x: "calc(700px + 50%)",
              y: 300,
            }}
            size="small"
            rowClassName={(record, index) =>
              "no-hover " + rowClassName(record, index)
            }
            rowSelection={rowSelection}
            pagination={false}
            bordered
            columns={columns}
            dataSource={data.map((e, index) => ({ ...e, key: index }))}
          />
        </Col>
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
      {visiblePrint && (
        <Modal
          title="Số lượng trên tem"
          open={visiblePrint}
          onCancel={() => setVisiblePrint(false)}
          onOk={onConfirmPrint}
        >
          <InputNumber
            value={quantity}
            max={selectedLot?.san_luong}
            placeholder="Nhập sản lượng trên tem"
            onChange={setQuantity}
            style={{ width: "100%" }}
          />
        </Modal>
      )}
    </React.Fragment>
  );
};

export default InDan;
