import {
  DatePicker,
  Col,
  Row,
  Card,
  Table,
  Tag,
  Divider,
  Button,
  Form,
  Select,
  Space,
  Spin,
} from "antd";
import { Column } from "@ant-design/plots";
import React, { useState, useEffect } from "react";
import { Pie } from "@ant-design/charts";
import {
  getMachineError,
} from "../../../api/ui/main";
import { exportMachineError } from "../../../api/ui/export";
import { baseURL } from "../../../config";
import dayjs from "dayjs";
import "../style.scss";

const columnTable = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    render: (value, record, index) => index + 1,
    align: "center",
  },
  {
    title: "Máy",
    dataIndex: "may",
    key: "may",
    align: "center",
  },
  {
    title: "Khách hàng",
    dataIndex: "khach_hang",
    key: "ca_sx",
    align: "center",
  },
  {
    title: "Đơn hàng",
    dataIndex: "don_hang",
    key: "don_hang",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Lô sản xuất",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Thời gian dừng",
    dataIndex: "thoi_gian_dung",
    key: "thoi_gian_dung",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Thời gian chạy",
    dataIndex: "thoi_gian_chay",
    key: "thoi_gian_chay",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Mã sự cố",
    dataIndex: "ma_su_co",
    key: "ma_su_co",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Tên sự cố",
    dataIndex: "ten_su_co",
    key: "ten_su_co",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Nguyên nhân",
    dataIndex: "nguyen_nhan",
    key: "nguyen_nhan",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Cách xử lý",
    dataIndex: "cach_xu_ly",
    key: "cach_xu_ly",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Thời gian xử lý",
    dataIndex: "thoi_gian_xu_ly",
    key: "thoi_gian_xu_ly",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Nguời xử lý",
    dataIndex: "nguoi_xu_ly",
    key: "nguoi_xu_ly",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Tình trạng",
    dataIndex: "tinh_trang",
    key: "tinh_trang",
    render: (record) => {
      return record == 1 ? (
        <Tag style={{ wordWrap: "break-word" }} color="#87d068">
          Đã hoàn thành
        </Tag>
      ) : (
        <Tag color="#929292">Chưa xử lý</Tag>
      );
    },
    align: "center",
  },
];

const logs = [
  {
    may: "P06",
    khach_hang: "VICTORY",
    don_hang: "",
    lo_sx: "",
    thoi_gian_dung: "15/10/2023 08:19:20",
    thoi_gian_chay: "15/10/2023 08:35:20",
    ma_su_co: "",
    ten_su_co: "Đổi mã hàng",
    nguyen_nhan: "",
    cach_xu_ly: "",
    thoi_gian_xu_ly: "",
    nguoi_xu_ly: "",
    tinh_trang: "",
  },
  {
    may: "P06",
    khach_hang: "VICTORY",
    don_hang: "",
    lo_sx: "",
    thoi_gian_dung: "15/10/2023 08:19:20",
    thoi_gian_chay: "15/10/2023 08:35:20",
    ma_su_co: "",
    ten_su_co: "Đổi mã hàng",
    nguyen_nhan: "",
    cach_xu_ly: "",
    thoi_gian_xu_ly: "",
    nguoi_xu_ly: "",
    tinh_trang: "",
  },
  {
    may: "P06",
    khach_hang: "VICTORY",
    don_hang: "",
    lo_sx: "",
    thoi_gian_dung: "15/10/2023 08:19:20",
    thoi_gian_chay: "15/10/2023 08:35:20",
    ma_su_co: "",
    ten_su_co: "Đổi mã hàng",
    nguyen_nhan: "",
    cach_xu_ly: "",
    thoi_gian_xu_ly: "",
    nguoi_xu_ly: "",
    tinh_trang: "",
  },
];

const data1 = [
  { type: "Xanh", value: 70 },
  { type: "Cam", value: 30 },
];

const data2 = [
  { type: "Xanh", value: 84 },
  { type: "Cam", value: 16 },
];

const data3 = [
  { type: "Thời gian dừng kế hoạch", value: 60 },
  { type: "Thời gian dừng bất thường", value: 38 },
];

const config = {
  // appendPadding: 10,
  data: data1,
  width: 100,
  height: 100,
  angleField: "value",
  colorField: "type",
  radius: 0.8,
  color: (value) => {
    return value.type === "Xanh" ? "blue" : "orange";
  },
  label: false,
  legend: false,
  tooltip: {
    formatter: (datum) => {
      return {
        name: datum.type,
        value: datum.value?.toFixed(2) + "%",
      };
    },
  },
};

