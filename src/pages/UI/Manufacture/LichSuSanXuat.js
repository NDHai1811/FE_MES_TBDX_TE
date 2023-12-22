import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Col,
  Row,
  Card,
  Table,
  Layout,
  Divider,
  Button,
  Form,
  Select,
  Space,
  Spin,
  Tree,
} from "antd";
import "../style.scss";
import { getLines } from "../../../api/ui/main";
import {
  exportProduceHistory,
  exportReportProduceHistory,
} from "../../../api/ui/export";
import { baseURL } from "../../../config";
import dayjs from "dayjs";
import {
  getProduceOverall,
  getProducePercent,
  getProduceTable,
} from "../../../api/ui/manufacture";

const columns1 = [
  {
    title: "Số lượng đầu ra (kế hoạch)",
    dataIndex: "sl_kh",
    key: "sl_kh",
    align: "center",
  },
  {
    title: "Số lượng sau QC (thực tế)",
    dataIndex: "sl_ok",
    key: "sl_ok",
    align: "center",
  },
  {
    title: "Chênh lệch thực tế - kế hoạch",
    dataIndex: "chenh_lech",
    key: "chenh_lech",
    align: "center",
  },
  {
    title: "Tỷ lệ hoàn thành",
    dataIndex: "ty_le",
    key: "ty_le",
    align: "center",
  },
  {
    title: "Số phế",
    dataIndex: "sl_phe",
    key: "sl_phe",
    className: "red",
    align: "center",
  },
];
const columns2 = [
  {
    title: "Lô SX",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
  },
  {
    title: "Sóng",
    dataIndex: "30",
    key: "30",
    align: "center",
    render: (value) => value ?? 0,
  },
  {
    title: "In",
    dataIndex: "31",
    key: "31",
    align: "center",
    render: (value) => value ?? 0,
  },
  {
    title: "Bế",
    dataIndex: "505",
    key: "505",
    align: "center",
    render: (value) => value ?? 0,
  },
  {
    title: "Dán",
    dataIndex: "31",
    key: "31",
    align: "center",
    render: (value) => value ?? 0,
  },
];
const columns3 = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    align: "center",
    fixed: "left",
    width: "3%",
    render: (value, record, index) => index + 1,
  },
  {
    title: "Ngày sản xuất",
    dataIndex: "ngay_sx",
    key: "ngay_sx",
    align: "center",
    fixed: "left",
    width: "4%",
  },
  {
    title: "Công đoạn",
    dataIndex: "line",
    key: "line",
    align: "center",
    fixed: "left",
    width: "4%",
    render: (value) => value?.name,
  },
  {
    title: "Máy",
    dataIndex: "machine_id",
    key: "machine_id",
    align: "center",
    fixed: "left",
    width: "4%",
  },
  {
    title: "Khách hàng",
    dataIndex: "khach_hang",
    key: "khach_hang",
    align: "center",
    fixed: "left",
  },
  {
    title: "Đơn hàng",
    dataIndex: "ma_don_hang",
    key: "ma_don_hang",
    align: "center",
    fixed: "left",
  },
  {
    title: "Lô sản xuất",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
    fixed: "left",
  },
  {
    title: "Lot sản xuất",
    dataIndex: "lot_id",
    key: "lot_id",
    align: "center",
    fixed: "left",
  },
  {
    title: "Mã layout",
    dataIndex: "layout_id",
    key: "layout_id",
    align: "center",
    fixed: "left",
  },
  {
    title: "Quy cách",
    dataIndex: "quy_cach",
    key: "quy_cach",
    align: "center",
    fixed: "left",
  },
  {
    title: "Kế hoạch",
    children: [
      {
        title: "Thời gian bắt đầu",
        dataIndex: "thoi_gian_bat_dau_kh",
        key: "thoi_gian_bat_dau_kh",
        align: "center",
      },
      {
        title: "Thời gian kết thúc",
        dataIndex: "thoi_gian_ket_thuc_kh",
        key: "thoi_gian_ket_thuc_kh",
        align: "center",
      },
      {
        title: "Số lượng đầu vào",
        dataIndex: "sl_dau_vao_kh",
        key: "sl_dau_vao_kh",
        align: "center",
      },
      {
        title: "Số lượng đầu ra",
        dataIndex: "sl_dau_ra_kh",
        key: "sl_dau_ra_kh",
        align: "center",
      },
      {
        title: "Cycle time lý thuyết",
        dataIndex: "cycle_time_kh",
        key: "cycle_time_kh",
        align: "center",
      },
    ],
  },
  {
    title: "Thực tế",
    children: [
      {
        title: "Thời gian bắt đầu",
        dataIndex: "thoi_gian_bat_dau",
        key: "thoi_gian_bat_dau",
        align: "center",
      },
      {
        title: "Thời gian kết thúc",
        dataIndex: "thoi_gian_ket_thuc",
        key: "thoi_gian_ket_thuc",
        align: "center",
      },
      {
        title: "Sản lượng đầu vào",
        dataIndex: "sl_dau_vao_hang_loat",
        key: "sl_dau_vao_hang_loat",
        align: "center",
      },
      {
        title: "Sản lượng đầu ra",
        dataIndex: "sl_dau_ra_hang_loat",
        key: "sl_dau_ra_hang_loat",
        align: "center",
      },
      {
        title: "Sản lượng sau QC",
        dataIndex: "sl_ok",
        key: "sl_ok",
        align: "center",
      },
      {
        title: "Số lượng phế",
        dataIndex: "sl_phe",
        key: "sl_phe",
        align: "center",
      },
      {
        title: "Tỉ lệ đầu ra/Đầu vào",
        dataIndex: "ty_le_dau_ra_vao",
        key: "ty_le_dau_ra_vao",
        align: "center",
      },
      {
        title: "Cycle time",
        dataIndex: "cycle_time_tt",
        key: "cycle_time_tt",
        align: "center",
      },
    ],
  },
  {
    title: "Chênh lệch",
    dataIndex: "chenh_lech",
    key: "chenh_lech",
    align: "center",
  },
  {
    title: "Tỷ lệ đạt (%)",
    dataIndex: "ty_le_ok",
    key: "ty_le_ok",
    align: "center",
  },
  {
    title: "TT thực tế",
    dataIndex: "tt_thuc_te",
    key: "tt_thuc_te",
    align: "center",
  },
  {
    title: "Leadtime",
    dataIndex: "lead_time",
    key: "lead_time",
    align: "center",
  },
  {
    title: "Tên công nhân sản xuất",
    dataIndex: "user_name",
    key: "user_name",
    align: "center",
  },
];

