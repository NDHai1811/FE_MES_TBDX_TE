import { useState } from "react";
import {
  DatePicker,
  Col,
  Row,
  Card,
  Table,
  Divider,
  Button,
  Space,
  Dropdown,
  message,
  Input,
  Form,
  Tree,
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
import { COMMON_DATE_FORMAT } from "../../../commons/constants";

const dataDualAxes = Array.from({ length: 18 }, (_, i) => ({
  time: `F01.${i + 1}`,
  value: Math.floor(Math.random() * 14),
}));

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

const mockDataTable1 = [
  {
    title: "Số lot tồn trong kho",
    value: 407,
  },
  {
    title: "Số pallet tồn trong kho",
    value: 256,
  },
  {
    title: "Số vị trí còn trống trong kho",
    value: 145,
  },
];

const columns1 = [
  {
    title: "Tiêu đề",
    dataIndex: "title",
    key: "title",
    align: "center",
    rowScope: "row",
  },
  {
    title: "Số lượng",
    dataIndex: "value",
    key: "value",
    align: "center",
  },
];

const table1 = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    render: (value, record, index) => index + 1,
    align: "center",
  },
  {
    title: "Kho",
    dataIndex: "kho",
    key: "kho",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Khu vực",
    dataIndex: "khu_vuc",
    key: "khu_vuc",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Vị trí",
    dataIndex: "vi_tri",
    key: "vi_tri",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Ngày",
    dataIndex: "ngay",
    key: "ngay",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Mã tem (pallet)",
    dataIndex: "pallet_id",
    key: "pallet_id",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Mã Lot",
    dataIndex: "lot_id",
    key: "lot_id",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Tên khách hàng",
    dataIndex: "khach_hang",
    key: "khach_hang",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Đơn hàng",
    dataIndex: "don_hang",
    key: "don_hang",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Nhập kho",
    children: [
      {
        title: "Thời gian nhập",
        dataIndex: "tg_nhap",
        key: "tg_nhap",
        align: "center",
        render: (value) => value || "-",
      },
      {
        title: "SL nhập",
        dataIndex: "sl_nhap",
        key: "sl_nhap",
        align: "center",
        render: (value) => value || "-",
      },
      {
        title: "Người nhập",
        dataIndex: "nguoi_nhap",
        key: "nguoi_nhap",
        align: "center",
        render: (value) => value || "-",
      },
    ],
  },
  {
    title: "Xuất kho",
    children: [
      {
        title: "Ngày xuất",
        dataIndex: "ngay_xuat",
        key: "ngay_xuat",
        align: "center",
        render: (value) => value || "-",
      },
      {
        title: "SL xuất",
        dataIndex: "sl_xuat",
        key: "sl_xuat",
        align: "center",
        render: (value) => value || "-",
      },
      {
        title: "Người xuất",
        dataIndex: "nguoi_xuat",
        key: "nguoi_xuat",
        align: "center",
        render: (value) => value || "-",
      },
    ],
  },
  {
    title: "Tồn kho",
    children: [
      {
        title: "SL tồn",
        dataIndex: "sl_ton",
        key: "sl_ton",
        align: "center",
        render: (value) => value || "-",
      },
      {
        title: "Số ngày tồn",
        dataIndex: "so_ngay_ton",
        key: "so_ngay_ton",
        align: "center",
        render: (value) => value || "-",
      },
    ],
  },
];

const itemsMenu = [
  {
    title: "Kho nguyên vật liệu",
    key: "0-0",
    children: [
      {
        title: "Kho A",
        key: "0-1",
      },
      {
        title: "Kho B",
        key: "0-2",
      },
      {
        title: "Kho dở dang",
        key: "0-3",
      },
    ],
  },
  {
    title: "KV bán thành phẩm",
    key: "1-0",
    children: [
      {
        title: "KV BTP giấy tấm",
        key: "1-1",
      },
      {
        title: "KV BTP sau in",
        key: "1-2",
      },
    ],
  },
  {
    title: "Kho thành phẩm",
    key: "2-0",
    children: [
      {
        title: "Kho chờ nhập",
        key: "2-1",
      },
      {
        title: "Kho đã nhập",
        key: "2-2",
      },
    ],
  },
];