const config2 = {
  // appendPadding: 4,
  data: data2,
  height: 100,
  width: 100,
  angleField: "value",
  colorField: "type",
  radius: 0.8,
  label: false,
  color: (value) => {
    return value.type === "Xanh" ? "blue" : "orange";
  },
  legend: false,
  tooltip: {
    formatter: (datum) => {
      return {
        name: datum.type,
        value: datum.value?.toFixed(2) + "%",
      };
    },
  },
};

const config3 = {
  title: {
    text: "Thời gian dừng (Phút)",
    style: {
      fontSize: "14px",
      fontWeight: "bold",
      textAlign: "center",
    },
  },
  height: 250,
  data: data3,
  xField: "type",
  yField: "value",
  seriesField: "type",
  isGroup: true,
  color: "blue",
  xAxis: {
    label: {
      autoHide: false,
      autoRotate: true,
    },
  },
  label: {
    position: "top",
    offsetY: 10,
    formatter: (value) => {
      return value.value ? `${value.value}%` : "";
    },
  },
  legend: false,
  yAxis: {
    max: 80,
  },
  meta: {
    type: {
      alias: "Máy",
    },
    value: {
      alias: "Hiệu suất",
    },
  },
};
const column = [
  {
    title: "Mã sự cố",
    dataIndex: "ma_su_co",
    key: "ma_su_co",
    align: "center",
    height: 30,
  },
  {
    title: "Tên sự cố",
    dataIndex: "ten_su_co",
    key: "ten_su_co",
    align: "center",
    height: 30,
  },
  {
    title: "Số lần",
    dataIndex: "so_lan",
    key: "so_lan",
    align: "center",
    height: 30,
  },
];

const errorTable = [
  {
    ma_su_co: "SC01",
    ten_su_co: "Mất điện",
    so_lan: 7,
  },
  {
    ma_su_co: "SC02",
    ten_su_co: "Sản phẩm mới (duyệt mẫu)",
    so_lan: 6,
  },
  {
    ma_su_co: "SC03",
    ten_su_co: "Bảo trì (định kỳ)",
    so_lan: 5,
  },
  {
    ma_su_co: "SC04",
    ten_su_co: "Vệ sinh 5S",
    so_lan: 4,
  },
  {
    ma_su_co: "SC05",
    ten_su_co: "Nghỉ giữa ca",
    so_lan: 2,
  },
];

