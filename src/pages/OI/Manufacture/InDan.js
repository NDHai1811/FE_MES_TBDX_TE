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
  Form,
  Input,
  Tabs,
  Space,
  Badge,
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
  getTrackingStatus,
  startTracking,
  stopTracking,
  updateQuantityInfoCongDoan,
  getPausedPlanList,
  pausePlan,
  resumePlan,
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
    width: 100,
  },
  {
    title: "MĐH",
    dataIndex: "mdh",
    key: "mdh",
    align: "center",
    render: (value, record, index) => value || "-",
    width: 100,
  },
  {
    title: "MQL",
    dataIndex: "mql",
    key: "mql",
    align: "center",
    render: (value, record, index) => value || "-",
    width: 50,
  },
  {
    title: "Quy cách",
    dataIndex: "quy_cach",
    key: "quy_cach",
    align: "center",
    render: (value, record, index) => value || "-",
    width: 130,
  },
  {
    title: "Sản lượng kế hoạch",
    dataIndex: "dinh_muc",
    key: "dinh_muc",
    align: "center",
    width: 150,
  },
  {
    title: "Sản lượng đầu ra",
    dataIndex: "sl_dau_ra_hang_loat",
    key: "sl_dau_ra_hang_loat",
    align: "center",
    width: 130,
  },
  {
    title: "Sản lượng đạt",
    dataIndex: "sl_ok",
    key: "sl_ok",
    align: "center",
    width: 110,
  },
  {
    title: "Phán định",
    dataIndex: "phan_dinh",
    key: "phan_dinh",
    align: "center",
    render: (value) => (value === 1 ? "OK" : "-"),
    width: 90,
  },
  {
    title: "Mã layout",
    dataIndex: "layout_id",
    key: "layout_id",
    align: "center",
    render: (value) => value || "-",
    width: 90,
  },
  {
    title: "Lô SX",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
    render: (value, record, index) => value || "-",
    width: 120,
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

  const reloadData = async () => {
    await getListLotDetail();
    await getOverAllDetail();
  }

  useEffect(() => {
    reloadData();
    fetchPausedPlan();
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
    fetchTrackingStatus();
    // tableDispatch({type: 'UPDATE_DATA', payload: res.data.map((e, index) => ({ ...e, key: e.lo_sx }))});
    setLoading(false);
  };

  const onChangeLine = (value) => {
    window.location.href = ("/oi/manufacture/" + value);
  };

  const onScan = async (result) => {
    const qrResult = JSON.parse(result);
    const lo_sx = qrResult?.lo_sx;
    scanQrCode({ lo_sx: lo_sx, machine_id: machine_id, so_luong: qrResult?.so_luong })
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

  useEffect(() => {
    handlePrint();
  }, [listTem]);

  const printSelectedLots = () => {
    if (listCheck.length > 0) {
      setListTem(data.filter(e => listCheck.includes(e.key)));
    } else {
      message.info('Chọn lô để in');
    }
  }

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
  const [quantity, setQuantity] = useState(0);
  const openMdlPrint = () => {
    if (listCheck.length === 1) {
      setVisiblePrint(true);
      setQuantity(data.find(e => e.key === listCheck[0])?.san_luong);
    } else {
      message.info('Chọn 1 lô để in tem');
    }
  }

  const onConfirmPrint = async () => {
    console.log(quantity);

    if (data.find(e => e.key === listCheck[0])?.so_luong < quantity) {
      message.error('Số lượng nhập vượt quá số lượng thực tế');
    } else {
      const res = { ...data.find(e => e.key === listCheck[0]), so_luong: quantity };
      setListTem([res]);
      setSelectedLot();
      setQuantity(0);
      setVisiblePrint(false);
      setListCheck([]);
    }
  };
  const rowSelection = {
    selectedRowKeys: listCheck,
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys)
      // setListTem(selectedRows);
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
        if (e.data?.info_cong_doan?.machine_id !== machine_id) {
          return;
        }
        console.log(e.data);
        if (e.data?.reload) {
          getOverAllDetail();
          getListLotDetail();
        } else {
          if (e.data?.info_cong_doan) {
            setData(prevData => [...prevData].map(lo => {
              if (e.data?.info_cong_doan?.lo_sx == lo.lo_sx) {
                const current = { ...lo, ...e.data?.info_cong_doan };
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
  useEffect(() => {
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
    tableDispatch({ type: 'UPDATE_DATA', payload: updateItems });
  }, [updatedData]);

  const [trackingStatus, setTrackingStatus] = useState(0);
  const fetchTrackingStatus = async () => {
    var res = await getTrackingStatus({ machine_id: machine_id });
    if (res.success) {
      setTrackingStatus(res.data?.status);
    }
  }
  const onChangeTrackingStatus = async () => {
    if (trackingStatus === 0) {
      await startTracking({ machine_id: machine_id });
    } else {
      await stopTracking({ machine_id: machine_id });
    }
    fetchTrackingStatus();
  }
  const [form] = Form.useForm();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const onUpdateQuantity = async (values) => {
    var res = await updateQuantityInfoCongDoan(values);
    if (res.success) {
      closeModal();
      getListLotDetail();
      setListCheck([]);
    }
  }
  const openModal = () => {
    if (listCheck.length !== 1) {
      message.info('Chọn 1 lô để nhập sản lượng');
      return;
    }
    const target = data.find(e => e.key === listCheck[0]);
    if (target?.status <= 1) {
      message.info('Lô này chưa hoàn thành');
      return;
    }
    setIsOpenModal(true);
    form.setFieldsValue(target)
  }

  const closeModal = () => {
    form.resetFields();
    setIsOpenModal(false);
  }
  const [pausing, setPausing] = useState(false);
  const [pausedList, setPasuedList] = useState([]);
  const [resuming, setResuming] = useState(false);
  const [selectedPausedKeys, setSelectedPausedKeys] = useState([]);
  const pausedSelection = {
    fixed: true,
    columnWidth: 50,
    selectedRowKeys: selectedPausedKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedPausedKeys(selectedRowKeys);
    },
  }
  const fetchPausedPlan = async () => {
    var res = await getPausedPlanList(params);
    setPasuedList(res.data.map(e=>({...e, key: e.key})));
  }
  const pause = async () => {
    if (listCheck.length <= 0) {
      message.info('Chưa chọn kế hoạch muốn dừng');
      return;
    }
    const check = data.find(e => listCheck.includes(e.key) && e.status > 1)
    if (check) {
      message.info('Lô ' + check?.lo_sx + " đã sản xuất");
      return;
    }
    setPausing(true);
    var res = await pausePlan({ info_ids: data.filter(e=>listCheck.includes(e.lo_sx)).map(e=>e.id), machine_id: machine_id });
    reloadData();
    fetchPausedPlan();
    setListCheck([]);
    setSelectedPausedKeys([]);
    setPausing(false);
  }
  const resume = async () => {
    if (selectedPausedKeys.length <= 0) {
      message.info('Chưa chọn kế hoạch muốn tiếp tục');
      return;
    }
    console.log(pausedList.filter(e=>selectedPausedKeys.includes(e.key)));
    
    setResuming(true);
    var res = await resumePlan({ info_ids: pausedList.filter(e=>selectedPausedKeys.includes(e.lo_sx)).map(e=>e.id), machine_id: machine_id });
    reloadData();
    fetchPausedPlan();
    setListCheck([]);
    setSelectedPausedKeys([]);
    setResuming(false);
  }
  const items = [
    {
      label: 'Danh sách sản xuất',
      key: 1,
      children:
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <div style={{ width: '100%', justifyContent: 'space-between', display: 'flex', gap: 8 }}>
              {(machine_id === 'P15' || machine_id === 'P06') ? <Button
                size="medium"
                type="primary"
                style={{ width: "100%" }}
                disabled={trackingStatus === 1}
                onClick={() => onChangeTrackingStatus()}
              >Bắt đầu</Button> : null}
              <Button
                size="medium"
                type="primary"
                style={{ width: "100%" }}
                onClick={() => setIsScan(1)}
                icon={<QrcodeOutlined style={{ fontSize: "24px" }} />}
              />
              <Button
                size="medium"
                type="primary"
                style={{ width: "100%" }}
                onClick={printSelectedLots}
                icon={<PrinterOutlined style={{ fontSize: "24px" }} />}
              />
              <div className="report-history-invoice">
                <TemGiayTam listCheck={listTem} ref={componentRef1} />
                <TemThanhPham listCheck={listTem} ref={componentRef2} />
              </div>
              <Button type="primary" disabled={listCheck.length !== 1} onClick={openModal} className="w-100">{'Nhập sản lượng tay'}</Button>
              <Button type="primary" disabled={listCheck.length <= 0} loading={pausing} onClick={pause} className="w-100">{'Tạm dừng'}</Button>
            </div>
          </Col>
          <Col span={24}>
            <Table
              ref={tableRef}
              scroll={{
                // x: tableSize.width,
                y: tableSize.height,
              }}
              size="small"
              rowClassName={(record, index) =>
                rowClassName(record, index)
              }
              rowHoverable={false}
              className="bottom-table"
              rowSelection={rowSelection}
              pagination={false}
              bordered
              columns={columns}
              dataSource={data}
            />
          </Col>
        </Row>
    },
    {
      label: <Space>{'Danh sách tạm dừng'}<Badge count={pausedList.length} showZero color="#1677ff" overflowCount={999} /></Space>,
      key: 2,
      children:
        <Row gutter={[8, 8]}>
          <Col span={6}>
            <Button type="primary" disabled={selectedPausedKeys.length <= 0} loading={resuming} onClick={resume} className="w-100">{'Tiếp tục'}</Button>
          </Col>
          <Col span={24}>
            <Table
              loading={loading}
              scroll={{
                x: '100%',
                y: 'calc(100vh - 50vh)',
              }}
              rowSelection={pausedSelection}
              size="small"
              rowKey={'lo_sx'}
              rowHoverable={false}
              pagination={false}
              bordered
              columns={columns}
              // virtual
              dataSource={pausedList}
            />
          </Col>
        </Row>
    }
  ];
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
          <Col span={12}>
            <DatePicker
              allowClear={false}
              placeholder="Từ ngày"
              style={{ width: "100%" }}
              format={COMMON_DATE_FORMAT}
              defaultValue={dayjs()}
              onChange={onChangeStartDate}
            />
          </Col>
          <Col span={12}>
            <DatePicker
              allowClear={false}
              placeholder="Đến ngày"
              style={{ width: "100%" }}
              format={COMMON_DATE_FORMAT}
              defaultValue={dayjs()}
              onChange={onChangeEndDate}
            />
          </Col>
        </Row>
        <Col span={24} className="mt-2">
          <Tabs
            type="card"
            className="manufacture-tabs"
            items={items}
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
      <Modal title="Nhập sản lượng tay" open={isOpenModal} onCancel={closeModal} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={onUpdateQuantity}>
          <Form.Item name={"id"} hidden>
            <Input />
          </Form.Item>
          <Form.Item name={"sl_dau_ra_hang_loat"} label="Sản lượng">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default InDan;
