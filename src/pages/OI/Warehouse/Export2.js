import React, { useState, useEffect } from "react";
import { Row, Col, Table, Button, Select } from "antd";
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { QrcodeOutlined } from "@ant-design/icons";
import { getExportsNVL } from "../../../api/oi/warehouse";
import PopupInTemKhoNvl from "../../../components/Popup/PopupInTemKhoNvl";
import { getWarehouseOverall } from "../../../api/oi/warehouse";
import PopupXuatKhoNvl from "../../../components/Popup/PopupXuatKho";

const columnDetail = [
  {
    title: "Mã cuộn TBDX",
    dataIndex: "material_id",
    key: "material_id",
    align: "center",
    width: `${100 / 3}%`,
    render: (value) => value || "-",
  },
  {
    title: "Số kg",
    dataIndex: "so_kg",
    key: "so_kg",
    align: "center",
    width: `${100 / 3}%`,
    render: (value) => value || "-",
  },
  {
    title: "Vị trí",
    dataIndex: "locator_id",
    key: "locator_id",
    align: "center",
    width: `${100 / 3}%`,
    render: (value) => value || "-",
  },
];

const exportColumns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
    align: "center",
    width: 50,
    render: (value, record, index) => index + 1,
  },
  {
    title: "Mã cuộn TBDX",
    dataIndex: "material_id",
    key: "material_id",
    align: "center",
    width: 120,
    render: (value) => value || "-",
  },
  {
    title: "Loại giấy",
    dataIndex: "loai_giay",
    key: "loai_giay",
    align: "center",
    width: 80,
    render: (value) => value || "-",
  },
  {
    title: "Khổ",
    dataIndex: "kho_giay",
    key: "kho_giay",
    align: "center",
    width: 60,
    render: (value) => value || "-",
  },
  {
    title: "Định lượng",
    dataIndex: "dinh_luong",
    key: "dinh_luong",
    align: "center",
    width: 90,
    render: (value) => value || "-",
  },

  {
    title: "Số kg",
    dataIndex: "so_kg",
    key: "so_kg",
    align: "center",
    width: 60,
    render: (value) => value || "-",
  },
  {
    title: "Vị trí",
    dataIndex: "vi_tri",
    key: "vi_tri",
    align: "center",
    width: 70,
    render: (value) => value || "-",
  },
  {
    title: "Mã cuộn NCC",
    dataIndex: "ma_cuon_ncc",
    key: "ma_cuon_ncc",
    align: "center",
    width: 140,
    render: (value) => value || "-",
  },
  {
    title: "TG xuất",
    dataIndex: "tg_xuat",
    key: "tg_xuat",
    align: "center",
    width: 80,
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

const Export2 = (props) => {
  document.title = "Kho NVL";
  const { line } = useParams();
  const history = useHistory();

  const [isScan, setIsScan] = useState(false);
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  const [overall, setOverall] = useState([{}]);
  const [currentScan, setCurrentScan] = useState(
    {
      material_id: "",
      so_kg: "",
      locator_id: "",
    },
  );

  const onChangeLine = (value) => {
    history.push("/oi/warehouse/kho-nvl/" + value);
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
  ];

  useEffect(() => {
    getLogs();
    getOverAll();
  }, []);

  const getOverAll = () => {
    getWarehouseOverall()
      .then((res) => setOverall(res.data))
      .catch((err) => console.log("Lấy dữ liệu thất bại: ", err));
  };
  const [loading, setLoading] = useState(false)
  const getLogs = () => {
    getExportsNVL()
      .then((res) => { setLogs(res.data); setLoading(false); })
      .catch((err) =>
        console.log("Lấy danh sách bảng xuất kho nvl thất bại: ", err)
      );
  };

  useEffect(() => {
    (!visible || !isScan) && getLogs();
  }, [visible, isScan]);
  return (
    <React.Fragment>
      <Row className="mt-1" gutter={[6, 12]}>
        <Col span={24}>
          <Table
            pagination={false}
            bordered
            size="small"
            className="mb-1 custom-table"
            locale={{ emptyText: 'Trống' }}
            columns={column2}
            dataSource={[overall]}
          />
        </Col>
        <Col span={24}>
          <Table
            pagination={false}
            locale={{ emptyText: 'Trống' }}
            bordered
            size="small"
            className="mb-1 custom-table"
            columns={columnDetail}
            dataSource={currentScan ? [currentScan] : []}
          />
        </Col>
        <Col span={24}>
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
        <Col span={24}>
          <Table
            scroll={{
              y: 'calc(100vh - 440px)',
            }}
            rowClassName={(record, index) =>
              record.status === 1
                ? "table-row-yellow"
                : record.status === 2
                  ? "table-row-grey"
                  : ""
            }
            size="small"
            pagination={false}
            bordered
            className="mb-2"
            columns={exportColumns}
            dataSource={logs}
          />
        </Col>
      </Row>
      {isScan && <PopupXuatKhoNvl
        visible={isScan}
        setVisible={setIsScan}
        setCurrentScan={setCurrentScan}
      />}
    </React.Fragment>
  );
};

export default Export2;
