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
import { createDeliveryNote, createExportCommand, createWareHouseFGExport, getDeliveryNoteList, getWarehouseFGExportList, updateWarehouseFGExport } from "../../../api/ui/warehouse";
import { useProfile } from "../../../components/hooks/UserHooks";
import { getCustomers } from "../../../api/ui/main";
import EditableTable from "../../../components/Table/EditableTable";
import PopupSelectWarehouseFGExportPlan from "../../../components/Popup/PopupSelectWarehouseFGExportPlan";
import PopupCreateWarehouseFGExportPlan from "../../../components/Popup/PopupCreateWarehouseFGExportPlan.js";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  onChange,
  onSelect,
  options,
  ...restProps
}) => {
  let inputNode;
  switch (inputType) {
    case "number":
      inputNode = <InputNumber />;
      break;
    case "select":
      inputNode = (
        <Select
          value={record?.[dataIndex]}
          options={options}
          onChange={(value) => onSelect(value, dataIndex)}
          optionFilterProp="label"
          bordered
          showSearch
          popupMatchSelectWidth={options.length > 0 ? 200 : 0}
        />
      );
      break;
    default:
      inputNode = <Input />;
  }
  const dateValue = record?.[dataIndex] ? dayjs(record?.[dataIndex]) : null;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          initialValue={record?.[dataIndex]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const WarehouseExportPlan = () => {
  document.title = "Kế hoạch xuất kho";
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
  const [loading, setLoading] = useState(false);
  const [listVehicles, setListVehicles] = useState([]);
  const [listUsers, setListUsers] = useState([]);
  const [listNotes, setListNote] = useState({});

  const col_detailTable = [
    {
      title: "Lệnh xuất",
      dataIndex: "delivery_note_id",
      key: "delivery_note_id",
      align: "center",
      width: 140,
      editable: true,
      inputType: 'select',
      options: listNotes
    },
    {
      title: "Người báo xuất",
      dataIndex: "created_by",
      key: "created_by",
      align: "center",
      width: 180,
      render: (value) => {
        const item = listUsers.find(e => e.id == value);
        return item?.name
      },
    },
    {
      title: "Ngày xuất",
      dataIndex: "ngay_xuat",
      key: "ngay_xuat",
      align: "center",
      width: 100,
      render: (value, item) => dayjs(value).format('DD/MM/YYYY')
    },
    {
      title: "Thời gian xuất",
      dataIndex: "thoi_gian_xuat",
      key: "thoi_gian_xuat",
      align: "center",
      width: 80,
      render: (value, item) => dayjs(item.ngay_xuat).format('HH:mm:ss')
    },
    {
      title: "Khách hàng",
      dataIndex: "customer_id",
      key: "customer_id",
      align: "center",
      width: 80
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
      width: 80,
    },
    {
      title: "Mã quản lý",
      dataIndex: "mql",
      key: "mql",
      align: "center",
      width: 60,
    },
    {
      title: "Số lượng ĐH",
      dataIndex: "so_luong_dh",
      key: "so_luong_dh",
      align: "center",
      width: 60,
    },
    {
      title: "Số lượng cần xuất",
      dataIndex: "so_luong",
      key: "so_luong",
      align: "center",
      editable: true,
      width: 60,
    },
    {
      title: "FAC",
      dataIndex: "xuong_giao",
      key: "xuong_giao",
      align: "center",
      width: 180
    },
    {
      title: "Tài xế",
      dataIndex: "driver_id",
      key: "driver_id",
      align: "center",
      render: (value) => {
        const item = listVehicles.find(e => e.user1 === value);
        return item?.driver?.name
      },
      // inputType: 'select',
      // options: listVehicles.map(e => ({ ...e, value: e?.user1, label: e?.driver?.name })),
      width: 180,
    },
    {
      title: "Số xe",
      dataIndex: "vehicle_id",
      key: "vehicle_id",
      align: "center",
      width: 150,
      // inputType: 'select',
      // options: listVehicles
    },
    {
      title: "Người xuất",
      dataIndex: "exporter_id",
      key: "exporter_id",
      align: "center",
      render: (value) => {
        const item = listUsers.find(e => e.id == value);
        return item?.name
      },
      // inputType: 'select',
      // options: listUsers,
      width: 180,
    },
  ];

  const deleteItem = async (key) => {
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      const res = await deleteBuyers({ id: key });
      newData.splice(index, 1);
      setData(newData);
    }
  };

  const save = async (data) => {
    try {
      var res = await updateWarehouseFGExport(data);
      if (res) {
        loadListTable();
      }
      form.resetFields();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  }

  useEffect(() => {
    (async () => {
      const res1 = await getVehicles();
      setListVehicles(res1.map(e => ({ ...e, value: e.id, label: e.id })));
      const res2 = await getUsers();
      setListUsers(res2.map(e => ({ ...e, value: e.id, label: e.name })));
      const res3 = await getCustomers();
      setListCustomers(res3.data);
      const res4 = await getDeliveryNoteList();
      setListNote(res4.data.map(e=>({...e, value: e.id, label: e.id})));
    })();
  }, []);

  function btn_click() {
    loadListTable();
  }

  useEffect(() => {
    btn_click();
  }, [page, pageSize])

  const loadListTable = async () => {
    setLoading(true);
    const res = await getWarehouseFGExportList(params);
    setData(
      res.data.map((e) => {
        return { ...e, key: e.id };
      })
    );
    setTotalPage(res.totalPage)
    setLoading(false);
  };

  const onSelect = (value, dataIndex, index) => {
    if (dataIndex === 'tai_xe' || dataIndex === 'so_xe') {
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
        if (dataIndex === 'tai_xe') {
          target = listVehicles.find(e => e.user1 === value);
        } else {
          target = listVehicles.find(e => e.id === value);
        }
        form.setFieldsValue({ ...e, so_xe: target?.id, tai_xe: target?.user1 })
        return { ...e, so_xe: target?.id, tai_xe: target?.user1 }
      } else {
        return e;
      }
    });
    setData(items)
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
  }, [data]);
  const [listCustomers, setListCustomers] = useState([]);
  const onAfterCreate = async () => {
    loadListTable();
    const res4 = await getDeliveryNoteList();
    setListNote(res4.data.map(e=>({...e, value: e.id, label: e.id})));
  }
  return (
    <>
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
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, customer_id: e.target.value })
                      }
                      placeholder="Nhập mã khách hàng"
                    />
                  </Form.Item>
                  <Form.Item label="Lệnh xuất" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, delivery_note_id: e.target.value })
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
                      placeholder="Nhập người báo xuất"
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
            title="Kế hoạch xuất kho"
            bodyStyle={{ paddingBottom: 0 }}
            className="custom-card"
            extra={
              <Space>
                <PopupSelectWarehouseFGExportPlan listUsers={listUsers} listCustomers={listCustomers} listVehicles={listVehicles} onAfterCreate={onAfterCreate}/>
                <PopupCreateWarehouseFGExportPlan listUsers={listUsers} listCustomers={listCustomers} listVehicles={listVehicles} onAfterCreate={onAfterCreate}/>
              </Space>
            }
          >
            <Spin spinning={loading}>
              <Form form={form} component={false}>
                <EditableTable
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
                    // x: '100vw',
                    y: tableHeight,
                  }}
                  // components={{
                  //   body: {
                  //     cell: EditableCell,
                  //   },
                  // }}
                  columns={col_detailTable}
                  dataSource={data}
                  setDataSource={setData}
                  // rowSelection={rowSelection}
                  onDelete={deleteItem}
                  onSelect={onSelect}
                  onSave={save}
                />
              </Form>
            </Spin>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default WarehouseExportPlan;
