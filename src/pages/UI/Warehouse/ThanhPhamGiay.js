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
  Slider,
} from "antd";
import { exportWarehouse, exportWarehouseFGLogs } from "../../../api/ui/export";
import { getHistoryWareHouseFG, updateExportFGLog } from "../../../api/ui/warehouse";
import { baseURL } from "../../../config";
import dayjs from "dayjs";
import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import "../style.scss";
import EditableTable from "../../../components/Table/EditableTable";

const ThanhPhamGiay = (props) => {
  document.title = "UI - Quản lý thành phẩm giấy";
  const [dataTable, setDataTable] = useState([]);
  const table = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (value, record, index) => ((page - 1) * pageSize) + index + 1,
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
      width: 70,
      render: (value) => value || "-",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "khach_hang",
      key: "khach_hang",
      align: "center",
      fixed: 'left',
      width: 150,
      render: (value) => value || "-",
    },
    {
      title: "Đơn hàng",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
      fixed: 'left',
      width: 70,
      render: (value) => value || "-",
    },
    {
      title: "MQL",
      dataIndex: "mql",
      key: "mql",
      align: "center",
      fixed: 'left',
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
      width: 120,
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
          width: 70,
          render: (value) => value || "-",
        },
        {
          title: "Số ngày tồn",
          dataIndex: "so_ngay_ton",
          key: "so_ngay_ton",
          align: "center",
          width: 100,
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
          width: 100,
          render: (value) => (value && dayjs(value).format('DD/MM/YYYY')) || "-",
        },
        {
          title: "TG nhập",
          dataIndex: "tg_nhap",
          key: "tg_nhap",
          align: "center",
          width: 150,
          render: (value) => (value && dayjs(value).format('HH:mm')) || "-",
        },
        {
          title: "SL nhập",
          dataIndex: "sl_nhap",
          key: "sl_nhap",
          align: "center",
          width: 100,
          render: (value) => value || "-",
        },
        {
          title: "Nhập dư",
          dataIndex: "nhap_du",
          key: "nhap_du",
          align: "center",
          width: 80,
          render: (value) => value || "-",
        },
        {
          title: "Người nhập",
          dataIndex: "nguoi_nhap",
          key: "nguoi_nhap",
          align: "center",
          width: 150,
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
          width: 150,
          render: (value) => (value && dayjs(value).format('DD/MM/YYYY')) || "-",
          editable: true,
          inputType: 'date'
        },
        {
          title: "TG xuất",
          dataIndex: "tg_xuat",
          key: "tg_xuat",
          align: "center",
          width: 100,
          render: (value) => (value && dayjs(value).format('HH:mm')) || "-",
          editable: true,
          inputType: 'time'
        },
        {
          title: "SL xuất",
          dataIndex: "sl_xuat",
          key: "sl_xuat",
          align: "center",
          width: 70,
          render: (value) => value || "-",
          editable: true,
        },
        {
          title: "Người xuất",
          dataIndex: "nguoi_xuat",
          key: "nguoi_xuat",
          align: "center",
          width: 150,
          render: (value) => value || "-",
        },
      ],
      editable: true
    },
    {
      title: "Vị trí",
      dataIndex: "vi_tri",
      key: "vi_tri",
      align: "center",
      width: 70,
      render: (value) => value || "-",
    },
    {
      title: "Mã tem (pallet)",
      dataIndex: "pallet_id",
      key: "pallet_id",
      align: "center",
      width: 150,
      render: (value) => value || "-",
    },
    {
      title: "Lô SX",
      dataIndex: "lo_sx",
      key: "lo_sx",
      align: "center",
      width: 150,
      render: (value) => value || "-",
    },
  ];
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [exportLoading, setExportLoading] = useState(false);
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportWarehouseFGLogs({ ...formSearch.getFieldsValue(true)});
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
  const [loading, setLoading] = useState(false);
  async function btn_click(page = 1, newPageSize = pageSize) {
    setPage(page);
    setPageSize(newPageSize);
    loadData({ ...formSearch.getFieldsValue(true), page, pageSize: newPageSize });
  }
  const loadData = async (params) => {
    setLoading(true);
    const res = await getHistoryWareHouseFG(params);
    setDataTable(res.data.map(e => ({
      ...e,
      tg_xuat: (e.tg_xuat && dayjs(e.tg_xuat)) || null
    })));
    setTotalPage(res?.totalPage ?? 1);
    setLoading(false);
  }
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
  // const formSubmition = () => {
  //   console.log(params);
  //   params.page === 1 ? btn_click() : setParams({ ...params, page: 1 });
  // }

  const onUpdate = async (rowData) => {
    //update sl_xuat only
    console.log(rowData);
    if (!rowData.sl_xuat || isNaN(rowData.sl_xuat)) {
      message.warning('Số lượng xuất phải là số');
      return false;
    }
    var res = await updateExportFGLog(rowData);
    btn_click();
  }

  const [formSearch] = Form.useForm();
  return (
    <>
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Form layout="vertical" form={formSearch} initialValues={{
              start_date: dayjs(),
              end_date: dayjs(),
            }} onFinish={() => btn_click()} onKeyPress={(e) => {
              if (e.key === "Enter") {
                btn_click();
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
                <Form.Item label="Bắt đầu" className="mb-3" name={"start_date"}>
                  <DatePicker
                    allowClear={false}
                    placeholder="Bắt đầu"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item label="Kết thúc" className="mb-3" name={"end_date"}>
                  <DatePicker
                    allowClear={false}
                    placeholder="Kết thúc"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Divider>Điều kiện truy vấn</Divider>
                <div className="mb-3">
                  <Form.Item label="Vị trí" className="mb-3" name={"locator_id"}>
                    <Input placeholder="Nhập mã vị trí" />
                  </Form.Item>
                  <Form.Item label="Mã tem (pallet)" className="mb-3" name={"pallet_id"}>
                    <Input placeholder="Nhập mã tem (pallet)" />
                  </Form.Item>
                  <Form.Item label="Lô SX" className="mb-3" name={"lo_sx"}>
                    <Input placeholder="Nhập lô sx" />
                  </Form.Item>
                  <Form.Item label="Khách hàng" className="mb-3" name={"khach_hang"}>
                    <Input placeholder="Nhập mã kh" />
                  </Form.Item>
                  <Form.Item label="Đơn hàng" className="mb-3" name={"mdh"}>
                    <Input placeholder="Nhập đơn hàng" />
                  </Form.Item>
                  <Form.Item label="MQL" className="mb-3" name={"mql"}>
                    <Input placeholder="Nhập MQL" />
                  </Form.Item>
                  <Form.Item label="Kích thước" className="mb-3" name={"kich_thuoc"}>
                    <Input placeholder="Nhập kích thước" />
                  </Form.Item>
                  <Form.Item label="L" className="mb-3" name={"length"}>
                    <Input placeholder="Nhập L" />
                  </Form.Item>
                  <Form.Item label="W" className="mb-3" name={"width"}>
                    <Input placeholder="Nhập W" />
                  </Form.Item>
                  <Form.Item label="H" className="mb-3" name={"height"}>
                    <Input placeholder="Nhập H" />
                  </Form.Item>
                  {/* <Form.Item label="SL tồn" className="mb-3" name={"sl_ton"} >
                    <Slider min={0} max={999} range onChange={(value)=>formSearch.setFieldsValue({ sl_ton_min: value[0], sl_ton_max: value[1] })}/>
                  </Form.Item>
                  <Form.Item label="Số ngày tồn" className="mb-3" name={"so_ngay_ton"} >
                    <Slider  min={0} max={999} range onChange={(value)=>formSearch.setFieldsValue({ so_ngay_ton_min: value[0], so_ngay_ton_max: value[1] })}/>
                  </Form.Item> */}
                  <Form.Item label="SL tồn min" className="mb-3" name={"sl_ton_min"}>
                    <Input placeholder="Nhập SL tồn min" />
                  </Form.Item>
                  <Form.Item label="SL tồn max" className="mb-3" name={"sl_ton_max"}>
                    <Input placeholder="Nhập SL tồn max" />
                  </Form.Item>
                  <Form.Item label="Số ngày tồn min" className="mb-3" name={"so_ngay_ton_min"}>
                    <Input placeholder="Nhập SL tồn min" />
                  </Form.Item>
                  <Form.Item label="Số ngày tồn max" className="mb-3" name={"so_ngay_ton_max"}>
                    <Input placeholder="Nhập SL tồn max" />
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
            <EditableTable
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
                  var targetPage = Math.ceil(totalPage / pageSize);
                  if(page > targetPage){
                    btn_click(targetPage, pageSize);
                  }else{
                    btn_click(page, pageSize);
                  }
                },
              }}
              scroll={{
                x: "1800px",
                y: tableHeight,
              }}
              columns={table}
              dataSource={dataTable}
              setDataSource={setDataTable}
              onUpdate={onUpdate}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ThanhPhamGiay;
