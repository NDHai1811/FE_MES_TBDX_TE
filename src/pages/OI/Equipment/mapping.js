import React from "react";
import { Row, Col, Table, DatePicker, Button } from "antd";
import { QrcodeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { COMMON_DATE_FORMAT } from "../../../commons/constants";

const data = [
  {
    lo_sx: "P231017",
    ma_kh: "VICTORY",
    don_hang: "1062/11",
    mql: "4",
    mapping: "Đã Mapping",
  },
];

const columns = [
  {
    title: "Lô SX",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
    width: "20%",
  },
  {
    title: "Mã KH",
    dataIndex: "ma_kh",
    key: "ma_kh",
    align: "center",
    width: "20%",
  },
  {
    title: "Đơn hàng",
    dataIndex: "don_hang",
    key: "don_hang",
    align: "center",
    width: "20%",
  },
  {
    title: "MQL",
    dataIndex: "mql",
    key: "mql",
    align: "center",
    width: "20%",
  },
  {
    title: "Mapping",
    dataIndex: "mapping",
    key: "mapping",
    align: "center",
    width: "20%",
  },
];

const tableColumns = [
  {
    title: "Lô",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
    width: "20%",
  },
  {
    title: "Mã KH",
    dataIndex: "ma_kh",
    key: "ma_kh",
    align: "center",
    width: "20%",
  },
  {
    title: "Đơn hàng",
    dataIndex: "don_hang",
    key: "don_hang",
    align: "center",
    width: "20%",
  },
  {
    title: "MQL",
    dataIndex: "mql",
    key: "mql",
    align: "center",
    width: "20%",
  },
  {
    title: "Mapping",
    dataIndex: "mapping",
    key: "mapping",
    align: "center",
    width: "20%",
  },
  {
    title: "TS XYZ",
    dataIndex: "ts_xyz",
    key: "ts_xyz",
    align: "center",
    width: "20%",
  },
  {
    title: "TS XYZ",
    dataIndex: "ts_xyz",
    key: "ts_xyz",
    align: "center",
    width: "20%",
  },
  {
    title: "TS XYZ",
    dataIndex: "ts_xyz",
    key: "ts_xyz",
    align: "center",
    width: "20%",
  },
];

const tableData = [
  {
    lo_sx: "P231017",
    ma_kh: "VICTORY",
    don_hang: "1062/11",
    mql: "4",
    mapping: "Đã Mapping",
    ts_xyz: "",
  },
  {
    lo_sx: "P231017",
    ma_kh: "KEN",
    don_hang: "1064/11",
    mql: "1",
    mapping: "",
    ts_xyz: "",
  },
  {
    lo_sx: "P231017",
    ma_kh: "KEN",
    don_hang: "1064/11",
    mql: "2",
    mapping: "",
    ts_xyz: "",
  },
  {
    lo_sx: "P231017",
    ma_kh: "KEN",
    don_hang: "1064/11",
    mql: "3",
    mapping: "",
    ts_xyz: "",
  },
];

const Mapping = () => {
  return (
    <React.Fragment>
      <Row className="mt-1" style={{ justifyContent: "space-between" }}>
        <Col span={24}>
          <Table
            rowClassName={(record, index) => "table-row-light"}
            locale={{ emptyText: "Trống" }}
            pagination={false}
            bordered={true}
            scroll={{
              x: window.screen.width,
            }}
            columns={columns}
            dataSource={data}
            size="small"
          />
        </Col>
      </Row>
      <Row
        className="mt-2"
        gutter={[3,8]}
        style={{ justifyContent: "space-between" }}
      >
        <Col span={10}>
          <DatePicker
            placeholder="Từ ngày"
            style={{ width: "100%" }}
            format={COMMON_DATE_FORMAT}
            defaultValue={dayjs()}
          />
        </Col>
        <Col span={10}>
          <DatePicker
            placeholder="Đến ngày"
            style={{ width: "100%" }}
            format={COMMON_DATE_FORMAT}
            defaultValue={dayjs()}
          />
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            style={{ width: "100%" }}
            icon={<QrcodeOutlined style={{ fontSize: "24px" }}/>}
          ></Button>
        </Col>
      </Row>
      <Row className="mt-2" style={{ justifyContent: "space-between" }}>
        <Table
          rowClassName={(record, index) => "table-row-light"}
          locale={{ emptyText: "Trống" }}
          pagination={false}
          bordered={true}
          scroll={{
            x: window.screen.width,
          }}
          columns={tableColumns}
          dataSource={tableData}
          size="small"
        />
      </Row>
    </React.Fragment>
  );
};

export default Mapping;
