import React, { useState } from "react";
import { Row, Col, Table, DatePicker } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import Popup from "../../../components/Popup/popup";
import "../style.scss";
import { useEffect } from "react";
import { getErrorLogs } from "../../../api/oi/equipment";

const data = [
  {
    tg_dung: "13:10:01",
    tg_chay: "13:20:15",
    ten_su_co: "",
    nguyen_nhan: "",
    cach_xu_ly: "",
  },
];

const tableColumns = [
  {
    title: "TT",
    dataIndex: "thu_tu",
    key: "thu_tu",
    align: "center",
    width: "5%",
  },
  {
    title: "Tg dừng",
    dataIndex: "tg_dung",
    key: "tg_dung",
    align: "center",
    width: "8%",
  },
  {
    title: "Tg chạy",
    dataIndex: "tg_chay",
    key: "tg_chay",
    align: "center",
    width: "8%",
  },
  {
    title: "Mã sự cố",
    dataIndex: "ma_su_co",
    key: "ma_su_co",
    align: "center",
    width: "15%",
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
  const { line } = useParams();

  const [selectedError, setSelectedError] = useState(data);
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getLogs();
  }, []);

  const getLogs = () => {
    getErrorLogs({ machine_id: line })
      .then((res) => setLogs(res.data))
      .catch((err) => console.log("Lấy danh sách lịch sử lỗi thất bại: ", err));
  };

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
      render: (text) => <div>{text || "-"}</div>,
      onHeaderCell: () => {
        return {
          onClick: onShowPopup,
        };
      },
    },
    {
      title: "Nguyên nhân",
      dataIndex: "nguyen_nhan",
      key: "nguyen_nhan",
      align: "center",
      width: "20%",
      render: (text) => <div>{text || "-"}</div>,
      onHeaderCell: () => {
        return {
          onClick: onShowPopup,
        };
      },
    },
    {
      title: "Cách xử lý",
      dataIndex: "cach_xu_ly",
      key: "cach_xu_ly",
      align: "center",
      width: "20%",
      render: (text) => <div>{text || "-"}</div>,
      onHeaderCell: () => {
        return {
          onClick: onShowPopup,
        };
      },
    },
  ];

  const onSelectedError = (item) => {
    setSelectedError([item]);
  };

  const onShowPopup = () => {
    setVisible(true);
  };

  return (
    <React.Fragment>
      <Row className="mt-1" style={{ justifyContent: "space-between" }}>
        <Col span={24}>
          <Table
            rowClassName={(record, index) => "table-row-light"}
            locale={{ emptyText: "Trống" }}
            pagination={false}
            bordered={true}
            columns={columns}
            dataSource={selectedError}
            size="small"
          />
        </Col>
      </Row>
      <Row className="mt-2" gutter={[3, 8]}>
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
          onRow={(record, index) => {
            return {
              onClick: () => {
                onSelectedError(record);
              },
            };
          }}
        />
      </Row>
      {visible && (
        <Popup visible={visible} setVisible={setVisible} machineId={line} />
      )}
    </React.Fragment>
  );
};

export default Mapping;
