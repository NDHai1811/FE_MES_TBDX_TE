import {
  Col,
  Row,
  Card,
  Divider,
  Button,
  Form,
  Input,
  Space,
  DatePicker,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useEffect } from "react";
import {
  getUsers,
  getVehicles,
} from "../../../api";
import "../style.scss";
import dayjs from "dayjs";
import { DeleteOutlined, DownOutlined, EditOutlined, UpOutlined } from "@ant-design/icons";
import { deleteWarehouseFGExport, getDeliveryNoteList, getWarehouseFGExportList, updateWarehouseFGExport } from "../../../api/ui/warehouse";
import { useProfile } from "../../../components/hooks/UserHooks";
import { getCustomers } from "../../../api/ui/main";
import EditableTable from "../../../components/Table/EditableTable";
import PopupCreateExportPlanFG from "../../../components/Popup/PopupCreateExportPlanFG.js";
import PopupCreateDeliveryNote from "../../../components/Popup/PopupCreateDeliveryNote.js";

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
  const [listCheck, setListCheck] = useState([]);

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
      title: "MDH",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
      width: 90,
    },
    {
      title: "MQL",
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
      editable: true,
      width: 120
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

  const deleteItem = async (record) => {
    const newData = [...data];
    const index = newData.findIndex((item) => record.id === item.id);
    if (index > -1) {
      const res = await deleteWarehouseFGExport(record.id);
      if (res.success) {
        loadListTable(params);
      }
    }
  };

  const save = async (values) => {
    try {
      var res = await updateWarehouseFGExport({ ...values, ids: data.filter((e, i) => listCheck.includes(i)).map(e => e.id) });
      if (res) {
        loadListTable(params);
        setListCheck([])
      }
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
      setListNote(res4.data.map(e => ({ ...e, value: e.id, label: e.id })));
    })();
  }, []);

  function btn_click(page = 1, pageSize = 20) {
    setPage(page);
    setPageSize(pageSize);
    loadListTable({ ...params, page: page, pageSize: pageSize });
  }

  useEffect(() => {
    btn_click(page, pageSize);
  }, [page, pageSize])

  const loadListTable = async (params) => {
    setLoading(true);
    const res = await getWarehouseFGExportList({ ...params, page: page, pageSize: pageSize });
    setData(res.data.map((e, index) => ({ ...e, key: index })));
    setTotalPage(res.totalPage)
    setLoading(false);
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
  const [listCustomers, setListCustomers] = useState([]);
  const onAfterCreate = async () => {
    loadListTable(params);
    const res4 = await getDeliveryNoteList();
    setListNote(res4.data.map(e => ({ ...e, value: e.id, label: e.id })));
  }
  const rowSelection = {
    selectedRowKeys: listCheck,
    fixed: true,
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys);
    },
  };
  return (
    <>
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Card
              style={{ height: "100%" }}
              styles={{ body: { padding: 0 } }}
              bodyStyle={{padding: 0}}
              className="custom-card scroll"
              actions={[
                <div
                  layout="vertical"
                >
                  <Button
                    type="primary"
                    style={{ width: "80%" }}
                    onClick={() => { btn_click(); }}
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
                        setParams({ ...params, end_date: value });
                      }
                      }
                      value={params.end_date}
                    />
                  </Form.Item>
                  <Form.Item label="Khách hàng" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, customer_id: e.target.value });
                      }
                      }
                      placeholder="Nhập mã khách hàng"
                    />
                  </Form.Item>
                  <Form.Item label="Lệnh xuất" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, delivery_note_id: e.target.value });
                      }
                      }
                      placeholder="Nhập lệnh xuất"
                    />
                  </Form.Item>
                  <Form.Item label="Người báo xuất" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, created_by: e.target.value, page: 1 });
                      }
                      }
                      placeholder="Nhập người báo xuất"
                    />
                  </Form.Item>
                  <Form.Item label="MDH" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, mdh: e.target.value, page: 1 });
                      }
                      }
                      placeholder="Nhập MDH"
                    />
                  </Form.Item>
                  <Form.Item label="MQL" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, mql: e.target.value });
                      }
                      }
                      placeholder="Nhập MQL"
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
            styles={{ body: { paddingBottom: 0 } }}
            className="custom-card"
            extra={
              <Space>
                <PopupCreateDeliveryNote listUsers={listUsers} listCustomers={listCustomers} listVehicles={listVehicles} onAfterCreate={onAfterCreate} />
                <PopupCreateExportPlanFG listUsers={listUsers} listCustomers={listCustomers} listVehicles={listVehicles} onAfterCreate={onAfterCreate} />
              </Space>
            }
          >
            <EditableTable
              size="small"
              loading={loading}
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
              onDelete={deleteItem}
              onUpdate={save}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default WarehouseExportPlan;
