import React, { useState } from "react";
import { Row, Col, Table, DatePicker } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import Popup from "../../../components/Popup/popup";
import "../style.scss";
import { useEffect } from "react";
import { getErrorLogs } from "../../../api/oi/equipment";

const tableColumns = [
  {
    title: "TT",
    dataIndex: "thu_tu",
    key: "thu_tu",
    align: "center",
    render: (value, record, index) => index + 1,
  },
  {
    title: "Thời gian dừng",
    dataIndex: "start_time",
    key: "start_time",
    align: "center",
  },
  {
    title: "Thời gian chạy",
    dataIndex: "end_time",
    key: "end_time",
    align: "center",
  },
  {
    title: "Mã sự cố",
    dataIndex: "code",
    key: "code",
    align: "center",
  },
  {
    title: "Tên sự cố",
    dataIndex: "ten_su_co",
    key: "ten_su_co",
    align: "center",
  },
  {
    title: "Nguyên nhân",
    dataIndex: "nguyen_nhan",
    key: "nguyen_nhan",
    align: "center",
  },
  {
    title: "Cách xử lý",
    dataIndex: "cach_xu_ly",
    key: "cach_xu_ly",
    align: "center",
  },
];

const Error = () => {
  const { machine_id } = useParams();

  const [selectedError, setSelectedError] = useState();
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  const [date, setDate] = useState({
    startDate: dayjs(),
    endDate: dayjs(),
  });

  useEffect(() => {
    getLogs();
  }, []);

  const getLogs = () => {
    getErrorLogs({ machine_id: machine_id })
      .then((res) => setLogs(res.data))
      .catch((err) => console.log("Lấy danh sách lịch sử lỗi thất bại: ", err));
  };

  const columns = [
    {
      title: "Thời gian dừng",
      dataIndex: "start_time",
      key: "start_time",
      align: "center",
      render: (text) => (text ? text : "-"),
      width: "20%",
    },
    {
      title: "Thời gian chạy",
      dataIndex: "end_time",
      key: "end_time",
      align: "center",
      render: (text) => (text ? text : "-"),
      width: "20%",
    },
    {
      title: "Tên sự cố",
      dataIndex: "ten_su_co",
      key: "ten_su_co",
      align: "center",
      width: "20%",
      render: (text) => (text ? text : "-"),
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
      render: (text) => (text ? text : "-"),
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
      render: (text) => (text ? text : "-"),
      onHeaderCell: () => {
        return {
          onClick: onShowPopup,
        };
      },
    },
  ];

  const onSelectedError = (item) => {
    setSelectedError(item);
  };

  const onShowPopup = () => {
    setVisible(true);
  };

  const disabledStartDate = (current) => {
    return current && current < dayjs().subtract(7, "day");
  };

  const disabledEndDate = (current) => {
    return current && current.startOf("day") < date.startDate.startOf("day");
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
            dataSource={selectedError ? [selectedError] : []}
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
            disabledDate={disabledStartDate}
            onChange={(value) => setDate({ ...date, startDate: value })}
          />
        </Col>
        <Col span={12}>
          <DatePicker
            placeholder="Đến ngày"
            style={{ width: "100%" }}
            format={COMMON_DATE_FORMAT}
            defaultValue={dayjs()}
            disabledDate={disabledEndDate}
            onChange={(value) => setDate({ ...date, endDate: value })}
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
            x: "calc(700px + 50%)",
            y: 300,
          }}
          columns={tableColumns}
          dataSource={logs}
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
        <Popup
          visible={visible}
          setVisible={setVisible}
          selectedError={selectedError}
        />
      )}
    </React.Fragment>
  );
};

export default Error;
