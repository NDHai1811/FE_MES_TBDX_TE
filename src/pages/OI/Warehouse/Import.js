import React, { useEffect, useState } from "react";
import { QrcodeOutlined } from "@ant-design/icons";
import { Row, Col, Table } from "antd";
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import SelectButton from "../../../components/Button/SelectButton";
import { warehousNvlData } from "./mock-data";
import ScanButton from "../../../components/Button/ScanButton";

const columnDetail = [
  {
    title: "Mã cuộn TBDX",
    dataIndex: "ma_cuon_tbdx",
    key: "ma_cuon_tbdx",
    align: "center",
  },
  {
    title: "Số kg",
    dataIndex: "so_kg",
    key: "so_kg",
    align: "center",
  },
  {
    title: "Vị trí đề xuất",
    dataIndex: "vi_tri",
    key: "vi_tri",
    align: "center",
  },
];

const importColumns = [
  {
    title: "Thời gian nhập",
    dataIndex: "time",
    key: "time",
    align: "center",
  },
  {
    title: "Nhà cung cấp",
    dataIndex: "nha_cung_cap",
    key: "nha_cung_cap",
    align: "center",
  },
  {
    title: "Mã cuộn TBDX",
    dataIndex: "ma_cuon_tbdx",
    key: "ma_cuon_tbdx",
    align: "center",
  },
  {
    title: "Loại giấy",
    dataIndex: "loai_giay",
    key: "loai_giay",
    align: "center",
  },
  {
    title: "Khổ",
    dataIndex: "kho",
    key: "kho",
    align: "center",
  },
  {
    title: "Định lượng",
    dataIndex: "dinh_luong",
    key: "dinh_luong",
    align: "center",
  },
  {
    title: "Số kg",
    dataIndex: "so_kg",
    key: "so_kg",
    align: "center",
  },
  {
    title: "Vị trí",
    dataIndex: "vi_tri",
    key: "vi_tri",
    align: "center",
  },
  {
    title: "Người nhập",
    dataIndex: "nguoi_nhap",
    key: "nguoi_nhap",
    align: "center",
  },
];

const column2 = [
  {
    title: "Số KG nhập trong ngày",
    dataIndex: "soKgNhapTrongNgay",
    key: "soKgNhapTrongNgay",
    align: "center",
  },
  {
    title: "Số cuộn nhập trong ngày",
    dataIndex: "soCuonNhapTrongNgay",
    key: "soCuonNhapTrongNgay",
    align: "center",
  },
  {
    title: "Số KG tồn trong kho",
    dataIndex: "soKgTonTrongKho",
    key: "soKgTonTrongKho",
    align: "center",
  },
  {
    title: "Số cuộn tồn trong kho",
    dataIndex: "soCuonTonTrongKho",
    key: "soCuonTonTrongKho",
    align: "center",
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
  // const [valueQR, setValueQR] = useState("");

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

  const onScan = () => {
    
  }
  return (
    <React.Fragment>
      <Row className="mt-3" gutter={[12, 12]}>
        <Col span={24}>
          <SelectButton
            value={line}
            options={options}
            label="Chọn"
            onChange={onChangeLine}
          />
        </Col>
        <Col span={24}>
          <Table
            rowClassName={(record, index) =>
              record.status === 1
                ? "table-row-yellow"
                : record.status === 2
                ? "table-row-grey"
                : "table-row-green"
            }
            pagination={false}
            bordered
            className="mb-1"
            columns={column2}
            dataSource={currentLot}
          />
        </Col>
        <Col span={24}>
          <Table
            rowClassName={(record, index) =>
              record.status === 1
                ? "table-row-yellow"
                : record.status === 2
                ? "table-row-grey"
                : "table-row-green"
            }
            pagination={false}
            bordered
            className="mb-1"
            columns={columnDetail}
            dataSource={selectedItem}
          />
        </Col>
        <Col span={24}>
          <ScanButton placeholder={'Nhập mã hoặc quét mã QR'} onScan={onScan} />
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
            dataSource={warehousNvlData}
            onRow={(record) => {
              return {
                onClick: () => onSelectItem(record),
              };
            }}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Import;
