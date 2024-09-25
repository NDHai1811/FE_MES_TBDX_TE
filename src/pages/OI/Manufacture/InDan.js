import React, { useEffect, useState, useRef, useReducer } from "react";
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
  useLocation,
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
import { baseHost } from "../../../config";
import Echo from 'laravel-echo';
import socketio from 'socket.io-client';

const columns = [
  {
    title: "Khách hàng",
    dataIndex: "khach_hang",
    key: "khach_hang",
    align: "center",
    render: (value, record, index) => value || "-",
  },
  {
    title: "MĐH",
    dataIndex: "mdh",
    key: "mdh",
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
  {
    title: "Sản lượng kế hoạch",
    dataIndex: "dinh_muc",
    key: "dinh_muc",
    align: "center",
  },
  {
    title: "Sản lượng đầu ra",
    dataIndex: "sl_dau_ra_hang_loat",
    key: "sl_dau_ra_hang_loat",
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
    title: "Lô SX",
    dataIndex: "lo_sx",
    key: "lo_sx",
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
      dataIndex: "sl_dau_ra_hang_loat",
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
  const location = useLocation();
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

  useEffect(()=>{
    getOverAllDetail();
    getListLotDetail();
  }, [params])

  useEffect(() => {
    if (isScan === 1) {
      setIsOpenQRScanner(true);
    } else if (isScan === 2) {
      setIsOpenQRScanner(false);
    }
  }, [isScan]);

  const getOverAllDetail = async () => {
    var res = await getOverAll(params);
    setOverall(res.data);
  };

  const getListLotDetail = async () => {
    setLoading(true);
    const res = await getLotByMachine(params);
    let check = false;
    setData(res.data.map(e => {
      if (e?.status === 1 && !check) {
        setSpecifiedRowKey(e?.lo_sx);
        setSelectedLot(e);
        check = true;
      }
      return { ...e, key: e?.lo_sx }
    }));
    // tableDispatch({type: 'UPDATE_DATA', payload: res.data.map((e, index) => ({ ...e, key: e.lo_sx }))});
    setLoading(false);
  };

  const onChangeLine = (value) => {
    window.location.href = ("/oi/manufacture/" + value);
  };

  const onScan = async (result) => {
    const lo_sx = JSON.parse(result).lo_sx;
    scanQrCode({ lo_sx: lo_sx, machine_id: machine_id })
      .then((response) => response.success && getListLotDetail())
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
  const table = document.querySelector('.bottom-table .ant-table-body')?.getBoundingClientRect();
  const [tableSize, setTableSize] = useState(
    {
      width: window.innerWidth < 700 ? '300vw' : '100%',
      height: table?.top ? (window.innerHeight - table?.top) - 60 : 300,
    }
  );
  useEffect(() => {
    const handleWindowResize = () => {
      const table = document.querySelector('.bottom-table .ant-table-body')?.getBoundingClientRect();
      setTableSize(
        {
          width: window.innerWidth < 700 ? '300vw' : '100%',
          height: table?.top ? (window.innerHeight - table?.top) - 60 : 300,
        }
      );
    };
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [data]);
  const dataReducer = (state, action) => {
    switch (action.type) {
      case 'UPDATE_DATA':
        return action.payload;
      default:
        return state;
    }
  };
  const [updatedData, dispatch] = useReducer(dataReducer, []);
  const dataTableReducer = (state, action) => {
    switch (action.type) {
      case 'UPDATE_DATA':
        return action.payload;
      default:
        return state;
    }
  };
  const [dataTable, tableDispatch] = useReducer(dataTableReducer, []);
  useEffect(() => {
    if(!(location.pathname.indexOf('/oi/manufacture') > -1)){
      return 0;
    }
    window.io = socketio;
    window.Echo = new Echo({
      broadcaster: 'socket.io',
      host: baseHost+':6001', // Laravel Echo Server host
      transports: ['websocket', 'polling', 'flashsocket']
    });
    window.Echo.connector.socket.on('connect', () => {
      console.log('WebSocket connected!');
    });
    window.Echo.connector.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    window.Echo.connector.socket.on('disconnect', () => {
      console.log('WebSocket disconnected!');
    });
    window.Echo.channel('laravel_database_mychannel')
      .listen('.my-event', (e) => {
        console.log(e.data);
        if(e.data?.info_cong_doan?.machine_id !== machine_id){
          return;
        }
        if (e.data?.reload) {
          window.location.reload();
        } else {
          if (e.data?.info_cong_doan) {
            setData(prevData => [...prevData].map(lo => {
              if (e.data?.info_cong_doan?.lo_sx == lo.lo_sx) {
                const current = { ...lo, ...e.data?.info_cong_doan};
                setSelectedLot(current);
                setSpecifiedRowKey(current?.lo_sx);
                return current;
              }
              return lo;
            }));
            
            
          }
        }
      });
    return () => {
      window.Echo.leaveChannel('laravel_database_mychannel');
    };
  }, [location]);
  const [specifiedRowKey, setSpecifiedRowKey] = useState(null);
  const tableRef = useRef();
  const handleScrollToRow = (specifiedRowKey) => {
    if (specifiedRowKey !== null && tableRef.current) {
      tableRef.current?.scrollTo({ key: specifiedRowKey, behavior: 'smooth' });
    }
  };
  useEffect(() => {
    if (data.length > 0) {
      handleScrollToRow(specifiedRowKey);
    }
  }, [specifiedRowKey]);
  useEffect(()=>{
    const updateItems = dataTable.map(item => {
      const record = updatedData.find(e => e?.lo_sx === item.lo_sx);
      if (record) {
        return {
          ...item,
          ...record
        };
      }
      return item;
    });
    tableDispatch({type: 'UPDATE_DATA', payload: updateItems});
  }, [updatedData])
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
            ref={tableRef}
            scroll={{
              x: tableSize.width,
              y: tableSize.height,
            }}
            size="small"
            rowClassName={(record, index) =>
              "no-hover " + rowClassName(record, index)
            }
            className="bottom-table"
            rowSelection={rowSelection}
            pagination={false}
            bordered
            columns={columns}
            dataSource={data}
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
