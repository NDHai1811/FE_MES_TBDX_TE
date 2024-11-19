import React, { useState, useEffect } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  PlusOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import {
  DatePicker,
  Col,
  Row,
  Card,
  Table,
  Tag,
  Layout,
  Divider,
  Button,
  Form,
  Select,
  AutoComplete,
  Progress,
  Space,
  Tree,
} from "antd";
import "../style.scss";
import { Pie, Column, Line, G2 } from "@ant-design/charts";
import {
  exportKPI,
} from "../../../api/ui/main";
import dayjs from "dayjs";
import { baseURL } from "../../../config";
import TyLeKeHoach from "./Chart/TyLeKeHoachSong";
import { kpiTonKhoNVL, kpiTyLeKeHoach, kpiTyLeKeHoachIn, kpiTyLeLoiMay, kpiTyLeNGPQC, kpiTyLeVanHanh } from "../../../api/ui/kpi";
import TonKhoNVL from "./Chart/TonKhoNVL";
import TyLeNGPQC from "./Chart/TyLeNGPQC";
import TyLeVanHanhThietBi from "./Chart/TyLeVanHanhThietBi";
import TyLeKeHoachSong from "./Chart/TyLeKeHoachSong";
import TyLeKeHoachIn from "./Chart/TyLeKeHoachIn";
import TyLeKeLoiMay from "./Chart/TyLeKeLoiMay";

const { Sider } = Layout;
const { RangePicker } = DatePicker;

