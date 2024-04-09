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

const Equipment1 = (props) => {
  document.title = "UI - Thống kê lỗi";
  const [listLoSX, setListLoSX] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [data, setData] = useState();
  const [dataPieChart, setDataPieChart] = useState([]);
  const [dataColChart, setDataColChart] = useState([]);

  const [params, setParams] = useState({
    machine_code: "",
    date: [dayjs(), dayjs()],
  });
  const [loading, setLoading] = useState(false);

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
    padding: [20, 10, 50, 30],
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: true,
        // rotate: -270,
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
    height:100,
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
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Card
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
          <Row gutter={[8, 8]} style={{height: '100%'}}>
            <Col span={12}>
              <Card
                title="Tần suất phát sinh lỗi"
                bodyStyle={{ padding: 12, height: 200 }}
                style={{
                  height: '100%',
                  padding: "0px",
                }}
              >
                {!loading && <Pie {...configPieChart} />}
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title="Hiệu suất máy"
                bodyStyle={{ padding: 12, height: 200 }}
                style={{ height: "100%", padding: "0px" }}
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
