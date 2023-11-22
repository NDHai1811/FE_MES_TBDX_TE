import React, { useState } from "react";
import { Row, Col, Table, DatePicker } from "antd";
import dayjs from "dayjs";

import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import Popup from "../../../components/Popup/popup";

const data = [
  {
    tg_dung: "13:10:01",
    tg_chay: "13:20:15",
    ten_su_co: "Popup",
    nguyen_nhan: "Popup",
    trang_thai: "Chờ đã xử lý",
  },
];

const columns = [
  {
    title: "Tg dừng",
    dataIndex: "tg_dung",
    key: "tg_dung",
    align: "center",
    width: "20%",
  },
  {
    title: "Tg chạy",
    dataIndex: "tg_chay",
    key: "tg_chay",
    align: "center",
    width: "20%",
  },
  {
    title: "Tên sự cố",
    dataIndex: "ten_su_co",
    key: "ten_su_co",
    align: "center",
    width: "20%",
    render: () => {
      return <Popup/>
    }
  },
  {
    title: "Nguyên nhân",
    dataIndex: "nguyen_nhan",
    key: "nguyen_nhan",
    align: "center",
    width: "20%",
    render: () => {
      return <Popup/>
    }
  },
  {
    title: "Trạng thái",
    dataIndex: "trang_thai",
    key: "trang_thai",
    align: "center",
    width: "20%",
  },
];

const tableColumns = [
  {
    title: "TT",
    dataIndex: "thu_tu",
    key: "thu_tu",
    align: "center",
    width: "20%",
  },
  {
    title: "Tg dừng",
    dataIndex: "tg_dung",
    key: "tg_dung",
    align: "center",
    width: "20%",
  },
  {
    title: "Tg chạy",
    dataIndex: "tg_chay",
    key: "tg_chay",
    align: "center",
    width: "20%",
  },
  {
    title: "Mã sự cố",
    dataIndex: "ma_su_co",
    key: "ma_su_co",
    align: "center",
    width: "20%",
  },
  {
    title: "Tên sự cố",
    dataIndex: "ten_su_co",
    key: "ten_su_co",
    align: "center",
    width: "20%",
  },
  {
    title: "Nguyên nhân",
    dataIndex: "nguyen_nhan",
    key: "nguyen_nhan",
    align: "center",
    width: "20%",
  },
  {
    title: "Cách xử lý",
    dataIndex: "cach_xu_ly",
    key: "cach_xu_ly",
    align: "center",
    width: "20%",
  },
  {
    title: "Trạng thái",
    dataIndex: "trang_thai",
    key: "trang_thai",
    align: "center",
    width: "20%",
  },
];

const tableData = [
  {
    thu_tu: "4",
    tg_dung: "13:10:01",
    tg_chay: "13:20:15",
    ma_su_co: "SC04",
    ten_su_co: "",
    nguyen_nhan: "Đã ",
    cach_xu_ly: "",
    trang_thai: "Chờ xử lý",
  },
  {
    thu_tu: "3",
    tg_dung: "12:10:01",
    tg_chay: "12:20:15",
    ma_su_co: "SC06",
    ten_su_co: "Đổi đơn hàng",
    nguyen_nhan: "Đổi đơn hàng",
    cach_xu_ly: "",
    trang_thai: "Chờ xử lý",
  },
  {
    thu_tu: "2",
    tg_dung: "10:10:01",
    tg_chay: "11:20:15",
    ma_su_co: "SC03",
    ten_su_co: "",
    nguyen_nhan: "Đổi MQL",
    cach_xu_ly: "",
    trang_thai: "Chờ xử lý",
  },
  {
    thu_tu: "1",
    tg_dung: "09:10:01",
    tg_chay: "09:20:15",
    ma_su_co: "SC13",
    ten_su_co: "Máy hư",
    nguyen_nhan: "Hư bơm",
    cach_xu_ly: "Thay bơm",
    trang_thai: "Chờ xử lý",
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
        gutter={[2,12]}
        style={{ justifyContent: "space-between" }}
      >
        <Col span={12}>
          <DatePicker
            placeholder="Từ ngày"
            style={{ width: "100%" }}
            format={COMMON_DATE_FORMAT}
            defaultValue={dayjs()}
          />
        </Col>
        <Col span={12}>
          <DatePicker
            placeholder="Đến ngày"
            style={{ width: "100%" }}
            format={COMMON_DATE_FORMAT}
            defaultValue={dayjs()}
          />
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
