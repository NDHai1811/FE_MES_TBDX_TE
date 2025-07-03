import {
  DatePicker,
  Col,
  Row,
  Card,
  Table,
  Divider,
  Button,
  Form,
  Select,
  Spin,
  Space,
  Modal,
  Checkbox,
  Tree,
  Input,
} from "antd";
import React, { useEffect, useState } from "react";
import { getThongSoMay, getUIItemMenu } from "../../../api/ui/main";
import { baseURL } from "../../../config";
import { exportThongSoMay } from "../../../api/ui/export";
import dayjs from "dayjs";
import { getMachineList, getMachineParamLogs } from "../../../api/ui/machine";
import "../style.scss";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

const Equipment2 = (props) => {
  document.title = "UI - Thông số máy";
  const [listMachines, setListMachines] = useState([]);
  const [listStaffs, setListStaffs] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState();
  const [dataTable, setDataTable] = useState([])
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPage, setTotalPage] = useState(20);
  const [params, setParams] = useState({
    start_date: dayjs(),
    end_date: dayjs()
  });
  const defaultColumns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (value, record, index) => index + 1,
      align: "center",
      fixed: "left",
      width: 50
    },
    {
      title: "Ngày sản xuất",
      dataIndex: "ngay_sx",
      key: "ngay_sx",
      align: "center",
      fixed: "left",
      width: 150
    },
    {
      title: "Lô sản xuất",
      dataIndex: "lo_sx",
      key: "lo_sx",
      align: "center",
      fixed: "left",
      width: 150
    },
    {
      title: "Mã máy",
      dataIndex: "machine_id",
      key: "machine_id",
      fixed: "left",
      align: "center",
      width: 70
    },
  ];
  const [columnTable, setColumnTable] = useState(defaultColumns);
  const mapColumns = (item) => {
    const newItem = {
      ...item,
      dataIndex: item.key,
      align: 'center',
      width: 90
    }
    if (item.children && (item.children ?? []).length > 0) {
      newItem.children = item.children.map(mapColumns)
    }
    return newItem
  }
  const loadData = async (params) => {
    setLoading(true);
    const res = await getMachineParamLogs(params);
    if (res.success) {
      setDataTable(res.data.data);
      setColumnTable([...defaultColumns, ...res.data.columns.map(mapColumns)]);
      setTotalPage(res.data.totalPage)
    }
    setLoading(false);
  }
  async function btn_click(page = 1, pageSize = 20) {
    setPage(page);
    setPageSize(pageSize)
    loadData({ ...params, page, pageSize });
  }
  useEffect(() => {
    (async () => {
      const res1 = await getMachineList({is_iot: true});
      setListMachines(res1.data.map(e=>({...e, value: e.id, label: e.name})));
    })();
    btn_click();
  }, []);
  const [loading, setLoading] = useState(false);

  const [exportLoading, setExportLoading] = useState(false);
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportThongSoMay({ ...params, lo_sx: loSX });
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
  const [openDetail, setOpenDetail] = useState(false);

  const [loSX, setLoSX] = useState();
  const onClickRow = async (record) => {
    setLoSX(record.lo_sx);
  };
  const [itemsMenu, setItemMenu] = useState([]);
  const onCheck = (selectedKeys, e) => {
    const filteredKeys = selectedKeys.filter(
      (key) => !itemsMenu.some((e) => e.key === key)
    );
    setParams({ ...params, machine: filteredKeys });
  };
  const header = document.querySelector('.custom-card .ant-table-header');
  const pagination = document.querySelector('.custom-card .ant-pagination');
  const card = document.querySelector('.custom-card .ant-card-body');
  const [tableHeight, setTableHeight] = useState((card?.offsetHeight ?? 0) - 58 - (header?.offsetHeight ?? 0) - (pagination?.offsetHeight ?? 0));
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
  return (
    <>
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Card
              bodyStyle={{ paddingInline: 0, paddingTop: 0 }}
              className="custom-card scroll"
              actions={[
                <div
                  layout="vertical"
                >
                  <Button
                    type="primary"
                    style={{ width: "80%" }}
                    onClick={() => btn_click()}
                  >
                    Truy vấn
                  </Button>
                </div>
              ]}
            >
              <div className="mb-3">
                <Form style={{ margin: "0 15px" }} layout="vertical">
                  <Divider>Công đoạn</Divider>
                  <Form.Item className="mb-3">
                    <Select
                      allowClear
                      showSearch
                      onChange={(value) => {
                        setParams({ ...params, machine_id: value });
                      }}
                      placeholder="Chọn máy"
                      options={listMachines}
                    />
                  </Form.Item>
                </Form>
              </div>
              <Divider>Thời gian truy vấn</Divider>
              <div className="mb-3">
                <Form style={{ margin: "0 15px" }} layout="vertical">
                  {/* <RangePicker placeholder={["Bắt đầu", "Kết thúc"]} onChange={(value)=>setParams({...params, date: value})} value={params.date}/> */}
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
                </Form>
              </div>
              <Divider>Điều kiện truy vấn</Divider>
              <div className="mb-3">
                <Form
                  style={{ margin: "0 15px" }}
                  layout="vertical"
                  onValuesChange={(value) => setParams({ ...params, ...value })}
                >
                  <Form.Item label="Lô sản xuất" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          lo_sx: e.target.value,
                          page: 1,
                        });
                      }}
                      placeholder="Nhập lô sản xuất"
                    />
                  </Form.Item>
                  {/* <Form.Item label="Khách hàng" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          khach_hang: e.target.value,
                          page: 1,
                        });
                      }}
                      placeholder="Nhập tên khách hàng rút gọn"
                    />
                  </Form.Item> */}
                </Form>
              </div>
            </Card>
          </div>
        </Col>

        <Col span={20}>
          <Card
            title="Thông số máy"
            style={{ height: "100%" }}
            className="custom-card"
          >
            <Table
              loading={loading}
              size="small"
              bordered
              pagination={{
                current: page,
                size: "small",
                total: totalPage,
                pageSize: pageSize,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                  btn_click(page, pageSize);
                },
              }}
              scroll={{
                y: 'calc(100vh - 370px)',
              }}
              // style={{height:'100%'}}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    onClickRow(record);
                  },
                };
              }}
              columns={columnTable}
              dataSource={dataTable}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default withRouter(Equipment2);
