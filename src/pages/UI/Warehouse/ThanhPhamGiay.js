import { useState, useEffect } from "react";
import {
  DatePicker,
  Col,
  Row,
  Card,
  Table,
  Divider,
  Button,
  Space,
  Spin,
  Dropdown,
  message,
  Input,
  Tabs,
  Checkbox,
  Collapse,
  Form,
} from "antd";
import { DualAxes } from "@ant-design/charts";
import {
  exportBMCardWarehouse,
  exportSummaryWarehouse,
  getHistoryWareHouse,
} from "../../../api";
import { exportWarehouse } from "../../../api/ui/export";
import { baseURL } from "../../../config";
import dayjs from "dayjs";
import { getCustomers, getDataFilterUI } from "../../../api/ui/main";

const { Panel } = Collapse;

const dataDualAxes = [
  { time: "A1", value: 10 },
  { time: "A2", value: 12 },
  { time: "A3", value: 8 },
  { time: "A4", value: 15 },
  { time: "A5", value: 9 },
  { time: "A6", value: 13 },
  { time: "A7", value: 14 },
  { time: "A8", value: 12 },
  { time: "A9", value: 10 },
  { time: "A10", value: 12 },
];

const config = {
  data: [dataDualAxes, dataDualAxes],
  xField: "time",
  yField: ["value", "value"],
  geometryOptions: [{ geometry: "column" }, { geometry: "line", smooth: true }],
  yAxis: {
    value: {
      min: 0,
      max: 14,
    },
  },
  legend: false,
};

const col_detailTable = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    render: (value, record, index) => index + 1,
    align: "center",
  },
  {
    title: "Kho",
    dataIndex: "ngay",
    key: "ngay",
    align: "center",
  },
  {
    title: "Vị trí",
    dataIndex: "ma_khach_hang",
    key: "ma_khach_hang",
    align: "center",
  },
  {
    title: "Tên NCC",
    dataIndex: "ten_khach_hang",
    key: "ten_khach_hang",
    align: "center",
  },
  {
    title: "Mã cuộn NCC",
    dataIndex: "product_id",
    key: "product_id",
    align: "center",
  },
  {
    title: "Mã cuộn TBDX",
    dataIndex: "ten_san_pham",
    key: "name_product",
    align: "center",
  },
  {
    title: "Loại giấy",
    dataIndex: "dvt",
    key: "dvt",
    align: "center",
  },
  {
    title: "Khổ",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
  },
  {
    title: "Định lượng",
    dataIndex: "kho",
    key: "kho",
    align: "center",
  },
  {
    title: "SL nhập",
    dataIndex: "lot_id",
    key: "lot_id",
    align: "center",
  },
  {
    title: "Người nhập",
    dataIndex: "vi_tri",
    key: "vi_tri",
    align: "center",
  },
  {
    title: "Tình trạng",
    dataIndex: "note",
    key: "note",
    align: "center",
  },
];

const tabItems = [
  {
    key: 1,
    label: "Nhập dữ liệu nhập kho",
  },
  {
    key: 2,
    label: "Kết quả QC/In tem",
  },
  {
    key: 3,
    label: "Kết quả truy vân",
  },
];

const mockDataTable = [
  {
    so_kg_ton_kho: "100",
    so_cuon_ton_kho: "50",
    so_vi_tri_trong: "5",
  },
];

const columns = [
  {
    title: "Số kg tồn trong kho",
    dataIndex: "so_kg_ton_kho",
    key: "so_kg_ton_kho",
    align: "center",
  },
  {
    title: "Số cuộn tồn trong kho",
    dataIndex: "so_cuon_ton_kho",
    key: "so_cuon_ton_kho",
    align: "center",
  },
  {
    title: "Số vị trí còn trống trong kho",
    dataIndex: "so_vi_tri_trong",
    key: "so_vi_tri_trong",
    align: "center",
  },
];

