import { useEffect, useState } from "react";
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
import {
  exportBMCardWarehouse,
  exportSummaryWarehouse,
} from "../../../api";
import { exportWarehouse } from "../../../api/ui/export";
import { baseURL } from "../../../config";
import dayjs from "dayjs";
import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import { getHistoryWareHouseMLT } from "../../../api/ui/warehouse";

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
    title: "Tên NCC",
    dataIndex: "ten_ncc",
    key: "ten_ncc",
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
    title: "FSC",
    dataIndex: "fsc",
    key: "fsc",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Khổ giấy (cm)",
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
    title: "Số kg nhập",
    dataIndex: "so_kg_nhap",
    key: "so_kg_nhap",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Mã vật tư",
    dataIndex: "ma_vat_tu",
    key: "ma_vat_tu",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Ngày nhập",
    dataIndex: "tg_nhap",
    key: "tg_nhap",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Số phiếu nhập kho",
    dataIndex: "so_phieu_nhap_kho",
    key: "kho_giay",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Sl đầu (kg)",
    dataIndex: "sl_dau",
    key: "sl_dau",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Sl xuất (kg)",
    dataIndex: "sl_xuat",
    key: "dinh_luong",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Sl cuối (kg)",
    dataIndex: "sl_cuoi",
    key: "sl_cuoi",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Ngày xuất",
    dataIndex: "tg_xuat",
    key: "tg_xuat",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Số cuộn",
    dataIndex: "so_cuon",
    key: "so_cuon",
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
    dataIndex: "locator_id",
    key: "locator_id",
    align: "center",
    render: (value) => value || "-",
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
  document.title = "UI - Quản lý kho NVL";
  const [dataTable, setDataTable] = useState([]);
  const [params, setParams] = useState({ date: [dayjs(), dayjs()] });
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
    const res = await getHistoryWareHouseMLT(params);
    setDataTable(res);
    setLoading(false);
  }
  useEffect(() => {
    btn_click();
  }, [])
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
                  <Form.Item label="Loại giấy" className="mb-3">
                    <Input placeholder="Nhập loại giấy" />
                  </Form.Item>
                  <Form.Item label="Khổ giấy" className="mb-3">
                    <Input placeholder="Nhập khổ giấy" />
                  </Form.Item>
                  <Form.Item label="Định lượng" className="mb-3">
                    <Input placeholder="Nhập định lượng" />
                  </Form.Item>
                  <Form.Item label="Mã cuộn NCC" className="mb-3">
                    <Input placeholder="Nhập mã cuộn NCC" />
                  </Form.Item>
                  <Form.Item label="Mã vật tư" className="mb-3">
                    <Input placeholder="Nhập mã vật tư" />
                  </Form.Item>
                  <Form.Item label="Ngày nhập" className="mb-3">
                    <DatePicker
                      allowClear={false}
                      placeholder="Ngày nhập"
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        setParams({ ...params, tg_nhap: value })
                      }
                      value={params.tg_nhap}
                      format={COMMON_DATE_FORMAT}
                    />
                  </Form.Item>
                  <Form.Item label="Số phiếu nhập kho" className="mb-3">
                    <Input placeholder="Nhập số phiếu nhập kho" />
                  </Form.Item>
                  <Form.Item label="Số lượng cuối" className="mb-3">
                    <Input placeholder="Nhập số lượng cuối" />
                  </Form.Item>
                  <Form.Item label="Ngày xuất" className="mb-3">
                    <DatePicker
                      allowClear={false}
                      placeholder="Ngày xuất"
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        setParams({ ...params, tg_xuat: value })
                      }
                      value={params.tg_xuat}
                      format={COMMON_DATE_FORMAT}
                    />
                  </Form.Item>
                  <Form.Item label="Số cuộn" className="mb-3">
                    <Input placeholder="Nhập số lượng cuối" />
                  </Form.Item>
                  <Form.Item label="Khu vực" className="mb-3">
                    <Input placeholder="Nhập khu vực" />
                  </Form.Item>
                  <Form.Item label="Vị trí" className="mb-3">
                    <Input placeholder="Nhập vị trí" />
                  </Form.Item>
                </Form>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Card
            title="Quản lý kho NVL"
            style={{ height: "100%" }}
            bodyStyle={{ paddingBottom: 0 }}
            className="custom-card scroll"
            extra={
              <Space>
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
            <Row>
              <Table
                size="small"
                bordered
                pagination={false}
                scroll={{
                  x: "130vw",
                  y: "70vh",
                }}
                columns={table1}
                dataSource={dataTable}
              />
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default KhoNvl;
