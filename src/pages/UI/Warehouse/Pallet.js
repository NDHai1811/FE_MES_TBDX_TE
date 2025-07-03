import { useEffect, useRef, useState } from "react";
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
  Select,
} from "antd";
import { exportWarehouse, exportWarehouseFGLogs } from "../../../api/ui/export";
import { exportLSXPallet, getLSXPallet, printPallet } from "../../../api/ui/warehouse";
import { baseURL } from "../../../config";
import dayjs from "dayjs";
import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import "../style.scss";
import { PrinterOutlined } from "@ant-design/icons";
import TemPallet from "../../OI/Warehouse/TemPallet";
import { useReactToPrint } from "react-to-print";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

const Pallet = (props) => {
  document.title = "UI - Quản lý tem gộp";
  const componentRef1 = useRef();
  const print = useReactToPrint({
    content: () => componentRef1.current,
  });
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
      title: "Lô SX",
      dataIndex: "lo_sx",
      key: "lo_sx",
      align: "center",
      width: 100,
      render: (value) => value || "-",
    },
    {
      title: "Mã pallet",
      dataIndex: "pallet_id",
      key: "pallet_id",
      align: "center",
      width: 120,
      render: (value) => value || "-",
    },
    {
      title: "Khách hàng",
      dataIndex: "short_name",
      key: "short_name",
      align: "center",
      width: 120,
      render: (value, record, index) => record?.order?.short_name,
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      width: 120,
      render: (value, record, index) => value && dayjs(value).isValid() ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : "",
    },
    {
      title: "MDH",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
      width: 100,
      render: (value) => value || "-",
    },
    {
      title: "MQL",
      dataIndex: "mql",
      key: "mql",
      align: "center",
      width: 50,
      render: (value) => value || "-",
    },
    {
      title: "L",
      dataIndex: "length",
      key: "length",
      align: "center",
      width: 50,
      render: (value) => value || "-",
    },
    {
      title: "W",
      dataIndex: "width",
      key: "width",
      align: "center",
      width: 50,
      render: (value) => value || "-",
    },
    {
      title: "H",
      dataIndex: "height",
      key: "height",
      align: "center",
      width: 50,
      render: (value) => value || "-",
    },
    {
      title: "Kích thước",
      dataIndex: "kich_thuoc",
      key: "kich_thuoc",
      align: "center",
      width: 100,
      render: (value) => value || "-",
    },
    {
      title: "Số lượng",
      dataIndex: "so_luong",
      key: "so_luong",
      align: "center",
      width: 75,
      render: (value) => value || "-",
    },
    {
      title: "Vị trí",
      dataIndex: "locator_id",
      key: "locator_id",
      align: "center",
      width: 80,
      render: (value) => value || "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 120,
      render: (value) => value || "-",
    },
    {
      title: "In tem",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 60,
      render: (_, record) => <PrinterOutlined onClick={()=>handlePrint(record)} style={{fontSize: 16, color: '#1677ff'}}/>,
    },
  ];

  const [palletData, setPalletData] = useState([]);
  const handlePrint = async (record) => {
    var res = await printPallet({pallet_id: record?.pallet_id});
    setPalletData(res.data);
  }

  useEffect(()=>{
    if(palletData.length > 0){
      print();
      setPalletData([]);
    }
  }, [palletData])
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [exportLoading, setExportLoading] = useState(false);
  const loadDataTable = async (params) => {
    setLoading(true);
    const res = await getLSXPallet(params);
    setDataTable(res.data.data);
    setTotalPage(res.data.totalPage)
    setLoading(false);
  }
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportLSXPallet(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
  const [loading, setLoading] = useState(false);
  async function btn_click(page = 1, pz = pageSize) {
    setPage(page);
    setPageSize(pz)
    loadDataTable({ ...params, page, pageSize: pz });
  }
  useEffect(() => {
    btn_click();
  }, [])
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
  const [listLSXPallet, setListLSXPallet] = useState([]);
  const rowSelection = {
    selectedRowKeys: listLSXPallet.map(e => e.id),
    fixed: true,
    onChange: (selectedRowKeys, selectedRows) => {
      setListLSXPallet(selectedRows)
    },
  }
  return (
    <>
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Form layout="vertical" onFinish={() => btn_click()}>
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
                  <Form.Item label="Mã tem (pallet)" className="mb-3">
                    <Input allowClear placeholder="Nhập mã tem (pallet)" onChange={(event) => setParams({ ...params, pallet_id: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="Lô SX" className="mb-3">
                    <Input allowClear placeholder="Nhập lô sx" onChange={(event) => setParams({ ...params, lo_sx: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="Đơn hàng" className="mb-3">
                    <Input allowClear placeholder="Nhập đơn hàng" onChange={(event) => setParams({ ...params, mdh: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="Kích thước" className="mb-3">
                    <Input allowClear placeholder="Nhập kích thước" onChange={(event) => setParams({ ...params, kich_thuoc: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="L" className="mb-3">
                    <Input allowClear placeholder="Nhập L" onChange={(event) => setParams({ ...params, length: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="W" className="mb-3">
                    <Input allowClear placeholder="Nhập W" onChange={(event) => setParams({ ...params, width: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="H" className="mb-3">
                    <Input allowClear placeholder="Nhập H" onChange={(event) => setParams({ ...params, height: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="MQL" className="mb-3">
                    <Input allowClear placeholder="Nhập MQL" onChange={(event) => setParams({ ...params, mql: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="Vị trí" className="mb-3">
                    <Input allowClear placeholder="Nhập mã vị trí" onChange={(event) => setParams({ ...params, locator_id: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="Trạng thái" className="mb-3">
                    <Select placeholder="Chọn trạng thái" allowClear onChange={(value) => setParams({ ...params, status: value })} options={[{ value: 1, label: "Đã nhập kho" }, { value: 0, label: "Chưa nhập kho" }]} />
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
            title="Quản lý tem gộp"
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
                current: page,
                size: "small",
                total: totalPage,
                pageSize: pageSize,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                  btn_click(page, pageSize)
                },
              }}
              scroll={{
                y: tableHeight,
              }}
              //   rowSelection={rowSelection}
              columns={table}
              dataSource={dataTable}
            />
          </Card>
        </Col>
      </Row>
      <div className="report-history-invoice">
        <TemPallet listCheck={[palletData]} ref={componentRef1} />
      </div>
    </>
  );
};

export default withRouter(Pallet);
