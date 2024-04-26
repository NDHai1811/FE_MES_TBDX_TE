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
import { getMachineParamLogs } from "../../../api/ui/machine";
import "../style.scss";

const dataChart = Array.from({ length: 12 }, (_, i) => ({
  time: `10:${String(i * 5).padStart(2, "0")}`,
  value: Math.floor(Math.random() * 400),
}));

const cards = [
  {
    name: "Độ nhớt hồ",
    checked: false,
  },
  {
    name: "Nhiệt độ",
    checked: false,
  },
  {
    name: "Lực ép lô láng C",
    checked: false,
  },
  {
    name: "Khe hở lô hồ",
    checked: false,
  },
  {
    name: "Thông số",
    checked: false,
  },
  {
    name: "Thông số",
    checked: false,
  },
  {
    name: "Thông số",
    checked: false,
  },
  {
    name: "Thông số",
    checked: false,
  },
  {
    name: "Thông số",
    checked: false,
  },
  {
    name: "Thông số",
    checked: false,
  },
];

const col_detailTable = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    render: (value, record, index) => index + 1,
    align: "center",
    fixed: "left",
  },
  {
    title: "Ngày sản xuất",
    dataIndex: "ngay_sx",
    key: "ngay_sx",
    align: "center",
    fixed: "left",
  },
  {
    title: "Lô sản xuất",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
    fixed: "left",
  },
  {
    title: "Lot sản xuất",
    dataIndex: "lot_id",
    key: "lot_id",
    align: "center",
    fixed: "left",
    render: (value, record, index) =>
      record.lo_sx + "00" + Math.floor(Math.random() * 10),
  },
  {
    title: "Mã máy",
    dataIndex: "machine_id",
    key: "machine_id",
    fixed: "left",
    align: "center",
  },
  {
    title: "Sóng",
    dataIndex: "S01",
    key: "S01",
    align: "center",
    children: [
      {
        title: "Số m đã chạy lô cuốn 1",
        dataIndex: "Roll1_Counter",
        key: "Roll1_Counter",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Số m đã chạy lô cuốn 2",
        dataIndex: "Roll2_Counter",
        key: "Roll2_Counter",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Số m đã chạy lô cuốn 3",
        dataIndex: "Roll3_Counter",
        key: "Roll3_Counter",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Số m đã chạy lô cuốn 4",
        dataIndex: "Roll4_Counter",
        key: "Roll4_Counter",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Số m đã chạy lô cuốn 5",
        dataIndex: "Roll5_Counter",
        key: "Roll5_Counter",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Số m đã chạy lô cuốn 6",
        dataIndex: "Roll6_Counter",
        key: "Roll6_Counter",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Số m đã chạy lô cuốn 7",
        dataIndex: "Roll7_Counter",
        key: "Roll7_Counter",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Cảnh báo hết nguyên liệu lô cuốn 1",
        dataIndex: "Roll1_Alarm",
        key: "Roll1_Alarm",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Cảnh báo hết nguyên liệu lô cuốn 2",
        dataIndex: "Roll2_Alarm",
        key: "Roll2_Alarm",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Cảnh báo hết nguyên liệu lô cuốn 3",
        dataIndex: "Roll3_Alarm",
        key: "Roll3_Alarm",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Cảnh báo hết nguyên liệu lô cuốn 4",
        dataIndex: "Roll4_Alarm",
        key: "Roll4_Alarm",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Cảnh báo hết nguyên liệu lô cuốn 5",
        dataIndex: "Roll5_Alarm",
        key: "Roll5_Alarm",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Cảnh báo hết nguyên liệu lô cuốn 6",
        dataIndex: "Roll6_Alarm",
        key: "Roll6_Alarm",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Cảnh báo hết nguyên liệu lô cuốn 7",
        dataIndex: "Roll7_Alarm",
        key: "Roll7_Alarm",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Tốc độ lô cuốn 1",
        dataIndex: "Roll1_Speed",
        key: "Roll1_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Tốc độ lô cuốn 2",
        dataIndex: "Roll2_Speed",
        key: "Roll2_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Tốc độ lô cuốn 3",
        dataIndex: "Roll3_Speed",
        key: "Roll3_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Tốc độ lô cuốn 4",
        dataIndex: "Roll4_Speed",
        key: "Roll4_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Tốc độ lô cuốn 5",
        dataIndex: "Roll5_Speed",
        key: "Roll5_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Tốc độ lô cuốn 6",
        dataIndex: "Roll6_Speed",
        key: "Roll6_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Tốc độ lô cuốn 7",
        dataIndex: "Roll7_Speed",
        key: "Roll7_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Khe hở lô hồ",
        dataIndex: "Roll7_Speed",
        key: "Roll7_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Độ nhớt hồ đầu C",
        dataIndex: "do_nhot_ho_c",
        key: "Roll7_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Độ nhớt hồ đầu B",
        dataIndex: "do_nhot_ho_b",
        key: "Roll7_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Độ nhớt hồ đầu E",
        dataIndex: "do_nhot_ho_e",
        key: "Roll7_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Độ nhớt hồ đầu F",
        dataIndex: "do_nhot_ho_f",
        key: "Roll7_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
    ],
  },
  {
    title: "In",
    dataIndex: "IN",
    key: "IN",
    align: "center",
    children: [
      {
        title: "Tốc độ máy",
        dataIndex: "Machine_Speed",
        key: "Machine_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Góc chỉnh film",
        dataIndex: "Film_Angle",
        key: "Film_Angle",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Độ nhớt mực lô 1",
        dataIndex: "do_nhot_muc_lo_1",
        key: "do_nhot_muc_lo_1",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Độ nhớt mực lô 2",
        dataIndex: "do_nhot_muc_lo_2",
        key: "do_nhot_muc_lo_2",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Độ nhớt mực lô 3",
        dataIndex: "do_nhot_muc_lo_3",
        key: "do_nhot_muc_lo_3",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Độ nhớt mực lô 4",
        dataIndex: "do_nhot_muc_lo_4",
        key: "do_nhot_muc_lo_4",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Độ nhớt mực lô 5",
        dataIndex: "do_nhot_muc_lo_5",
        key: "do_nhot_muc_lo_5",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô film 1",
        dataIndex: "ap_luc_ep_lo_film_1",
        key: "ap_luc_ep_lo_film_1",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô film 2",
        dataIndex: "ap_luc_ep_lo_film_2",
        key: "ap_luc_ep_lo_film_2",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô film 3",
        dataIndex: "ap_luc_ep_lo_film_3",
        key: "ap_luc_ep_lo_film_3",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô film 4",
        dataIndex: "ap_luc_ep_lo_film_4",
        key: "ap_luc_ep_lo_film_4",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô film 5",
        dataIndex: "ap_luc_ep_lo_film_5",
        key: "ap_luc_ep_lo_film_5",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô mực 1",
        dataIndex: "ap_luc_ep_lo_muc_1",
        key: "ap_luc_ep_lo_muc_1",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô mực 2",
        dataIndex: "ap_luc_ep_lo_muc_2",
        key: "ap_luc_ep_lo_muc_2",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô mực 3",
        dataIndex: "ap_luc_ep_lo_muc_3",
        key: "ap_luc_ep_lo_muc_3",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô mực 4",
        dataIndex: "ap_luc_ep_lo_muc_4",
        key: "ap_luc_ep_lo_muc_4",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô mực 5",
        dataIndex: "ap_luc_ep_lo_muc_5",
        key: "ap_luc_ep_lo_muc_5",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
    ],
  },
  {
    title: "Dán",
    dataIndex: "Dan",
    key: "Dan",
    align: "center",
    children: [
      {
        title: "Tốc độ máy",
        dataIndex: "Machine_Speed",
        key: "Machine_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
    ],
  },
];
// Array.prototype.random = function () {
//   return this[Math.floor(Math.random() * this.length)];
// };
// const dataTable = Array.from({ length: 32 }, (_, i) => {
//   return {
//     machine_id: ["S01", "P15", "P06", "D05", "D06"].random(),
//     khach_hang: "VICTORY",
//     don_hang: "A21" + Math.floor(Math.random() * 30),
//     lo_sx: [
//       "231209043",
//       "231209044",
//       "231209001",
//       "231209002",
//       "231209003",
//     ].random(),
//     ngay_sx: dayjs(
//       new Date(+new Date() - Math.floor(Math.random() * 10000000000))
//     ).format("DD/MM/YYYY HH:mm:ss"),
//   };
// });

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
    console.log(columnTable);
  }, [columnTable]);
  useEffect(() => {
    (async () => {
      const res1 = await getUIItemMenu();
      setItemMenu(res1.data);
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
                    <Tree
                      checkable
                      onCheck={onCheck}
                      treeData={itemsMenu}
                    />
                  </Form.Item>
                </Form>
              </div>
              {/* <div className="mb-3">
                <Form style={{ margin: "0 15px" }} layout="vertical">
                  <Form.Item label="Phân loại" className="mb-3">
                    <Select
                      allowClear
                      placeholder="Chọn phân loại"
                      options={listMachines}
                      onChange={(value) =>
                        setParams({ ...params, machine_code: value })
                      }
                    />
                  </Form.Item>
                </Form>
              </div> */}
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
          // extra={
          //   <>
          //     <Button
          //       type="primary"
          //       onClick={exportFile}
          //       loading={exportLoading}
          //     >
          //       Xuất excel
          //     </Button>
          //     <Button
          //       type="primary"
          //       onClick={exportFile}
          //       loading={exportLoading}
          //       style={{ marginLeft: 12 }}
          //     >
          //       Report
          //     </Button>
          //   </>
          // }
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
                y: tableHeight,
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

export default Equipment2;
