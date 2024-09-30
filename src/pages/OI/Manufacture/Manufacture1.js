import React, { useEffect, useState, useRef, useReducer } from "react";
import { PrinterOutlined } from "@ant-design/icons";
import Echo from 'laravel-echo';
import socketio from 'socket.io-client';
import {
  Row,
  Col,
  Button,
  Table,
  Spin,
  DatePicker,
  Select,
  Tooltip,
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
  startStopProduce,
  getTrackingStatus,
  getCurrentManufacturing,
  startProduce,
  stopProduce,
} from "../../../api/oi/manufacture";
import { useReactToPrint } from "react-to-print";
import {
  COMMON_DATE_FORMAT,
} from "../../../commons/constants";
import dayjs from "dayjs";
import TemGiayTam from "./TemGiayTam";
import TemThanhPham from "./TemThanhPham";
import { getTem } from "../../../api";
import TemTest from "./TemTest";
import { baseHost, baseURL } from "../../../config";

const columns = [
  {
    title: "STT tem",
    dataIndex: "thu_tu_uu_tien",
    key: "thu_tu_uu_tien",
    align: "center",
    width: 50
  },
  {
    title: "Tên khách hàng",
    dataIndex: "khach_hang",
    key: "khach_hang",
    align: "center",
    width: 90
  },
  {
    title: "MDH",
    dataIndex: "mdh",
    key: "mdh",
    align: "center",
    width: 90
  },
  {
    title: "Kích chạy",
    dataIndex: "quy_cach",
    key: "quy_cach",
    align: "center",
    width: 100
  },
  {
    title: "Khổ",
    dataIndex: "kho_tong",
    key: "kho_tong",
    align: "center",
    width: 60
  },
  {
    title: "Dài tấm",
    dataIndex: "dai_tam",
    key: "dai_tam",
    align: "center",
    width: 70
  },
  {
    title: "SL KH",
    dataIndex: "san_luong_kh",
    key: "san_luong_kh",
    align: "center",
    width: 70
  },
  // {
  //   title: "Số dao",
  //   dataIndex: "so_dao",
  //   key: "so_dao",
  //   align: "center",
  //   width: 70
  // },
  {
    title: "SL thực tế",
    dataIndex: "sl_dau_ra_hang_loat",
    key: "sl_dau_ra_hang_loat",
    align: "center",
    width: 80
  },
  {
    title: "Mặt F",
    dataIndex: "ma_cuon_f",
    key: "ma_cuon_f",
    align: "center",
    width: 70,
  },
  {
    title: "Sóng E",
    dataIndex: "ma_cuon_se",
    key: "ma_cuon_se",
    align: "center",
    width: 70,
  },
  {
    title: "Láng E",
    dataIndex: "ma_cuon_le",
    key: "ma_cuon_le",
    align: "center",
    width: 70,
  },
  {
    title: "Sóng B",
    dataIndex: "ma_cuon_sb",
    key: "ma_cuon_sb",
    align: "center",
    width: 70,
  },
  {
    title: "Láng B",
    dataIndex: "ma_cuon_lb",
    key: "sl",
    align: "center",
    width: 70,
  },
  {
    title: "Sóng C",
    dataIndex: "ma_cuon_sc",
    key: "ma_cuon_sc",
    align: "center",
    width: 70,
  },
  {
    title: "Láng C",
    dataIndex: "ma_cuon_lc",
    key: "ma_cuon_lc",
    align: "center",
    width: 70,
  },
  {
    title: "Số mét tới",
    dataIndex: "so_m_toi",
    key: "so_m_toi",
    align: "center",
    width: 70
  },
  {
    title: "SL phế",
    dataIndex: "sl_ng_sx",
    key: "sl_ng_sx",
    align: "center",
    width: 70
  },
  {
    title: "Phán định",
    dataIndex: "phan_dinh",
    key: "phan_dinh",
    align: "center",
    width: 70,
    render: (value) => (value === 1 ? "OK" : (value === 2 ? "NG" : "")),
  },
  {
    title: "Lô SX",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
    width: 120
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
      width: '20%',
      render: (value) => value ?? "-",
    },
    {
      title: "SL kế hoạch",
      dataIndex: "san_luong_kh",
      key: "san_luong_kh",
      align: "center",
      width: '20%',
      render: (value) => value ?? "-",
    },
    {
      title: "SL còn lại",
      dataIndex: "sl_con_lai",
      key: "sl_con_lai",
      align: "center",
      width: '20%',
      render: (value, record) => (record?.san_luong_kh ?? 0) - (record?.sl_dau_ra_hang_loat ?? 0),
    },
    {
      title: "Phế",
      dataIndex: "sl_ng_sx",
      key: "sl_ng_sx",
      align: "center",
      width: '20%',
      render: (value) => value ?? "-",
    },
    {
      title: "Phán định",
      dataIndex: "phan_dinh",
      key: "phan_dinh",
      align: "center",
      width: '20%',
      render: (value) => value ?? "-",
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
  const [data, setData] = useState([]);
  const [selectedLot, setSelectedLot] = useState();
  const [listCheck, setListCheck] = useState([]);
  const [listTem, setListTem] = useState([]);
  const [isPaused, setIsPasued] = useState(true);
  const [current, setCurrent] = useState(null);
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
          variant="bordered"
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
        setIsPasued(!res.data?.is_running);
      }
      // var tem = await getTem();
      // setListTem(tem)
    })();
  }, []);

  // useEffect(() => {
  //   if (LSX) {
  //     setSelectedLot(data.find(e => e.lo_sx === LSX))
  //   } else {
  //     setSelectedLot();
  //   }

  // }, [data, LSX]);

  useEffect(() => {
    reloadData();
  }, [params, machine_id]);

  const getOverAllDetail = () => {
    getOverAll(params)
      .then((res) => setOverall(res.data))
      .catch((err) => {
        console.error("Get over all error: ", err);
      })
  };

  const getListLotDetail = async () => {
    setLoading(true);
    const res = await getLotByMachine(params);
    setData(res.data.map(e => {
      if (e?.status === 1) {
        setCurrent(e)
      }
      return { ...e, key: e?.lo_sx }
    }));
    // tableDispatch({
    //   type: 'UPDATE_DATA', payload: res.data.map((e, index) => {
    //     if (e.status == 1) {
    //       setSpecifiedRowKey(e.lo_sx);
    //     }
    //     return { ...e, key: e.lo_sx }
    //   })
    // });
    setLoading(false);
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
      return "table-row-yellow";
    }
    if (record.status === 4) {
      return "table-row-grey";
    }
    if (record?.lo_sx === selectedLot?.lo_sx) {
      return "table-row-light-blue";
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
      // setListTem([]);
    }
  };

  const print = useReactToPrint({
    content: () => componentRef1.current,
  });
  const printThanhPham = useReactToPrint({
    content: () => componentRef2.current,
  });


  const onChangeStartDate = (value) => {
    setParams({ ...params, start_date: value });
  };

  const onChangeEndDate = (value) => {
    setParams({ ...params, end_date: value });
  };


  const rowSelection = {
    fixed: true,
    columnWidth: 50,
    selectedRowKeys: listCheck,
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys)
      setListTem(selectedRows);
    },

  };

  const onClickRow = (record) => {
    record.status <= 1 && isPaused && setSelectedLot(record);
  }
  const [messageApi, contextHolder] = message.useMessage();
  const [loadingAction, setLoadingAction] = useState(false)
  const onStart = async () => {
    if (listCheck.length !== 1 || !(listCheck[0] ?? false)) {
      messageApi.warning('Chọn 1 lô để bắt đầu');
      return 0;
    }
    setLoadingAction(true);
    var res = await startProduce({ lo_sx: listCheck[0], is_pause: false, machine_id: machine_id });
    if (res.success) {
      setIsPasued(false);
      getListLotDetail();
    }
    setListCheck([]);
    setLoadingAction(false);
  }
  const onStop = async () => {
    setLoadingAction(true);
    var res = await stopProduce({ lo_sx: selectedLot?.lo_sx, is_pause: true, machine_id: machine_id });
    if (res.success) {
      setIsPasued(true);
      getListLotDetail();
    }
    setLoadingAction(false);
  }
  const tableRef = useRef();
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
    if (!(location.pathname.indexOf('/oi/manufacture') > -1)) {
      return 0;
    }
    window.io = socketio;
    window.Echo = new Echo({
      broadcaster: 'socket.io',
      host: baseHost + ':6001', // Laravel Echo Server host
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
        if(e.data?.info_cong_doan?.machine_id !== machine_id){
          return;
        }
        console.log(e.data);
        if (e.data?.reload) {
          reloadData(); 
        } else {
          if (e.data?.info_cong_doan) {
            setData(prevData => [...prevData].map(lo => {
              if (e.data?.info_cong_doan?.lo_sx == lo.lo_sx) {
                const current = { ...lo, ...e.data?.info_cong_doan};
                setCurrent(current);
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
  const handleScrollToRow = () => {
    if (specifiedRowKey !== null && tableRef.current) {
      tableRef.current?.scrollTo({ key: specifiedRowKey, behavior: 'smooth' });
    }
  };
  useEffect(() => {
    console.log('dm', specifiedRowKey, data);
    
    if (data.length > 0) {
      handleScrollToRow(specifiedRowKey);
    }
  }, [specifiedRowKey]);
  useEffect(()=>{
    current && setSpecifiedRowKey(current?.lo_sx);
  }, [current])
  return (
    <React.Fragment>
      {contextHolder}
      <Row className="mt-1" gutter={[6, 8]}>
        <Col span={24}>
          <Table
            size="small"
            pagination={false}
            bordered
            locale={{ emptyText: "Trống" }}
            className="custom-table"
            columns={overallColumns}
            dataSource={overall.map((e, i) => ({ ...e, key: i }))}
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
            dataSource={current ? [current] : []}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => { tableRef.current?.scrollTo({ key: current?.lo_sx, behavior: 'smooth' }); },
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
        <Col span={6}><Button type="primary" loading={loadingAction} onClick={() => isPaused ? onStart() : onStop()} className="w-100">{isPaused ? 'Bắt đầu' : 'Dừng'}</Button></Col>
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
            <TemGiayTam listCheck={listTem} ref={componentRef1} />
            <TemThanhPham listCheck={listTem} ref={componentRef2} />
          </div>
        </Col>
        <Col span={24}>
          <Table
            loading={loading}
            scroll={{
              x: true,
              y: '50vh',
            }}
            size="small"
            rowClassName={(record, index) =>
              "no-hover " + rowClassName(record, index)
            }
            rowKey={'lo_sx'}
            rowHoverable={false}
            className="bottom-table"
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
            // virtual
            dataSource={data}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Manufacture1;