const LichSuSanXuat = (props) => {
  document.title = "UI - Lịch sử sản xuất";
  const [listLines, setListLines] = useState([]);
  const [listNameProducts, setListNameProducts] = useState([]);
  const [listLoSX, setListLoSX] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [selectedLine, setSelectedLine] = useState();
  const [params, setParams] = useState({ date: [dayjs(), dayjs()] });
  const dataChart = [
    {
      label: "Kế hoạch",
      value: 1000,
      type: "1",
    },
    {
      label: "Thực tế",
      value: 900,
      type: "2",
    },
  ];
  const config = {
    showTitle: true,
    title: {
      visible: false,
      text: "Your Stats",
    },
    data: dataChart,
    height: 200,
    minColumnWidth: 40,
    maxColumnWidth: 40,
    isStack: true,
    xField: "label",
    yField: "value",
    seriesField: "type",
    legend: false,
    label: {
      style: {
        color: "black",
        fontWeight: "700",
      },
      position: "middle",
    },
    colorField: "type", // or seriesField in some cases
    color: ({ type }) => {
      if (type === "1") {
        return "#ccae70";
      }

      return "#5B8FF9";
    },
  };
  const dataChart1 = [
    {
      label: "Mục tiêu",
      value: 105,
      type: "1",
    },
    {
      label: "Thực tế",
      value: 108,
      type: "2",
    },
  ];
  const config1 = {
    showTitle: true,
    title: {
      visible: false,
      text: "Your Stats",
    },
    data: dataChart1,
    height: 200,
    minColumnWidth: 40,
    maxColumnWidth: 40,
    isStack: true,
    xField: "label",
    yField: "value",
    seriesField: "type",
    legend: false,
    label: {
      style: {
        color: "black",
        fontWeight: "700",
      },
      position: "middle",
    },
    colorField: "type", // or seriesField in some cases
    color: ({ type }) => {
      if (type === "1") {
        return "#ccae70";
      }
      return "#5B8FF9";
    },
  };
  useEffect(() => {
    (async () => {
      const res1 = await getLines();
      setListLines(
        res1.data.map((e) => {
          return { ...e, label: e.name, value: e.id };
        })
      );
      // const res5 = await getCustomers();
      // setListCustomers(
      //   res5.data.map((e) => {
      //     return { ...e, label: e.name, value: e.id };
      //   })
      // );
    })();
    btn_click();
  }, []);

  useEffect(() => {
    (async () => {
      // var res = await getDataFilterUI({ khach_hang: params.khach_hang });
      // if (res.success) {
      //   setListNameProducts(
      //     res.data.product.map((e) => {
      //       return { ...e, label: e.name, value: e.id };
      //     })
      //   );
      //   setListLoSX(
      //     Object.values(res.data.lo_sx).map((e) => {
      //       return { label: e, value: e };
      //     })
      //   );
      // }
    })();
  }, [params.khach_hang]);

  const [dataTable1, setDataTable1] = useState([
    {
      chenh_lech: -200,
      sl_dau_ra_kh: 1000,
      sl_dau_ra_thuc_te_ok: 800,
      sl_ng: 200,
      sl_tem_vang: 0,
      ty_le: "80%",
    },
  ]);
  const [dataTable2, setDataTable2] = useState([
    {
      machine_id: "S01",
      khach_hang: "SHG",
      don_hang: "SBF",
      lo_sx: "S2023112",
      lot_id: "S20231120001",
      quy_cach: "50x40x60",
      sl_dau_vao_kh: "100",
      sl_dau_ra_kh: "100",
      thoi_gian_bat_dau: "20/11/2023",
      thoi_gian_ket_thuc: "20/11/2023",
      sl_dau_ra_hang_loat: "100",
      sl_ok: "100",
      sl_ng: "0",
    },
    {
      machine_id: "S01",
      khach_hang: "BKF",
      don_hang: "SBF",
      lo_sx: "S2023112",
      lot_id: "S20231120001",
      quy_cach: "50x40x60",
      sl_dau_vao_kh: "100",
      sl_dau_ra_kh: "100",
      thoi_gian_bat_dau: "20/11/2023",
      thoi_gian_ket_thuc: "20/11/2023",
      sl_dau_ra_hang_loat: "100",
      sl_ok: "100",
      sl_ng: "0",
    },
    {
      machine_id: "S01",
      khach_hang: "SHB",
      don_hang: "SBF",
      lo_sx: "S2023112",
      lot_id: "S20231120006",
      quy_cach: "50x40x60",
      sl_dau_vao_kh: "100",
      sl_dau_ra_kh: "100",
      thoi_gian_bat_dau: "20/11/2023",
      thoi_gian_ket_thuc: "20/11/2023",
      sl_dau_ra_hang_loat: "100",
      sl_ok: "100",
      sl_ng: "0",
    },
    {
      machine_id: "S01",
      khach_hang: "NKM",
      don_hang: "SBF",
      lo_sx: "S2023112",
      lot_id: "S20231120007",
      quy_cach: "50x40x60",
      sl_dau_vao_kh: "100",
      sl_dau_ra_kh: "100",
      thoi_gian_bat_dau: "20/11/2023",
      thoi_gian_ket_thuc: "20/11/2023",
      sl_dau_ra_hang_loat: "100",
      sl_ok: "100",
      sl_ng: "0",
    },
    {
      machine_id: "S01",
      khach_hang: "SSC",
      don_hang: "SBF",
      lo_sx: "S2023112",
      lot_id: "S20231120008",
      quy_cach: "50x40x60",
      sl_dau_vao_kh: "100",
      sl_dau_ra_kh: "100",
      thoi_gian_bat_dau: "20/11/2023",
      thoi_gian_ket_thuc: "20/11/2023",
      sl_dau_ra_hang_loat: "100",
      sl_ok: "100",
      sl_ng: "0",
    },
    {
      machine_id: "S01",
      khach_hang: "NHH",
      don_hang: "SBF",
      lo_sx: "S2023112",
      lot_id: "S20231120010",
      quy_cach: "50x70x80",
      sl_dau_vao_kh: "100",
      sl_dau_ra_kh: "100",
      thoi_gian_bat_dau: "20/11/2023",
      thoi_gian_ket_thuc: "20/11/2023",
      sl_dau_ra_hang_loat: "100",
      sl_ok: "100",
      sl_ng: "0",
    },
  ]);
  const [dataTable3, setDataTable3] = useState([]);

  function btn_click() {
    (async () => {
      setLoading(true);
      const res1 = await getProduceOverall(params);
      const res2 = await getProducePercent(params);
      const res3 = await getProduceTable(params);
      setDataTable1(res1.data);
      setDataTable2(
        Object.keys(res2.data ?? {}).map((key) => {
          return { ...res2.data[key], lo_sx: key };
        })
      );
      setDataTable3(res3.data);
      setLoading(false);
    })();
  }
  const [exportLoading1, setExportLoading1] = useState(false);
  const [exportLoading2, setExportLoading2] = useState(false);
  const exportFile = async () => {
    setExportLoading1(true);
    const res = await exportProduceHistory(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading1(false);
  };
  const [loading, setLoading] = useState(false);
  const reportProduceHistory = async () => {
    setExportLoading2(true);
    const res = await exportReportProduceHistory(params);
    console.log(res.data);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading2(false);
  };
  const itemsMenu = [
    {
      title: "Sóng",
      key: "30",
      children: [
        {
          title: "Chuyền máy dợn sóng",
          key: "S01",
        },
      ],
    },
    {
      title: "In",
      key: "31",
      children: [
        {
          title: "Máy in P.06",
          key: "P06",
        },
        {
          title: "Máy in P.15",
          key: "P15",
        },
      ],
    },
    {
      title: "Dán",
      key: "32",
      children: [
        {
          title: "Máy dán D.05",
          key: "D05",
        },
        {
          title: "Máy dán D.06",
          key: "D06",
        },
      ],
    },
  ];
  return (
    <React.Fragment>
      <Row style={{ padding: "8px", height: "100vh" }} gutter={[8, 8]}>
        <Col span={4}>
          <Card
            style={{ height: "100%" }}
            bodyStyle={{ paddingInline: 0, paddingTop: 0 }}
          >
            <div className="mb-3">
              <Form style={{ margin: "0 15px" }} layout="vertical">
                <Divider>Công đoạn</Divider>
                <Form.Item className="mb-3">
                  <Tree
                    checkable
                    defaultExpandedKeys={["0-0-0", "0-0-1"]}
                    defaultSelectedKeys={["0-0-0", "0-0-1"]}
                    defaultCheckedKeys={["0-0-0", "0-0-1"]}
                    // onSelect={onSelect}
                    // onCheck={onCheck}
                    treeData={itemsMenu}
                    style={{ maxHeight: "80px", overflowY: "auto" }}
                  />
                </Form.Item>
              </Form>
            </div>
            <Divider>Thời gian truy vấn</Divider>
            <div className="mb-3">
              <Form style={{ margin: "0 15px" }} layout="vertical">
                {/* <RangePicker placeholder={["Bắt đầu", "Kết thúc"]} /> */}
                <Space direction="vertical" style={{ width: "100%" }}>
                  <DatePicker
                    allowClear={false}
                    placeholder="Bắt đầu"
                    style={{ width: "100%" }}
                    onChange={(value) =>
                      setParams({ ...params, date: [value, params.date[1]] })
                    }
                    value={params.date[0]}
                  />
                  <DatePicker
                    allowClear={false}
                    placeholder="Kết thúc"
                    style={{ width: "100%" }}
                    onChange={(value) =>
                      setParams({ ...params, date: [params.date[0], value] })
                    }
                    value={params.date[1]}
                  />
                </Space>
              </Form>
            </div>
            <Divider>Điều kiện truy vấn</Divider>
            <div className="mb-3">
              <Form style={{ margin: "0 15px" }} layout="vertical">
                <Form.Item label="Máy" className="mb-3">
                  <Select
                    allowClear
                    showSearch
                    placeholder="Nhập máy"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={listCustomers}
                  />
                </Form.Item>
                <Form.Item label="Khách hàng" className="mb-3">
                  <Select
                    allowClear
                    showSearch
                    placeholder="Nhập khách hàng"
                    onChange={(value) =>
                      setParams({ ...params, khach_hang: value })
                    }
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={listCustomers}
                  />
                </Form.Item>
                <Form.Item label="Đơn hàng" className="mb-3">
                  <Select
                    allowClear
                    showSearch
                    onChange={(value) => {
                      setParams({ ...params, ten_sp: value });
                    }}
                    placeholder="Nhập đơn hàng"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={listNameProducts}
                  />
                </Form.Item>
                <Form.Item label="Lô Sản xuất" className="mb-3">
                  <Select
                    allowClear
                    showSearch
                    placeholder="Nhập lô sản xuất"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    onChange={(value) => setParams({ ...params, lo_sx: value })}
                    options={listLoSX}
                  />
                </Form.Item>
                <Form.Item label="Quy cách" className="mb-3">
                  <Select
                    allowClear
                    showSearch
                    placeholder="Nhập quy cách"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    onChange={(value) => setParams({ ...params, lo_sx: value })}
                    options={listLoSX}
                  />
                </Form.Item>
              </Form>
            </div>

            <div
              style={{
                padding: "10px",
                textAlign: "center",
              }}
              layout="vertical"
            >
              <Button
                type="primary"
                style={{ width: "80%" }}
                onClick={btn_click}
              >
                Truy vấn
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={20}>
          <Card
            style={{ height: "100%" }}
            title="Lịch sử sản xuất"
            extra={
              <Space>
                <Button
                  type="primary"
                  onClick={reportProduceHistory}
                  loading={exportLoading2}
                >
                  Báo cáo truy vấn
                </Button>
                <Button
                  type="primary"
                  onClick={exportFile}
                  loading={exportLoading1}
                >
                  Xuất Excel
                </Button>
              </Space>
            }
          >
            <Spin spinning={loading}>
              <Table
                className="mb-3"
                size="small"
                bordered
                pagination={false}
                columns={columns1}
                dataSource={dataTable1}
              />
              <Table
                className="mb-3"
                size="small"
                bordered
                pagination={false}
                columns={columns2}
                scroll={{
                  y: "50vh",
                }}
                dataSource={dataTable2}
              />
              <Table
                size="small"
                bordered
                pagination={false}
                scroll={{
                  x: "130vw",
                  y: "50vh",
                }}
                columns={columns3}
                dataSource={dataTable3}
              />
            </Spin>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default LichSuSanXuat;
