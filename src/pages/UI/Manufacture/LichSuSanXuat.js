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
import { getCustomers, getLines, getLoSanXuat, getOrders } from "../../../api/ui/main";
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
    width: "2%",
    render: (value, record, index) => index + 1,
  },
  {
    title: "Ngày sản xuất",
    dataIndex: "ngay_sx",
    key: "ngay_sx",
    align: "center",
    width: "4%",
  },
  {
    title: "Công đoạn",
    dataIndex: "line",
    key: "line",
    align: "center",
    width: "4%",
    render: (value) => value?.name,
  },
  {
    title: "Máy",
    dataIndex: "machine_id",
    key: "machine_id",
    align: "center",
    width: "4%",
  },
  {
    title: "Khách hàng",
    dataIndex: "khach_hang",
    key: "khach_hang",
    align: "center",
    width:'10%'
  },
  {
    title: "Đơn hàng",
    dataIndex: "ma_don_hang",
    key: "ma_don_hang",
    align: "center",
  },
  {
    title: "Lô sản xuất",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
  },
  {
    title: "Lot sản xuất",
    dataIndex: "lot_id",
    key: "lot_id",
    align: "center",
    width:'5%'
  },
  {
    title: "Mã layout",
    dataIndex: "layout_id",
    key: "layout_id",
    align: "center",
  },
  {
    title: "Quy cách",
    dataIndex: "quy_cach",
    key: "quy_cach",
    align: "center",
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
  const [params, setParams] = useState({ start_date: dayjs(), end_date: dayjs() });
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loSX, setLoSX] = useState([]);
  useEffect(() => {
    (async () => {
      const res1 = await getCustomers();
      setCustomers(res1.data.map((e) => ({ label: e.name, value: e.id })));
      const res2 = await getOrders();
      setOrders(res2.data.map((e) => ({ label: e.id, value: e.id })))
      const res3 = await getLoSanXuat();
      setLoSX(res3.data.map((e) => ({ label: e, value: e })))
    })();
    btn_click();
  }, []);

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
  const onCheck = (selectedKeys, e) => {
    const filteredKeys = selectedKeys.filter(key => !itemsMenu.some(e=>e.key === key));
    setParams({...params, machine: filteredKeys});
  }
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
                    onCheck={onCheck}
                    treeData={itemsMenu}
                    // style={{ maxHeight: '80px', overflowY: 'auto' }}
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
                      setParams({ ...params, start_date: value})
                    }
                    value={params.start_date}
                  />
                  <DatePicker
                    allowClear={false}
                    placeholder="Kết thúc"
                    style={{ width: "100%" }}
                    onChange={(value) =>
                      setParams({ ...params, end_date: value })
                    }
                    value={params.end_date}
                  />
                </Space>
              </Form>
            </div>
            <Divider>Điều kiện truy vấn</Divider>
            <div className="mb-3">
              <Form style={{ margin: "0 15px" }} layout="vertical">
                <Form.Item label="Khách hàng" className="mb-3">
                  <Select
                    allowClear
                    showSearch
                    placeholder="Nhập khách hàng"
                    onChange={(value) =>
                      setParams({ ...params, customer_id: value })
                    }
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    popupMatchSelectWidth={customers.length > 0 ? 400 : 0}
                    options={customers}
                  />
                </Form.Item>
                <Form.Item label="Đơn hàng" className="mb-3">
                  <Select
                    allowClear
                    showSearch
                    onChange={(value) => {
                      setParams({ ...params, order_id: value });
                    }}
                    placeholder="Nhập đơn hàng"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={orders}
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
                    options={loSX}
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
                  y: "20vh",
                }}
                dataSource={dataTable2}
              />
              <Table
                size="small"
                bordered
                pagination={false}
                scroll={{
                  x: "200vw",
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