const ThanhPhamGiay = (props) => {
  document.title = "UI - Quản lý thành phẩm giấy";
  const [dataTable, setDataTable] = useState([]);
  const [params, setParams] = useState({ date: [dayjs(), dayjs()] });

  const dataTable1 = [
    {
      kho: 'Kho thành phẩm',
      khu_vuc: 'F01',
      vi_tri: 'F01.01',
      ngay: '10/12/2023',
      pallet_id: 'pl231211.01',
      lot_id: '231211001',
      khach_hang: 'CÔNG TY AN PHÁT',
      don_hang: '133/12',
      tg_nhap: '10/12/2023',
      sl_nhap: '1200',
      nguoi_nhap: 'Trần Văn Quý',
      ngay_xuat: '11/12/2023',
      sl_xuat: '600',
      dau_song: 'sC',
      nguoi_xuat: 'Trần Văn Quý',
      sl_ton: '600',
      so_ngay_ton: '2',
  
    },
    {
      kho: 'Kho thành phẩm',
      khu_vuc: 'F01',
      vi_tri: 'F01.02',
      ngay: '10/12/2023',
      pallet_id: 'pl231211.02',
      lot_id: '231211001',
      khach_hang: 'CÔNG TY AN PHÁT',
      don_hang: '143/12',
      tg_nhap: '10/12/2023',
      sl_nhap: '1800',
      nguoi_nhap: 'Trần Văn Quý',
      ngay_xuat: '11/12/2023',
      sl_xuat: '600',
      dau_song: 'sC',
      nguoi_xuat: 'Trần Văn Quý',
      sl_ton: '1200',
      so_ngay_ton: '2',
  
    },
    {
      kho: 'Kho thành phẩm',
      khu_vuc: 'F01',
      vi_tri: 'F01.03',
      ngay: '10/12/2023',
      pallet_id: 'pl231211.03',
      lot_id: '231211001',
      khach_hang: 'CÔNG TY AN PHÁT',
      don_hang: '32/12',
      tg_nhap: '10/12/2023',
      sl_nhap: '800',
      nguoi_nhap: 'Trần Văn Quý',
      ngay_xuat: '11/12/2023',
      sl_xuat: '600',
      dau_song: 'sC',
      nguoi_xuat: 'Trần Văn Quý',
      sl_ton: '200',
      so_ngay_ton: '2',
  
    },
    {
      kho: 'Kho thành phẩm',
      khu_vuc: 'F01',
      vi_tri: 'F01.04',
      ngay: '10/12/2023',
      pallet_id: 'pl231211.04',
      lot_id: '231211001',
      khach_hang: 'CÔNG TY AN PHÁT',
      don_hang: '142/12',
      tg_nhap: '10/12/2023',
      sl_nhap: '400',
      nguoi_nhap: 'Trần Văn Quý',
      ngay_xuat: '11/12/2023',
      sl_xuat: '100',
      dau_song: 'sC',
      nguoi_xuat: 'Trần Văn Quý',
      sl_ton: '300',
      so_ngay_ton: '2',
  
    },
    {
      kho: 'Kho thành phẩm',
      khu_vuc: 'F01',
      vi_tri: 'F01.05',
      ngay: '10/12/2023',
      pallet_id: 'pl231211.05',
      lot_id: '231211001',
      khach_hang: 'CÔNG TY AN PHÁT',
      don_hang: '111/12',
      tg_nhap: '10/12/2023',
      sl_nhap: '1700',
      nguoi_nhap: 'Trần Văn Quý',
      ngay_xuat: '11/12/2023',
      sl_xuat: '700',
      dau_song: 'sC',
      nguoi_xuat: 'Trần Văn Quý',
      sl_ton: '1000',
      so_ngay_ton: '2',
  
    },
    {
      kho: 'Kho thành phẩm',
      khu_vuc: 'F01',
      vi_tri: 'F01.12',
      ngay: '10/12/2023',
      pallet_id: 'pl231211.08',
      lot_id: '231211001',
      khach_hang: 'CÔNG TY AN PHÁT',
      don_hang: '127/12',
      tg_nhap: '10/12/2023',
      sl_nhap: '1900',
      nguoi_nhap: 'Trần Văn Quý',
      ngay_xuat: '11/12/2023',
      sl_xuat: '700',
      dau_song: 'sC',
      nguoi_xuat: 'Trần Văn Quý',
      sl_ton: '1200',
      so_ngay_ton: '2',
  
    },
    {
      kho: 'Kho thành phẩm',
      khu_vuc: 'F01',
      vi_tri: 'F01.22',
      ngay: '10/12/2023',
      pallet_id: 'pl231211.09',
      lot_id: '231211001',
      khach_hang: 'CÔNG TY AN PHÁT',
      don_hang: '112/12',
      tg_nhap: '10/12/2023',
      sl_nhap: '2000',
      nguoi_nhap: 'Trần Văn Quý',
      ngay_xuat: '11/12/2023',
      sl_xuat: '600',
      dau_song: 'sC',
      nguoi_xuat: 'Trần Văn Quý',
      sl_ton: '1400',
      so_ngay_ton: '2',
  
    },
    {
      kho: 'Kho thành phẩm',
      khu_vuc: 'F01',
      vi_tri: 'F01.30',
      ngay: '10/12/2023',
      pallet_id: 'pl231211.10',
      lot_id: '231211001',
      khach_hang: 'CÔNG TY AN PHÁT',
      don_hang: '33/12',
      tg_nhap: '10/12/2023',
      sl_nhap: '1700',
      nguoi_nhap: 'Trần Văn Quý',
      ngay_xuat: '11/12/2023',
      sl_xuat: '700',
      dau_song: 'sC',
      nguoi_xuat: 'Trần Văn Quý',
      sl_ton: '1000',
      so_ngay_ton: '2',
  
    },
    {
      kho: 'Kho thành phẩm',
      khu_vuc: 'F01',
      vi_tri: 'F01.21',
      ngay: '10/12/2023',
      pallet_id: 'pl231211.13',
      lot_id: '231211001',
      khach_hang: 'CÔNG TY AN PHÁT',
      don_hang: '155/12',
      tg_nhap: '10/12/2023',
      sl_nhap: '1200',
      nguoi_nhap: 'Trần Văn Quý',
      ngay_xuat: '11/12/2023',
      sl_xuat: '600',
      dau_song: 'sC',
      nguoi_xuat: 'Trần Văn Quý',
      sl_ton: '600',
      so_ngay_ton: '2',
  
    },
    {
      kho: 'Kho thành phẩm',
      khu_vuc: 'F01',
      vi_tri: 'F01.12',
      ngay: '10/12/2023',
      pallet_id: 'pl231211.15',
      lot_id: '231211001',
      khach_hang: 'CÔNG TY AN PHÁT',
      don_hang: '233/12',
      tg_nhap: '10/12/2023',
      sl_nhap: '1200',
      nguoi_nhap: 'Trần Văn Quý',
      ngay_xuat: '11/12/2023',
      sl_xuat: '600',
      dau_song: 'sC',
      nguoi_xuat: 'Trần Văn Quý',
      sl_ton: '600',
      so_ngay_ton: '2',
    },

  ];
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

  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };
  const onCheck = (checkedKeys, info) => {
    console.log("onCheck", checkedKeys, info);
  };

  return (
    <>
      {contextHolder}
      <Row style={{ padding: "8px", height: "90vh" }} gutter={[8, 8]}>
        <Col span={4}>
          <Card
            style={{ height: "100%" }}
            bodyStyle={{ paddingInline: 0, paddingTop: 0 }}
          >
            <Divider>Tổ chức</Divider>
            <Tree
              checkable
              defaultExpandedKeys={["0-0-0", "0-0-1"]}
              defaultSelectedKeys={["0-0-0", "0-0-1"]}
              defaultCheckedKeys={["0-0-0", "0-0-1"]}
              onSelect={onSelect}
              onCheck={onCheck}
              treeData={itemsMenu}
              style={{ maxHeight: "80px", overflowY: "auto" }}
            />
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
                    format={COMMON_DATE_FORMAT}
                  />
                  <DatePicker
                    allowClear={false}
                    placeholder="Kết thúc"
                    style={{ width: "100%" }}
                    onChange={(value) =>
                      setParams({ ...params, date: [params.date[0], value] })
                    }
                    value={params.date[1]}
                    format={COMMON_DATE_FORMAT}
                  />
                </Space>
              </Form>
            </div>
            <Divider>Điều kiện truy vấn</Divider>
            <div className="mb-3">
              <Form style={{ margin: "0 15px" }} layout="vertical">
                <Form.Item label="Vị trí" className="mb-3">
                  <Input placeholder="Nhập mã vị trí" />
                </Form.Item>
                <Form.Item label="Mã tem (pallet)" className="mb-3">
                  <Input placeholder="Nhập mã tem (pallet)" />
                </Form.Item>
                <Form.Item label="Số Lot" className="mb-3">
                  <Input placeholder="Nhập số lot" />
                </Form.Item>
                <Form.Item label="Tên khách hàng" className="mb-3">
                  <Input placeholder="Nhập tên kh" />
                </Form.Item>
                <Form.Item label="Đơn hàng" className="mb-3">
                  <Input placeholder="Nhập đơn hàng" />
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
        <Col span={20}>
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
            <Row style={{ alignItems: "flex-end" }} gutter={16}>
              <Col span={8}>
                <Table
                  columns={columns1}
                  dataSource={mockDataTable1}
                  pagination={false}
                  bordered
                  showHeader={false}
                  className="custom-height-table"
                />
              </Col>
              <Col span={16}>
                <DualAxes {...config} />
              </Col>
            </Row>
            <Row className="mt-5">
              <Table
                size="small"
                bordered
                pagination={false}
                scroll={{
                  x: "130vw",
                  y: "80vh",
                }}
                columns={table1}
                dataSource={dataTable1}
              />
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ThanhPhamGiay;
