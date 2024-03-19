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
import { exportWarehouse, exportWarehouseFGLogs } from "../../../api/ui/export";
import { getHistoryWareHouseFG } from "../../../api/ui/warehouse";
import { baseURL } from "../../../config";
import dayjs from "dayjs";
import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import "../style.scss";

const ThanhPhamGiay = (props) => {
  document.title = "UI - Quản lý thành phẩm giấy";
  const [dataTable, setDataTable] = useState([]);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 20,
    start_date: dayjs(),
    end_date: dayjs(),
    totalPage: 1
  });
  const table = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (value, record, index) => ((params.page - 1) * params.pageSize) + index + 1,
      align: "center",
      fixed: 'left',
      width: 50
    },
    {
      title: "Khu vực",
      dataIndex: "khu_vuc",
      key: "khu_vuc",
      align: "center",
      fixed: 'left',
      render: (value) => value || "-",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "khach_hang",
      key: "khach_hang",
      align: "center",
      fixed: 'left',
      render: (value) => value || "-",
    },
    {
      title: "Đơn hàng",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
      fixed: 'left',
      render: (value) => value || "-",
    },
    {
      title: "MQL",
      dataIndex: "mql",
      key: "mql",
      align: "center",
      fixed: 'left',
      render: (value) => value || "-",
    },
    {
      title: "L",
      dataIndex: "length",
      key: "length",
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "W",
      dataIndex: "width",
      key: "width",
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "H",
      dataIndex: "height",
      key: "height",
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "Kích thước",
      dataIndex: "kich_thuoc",
      key: "kich_thuoc",
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "Tồn kho",
      children: [
        {
          title: "Sl tồn",
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
    {
      title: "Nhập kho",
      children: [
        {
          title: "Ngày nhập",
          dataIndex: "tg_nhap",
          key: "tg_nhap",
          align: "center",
          render: (value) => value || "-",
        },
        {
          title: "TG nhập",
          dataIndex: "tg_nhap",
          key: "tg_nhap",
          align: "center",
          render: (value) => (value && dayjs(value).format('HH:mm')) || "-",
        },
        {
          title: "SL nhập",
          dataIndex: "sl_nhap",
          key: "sl_nhap",
          align: "center",
          render: (value) => value || "-",
        },
        {
          title: "Nhập dư",
          dataIndex: "nhap_du",
          key: "nhap_du",
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
          dataIndex: "tg_xuat",
          key: "tg_xuat",
          align: "center",
          render: (value) => value || "-",
        },
        {
          title: "TG xuất",
          dataIndex: "tg_xuat",
          key: "tg_xuat",
          align: "center",
          render: (value) => (value && dayjs(value).format('HH:mm')) || "-",
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
      title: "Vị trí",
      dataIndex: "vi_tri",
      key: "vi_tri",
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
      title: "Lô SX",
      dataIndex: "lo_sx",
      key: "lo_sx",
      align: "center",
      render: (value) => value || "-",
    },
  ];
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [exportLoading, setExportLoading] = useState(false);
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportWarehouseFGLogs(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
  const [loading, setLoading] = useState(false);
  async function btn_click() {
    setLoading(true);
    const res = await getHistoryWareHouseFG(params);
    setDataTable(res.data);
    setParams({ ...params, totalPage: res.totalPage })
    setLoading(false);
  }
  useEffect(() => {
    btn_click();
  }, [params.page, params.pageSize]);
  const header = document.querySelector('.custom-card .ant-table-header');
  const pagination = document.querySelector('.custom-card .ant-pagination');
  const card = document.querySelector('.custom-card .ant-card-body');
  const [tableHeight, setTableHeight] = useState((card?.offsetHeight ?? 0) - 48 - (header?.offsetHeight ?? 0) - (pagination?.offsetHeight ?? 0));
  useEffect(() => {
    const handleWindowResize = () => {
      const header = document.querySelector('.custom-card .ant-table-header');
      const pagination = document.querySelector('.custom-card .ant-pagination');
      const card = document.querySelector('.custom-card .ant-card-body');
      setTableHeight((card?.offsetHeight ?? 0) - 48 - (header?.offsetHeight ?? 0) - (pagination?.offsetHeight ?? 0));
    };
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [dataTable]);
  const formSubmition = () => {
    console.log(params);
    params.page === 1 ? btn_click() : setParams({ ...params, page: 1 });
  }
  return (
    <>
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Form layout="vertical" onFinish={() => formSubmition()} onKeyPress={(e) => {
              if (e.key === "Enter") {
                formSubmition();
              }
            }}>
              <Card
                style={{ height: "100%" }}
                bodyStyle={{ paddingInline: 15, paddingTop: 0 }}
                className="custom-card scroll"
                actions={[
                  <div layout="vertical">
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "80%" }}
                    >
                      Tìm kiếm
                    </Button>
                  </div>,
                ]}
              >
                <Divider>Thời gian truy vấn</Divider>
                <div className="mb-3">
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
                </div>
                <Divider>Điều kiện truy vấn</Divider>
                <div className="mb-3">
                  <Form.Item label="Vị trí" className="mb-3">
                    <Input placeholder="Nhập mã vị trí" onChange={(event) => setParams({ ...params, locator_id: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="Mã tem (pallet)" className="mb-3">
                    <Input placeholder="Nhập mã tem (pallet)" onChange={(event) => setParams({ ...params, pallet_id: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="Lô SX" className="mb-3">
                    <Input placeholder="Nhập lô sx" onChange={(event) => setParams({ ...params, lo_sx: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="Khách hàng" className="mb-3">
                    <Input placeholder="Nhập mã kh" onChange={(event) => setParams({ ...params, khach_hang: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="Đơn hàng" className="mb-3">
                    <Input placeholder="Nhập đơn hàng" onChange={(event) => setParams({ ...params, mdh: event.target.value })} />
                  </Form.Item>
                </div>
              </Card>
            </Form>
          </div>
        </Col>
        <Col span={20}>
          <Card
            style={{ height: "100%" }}
            bodyStyle={{ paddingBottom: 0 }}
            className="custom-card"
            title="Quản lý kho thành phẩm"
            extra={
              <Space>
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
            <Table
              size="small"
              bordered
              loading={loading}
              pagination={{
                current: params.page,
                size: "small",
                total: params.totalPage,
                pageSize: params.pageSize,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                  setPage(page);
                  setPageSize(pageSize);
                  setParams({ ...params, page: page, pageSize: pageSize });
                },
              }}
              scroll={{
                x: "130vw",
                y: tableHeight,
              }}
              columns={table}
              dataSource={dataTable}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ThanhPhamGiay;
