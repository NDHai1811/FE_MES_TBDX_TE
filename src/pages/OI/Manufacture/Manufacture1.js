import React, { useEffect, useState, useRef, useReducer, useContext, useMemo, useCallback } from "react";
import { ArrowDownOutlined, ArrowUpOutlined, DownOutlined, DragOutlined, HolderOutlined, PrinterOutlined, SearchOutlined, StopOutlined, UpOutlined } from "@ant-design/icons";
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
  Tabs,
  Badge,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
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
  reorderPriority,
  getPausedPlanList,
  pausePlan,
  resumePlan,
  updateQuantityInfoCongDoan,
  deletePausedPlanList,
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
import { DndContext, MouseSensor, useSensor, useSensors, TouchSensor, rectIntersection } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import "./Manufacture1.css"
import debounce from "lodash/debounce";
import OISearchBox from "../../../components/Popup/OISearchBox";

const RowContext = React.createContext({});

const DraggableRow = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });

  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging
      ? {
        position: 'relative',
        zIndex: 9999,
      }
      : {}),
  };
  const contextValue = useMemo(
    () => ({
      setActivatorNodeRef,
      listeners,
    }),
    [setActivatorNodeRef, listeners],
  );
  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{
        cursor: 'move',
      }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

const columns = [
  {
    title: "STT tem",
    dataIndex: "thu_tu_uu_tien",
    key: "thu_tu_uu_tien",
    align: "center",
    width: 50,
  },
  {
    title: "Tên khách hàng",
    dataIndex: "khach_hang",
    key: "khach_hang",
    align: "center",
    width: 90,
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
    width: 80,
  },
  {
    title: "Sóng E",
    dataIndex: "ma_cuon_se",
    key: "ma_cuon_se",
    align: "center",
    width: 80,
  },
  {
    title: "Láng E",
    dataIndex: "ma_cuon_le",
    key: "ma_cuon_le",
    align: "center",
    width: 80,
  },
  {
    title: "Sóng B",
    dataIndex: "ma_cuon_sb",
    key: "ma_cuon_sb",
    align: "center",
    width: 80,
  },
  {
    title: "Láng B",
    dataIndex: "ma_cuon_lb",
    key: "sl",
    align: "center",
    width: 80,
  },
  {
    title: "Sóng C",
    dataIndex: "ma_cuon_sc",
    key: "ma_cuon_sc",
    align: "center",
    width: 80,
  },
  {
    title: "Láng C",
    dataIndex: "ma_cuon_lc",
    key: "ma_cuon_lc",
    align: "center",
    width: 80,
  },
  {
    title: "Số mét tới",
    dataIndex: "so_m_toi",
    key: "so_m_toi",
    align: "center",
    width: 80
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
    title: "Ngày SX KH",
    dataIndex: "ngay_sx",
    key: "ngay_sx",
    align: "center",
    width: 120,
    // fixed: 'right'
  },
  {
    title: "Lô SX",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
    width: 120,
    // fixed: 'right'
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
  const [pausedList, setPasuedList] = useState([]);
  const [selectedLot, setSelectedLot] = useState();
  const [listCheck, setListCheck] = useState([]);
  const [listTem, setListTem] = useState([]);
  const [isPaused, setIsPasued] = useState(true);
  const [current, setCurrent] = useState(null);
  const [overall, setOverall] = useState([
    { kh_ca: 0, san_luong: 0, ti_le_ca: 0, tong_phe: 0 },
  ]);

  const reloadData = async () => {
    await getListLotDetail();
    await getOverAllDetail();
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

  document.addEventListener('dragover', (event) => {
    console.log('dragging');

    event.preventDefault();
  });

  useEffect(() => {
    reloadData();
    fetchPausedPlan();
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
    setLoading(false);
  };

  const fetchPausedPlan = async () => {
    var res = await getPausedPlanList(params);
    setPasuedList(res.data);
  }

  const onChangeLine = (value) => {
    window.location.href = ("/oi/manufacture/" + value);
  };

  const rowClassName = (record, index) => {
    if (record?.lo_sx === searchedTarget?.lo_sx) {
      return "table-row-blue";
    }
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
      if (machine_id === "So01") {
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
      console.log(selectedRowKeys);
      setListCheck(data.filter(e => selectedRowKeys.includes(e.key)).map(e => e.key))
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
      // console.error('WebSocket connection error:', error);
    });

    window.Echo.connector.socket.on('disconnect', () => {
      console.log('WebSocket disconnected!');
    });
    window.Echo.channel('laravel_database_mychannel')
      .listen('.my-event', (e) => {
        // console.log(e.data);
        if (e.data?.info_cong_doan?.machine_id !== machine_id) {
          return;
        }
        // console.log(e.data);
        if (e.data?.reload) {
          reloadData();
        } else {
          if (e.data?.info_cong_doan) {
            setData(prevData => [...prevData].map(lo => {
              if (e.data?.info_cong_doan?.lo_sx == lo.lo_sx) {
                const current = { ...lo, ...e.data?.info_cong_doan };
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
    current && setSpecifiedRowKey(current?.lo_sx);
  }, [current]);

  function detectSensor() {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
  }
  const sensors = useSensors(
    useSensor(detectSensor() ? TouchSensor : MouseSensor),
  );
  const [cloneItems, setCloneItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const onDragStart = ({ active }) => {
    document.body.style.overflowX = 'hidden'; // Disable horizontal scroll
    setActiveId(active.id);
    if (active.id && listCheck.includes(active.id)) {
      setCloneItems(listCheck);
    }
  }
  const onDragEnd = async ({ active, over }) => {
    document.body.style.overflowX = 'auto'; // Disable horizontal scroll
    setCloneItems([]);
    setListCheck([]);
    if (listCheck.includes(over?.id)) {
      return;
    }
    if (over && active.id !== over?.id) {
      var newArray = [];
      var oldData = data;
      if (cloneItems.length > 0 || (cloneItems.length === 1 && !cloneItems.includes(active.id))) {
        await setData(prev => {
          const activeIndex = prev.findIndex((i) => i.key === active?.id);
          let newData = [...prev].filter(e => !cloneItems.includes(e.key));
          const overIndex = newData.findIndex((i) => i.key === over?.id);
          newData.splice(overIndex + (activeIndex > overIndex ? 0 : 1), 0, ...prev.filter(e => cloneItems.includes(e.key)));
          newArray = [...newData];
          return newArray;
        });
      } else {
        await setData((prev) => {
          const activeIndex = prev.findIndex((i) => i.key === active.id);
          const overIndex = prev.findIndex((i) => i.key === over?.id);
          newArray = arrayMove(prev, activeIndex, overIndex);
          return newArray;
        });
      }
      var changes = newArray.map((newLot, newIndex) => {
        const oldLot = oldData.find((lot, oldIndex) => oldIndex === newIndex);
        return {
          id: newLot.id,                       // id của lô
          oldPriority: newLot.thu_tu_uu_tien,  // Giá trị thứ tự ưu tiên cũ
          newPriority: oldLot.thu_tu_uu_tien   // Giá trị thứ tự ưu tiên mới
        };
      }).filter((lot) => {
        return lot.oldPriority !== lot.newPriority; // Lô nào có sự thay đổi TTƯT thì trả về
      });
      if (changes.length > 0) {
        await reorderPriority({ changes });
        getListLotDetail();
      }
    }
  };

  const [isDraggable, setIsDraggable] = useState(false);

  const [pausing, setPausing] = useState(false);
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
    var res = await pausePlan({ info_ids: data.filter(e => listCheck.includes(e.lo_sx)).map(e => e.id), machine_id: machine_id });
    reloadData();
    fetchPausedPlan();
    setListCheck([]);
    setSelectedPausedKeys([]);
    setPausing(false);
    setActiveKey('paused_manufacture_tab');
  }
  const resume = async () => {
    if (selectedPausedKeys.length <= 0) {
      message.info('Chưa chọn kế hoạch muốn tiếp tục');
      return;
    }
    setResuming(true);
    var res = await resumePlan({ info_ids: pausedList.filter(e => selectedPausedKeys.includes(e.lo_sx)).map(e => e.id), machine_id: machine_id });
    reloadData();
    fetchPausedPlan();
    setListCheck([]);
    setSelectedPausedKeys([]);
    setResuming(false);
    setActiveKey('currrent_manufacture_tab');
  }
  const [activeKey, setActiveKey] = useState('currrent_manufacture_tab');
  const openModal = () => {
    if ((activeKey === 'currrent_manufacture_tab' && listCheck.length !== 1) || (activeKey === 'paused_manufacture_tab' && selectedPausedKeys.length !== 1)) {
      message.info('Chọn 1 lô để nhập sản lượng');
      return;
    }
    let target = null
    if (activeKey === 'currrent_manufacture_tab') {
      target = data.find(e => e.key === listCheck[0]);
    } else {
      target = pausedList.find(e => e.lo_sx === selectedPausedKeys[0]);
    }
    console.log(target);

    // if (target?.status <= 1) {
    //   message.info('Lô này chưa hoàn thành');
    //   return;
    // }
    setIsOpenModal(true);
    form.setFieldsValue(target)
  }

  const closeModal = () => {
    form.resetFields();
    setIsOpenModal(false);
  }

  const deletePlan = async () => {
    if (selectedPausedKeys.length <= 0) {
      message.info('Chọn lô để xoá');
      return;
    }
    var res = await deletePausedPlanList({ info_ids: selectedPausedKeys });
  }
  const [searchedTarget, setSearchedTarget] = useState(null);
  const [searchedList, setSearchedList] = useState([]);
  const buttonResponsive = {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 4,
  }
  const items = [
    {
      label: 'Danh sách sản xuất',
      key: 'currrent_manufacture_tab',
      children:
        <Row gutter={[8, 8]}>
          {/* <Col span={6}> */}
          {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}> */}
          <Col {...buttonResponsive} span={4}><Button type="primary" loading={loadingAction} onClick={() => isPaused ? onStart() : onStop()} style={{ width: "100%", height: '100%', textWrap: 'wrap' }}>{isPaused ? 'Bắt đầu' : 'Dừng'}</Button></Col>
          <Col {...buttonResponsive} span={4}><Button
            size="medium"
            type="primary"
            style={{ width: "100%", height: '100%', textWrap: 'wrap' }}
            onClick={handlePrint}
            icon={<PrinterOutlined style={{ fontSize: "24px" }} />}
          /></Col>
          <Col {...buttonResponsive} span={4}><Button type="primary" disabled={listCheck.length !== 1} onClick={openModal} style={{ width: "100%", height: '100%', textWrap: 'wrap' }}>{'Nhập sản lượng tay'}</Button></Col>
          <Col {...buttonResponsive} span={4}><Button type="primary" disabled={listCheck.length <= 0} loading={pausing} onClick={pause} style={{ width: "100%", height: '100%', textWrap: 'wrap' }}>{'Chuyển sang Tab "Tạm dừng"'}</Button></Col>
          <Col {...buttonResponsive} span={4}><Button
            size="medium"
            type="primary"
            style={{ width: "100%", height: '100%', textWrap: 'wrap' }}
            onClick={() => setIsDraggable(!isDraggable)}
            title={!isDraggable ? "Di chuyển" : "Dừng di chuyển"}
            icon={!isDraggable ? <DragOutlined /> : <StopOutlined />}
          >{!isDraggable ? "Di chuyển" : "Dừng di chuyển"}</Button></Col>
          <Col {...buttonResponsive} span={4}><OISearchBox data={data} searchedTarget={searchedTarget} setSearchedTarget={setSearchedTarget} searchedList={searchedList} setSearchedList={setSearchedList}/></Col>
          {/* </div> */}
          <div className="report-history-invoice">
            {/* <TemTest listCheck={listTem} ref={componentRef1} /> */}
            <TemGiayTam listCheck={listTem} ref={componentRef1} />
            <TemThanhPham listCheck={listTem} ref={componentRef2} />
          </div>
          <Col span={24}>
            <DndContext sensors={sensors} collisionDetection={rectIntersection} modifiers={[restrictToVerticalAxis]} onDragStart={onDragStart} onDragEnd={onDragEnd}>
              <SortableContext
                // rowKey array
                items={data.map((i) => i.key)}
                strategy={verticalListSortingStrategy}
              >
                <Table
                  loading={loading}
                  scroll={{
                    x: '100%',
                    y: 'calc(100vh - 56vh)',
                  }}
                  size="small"
                  rowClassName={(record, index) =>
                    rowClassName(record, index)
                  }
                  components={{
                    body: {
                      row: isDraggable ? DraggableRow : null,
                    },
                  }}
                  rowKey={'lo_sx'}
                  rowHoverable={false}
                  className="draggable-table"
                  ref={tableRef}
                  pagination={false}
                  bordered
                  columns={isDraggable ? [{
                    key: 'sort',
                    title: ' ',
                    align: 'center',
                    width: 40,
                    fixed: 'left',
                    render: () => <DragHandle />,
                  }, ...columns] : columns}
                  rowSelection={rowSelection}
                  // onRow={(record, rowIndex) => {
                  //   return {
                  //     onClick: (event) => { onClickRow(record) },
                  //   };
                  // }}
                  // virtual
                  dataSource={data.filter(e => !cloneItems.filter(key => key !== activeId).includes(e.key))}
                />
              </SortableContext>
            </DndContext>
          </Col>
        </Row>
    },
    {
      label: <Space>{'Danh sách tạm dừng'}<Badge count={pausedList.length} showZero color="#1677ff" overflowCount={999} /></Space>,
      key: 'paused_manufacture_tab',
      children:
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
              <Button type="primary" disabled={selectedPausedKeys.length !== 1} onClick={openModal} className="w-100">{'Nhập sản lượng tay'}</Button>
              <Button type="primary" disabled={selectedPausedKeys.length <= 0} loading={resuming} onClick={resume} className="w-100">{'Chuyển sang Tab "Sản xuất"'}</Button>
              <Popconfirm title="Việc này sẽ xoá tất cả KH được chọn. Bạn có chắc muốn xoá?" onConfirm={deletePlan}>
                <Button type="primary" danger disabled={selectedPausedKeys.length <= 0} className="w-100">{'Xoá'}</Button>
              </Popconfirm>
            </div>
          </Col>
          <Col span={24}>
            <Table
              loading={loading}
              scroll={{
                x: '100%',
                y: 'calc(100vh - 56vh)',
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
  const [form] = Form.useForm();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const onUpdateQuantity = async (values) => {
    var res = await updateQuantityInfoCongDoan(values);
    if (res.success) {
      closeModal();
      reloadData();
      setListCheck([]);
    }
  }
  const onChangeTab = (key) => {
    setActiveKey(key);
    setSelectedPausedKeys([]);
    setListCheck([]);
  }

  useEffect(() => {
    handleScrollToRow(searchedTarget?.lo_sx);
  }, [searchedTarget])
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
        <Col span={24}>
          <Tabs
            activeKey={activeKey}
            type="card"
            className="manufacture-tabs"
            items={items}
            onChange={onChangeTab}
          />
        </Col>
      </Row>
      <Modal title="Nhập sản lượng tay" destroyOnClose open={isOpenModal} onCancel={closeModal} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={onUpdateQuantity}>
          <Form.Item name={"id"} hidden>
            <Input />
          </Form.Item>
          <Form.Item name={"sl_dau_ra_hang_loat"} label="Sản lượng">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment >
  );
};

export default Manufacture1;
