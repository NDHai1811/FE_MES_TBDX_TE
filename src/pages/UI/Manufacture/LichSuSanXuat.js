import React, { useState, useEffect } from "react";
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
  Space,
  Spin,
  Tree,
  Input,
  Popconfirm,
} from "antd";
import "../style.scss";
import {
  getUIItemMenu,
} from "../../../api/ui/main";
import {
  exportProduceHistory,
  exportReportProduceHistory,
} from "../../../api/ui/export";
import { baseURL } from "../../../config";
import dayjs from "dayjs";
import {
  deleteProductionHistory,
  getProduceOverall,
  getProducePercent,
  getProduceTable,
} from "../../../api/ui/manufacture";
import { useProfile } from "../../../components/hooks/UserHooks";
import { DeleteOutlined } from "@ant-design/icons";

const columns1 = [
  {
    title: "Số lượng đầu ra (kế hoạch)",
    dataIndex: "sl_kh",
    key: "sl_kh",
    align: "center",
  },
  {
    title: "Số lượng sau QC (thực tế)",
    dataIndex: "sl_ok",
    key: "sl_ok",
    align: "center",
  },
  {
    title: "Chênh lệch thực tế - kế hoạch",
    dataIndex: "chenh_lech",
    key: "chenh_lech",
    align: "center",
  },
  {
    title: "Tỷ lệ hoàn thành",
    dataIndex: "ty_le",
    key: "ty_le",
    align: "center",
  },
  {
    title: "Số phế",
    dataIndex: "sl_phe",
    key: "sl_phe",
    className: "red",
    align: "center",
  },
];
const columns2 = [
  {
    title: "Lô SX",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
  },
  {
    title: "Sóng",
    dataIndex: "30",
    key: "30",
    align: "center",
    render: (value) => value ?? 0,
  },
  {
    title: "In",
    dataIndex: "31",
    key: "31",
    align: "center",
    render: (value) => value ?? 0,
  },
  {
    title: "Dán",
    dataIndex: "32",
    key: "32",
    align: "center",
    render: (value) => value ?? 0,
  },
  {
    title: "Xả lót",
    dataIndex: "33",
    key: "33",
    align: "center",
    render: (value) => value ?? 0,
  },
];