const KPI = (props) => {
  document.title = "UI - KPI";
  const [listLines, setListLines] = useState([]);
  const [listMachines, setListMachines] = useState([]);
  const [listIdProducts, setListIdProducts] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [selectedLine, setSelectedLine] = useState();
  const [selectedIdProduct, setSelectedIdProduct] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [params, setParams] = useState({
    start_date: dayjs().subtract(6, "days"),
    end_date: dayjs(),
  });

  const [data, setData] = useState();
  const [dataChartTiLeHoanThanhKHSX, setDataChartTiLeHoanThanhKHSX] = useState(
    []
  );

  const [dataChartTiLeNgOQC, setDataChartTiLeNgOQC] = useState(
    [5, 5, 5, 5, 5, 5, 5].map((_, i) => {
      return {
        date: dayjs("2023-12-05").add(i, "days").format("D/M"),
        value: Math.floor(Math.random() * 6),
        type: "TL NG OQC",
      };
    })
  );
  const [dataChartTiLeVanHanhThietBi, setDataChartTiLeVanHanhThietBi] =
    useState(
      [5, 5, 5, 5, 5, 5, 5].map((_, i) => {
        return {
          date: dayjs("2023-12-05").add(i, "days").format("D/M"),
          value: Math.floor(Math.random() * (80 - 50)) + 50,
          type: "TL NG OQC",
        };
      })
    );
  const [dataChartTiLeDatThang, setDataChartTiLeDatThang] = useState([]);
  const [dataChartNgayTon, setDataChartNgayTon] = useState([]);
  const [dataChartTiLeGiaoHangDungHan, setDataChartTiLeGiaoHangDungHan] =
    useState([]);
  const [dataChartTiLeLoiCongDoan, setDataChartTiLeLoiCongDoan] = useState([]);
  const [dataChartLeadTime, setDataChartLeadTime] = useState([]);

  const [dataTable, setDataTable] = useState([]);
  const [columnsDate, setColumnsDate] = useState([]);
  useEffect(() => {
    const count = params.end_date.diff(params.start_date, "day");
    const colDate = [];
    if (count > 0) {
      for (let i = 0; i <= count; i++) {
        colDate.push({
          title: params.start_date.add(i, "day").format("DD-MM-YYYY"),
          dataIndex: params.start_date.add(i, "day").format("YYYY-MM-DD"),
          key: params.start_date.add(i, "day").format("YYYY-MM-DD"),
          align: "center",
        });
      }
    }
    setColumnsDate(colDate);
  }, [dataTable]);

  const [filtChiSo, setFilterChiSo] = useState([
    {
      text: "Tỉ lệ hoàn thành kế hoạch",
      value: "ti_le_hoan_thanh_ke_hoach",
    },
    {
      text: "Tỉ lệ NG OQC",
      value: "ti_le_ng_oqc",
    },
    {
      text: "Tỉ lệ vận hành thiết bị",
      value: "ti_le_van_hanh_thiet_bi",
    },
  ]);
  const [filtSanPham, setFiltSanPham] = useState([]);

  const columnTable = [
    {
      title: "Tên chỉ số",
      dataIndex: "name",
      key: "name",
      align: "center",
      filterfilters: filtChiSo,
      // filterMode: 'tree',
      filterSearch: true,
    },
    {
      title: "Mục tiêu",
      dataIndex: "target",
      key: "target",
      align: "center",
    },
    {
      title: "Kết quả thực tế",
      align: "center",
      children: columnsDate,
    },
    {
      title: "Tỷ lệ đạt",
      dataIndex: "ty_le_dat",
      key: "ty_le_dat",
      align: "center",
    },
    {
      title: "Tỷ lệ tăng giảm so với cùng kì năm trước",
      dataIndex: "last_year",
      key: "last_year",
      align: "center",
    },
  ];

  const configTiLeHoanThanhKeHoachSanXuat = {
    legend: false,
    data: dataChartTiLeHoanThanhKHSX,
    height: 200,
    xField: "date",
    yField: "value",
    seriesField: "type",
    xAxis: {
      label: {
        autoHide: false,
        rotate: 0.7,
      },
    },
    yAxis: {
      max: 100,
      label: {
        formatter: (v) => v + "%",
      },
    },
  };
  const configTiLeNgOQC = {
    legend: false,
    data: dataChartTiLeNgOQC,
    height: 200,
    xField: "date",
    yField: "value",
    seriesField: "type",
    xAxis: {
      label: {
        autoHide: false,
        rotate: 0.8,
      },
    },
    yAxis: {
      max: 100,
      label: {
        formatter: (v) => v + "%",
      },
    },
  };
  const configTiLeVanHanhThietBi = {
    legend: false,
    data: dataChartTiLeVanHanhThietBi,
    height: 200,
    xField: "date",
    yField: "value",
    seriesField: "type",
    xAxis: {
      label: {
        autoHide: false,
        rotate: 0.7,
      },
    },
    yAxis: {
      max: 100,
      label: {
        formatter: (v) => v + "%",
      },
    },
  };
  const configTiLeDatThang = {
    legend: false,
    data: dataChartTiLeDatThang,
    height: 200,
    xField: "date",
    yField: "value",
    seriesField: "type",
    xAxis: {
      tickCount: 5,
    },
    yAxis: {
      label: {
        formatter: (v) => v + "%",
      },
    },
  };
  const configLeadTime = {
    legend: false,
    data: dataChartLeadTime,
    height: 200,
    xField: "date",
    yField: "value",
    seriesField: "type",
    xAxis: {
      tickCount: 5,
    },
    yAxis: {
      label: {
        formatter: (v) => v + "%",
      },
    },
  };

  const configTiLeLoiCongDoan = {
    legend: false,
    data: dataChartTiLeLoiCongDoan,
    height: 200,
    xField: "date",
    yField: "value",
    seriesField: "type",
    xAxis: {
      tickCount: 5,
    },
    yAxis: {
      label: {
        formatter: (v) => v + "%",
      },
    },
  };
  const configTiLeGiaoHangDungHan = {
    legend: false,
    data: dataChartTiLeGiaoHangDungHan,
    height: 200,
    xField: "date",
    yField: "value",
    seriesField: "type",
    xAxis: {
      tickCount: 5,
    },
    yAxis: {
      label: {
        formatter: (v) => v + "%",
      },
    },
  };
  const configNgayTon = {
    legend: false,
    data: dataChartNgayTon,
    height: 200,
    xField: "date",
    yField: "value",
    seriesField: "type",
    xAxis: {
      tickCount: 5,
    },
    yAxis: {
      label: {
        formatter: (v) => v + "%",
      },
    },
  };

  const [selectedMachines, setSelectedMachines] = useState([]);
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    setTreeData(
      listLines.map((e) => {
        let child = e.machine?.map((i) => {
          return { title: i.name, key: i.id };
        });
        return {
          ...e,
          title: e.name,
          key: e.id,
          children: child,
        };
      })
    );
  }, [listLines]);

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
  };
  const onSelect = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
  };

  useEffect(() => {
    btn_click();
  }, []);

  const [tyLeKeHoachSong, setTyLeKeHoachSong] = useState({ data: {}, loading: false });
  const [tonKhoNVL, setTonKhoNVL] = useState({ data: {}, loading: false });
  const [tyLeNGPQC, setTyleNGPQC] = useState({ data: {}, loading: false });
  const [tyLeVanHanhTB, setTyLeVanHanhTB] = useState({ data: {}, loading: false });
  const [tyLeKeHoachIn, setTyLeKeHoachIn] = useState({ data: {}, loading: false });
  const [tyLeLoiMay, setTyLeLoiMay] = useState({ data: {}, loading: false });
  const fetchChart1 = async () => {
    setTyLeKeHoachSong({ ...tyLeKeHoachSong, loading: true });
    var res = await kpiTyLeKeHoach(params);
    setTyLeKeHoachSong({ data: res.data, loading: false });
  }
  const fetchChart2 = async () => {
    setTonKhoNVL({ ...tonKhoNVL, loading: true });
    var res = await kpiTonKhoNVL(params);
    setTonKhoNVL({ data: res.data, loading: false });
  }
  const fetchChart3 = async () => {
    setTyleNGPQC({ ...tyLeNGPQC, loading: true });
    var res = await kpiTyLeNGPQC(params);
    setTyleNGPQC({ data: res.data, loading: false });
  }
  const fetchChart4 = async () => {
    setTyLeVanHanhTB({ ...tyLeVanHanhTB, loading: true });
    var res = await kpiTyLeVanHanh(params);
    setTyLeVanHanhTB({ data: res.data, loading: false });
  }
  const fetchChart5 = async () => {
    setTyLeKeHoachIn({ ...tyLeKeHoachIn, loading: true });
    var res = await kpiTyLeKeHoachIn(params);
    setTyLeKeHoachIn({ data: res.data, loading: false });
  }
  const fetchChart6 = async () => {
    
  }
  const fetchChart7 = async () => {
    
  }
  const fetchChart8 = async () => {
    setTyLeLoiMay({ ...tyLeLoiMay, loading: true });
    var res = await kpiTyLeLoiMay(params);
    setTyLeLoiMay({ data: res.data, loading: false });
  }
  async function btn_click() {
    fetchChart1();
    fetchChart2();
    fetchChart3();
    fetchChart4();
    fetchChart5();
    fetchChart6();
    fetchChart7();
    fetchChart8();
  }

  const [exportLoading, setExportLoading] = useState(false);
  const exportClick = async () => {
    setExportLoading(true);
    const res = await exportKPI(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
  return (
    <React.Fragment>
      <Row
        gutter={[8, 8]}
        style={{
          padding: "8px",
          height: "100vh",
        }}
      >
        <Col span={4}>
          <div className="slide-bar">
            <Card style={{ height: "100%" }} bodyStyle={{ paddingInline: 0 }}>
              <Divider>Thời gian truy vấn</Divider>
              <Row style={{ margin: "0 15px" }}>
                <Col span={24}>
                  <Form.Item name="start_date">
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <DatePicker
                        allowClear={false}
                        placeholder="Bắt đầu"
                        style={{ width: "100%" }}
                        value={params.start_date}
                        onChange={(value) =>
                          setParams({
                            ...params,
                            start_date: value,
                          })
                        }
                      />
                      <DatePicker
                        allowClear={false}
                        placeholder="Kết thúc"
                        style={{ width: "100%" }}
                        value={params.end_date}
                        onChange={(value) =>
                          setParams({
                            ...params,
                            end_date: value,
                          })
                        }
                      />
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
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
          </div>
        </Col>
        <Col span={20}>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Row gutter={[8, 8]}>
                <Col sm={24} md={12} lg={8} xl={6}>
                  <TyLeKeHoachSong {...tyLeKeHoachSong} />
                </Col>
                <Col sm={24} md={12} lg={8} xl={6}>
                  <TonKhoNVL {...tonKhoNVL} />
                </Col>
                <Col sm={24} md={12} lg={8} xl={6}>
                  <TyLeNGPQC {...tyLeNGPQC} />
                </Col>
                <Col sm={24} md={12} lg={8} xl={6}>
                  <TyLeVanHanhThietBi {...tyLeVanHanhTB} />
                </Col>
                <Col sm={24} md={12} lg={8} xl={6}>
                  <TyLeKeHoachIn {...tyLeKeHoachIn} />
                </Col>
                <Col sm={24} md={12} lg={8} xl={6}>
                  <TyLeKeHoach {...tyLeKeHoachSong} />
                </Col>
                <Col sm={24} md={12} lg={8} xl={6}>
                  <TyLeKeHoach {...tyLeKeHoachSong} />
                </Col>
                <Col sm={24} md={12} lg={8} xl={6}>
                  <TyLeKeLoiMay {...tyLeLoiMay} />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Card
                style={{ height: "100%" }}
                title="Bảng thông tin chi tiết các chỉ số KPI"
                extra={
                  <Button
                    style={{ marginLeft: "15px" }}
                    type="primary"
                    loading={exportLoading}
                    onClick={exportClick}
                  >
                    Xuất Excel
                  </Button>
                }
              >
                <Table
                  size="small"
                  bordered
                  pagination={false}
                  scroll={{
                    x: "200%",
                    y: "50vh",
                  }}
                  columns={columnTable}
                  dataSource={dataTable}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default KPI;
