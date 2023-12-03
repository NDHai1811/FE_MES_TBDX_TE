import React, { useState } from "react";
import { Row, Col, Table, Button } from "antd";
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import SelectButton from "../../../components/Button/SelectButton";
import { PrinterOutlined, QrcodeOutlined } from "@ant-design/icons";
import PopupInTem from "../../../components/Popup/PopupInTem";
import { useEffect } from "react";
import { getTablesNvl } from "../../../api/oi/warehouse";
import PopupNhapKhoNvl from "../../../components/Popup/PopupNhapKho";

const columnDetail = [
  {
    title: "Mã cuộn TBDX",
    dataIndex: "ma_cuon_tbdx",
    key: "ma_cuon_tbdx",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Số kg",
    dataIndex: "so_kg",
    key: "so_kg",
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
    title: "Mã cuộn TBDX",
    dataIndex: "material_id",
    key: "material_id",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Mã cuộn NCC",
    dataIndex: "ma_cuon_ncc",
    key: "ma_cuon_ncc",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Số kg",
    dataIndex: "so_kg",
    key: "so_kg",
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
    title: "Loại giấy",
    dataIndex: "loai_giay",
    key: "loai_giay",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Khổ",
    dataIndex: "kho_giay",
    key: "kho_giay",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Định lượng",
    dataIndex: "dinh_luong",
    key: "dinh_luong",
    align: "center",
    render: (value) => value || "-",
  },
];

const column2 = [
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
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isScan, setIsScan] = useState(0);
  // const [dataTable, setDataTable] = useState([]);
  // const [lotID, setLotID] = useState([]);
  const [selectedItem, setSelectedItem] = useState([
    {
      ma_cuon_tbdx: "456",
      so_kg: "1800",
      vi_tri: "A01",
    },
  ]);
  const [isScan, setIsScan] = useState(false);
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  // const [valueQR, setValueQR] = useState("");

  const onShowPopup = () => {
    setVisible(true);
  };

  const onChangeLine = (value) => {
    history.push("/warehouse/kho-nvl/" + value);
  };
  const [currentLot, setCurrentLot] = useState([
    {
      soKgNhapTrongNgay: 0,
      soCuonNhapTrongNgay: 0,
      soKgTonTrongKho: 0,
      soCuonTonTrongKho: 0,
    },
  ]);

  useEffect(() => {
    getLogs();
  }, []);

  const getLogs = () => {
    getTablesNvl()
      .then((res) => setLogs(res.data))
      .catch((err) =>
        console.log("Lấy danh sách bảng nhập kho nvl thất bại: ", err)
      );
  };

  // const getLotCurrent = async (e) => {
  //   const res = await getProposeWareHouse({ lot_id: e.target.value });
  //   setCurrentLot(res);
  //   setValueQR("");
  // };

  // const loadListTable = async () => {
  //   setDataTable(await getListImportWareHouse());
  // };

  // const loadInfo = async () => {
  //   setRow1(await getInfoImportWareHouse());
  // };

  // const saveLotInWareHouse = async (e) => {
  //   if (e.target.value === currentLot[0].vi_tri_de_xuat) {
  //     const res = await importWareHouse({
  //       lot_id: currentLot[0].ma_thung,
  //       cell_id: e.target.value,
  //     });
  //     loadListTable();
  //     loadInfo();
  //     setCurrentLot([]);
  //     setValueQR("");
  //   } else {
  //     message.error("Không đúng vị trí đề xuất");
  //   }
  // };

  const onSelectItem = (val) => {
    setSelectedItem([val]);
  };

  // useEffect(() => {
  //   loadListTable();
  //   loadInfo();
  // }, []);

  const onScan = () => {};
  return (
    <React.Fragment>
      <Row className="mt-3" gutter={[6, 12]}>
        <Col span={6}>
          <SelectButton
            value={line}
            options={options}
            label="Chọn"
            onChange={onChangeLine}
          />
        </Col>
        <Col span={18}>
          <Table
            // rowClassName={(record, index) =>
            //   record.status === 1
            //     ? "table-row-yellow"
            //     : record.status === 2
            //     ? "table-row-grey"
            //     : "table-row-green"
            // }
            pagination={false}
            bordered
            className="mb-1"
            columns={column2}
            dataSource={currentLot}
          />
        </Col>
        <Col span={24}>
          <Table
            // rowClassName={(record, index) =>
            //   record.status === 1
            //     ? "table-row-yellow"
            //     : record.status === 2
            //     ? "table-row-grey"
            //     : "table-row-green"
            // }
            pagination={false}
            bordered
            className="mb-1"
            columns={columnDetail}
            dataSource={selectedItem}
          />
        </Col>
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
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={onShowPopup}
          >
            In tem pallet
          </Button>
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
            dataSource={logs}
            onRow={(record) => {
              return {
                onClick: () => onSelectItem(record),
              };
            }}
          />
        </Col>
      </Row>
      {visible && <PopupInTem visible={visible} setVisible={setVisible} />}
      {isScan && <PopupNhapKhoNvl visible={isScan} setVisible={setIsScan} />}
    </React.Fragment>
  );
};

export default Import;