const LichSuSanXuat = (props) => {
  document.title = "UI - Lịch sử sản xuất";
  const [params, setParams] = useState({
    page: 1,
    pageSize: 20,
    start_date: dayjs(),
    end_date: dayjs()
  });
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  useEffect(() => {
    (async () => {
      const res1 = await getUIItemMenu();
      setItemMenu(res1.data);
    })();
    btn_click();
  }, []);
  
  

  const columns3 = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: "3%",
      render: (value, record, index) => ((page - 1) * pageSize) + index + 1,
    },
    {
      title: "Ngày sản xuất",
      dataIndex: "ngay_sx",
      key: "ngay_sx",
      align: "center",
      width: "6%",
    },
    {
      title: "Máy",
      dataIndex: "machine_id",
      key: "machine_id",
      align: "center",
      width: "4%",
    },
    {
      title: "Khách hàng",
      dataIndex: "khach_hang",
      key: "khach_hang",
      align: "center",
      width: "6%",
    },
    {
      title: "MDH",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
      width: "6%",
    },
    {
      title: "MQL",
      dataIndex: "mql",
      key: "mql",
      align: "center",
      width: "3%",
    },
    {
      title: "Quy cách",
      dataIndex: "quy_cach",
      key: "quy_cach",
      align: "center",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "thoi_gian_bat_dau",
      key: "thoi_gian_bat_dau",
      align: "center",
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "thoi_gian_ket_thuc",
      key: "thoi_gian_ket_thuc",
      align: "center",
    },
    {
      title: "Sản lượng đầu ra",
      dataIndex: "sl_dau_ra_hang_loat",
      key: "sl_dau_ra_hang_loat",
      align: "center",
    },
    {
      title: "Sản lượng sau QC",
      dataIndex: "sl_ok",
      key: "sl_ok",
      align: "center",
    },
    {
      title: "Số lượng phế",
      dataIndex: "sl_phe",
      key: "sl_phe",
      align: "center",
    },
    {
      title: "Đợt",
      dataIndex: "dot",
      key: "dot",
      align: "center",
    },
    {
      title: "Tên công nhân sản xuất",
      dataIndex: "user_name",
      key: "user_name",
      align: "center",
    },
    {
      title: "Lô sản xuất",
      dataIndex: "lo_sx",
      key: "lo_sx",
      align: "center",
    },
    {
      title: "Bước",
      dataIndex: "step",
      key: "step",
      align: "center",
      render: (value) => value ? 'Bước' : '',
    },
  ];

  const [dataTable1, setDataTable1] = useState([]);
  const [dataTable2, setDataTable2] = useState([]);
  const [dataTable3, setDataTable3] = useState([]);

  function btn_click(page = 1, pz = pageSize) {
    setPageSize(pz);
    var maxP = Math.ceil(totalPage / pz);
    if (page > maxP) {
      setPage(maxP);
    } else {
      setPage(page);
    }
    (async () => {
      setLoading(true);
      // const res1 = await getProduceOverall(params);
      // const res2 = await getProducePercent(params);
      const res3 = await getProduceTable({...params, page, pageSize: pz});
      // setDataTable1(res1.data);
      // setDataTable2(
      //   Object.keys(res2.data ?? {}).map((key) => {
      //     return { ...res2.data[key], lo_sx: key };
      //   })
      // );
      setTotalPage(res3.data.totalPage);
      setDataTable3(res3.data.data);
      setLoading(false);
    })();
  }
  const [exportLoading1, setExportLoading1] = useState(false);
  const [exportLoading2, setExportLoading2] = useState(false);
  const exportFile = async () => {
    setExportLoading1(true);
    const res = await exportProduceHistory(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading1(false);
  };
  const [loading, setLoading] = useState(false);
  const reportProduceHistory = async () => {
    setExportLoading2(true);
    const res = await exportReportProduceHistory(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading2(false);
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
  }, [dataTable3]);
  const { userProfile } = useProfile();
  const deleteItem = async (id) => {
    var res = await deleteProductionHistory(id);
    if(res.success){
      btn_click();
    }
  }
  var historyColumns = [];
  if ((userProfile?.permission ?? []).includes('*')) {
    historyColumns = [...columns3,
    {
      title: 'Hành động',
      dataIndex: 'action',
      align: "center",
      fixed: "right",
      width: 70,
      render: (_, record) => {
        return (
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => deleteItem(record.id)}
            placement="topRight"
          >
            <DeleteOutlined
              style={{
                color: "red",
                fontSize: 20,
              }}
            />
          </Popconfirm>
        );
      },
    }
    ];
  }else{
    historyColumns = [...columns3];
  }
  return (
    <React.Fragment>
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Card
              // style={{ height: "100%", marginBottom: 10 }}
              bodyStyle={{ paddingInline: 0, paddingTop: 0 }}
              className="custom-card scroll"
              actions={[
                <div
                  layout="vertical"
                >
                  <Button
                    type="primary"
                    style={{ width: "80%" }}
                    onClick={()=>btn_click()}
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
              <Divider>Thời gian truy vấn</Divider>
              <div className="mb-3">
                <Form style={{ margin: "0 15px" }} layout="vertical">
                  <Space direction="vertical" style={{ width: "100%" }}>
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
                  </Space>
                </Form>
              </div>
              <Divider>Điều kiện truy vấn</Divider>
              <div className="mb-3">
                <Form style={{ margin: "0 15px" }} layout="vertical">
                  <Form.Item label="Khách hàng" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          customer_id: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập khách hàng"
                    />
                  </Form.Item>
                  <Form.Item label="MĐH" className="mb-3">
                    <Select
                      allowClear
                      showSearch
                      onChange={(value) => {
                        setParams({ ...params, mdh: value, page: 1 });
                        setPage(1);
                      }}
                      open={false}
                      suffixIcon={null}
                      mode="tags"
                      placeholder="Nhập mã đơn hàng"
                      options={[]}
                    />
                  </Form.Item>
                  <Form.Item label="MQL" className="mb-3">
                    <Select
                      allowClear
                      showSearch
                      onChange={(value) => {
                        setParams({ ...params, mql: value, page: 1 });
                        setPage(1);
                      }}
                      open={false}
                      suffixIcon={null}
                      mode="tags"
                      placeholder="Nhập MQL"
                      options={[]}
                    />
                  </Form.Item>
                  <Form.Item label="Lô Sản xuất" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          lo_sx: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập lô sản xuất"
                    />
                  </Form.Item>
                  <Form.Item label="Quy cách" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          quy_cach: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập quy cách"
                    />
                  </Form.Item>
                  <Form.Item label="Đợt" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          dot: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập đợt"
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
            title="Lịch sử sản xuất"
            className="custom-card"
            extra={
              <Space>
                {/* <Button
                  type="primary"
                  onClick={reportProduceHistory}
                  loading={exportLoading2}
                >
                  Xuất báo cáo
                </Button> */}
                <Button
                  type="primary"
                  onClick={exportFile}
                  loading={exportLoading1}
                >
                  Xuất Excel
                </Button>
              </Space>
            }
          >
            <Spin spinning={loading}>
              {/* <Table
                className="mb-2"
                size="small"
                bordered
                locale={{ emptyText: "Trống" }}
                pagination={false}
                columns={columns1}
                dataSource={dataTable1}
              /> */}
              {/* <Table
                className="mb-2"
                size="small"
                bordered
                locale={{ emptyText: "Trống" }}
                pagination={false}
                columns={columns2}
                scroll={{
                  y: window.innerHeight * 0.05,
                }}
                dataSource={dataTable2}
              /> */}
              <Table
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
                  x: "120vw",
                  y: tableHeight,
                }}
                columns={historyColumns}
                dataSource={dataTable3}
              />
            </Spin>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default LichSuSanXuat;
