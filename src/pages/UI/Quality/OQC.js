import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Layout,
  Radio,
  Row,
  Select,
  AutoComplete,
  Table,
  Tabs,
  Space,
} from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useState, useEffect } from "react";
import { Line } from "@ant-design/plots";
import {
  getErrors,
  getLines,
  getMachineOfLine,
  getCustomers,
  getProducts,
  getStaffs,
  getLoSanXuat,
  getWarehouses,
  getCaSanXuats,
  getOQC,
  getDataFilterUI,
} from "../../../api/ui/main";
import { exportOQC } from "../../../api/ui/export";
import { baseURL } from "../../../config";
import dayjs from "dayjs";

const { Sider } = Layout;
const { RangePicker } = DatePicker;

const columns2 = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    align: "center",
    render: (value, record, index) => index + 1,
  },
  {
    title: "Ngày sx",
    dataIndex: "ngay_sx",
    key: "ngay_sx",
    align: "center",
  },
  {
    title: "Ca Sx",
    dataIndex: "ca_sx",
    key: "ca_sx",
    align: "center",
  },
  {
    title: "Tên SP",
    dataIndex: "ten_sp",
    key: "ten_sp",
    align: "center",
  },
  {
    title: "Khách hàng",
    dataIndex: "khach_hang",
    key: "khach_hang",
    align: "center",
  },
  {
    title: "Mã hàng",
    dataIndex: "product_id",
    key: "product_id",
    align: "center",
  },
  {
    title: "Lô SX",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
  },
  {
    title: "Mã pallet/thùng",
    dataIndex: "lot_id",
    key: "lot_id",
    align: "center",
  },
  {
    title: "Số lượng SX",
    dataIndex: "sl_sx",
    key: "sl_sx",
    align: "center",
  },
  {
    title: "SL lấy mẫu",
    dataIndex: "sl_mau_thu",
    key: "sl_mau_thu",
    align: "center",
  },
  {
    title: "Số lượng NG",
    dataIndex: "sl_ng",
    key: "sl_ng",
    align: "center",
  },
  {
    title: "Loại lỗi",
    dataIndex: "error",
    key: "error",
    align: "center",
  },
  {
    title: "Kết luận",
    dataIndex: "ket_luan",
    key: "ket_luan",
    align: "center",
  },
  {
    title: "OQC",
    dataIndex: "nguoi_oqc",
    key: "nguoi_oqc",
    align: "center",
  },
];
const columns1 = [
  {
    title: "Số Lot KT",
    dataIndex: "lot_check",
    key: "lot_check",
    align: "center",
  },
  {
    title: "Số Lot OK",
    dataIndex: "lot_ok",
    key: "lot_ok",
    align: "center",
  },
  {
    title: "Số Lot NG",
    dataIndex: "lot_ng",
    key: "lot_ng",
    align: "center",
  },
  {
    title: "Tỉ lệ NG",
    dataIndex: "ng_rate",
    key: "ng_rate",
    align: "center",
  },
];

