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
  getLines,
  getKpi,
  getProducts,
  getCustomers,
  getAllMachine,
  exportKPI,
} from "../../../api/ui/main";
import dayjs from "dayjs";
import { baseURL } from "../../../config";

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

  const [dataChartTiLeNgOQC, setDataChartTiLeNgOQC] = useState([5, 5, 5, 5, 5, 5, 5].map((_, i)=>{
    return {
      date: dayjs('2023-12-05').add(i, 'days').format("D/M"),
      value: Math.floor(Math.random() * 6),
      type: "TL NG OQC",
    }
  }));
  const [dataChartTiLeVanHanhThietBi, setDataChartTiLeVanHanhThietBi] = useState([5, 5, 5, 5, 5, 5, 5].map((_, i)=>{
    return {
      date: dayjs('2023-12-05').add(i, 'days').format("D/M"),
      value: Math.floor(Math.random() * (80 - 50)) + 50,
      type: "TL NG OQC",
    }
  }));
  const [dataChartTiLeDatThang, setDataChartTiLeDatThang] = useState([]);
  const [dataChartNgayTon, setDataChartNgayTon] = useState([]);
  const [dataChartTiLeGiaoHangDungHan, setDataChartTiLeGiaoHangDungHan] = useState([]);
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
        rotate: 0.7
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
        rotate: 0.8
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
        rotate: 0.7
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

  async function btn_click() {
    // const res = await getKpi(params);
    // if (res.success) {
    //   const data = [];
    //   Object.keys(res.data).map((key, index) => {
    //     data.push({
    //       ...res.data[key],
    //       ...res.data[key].data,
    //       last_year: "-",
    //     });
    //   });
    //   console.log(data);
    //   setDataTable(data);

    //   let list1 = [];
    //   Object.keys(res.data.ti_le_sx.data ?? {}).map((key, index) => {
    //     list1.push({
    //       date: dayjs(key, "YYYY-MM-DD").format("D/M"),
    //       value: parseInt(res.data.ti_le_sx.data[key]),
    //       type: "TL Hoàn thành KHSX",
    //     });
    //     list1.push({
    //       date: dayjs(key, "YYYY-MM-DD").format("D/M"),
    //       value: 82,
    //       type: "Tỉ lệ tiêu chuẩn",
    //     });
    //   });
    //   setDataChartTiLeHoanThanhKHSX(list1);
    //   let list2 = [];
    //   Object.keys(res.data.ti_le_dat_thang.data ?? {}).map((key, index) => {
    //     list2.push({
    //       date: dayjs(key, "YYYY-MM-DD").format("D/M"),
    //       value: parseInt(res.data.ti_le_dat_thang.data[key]),
    //       type: "TL Đạt thẳng",
    //     });
    //     list2.push({
    //       date: dayjs(key, "YYYY-MM-DD").format("D/M"),
    //       value: 80,
    //       type: "Tỉ lệ tiêu chuẩn",
    //     });
    //   });
    //   setDataChartTiLeDatThang(list2);
    //   let list3 = [];
    //   Object.keys(res.data.ti_le_ng.data ?? {}).map((key, index) => {
    //     list3.push({
    //       date: dayjs(key, "YYYY-MM-DD").format("D/M"),
    //       value: parseInt(res.data.ti_le_ng.data[key]),
    //       type: "TL NG",
    //     });
    //     list3.push({
    //       date: dayjs(key, "YYYY-MM-DD").format("D/M"),
    //       value: 8,
    //       type: "Tỉ lệ tiêu chuẩn",
    //     });
    //   });
    //   setDataChartTiLeLoiCongDoan(list3);
    //   let list4 = [];
    //   Object.keys(res.data.ti_le_van_hanh_may.data ?? {}).map((key, index) => {
    //     list4.push({
    //       date: dayjs(key, "YYYY-MM-DD").format("D/M"),
    //       value: parseInt(res.data.ti_le_van_hanh_may.data[key]),
    //       type: "TL Vận hành máy",
    //     });
    //     list4.push({
    //       date: dayjs(key, "YYYY-MM-DD").format("D/M"),
    //       value: 75,
    //       type: "Tỉ lệ tiêu chuẩn",
    //     });
    //   });
    //   setDataChartTiLeVanHanhThietBi(list4);
    //   let list5 = [];
    //   Object.keys(res.data.ti_le_giao_hang_dung_han.data ?? {}).map(
    //     (key, index) => {
    //       list5.push({
    //         date: dayjs(key, "YYYY-MM-DD").format("D/M"),
    //         value: parseInt(res.data.ti_le_giao_hang_dung_han.data[key]),
    //         type: "TL Giao hàng đúng hạn",
    //       });
    //       list5.push({
    //         date: dayjs(key, "YYYY-MM-DD").format("D/M"),
    //         value: 100,
    //         type: "Tỉ lệ tiêu chuẩn",
    //       });
    //     }
    //   );
    //   setDataChartTiLeGiaoHangDungHan(list5);
    //   let list6 = [];
    //   Object.keys(res.data.ti_le_ton.data ?? {}).map((key, index) => {
    //     list6.push({
    //       date: dayjs(key, "YYYY-MM-DD").format("D/M"),
    //       value: parseInt(res.data.ti_le_ton.data[key]),
    //       type: "TL ngày tồn",
    //     });
    //     list6.push({
    //       date: dayjs(key, "YYYY-MM-DD").format("D/M"),
    //       value: 90,
    //       type: "Tỉ lệ tiêu chuẩn",
    //     });
    //   });
    //   setDataChartNgayTon(list6);
    //   let list7 = [];
    //   Object.keys(res.data.ti_le_ng_oqc.data ?? {}).map((key, index) => {
    //     list7.push({
    //       date: dayjs(key, "YYYY-MM-DD").format("D/M"),
    //       value: parseInt(res.data.ti_le_ng_oqc.data[key]),
    //       type: "TL NG OQC",
    //     });
    //     list7.push({
    //       date: dayjs(key, "YYYY-MM-DD").format("D/M"),
    //       value: 1,
    //       type: "Tỉ lệ tiêu chuẩn",
    //     });
    //   });
    //   setDataChartTiLeNgOQC(list7);
    //   let list8 = [];
    //   Object.keys(res.data.ti_le_leadtime.data ?? {}).map((key, index) => {
    //     list8.push({
    //       date: dayjs(key, "YYYY-MM-DD").format("D/M"),
    //       value: parseInt(res.data.ti_le_leadtime.data[key]),
    //       type: "TL Leadtime",
    //     });
    //     list8.push({
    //       date: dayjs(key, "YYYY-MM-DD").format("D/M"),
    //       value: 95,
    //       type: "Tỉ lệ tiêu chuẩn",
    //     });
    //   });
    //   setDataChartLeadTime(list8);
    // }
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
        <Col span={3}>
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
        </Col>
        <Col span={21}>
          <Row gutter={[8, 8]}>
            {/* <Row gutter={[8, 8]}> */}
            <Col span={6}>
              <Card
                title="Tỉ lệ hoàn thành kế hoạch"
                style={{ padding: "0px" }}
              >
                <Line {...configTiLeHoanThanhKeHoachSanXuat} />
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Tỉ lệ đạt thẳng" style={{ padding: "0px" }}>
                <Line {...configTiLeDatThang} />
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Tỉ lệ lỗi công đoạn" style={{ padding: "0px" }}>
                <Line {...configTiLeLoiCongDoan} />
              </Card>
            </Col>

            <Col span={6}>
              <Card title="Tỉ lệ vận hành thiết bị" style={{ padding: "0px" }}>
                <Line {...configTiLeVanHanhThietBi} />
              </Card>
            </Col>
            <Col span={6}>
              <Card title="LeadTime" style={{ padding: "0px" }}>
                <Line {...configLeadTime} />
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Tỉ lệ giao hàng đúng hạn" style={{ padding: "0px" }}>
                <Line {...configTiLeGiaoHangDungHan} />
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Ngày tồn" style={{ padding: "0px" }}>
                <Line {...configNgayTon} />
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Tỉ lệ NG OQC" style={{ padding: "0px" }}>
                <Line {...configTiLeNgOQC} />
              </Card>
            </Col>
            {/* </Row> */}
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
