import {
  DatePicker,
  Col,
  Row,
  Card,
  Table,
  Tag,
  Layout,
  Divider,
  Button,
  Form,
  Input,
  theme,
  Select,
  AutoComplete,
  Upload,
  message,
  Checkbox,
  Space,
  Modal,
  Spin,
  Popconfirm,
  InputNumber,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useRef, useEffect } from "react";
import {
  createKhuon,
  deleteKhuon,
  exportKhuon,
  getKhuon,
  getMachines,
  updateKhuon,
} from "../../../api";
import { useProfile } from "../../../components/hooks/UserHooks";
import EditableTable from "../../../components/Table/EditableTable";

const PL1s = [
  {
    label: "THÙNG",
    value: "thung",
  },
  {
    label: "PAD",
    value: "pad",
  },
  {
    label: "INNER",
    value: "inner",
  },
];
const Khuon = () => {
  document.title = "Quản lý khuôn";
  const [listCheck, setListCheck] = useState([]);
  const [openMdl, setOpenMdl] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [params, setParams] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPage, setTotalPage] = useState(1);
  const [machineList, setMachineList] = useState([]);
  const col_detailTable = [
    {
      title: "Khách hàng",
      dataIndex: "customer_id",
      align: "center",
      editable: true
    },
    {
      title: "Kích thước ĐH",
      dataIndex: "kich_thuoc_dh",
      align: "center",
      editable: true,
      children: [
        {
          title: "Dài",
          dataIndex: "dai",
          align: "center",
          editable: true
        },
        {
          title: "Rộng",
          dataIndex: "rong",
          align: "center",
          editable: true
        },
        {
          title: "Cao",
          dataIndex: "cao",
          align: "center",
          editable: true
        },
        {
          title: "Kích thước chuẩn",
          dataIndex: "kich_thuoc",
          align: "center",
          editable: true
        },
      ]
    },
    {
      title: "Phân loại 1",
      dataIndex: "phan_loai_1",
      align: "center",
      editable: true,
      render: (value)=>PL1s.find(e=>e.value === value)?.label ?? ""
    },
    {
      title: "Mã buyer",
      dataIndex: "buyer_id",
      align: "center",
      editable: true
    },
    {
      title: "Khuôn bế",
      dataIndex: "khuon_be",
      align: "center",
      editable: true,
      children: [
        {
          title: "Khổ",
          dataIndex: "kho_khuon",
          align: "center",
          editable: true
        },
        {
          title: "Dài",
          dataIndex: "dai_khuon",
          align: "center",
          editable: true
        },
        {
          title: "Số con",
          dataIndex: "so_con",
          align: "center",
          editable: true
        },
      ]
    },
    {
      title: "Số mảnh ghép",
      dataIndex: "so_manh_ghep",
      align: "center",
      editable: true
    },
    {
      title: "Mã khuôn bế",
      dataIndex: "khuon_id",
      align: "center",
      editable: true
    },
    {
      title: "Máy",
      dataIndex: "machine_id",
      align: "center",
      editable: true
    },
    {
      title: "SL khuôn (số khuôn/bộ)",
      dataIndex: "sl_khuon",
      align: "center",
      editable: true
    },
    {
      title: "Ghi chú Buyer",
      dataIndex: "buyer_note",
      align: "center",
      editable: true
    },
    {
      title: "Ghi chú khác",
      dataIndex: "note",
      align: "center",
      editable: true
    },
    {
      title: "Layout",
      dataIndex: "layout",
      align: "center",
      editable: true
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      align: "center",
      editable: true
    },
    {
      title: "Ngày đặt khuôn",
      dataIndex: "ngay_dat_khuon",
      align: "center",
      editable: true
    },
  ];

  function btn_click() {
    loadListTable({...params, page: 1, pageSize: 20});
    setPage(1);
    setPageSize(20);
  }

  const [data, setData] = useState([]);
  const loadListTable = async (params) => {
    setLoading(true);
    const res = await getKhuon(params);
    setData(res.data);
    setTotalPage(res.totalPage);
    tableRef.current.create(false);
    setLoading(false);
  };
  useEffect(() => {
    loadListTable({ ...params, page: page, pageSize: pageSize });
  }, [page, pageSize]);

  useEffect(() => {
    (async () => {
      var res = await getMachines();
      setMachineList(res.map(e => ({ value: e.id, label: e.id })));
    })();
  }, []);

  const [messageApi, contextHolder] = message.useMessage();

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

  const updateRecord = async (record) => {
    const res = await updateKhuon(record);
    if (res) {
      btn_click()
    }
  }
  const createRecord = async (record) => {
    const res = await createKhuon(record);
    btn_click()
  }
  const deleteRecord = async (record) => {
    if (record) {
      const res = await deleteKhuon([record.id]);
      setListCheck([]);
      btn_click()
    } else {
      if (listCheck.length > 0) {
        const res = await deleteKhuon(listCheck);
        setListCheck([]);
        btn_click()
      } else {
        message.info("Chưa chọn bản ghi cần xóa");
      }
    }
  };
  const insertRecord = () => {
    onClick();
  };
  const tableRef = useRef();
  const onClick = (event) => {
    tableRef.current.create(true);
  }
  const [loadingExport, setLoadingExport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportKhuon(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
  const rowSelection = {
    fixed: true,
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys);
    },
  };
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
  return (
    <>
      {contextHolder}
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Card style={{ height: "100%" }} styles={{ body: { padding: 0 } }} className="custom-card" actions={[
              <Button
                type="primary"
                onClick={btn_click}
                style={{ width: "80%" }}
              >
                Tìm kiếm
              </Button>
            ]}>
              <Divider>Tìm kiếm</Divider>
              <div className="mb-3">
                <Form
                  style={{ margin: "0 15px" }}
                  layout="vertical"
                  onFinish={btn_click}
                >
                  <Form.Item label="Mã khuôn" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, id: e.target.value })
                      }
                      placeholder="Nhập mã khuôn"
                    />
                  </Form.Item>
                  <Button hidden htmlType="submit"></Button>
                </Form>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Card
            style={{ height: "100%" }}
            title="Danh sách mã khuôn bế theo mã Buyer KH"
            className="custom-card"
            extra={
              <Space>
                <Upload
                  showUploadList={false}
                  name="files"
                  action={baseURL + "/api/khuon/import"}
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
                        btn_click()
                        success();
                        setLoadingExport(false);
                      } else {
                        btn_click()
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
                {/* <Button
                  type="primary"
                  onClick={editRecord}
                  disabled={listCheck.length <= 0}
                >
                  Edit
                </Button> */}
                <Button type="primary" onClick={insertRecord}>
                  Thêm
                </Button>
                <Popconfirm
                  title="Xoá bản ghi"
                  description={
                    "Bạn có chắc xoá " + listCheck.length + " bản ghi đã chọn?"
                  }
                  onConfirm={deleteRecord}
                  okText="Có"
                  cancelText="Không"
                  placement="bottomRight"
                >
                  <Button type="primary" disabled={listCheck.length <= 0}>
                    Xoá
                  </Button>
                </Popconfirm>
              </Space>
            }
          >
            <EditableTable
              ref={tableRef}
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
                  setPage(page);
                  setPageSize(pageSize);
                  setParams({ ...params, page: page, pageSize: pageSize });
                },
              }}
              scroll={{
                x: "150vw",
                y: tableHeight,
              }}
              columns={col_detailTable}
              dataSource={data}
              rowSelection={rowSelection}
              onUpdate={updateRecord}
              onCreate={createRecord}
              setDataSource={setData}
              onDelete={deleteRecord}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Khuon;
