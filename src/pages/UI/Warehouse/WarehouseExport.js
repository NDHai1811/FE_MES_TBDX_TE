import {
  Col,
  Row,
  Card,
  Table,
  Divider,
  Button,
  Form,
  Input,
  Upload,
  message,
  Space,
  Spin,
  Popconfirm,
  Typography,
  Select,
  InputNumber,
  DatePicker,
  Modal,
  Tabs,
  Badge,
  Collapse,
  ConfigProvider,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useEffect } from "react";
import {
  createWareHouseExport,
  deleteBuyers,
  getOrders,
  getUsers,
  getVehicles,
} from "../../../api";
import "../style.scss";
import dayjs from "dayjs";
import { DeleteOutlined, DownOutlined, EditOutlined, UpOutlined } from "@ant-design/icons";
import { createWareHouseFGExport, exportWarehouseExportNote, exportWarehouseFGDeliveryNote, getWarehouseFGExportList, updateWarehouseFGExport, warehouseExportLogList } from "../../../api/ui/warehouse";
import { useProfile } from "../../../components/hooks/UserHooks";
import { getCustomers } from "../../../api/ui/main";
import EditableTable from "../../../components/Table/EditableTable";

const WarehouseExport = () => {
  document.title = "Quản lý xuất kho";
  const [listCheck, setListCheck] = useState([]);
  const [openMdl, setOpenMdl] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 20,
    start_date: dayjs(),
    end_date: dayjs(),
  });
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [data, setData] = useState([]);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [type, setType] = useState("");
  const [keys, setKeys] = useState([
    "id",
    "ngay_xuat",
    "customer_id",
    "mdh",
    "mql",
    "so_luong",
    "tai_xe",
    "so_xe",
    "nguoi_xuat",
  ]);
  const [listVehicles, setListVehicles] = useState([]);
  const [listUsers, setListUsers] = useState([]);


  const col_detailTable = [
    {
      title: "Ngày xuất",
      dataIndex: "ngay_xuat",
      key: "ngay_xuat",
      align: "center",
      render: (value, item) => dayjs(value).format('DD/MM/YYYY')
    },
    {
      title: "Thời gian xuất",
      dataIndex: "thoi_gian_xuat",
      key: "thoi_gian_xuat",
      align: "center",
      render: (value, item) => dayjs(item.ngay_xuat).format('HH:mm:ss')
    },
    {
      title: "Khách hàng",
      dataIndex: "customer_id",
      key: "customer_id",
      align: "center",
    },
    {
      title: "Vị trí",
      dataIndex: "locator_id",
      key: "locator_id",
      align: "center",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
    },
    {
      title: "Mã quản lý",
      dataIndex: "mql",
      key: "mql",
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "so_luong",
      key: "so_luong_dh",
      align: "center",
    },
    {
      title: "Mã pallet",
      dataIndex: "pallet_id",
      key: "pallet_id",
      align: "center",
      editable: true,
    },
    {
      title: "Lô SX",
      dataIndex: "lo_sx",
      key: "lo_sx",
      align: "center",
      editable: true,
    },
    {
      title: "FAC",
      dataIndex: "xuong_giao",
      key: "xuong_giao",
      align: "center",
    },
  ];

  const [messageApi, contextHolder] = message.useMessage();

  function btn_click() {
    loadListTable();
  }

  useEffect(() => {
    btn_click();
  }, [page, pageSize])

  const loadListTable = async () => {
    setListCheck([])
    setLoading(true);
    const res = await warehouseExportLogList(params);
    setData(
      [...res.data].map((e) => {
        return { ...e, key: e.id };
      })
    );
    setTotalPage(res.totalPage)
    setLoading(false);
  };
  const [listCustomers, setListCustomers] = useState([]);
  useEffect(()=>{
    (async ()=>{
      const res3 = await getCustomers();
      setListCustomers(res3.data);
    })()
  }, [])
  const exportFile = async () => {
    if (listCheck.length <= 0) {
      messageApi.warning('Vui lòng chọn lô cần xuất');
      return 0;
    }
    if (!params.customer_id) {
      messageApi.warning('Vui lòng chọn lọc theo 01 khách hàng duy nhất');
      return 0;
    }
    const customers = [...new Set(data.filter(e => listCheck.includes(e.id)).map(e => e.customer_id))];
    console.log(customers);
    if (customers.length !== 1) {
      messageApi.warning('Vui lòng chọn lọc theo 01 khách hàng duy nhất');
      return 0;
    }
    setExportLoading(true);
    const res = await exportWarehouseFGDeliveryNote({ids: listCheck, customer_id: params.customer_id});
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };

  const rowSelection = {
    fixed: true,
    selectedRowKeys: listCheck,
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys);
    },
    optionFilterProp: 'label',
  };
  
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
  }, [data]);
  return (
    <>
      {contextHolder}
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Card
              style={{ height: "100%" }}
              bodyStyle={{ padding: 0 }}
              className="custom-card scroll"
              actions={[
                <div
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
              ]}
            >
              <Divider>Tìm kiếm</Divider>
              <div className="mb-3">
                <Form
                  style={{ margin: "0 15px" }}
                  layout="vertical"
                >
                  <Form.Item label="Thòi gian bắt đầu" className="mb-3">
                    <DatePicker
                      allowClear={false}
                      placeholder="Bắt đầu"
                      style={{ width: "100%" }}
                      onChange={(value) => {
                        setParams({ ...params, start_date: value, page: 1 });
                        setPage(1);
                      }
                      }
                      value={params.start_date}
                    />
                  </Form.Item>
                  <Form.Item label="Thời gian kết thúc" className="mb-3">
                    <DatePicker
                      allowClear={false}
                      placeholder="Kết thúc"
                      style={{ width: "100%" }}
                      onChange={(value) => {
                        setParams({ ...params, end_date: value, page: 1 });
                        setPage(1);
                      }
                      }
                      value={params.end_date}
                    />
                  </Form.Item>
                  <Form.Item label="Khách hàng" className="mb-3">
                    <Select
                      allowClear
                      showSearch
                      onChange={(value) =>
                        setParams({ ...params, customer_id: value })
                      }
                      optionFilterProp="label"
                      options={listCustomers}
                      placeholder="Chọn khách hàng"
                    />
                  </Form.Item>
                  <Form.Item label="Mã đơn hàng" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, mdh: e.target.value })
                      }
                      placeholder="Nhập mã đơn hàng"
                    />
                  </Form.Item>
                  <Form.Item label="Mã quản lý" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, mql: e.target.value })
                      }
                      placeholder="Nhập mã quản lý"
                    />
                  </Form.Item>
                </Form>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Card
            style={{ height: "100%" }}
            title="Quản lý xuất kho"
            bodyStyle={{ paddingBottom: 0 }}
            className="custom-card"
            extra={
              <Space>
                <Button
                  type="primary"
                  onClick={exportFile}
                // loading={exportLoading}
                >
                  Tạo phiếu xuất kho
                </Button>
              </Space>
            }
          >
            <Spin spinning={loading}>
              <Form form={form} component={false}>
                <Table
                  form={form}
                  size="small"
                  bordered
                  pagination={{
                    current: page,
                    size: "small",
                    total: totalPage,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    onChange: (page, pageSize) => {
                      setPage(page);
                      setPageSize(pageSize);
                      setParams({ ...params, page: page, pageSize: pageSize });
                    },
                  }}
                  scroll={{
                    x: '100vw',
                    y: tableHeight,
                  }}
                  // components={{
                  //   body: {
                  //     cell: EditableCell,
                  //   },
                  // }}
                  columns={col_detailTable}
                  dataSource={data}
                  // setDataSource={setData}
                  rowSelection={rowSelection}
                // onDelete={deleteItem}
                // onSelect={onSelect}
                // onSave={save}
                />
              </Form>
            </Spin>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default WarehouseExport;
