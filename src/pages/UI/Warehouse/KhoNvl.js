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
import { exportWarehouse, exportWarehouseMLTLogs } from "../../../api/ui/export";
import { baseURL } from "../../../config";
import dayjs from "dayjs";
import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import { getHistoryWareHouseMLT } from "../../../api/ui/warehouse";

const KhoNvl = (props) => {
  document.title = "UI - Quản lý kho NVL";
  const [dataTable, setDataTable] = useState([]);
  const [params, setParams] = useState();
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [exportLoading, setExportLoading] = useState(false);
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportWarehouseMLTLogs((form.getFieldsValue(true)));
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
  async function btn_click() {
    setLoading(true);
    const res = await getHistoryWareHouseMLT({...form.getFieldsValue(true), ...params});
    setDataTable(res.data);
    setTotalPage(res.totalPage);
    setLoading(false);
  }
  useEffect(() => {
    btn_click();
  }, [params])
  const table1 = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (value, record, index) => ((page - 1) * pageSize) + index + 1,
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
      dataIndex: "so_kg_dau",
      key: "so_kg_dau",
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
      dataIndex: "so_kg_cuoi",
      key: "so_kg_cuoi",
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
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  
  return (
    <>
      {contextHolder}
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
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
                    htmlType="submit"
                    style={{ width: "80%" }}
                    onClick={btn_click}
                  >
                    Tìm kiếm
                  </Button>
                </div>,
              ]}
            >
              {/* <Divider>Thời gian truy vấn</Divider> */}
              {/* <div className="mb-3">
                <Form style={{ margin: "0 15px" }} layout="vertical">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <DatePicker
                      allowClear={false}
                      placeholder="Bắt đầu"
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        setParams({ ...params, start_date: value })
                      }
                      value={params.start_date}
                      format={COMMON_DATE_FORMAT}
                    />
                    <DatePicker
                      allowClear={false}
                      placeholder="Kết thúc"
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        setParams({ ...params, end_date: value })
                      }
                      value={params.end_date}
                      format={COMMON_DATE_FORMAT}
                    />
                  </Space>
                </Form>
              </div> */}
              <Divider>Điều kiện truy vấn</Divider>
              <div className="mb-3">
                <Form style={{ margin: "0 15px" }} layout="vertical" form={form} onFinish={btn_click}>
                  <Form.Item label="Loại giấy" className="mb-3" name={"loai_giay"}>
                    <Input allowClear placeholder="Nhập loại giấy" onChange={(event) => form.setFieldsValue({ ...form.getFieldsValue(true), loai_giay: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="Khổ giấy" className="mb-3" name={"kho_giay"}>
                    <Input allowClear placeholder="Nhập khổ giấy" onChange={(event) => form.setFieldsValue({ ...form.getFieldsValue(true), kho_giay: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="Định lượng" className="mb-3" name={"dinh_luong"}>
                    <Input allowClear placeholder="Nhập định lượng" onChange={(event) => form.setFieldsValue({ ...form.getFieldsValue(true), dinh_luong: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="Mã cuộn NCC" className="mb-3" name={"ma_cuon_ncc"}>
                    <Input allowClear placeholder="Nhập mã cuộn NCC" onChange={(event) => form.setFieldsValue({ ...form.getFieldsValue(true), ma_cuon_ncc: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="Mã vật tư" className="mb-3" name={"ma_vat_tu"}>
                    <Input allowClear placeholder="Nhập mã vật tư" onChange={(event) => form.setFieldsValue({ ...form.getFieldsValue(true), ma_vat_tu: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="Ngày nhập" className="mb-3" name={"tg_nhap"}>
                    <DatePicker
                      allowClear={true}
                      placeholder="Ngày nhập"
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        form.setFieldsValue({ ...form.getFieldsValue(true), tg_nhap: value })
                      }
                      format={COMMON_DATE_FORMAT}
                    />
                  </Form.Item>
                  <Form.Item label="Số phiếu nhập kho" className="mb-3" name={"goods_receipt_note_id"}>
                    <Input allowClear placeholder="Nhập số phiếu nhập kho" onChange={(event) => form.setFieldsValue({ ...form.getFieldsValue(true), goods_receipt_note_id: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="Số lượng cuối" className="mb-3" name={"so_kg"}>
                    <Input allowClear placeholder="Nhập số lượng cuối" onChange={(event) => form.setFieldsValue({ ...form.getFieldsValue(true), so_kg: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="Ngày xuất" className="mb-3" name={"tg_xuat"}>
                    <DatePicker
                      allowClear={true}
                      placeholder="Ngày xuất"
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        form.setFieldsValue({ ...form.getFieldsValue(true), tg_xuat: value })
                      }
                      format={COMMON_DATE_FORMAT}
                    />
                  </Form.Item>
                  <Form.Item label="Số cuộn" className="mb-3" name={"so_cuon"}>
                    <Input allowClear placeholder="Nhập cuộn" onChange={(event) => form.setFieldsValue({ ...form.getFieldsValue(true), so_cuon: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="Khu vực" className="mb-3" name={"khu_vuc"}>
                    <Input allowClear placeholder="Nhập khu vực" onChange={(event) => form.setFieldsValue({ ...form.getFieldsValue(true), khu_vuc: event.target.value })} />
                  </Form.Item>
                  <Form.Item label="Vị trí" className="mb-3" name={"locator_id"}>
                    <Input allowClear placeholder="Nhập vị trí" onChange={(event) => form.setFieldsValue({ ...form.getFieldsValue(true), locator_id: event.target.value })} />
                  </Form.Item>
                  <Button hidden htmlType="submit"></Button>
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
                pagination={{
                  current: page,
                  size: "small",
                  total: totalPage,
                  showSizeChanger: true,
                  onChange: (page, pageSize) => {
                    setPage(page);
                    setPageSize(pageSize);
                    setParams({ ...params, page: page, pageSize: pageSize });
                  },
                }}
                loading={loading}
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
