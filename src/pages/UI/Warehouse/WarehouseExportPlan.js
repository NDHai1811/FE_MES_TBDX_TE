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
import { createWareHouseFGExport, getWarehouseFGExportList, updateWarehouseFGExport } from "../../../api/ui/warehouse";
import { useProfile } from "../../../components/hooks/UserHooks";
import { getCustomers } from "../../../api/ui/main";
import EditableTable from "../../../components/Table/EditableTable";

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
  const isEditing = (record) => record.key === editingKey;

  const hasEditColumn = (value) => {
    return keys.some((val) => val === value);
  };

  const col_detailTable = [
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
      title: "Tài xế",
      dataIndex: "tai_xe",
      key: "tai_xe",
      align: "center",
      editable: true,
      render: (value) => {
        const item = listVehicles.find(e => e.user1 === value);
        return item?.driver?.name
      },
      inputType: 'select',
      options: listVehicles.map(e => ({ ...e, value: e?.user1, label: e?.driver?.name })),
      width: 180,
    },
    {
      title: "Số xe",
      dataIndex: "so_xe",
      key: "so_xe",
      align: "center",
      editable: true,
      width: 150,
      inputType: 'select',
      options: listVehicles
    },
    {
      title: "Người xuất",
      dataIndex: "nguoi_xuat",
      key: "nguoi_xuat",
      align: "center",
      editable: true,
      render: (value) => {
        const item = listUsers.find(e => e.id == value);
        return item?.name
      },
      inputType: 'select',
      options: listUsers,
      width: 180,
    },
    {
      title: "FAC",
      dataIndex: "xuong_giao",
      key: "xuong_giao",
      align: "center",
    },
    // {
    //   title: "Hành động",
    //   dataIndex: "action",
    //   align: "center",
    //   fixed: "right",
    //   render: (_, record) => {
    //     const editable = isEditing(record);
    //     return editable ? (
    //       <span>
    //         <Typography.Link
    //           onClick={() => save(record.key)}
    //           style={{
    //             marginRight: 8,
    //           }}
    //         >
    //           Lưu
    //         </Typography.Link>
    //         <Popconfirm title="Bạn có chắc chắn muốn hủy?" onConfirm={cancel}>
    //           <a>Hủy</a>
    //         </Popconfirm>
    //       </span>
    //     ) : (
    //       <span>
    //         <EditOutlined
    //           style={{ color: "#1677ff", fontSize: 20 }}
    //           disabled={editingKey !== ""}
    //           onClick={() => edit(record)}
    //         />
    //         <Popconfirm
    //           title="Bạn có chắc chắn muốn xóa?"
    //           onConfirm={() => deleteItem(record.key)}
    //         >
    //           <DeleteOutlined
    //             style={{
    //               color: "red",
    //               marginLeft: 8,
    //               fontSize: 20,
    //             }}
    //           />
    //         </Popconfirm>
    //       </span>
    //     );
    //   },
    // },
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

  const onAdd = () => {
    form.resetFields();
    const newData = [
      {
        key: data.length + 1,
        id: "",
        customer_id: "",
        ngay_xuat: "",
        mdh: "",
        mql: "",
        so_luong: "",
        tai_xe: "",
        so_xe: "",
        nguoi_xuat: "",
      },
      ...data,
    ];
    setData(newData);
    setEditingKey(data.length + 1);
    setType("add");
  };

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
    setType("update");
  };
  const cancel = () => {
    if (typeof editingKey === "number") {
      const newData = [...data];
      newData.shift();
      setData(newData);
    }
    setEditingKey("");
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
  };

  // const mergedColumns = col_detailTable?.map((col) => {
  //   if (!col.editable) {
  //     return col;
  //   }
  //   return {
  //     ...col,
  //     onCell: (record) => ({
  //       record,
  //       dataIndex: col.dataIndex,
  //       title: col.title,
  //       editing: isEditing(record),
  //       inputType:
  //         (col.dataIndex === "tai_xe" || col.dataIndex === "so_xe" || col.dataIndex === "nguoi_xuat")
  //           ? "select"
  //           : "text",
  //       options: options(col.dataIndex),
  //       onSelect:
  //         col.dataIndex === "tai_xe" ||
  //           col.dataIndex === "so_xe"
  //           ? onSelectDriverVehicle
  //           : onSelect,
  //     }),
  //   };
  // });
  const options = (dataIndex) => {
    let filteredOptions = [];
    switch (dataIndex) {
      case "tai_xe":
        filteredOptions = listVehicles.map(e => ({ ...e, value: e?.user1, label: e?.driver?.name }));
        break;
      case "so_xe":
        filteredOptions = listVehicles.map(e => ({ ...e, value: e?.id, label: e?.id }));
        break;
      case "nguoi_xuat":
        filteredOptions = listUsers.map(e => ({ ...e, value: e?.id, label: e?.name }));
        break;
      default:
        break;
    }
    return filteredOptions;
  };

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    (async () => {
      const res1 = await getVehicles();
      setListVehicles(res1.map(e => ({ ...e, value: e.id, label: e.id })));
      const res2 = await getUsers();
      setListUsers(res2.map(e => ({ ...e, value: e.id, label: e.name })));
      const res3 = await getCustomers();
      setListCustomers(res3.data);
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

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Upload file thành công",
    });
  };

  const error = () => {
    messageApi.open({
      type: "error",
      content: "Upload file lỗi",
    });
  };

  const exportFile = async () => {
    // setExportLoading(true);
    // const res = await exportOrders(params);
    // if (res.success) {
    //   window.location.href = baseURL + res.data;
    // }
    // setExportLoading(false);
  };

  const rowSelection = {
    fixed: true,
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys);
    },
    optionFilterProp: 'label',
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
  const { userProfile } = useProfile();
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
  const [orders, setOrders] = useState([])
  const [orderParams, setOrderParams] = useState({ page: 1, pageSize: 20, totalPage: 1, ngay_xuat: dayjs() });
  const [orderTotalPage, setOrdersTotalPage] = useState(1)
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [listCustomers, setListCustomers] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const searchOrder = async () => {
    setLoadingOrders(true);
    const res = await getOrders(orderParams);
    setOrders(res.data.map(e => ({ ...e, key: e.id })));
    setOrdersTotalPage(res.totalPage);
    setLoadingOrders(false);
  }
  useEffect(() => {
    openMdl && searchOrder()
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
  const extraTab = {
    right: <Button type="primary" className="tabs-extra-demo-button" onClick={() => onCreate()}>Tạo KHXK</Button>,
  };
  const onCreate = async () => {
    var res = await createWareHouseFGExport({ ngay_xuat: orderParams.ngay_xuat, orders: selectedOrders });
    if (res.success) {
      setOpenMdl(false);
      loadListTable();
    }
  }
  const [isClose, setIsClose] = useState(false);
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
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, customer_id: e.target.value })
                      }
                      placeholder="Nhập mã khách hàng"
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
                <Upload
                  showUploadList={false}
                  name="files"
                  action={baseURL + "/api/upload-ke-hoach-xuat-kho"}
                  headers={{
                    authorization: "Bearer " + userProfile.token,
                  }}
                  onChange={(info) => {
                    setLoadingExport(true);
                    if (info.file.status === "error") {
                      setLoadingExport(false);
                      error();
                    } else if (info.file.status === "done") {
                      if (info.file.response.success === true) {
                        loadListTable();
                        success();
                        setLoadingExport(false);
                      } else {
                        loadListTable();
                        message.error(info.file.response.message);
                        setLoadingExport(false);
                      }
                    }
                  }}
                >
                  <Button
                    style={{ marginLeft: "15px" }}
                    type="primary"
                    loading={loadingExport}
                  >
                    Upload Excel
                  </Button>
                </Upload>
                {/* <Button
                  type="primary"
                  onClick={exportFile}
                  loading={exportLoading}
                >
                  Export Excel
                </Button> */}
                <Button type="primary" onClick={() => setOpenMdl(true)}>
                  Tạo từ ĐH
                </Button>
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
      <Modal
        open={openMdl}
        onCancel={() => setOpenMdl(false)}
        footer={null}
        title="Tạo kế hoạch xuất kho từ đơn hàng"
        width={'98vw'}
        height={'100vh'}
        style={{
          // position: 'fixed',
          left: '0',
          right: '0',
          top: '5px',
        }}
      >
        <Form layout="vertical">
          <Row gutter={[8, 0]}>
            <Col span={5}>
              <Form.Item
                label="Ngày xuất"
                className="mb-2"
              >
                <DatePicker
                  allowClear={false}
                  showTime
                  placeholder="Ngày xuất"
                  style={{ width: "100%" }}
                  onChange={(value) => {
                    value.isValid() && setOrderParams({ ...orderParams, ngay_xuat: value });
                  }}
                  needConfirm={false}
                  onSelect={(value) => {
                    setOrderParams({ ...orderParams, ngay_xuat: value });
                  }}
                  value={orderParams.ngay_xuat}
                />
              </Form.Item>
            </Col>
          </Row>
          <ConfigProvider
            theme={{
              components: {
                Collapse: {
                  headerPadding: 0,
                  contentPadding: 0
                },
              },
            }}>
            <Collapse
              collapsible="header"
              defaultActiveKey={['1']}
              ghost
              items={[
                {
                  key: '1',
                  label: <Divider orientation="left" orientationMargin="0" plain style={{ margin: 0 }}>Truy vấn</Divider>,
                  children: <Row gutter={[8, 0]}>
                    {ordersColumn.map(e => {
                      let item = null;
                      if (e?.input_type === 'select') {
                        item = <Select
                          mode={e?.mode}
                          options={e?.options}
                          showSearch
                          maxTagCount={'responsive'}
                          allowClear
                          placeholder={'Nhập ' + e.title.toLowerCase()}
                          onChange={(value) => setOrderParams({ ...orderParams, [e.key]: value })}
                          value={orderParams[e.key]}
                        />
                      }
                      else if (['date', 'date_time'].includes(e?.input_type)) {
                        item = <DatePicker
                          className="w-100"
                          showTime={e?.input_type === 'date_time'}
                          needConfirm={false}
                          placeholder={'Nhập ' + e.title.toLowerCase()}
                          onChange={(value) => (!value || value.isValid()) && setOrderParams({ ...orderParams, [e.key]: value })}
                          onSelect={(value) => setOrderParams({ ...orderParams, [e.key]: value })}
                          value={orderParams[e.key]}
                        />;
                      } else {
                        item = <Input
                          allowClear
                          placeholder={'Nhập ' + e.title.toLowerCase()}
                          onChange={(value) => setOrderParams({ ...orderParams, [e.key]: value.target.value })}
                          value={orderParams[e.key]}
                        />
                      }
                      return e.isSearch && <Col span={4}>
                        <Form.Item label={e.title} style={{ marginBottom: 8 }}>
                          {item}
                        </Form.Item>
                      </Col>
                    })}
                  </Row>,
                },
              ]}
            />
          </ConfigProvider>
        </Form>
        <Tabs
          className="mt-1"
          type="card"
          items={items}
          tabBarExtraContent={extraTab}
        />
      </Modal>
    </>
  );
};

export default WarehouseExportPlan;