const Equipment1 = (props) => {
  document.title = "UI - Thống kê lỗi";
  const [listLines, setListLines] = useState([]);
  const [listMachines, setListMachines] = useState([]);
  const [listIdProducts, setListIdProducts] = useState([]);
  const [listLoSX, setListLoSX] = useState([]);
  const [listStaffs, setListStaffs] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [listErrorsMachine, setListErrorsMachine] = useState([]);
  // const [selectedLine, setSelectedLine] = useState();
  // const [selectedIdProduct, setSelectedIdProduct] = useState();
  // const [selectedCustomer, setSelectedCustomer] = useState();
  // const [selectedStaff, setSelectedStaff] = useState();
  // const [selectedError, setSelectedError] = useState();
  const [data, setData] = useState();
  const [dataTable, setDataTable] = useState();
  const [dataPieChart, setDataPieChart] = useState([]);
  const [dataColChart, setDataColChart] = useState([]);
  const [activeTab, setActiveTab] = useState("Time");
  const [params, setParams] = useState({
    machine_code: "",
    date: [dayjs(), dayjs()],
  });
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   (async () => {
  //     setLoading(false);
  //     const res2 = await getProducts();
  //     setListIdProducts(
  //       res2.data.map((e) => {
  //         return { ...e, label: e.id, value: e.id };
  //       })
  //     );
  //     const res3 = await getLoSanXuat();
  //     setListLoSX(
  //       res3.data.map((e) => {
  //         return { ...e, label: e, value: e };
  //       })
  //     );
  //     const res4 = await getStaffs();
  //     setListStaffs(
  //       res4.data.map((e) => {
  //         return { ...e, label: e.name, value: e.id };
  //       })
  //     );

  //     const res5 = await getCustomers();
  //     setListCustomers(
  //       res5.data.map((e) => {
  //         return { ...e, label: e.name, value: e.id };
  //       })
  //     );
  //     const res6 = await getErrorsMachine();
  //     setListErrorsMachine(
  //       res6.data.map((e) => {
  //         return { ...e, label: e.noi_dung, value: e.id };
  //       })
  //     );
  //     const res7 = await getMachineOfLine();
  //     setListMachines(
  //       res7.data.map((e) => {
  //         return { ...e, label: e.name, value: e.code };
  //       })
  //     );
  //     setLoading(false);
  //   })();
  //   btn_click();
  // }, []);

  function btn_click() {
    (async () => {
      setLoading(false);
      const res = await getMachineError(params);
      setData(res.data);
      setLoading(false);
    })();
  }
  useEffect(() => {
    if (!data) return;
    setDataTable(data.table);

    setDataPieChart(
      Object.keys(data.chart_err).map((item, i) => {
        return {
          id: data.chart_err[item]["id"],
          error:
            data.chart_err[item]["id"] + " " + data.chart_err[item]["name"],
          value: parseInt(data.chart_err[item]["value"]),
        };
      })
    );

    setDataColChart(
      Object.keys(data.perfomance).map((item, i) => {
        console.log(data.perfomance[item]);
        return {
          type: data.perfomance[item]["machine_name"],
          value: data.perfomance[item]["percent"],
        };
      })
    );
  }, [data]);

  useEffect(() => {
    console.log(dataColChart);
  }, [dataColChart]);

  var configColChart = {
    data: dataColChart,
    xField: "type",
    yField: "value",
    label: {
      position: "top",
      offsetY: 10,
      formatter: (value) => {
        console.log(value);
        return value.value ? `${value.value}%` : "";
      },
    },
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: true,
      },
    },
    yAxis: {
      max: 100,
    },
    meta: {
      type: {
        alias: "Máy",
      },
      value: {
        alias: "Hiệu suất",
      },
    },
  };

  const [exportLoading, setExportLoading] = useState(false);
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportMachineError(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };

  return (
    <>
      <Row style={{ padding: "8px" }} gutter={[8, 8]}>
        <Col span={4}>
          <Card
            style={{ height: "100%" }}
            bodyStyle={{ paddingInline: 0, paddingTop: 0 }}
          >
            <div className="mb-3">
              <Form style={{ margin: "0 15px" }} layout="vertical">
                <Divider>Công đoạn</Divider>
                <Form.Item className="mb-3">
                  <Select
                    allowClear
                    onChange={(value) =>
                      setParams({ ...params, line_id: value })
                    }
                    placeholder="Nhập công đoạn"
                    options={listLines}
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
                    onChange={(value) => setParams({ ...params, lo_sx: value })}
                    options={listLoSX}
                  />
                </Form.Item>
                <Form.Item label="Mã lỗi" className="mb-3">
                  <Select
                    allowClear
                    showSearch
                    onChange={(value) => {
                      setParams({ ...params, ten_sp: value });
                    }}
                    placeholder="Nhập mã lỗi"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[]}
                  />
                </Form.Item>
                <Form.Item label="Tên lỗi" className="mb-3">
                  <Select
                    allowClear
                    showSearch
                    placeholder="Nhập tên lỗi"
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
                <Form.Item label="Nguyên nhân" className="mb-3">
                  <Select
                    allowClear
                    showSearch
                    placeholder="Nhập nguyên nhân"
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
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Card
                bodyStyle={{ height: "100%" }}
                style={{
                  height: 300,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Space direction="vertical">
                    <Pie
                      {...config}
                      // style={{ width: "20%" }}
                      innerRadius={0.8}
                      statistic={{
                        title: false,
                        content: {
                          style: {
                            whiteSpace: "pre-wrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontSize: 14,
                          },
                          content: "OEE",
                        },
                      }}
                    />
                    <Pie
                      {...config2}
                      // style={{ width: "20%" }}
                      innerRadius={0.8}
                      statistic={{
                        title: false,
                        content: {
                          style: {
                            whiteSpace: "pre-wrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontSize: 12,
                          },
                          content: "Tỷ lệ\nvận hành",
                        },
                      }}
                    />
                  </Space>
                  <Column {...config3} />
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                bodyStyle={{ height: "90%" }}
                style={{
                  height: 300,
                }}
              >
                <h4 style={{ textAlign: "center", marginTop: -12 }}>
                  5 SỰ CỐ XUẤT HIỆN NHIỀU NHẤT
                </h4>
                <Table
                  className="my-custom-table"
                  dataSource={errorTable}
                  columns={column}
                  pagination={false}
                  bordered
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card
                style={{ height: "100%" }}
                title="Thống kê chi tiết lỗi"
                extra={
                  <Button
                    loading={exportLoading}
                    onClick={exportFile}
                    type="primary"
                  >
                    Xuất excel
                  </Button>
                }
              >
                <Spin spinning={loading}>
                  <Table
                    size="small"
                    bordered
                    pagination={false}
                    scroll={{
                      x: "150vw",
                      y: "50vh",
                    }}
                    columns={columnTable}
                    dataSource={logs}
                  />
                </Spin>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Equipment1;
