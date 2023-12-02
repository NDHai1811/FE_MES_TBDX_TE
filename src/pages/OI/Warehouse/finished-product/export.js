import React, { useState } from "react";
import { Row, Col, Table, Button } from "antd";
import "../../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import SelectButton from "../../../../components/Button/SelectButton";
import { warehousExportTPData } from "../mock-data";
import ScanButton from "../../../../components/Button/ScanButton";
import { PrinterOutlined } from "@ant-design/icons";

const columnDetail = [
  {
    title: "Vị trí",
    dataIndex: "vi_tri",
    key: "vi_tri",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Pallet",
    dataIndex: "pallet",
    key: "pallet",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Số lượng xuất",
    dataIndex: "sl_xuat",
    key: "sl_xuat",
    align: "center",
    render: (value) => value || "-",
  },
];

const exportColumns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
    align: "center",
    render: (value, record, index) => index + 1,
  },
  {
    title: "Thời gian xuất KH",
    dataIndex: "time",
    key: "time",
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
    title: "Mã tem (pallet)",
    dataIndex: "tem_id",
    key: "tem_id",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Mã lot",
    dataIndex: "lot_id",
    key: "lot_id",
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
    title: "Khách hàng",
    dataIndex: "khach_hang",
    key: "khach_hang",
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
  const [selectedItem, setSelectedItem] = useState([
    {
      so_pallet: "T300/3",
      so_mql: "10",
      so_luong: "150",
      vi_tri: "A01",
    },
  ]);

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

  const onSelectItem = (val) => {
    setSelectedItem([val]);
  };

  return (
    <React.Fragment>
      <Row className="mt-3" gutter={[4, 12]}>
        <Col span={6}>
          <SelectButton
            value={line}
            options={options}
            label="Kho"
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
        <Col span={24}>
          <Row gutter={8}>
            <Col span={12}>
              <ScanButton placeholder={"Nhập mã hoặc quét mã QR"} />
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
              >
                In tem pallet
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
            columns={exportColumns}
            dataSource={warehousExportTPData}
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
