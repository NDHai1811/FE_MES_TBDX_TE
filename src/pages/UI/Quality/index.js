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
  exportQCHistory,
  getQCHistory,
  recheckQC,
} from "../../../api/ui/quality";
import { getMachineList } from "../../../api/ui/machine";
import { baseURL } from "../../../config";
import dayjs from "dayjs";

const QualityPQC = (props) => {
  document.title = "UI - Quality";
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
      title: "Máy",
      dataIndex: "machine_id",
      key: "machine_id",
      align: "center",
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
        value === 1 ? "OK" : value === 2 ? "NG" : "pass",
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
          description="Cho phép tái kiểm lô này?"
          okText="Có"
          placement="topRight"
          onConfirm={() => recheck(record.id)}
          cancelText="Không"
        >
          <Button type="primary" disabled={record?.phan_dinh !== 2}>Tái kiểm</Button>
        </Popconfirm>
      ),
    },
  ];

  const recheck = async (id) => {
    var res = await recheckQC({ id });
    btn_click(page, pageSize);
  };

  const loadData = async (params) => {
    setLoading(true);
    const res1 = await getQCHistory(params);
    setDataTable(res1.data);
    setTotalPage(res1.totalPage);
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
    const res = await exportQCHistory(params);
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
                <div className="mb-3">
                  <Divider>Công đoạn</Divider>
                  <Form.Item className="mb-3">
                    <Tree
                      checkable
                      onCheck={onCheck}
                      treeData={itemsMenu}
                    />
                  </Form.Item>
                </div>
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
                  <Form.Item label="Phán định" className="mb-3">
                    <Select
                      allowClear
                      options={[
                        { value: '1', label: "OK" },
                        { value: '2', label: "NG" },
                      ]}
                      onChange={(value) => {
                        setParams({
                          ...params,
                          phan_dinh: value,
                          page: 1,
                        });
                      }}
                      onSelect={(value) => {
                        setParams({
                          ...params,
                          phan_dinh: value,
                          page: 1,
                        });
                      }}
                      placeholder="Nhập phán định"
                    />
                  </Form.Item>
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
                  rowClassName={(record, index) =>
                    record.phan_dinh == 1
                      ? "table-row-grey"
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
