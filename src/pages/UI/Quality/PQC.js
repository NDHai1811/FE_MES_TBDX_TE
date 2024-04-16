import {
  Modal,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Row,
  Select,
  Table,
  Space,
  message,
  Popconfirm,
  Tree,
  Input,
} from "antd";
import React, { useState, useEffect } from "react";
import { getLines, getUIItemMenu } from "../../../api/ui/main";
import dayjs from "dayjs";
import {
  exportPQC,
  exportQCHistory,
  exportReportQC,
} from "../../../api/ui/export";
import { baseURL } from "../../../config";
import {
  getQCHistory,
  recheckQC,
} from "../../../api/ui/quality";

const QualityPQC = (props) => {
  document.title = "UI - PQC";
  const [listLines, setListLines] = useState([]);
  const [selectedLine, setSelectedLine] = useState();
  const [params, setParams] = useState({ start_date: dayjs(), end_date: dayjs(), page: 1, pageSize: 20 });
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  useEffect(() => {
    (async () => {
      const res1 = await getLines();
      setListLines(
        res1.data.map((e) => {
          return { ...e, label: e.name, value: e.id };
        })
      );
      const res2 = await getUIItemMenu();
      setItemMenu(res2.data);
    })();
  }, []);

  useEffect(() => {
    if (listLines.length > 0) setSelectedLine(listLines[1].id);
  }, [listLines]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [dataTable, setDataTable] = useState();
  const [dataLineChart, setDataLineChart] = useState([]);
  const [dataPieChart, setDataPieChart] = useState([]);

  const configPieChart = {
    data: dataPieChart,
    height: 100,
    angleField: "value",
    colorField: "name",
    radius: 0.5,
    innerRadius: 0.6,
    label: {
      type: "outer",
      offset: "120%",
      content: ({ name, percent }) =>
        `${name}` + " " + `${(percent * 100).toFixed(0)}%`,
      style: {
        textAlign: "center",
        fontSize: 14,
      },
    },
    legend: false,
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: false,
    },
  };
  const configLineChart = {
    data: dataLineChart,
    height: 100,
    xField: "date",
    yField: "value",
    seriesField: "error",
    legend: {
      position: "top",
    },
    smooth: true,
    animation: {
      appear: {
        animation: "path-in",
        duration: 5000,
      },
    },
  };

  const [messageApi, contextHolder] = message.useMessage();

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (value, record, index) => ((params.page - 1) * params.pageSize) + index + 1,
      fixed: "left",
      width: '50px'
    },
    {
      title: "Máy",
      dataIndex: "machine_id",
      key: "machine_id",
      align: "center",
      fixed: "left",
      width: '80px'
    },
    {
      title: "Khách hàng",
      dataIndex: "khach_hang",
      key: "khach_hang",
      align: "center",
    },
    {
      title: "MDH",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
      width: '100px'
    },
    {
      title: "Kích thước chuẩn",
      dataIndex: "quy_cach",
      key: "quy_cach",
      align: "center",
    },
    {
      title: "MQL",
      dataIndex: "mql",
      key: "mql",
      align: "center",
      width: '50px'
    },
    {
      title: "Sản lượng đếm được",
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
      title: "Tỷ lệ lỗi",
      dataIndex: "ty_le_loi",
      key: "ty_le_loi",
      align: "center",
    },
    {
      title: "Số phế",
      dataIndex: "sl_phe",
      key: "sl_phe",
      align: "center",
    },
    {
      title: "Tỷ lệ phế",
      dataIndex: "ty_le_ng",
      key: "ty_le_ng",
      align: "center",
    },
    {
      title: "KQ kiểm tra tính năng",
      dataIndex: "sl_tinh_nang",
      key: "sl_tinh_nang",
      align: "center",
    },
    {
      title: "KQ kiểm tra ngoại quan",
      dataIndex: "sl_ngoai_quan",
      key: "sl_ngoai_quan",
      align: "center",
    },
    {
      title: "Phán định",
      dataIndex: "phan_dinh",
      key: "phan_dinh",
      align: "center",
      render: (value, record) =>
        value === 1 ? "OK" : value === 2 ? "NG" : "waiting",
    },
    {
      title: "Lô sản xuất",
      dataIndex: "lo_sx",
      key: "lo_sx",
      align: "center",
    },
    {
      title: "Cho phép tái kiểm",
      dataIndex: "cho_phep_tai_kiem",
      key: "cho_phep_tai_kiem",
      align: "center",
      width: 100,
      render: (value, record) => (
        <Popconfirm
          disabled={record?.phan_dinh !== 2}
          title="Tái kiểm"
          description="Cho phép tái kiểm lot này?"
          okText="Có"
          placement="topRight"
          onConfirm={() => recheck(record.id)}
          cancelText="Không"
        >
          <Button disabled={record?.phan_dinh !== 2}>Tái kiểm</Button>
        </Popconfirm>
      ),
    },
  ];

  const recheck = async (id) => {
    var res = await recheckQC({ id });
  };

  function btn_click() {
    (async () => {
      setLoading(true);
      const res1 = await getQCHistory(params);
      setDataTable(res1.data);
      setTotalPage(res1.totalPage);
      setLoading(false);
    })();
  }

  useEffect(() => {
    btn_click();
  }, [page, pageSize])
  const [exportLoading, setExportLoading] = useState(false);

  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportPQC(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };

  const [loading, setLoading] = useState(false);

  const [exportLoading1, setExportLoading1] = useState(false);
  const exportFileDetail = async () => {
    setExportLoading1(true);
    const res = await exportQCHistory(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading1(false);
  };
  const [isModalBCOpen, setIsModalBCOpen] = useState(false);
  const showModalBC = () => {
    setIsModalBCOpen(true);
  };
  const closeModalBC = () => {
    setIsModalBCOpen(false);
  };
  const [formExportReport] = Form.useForm();
  const [exportLoading2, setExportLoading2] = useState(false);
  const exportReport = async (values) => {
    setExportLoading2(true);
    const res = await exportReportQC(values);
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
  }, [dataTable]);
  return (
    <React.Fragment>
      {contextHolder}
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
                    onClick={btn_click}
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
                  {/* <RangePicker placeholder={["Bắt đầu", "Kết thúc"]} /> */}
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
                      }}
                      placeholder="Nhập khách hàng"
                    />
                  </Form.Item>
                  <Form.Item label="MĐH" className="mb-3">
                    <Select
                      allowClear
                      showSearch
                      onChange={(value) => {
                        setParams({ ...params, mdh: value });
                      }}
                      open={false}
                      suffixIcon={null}
                      mode="tags"
                      placeholder="Nhập mã đơn hàng"
                      options={[]}
                    />
                  </Form.Item>
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
                  <Form.Item label="Kích thước chuẩn" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          quy_cach: e.target.value,
                          page: 1,
                        });
                      }}
                      placeholder="Nhập quy cách"
                    />
                  </Form.Item>
                  <Form.Item label="Máy" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          machine_id: e.target.value,
                          page: 1,
                        });
                      }}
                      placeholder="Nhập máy"
                    />
                  </Form.Item>
                  <Form.Item label="MQL" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          mql: e.target.value,
                          page: 1,
                        });
                      }}
                      placeholder="Nhập MQL"
                    />
                  </Form.Item>
                  <Form.Item label="Tỉ lệ lỗi" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          ti_le_loi: e.target.value,
                          page: 1,
                        });
                      }}
                      placeholder="Nhập tỉ lệ lỗi"
                    />
                  </Form.Item>
                  <Form.Item label="Tỉ lệ phế" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          ti_le_phe: e.target.value,
                          page: 1,
                        });
                      }}
                      placeholder="Nhập tỉ lệ phế"
                    />
                  </Form.Item>
                  <Form.Item label="Phán định" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          phan_dinh: e.target.value,
                          page: 1,
                        });
                      }}
                      placeholder="Nhập phán định"
                    />
                  </Form.Item>
                </Form>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Row gutter={[8, 8]} style={{ height: '100%' }}>
            <Col span={24}>
              <Card
                title="Danh sách kiểm tra QC"
                className="custom-card"
                style={{ height: "100%", padding: "0px" }}
                extra={
                  <Space>
                    <Button
                      type="primary"
                      loading={exportLoading}
                      onClick={exportFile}
                    >
                      Xuất excel
                    </Button>
                  </Space>
                }
              >
                <Table
                  loading={loading}
                  bordered
                  size="small"
                  columns={columns}
                  dataSource={dataTable}
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
                    x: "120vw",
                    y: tableHeight,
                  }}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default QualityPQC;
