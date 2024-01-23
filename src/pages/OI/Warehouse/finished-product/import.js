import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Table, Button, Select } from "antd";
import "../../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import PopupQuetQrNhapKho from "../../../../components/Popup/PopupQuetQrNhapKho";
import { PrinterOutlined, QrcodeOutlined } from "@ant-design/icons";
import {
  getWarehouseFGOverall,
  getWarehouseTpLogs,
} from "../../../../api/oi/warehouse";
import TemPallet from "../TemPallet";
import { useReactToPrint } from "react-to-print";
import PopupQuetQrThanhPham from "../../../../components/Popup/PopupQuetQrThanhPham";

const columnDetail = [
  {
    title: "Mã tem",
    dataIndex: "pallet_id",
    key: "pallet_id",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Số lượng",
    dataIndex: "so_luong",
    key: "so_luong",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Vị trí",
    dataIndex: "locator_id",
    key: "locator_id",
    align: "center",
    render: (value) => value || "-",
  },
];

const importColumns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
    align: "center",
    render: (value, record, index) => index + 1,
  },
  {
    title: "Mã tem",
    dataIndex: "pallet_id",
    key: "pallet_id",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Số lượng",
    dataIndex: "so_luong",
    key: "so_luong",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Vị trí",
    dataIndex: "locator_id",
    key: "locator_id",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Mã đơn hàng",
    dataIndex: "mdh",
    key: "mdh",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Khách hàng",
    dataIndex: "khach_hang",
    key: "khach_hang",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Thời gian nhập kho",
    dataIndex: "thoi_gian_nhap",
    key: "thoi_gian_nhap",
    align: "center",
    render: (value) => value || "-",
  },
];

const options = [
  {
    label: "Nhập",
    value: "nhap",
  },
  {
    label: "Xuất",
    value: "xuat",
  },
];

const Import = (props) => {
  document.title = "Kho thành phẩm";
  const { line } = useParams();
  const history = useHistory();
  const componentRef1 = useRef();
  const [logs, setLogs] = useState([]);
  const [warehouseOverall, setWarehouseOverall] = useState([]);
  const [selectedItem, setSelectedItem] = useState([
    {
      pallet_id: "",
      so_luong: "",
      locator_id: "",
    },
  ]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    getLogs();
    getWarehouseOverallData();
  };

  const getWarehouseOverallData = () => {
    getWarehouseFGOverall()
      .then((res) => setWarehouseOverall([res.data]))
      .catch((err) => console.log("Lấy dữ liệu thất bại: ", err));
  };

  const getLogs = () => {
    getWarehouseTpLogs()
      .then((res) => setLogs(res.data))
      .catch((err) => console.log("Lấy dữ liệu thất bại: ", err));
  };

  const column2 = [
    {
      title: "Kho",
      dataIndex: "kho",
      key: "kho",
      align: "center",
      render: () => (
        <Select
          options={options}
          value={line}
          onChange={onChangeLine}
          style={{ width: "100%" }}
          bordered={false}
        />
      ),
    },
    {
      title: "Sl nhập",
      dataIndex: "sl_nhap",
      key: "sl_nhap",
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "Sl xuất",
      dataIndex: "sl_xuat",
      key: "sl_xuat",
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "Sl tồn",
      dataIndex: "sl_ton",
      key: "sl_ton",
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "Số ngày tồn kho",
      dataIndex: "so_ngay_ton",
      key: "so_ngay_ton",
      align: "center",
      render: (value) => value || "-",
    },
  ];

  const onChangeLine = (value) => {
    history.push("/warehouse/kho-tp/" + value);
  };

  const [isScan, setIsScan] = useState(false);
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState([]);
  const [resData, setResData] = useState({
    locator_id: "",
  });
  const [result, setResult] = useState("");

  useEffect(() => {
    if (result.length > 0) {
      print();
    }
  }, [result]);
  const print = useReactToPrint({
    content: () => componentRef1.current,
  });

  const onShowPopup = () => {
    setVisible(true);
  };

  return (
    <React.Fragment>
      <Row className="mt-3" gutter={[4, 12]}>
        <Col span={24}>
          <Table
            pagination={false}
            bordered
            className="mb-1"
            columns={column2}
            dataSource={warehouseOverall}
          />
        </Col>
        <Col span={24}>
          <Table
            pagination={false}
            bordered
            className="mb-1"
            columns={columnDetail}
            dataSource={selectedItem}
          />
        </Col>
        <Col span={24}>
          <Row gutter={8}>
            <Col span={12}>
              <Button
                block
                className="h-100 w-100"
                icon={<QrcodeOutlined style={{ fontSize: "20px" }} />}
                type="primary"
                onClick={() => setIsScan(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Quét QR Code
              </Button>
            </Col>
            <Col span={12}>
              <Button
                block
                className="h-100 w-100"
                icon={<PrinterOutlined style={{ fontSize: "20px" }} />}
                type="primary"
                onClick={onShowPopup}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                In tem
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Table
            scroll={{
              x: "calc(700px + 50%)",
              y: 300,
            }}
            rowClassName={(record, index) =>
              record.status === 1
                ? "table-row-yellow"
                : record.status === 2
                ? "table-row-grey"
                : ""
            }
            pagination={false}
            bordered
            className="mb-4"
            columns={importColumns}
            dataSource={logs}
            // onRow={(record) => {
            //   return {
            //     onClick: () => onSelectItem(record),
            //   };
            // }}
          />
        </Col>
      </Row>
      <div className="report-history-invoice">
        <TemPallet info={info} ref={componentRef1} />
      </div>
      {visible && (
        <PopupQuetQrNhapKho
          visible={visible}
          setVisible={setVisible}
          setResData={setResData}
          setInfo={setInfo}
          setSelectedItem={setSelectedItem}
          setResult={setResult}
        />
      )}
      {isScan && (
        <PopupQuetQrThanhPham
          visible={isScan}
          setVisible={setIsScan}
          getLogs={getData}
        />
      )}
    </React.Fragment>
  );
};

export default Import;
