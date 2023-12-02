import React, { useEffect, useState } from "react";
import { Row, Col, Table, DatePicker, Button } from "antd";
import PopupQuetQr from "../../../components/Popup/PopupQuetQr";
import PopupThongSo from "../../../components/Popup/PopupThongSo";
import dayjs from "dayjs";

import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { getEquipmentLogs } from "../../../api/oi/equipment";
import { COMMON_DATE_FORMAT_REQUEST } from "../../../commons/constants";
import { formatDateTime } from "../../../commons/utils";

const tableColumns = [
  {
    title: "Lô",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
    width: "20%",
    render: (value) => value || "-",
  },
  {
    title: "Mã KH",
    dataIndex: "ma_kh",
    key: "ma_kh",
    align: "center",
    width: "20%",
    render: (value) => value || "-",
  },
  {
    title: "Mã layout",
    dataIndex: "layout_id",
    key: "layout_id",
    align: "center",
    width: "20%",
    render: (value) => value || "-",
  },
  {
    title: "Đơn hàng",
    dataIndex: "ma_don_hang",
    key: "ma_don_hang",
    align: "center",
    width: "20%",
    render: (value) => value || "-",
  },
  {
    title: "Mã QL",
    dataIndex: "ma_quan_ly",
    key: "ma_quan_ly",
    align: "center",
    width: "20%",
    render: (value) => value || "-",
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
    render: (value) => value || "-",
  },
  {
    title: "TS XYZ",
    dataIndex: "ts_xyz",
    key: "ts_xyz",
    align: "center",
    width: "20%",
    render: (value) => value || "-",
  },
  {
    title: "TS XYZ",
    dataIndex: "ts_xyz",
    key: "ts_xyz",
    align: "center",
    width: "20%",
    render: (value) => value || "-",
  },
];

const Mapping = () => {
  const { machine_id } = useParams();
  const [visible, setVisible] = useState(false);
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [logs, setLogs] = useState([]);
  const [date, setDate] = useState({
    startDate: dayjs(),
    endDate: dayjs(),
  });
  const [selectedItem, setSelectedItem] = useState([]);

  useEffect(() => {
    getLogs();
  }, [machine_id, date.startDate, date.endDate]);

  const getLogs = () => {
    const resData = {
      machine_id,
      start_date: formatDateTime(date.startDate, COMMON_DATE_FORMAT_REQUEST),
      end_date: formatDateTime(date.endDate, COMMON_DATE_FORMAT_REQUEST),
    };
    getEquipmentLogs(resData)
      .then((res) => {
        setLogs(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedItem([res.data[0]]);
        }
      })
      .catch((err) => console.log("Lấy lịch sử thiết bị thất bại: ", err));
  };

  const columns = [
    {
      title: "Lô SX",
      dataIndex: "lo_sx",
      key: "lo_sx",
      align: "center",
      width: "20%",
      render: (value) => value || "-",
    },
    {
      title: "Mã KH",
      dataIndex: "khach_hang",
      key: "khach_hang",
      align: "center",
      width: "20%",
      render: (value) => value || "-",
    },
    {
      title: "Mã layout",
      dataIndex: "layout_id",
      key: "layout_id",
      align: "center",
      width: "20%",
      render: (value) => value || "-",
    },
    {
      title: "Mapping",
      dataIndex: "mapping",
      key: "mapping",
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
      title: "Thông số",
      dataIndex: "thong_so",
      key: "thong_so",
      align: "center",
      width: "20%",
      render: (value) => value || "-",
      onHeaderCell: () => {
        return {
          onClick: onShowPopupParameter,
        };
      },
    },
  ];

  const onShowPopup = () => {
    setVisible(true);
  };

  const onShowPopupParameter = () => {
    setIsShowPopup(true);
  };

  const onSelectRow = (item) => {
    setSelectedItem([item]);
  };

  return (
    <React.Fragment>
      <Row style={{ justifyContent: "space-between" }}>
        <Col span={24}>
          <Table
            rowClassName={(record, index) => "table-row-light"}
            locale={{ emptyText: "Trống" }}
            pagination={false}
            bordered={true}
            columns={columns}
            dataSource={selectedItem}
            size="small"
          />
        </Col>
      </Row>
      <Row
        className="mt-2"
        gutter={[3, 8]}
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
          dataSource={logs}
          size="small"
          onRow={(record, index) => {
            return {
              onClick: () => {
                onSelectRow(record);
              },
            };
          }}
        />
      </Row>
      {visible && <PopupQuetQr visible={visible} setVisible={setVisible} />}
      {isShowPopup && (
        <PopupThongSo visible={isShowPopup} setVisible={setIsShowPopup} />
      )}
    </React.Fragment>
  );
};

export default Mapping;
