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
  Input,
} from "antd";
import "../style.scss";
import {
  getUIItemMenu,
} from "../../../api/ui/main";
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
    title: "Dán",
    dataIndex: "32",
    key: "32",
    align: "center",
    render: (value) => value ?? 0,
  },
  {
    title: "Xả lót",
    dataIndex: "33",
    key: "33",
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
    width: "1.5%",
    render: (value, record, index) => index + 1,
  },
  {
    title: "Ngày sản xuất",
    dataIndex: "ngay_sx",
    key: "ngay_sx",
    align: "center",
    width: "3.5%",
  },
  {
    title: "Công đoạn",
    dataIndex: "line",
    key: "line",
    align: "center",
    width: "3%",
    render: (value) => value?.name,
  },
  {
    title: "Máy",
    dataIndex: "machine_id",
    key: "machine_id",
    align: "center",
    width: "2%",
  },
  {
    title: "Khách hàng",
    dataIndex: "khach_hang",
    key: "khach_hang",
    align: "center",
    width: "6%",
  },
  {
    title: "MDH",
    dataIndex: "mdh",
    key: "mdh",
    align: "center",
    width: "4%",
  },
  {
    title: "MQL",
    dataIndex: "mql",
    key: "mql",
    align: "center",
    width: "2%",
  },
  {
    title: "Lô sản xuất",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
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
  const [params, setParams] = useState({
    start_date: dayjs(),
    end_date: dayjs(),
  });
  useEffect(() => {
    (async () => {
      const res1 = await getUIItemMenu();
      setItemMenu(res1.data);
    })();
    btn_click();
  }, []);

  const [dataTable1, setDataTable1] = useState([]);
  const [dataTable2, setDataTable2] = useState([]);
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
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading2(false);
  };
  const [itemsMenu, setItemMenu] = useState([]);
  const onCheck = (selectedKeys, e) => {
    const filteredKeys = selectedKeys.filter(
      (key) => !itemsMenu.some((e) => e.key === key)
    );
    setParams({ ...params, machine: filteredKeys });
  };
  return (
    <React.Fragment>
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Card
              // style={{ height: "100%", marginBottom: 10 }}
              bodyStyle={{ paddingInline: 0, paddingTop: 0 }}
              className="custom-card scroll"
              actions={[
                <div
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
              ]}
            >
              <div className="mb-3">
                <Form style={{ margin: "0 15px" }} layout="vertical">
                  <Divider>Công đoạn</Divider>
                  <Form.Item className="mb-3">
                    <Tree
                      checkable
                      onCheck={onCheck}
                      treeData={itemsMenu}
                    />
                  </Form.Item>
                </Form>
              </div>
              <Divider>Thời gian truy vấn</Divider>
              <div className="mb-3">
                <Form style={{ margin: "0 15px" }} layout="vertical">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <DatePicker
                      allowClear={false}
                      placeholder="Bắt đầu"
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        setParams({ ...params, start_date: value })
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
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          short_name: e.target.value,
                          page: 1,
                        });
                      }}
                      placeholder="Nhập khách hàng"
                    />
                  </Form.Item>
                  <Form.Item label="MĐH" className="mb-3">
                    <Select
                      allowClear
                      showSearch
                      onChange={(value) => {
                        setParams({ ...params, mdh: value });
                      }}
                      open={false}
                      suffixIcon={null}
                      mode="tags"
                      placeholder="Nhập mã đơn hàng"
                      options={[]}
                    />
                  </Form.Item>
                  <Form.Item label="Lô Sản xuất" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          lo_sx: e.target.value,
                          page: 1,
                        });
                      }}
                      placeholder="Nhập lô sản xuất"
                    />
                  </Form.Item>
                  <Form.Item label="Máy" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          machine_id: e.target.value,
                          page: 1,
                        });
                      }}
                      placeholder="Nhập máy"
                    />
                  </Form.Item>
                  <Form.Item label="Quy cách" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          quy_cach: e.target.value,
                          page: 1,
                        });
                      }}
                      placeholder="Nhập quy cách"
                    />
                  </Form.Item>
                </Form>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Card
            style={{ height: "100%" }}
            title="Lịch sử sản xuất"
            className="custom-card scroll"
            extra={
              <Space>
                <Button
                  type="primary"
                  onClick={reportProduceHistory}
                  loading={exportLoading2}
                >
                  Xuất báo cáo
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
                locale={{ emptyText: "Trống" }}
                pagination={false}
                columns={columns1}
                dataSource={dataTable1}
              />
              <Table
                className="mb-3"
                size="small"
                bordered
                locale={{ emptyText: "Trống" }}
                pagination={false}
                columns={columns2}
                scroll={{
                  y: window.innerHeight * 0.10,
                }}
                dataSource={dataTable2}
              />
              <Table
                size="small"
                bordered
                pagination={false}
                scroll={{
                  x: "200vw",
                  y: window.innerHeight * 0.30,
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
