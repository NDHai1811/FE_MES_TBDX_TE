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
  Checkbox,
  Form
} from "antd";
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import {
  getOverAll,
  manualInput,
  manualList,
  manualScan,
} from "../../../api/oi/manufacture";
import { useReactToPrint } from "react-to-print";
import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import dayjs from "dayjs";
import ScanQR from "../../../components/Scanner";
import TemGiayTam from "./TemGiayTam";
import TemThanhPham from "./TemThanhPham";
const SCAN_TIME_OUT = 3000;
const columns = [
  {
    title: "Khách hàng",
    dataIndex: "khach_hang",
    key: "khach_hang",
    align: "center",
    width: "65px",
    render: (value, record, index) => value || "-",
  },
  {
    title: "MDH",
    dataIndex: "mdh",
    key: "mdh",
    align: "center",
    render: (value, record, index) => value || "-",
    width: "55px",
  },
  {
    title: "MQL",
    dataIndex: "mql",
    key: "mql",
    align: "center",
    render: (value, record, index) => value || "-",
    width: "30px",
  },
  {
    title: "Quy cách",
    dataIndex: "quy_cach",
    key: "quy_cach",
    align: "center",
    render: (value, record, index) => value || "-",
    width: "70px",
  },
  {
    title: "SL kế hoạch",
    dataIndex: "dinh_muc",
    key: "dinh_muc",
    align: "center",
    width: "60px",
  },
  {
    title: "SL ra",
    dataIndex: "sl_dau_ra_hang_loat",
    key: "sl_dau_ra_hang_loat",
    align: "center",
    render: (value) => value || "-",
    width: "30px",
  },
  {
    title: "SL đạt",
    dataIndex: "sl_ok",
    key: "sl_ok",
    align: "center",
    render: (value) => value || "-",
    width: "40px",
  },
  {
    title: "Phán định",
    dataIndex: "phan_dinh",
    key: "phan_dinh",
    align: "center",
    render: (value) => (value === 1 ? "OK" : "-"),
    width: "65px",
  },
  {
    title: "Mã layout",
    dataIndex: "layout_id",
    key: "layout_id",
    align: "center",
    render: (value) => value || "-",
    width: "75px",
  },
  {
    title: "Lô SX",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
    render: (value, record, index) => value || "-",
    width: "70px",
  },
  {
    title: "Bước",
    dataIndex: "step",
    key: "step",
    align: "center",
    render: (value, record, index) => value ? 'Bước' : '',
    width: "35px",
  },
];