const ThanhPhamGiay = (props) => {
  document.title = "UI - Quản lý thành phẩm giấy";
  const [dataTable, setDataTable] = useState([]);
  const [params, setParams] = useState({ date: [dayjs(), dayjs()] });
  const [listCustomers, setListCustomers] = useState([]);
  // const [listIdProducts, setListIdProducts] = useState([]);
  const [listNameProducts, setListNameProducts] = useState([]);
  const [listLoSX, setListLoSX] = useState([]);
  useEffect(() => {
    (async () => {
      var res1 = await getCustomers();
      setListCustomers(
        res1.data.map((e) => {
          return { ...e, label: e.name, value: e.id };
        })
      );
      // var res2 = await getProducts();
      // setListIdProducts(res2.data.map(e => {
      //     return { ...e, label: e.id, value: e.id }
      // }));
      // setListNameProducts(res2.data.map(e => {
      //     return { ...e, label: e.name, value: e.id }
      // }));
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

  const [exportLoading, setExportLoading] = useState(false);
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportWarehouse(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
  async function btn_click() {
    setLoading(false);
    const res = await getHistoryWareHouse(params);
    setDataTable(res);
    setLoading(false);
  }
  const [loading, setLoading] = useState(false);
  const [exportLoading1, setExportLoading1] = useState(false);
  const items = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={exportImportWarehouse}
        >
          Tổng hợp xuất nhập tồn
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={exportBMcard}>
          BM thẻ kho
        </a>
      ),
    },
  ];
  const [messageApi, contextHolder] = message.useMessage();
  async function exportImportWarehouse() {
    setExportLoading1(true);
    var res = await exportSummaryWarehouse(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading1(false);
  }
  async function exportBMcard() {
    if (!params.ten_sp) {
      messageApi.warning("Hãy chọn sản phẩm trước");
    } else {
      setExportLoading1(true);
      var res = await exportBMCardWarehouse(params);
      if (res.success) {
        window.location.href = baseURL + res.data;
      }
      setExportLoading1(false);
    }
  }
  return (
    <>
      {contextHolder}
      <Row style={{ padding: "8px", height: "90vh" }} gutter={[8, 8]}>
        <Col span={3}>
          <Card style={{ height: "100%" }} bodyStyle={{ paddingInline: 0 }}>
            <Collapse defaultActiveKey={["1", "2", "3"]}>
              <Panel header="KHO NGUYÊN VẬT LIỆU" key="1">
                <Checkbox.Group style={{ width: "100%", display: "block" }}>
                  <Checkbox value="Kho AB" style={{ width: "100%" }}>
                    Kho AB
                  </Checkbox>
                  <Checkbox value="Kho C" style={{ width: "100%" }}>
                    Kho C
                  </Checkbox>
                  <Checkbox value="Kho Dang Dở" style={{ width: "100%" }}>
                    Kho Dang Dở
                  </Checkbox>
                </Checkbox.Group>
              </Panel>
              <Panel header="KV BÁN THÀNH PHẨM" key="2">
                <Checkbox.Group style={{ width: "100%", display: "block" }}>
                  <Checkbox value="KV BTP giấy tấm" style={{ width: "100%" }}>
                    KV BTP giấy tấm
                  </Checkbox>
                  <Checkbox value="KV BTP sau in" style={{ width: "100%" }}>
                    KV BTP sau in
                  </Checkbox>
                </Checkbox.Group>
              </Panel>
              <Panel header="KHO THÀNH PHẨM" key="3">
                <Checkbox.Group style={{ width: "100%", display: "block" }}>
                  <Checkbox value="Kho chờ nhập" style={{ width: "100%" }}>
                    Kho chờ nhập
                  </Checkbox>
                  <Checkbox value="Kho đã nhập" style={{ width: "100%" }}>
                    Kho đã nhập
                  </Checkbox>
                </Checkbox.Group>
              </Panel>
            </Collapse>
            <Divider>Thời gian truy vấn</Divider>
            <div className="mb-3">
              <Form style={{ margin: "0 15px" }} layout="vertical">
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
                <Form.Item label="Mã cuộn TBDX" className="mb-3">
                  <Input placeholder="Nhập mã cuộn TBDX" />
                </Form.Item>
                <Form.Item label="Mã cuộn NCC" className="mb-3">
                  <Input placeholder="Nhập mã cuộn NCC" />
                </Form.Item>
                <Form.Item label="Tên NCC" className="mb-3">
                  <Input placeholder="Nhập tên NCC" />
                </Form.Item>
                <Form.Item label="Loại giấy" className="mb-3">
                  <Input placeholder="Nhập loại giấy" />
                </Form.Item>
                <Form.Item label="Người nhập" className="mb-3">
                  <Input placeholder="Nhập tên người nhập" />
                </Form.Item>
                <Form.Item label="Tình trạng" className="mb-3">
                  <Input placeholder="Nhập tình trạng" />
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
                onClick={btn_click}
                style={{ width: "80%" }}
              >
                Tìm kiếm
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={21}>
          <Card
            style={{ height: "100%" }}
            extra={
              <Space>
                <Dropdown menu={{ items }}>
                  <Button type="primary" loading={exportLoading1}>
                    Nhập từ excel
                  </Button>
                </Dropdown>
                <Button
                  type="primary"
                  loading={exportLoading}
                  onClick={exportFile}
                >
                  Xuất kết quả
                </Button>
              </Space>
            }
          >
            <Row style={{ alignItems: "flex-end" }}>
              <Col span={8}>
                <Table
                  columns={columns}
                  dataSource={mockDataTable}
                  pagination={false}
                  bordered
                  style={{ marginRight: 12, marginBottom: 20 }}
                />
              </Col>
              <Col span={16}>
                <DualAxes {...config} />
              </Col>
            </Row>
            <Tabs
              className="mb-3"
              defaultActiveKey={1}
              items={tabItems}
              destroyInactiveTabPane={true}
            />
            <Spin spinning={loading}>
              <Table
                size="small"
                bordered
                pagination={false}
                scroll={{
                  x: "130vw",
                  y: "80vh",
                }}
                columns={col_detailTable}
                dataSource={dataTable}
              />
            </Spin>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ThanhPhamGiay;
