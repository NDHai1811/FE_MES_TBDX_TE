import React, { useEffect, useState } from "react";
import {
  CloseOutlined,
  PrinterOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Row,
  Col,
  Divider,
  Button,
  Table,
  Modal,
  Select,
  Steps,
  Input,
  Radio,
  message,
} from "antd";
import { withRouter, Link } from "react-router-dom";
import DataDetail from "../../../components/DataDetail";
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import ScanButton from "../../../components/Button/ScanButton";
import SelectButton from "../../../components/Button/SelectButton";
import dayjs from "dayjs";
import {
  getInfoImportWareHouse,
  getListImportWareHouse,
  getProposeWareHouse,
  importWareHouse,
} from "../../../api";
const importColumns = [
  {
    title: "Số lot",
    dataIndex: "index",
    key: "index",
    align: "center",
    render: (value, record, index) => index + 1,
  },
  {
    title: "Số MQL",
    dataIndex: "thoi_gian_nhap",
    key: "thoi_gian_nhap",
    align: "center",
  },
  {
    title: "Số lượng",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
  },
  {
    title: "Vị trí",
    dataIndex: "lot_id",
    key: "lot_id",
    align: "center",
  },
  {
    title: "Người nhập",
    dataIndex: "ten_san_pham",
    key: "ten_san_pham",
    align: "center",
  },
];
const Import = (props) => {
  document.title = "Kho";
  const { line } = useParams();
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScan, setIsScan] = useState(0);
  const [dataTable, setDataTable] = useState([]);
  const [lotID, setLotID] = useState([]);
  const [valueQR, setValueQR] = useState("");
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
  const onChangeLine = (value) => {
    history.push("/warehouse/" + value);
  };
  const [currentLot, setCurrentLot] = useState([]);

  const [row1, setRow1] = useState([]);
  const column2 = [
    {
      title: "Số lot",
      dataIndex: "ma_thung",
      key: "ma_thung",
      align: "center",
    },
    {
      title: "Khách hàng",
      dataIndex: "khach_hang",
      key: "khach_hang",
      align: "center",
    },
    {
      title: "Số MQL",
      dataIndex: "ten_san_pham",
      key: "ten_san_pham",
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "so_luong",
      key: "so_luong",
      align: "center",
    },
    {
      title: "Vị trí đề xuất",
      dataIndex: "vi_tri_de_xuat",
      key: "vi_tri_de_xuat",
      align: "center",
    },
  ];
  const getLotCurrent = async (e) => {
    const res = await getProposeWareHouse({ lot_id: e.target.value });
    setCurrentLot(res);
    setValueQR("");
  };
  const loadListTable = async () => {
    setDataTable(await getListImportWareHouse());
  };
  const loadInfo = async () => {
    setRow1(await getInfoImportWareHouse());
  };
  const saveLotInWareHouse = async (e) => {
    if (e.target.value === currentLot[0].vi_tri_de_xuat) {
      const res = await importWareHouse({
        lot_id: currentLot[0].ma_thung,
        cell_id: e.target.value,
      });
      loadListTable();
      loadInfo();
      setCurrentLot([]);
      setValueQR("");
    } else {
      message.error("Không đúng vị trí đề xuất");
    }
  };

  useEffect(() => {
    (async () => {
      loadListTable();
      loadInfo();
    })();
  }, []);
  return (
    <React.Fragment>
      <Row className="mt-3" gutter={[12, 12]}>
        <Col span={6}>
          <SelectButton
            value={line}
            options={options}
            label="Chọn"
            onChange={onChangeLine}
          />
        </Col>
        <Col span={18}>
          <DataDetail data={row1} />
        </Col>
        <Col span={24}>
          <Input
            size="large"
            prefix={
              <QrcodeOutlined
                style={{ fontSize: "24px", marginRight: "10px" }}
              />
            }
            placeholder={"Nhập mã QR hoặc nhập mã thùng"}
            onChange={(e) => {
              setValueQR(e.target.value);
            }}
            onPressEnter={
              currentLot.length ? saveLotInWareHouse : getLotCurrent
            }
            value={valueQR}
            allowClear
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
            className="mb-4"
            columns={column2}
            dataSource={currentLot}
          />
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
            dataSource={dataTable}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Import;
