import {
  Col,
  Row,
  Table,
  Divider,
  Button,
  Form,
  Input,
  Space,
  Select,
  DatePicker,
  Modal,
  Tabs,
  Badge,
  Collapse,
  ConfigProvider,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import dayjs from "dayjs";
import { getOrders, getRolesList, getUsers, getVehicles } from "../../api";
import { getCustomers } from "../../api/ui/main";
import { createDeliveryNote, getDeliveryNoteList, getWarehouseFGExportPlan } from "../../api/ui/warehouse";
import { DeleteOutlined } from "@ant-design/icons";

const PopupCreateDeliveryNote = (props) => {
  const { listUsers = [], listCustomers = [], listVehicles = [], onAfterCreate = null } = props;
  const [open, setOpen] = useState(false);
  const [params, setParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalPage, setTotalPage] = useState(1)
  const [tableParams, setTableParams] = useState({ page: 1, pageSize: 20, totalPage: 1 })
  const [selectedRows, setSelectedRows] = useState([]);
  const [exportCommandParams, setExportCommandParams] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [roleList, setRoleList] = useState([]);
  const columns = [
    {
      title: 'Thời gian xuất',
      dataIndex: 'ngay_xuat',
      align: 'center',
      render: (value) => (value && dayjs(value).isValid()) ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : "",
      isSearch: true,
      input_type: 'date',
      width: 160,
    },
    {
      title: 'Người tạo KH',
      dataIndex: 'created_by',
      align: 'center',
      width: 160,
      render: (value) => listUsers.find(e => e.id === value)?.name
    },
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
      isSearch: true,
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
      title: "SL xuất",
      dataIndex: "so_luong_xuat",
      key: "so_luong_xuat",
      align: "center",
      width: 70,
    },
    {
      title: "Tồn kho",
      dataIndex: "sl_ton",
      key: "sl_ton",
      align: "center",
      width: 70,
    },
    {
      title: "Tồn kho min",
      dataIndex: "sl_ton_min",
      key: "sl_ton_min",
      align: "center",
      width: 70,
      hidden: true,
      isSearch: true,
    },
    {
      title: "Tồn kho max",
      dataIndex: "sl_ton_max",
      key: "sl_ton_max",
      align: "center",
      width: 70,
      hidden: true,
      isSearch: true,
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
    {
      title: "Người tạo ĐH",
      dataIndex: "creator",
      key: "creator",
      align: "center",
      render: (value) => value?.name ?? '',
    },
  ];
  const rowSelection = {
    selectedRowKeys: [].concat(selectedRows).map(e => e.key),
    fixed: true,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(prev => {
        const newArray = [...prev, ...selectedRows];
        return newArray.filter((e, index) => {
          return index === newArray.findIndex(o => e.key === o.key);
        });
      });
    },
    getCheckboxProps: (record) => ({
      disabled: record.sl_ton <= 0,
    }),
    optionFilterProp: 'label',
    onSelectAll: (selected, selectedRows, changeRows) => !selected && onDeselectOrders(changeRows),
    onSelect: (record, selected, selectedRows, nativeEvent) => !selected && onDeselectOrders([record])
  };
  const selectedRowsColumns = [...columns, {
    title: 'Tác vụ',
    key: 'action',
    dataIndex: 'action',
    align: 'center',
    fixed: 'right',
    width: 60,
    render: (_, record) => <DeleteOutlined style={{ color: "red", fontSize: 18 }} onClick={() => onDeselectOrders([record])} />
  }];

  async function loadData(params) {
    setLoading(true);
    var res = await getWarehouseFGExportPlan(params);
    setData(res.data.map(e => ({ ...e, key: e.id })));
    setTotalPage(res.totalPage)
    setLoading(false);
  }
  useEffect(() => {
    (async () => {
      var res = await getRolesList();
      setRoleList(res.map(e => ({ ...e, label: e.name, value: e.id })))
    })()
  }, [])
  // useEffect(() => {
  //   if (Object.keys(params).length > 0) {
  //     // loadData({ ...params, page: 1, pageSize: 20 });
  //     setTableParams({ ...tableParams, page: 1, pageSize: 20 });
  //   }
  // }, [params]);
  useEffect(() => {
    if (open) {
      loadData({ ...params, page: 1, pageSize: 20 });
    } else {
      setParams({});
      setData([]);
    }
    setPage(1);
    setPageSize(20);
  }, [open]);
  const onDeselectOrders = (rows) => {
    setSelectedRows(prev => {
      const newArray = [...prev];
      return newArray.filter((e, index) => {
        return !rows.some(o => o.key === e.key)
      });
    });
  }
  const [creating, setCreating] = useState(false);
  const onCreate = async () => {
    console.log(exportCommandParams);
    if (!exportCommandParams?.vehicle_id) {
      messageApi.warning('Chưa chọn xe!');
      return 0;
    }
    if (!exportCommandParams?.driver_id) {
      messageApi.warning('Chưa chọn tài xế!');
      return 0;
    }
    if (!(exportCommandParams?.exporter_ids ?? []).length) {
      messageApi.warning('Chưa chọn người xuất!');
      return 0;
    }
    if (!selectedRows.length) {
      messageApi.warning('Chưa chọn đơn hàng cần xuất!');
      return 0;
    }
    setCreating(true);
    var res = await createDeliveryNote({ ...exportCommandParams, export_ids: selectedRows });
    if (res.success) {
      setOpen(false);
      setSelectedRows([]);
      onAfterCreate();
      setExportCommandParams({})
    }
    setCreating(false);
  }
  const items = [
    {
      label: 'Danh sách đơn hàng',
      key: 1,
      children: <Table size='small' bordered
        loading={loading}
        pagination={{
          current: page,
          size: "small",
          total: totalPage ?? 1,
          pageSize: pageSize,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize)
            loadData({ ...params, page: page, pageSize: pageSize })
          },
        }}
        scroll={
          {
            x: '170vw',
            y: 'calc(100vh - 57vh)'
          }
        }
        tableLayout="fixed"
        rowSelection={rowSelection}
        columns={columns.map(e=>({...e, ellipsis: true}))}
        dataSource={data} />
    },
    {
      label: <Space>{'Đơn hàng đã chọn'}<Badge count={selectedRows.length} showZero color="#1677ff" overflowCount={999} /></Space>,
      key: 2,
      children: <Table size='small' bordered
        pagination={false}
        scroll={
          {
            x: '260vw',
            y: 'calc(100vh - 57vh)'
          }
        }
        tableLayout="fixed"
        columns={selectedRowsColumns.map(e=>({...e, ellipsis: true}))}
        dataSource={selectedRows}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              {selectedRowsColumns.map((e, index) => {
                if (index === 0) {
                  return <Table.Summary.Cell align="center" index={index}>Tổng số lượng</Table.Summary.Cell>
                } else if (index === 10) {
                  return <Table.Summary.Cell align="center" index={index}>{
                    selectedRows.reduce((sum, { so_luong_xuat }) => sum + parseInt(so_luong_xuat), 0)
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
    right: <Button type="primary" className="tabs-extra-demo-button" onClick={() => onCreate()} loading={creating}>Tạo lệnh XK</Button>,
  };
  return (
    <React.Fragment>
      {contextHolder}
      <Button type="primary" onClick={() => setOpen(true)}>Tạo lệnh XK</Button>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        className="popup"
        title="Tạo lệnh xuất kho từ đơn hàng"
        width={'98vw'}
        height={"100%"}
        style={{
          top: 0,
        }}
      >
        <Form layout="vertical">
          <Row gutter={[8, 0]}>
            <Col span={8}>
              <Form.Item
                label="Số xe"
                className="mb-2"
              >
                <Select options={listVehicles}
                  showSearch
                  value={exportCommandParams?.vehicle_id}
                  onSelect={(value) => {
                    const target = listVehicles.find(e => e.id === value);
                    setExportCommandParams({ ...exportCommandParams, vehicle_id: value, driver_id: target?.user1 });
                  }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Tài xế"
                className="mb-2"
              >
                <Select options={listVehicles.map((e, i) => ({ ...e, value: e?.user1, label: e?.driver?.name, key: i }))}
                  value={exportCommandParams?.driver_id}
                  showSearch
                  optionFilterProp="label"
                  onSelect={(value) => {
                    const target = listVehicles.find(e => e.user1 === value);
                    setExportCommandParams({ ...exportCommandParams, driver_id: value, vehicle_id: target?.id });
                  }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Người xuất"
                className="mb-2"
              >
                <div className="w-100 d-flex">
                  <Select
                    style={{ width: '45%', marginRight: 8 }}
                    options={roleList}
                    showSearch
                    allowClear
                    placeholder="Chọn bộ phận"
                    value={exportCommandParams.role_id}
                    optionFilterProp="label"
                    onSelect={(value) => {
                      setExportCommandParams({ ...exportCommandParams, role_id: value, exporter_id: null });
                    }}
                    onClear={() => setExportCommandParams({ ...exportCommandParams, role_id: null })}
                  />

                  <Select
                    placeholder="Chọn người xuất"
                    options={exportCommandParams.role_id ? listUsers.filter(e => (e.roles ?? []).some(e => e.id === exportCommandParams.role_id)) : listUsers}
                    showSearch
                    mode="multiple"
                    value={exportCommandParams.exporter_ids}
                    optionFilterProp="label"
                    onChange={(value) => {
                      console.log(value);
                      
                      setExportCommandParams({ ...exportCommandParams, exporter_ids: value });
                    }}
                  />
                </div>
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
                    <Col xs={16} sm={16} md={12} lg={8} xl={6}>
                      <Form.Item label={'Người tạo KH'} style={{ marginBottom: 8 }}>
                        <Row gutter={8}>
                          <Col span={10}>
                            <Form.Item noStyle>
                              <Select
                                style={{ width: '100%' }}
                                options={roleList}
                                showSearch
                                allowClear
                                placeholder="Chọn bộ phận"
                                value={params.role_id}
                                optionFilterProp="label"
                                onSelect={(value) => {
                                  setParams({ ...params, role_id: value, created_by: null });
                                }}
                                onClear={() => setParams({ ...params, role_id: null })}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={14}>
                            <Form.Item noStyle>
                              <Select
                                style={{ width: '100%' }}
                                placeholder="Chọn người tạo KH"
                                options={params.role_id ? listUsers.filter(e => (e.roles ?? []).some(e => e.id === params.role_id)) : listUsers}
                                showSearch
                                value={params.created_by}
                                optionFilterProp="label"
                                onSelect={(value) => {
                                  setParams({ ...params, created_by: value });
                                }}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form.Item>
                    </Col>
                    {columns.filter(e => e.isSearch).map((e, index) => {
                      let item = null;
                      if (e?.input_type === 'select') {
                        item = <Select
                          mode={e?.mode}
                          options={e?.options}
                          showSearch
                          maxTagCount={'responsive'}
                          allowClear
                          optionFilterProp="label"
                          placeholder={'Nhập ' + e.title.toLowerCase()}
                          onChange={(value) => setParams({ ...params, [e.dataIndex]: value })}
                          value={params[e.dataIndex]}
                        />
                      }
                      else if (['date', 'date_time'].includes(e?.input_type)) {
                        item = <DatePicker
                          className="w-100"
                          showTime={e?.input_type === 'date_time'}
                          needConfirm={false}
                          placeholder={'Nhập ' + e.title.toLowerCase()}
                          onChange={(value) => (!value || value.isValid()) && setParams({ ...params, [e.dataIndex]: value })}
                          onSelect={(value) => setParams({ ...params, [e.dataIndex]: value })}
                          value={params[e.dataIndex]}
                        />;
                      } else {
                        item = <Input
                          allowClear
                          placeholder={'Nhập ' + e.title.toLowerCase()}
                          onChange={(value) => setParams({ ...params, [e.dataIndex]: value.target.value })}
                          value={params[e.dataIndex]}
                        />
                      }
                      return e.isSearch && <Col xs={8} sm={8} md={6} lg={4} xl={2} key={index}>
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
          <Form.Item>
            <Button type="primary" onClick={()=>loadData({...params, page: 1, pageSize: 20})}>Tìm kiếm</Button>
          </Form.Item>
        </Form>
        <Tabs
          className="mt-1"
          type="card"
          items={items}
          tabBarExtraContent={extraTab}
        />
      </Modal>
    </React.Fragment>
  );
};

export default PopupCreateDeliveryNote;
