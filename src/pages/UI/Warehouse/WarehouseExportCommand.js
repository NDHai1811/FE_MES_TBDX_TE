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
import { DeleteOutlined, DownOutlined, DownloadOutlined, EditOutlined, LoadingOutlined, UpOutlined } from "@ant-design/icons";
import { createDeliveryNote, createExportCommand, createWareHouseFGExport, deleteDeliveryNote, exportWarehouseExportNote, exportWarehouseFGDeliveryNote, getDeliveryNoteList, getWarehouseFGExportList, updateDeliveryNote, updateWarehouseFGExport, warehouseExportLogList } from "../../../api/ui/warehouse";
import { useProfile } from "../../../components/hooks/UserHooks";
import { getCustomers } from "../../../api/ui/main";
import EditableTable from "../../../components/Table/EditableTable";
import PopupCreateDeliveryNote from "../../../components/Popup/PopupCreateDeliveryNote";
import { downloadDeliveryNote } from "../../../api/oi/warehouse";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

const WarehouseExportCommand = () => {
  document.title = "Quản lý lệnh xuất kho";
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
    "driver_Id",
    "vehicle_id",
    "nguoi_xuat",
  ]);
  const [orders, setOrders] = useState([])
  const [orderTotalPage, setOrdersTotalPage] = useState(1)
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [listVehicles, setListVehicles] = useState([]);
  const [listUsers, setListUsers] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const col_detailTable = [
    {
      title: "Lệnh xuất",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Người báo xuất",
      dataIndex: "created_by",
      key: "created_by",
      align: "center",
      render: (value) => listUsers.find(e => e.id === value)?.name,
    },
    {
      title: "Số xe",
      dataIndex: "vehicle_id",
      key: "vehicle_id",
      align: "center",
      inputType: 'select',
      editable: true,
      options: listVehicles,
    },
    {
      title: "Tài xế",
      dataIndex: "driver_id",
      key: "driver_id",
      align: "center",
      render: (value) => listUsers.find(e => e.id === value)?.name,
      editable: true,
      inputType: 'select',
      options: listVehicles.map(e => ({ ...e, value: e?.user1, label: e?.driver?.name })),
    },
    {
      title: "Người xuất",
      dataIndex: "exporter_ids",
      key: "exporter_ids",
      align: "center",
      render: (value) => <Space align="center" direction="vertical">
        {listUsers.filter(e=>(value ?? []).includes(e.id)).map(e=>{
          return e.name
        })}
      </Space>,
      editable: true,
      inputType: 'select',
      inputProps: {
        mode: 'multiple'
      },
      options: listUsers,
    },
  ];
  const [messageApi, contextHolder] = message.useMessage();

  function btn_click() {
    loadListTable({ ...params, page: 1, pageSize: 20 });
    setPage(1);
    setPageSize(20);
  }

  useEffect(() => {
    loadListTable({ ...params, page: page, pageSize: pageSize });
  }, [page, pageSize]);

  const loadListTable = async (params) => {
    setListCheck([])
    setLoading(true);
    const res = await getDeliveryNoteList(params);
    console.log(res);
    setData(
      [...res.data.data].map((e) => {
        return { ...e, key: e.id };
      })
    );
    setTotalPage(res.data.totalPage)
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const res1 = await getVehicles();
      setListVehicles(res1.map((e, i) => ({ ...e, value: e.id, label: e.id, key: i })));
      const res2 = await getUsers();
      setListUsers(res2.map((e, i) => ({ ...e, value: e.id, label: e.name, key: i })));
      const res3 = await getCustomers();
      setListCustomers(res3.data.map((e, i) => ({ ...e, key: i })));
    })();
  }, []);
  const [orderParams, setOrderParams] = useState({ page: 1, pageSize: 20, totalPage: 1, ngay_xuat: dayjs() });

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

  const onSave = async (record) => {
    console.log(record);
    var res = await updateDeliveryNote(record)
    if (res.success) {
      btn_click()
    }
  }
  const onDelete = async (record) => {
    var res = await deleteDeliveryNote(record);
    if (res.success) {
      btn_click()
    }
  }
  const onSelect = (value, dataIndex, index) => {
    if (dataIndex === 'driver_id' || dataIndex === 'vehicle_id') {
      onSelectDriverVehicle(value, dataIndex, index);
    } else {
      const items = data.map((val, i) => {
        if (i === index) {
          val[dataIndex] = value;
        }
        return { ...val };
      });
      setData(items);
    }
  };
  const onSelectDriverVehicle = (value, dataIndex, index) => {
    const items = data.map((e, i) => {
      if (i === index) {
        var target = null;
        if (dataIndex === 'driver_id') {
          target = listVehicles.find(e => e.user1 === value);
        }
        else if (dataIndex === 'vehicle_id') {
          target = listVehicles.find(e => e.id === value);
        }
        return { ...e, vehicle_id: target?.id, driver_id: target?.user1 }
      } else {
        return e;
      }
    });
    setData(items)
  }
  const searchOrder = async (filterByNote = false) => {
    var paramsSearchOrder = { ...orderParams };
    if (filterByNote) {
      paramsSearchOrder = { ...paramsSearchOrder, filter_by_delivery_note: true }
    }
    setLoadingOrders(true);
    const res = await getOrders(paramsSearchOrder);
    setOrders(res.data.map(e => ({ ...e, key: e.id })));
    setOrdersTotalPage(res.totalPage);
    setLoadingOrders(false);
  }
  useEffect(() => {
    if (openMdl) {
      searchOrder(true);
    }
  }, [openMdl, orderParams]);
  const ordersColumn = [
    {
      title: "Khách hàng",
      dataIndex: "short_name",
      key: "short_name",
      align: "center",
      width: 100,
      isSearch: true,
      input_type: 'select',
      options: listCustomers
    },
    {
      title: "MDH",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
      width: 100,
      isSearch: true,
      mode: 'tags',
      input_type: 'select',
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      align: "center",
      width: 100,
      isSearch: true,
    },
    {
      title: "MQL",
      dataIndex: "mql",
      key: "mql",
      align: "center",
      width: 50,
    },
    {
      title: "L",
      dataIndex: "length",
      key: "length",
      align: "center",
      width: 50,
      isSearch: true,
    },
    {
      title: "W",
      dataIndex: "width",
      key: "width",
      align: "center",
      width: 50,
      isSearch: true,
    },
    {
      title: "H",
      dataIndex: "height",
      key: "height",
      align: "center",
      width: 50,
      isSearch: true,
    },
    {
      title: "Kích thước",
      dataIndex: "kich_thuoc",
      key: "kich_thuoc",
      align: "center",
      width: 160,
      isSearch: true,
    },
    {
      title: "Số lượng",
      dataIndex: "sl",
      key: "sl",
      align: "center",
      width: 70,
    },
    {
      title: "TMO",
      dataIndex: "tmo",
      key: "tmo",
      align: "center",
      isSearch: true,
    },
    {
      title: "PO",
      dataIndex: "po",
      key: "po",
      align: "center",
      isSearch: true,
    },
    {
      title: "STYLE",
      dataIndex: "style",
      key: "style",
      align: "center",
      isSearch: true,
    },
    {
      title: "STYLE NO",
      dataIndex: "style_no",
      key: "style_no",
      align: "center",
      isSearch: true,
    },
    {
      title: "COLOR",
      dataIndex: "color",
      key: "color",
      align: "center",
      isSearch: true,
    },
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      align: "center",
      isSearch: true,
    },
    {
      title: "RM",
      dataIndex: "rm",
      key: "rm",
      align: "center",
      isSearch: true,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      align: "center",
    },
    {
      title: "Đợt",
      dataIndex: "dot",
      key: "dot",
      align: "center",
      width: 60,
      isSearch: true,
    },
    {
      title: "Fac",
      dataIndex: "xuong_giao",
      key: "xuong_giao",
      align: "center",
      width: 60,
      isSearch: true,
    },
    {
      title: "Hạn giao",
      dataIndex: "han_giao",
      key: "han_giao",
      align: "center",
      width: 100,
      isSearch: true,
      input_type: 'date',
    },
  ];
  const selectOrdersColumns = [...ordersColumn, {
    title: 'Tác vụ',
    key: 'action',
    dataIndex: 'action',
    align: 'center',
    fixed: 'right',
    width: 60,
    render: (_, record) => <DeleteOutlined style={{ color: "red", fontSize: 18 }} onClick={() => onDeselectOrders([record])} />
  }];
  const onDeselectOrders = (rows) => {
    setSelectedOrders(prev => {
      const newArray = [...prev];
      return newArray.filter((e, index) => {
        return !rows.some(o => o.key === e.key)
      });
    });
  }
  const orderRowSelection = {
    selectedRowKeys: [].concat(selectedOrders).map(e => e.key),
    fixed: true,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedOrders(prev => {
        const newArray = [...prev, ...selectedRows];
        return newArray.filter((e, index) => {
          return index === newArray.findIndex(o => e.key === o.key);
        });
      });
    },
    optionFilterProp: 'label',
    onSelectAll: (selected, selectedRows, changeRows) => !selected && onDeselectOrders(changeRows),
    onSelect: (record, selected, selectedRows, nativeEvent) => !selected && onDeselectOrders([record])
  };
  const items = [
    {
      label: 'Danh sách đơn hàng',
      key: 1,
      children: <Table size='small' bordered
        loading={loadingOrders}
        pagination={{
          current: orderParams.page,
          size: "small",
          total: orderTotalPage,
          pageSize: orderParams.pageSize,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
            setOrderParams({ ...orderParams, page: page, pageSize: pageSize });
          },
        }}
        scroll={
          {
            x: '170vw',
            y: '42vh'
          }
        }
        tableLayout="fixed"
        rowSelection={orderRowSelection}
        columns={ordersColumn}
        dataSource={orders} />
    },
    {
      label: <Space>{'Đơn hàng đã chọn'}<Badge count={selectedOrders.length} showZero color="#1677ff" overflowCount={999} /></Space>,
      key: 2,
      children: <Table size='small' bordered
        pagination={false}
        loading={loadingOrders}
        scroll={
          {
            x: '260vw',
            y: '42vh'
          }
        }
        tableLayout="fixed"
        columns={selectOrdersColumns}
        dataSource={selectedOrders}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              {selectOrdersColumns.map((e, index) => {
                if (index === 0) {
                  return <Table.Summary.Cell align="center" index={index}>Tổng số lượng</Table.Summary.Cell>
                } else if (index === 8) {
                  return <Table.Summary.Cell align="center" index={index}>{
                    selectedOrders.reduce((sum, { sl }) => sum + parseInt(sl), 0)
                  }</Table.Summary.Cell>
                } else {
                  return <Table.Summary.Cell index={index} />
                }
              })}
            </Table.Summary.Row>
          </Table.Summary>
        )} />
    }
  ];
  const onAfterCreate = () => {
    btn_click();
  }
  const [loadingRow, setLoadingRow] = useState()
  const onDownloadDeliveryNote = async (record) => {
    setLoadingRow(record.id);
    var res = await downloadDeliveryNote({ delivery_note_id: record.id });
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setLoadingRow();
  }
  const btnDownloadExportCommand = (record) => {
    return loadingRow === record.id ? <LoadingOutlined /> : <DownloadOutlined onClick={() => onDownloadDeliveryNote(record)} />
  }
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
                  <Form.Item label="Lệnh xuất" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, id: e.target.value })
                      }
                      placeholder="Nhập lệnh xuất"
                    />
                  </Form.Item>
                  <Form.Item label="Người báo xuất" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, created_by: e.target.value })
                      }
                      placeholder="Nhập tên người báo xuất"
                    />
                  </Form.Item>
                  <Form.Item label="Số xe" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, vehicle_id: e.target.value })
                      }
                      placeholder="Nhập số xe"
                    />
                  </Form.Item>
                  <Form.Item label="Người xuất" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, exporter_id: e.target.value })
                      }
                      placeholder="Nhập tên người xuất"
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
            title="Quản lý lệnh xuất kho"
            styles={{ body: { paddingBottom: 0 } }}
            className="custom-card"
            extra={
              <Space>
                <PopupCreateDeliveryNote listUsers={listUsers} listVehicles={listVehicles} listCustomers={listCustomers} onAfterCreate={onAfterCreate} />
              </Space>
            }
          >
            <Spin spinning={loading}>
              <Form form={form} component={false}>
                <EditableTable
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
                    // x: '100vw',
                    y: tableHeight,
                  }}
                  columns={col_detailTable}
                  dataSource={data}
                  setDataSource={setData}
                  rowSelection={rowSelection}
                  onDelete={onDelete}
                  onSelect={onSelect}
                  onUpdate={onSave}
                  addonAction={btnDownloadExportCommand}
                />
              </Form>
            </Spin>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default withRouter(WarehouseExportCommand);