const QualityOQC = (props) => {
  document.title = "UI - OQC";
  const [listLines, setListLines] = useState([]);
  const [listMachines, setListMachines] = useState([]);
  const [listIdProducts, setListIdProducts] = useState([]);
  const [listLoSX, setListLoSX] = useState([]);
  const [listStaffs, setListStaffs] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [listErrors, setListErrors] = useState([]);
  const [listNameProducts, setListNameProducts] = useState([]);
  const [params, setParams] = useState({ date: [dayjs(), dayjs()] });

  const [data, setData] = useState();
  const [dataChart, setDataChart] = useState([]);
  const [dataTable1, setDataTable1] = useState([]);
  const [dataTable2, setDaTaTable2] = useState([]);

  const configChart = {
    data: dataChart,
    height: 150,
    xField: "date",
    yField: "value",
    seriesField: "error",
  };

  useEffect(() => {
    (async () => {
      const res1 = await getLines();
      setListLines(
        res1.data.map((e) => {
          return { ...e, label: e.name, value: e.id };
        })
      );
      const res2 = await getProducts();
      setListIdProducts(
        res2.data.map((e) => {
          return { ...e, label: e.id, value: e.id };
        })
      );
      const res3 = await getLoSanXuat();
      setListLoSX(
        res3.data.map((e) => {
          return { ...e, label: e, value: e };
        })
      );
      const res4 = await getStaffs();
      setListStaffs(
        res4.data.map((e) => {
          return { ...e, label: e.name, value: e.id };
        })
      );

      const res5 = await getCustomers();
      setListCustomers(
        res5.data.map((e) => {
          return { ...e, label: e.name, value: e.id };
        })
      );
      const res6 = await getErrors();
      setListErrors(
        res6.data.map((e) => {
          return { ...e, label: e.name, value: e.id };
        })
      );
    })();
    btn_click();
  }, []);

  useEffect(() => {
    (async () => {
      var res = await getDataFilterUI({ khach_hang: params.khach_hang });
      if (res.success) {
        setListNameProducts(
          res.data.product.map((e) => {
            return { ...e, label: e.name, value: e.id };
          })
        );
        setListLoSX(
          Object.values(res.data.lo_sx).map((e) => {
            return { label: e, value: e };
          })
        );
      }
    })();
  }, [params.khach_hang]);

  async function btn_click() {
    const res = await getOQC(params);
    setData(res.data);
  }
  useEffect(() => {
    if (!data) return;
    setDataTable1([
      {
        lot_check: data.tong_quan?.tong_lot_kt,
        lot_ok: data.tong_quan?.tong_lot_ok,
        lot_ng: data.tong_quan?.tong_lot_ng,
        ng_rate:
          data.tong_quan.tong_lot_kt == 0
            ? 0
            : data.tong_quan.tong_lot_ng / data.tong_quan.tong_lot_kt,
      },
    ]);
    setDataChart(data.chart);
    setDaTaTable2(data.table);
  }, [data]);

  const [exportLoading, setExportLoading] = useState(false);
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportOQC(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };

  return (
    <React.Fragment>
      <Row style={{ padding: "8px", height: "100vh" }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Card style={{ height: "100%" }} bodyStyle={{ paddingInline: 0 }}>
              <Divider>Thời gian truy vấn</Divider>
              <div className="mb-3">
                <Form style={{ margin: "0 15px" }} layout="vertical">
                  {/* <RangePicker placeholder={["Bắt đầu", "Kết thúc"]}/> */}
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
                  <Form.Item label="Khách hàng" className="mb-3">
                    <Select
                      allowClear
                      showSearch
                      placeholder="Chọn khách hàng"
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
                  <Form.Item label="Tên sản phẩm" className="mb-3">
                    <Select
                      allowClear
                      showSearch
                      onChange={(value) => {
                        setParams({ ...params, ten_sp: value });
                      }}
                      placeholder="Nhập tên sản phẩm"
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
                      onChange={(value) => {
                        setParams({ ...params, lo_sx: value });
                      }}
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
          </div>
        </Col>
        <Col span={20}>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Card
                title="Biểu đồ tỉ lệ lỗi"
                style={{ height: "35vh", padding: "0px" }}
                bodyStyle={{ padding: 12 }}
              >
                <Line {...configChart} />
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title={<h6>Bảng tóm tắt</h6>}
                style={{ height: "35vh", padding: "0px" }}
                bodyStyle={{ padding: 12 }}
              >
                <Table
                  bordered
                  pagination={false}
                  columns={columns1}
                  style={{ height: "30px" }}
                  dataSource={dataTable1}
                  size="small"
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card
                title="Chi tiết lỗi"
                style={{ padding: "0px" }}
                bodyStyle={{ padding: 12 }}
                extra={
                  <Button
                    type="primary"
                    loading={exportLoading}
                    onClick={exportFile}
                  >
                    Xuất excel
                  </Button>
                }
              >
                <Table
                  bordered
                  columns={columns2}
                  dataSource={dataTable2}
                  pagination={false}
                  scroll={{
                    x: "120vw",
                    y: "50vh",
                  }}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default QualityOQC;
