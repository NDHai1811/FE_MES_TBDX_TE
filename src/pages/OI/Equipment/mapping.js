import React, { useEffect, useState } from "react";
import { Row, Col, Table, DatePicker } from "antd";
import PopupQuetQr from "../../../components/Popup/PopupQuetQr";
import PopupThongSo from "../../../components/Popup/PopupThongSo";
import dayjs from "dayjs";

import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import {
  getEquipmentLogs,
  getEquipmentMappingList,
  getParamaters,
} from "../../../api/oi/equipment";
import { COMMON_DATE_FORMAT_REQUEST } from "../../../commons/constants";
import { formatDateTime } from "../../../commons/utils";

const columns1 = [
  {
    title: "Lô",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
    render: (value) => value || "-",
    width: '200px'
  },
  {
    title: "Mã KH",
    dataIndex: "ma_khach_hang",
    key: "ma_khach_hang",
    align: "center",
    width: '160px',
    render: (value) => value || "-",
  },
  // {
  //   title: "Mã layout",
  //   dataIndex: "layout_id",
  //   key: "layout_id",
  //   align: "center",
  //   render: (value) => value || "-",
  // },
  {
    title: "MDH",
    dataIndex: "mdh",
    key: "mdh",
    align: "center",
    render: (value) => value || "-",
    width: '7%'
  },
  {
    title: "MQL",
    dataIndex: "mql",
    key: "mql",
    align: "center",
    render: (value) => value || "-",
    width: '4%'
  },
  {
    title: "Khổ tổng",
    dataIndex: "kho_tong",
    key: "kho_tong",
    align: "center",
    render: (value) => value || "-",
    width: '6%'
  },
  {
    title: "Dài tấm",
    dataIndex: "dai_tam",
    key: "dai_tam",
    align: "center",
    render: (value) => value || "-",
    width: '6%'
  },
  {
    title: "Số lượng",
    dataIndex: "so_luong",
    key: "so_luong",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Mapping",
    dataIndex: "mapping",
    key: "mapping",
    align: "center",
    render: (value) => (value ? "Đã mapping" : "-"),
  },
];

const Mapping = () => {
  const { machine_id } = useParams();
  const [visible, setVisible] = useState(false);
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [logs, setLogs] = useState([]);
  const [params, setParams] = useState({
    machine_id: machine_id,
    start_date: dayjs(),
    end_date: dayjs(),
  });
  const [selectedItem, setSelectedItem] = useState([]);
  const [tableColumns, setTableColumns] = useState(columns1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setParams({ ...params, machine_id: machine_id })
  }, [machine_id])
  useEffect(() => {
    if (machine_id) {
      getLogs();
    }
  }, [params.machine_id, params.start_date, params.end_date]);

  const getLogs = async () => {
    setLoading(true)
    var res = await getEquipmentLogs(params)
    setLogs(res.data.data);
    const newColumns = res.data.columns.map((val) => ({
      ...val,
      render: (value) => value || "-",
      align: "center",
    }));
    setTableColumns(columns1.concat(newColumns));
    setLoading(false);
  };

  const disabledStartDate = (current) => {
    return current && current < dayjs().subtract(7, "day");
  };

  const disabledEndDate = (current) => {
    return current && current.startOf("day") < params.start_date.startOf("day");
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
      dataIndex: "ma_khach_hang",
      key: "ma_khach_hang",
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
      render: (text) => <div>{text === "1" ? "Đã mapping" : text || "-"}</div>,
      onHeaderCell: () => {
        return {
          onClick: selectedItem[0]?.lo_sx && onShowPopup,
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
          onClick: selectedItem[0]?.lo_sx && onShowPopupParameter,
        };
      },
    },
  ];

  const onShowPopup = async () => {
    const res = await getEquipmentMappingList({ lo_sx: selectedItem[0].lo_sx });
    if (res.success) {
      selectedItem && setVisible(true);
    }
  };

  const onShowPopupParameter = async () => {
    const res = await getParamaters({
      machine_id,
      lo_sx: selectedItem?.[0]?.lo_sx,
    });
    if (res.data && res.success) {
      setIsShowPopup(true);
    }
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
            // disabledDate={disabledStartDate}
            onChange={(value) => setParams({ ...params, start_date: value })}
          />
        </Col>
        <Col span={12}>
          <DatePicker
            placeholder="Đến ngày"
            style={{ width: "100%" }}
            format={COMMON_DATE_FORMAT}
            defaultValue={dayjs()}
            // disabledDate={disabledEndDate}
            onChange={(value) => setParams({ ...params, end_date: value })}
          />
        </Col>
      </Row>
      <Row className="mt-2" style={{ justifyContent: "space-between" }}>
        <Table
          rowClassName={(record, index) => {
            return record.lo_sx === selectedItem[0]?.lo_sx
              ? "no-hover " + "table-row-green"
              : "table-row-light";
          }}
          loading={loading}
          locale={{ emptyText: "Trống" }}
          pagination={false}
          bordered={true}
          scroll={{
            x: columns1.length < 10 ? "100%" : "calc(700px + 100%)",
            y: 300,
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
      {visible && (
        <PopupQuetQr
          visible={visible}
          setVisible={setVisible}
          loSx={selectedItem[0].lo_sx}
          setSelectedItem={setSelectedItem}
          getLogs={getLogs}
        />
      )}
      {isShowPopup && (
        <PopupThongSo
          visible={isShowPopup}
          setVisible={setIsShowPopup}
          lo_sx={selectedItem?.[0]?.lo_sx}
          getLogs={getLogs}
        />
      )}
    </React.Fragment>
  );
};

export default Mapping;
