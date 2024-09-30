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
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useRef, useEffect } from "react";
import {
  createErrorMachines,
  deleteErrorMachines,
  exportErrorMachines,
  getErrorMachines,
  getLine,
  updateErrorMachines,
} from "../../../api";
import { useProfile } from "../../../components/hooks/UserHooks";
import EditableTable from "../../../components/Table/EditableTable";

const ErrorMachines = () => {
  document.title = "Quản lý lỗi máy";
  const { userProfile } = useProfile();
  const [listCheck, setListCheck] = useState([]);
  const [openMdl, setOpenMdl] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [params, setParams] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPage, setTotalPage] = useState(1);
  const [lineList, setLineList] = useState([]);
  const col_detailTable = [
    {
      title: "Mã lỗi",
      dataIndex: "code",
      key: "code",
      align: "center",
      fixed: "left",
      editable: true,
      width: 100
    },
    {
      title: "Tên lỗi",
      dataIndex: "ten_su_co",
      key: "ten_su_co",
      align: "center",
      editable: true,
      width: 220
    },
    {
      title: "Công đoạn",
      dataIndex: "line_id",
      key: "line_id",
      align: "center",
      render: (value) => lineList.find(e => e.value == value)?.label,
      editable: true,
      inputType: 'select',
      options: lineList,
      width: 100
    },
    {
      title: "Nguyên nhân",
      dataIndex: "nguyen_nhan",
      key: "nguyen_nhan",
      align: "center",
      editable: true,
      width: 200
    },
    {
      title: "Cách xử lý",
      dataIndex: "cach_xu_ly",
      key: "cach_xu_ly",
      align: "center",
      editable: true,
    },
  ];

  function btn_click(page = 1, pageSize = 20) {
    setPage(page);
    setPageSize(pageSize);
    loadListTable({ ...params, page, pageSize });
    tableRef.current.create(false);
  }

  const [data, setData] = useState([]);
  const loadListTable = async (params) => {
    setLoading(true);
    const res = await getErrorMachines(params);
    setData(
      res.data.map((e) => {
        return { ...e, key: e.id };
      })
    );
    setTotalPage(res.totalPage)
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      var res = await getLine();
      setLineList(res.map(e => ({ ...e, value: e.id, label: e.name })))
    })()
    btn_click()
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

  const onFinish = async (values) => {
    console.log(values);
    if (isEdit) {
      const res = await updateErrorMachines(values);
      console.log(res);
      if (res) {
        form.resetFields();
        setOpenMdl(false);
        btn_click()
      }
    } else {
      const res = await createErrorMachines(values);
      console.log(res);
      if (res) {
        form.resetFields();
        setOpenMdl(false);
        btn_click()
      }
    }
  };
  const onCreate = async (values) => {
    const res = await createErrorMachines(values);
    btn_click()
  };
  const onUpdate = async (values) => {
    const res = await updateErrorMachines(values);
    btn_click()
  };
  const onDelete = async (ids) => {
    const res = await deleteErrorMachines(ids);
    setListCheck([]);
    btn_click()
  };
  const tableRef = useRef();
  const insertRecord = () => {
    tableRef.current.create();
  }
  const [loadingExport, setLoadingExport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportErrorMachines(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
  const rowSelection = {
    selectedRowKeys: listCheck,
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys);
    },
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
  return (
    <>
      {contextHolder}
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Card style={{ height: "100%" }} bodyStyle={{ padding: 0 }} className="custom-card" actions={[
              <Button
                type="primary"
                onClick={() => btn_click()}
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
                  onFinish={() => btn_click()}
                >
                  <Form.Item label="Công đoạn" className="mb-3">
                    <Select
                      allowClear
                      onChange={(value) =>
                        setParams({ ...params, line_id: value })
                      }
                      onSelect={(value) =>
                        setParams({ ...params, line_id: value })
                      }
                      options={lineList}
                      placeholder="Chọn công đoạn"
                    />
                  </Form.Item>
                  <Form.Item label="Mã lỗi" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, code: e.target.value })
                      }
                      placeholder="Nhập mã lỗi"
                    />
                  </Form.Item>
                  <Form.Item label="Tên lỗi" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) =>
                        setParams({ ...params, ten_su_co: e.target.value })
                      }
                      placeholder="Nhập tên lỗi"
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
            title="Quản lý lỗi máy"
            className="custom-card"
            extra={
              <Space>
                <Upload
                  showUploadList={false}
                  name="files"
                  action={baseURL + "/api/error-machines/import"}
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
                <Button
                  type="primary"
                  onClick={exportFile}
                  loading={exportLoading}
                >
                  Export Excel
                </Button>
                <Button type="primary" onClick={insertRecord}>
                  Tạo
                </Button>
                <Popconfirm
                  title="Xoá bản ghi"
                  description={
                    "Bạn có chắc xoá " + listCheck.length + " bản ghi đã chọn?"
                  }
                  onConfirm={() => onDelete(data.reduce(function (filtered, option, index) {
                    if (listCheck.includes(index)) {
                      var someNewValue = option.id
                      filtered.push(someNewValue);
                    }
                    return filtered;
                  }, []))}
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
              loading={loading}
              size="small"
              bordered
              columns={col_detailTable}
              scroll={{
                x: "100%",
                y: 'calc(100vh - 290px)',
              }}
              ref={tableRef}
              pagination={{
                current: page,
                size: "small",
                total: totalPage,
                pageSize: pageSize,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                  btn_click(page, pageSize)
                },
              }}
              onUpdate={onUpdate}
              onCreate={onCreate}
              setDataSource={setData}
              onDelete={(record) => onDelete([record.id])}
              dataSource={data}
              rowSelection={rowSelection}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ErrorMachines;
