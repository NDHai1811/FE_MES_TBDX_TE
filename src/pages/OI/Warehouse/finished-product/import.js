import React, { useEffect, useState } from "react";
import { Row, Col, Table, Button, Modal, Select } from "antd";
import "../../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { warehousTPData } from "../mock-data";
import ScanQR from "../../../../components/Scanner";
import PopupQuetQrNhapKho from "../../../../components/Popup/PopupQuetQrNhapKho";
import { PrinterOutlined, QrcodeOutlined } from "@ant-design/icons";
import { getWarehouseOverall } from "../../../../api/oi/warehouse";

const columnDetail = [
  {
    title: "Mã tem",
    dataIndex: "tem_id",
    key: "tem_id",
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
    dataIndex: "vi_tri",
    key: "vi_tri",
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
    dataIndex: "tem_id",
    key: "tem_id",
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
    dataIndex: "vi_tri",
    key: "vi_tri",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Số đơn hàng",
    dataIndex: "so_don_hang",
    key: "so_don_hang",
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
    dataIndex: "tg_nhap_kho",
    key: "tg_nhap_kho",
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
  document.title = "Kho NVL";
  const { line } = useParams();
  const history = useHistory();

  const [logs, setLogs] = useState([]);
  const [selectedItem, setSelectedItem] = useState([
    {
      so_pallet: "T300/3",
      so_mql: "10",
      vi_tri: "A01",
    },
  ]);

  useEffect(() => {
    getLogs();
  }, []);

  const getLogs = () => {
    getWarehouseOverall()
      .then((res) => setLogs(res.data))
      .catch((err) => console.log("Lấy dữ liệu thất bại: ", err));
  };

  console.log({logs})

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
      dataIndex: "so_ngay_ton_kho",
      key: "so_ngay_ton_kho",
      align: "center",
      render: (value) => value || "-",
    },
  ];

  const onChangeLine = (value) => {
    history.push("/warehouse/kho-tp/" + value);
  };
  const [currentLot, setCurrentLot] = useState([
    {
      soPalletNhapTrongNgay: 0,
      soPalletXuatTrongNgay: 0,
      soPalletTonTrongKho: 0,
    },
  ]);
  const [isScan, setIsScan] = useState(false);
  const [visible, setVisible] = useState(false);

  const onShowPopup = () => {
    setVisible(true);
  };

  const onSelectItem = (val) => {
    setSelectedItem([val]);
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
            dataSource={currentLot}
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
              x: window.screen.width,
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
            dataSource={warehousTPData}
            onRow={(record) => {
              return {
                onClick: () => onSelectItem(record),
              };
            }}
          />
        </Col>
      </Row>
      {visible && (
        <PopupQuetQrNhapKho visible={visible} setVisible={setVisible} />
      )}
      {isScan && (
        <Modal
          title="Quét QR"
          open={isScan}
          onCancel={() => setIsScan(false)}
          footer={null}
        >
          <ScanQR
            isScan={isScan}
            onResult={(res) => {
              setIsScan(false);
            }}
          />
        </Modal>
      )}
    </React.Fragment>
  );
};

export default Import;
