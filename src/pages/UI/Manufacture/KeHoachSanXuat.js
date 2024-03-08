import {
  DatePicker,
  Col,
  Row,
  Card,
  Table,
  Divider,
  Button,
  Form,
  Input,
  Select,
  Upload,
  message,
  Space,
  Spin,
  Tree,
  InputNumber,
  Popconfirm,
  Typography,
  Dropdown,
} from "antd";
import { baseURL } from "../../../config";
import { useReactToPrint } from "react-to-print";
import React, { useState, useEffect, useRef } from "react";
import { getUIItemMenu } from "../../../api/ui/main";
import {
  deleteRecordProductPlan,
  exportKHSX,
  exportKHXaLot,
  getListProductPlan,
  updateProductPlan,
} from "../../../api/ui/manufacture";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import dayjs from "dayjs";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
} from "@ant-design/icons";
import TemXaLot from "./TemXaLot";
import Tem from "../../OI/Manufacture/Tem";
import { useProfile } from "../../../components/hooks/UserHooks";

const LINE_SONG_ID = '30';
const LINE_IN_ID = '31';
const LINE_DAN_ID = '32';
const LINE_XA_LOT_ID = '33';
const SONG_MACHINE = ['S01'];
const KeHoachSanXuat = () => {
  document.title = "Kế hoạch sản xuất";
  const history = useHistory();
  const { userProfile } = useProfile();
  const [form] = Form.useForm();
  const [params, setParams] = useState({
    machine: SONG_MACHINE,
    start_date: dayjs(),
    end_date: dayjs(),
  });
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [listCheck, setListCheck] = useState([]);
  const [listPrintSong, setListPrintSong] = useState([]);
  const [listPrintXaLot, setListPrintXaLot] = useState([]);
  const componentRef1 = useRef();
  const componentRef2 = useRef();
  const col_detailTable = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (value, record, index) => ((page - 1) * pageSize) + index + 1,
      align: "center",
      width: 50,
    },
    {
      title: "Thứ tự ưu tiên",
      dataIndex: "thu_tu_uu_tien",
      key: "thu_tu_uu_tien",
      align: "center",
      width: 50,
      editable: true,
    },
    {
      title: "Lô sx",
      dataIndex: "lo_sx",
      key: "lo_sx",
      align: "center",
      width: 150,
    },
    {
      title: "Máy sx",
      dataIndex: "machine_id",
      key: "machine_id",
      align: "center",
      width: 100,
    },
    {
      title: "Khách hàng",
      dataIndex: "khach_hang",
      key: "khach_hang",
      align: "center",
      width: 150,
    },
    {
      title: "MDH",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
      width: 150,
    },
    {
      title: "MQL",
      dataIndex: "mql",
      key: "mql",
      align: "center",
      width: 50,
    },
    {
      title: "L",
      dataIndex: "dai",
      key: "dai",
      align: "center",
      width: 50,
    },
    {
      title: "W",
      dataIndex: "rong",
      key: "rong",
      align: "center",
      width: 50,
    },
    {
      title: "H",
      dataIndex: "cao",
      key: "cao",
      align: "center",
      width: 50,
    },
    {
      title: "Số lượng",
      dataIndex: "sl_kh",
      key: "sl_kh",
      align: "center",
      width: 60,
    },
    {
      title: "Khổ",
      dataIndex: "kho",
      key: "kho",
      align: "center",
      width: 60,
    },
    {
      title: "Kết cấu giấy",
      dataIndex: "ket_cau_giay",
      key: "ket_cau_giay",
      align: "center",
      width: 310,
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "thoi_gian_bat_dau",
      key: "thoi_gian_bat_dau",
      align: "center",
      width: 150,
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "thoi_gian_ket_thuc",
      key: "thoi_gian_ket_thuc",
      align: "center",
      width: 150,
    },
    {
      title: "Ngày giao hàng",
      dataIndex: "ngay_giao_hang",
      key: "ngay_giao_hang",
      align: "center",
      width: 100,
    },
    {
      title: "Ghi chú",
      dataIndex: "ghi_chu",
      key: "ghi_chu",
      align: "center",
    },
    {
      title: "Số dao",
      dataIndex: "so_dao",
      key: "so_dao",
      align: "center",
      width: 60,
    },
    {
      title: "Dài tấm",
      dataIndex: "dai_tam",
      key: "dai_tam",
      align: "center",
      width: 60,
    },
    {
      title: "Layout",
      dataIndex: "layout_id",
      key: "layout_id",
      align: "center",
      width: 100,
    },
    {
      title: "SL thực tế",
      dataIndex: "sl_thuc_te",
      key: "sl_thuc_te",
      align: "center",
      width: 60,
    },
    {
      title: "Tác vụ",
      dataIndex: "action",
      key: "action",
      checked: true,
      align: "center",
      fixed: "right",
      width: 80,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => onUpdate(record)}
              style={{
                marginRight: 8,
              }}
            >
              Lưu
            </Typography.Link>
            <Popconfirm title="Bạn có chắc chắn muốn hủy?" onConfirm={cancel}>
              <a>Hủy</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <EditOutlined
              style={{ color: "#1677ff", fontSize: 18, marginLeft: 8 }}
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            />
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa?"
              onConfirm={() => onDetele(record)}
            >
              <DeleteOutlined
                style={{
                  color: "red",
                  marginLeft: 8,
                  fontSize: 18,
                }}
              />
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  function btn_click() {
    loadListTable();
  }

  useEffect(() => {
    btn_click();
  }, []);

  useEffect(() => {
    (async () => {
      const res1 = await getUIItemMenu();
      setItemMenu(res1.data);
      setParams({ ...params, machine: (res1.data.find(e => e.id === LINE_SONG_ID)?.children ?? []).map(e => e.id) })
    })();
  }, []);

  const [data, setData] = useState([]);
  const loadListTable = async () => {
    setLoading(true);
    const res = await getListProductPlan(params);
    const result = (Array.isArray(res) ? res : (Object.values(res)) ?? []).map((e) => ({ ...e, key: e.id }));
    setData(result);
    setTotalPage(result.length)
    setLoading(false);
  };

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

  const onUpdate = async () => {
    const row = await form.validateFields();
    const item = data.find((val) => val.key === editingKey);
    const res = await updateProductPlan({ ...item, ...row });
    if (res) {
      form.resetFields();
      loadListTable();
      setEditingKey("");
    }
  };
  const onDetele = async (record) => {
    console.log(record);
    await deleteRecordProductPlan([record.id]);
    loadListTable();
  };
  const deleteRecord = async () => {
    if (listCheck.length > 0) {
      const res = await deleteRecordProductPlan(listCheck);
      setListCheck([]);
      loadListTable(params);
    } else {
      message.info("Chưa chọn bản ghi cần xóa");
    }
  };
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    if (typeof editingKey === "number") {
      const newData = [...data];
      newData.shift();
      setData(newData);
    }
    setEditingKey("");
  };
  const insertRecord = () => {
    history.push("/ui/manufacture/tao-ke-hoach-san-xuat");
  };
  const [loadingExport, setLoadingExport] = useState(false);
  const [loading, setLoading] = useState(false);

  const [itemsMenu, setItemMenu] = useState([]);
  const onCheck = (selectedKeys, e) => {
    const filteredKeys = selectedKeys.filter(
      (key) => !itemsMenu.some((e) => e.key === key)
    );
    setParams({ ...params, machine: filteredKeys });
  };

  const [exportLoading, setExportLoading] = useState(false);
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportKHSX({ ...params, plan_ids: listCheck });
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
  const [exportLoadingXL, setExportLoadingXL] = useState(false);
  const exportFileXL = async () => {
    setExportLoading(true);
    const res = await exportKHXaLot({ ...params, plan_ids: listCheck });
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    onChange,
    onSelect,
    options,
    ...restProps
  }) => {
    let inputNode;
    switch (inputType) {
      case "number":
        inputNode = <InputNumber />;
        break;
      case "select":
        inputNode = (
          <Select
            value={record?.[dataIndex]}
            options={options}
            onChange={(value) => onSelect(value, dataIndex)}
            bordered
            showSearch
          />
        );
        break;
      default:
        inputNode = <Input />;
    }
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            initialValue={record?.[dataIndex]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const isEditing = (record) => record.key === editingKey;
  const [editingKey, setEditingKey] = useState("");
  const printSong = useReactToPrint({
    content: () => componentRef2.current,
  });
  const printXaLot = useReactToPrint({
    content: () => componentRef1.current,
  });
  const handlePrintSong = async () => {
    if (listPrintSong.length > 0) {
      printSong();
      setListPrintSong([])
      setListCheck([]);
    } else {
      message.info("Chọn kế hoạch công đoạn Sóng");
    }
  };
  const handlePrintXaLot = async () => {
    if (listPrintXaLot.length > 0) {
      printXaLot();
      setListPrintXaLot([]);
      setListCheck([]);
    } else {
      message.info("Chọn kế hoạch công đoạn Xả lót");
    }
  };
  const mergedColumns = col_detailTable.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        onChange,
        onSelect,
        options: options(col.dataIndex),
      }),
    };
  });
  const options = (dataIndex) => {
    var record = data.find((e) => e.id === editingKey);
    let filteredOptions = [];
    return filteredOptions;
  };
  const onChange = (value, dataIndex) => {
    const items = data.map((val) => {
      if (val.key === editingKey) {
        val[dataIndex] = value;
      }
      return { ...val };
    });
    value.isValid() && setData(items);
  };
  const onSelect = (value, dataIndex) => {
    const items = data.map((val) => {
      if (val.key === editingKey) {
        val[dataIndex] = value;
      }
      return { ...val };
    });
    setData(items);
  };
  const rowSelection = {
    selectedRowKeys: listCheck,
    onChange: (selectedRowKeys, selectedRows) => {
      const song = [];
      const xaLot = [];
      selectedRows.forEach(element => {
        if (element.line_id === LINE_SONG_ID) {
          song.push(element)
        } else if (element.line_id === LINE_XA_LOT_ID) {
          xaLot.push(element)
        }
      });
      setListPrintSong(song);
      setListPrintXaLot(xaLot);
      setListCheck(selectedRowKeys);
    },
  };
  const printItemDropdown = [
    {
      key: 1,
      label: "In tem Sóng",
      onClick: handlePrintSong
    },
    {
      key: 2,
      label: "In tem Xả lót",
      onClick: handlePrintXaLot
    },
  ];
  const exportItemDropdown = [
    {
      key: 1,
      label: "KHSX Sóng",
      onClick: exportFile,
    },
    {
      key: 2,
      label: "KHSX Xả lót",
      onClick: exportFileXL,
    },
  ];
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
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]} type="flex">
        <Col span={4}>
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
            <Divider>Công đoạn</Divider>
            <div className="mb-3">
              <Form style={{ margin: "0 15px" }} layout="vertical">
                <Form.Item className="mb-3">
                  <Tree
                    checkable
                    onCheck={onCheck}
                    checkedKeys={params.machine}
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
                        short_name: e.target.value,
                        page: 1,
                      });
                    }}
                    placeholder="Nhập mã khách hàng"
                  />
                </Form.Item>
                <Form.Item label="MĐH" className="mb-3">
                  <Select
                    mode="tags"
                    allowClear
                    showSearch
                    suffixIcon={null}
                    onChange={(value) => {
                      setParams({ ...params, mdh: value });
                    }}
                    open={false}
                    placeholder="Nhập mã đơn hàng"
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
                    }}
                    placeholder="Nhập lô sản xuất"
                  />
                </Form.Item>
              </Form>
            </div>
          </Card>
        </Col>
        <Col span={20}>
          <Card
            title="Kế hoạch sản xuất"
            className="custom-card"
            extra={
              <Space>
                {/* <Button
                  type="primary"
                  onClick={exportFile}
                  loading={exportLoading}
                >
                  KHSX Sóng
                </Button>
                <Button
                  type="primary"
                  onClick={exportFileXL}
                  loading={exportLoadingXL}
                >
                  KHSX Xả Lot
                </Button> */}
                <Dropdown.Button type="primary" menu={{ items: exportItemDropdown }} loading={exportLoading} placement="bottomRight" trigger={'click'} arrow icon={<DownOutlined />}>
                  Tải file Excel
                </Dropdown.Button>
                <Upload
                  showUploadList={false}
                  name="files"
                  action={baseURL + "/api/manufacture/production-plan/import"}
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
                        loadListTable();
                        success();
                        setLoadingExport(false);
                      } else {
                        loadListTable();
                        message.error(info.file.response.message);
                        setLoadingExport(false);
                      }
                    }
                  }}
                >
                  <Button type="primary" loading={loadingExport}>
                    Upload Excel
                  </Button>
                </Upload>
                <Button type="primary" onClick={insertRecord}>
                  Tạo kế hoạch
                </Button>
                <Button type="primary" onClick={deleteRecord}>
                  Xoá
                </Button>

                {/* <Button
                  size="medium"
                  type="primary"
                  style={{ width: "100%" }}
                  onClick={handlePrintXaLot}
                >
                  In tem xả lot
                </Button> */}
                <Dropdown.Button type="primary" menu={{ items: printItemDropdown }} placement="bottomRight" arrow icon={<DownOutlined />}>
                  In tem
                </Dropdown.Button>
                <div className="report-history-invoice">
                  <TemXaLot listCheck={listPrintXaLot} ref={componentRef1} />
                  <Tem listCheck={listPrintSong} ref={componentRef2} />
                </div>
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Spin spinning={loading}>
              <Form form={form} component={false}>
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
                      setPage(page);
                      setPageSize(pageSize);
                      setParams({ ...params, page: page, pageSize: pageSize });
                    },
                  }}
                  scroll={{
                    x: "180vw",
                    y: tableHeight,
                  }}
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  rowSelection={rowSelection}
                  rowClassName="editable-row"
                  columns={mergedColumns}
                  dataSource={data}
                />
              </Form>
            </Spin>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default KeHoachSanXuat;
