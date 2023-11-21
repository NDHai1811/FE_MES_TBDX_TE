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
    title: "Số pallet",
    dataIndex: "so_pallet",
    key: "so_pallet",
    align: "center",
  },
  {
    title: "Số lot",
    dataIndex: "so_lot",
    key: "so_lot",
    align: "center",
  },
  {
    title: "Số MQL",
    dataIndex: "so_mql",
    key: "so_mql",
    align: "center",
  },
  {
    title: "Vị trí đề xuất",
    dataIndex: "vi_tri",
    key: "vi_tri",
    align: "center",
  },
  {
    title: "Số lượng",
    dataIndex: "vi_tri",
    key: "vi_tri",
    align: "center",
  },
  {
    title: "Tách",
    dataIndex: "tach",
    key: "tach",
    align: "center",
    render: (_, record) => <input type="checkbox" checked />,
  },
  {
    title: "Gộp",
    dataIndex: "gop",
    key: "gop",
    align: "center",
    render: (_, record) => <input type="checkbox" checked={false} />,
  },
];

const exportColumns = [
  {
    title: "Thời gian xuất theo KH",
    dataIndex: "time",
    key: "time",
    align: "center",
  },
  {
    title: "Số pallet",
    dataIndex: "so_pallet",
    key: "so_pallet",
    align: "center",
  },
  {
    title: "Số xe",
    dataIndex: "so_xe",
    key: "so_xe",
    align: "center",
  },
  {
    title: "Vị trí",
    dataIndex: "vi_tri",
    key: "vi_tri",
    align: "center",
  },
  {
    title: "Số MQL",
    dataIndex: "so_mql",
    key: "so_mql",
    align: "center",
  },
  {
    title: "Số lượng",
    dataIndex: "so_luong",
    key: "so_luong",
    align: "center",
  },
  {
    title: "Số đơn hàng",
    dataIndex: "so_don_hang",
    key: "so_don_hang",
    align: "center",
  },
  {
    title: "Khach hàng",
    dataIndex: "khach_hang",
    key: "khach_hang",
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
    title: "Số Pallet nhập trong ngày",
    dataIndex: "soPalletNhapTrongNgay",
    key: "soPalletNhapTrongNgay",
    align: "center",
  },
  {
    title: "Số Pallet xuất trong ngày",
    dataIndex: "soPalletXuatTrongNgay",
    key: "soPalletXuatTrongNgay",
    align: "center",
  },
  {
    title: "Tổng Pallet tồn trong kho",
    dataIndex: "soPalletTonTrongKho",
    key: "soPalletTonTrongKho",
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
            scroll={{
              x: window.screen.width,
            }}
            pagination={false}
            bordered
            className="mb-1"
            columns={columnDetail}
            dataSource={selectedItem}
          />
        </Col>
        <Col span={24}>
          <Row gutter={8}>
            <Col span={8}>
              <ScanButton placeholder={'Nhập mã hoặc quét mã QR'} />
            </Col>
            <Col span={8}>
              <Button block className="h-100 w-100" icon={<PrinterOutlined/>} type="primary">In tem pallet</Button>
            </Col>
            <Col span={8}>
              <Button block className="h-100 w-100" type="primary">Nhập lại</Button>
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
