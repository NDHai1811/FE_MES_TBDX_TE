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
  Tree,
} from "antd";
import { Column } from "@ant-design/plots";
import React, { useState, useEffect } from "react";
import { Pie } from "@ant-design/charts";
import { exportMachineError } from "../../../api/ui/export";
import { baseURL } from "../../../config";
import dayjs from "dayjs";
import "../style.scss";
import {
  getErrorMachineFrenquency,
  getMachineErrorList,
  getMachinePerformance,
} from "../../../api/ui/machine";

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
    dataIndex: "machine_id",
    key: "machine_id",
    align: "center",
  },
  {
    title: "Khách hàng",
    dataIndex: "khach_hang",
    key: "khach_hang",
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
    dataIndex: "start_time",
    key: "start_time",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Thời gian chạy",
    dataIndex: "end_time",
    key: "end_time",
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
    dataIndex: "da_xu_ly",
    key: "da_xu_ly",
    render: (record) => {
      return record ? (
        <Tag color="#87d068">Đã hoàn thành</Tag>
      ) : (
        <Tag color="#87d068">Đã hoàn thành</Tag>
      );
    },
    align: "center",
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

const dataTable = [];

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
  const [listLoSX, setListLoSX] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [data, setData] = useState();
  const [dataPieChart, setDataPieChart] = useState([]);
  const [dataColChart, setDataColChart] = useState([
    {
      name: "Máy in P.06",
      percent: 50,
    },
    {
      name: "Máy in P.05",
      percent: 60,
    },
    {
      name: "Máy dán P.06",
      percent: 70,
    },
    {
      name: "Máy in P.15",
      percent: 30,
    },
    {
      name: "Chuyền máy dợn sóng",
      percent: 25,
    },
  ]);

  const [params, setParams] = useState({
    machine_code: "",
    date: [dayjs(), dayjs()],
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
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
    // btn_click();
  }, []);

  function btn_click() {
    (async () => {
      setLoading(false);
      const res1 = await getMachineErrorList(params);
      setData(res1.data);
      const res2 = await getErrorMachineFrenquency(params);
      console.log(res2.data);
      setDataPieChart(res2.data);
      const res3 = await getMachinePerformance(params);
      setDataColChart(res3.data);
      setLoading(false);
    })();
  }

  useEffect(() => {
    btn_click();
  }, []);

  useEffect(() => {
    console.log(dataColChart);
  }, [dataColChart]);

  var configColChart = {
    data: dataColChart,
    xField: "name",
    yField: "percent",
    label: {
      position: "top",
      offsetY: 10,
    },
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: false,
        rotate: -270,
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

  const configPieChart = {
    appendPadding: 10,
    // height:200,
    data: dataPieChart,
    angleField: "value",
    colorField: "name",
    radius: 0.8,
    label: {
      type: "outer",
      content: ({ name, percent }) =>
        `${name}` + " " + `${(percent * 100).toFixed(0)}%`,
    },
  };

  return (
    <>
      <Row style={{ padding: "8px" }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Card
              style={{ height: "100%" }}
              bodyStyle={{ paddingInline: 0, paddingTop: 0 }}
              className="custom-card scroll"
              actions={[
                <div layout="vertical">
                  <Button
                    type="primary"
                    style={{ width: "80%" }}
                    onClick={btn_click}
                  >
                    Truy vấn
                  </Button>
                </div>,
              ]}
            >
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
                      onChange={(value) =>
                        setParams({ ...params, lo_sx: value })
                      }
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
                      onChange={(value) =>
                        setParams({ ...params, lo_sx: value })
                      }
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
                      onChange={(value) =>
                        setParams({ ...params, lo_sx: value })
                      }
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
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Card
                title="Tần suất phát sinh lỗi"
                bodyStyle={{ height: "90%" }}
                style={{
                  height: 300,
                  padding: "0px",
                }}
              >
                {!loading && <Pie {...configPieChart} />}
              </Card>
            </Col>
            <Col span={12}>
              {/* <Card
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
              </Card> */}
              <Card
                title="Hiệu suất máy"
                bodyStyle={{ height: "90%" }}
                style={{
                  height: 300,
                  padding: "0px",
                }}
              >
                <Column {...configColChart} />
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
                    dataSource={data}
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
