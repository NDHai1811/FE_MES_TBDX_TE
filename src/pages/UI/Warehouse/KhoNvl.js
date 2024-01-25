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
  time: `C${i + 1}`,
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
    title: "Số kg tồn trong kho",
    value: 18902,
  },
  {
    title: "Số cuộn tồn trong kho",
    value: 3023,
  },
  {
    title: "Số vị trí còn trống trong kho",
    value: 30,
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
    title: "Tên nhà cung cấp",
    dataIndex: "ten_ncc",
    key: "ten_ncc",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Mã cuộn NCC",
    dataIndex: "ma_cuon_ncc",
    key: "ma_cuon_ncc",
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
    title: "Loại giấy",
    dataIndex: "loai_giay",
    key: "loai_giay",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Khổ",
    dataIndex: "kho_giay",
    key: "kho_giay",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Định lượng",
    dataIndex: "dinh_luong",
    key: "dinh_luong",
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
        title: "Đầu sóng",
        dataIndex: "dau_song",
        key: "dau_song",
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

const KhoNvl = (props) => {
  document.title = "UI - Quản lý thành phẩm giấy";
  const [dataTable, setDataTable] = useState([]);
  const [params, setParams] = useState({ date: [dayjs(), dayjs()] });

  const dataTable1 = [
    {
      kho: "Nguyên vật liệu",
      khu_vuc: "C11",
      vi_tri: "C11.1",
      ngay: "10/12/2023",
      ten_ncc: "Minh Hưng",
      ma_cuon_ncc: "23-1001",
      khach_hang: "AN PHUOC GROUP",
      loai_giay: "MH",
      kho_giay: "150",
      dinh_luong: "130",
      tg_nhap: "10/12/2023",
      sl_nhap: "1200",
      nguoi_nhap: "Trần Văn Quý",
      ngay_xuat: "11/12/2023",
      sl_xuat: "600",
      dau_song: "sC",
      nguoi_xuat: "Trần Văn Quý",
      sl_ton: "600",
      so_ngay_ton: "2",
    },
    {
      kho: "Nguyên vật liệu",
      khu_vuc: "C11",
      vi_tri: "C11.2",
      ngay: "10/12/2023",
      ten_ncc: "Minh Hưng",
      ma_cuon_ncc: "23-1123",
      khach_hang: "AN PHUOC GROUP",
      loai_giay: "MH",
      kho_giay: "150",
      dinh_luong: "130",
      tg_nhap: "10/12/2023",
      sl_nhap: "1500",
      nguoi_nhap: "Trần Văn Quý",
      ngay_xuat: "11/12/2023",
      sl_xuat: "800",
      dau_song: "sB",
      nguoi_xuat: "Trần Văn Quý",
      sl_ton: "700",
      so_ngay_ton: "2",
    },
    {
      kho: "Nguyên vật liệu",
      khu_vuc: "C11",
      vi_tri: "C11.3",
      ngay: "10/12/2023",
      ten_ncc: "Minh Hưng",
      ma_cuon_ncc: "23-1021",
      khach_hang: "AN PHUOC GROUP",
      loai_giay: "MH",
      kho_giay: "150",
      dinh_luong: "130",
      tg_nhap: "10/12/2023",
      sl_nhap: "1600",
      nguoi_nhap: "Trần Văn Quý",
      ngay_xuat: "11/12/2023",
      sl_xuat: "700",
      dau_song: "sC",
      nguoi_xuat: "Trần Văn Quý",
      sl_ton: "900",
      so_ngay_ton: "2",
    },
    {
      kho: "Nguyên vật liệu",
      khu_vuc: "C11",
      vi_tri: "C11.11",
      ngay: "10/12/2023",
      ten_ncc: "Minh Hưng",
      ma_cuon_ncc: "23-1222",
      khach_hang: "AN PHUOC GROUP",
      loai_giay: "MH",
      kho_giay: "150",
      dinh_luong: "130",
      tg_nhap: "10/12/2023",
      sl_nhap: "2000",
      nguoi_nhap: "Trần Văn Quý",
      ngay_xuat: "11/12/2023",
      sl_xuat: "1000",
      dau_song: "lC",
      nguoi_xuat: "Trần Văn Quý",
      sl_ton: "1000",
      so_ngay_ton: "2",
    },
    {
      kho: "Nguyên vật liệu",
      khu_vuc: "C11",
      vi_tri: "C11.22",
      ngay: "10/12/2023",
      ten_ncc: "Minh Hưng",
      ma_cuon_ncc: "23-1112",
      khach_hang: "AN PHUOC GROUP",
      loai_giay: "MH",
      kho_giay: "150",
      dinh_luong: "130",
      tg_nhap: "10/12/2023",
      sl_nhap: "1900",
      nguoi_nhap: "Trần Văn Quý",
      ngay_xuat: "11/12/2023",
      sl_xuat: "900",
      dau_song: "lC",
      nguoi_xuat: "Trần Văn Quý",
      sl_ton: "1000",
      so_ngay_ton: "2",
    },
    {
      kho: "Nguyên vật liệu",
      khu_vuc: "C11",
      vi_tri: "C11.34",
      ngay: "10/12/2023",
      ten_ncc: "Minh Hưng",
      ma_cuon_ncc: "23-2991",
      khach_hang: "AN PHUOC GROUP",
      loai_giay: "MH",
      kho_giay: "150",
      dinh_luong: "130",
      tg_nhap: "10/12/2023",
      sl_nhap: "1600",
      nguoi_nhap: "Trần Văn Quý",
      ngay_xuat: "11/12/2023",
      sl_xuat: "1000",
      dau_song: "sB",
      nguoi_xuat: "Trần Văn Quý",
      sl_ton: "600",
      so_ngay_ton: "2",
    },
    {
      kho: "Nguyên vật liệu",
      khu_vuc: "C11",
      vi_tri: "C11.12",
      ngay: "10/12/2023",
      ten_ncc: "Minh Hưng",
      ma_cuon_ncc: "23-2321",
      khach_hang: "AN PHUOC GROUP",
      loai_giay: "MH",
      kho_giay: "150",
      dinh_luong: "130",
      tg_nhap: "10/12/2023",
      sl_nhap: "1200",
      nguoi_nhap: "Trần Văn Quý",
      ngay_xuat: "11/12/2023",
      sl_xuat: "600",
      dau_song: "F",
      nguoi_xuat: "Trần Văn Quý",
      sl_ton: "600",
      so_ngay_ton: "2",
    },
    {
      kho: "Nguyên vật liệu",
      khu_vuc: "C11",
      vi_tri: "C11.22",
      ngay: "10/12/2023",
      ten_ncc: "Minh Hưng",
      ma_cuon_ncc: "23-1230",
      khach_hang: "AN PHUOC GROUP",
      loai_giay: "MH",
      kho_giay: "150",
      dinh_luong: "130",
      tg_nhap: "10/12/2023",
      sl_nhap: "1200",
      nguoi_nhap: "Trần Văn Quý",
      ngay_xuat: "11/12/2023",
      sl_xuat: "600",
      dau_song: "sB",
      nguoi_xuat: "Trần Văn Quý",
      sl_ton: "600",
      so_ngay_ton: "2",
    },
    {
      kho: "Nguyên vật liệu",
      khu_vuc: "C11",
      vi_tri: "C11.15",
      ngay: "10/12/2023",
      ten_ncc: "Minh Hưng",
      ma_cuon_ncc: "23-1104",
      khach_hang: "AN PHUOC GROUP",
      loai_giay: "MH",
      kho_giay: "150",
      dinh_luong: "130",
      tg_nhap: "10/12/2023",
      sl_nhap: "1200",
      nguoi_nhap: "Trần Văn Quý",
      ngay_xuat: "11/12/2023",
      sl_xuat: "600",
      dau_song: "lC",
      nguoi_xuat: "Trần Văn Quý",
      sl_ton: "600",
      so_ngay_ton: "2",
    },
    {
      kho: "Nguyên vật liệu",
      khu_vuc: "C11",
      vi_tri: "C11.17",
      ngay: "10/12/2023",
      ten_ncc: "Minh Hưng",
      ma_cuon_ncc: "23-2003",
      khach_hang: "AN PHUOC GROUP",
      loai_giay: "MH",
      kho_giay: "150",
      dinh_luong: "130",
      tg_nhap: "10/12/2023",
      sl_nhap: "1200",
      nguoi_nhap: "Trần Văn Quý",
      ngay_xuat: "11/12/2023",
      sl_xuat: "600",
      dau_song: "sB",
      nguoi_xuat: "Trần Văn Quý",
      sl_ton: "600",
      so_ngay_ton: "2",
    },
    {
      kho: "Nguyên vật liệu",
      khu_vuc: "C11",
      vi_tri: "C11.11",
      ngay: "10/12/2023",
      ten_ncc: "Minh Hưng",
      ma_cuon_ncc: "23-1123",
      khach_hang: "AN PHUOC GROUP",
      loai_giay: "MH",
      kho_giay: "150",
      dinh_luong: "130",
      tg_nhap: "10/12/2023",
      sl_nhap: "1200",
      nguoi_nhap: "Trần Văn Quý",
      ngay_xuat: "11/12/2023",
      sl_xuat: "600",
      dau_song: "F",
      nguoi_xuat: "Trần Văn Quý",
      sl_ton: "600",
      so_ngay_ton: "2",
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
                    Tìm kiếm
                  </Button>
                </div>,
              ]}
            >
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
                  <Form.Item label="Mã cuộn TBDX" className="mb-3">
                    <Input placeholder="Nhập mã cuộn TBDX" />
                  </Form.Item>
                  <Form.Item label="Tên NCC" className="mb-3">
                    <Input placeholder="Nhập tên NCC" />
                  </Form.Item>
                  <Form.Item label="Mã cuộn NCC" className="mb-3">
                    <Input placeholder="Nhập mã cuộn NCC" />
                  </Form.Item>
                  <Form.Item label="Loại giấy" className="mb-3">
                    <Input placeholder="Nhập loại giấy" />
                  </Form.Item>
                </Form>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Card
            style={{ height: "100%" }}
            bodyStyle={{ paddingBottom: 0 }}
            className="custom-card scroll"
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

export default KhoNvl;
