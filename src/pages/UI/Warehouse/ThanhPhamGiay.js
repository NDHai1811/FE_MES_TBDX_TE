import { useState, useEffect } from "react";
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
  Space,
  Spin,
  Dropdown,
  message,
  Input,
  Menu,
  Tabs,
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

const { SubMenu } = Menu;

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

const ThanhPhamGiay = (props) => {
  document.title = "UI - Quản lý thành phẩm giấy";
  const [dataTable, setDataTable] = useState([]);
  const [params, setParams] = useState({ date: [dayjs(), dayjs()] });
  const [listCustomers, setListCustomers] = useState([]);
  const [listIdProducts, setListIdProducts] = useState([]);
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
            <Menu mode="inline" defaultOpenKeys={["sub1"]}>
              <SubMenu key="sub1" title="KHO NGUYÊN VẬT LIỆU">
                <Menu.Item key="1">Kho AB</Menu.Item>
                <Menu.Item key="2">Kho C</Menu.Item>
                <Menu.Item key="3">Kho Dang Dở</Menu.Item>
              </SubMenu>
            </Menu>
            <Menu mode="inline" defaultOpenKeys={["sub2"]}>
              <SubMenu key="sub2" title="KV BÁN THÀNH PHẨM">
                <Menu.Item key="1">KV BTP giấy tấm</Menu.Item>
                <Menu.Item key="2">KV BTP sau in</Menu.Item>
              </SubMenu>
            </Menu>
            <Menu mode="inline" defaultOpenKeys={["sub3"]}>
              <SubMenu key="sub3" title="KHO THÀNH PHẨM">
                <Menu.Item key="1">Kho chờ nhập</Menu.Item>
                <Menu.Item key="2">Kho đã nhập</Menu.Item>
              </SubMenu>
            </Menu>
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
                {/* <Form.Item label="Chức năng truy vấn" className='mb-3'>
                            <Select
                                defaultValue="1"
                                options={[{ value: '1', label: 'Nhập - Xuất - Tồn' },
                                { value: '2', label: 'Nhập' },
                                { value: '3', label: 'Xuất' },
                                { value: '3', label: 'Tồn' },
                                { value: '3', label: 'Tồn lâu' },
                                ]}
                            />
                        </Form.Item> */}
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
                {/* <Form.Item label="Tên sản phẩm" className="mb-3">
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
                </Form.Item> */}
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
            <Row style={{alignItems: 'center'}}>
              <Col span={8}>
                <Row>
                  <Col
                    span={8}
                    style={{
                      color: "black",
                      fontSize: 16,
                      border: "1px solid #000",
                      margin: "10px 0",
                      padding: "10px",
                    }}
                  >
                    Số kg tồn trong kho
                  </Col>
                  <Col
                    span={4}
                    style={{
                      color: "black",
                      fontSize: 16,
                      border: "1px solid #000",
                      borderLeft: "0px",
                      margin: "10px 0",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    100
                  </Col>
                </Row>
                <Row>
                  <Col
                    span={8}
                    style={{
                      color: "black",
                      fontSize: 16,
                      border: "1px solid #000",
                      margin: "10px 0",
                      padding: "10px",
                    }}
                  >
                    Số cuộn tồn trong kho
                  </Col>
                  <Col
                    span={4}
                    style={{
                      color: "black",
                      fontSize: 16,
                      border: "1px solid #000",
                      borderLeft: "0px",
                      margin: "10px 0",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    50
                  </Col>
                </Row>
                <Row>
                  <Col
                    span={8}
                    style={{
                      color: "black",
                      fontSize: 16,
                      border: "1px solid #000",
                      margin: "10px 0",
                      padding: "10px",
                    }}
                  >
                    Số vị trí còn trống trong kho
                  </Col>
                  <Col
                    span={4}
                    style={{
                      color: "black",
                      fontSize: 16,
                      border: "1px solid #000",
                      borderLeft: "0px",
                      margin: "10px 0",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    A01
                  </Col>
                </Row>
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
