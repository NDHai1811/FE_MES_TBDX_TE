import {
  Modal,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Row,
  Select,
  Table,
  Space,
  Spin,
  message,
  Popconfirm,
  Tree,
  Input,
} from "antd";
import React, { useState, useEffect } from "react";
import { Pie, DualAxes, Line } from "@ant-design/plots";
import { getLines, getUIItemMenu } from "../../../api/ui/main";
import dayjs from "dayjs";
import {
  exportPQC,
  exportQCHistory,
  exportReportQC,
} from "../../../api/ui/export";
import { baseURL } from "../../../config";
import {
  getErrorDetailList,
  getQualityOverall,
  getTopError,
  getTrendingError,
  recheckQC,
} from "../../../api/ui/quality";

const QualityPQC = (props) => {
  document.title = "UI - PQC";
  const [listLines, setListLines] = useState([]);
  const [listLoSX, setListLoSX] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [selectedLine, setSelectedLine] = useState();
  const [listNameProducts, setListNameProducts] = useState([]);
  const [params, setParams] = useState({ start_date: dayjs(), end_date: dayjs() });
  useEffect(() => {
    (async () => {
      const res1 = await getLines();
      setListLines(
        res1.data.map((e) => {
          return { ...e, label: e.name, value: e.id };
        })
      );
      const res2 = await getUIItemMenu();
      setItemMenu(res2.data);
    })();
    btn_click();
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     var res = await getDataFilterUI({ khach_hang: params.khach_hang });
  //     if (res.success) {
  //       setListNameProducts(
  //         res.data.product.map((e) => {
  //           return { ...e, label: e.name, value: e.id };
  //         })
  //       );
  //       setListLoSX(
  //         Object.values(res.data.lo_sx).map((e) => {
  //           return { label: e, value: e };
  //         })
  //       );
  //     }
  //   })();
  // }, [params.khach_hang]);

  useEffect(() => {
    if (listLines.length > 0) setSelectedLine(listLines[1].id);
  }, [listLines]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [data, setData] = useState();
  const [dataTable2, setDataTable2] = useState();
  const [dataLineChart, setDataLineChart] = useState([]);
  const [dataPieChart, setDataPieChart] = useState([]);
  const [dataPieChart_NG, setDataPieChart_NG] = useState([]);

  const configPieChart = {
    data: dataPieChart,
    height: 100,
    angleField: "value",
    colorField: "name",
    radius: 0.5,
    innerRadius: 0.6,
    label: {
      type: "outer",
      offset: "120%",
      content: ({ name, percent }) =>
        `${name}` + " " + `${(percent * 100).toFixed(0)}%`,
      style: {
        textAlign: "center",
        fontSize: 14,
      },
    },
    legend: false,
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: false,
    },
  };
  const configLineChart = {
    data: dataLineChart,
    height: 100,
    xField: "date",
    yField: "value",
    seriesField: "error",
    legend: {
      position: "top",
    },
    smooth: true,
    animation: {
      appear: {
        animation: "path-in",
        duration: 5000,
      },
    },
  };

  async function btnNG_click(record) {
    const errors = record.errors;
    console.log(errors);
    if (!errors || errors.length <= 0) return;
    else {
      setDataPieChart_NG(
        Object.keys(errors).map((item, i) => {
          return {
            error: errors[item].name,
            value: errors[item].value,
          };
        })
      );
      setDataDetailError([
        ...Object.keys(errors).map((item, i) => {
          return {
            name: errors[item].name,
            value: errors[item].value,
          };
        }),
      ]);
      showModal();
    }
  }
  const [messageApi, contextHolder] = message.useMessage();
  const onChangeChecbox = (e, record) => {
    if (e.target.checked) {
      setSelectedLot(record.lot_id);
    } else {
      setSelectedLot();
    }
  };

  const columnsDetail = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (value, record, index) => index + 1,
      fixed: "left",
    },
    {
      title: "Máy",
      dataIndex: "machine_id",
      key: "machine_id",
      align: "center",
      fixed: "left",
    },
    {
      title: "Khách hàng",
      dataIndex: "khach_hang",
      key: "khach_hang",
      align: "center",
    },
    {
      title: "Đơn hàng",
      dataIndex: "order_id",
      key: "order_id",
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
    },
    {
      title: "Quy cách",
      dataIndex: "quy_cach",
      key: "quy_cach",
      align: "center",
    },
    {
      title: "TG BĐ",
      dataIndex: "thoi_gian_bat_dau",
      key: "thoi_gian_bat_dau",
      align: "center",
    },
    {
      title: "TG KT",
      dataIndex: "thoi_gian_ket_thuc",
      key: "thoi_gian_ket_thuc",
      align: "center",
    },
    {
      title: "Sản lượng đếm được",
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
      title: "Tỷ lệ lỗi",
      dataIndex: "ty_le_loi",
      key: "ty_le_loi",
      align: "center",
    },
    {
      title: "Số phế",
      dataIndex: "sl_phe",
      key: "sl_phe",
      align: "center",
    },
    {
      title: "Tỷ lệ phế",
      dataIndex: "ty_le_ng",
      key: "ty_le_ng",
      align: "center",
    },
    {
      title: "KQ kiểm tra tính năng",
      dataIndex: "sl_tinh_nang",
      key: "sl_tinh_nang",
      align: "center",
    },
    {
      title: "KQ kiểm tra ngoại quan",
      dataIndex: "sl_ngoai_quan",
      key: "sl_ngoai_quan",
      align: "center",
    },
    {
      title: "Phán định",
      dataIndex: "phan_dinh",
      key: "phan_dinh",
      align: "center",
      render: (value, record) =>
        value === 1 ? "OK" : value === 2 ? "NG" : "waiting",
    },
    {
      title: "Cho phép tái kiểm",
      dataIndex: "cho_phep_tai_kiem",
      key: "cho_phep_tai_kiem",
      align: "center",
      render: (value, record) => (
        <Popconfirm
          disabled={record.phan_dinh !== 2}
          title="Tái kiểm"
          description="Cho phép tái kiểm lot này?"
          okText="Có"
          placement="topRight"
          onConfirm={() => recheck(record.id)}
          cancelText="Không"
        >
          <Button disabled={record.phan_dinh !== 2}>Tái kiểm</Button>
        </Popconfirm>
      ),
    },
  ];

  const recheck = async (id) => {
    var res = await recheckQC({ id });
  };
  const [dataDetail, setDataDetail] = useState([]);

  function btn_click() {
    (async () => {
      setLoading(true);
      const res1 = await getErrorDetailList(params);
      setDataDetail(res1.data);
      const res2 = await getQualityOverall(params);
      setSummaryData(res2.data);
      const res3 = await getTopError(params);
      setDataPieChart(
        Object.keys(res3.data ?? {}).map((key) => {
          return res3.data[key];
        })
      );
      const res4 = await getTrendingError(params);
      var line_data = [];
      Object.keys(res4.data ?? {}).map((key) => {
        Object.keys(res4.data[key] ?? {}).map((error_key) => {
          line_data.push({
            date: key,
            error: error_key,
            value: res4.data[key][error_key],
          });
        });
      });
      setDataLineChart(line_data);
      setLoading(false);
    })();
  }

  useEffect(() => {
    if (!data) return;
    setDataTable2(data.table);

    let res_lineChart = [];
    let res_pieChart = {};
    Object.keys(data.chart).forEach(function (key) {
      Object.keys(data.chart[key]).forEach(function (key_c) {
        let data_L = {
          date: key,
          error: key_c,
          value: data.chart[key][key_c],
        };
        res_lineChart.push(data_L);
        if (!res_pieChart[key_c]) {
          res_pieChart[key_c] = data.chart[key][key_c];
        } else res_pieChart[key_c] += data.chart[key][key_c];
      });
    });
    res_pieChart = Object.fromEntries(
      Object.entries(res_pieChart).sort(([, a], [, b]) => b - a)
    );
    let sorted_resPieChart = [];
    let sort_i = 0;
    for (let item in res_pieChart) {
      sorted_resPieChart[item] = res_pieChart[item];
      sort_i++;
      if (sort_i >= 5) break;
    }

    setDataLineChart(res_lineChart);
    setDataPieChart(
      Object.keys(sorted_resPieChart).map((item, i) => {
        return {
          error: item,
          value: sorted_resPieChart[item],
        };
      })
    );
  }, [data]);
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedLot, setSelectedLot] = useState();
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportPQC(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };

  const [loading, setLoading] = useState(false);
  const [columnDetailError, setColumnDetailError] = useState([
    {
      title: "Tên lỗi",
      key: "name",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "Số lượng",
      key: "value",
      dataIndex: "value",
      align: "center",
    },
  ]);
  const [dataDetailError, setDataDetailError] = useState([]);
  const [exportLoading1, setExportLoading1] = useState(false);
  const exportFileDetail = async () => {
    setExportLoading1(true);
    const res = await exportQCHistory(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading1(false);
  };
  const [isModalBCOpen, setIsModalBCOpen] = useState(false);
  const showModalBC = () => {
    setIsModalBCOpen(true);
  };
  const closeModalBC = () => {
    setIsModalBCOpen(false);
  };
  const [formExportReport] = Form.useForm();
  const [exportLoading2, setExportLoading2] = useState(false);
  const exportReport = async (values) => {
    setExportLoading2(true);
    const res = await exportReportQC(values);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading2(false);
  };
  const summaryTable = [
    {
      title: "Sản lượng đếm được",
      key: "san_luong_dem_duoc",
      dataIndex: "san_luong_dem_duoc",
      align: "center",
      render: (value) => value ?? 0,
    },
    {
      title: "Lỗi ngoại quan",
      key: "sl_ngoai_quan",
      dataIndex: "sl_ngoai_quan",
      align: "center",
      render: (value) => value ?? 0,
    },
    {
      title: "Lỗi tính năng",
      key: "sl_tinh_nang",
      dataIndex: "sl_tinh_nang",
      align: "center",
      render: (value) => value ?? 0,
    },
    {
      title: "Tỷ lệ lỗi",
      key: "ti_le_loi",
      dataIndex: "ti_le_loi",
      align: "center",
      render: (value) => value ?? 0,
    },
    {
      title: "Số phế",
      key: "sl_ng",
      dataIndex: "sl_ng",
      align: "center",
      render: (value) => value ?? 0,
    },
    {
      title: "Tỷ lệ phế",
      key: "ti_le_ng",
      dataIndex: "ti_le_ng",
      align: "center",
      render: (value) => value ?? 0,
    },
  ];
  const [summaryData, setSummaryData] = useState([
    {
      san_luong_dem_duoc: 1000,
      sl_ngoai_quan: 10,
      sl_tinh_nang: 5,
      sl_ng: 10,
      ti_le_loi: "2%",
      ti_le_ng: "1%",
    },
  ]);

  const [itemsMenu, setItemMenu] = useState([]);
  const onCheck = (selectedKeys, e) => {
    const filteredKeys = selectedKeys.filter(
      (key) => !itemsMenu.some((e) => e.key === key)
    );
    setParams({ ...params, machine: filteredKeys });
  };
  return (
    <React.Fragment>
      {contextHolder}
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Card
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
                  {/* <RangePicker placeholder={["Bắt đầu", "Kết thúc"]} /> */}
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
                          customer_id: e.target.value,
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
                  <Form.Item label="Lô sản xuất" className="mb-3">
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
          <Row gutter={[8, 8]}>
            <Col span={16}>
              <Card
                title="Biểu đồ xu hướng lỗi"
                style={{ height: "100%", padding: "0px" }}
                bodyStyle={{ padding: 12, height: 100 }}
              >
                <Line {...configLineChart} />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title="5 lỗi công đoạn"
                style={{ height: "100%", padding: "0px" }}
                bodyStyle={{ padding: 12, height: 100 }}
              >
                <Pie {...configPieChart} />
              </Card>
            </Col>
            <Col span={24}>
              <Card
                title="Bảng chi tiết lỗi"
                style={{ height: "100%", padding: "0px" }}
                bodyStyle={{ padding: 12 }}
                extra={
                  <Space>
                    <Button type="primary" onClick={showModalBC}>
                      Báo cáo
                    </Button>
                    <Button
                      type="primary"
                      loading={exportLoading1}
                      onClick={exportFileDetail}
                    >
                      Bảng kiểm tra
                    </Button>
                    <Button
                      type="primary"
                      loading={exportLoading}
                      onClick={exportFile}
                    >
                      Xuất excel
                    </Button>
                  </Space>
                }
              >
                <Spin spinning={loading}>
                  <Table
                    bordered
                    size="small"
                    columns={columnsDetail}
                    dataSource={dataDetail}
                    pagination={false}
                    scroll={{
                      x: "120vw",
                      y: window.innerHeight * 0.35,
                    }}
                  />
                </Spin>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal
        title="Báo cáo"
        open={isModalBCOpen}
        onCancel={closeModalBC}
        okText="Xuất báo cáo"
        cancelText="Huỷ"
        okButtonProps={{ loading: exportLoading2 }}
        onOk={() => formExportReport.submit()}
      >
        <Form
          layout="vertical"
          form={formExportReport}
          onFinish={exportReport}
          initialValues={{
            day: dayjs(),
            week: dayjs(),
            month: dayjs(),
            year: dayjs(),
          }}
        >
          <Form.Item label={"Ngày"} name={"day"} rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }}></DatePicker>
          </Form.Item>
          <Form.Item label={"Tuần"} name={"week"} rules={[{ required: true }]}>
            <DatePicker picker="week" style={{ width: "100%" }}></DatePicker>
          </Form.Item>
          <Form.Item
            label={"Tháng"}
            name={"month"}
            rules={[{ required: true }]}
          >
            <DatePicker picker="month" style={{ width: "100%" }}></DatePicker>
          </Form.Item>
          <Form.Item label={"Năm"} name={"year"} rules={[{ required: true }]}>
            <DatePicker picker="year" style={{ width: "100%" }}></DatePicker>
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default QualityPQC;