const NhapTay = (props) => {
  document.title = "Sản xuất máy thủ công";
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
      title: "SL KH",
      dataIndex: "dinh_muc",
      key: "dinh_muc",
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "SL ra",
      dataIndex: "san_luong",
      key: "san_luong",
      align: "center",
      render: (value) => value || "-",
      onHeaderCell: () => {
        return {
          onClick: () => lotCurrent && onShowPopup(),
          style: {
            cursor: 'pointer'
          }
        };
      },
    },
    {
      title: "SL đạt",
      dataIndex: "sl_ok",
      key: "sl_ok",
      align: "center",
      render: (value) => value || "-",
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

  const [params, setParams] = useState({
    machine_id: machine_id,
    start_date: dayjs(),
    end_date: dayjs(),
  });
  // const [machineOptions, setMachineOptions] = useState([]);
  const [quantity, setQuantity] = useState();
  const [visiblePrint, setVisiblePrint] = useState(false);
  const [isPrint, setIsPrint] = useState(false);
  const { machineOptions = [] } = props
  const scanRef = useRef();
  const [loading, setLoading] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [data, setData] = useState([]);
  const [selectedLot, setSelectedLot] = useState();
  const [lotCurrent, setLotCurrent] = useState();
  const [listCheck, setListCheck] = useState([]);
  const [listTem, setListTem] = useState([])
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  const [form] = Form.useForm();
  const [overall, setOverall] = useState([
    { kh_ca: 0, san_luong: 0, ti_le_ca: 0, tong_phe: 0 },
  ]);
  const [isOpenQRScanner, setIsOpenQRScanner] = useState(false);
  const [isScan, setIsScan] = useState(0);

  const onShowPopup = () => {
    setVisible(true);
    console.log(lotCurrent?.san_luong ? lotCurrent?.san_luong : lotCurrent?.san_luong_kh);
    form.setFieldsValue({ san_luong: lotCurrent?.san_luong ? lotCurrent?.san_luong : lotCurrent?.san_luong_kh, step: lotCurrent?.step });
  };

  const closePopup = () => {
    setVisible(false);
  };

  const closePopupPrint = () => {
    setVisiblePrint(false);
  };

  const reloadData = async (lo_sx = null) => {
    const resData = await manualList(params);
    const tableData = resData.data.map((e, index) => ({ ...e, key: index }));
    tableData.sort(function (x, y) { return x?.lo_sx === lo_sx ? -1 : y?.lo_sx === lo_sx ? 1 : 0; })
    setData(tableData);
    const target = tableData.find(e => e?.lo_sx === lo_sx);
    setLotCurrent(target);
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

  useEffect(() => {
    if (machineOptions.length > 0) {
      (async () => {
        if (machine_id) {
          reloadData();
        }
      })();
    }
  }, [machine_id, machineOptions, params.start_date, params.end_date]);

  useEffect(() => {
    if (isScan === 1) {
      setIsOpenQRScanner(true);
    } else if (isScan === 2) {
      setIsOpenQRScanner(false);
    }
  }, [isScan]);


  useEffect(() => {
    if (listTem.length > 0) {
      handlePrint();
    }
  }, [isPrint]);

  const onChangeValue = (val) => {
    setValue(val);
  };
  const onChangeQuantity = (val) => {
    setQuantity(val);
  };

  const onConfirm = async () => {
    var res = await manualInput({ ...lotCurrent, san_luong: value, machine_id: machine_id });
    if (res.success) {
      setLotCurrent();
      setValue("");
      closePopup();
      reloadData();
    }
  };

  const onConfirmPrint = async () => {
    if (lotCurrent.so_luong < quantity) {
      message.error('Số lượng nhập vượt quá số lượng thực tế');
    } else {
      const res = { ...lotCurrent, so_luong: quantity };
      setListTem([res]);
      setIsPrint(!isPrint);
      setLotCurrent();
      setQuantity("");
      closePopupPrint();
    }
  };

  const getOverAllDetail = () => {
    setLoading(true);
    const resData = {
      machine_id,
      start_date: params.start_date,
      end_date: params.end_date,
    };

    getOverAll(resData)
      .then((res) => setOverall(res.data))
      .catch((err) => {
        console.error("Get over all error: ", err);
      })
      .finally(() => setLoading(false));
  };

  const onChangeLine = (value) => {
    localStorage.setItem('machine_id', value);
    window.location.href = ("/oi/manufacture/" + value);
  };

  const onScan = async (result) => {
    if (scanRef.current) {
      clearTimeout(scanRef.current);
    }
    scanRef.current = setTimeout(() => {
      const lo_sx = JSON.parse(result)?.lo_sx;
      manualScan({ lo_sx: JSON.parse(result)?.lo_sx, machine_id: machine_id, so_luong: JSON.parse(result)?.so_luong })
        .then(() => { reloadData(lo_sx); handleCloseMdl() })
        .catch((err) => { console.log("Quét mã qr thất bại: ", err); handleCloseMdl(); });
    }, SCAN_TIME_OUT);
  };

  const rowClassName = (record, index) => {
    if (record?.lo_sx === lotCurrent?.lo_sx) {
      return "table-row-green";
    }
    // if (record.status === 2) {
    //   return "table-row-yellow";
    // }
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
      if (machine_id === "So01") {
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

  const rowSelection = {
    columnWidth: '20px',
    selectedRowKeys: listCheck,
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys)
      setListTem(selectedRows);
    },
    // getCheckboxProps: (record) => ({
    //   disabled: !record?.id
    // }),
  };

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

  const onClickRow = (record) => {
    if (record.status < 3) {
      setLotCurrent(record);
    }
  }

  const onChangeCheckbox = (value) => {
    if (value.target.checked) {
      form.setFieldValue('step', 1);
    } else {
      form.setFieldValue('step', 0);
    }
  }

  const onFinish = async (values) => {
    var res = await manualInput({ ...lotCurrent, san_luong: values.san_luong, machine_id: machine_id, step: values.step });
    if (res.success) {
      setLotCurrent();
      form.resetFields();
      closePopup();
      reloadData();
    }
  }

  const openMdlPrint = () => {
    if (typeof (lotCurrent) != 'undefined') {
      setVisiblePrint(true);
      setQuantity(lotCurrent?.san_luong);
    } else {
      message.info('Chưa chọn lô in tem');
    }
  }
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
  return (
    <React.Fragment>
      <Spin spinning={loading}>
        <Row className="mt-1" gutter={[4, 4]}>
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
              dataSource={lotCurrent ? [lotCurrent] : []}
            />
          </Col>
          <Col span={7}>
            <DatePicker
              allowClear={false}
              placeholder="Từ ngày"
              style={{ width: "100%" }}
              format={COMMON_DATE_FORMAT}
              defaultValue={dayjs()}
              onChange={onChangeStartDate}
            />
          </Col>
          <Col span={7}>
            <DatePicker
              allowClear={false}
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
              icon={<QrcodeOutlined style={{ fontSize: "22px" }} />}
            />
          </Col>
          <Col span={3}>
            <Button
              size="medium"
              type="primary"
              style={{ width: "100%" }}
              onClick={handlePrint}
              icon={<PrinterOutlined style={{ fontSize: "22px" }} />}
            />
            <div className="report-history-invoice">
              <TemGiayTam listCheck={listTem} ref={componentRef1} />
              <TemThanhPham listCheck={listTem} ref={componentRef2} />
            </div>
          </Col>
          <Col span={4}>
            <Button
              size="medium"
              type="primary"
              style={{ width: "100%" }}
              onClick={openMdlPrint}
            >
              IN
            </Button>
          </Col>
          <Col span={24}>
            <Table
              scroll={{
                x: '1000px',
                y: tableSize.height,
              }}
              size="small"
              rowClassName={(record, index) =>
                "no-hover " + rowClassName(record, index)
              }
              className="bottom-table"
              pagination={false}
              bordered
              columns={columns}
              onRow={(record, index) => {
                return {
                  onClick: () => onClickRow(record),
                };
              }}
              rowSelection={rowSelection}
              dataSource={data}
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
      {visible && (
        <Modal
          title="Nhập thông tin"
          open={visible}
          onCancel={closePopup}
          footer={null}
        >
          <Form layout={"vertical"} form={form} onFinish={onFinish}>
            <Row gutter={[16, 0]}>
              <Col span={18}>
                <Form.Item label="Sản lượng đầu ra" name="san_luong">
                  <InputNumber
                    placeholder="Nhập sản lượng đầu ra"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Bước" name="step" valuePropName={form.getFieldValue('step') ? 'checked' : ''}>
                  <Checkbox
                    value={1}
                    onChange={onChangeCheckbox}
                    placeholder="Bước"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item className="mb-0 text-right">
                  <Button type="primary" htmlType="submit">
                    Lưu lại
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>

        </Modal>
      )}
      {visiblePrint && (
        <Modal
          title="Số lượng trên tem"
          open={visiblePrint}
          onCancel={closePopupPrint}
          onOk={onConfirmPrint}
        >
          <InputNumber
            value={quantity}
            max={lotCurrent?.san_luong}
            placeholder="Nhập sản lượng trên tem"
            onChange={onChangeQuantity}
            style={{ width: "100%" }}
          />
        </Modal>
      )}
    </React.Fragment>
  );
};

export default NhapTay;
