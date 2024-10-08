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
import {
  exportIQCHistory,
  exportQCHistory,
  getIQCHistory,
  getQCHistory,
  recheckQC,
} from "../../../api/ui/quality";
import { getMachineList } from "../../../api/ui/machine";
import { baseURL } from "../../../config";
import dayjs from "dayjs";

const QualityIQC = (props) => {
  document.title = "UI - IQC";
  const [listLines, setListLines] = useState([]);
  const [selectedLine, setSelectedLine] = useState();
  const [params, setParams] = useState({ start_date: dayjs(), end_date: dayjs(), page: 1, pageSize: 20 });
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [listMachines, setListMachines] = useState([]);
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
      // const res3 = await getMachineList();
      // setListMachines(res3.data.map((e) => ({ ...e, label: e.name + ' (' + e.id + ')', value: e.id })));
    })();
    btn_click();
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
  const [testCriteriaColumns, setTestCriteriaColumns] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (value, record, index) => ((params.page - 1) * params.pageSize) + index + 1,
      width: '50px'
    },
    {
      title: "Ngày kiểm",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      width: '100px',
      render: (value) => (value && dayjs(value).isValid()) ? dayjs(value).format('DD/MM/YYYY') : ""
    },
    {
      title: "Người kiểm",
      dataIndex: "user_name",
      key: "user_name",
      align: "center",
      width: '200px'
    },
    {
      title: "Mã cuộn",
      dataIndex: "material_id",
      key: "material_id",
      align: "center",
      width: '90px'
    },
    {
      title: "Mã nhà cung cấp",
      dataIndex: "ten_ncc",
      key: "ten_ncc",
      align: "center",
      width: '130px'
    },
    {
      title: "Khối lượng cuộn",
      dataIndex: "so_kg",
      key: "so_kg",
      align: "center",
      width: '130px'
    },
    {
      title: "Loại giấy",
      dataIndex: "loai_giay",
      key: "loai_giay",
      align: "center",
      width: '90px'
    },
    {
      title: "Định lượng",
      dataIndex: "dinh_luong",
      key: "dinh_luong",
      align: "center",
      width: '90px'
    },
    {
      title: "Khổ giấy",
      dataIndex: "kho_giay",
      key: "kho_giay",
      align: "center",
      width: '90px'
    },
    {
      title: "Kết quả kiểm tra",
      children: testCriteriaColumns.map(e=>({...e, align: 'center', width: 100}))
    },
    {
      title: "Phán định",
      dataIndex: "phan_dinh",
      key: "phan_dinh",
      align: "center",
      width: '90px',
      render: (value) => value === 1 ? "OK" : value === 2 ? "NG" : "-"
    },
  ];

  const loadData = async (params) => {
    setLoading(true);
    const res1 = await getIQCHistory(params);
    setDataTable(res1.data);
    setTotalPage(res1.totalPage);
    setTestCriteriaColumns(res1.columns);
    setLoading(false);
  }

  function btn_click(page = 1, pageSize = 20) {
    setPage(page);
    setPageSize(pageSize)
    loadData({ ...params, page: page, pageSize: pageSize })
  }
  const [exportLoading, setExportLoading] = useState(false);

  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportIQCHistory(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };

  const [loading, setLoading] = useState(false);
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
                    onClick={() => btn_click()}
                  >
                    Truy vấn
                  </Button>
                </div>
              ]}
            >
              <Form style={{ margin: "0 15px" }} layout="vertical" onFinish={() => btn_click()}>
                <Divider>Thời gian truy vấn</Divider>
                <div className="mb-3">
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
                </div>
                <Divider>Điều kiện truy vấn</Divider>
                <div className="mb-3">
                  <Form.Item label="Mã cuộn" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          material_id: e.target.value,
                          page: 1,
                        });
                      }}
                      placeholder="Nhập mã cuộn"
                    />
                  </Form.Item>
                  <Form.Item label="Loại giấy" className="mb-3">
                    <Select
                      allowClear
                      showSearch
                      onChange={(value) => {
                        setParams({ ...params, loai_giay: value });
                      }}
                      open={false}
                      suffixIcon={null}
                      mode="tags"
                      placeholder="Nhập loại giấy"
                      options={[]}
                    />
                  </Form.Item>
                  {/* <Form.Item label="Định lượng" className="mb-3">
                    <Select
                      allowClear
                      showSearch
                      onChange={(value) => {
                        setParams({ ...params, dinh_luong: value, page: 1 });
                        setPage(1);
                      }}
                      open={false}
                      suffixIcon={null}
                      mode="tags"
                      placeholder="Nhập MQL"
                      options={[]}
                    />
                  </Form.Item>
                  <Form.Item label="Khổ giấy" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          kho_giay: e.target.value,
                          page: 1,
                        });
                      }}
                      placeholder="Nhập khổ giấy"
                    />
                  </Form.Item> */}
                </div>
                <Button hidden htmlType="submit"></Button>
              </Form>
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Row gutter={[8, 8]} style={{ height: '100%' }}>
            <Col span={24}>
              <Card
                title="Danh sách kiểm tra IQC"
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
                  rowClassName={(record, index) =>
                    record.phan_dinh == 1
                      ? "table-row-grey"
                      : record.phan_dinh == 2 ?
                        "table-row-red"
                        : ""
                  }
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
                      btn_click(page, pageSize);
                    },
                  }}
                  scroll={{
                    x: '100%',
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

export default QualityIQC;
