import React, { useState, useEffect, useRef } from "react";
import {
  Layout,
  Divider,
  Button,
  Table,
  Modal,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Upload,
  message,
  Tabs,
  Col,
  Row,
  Space,
  Tree,
} from "antd";
import { useReactToPrint } from "react-to-print";
import "../style.scss";
import { baseURL } from "../../../config";
import EditableTable from "../../../components/Table/EditableTable";
import dayjs from "dayjs";
import {
  createWarehouseImport,
  deleteWarehouseImport,
  exportWarehouseTicket,
  getListPlanMaterialExport,
  getListPlanMaterialImport,
  updateWarehouseImport,
} from "../../../api/ui/warehouse";
import TemNVL from "./TemNVL";

const { TabPane } = Tabs;

const itemsMenu = [
  {
    title: "Kho nguyên vật liệu",
    key: "0-0",
    children: [
      {
        title: "Kho A",
        key: "0-1",
      },
      {
        title: "Kho B",
        key: "0-2",
      },
      {
        title: "Kho dở dang",
        key: "0-3",
      },
    ],
  },
  {
    title: "KV bán thành phẩm",
    key: "1-0",
    children: [
      {
        title: "KV BTP giấy tấm",
        key: "1-1",
      },
      {
        title: "KV BTP sau in",
        key: "1-2",
      },
    ],
  },
  {
    title: "Kho thành phẩm",
    key: "2-0",
    children: [
      {
        title: "Kho chờ nhập",
        key: "2-1",
      },
      {
        title: "Kho đã nhập",
        key: "2-2",
      },
    ],
  },
];

const columns1 = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    align: "center",
    render: (value, item, index) => index + 1,
  },
  {
    title: "Máy",
    dataIndex: "machine",
    key: "machine",
    align: "center",
  },
  {
    title: "Đầu sóng",
    dataIndex: "dau_may",
    key: "dau_may",
    align: "center",
  },
  {
    title: "Mã vật tư",
    dataIndex: "ma_vat_tu",
    key: "ma_vat_tu",
    align: "center",
  },
  {
    title: "Mã cuộn",
    dataIndex: "material_id",
    key: "material_id",
    align: "center",
  },
  {
    title: "Vị trí",
    dataIndex: "locator_id",
    key: "locator_id",
    align: "center",
  },
  {
    title: "Loại giấy",
    dataIndex: "loai_giay",
    key: "loai_giay",
    align: "center",
  },
  {
    title: "Khổ",
    dataIndex: "kho_giay",
    key: "kho_giay",
    align: "center",
  },
  {
    title: "Định lượng",
    dataIndex: "dinh_luong",
    key: "dinh_luong",
    align: "center",
  },
  {
    title: "Số kg",
    dataIndex: "so_kg",
    key: "so_kg",
    align: "center",
  },
  {
    title: "Số m",
    dataIndex: "so_m_toi",
    key: "so_m_toi",
    align: "center",
  },
  {
    title: "Thời gian cần dự kiếm",
    dataIndex: "time_need",
    key: "time_need",
    align: "center",
  },
];

const { Sider } = Layout;
const WarehouseMLT = (props) => {
  document.title = "UI - Quản lý giấy cuộn";

  const [listCheck, setListCheck] = useState([]);
  const [listMaterialCheck, setListMaterialCheck] = useState([]);
  const [currentTab, setCurrentTab] = useState("1");
  const [params, setParams] = useState({
    start_date: dayjs(),
    end_date: dayjs(),
  });
  const [openMdlEdit, setOpenMdlEdit] = useState(false);
  const [importList, setImportList] = useState([]);
  const [exportList, setExportList] = useState([]);
  const onChangeChecbox = (e) => {
    if (e.target.checked) {
      if (!listCheck.includes(e.target.value)) {
        setListCheck((oldArray) => [...oldArray, e.target.value]);
      }
    } else {
      if (listCheck.includes(e.target.value)) {
        setListCheck((oldArray) =>
          oldArray.filter((datainput) => datainput !== e.target.value)
        );
      }
    }
  };
  useEffect(() => {
    console.log(importList, listCheck);
    const new_data = importList.filter((datainput) =>
      listCheck.includes(datainput.id)
    );
    console.log(new_data);
    setListMaterialCheck(new_data);
  }, [listCheck]);

  const getExportList = () => {
    getListPlanMaterialExport()
      .then((res) => setExportList(res.data))
      .catch((err) =>
        console.log("Lấy danh sách bảng nhập kho nvl thất bại: ", err)
      );
  };

  const deleteRecord = async () => {
    if (listCheck.length > 0) {
      const res = await deleteWarehouseImport({ id: listCheck });
      setListCheck([]);
      getImportList();
    } else {
      message.info("Chưa chọn bản ghi cần xóa");
    }
  };

  const columns = [
    // {
    //   title: "Chọn",
    //   dataIndex: "name1",
    //   key: "name1",
    //   align: "center",
    //   width: "4%",
    //   render: (value, item, index) => (
    //     <Checkbox
    //       value={item.material_id}
    //       onChange={onChangeChecbox}
    //       checked={listCheck.includes(item.material_id) ? true : false}
    //     ></Checkbox>
    //   ),
    // },
    {
      title: "Mã cuộn TBDX",
      dataIndex: "material_id",
      key: "material_id",
      align: "center",
    },
    {
      title: "Mã vật tư",
      dataIndex: "ma_vat_tu",
      key: "ma_vat_tu",
      align: "center",
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "ten_ncc",
      key: "ten_ncc",
      align: "center",
    },
    {
      title: "Mã cuộn nhà cung cấp",
      dataIndex: "ma_cuon_ncc",
      key: "ma_cuon_ncc",
      align: "center",
    },
    {
      title: "Số kg",
      dataIndex: "so_kg",
      key: "so_kg",
      align: "center",
    },
    {
      title: "Loại giấy",
      dataIndex: "loai_giay",
      key: "loai_giay",
      align: "center",
    },
    {
      title: "FSC",
      dataIndex: "fsc",
      key: "fsc",
      align: "center",
      render: (value, item, index) => (value === 1 ? "X" : ""),
    },
    {
      title: "Khổ giấy",
      dataIndex: "kho_giay",
      key: "kho_giay",
      align: "center",
    },
    {
      title: "Định lượng",
      dataIndex: "dinh_luong",
      key: "dinh_luong",
      align: "center",
    },
    {
      title: "IQC OK/NG",
      dataIndex: "iqc",
      key: "iqc",
      align: "center",
      render: (value, item, index) =>
        value === 0 ? "Chưa kiểm tra" : value === 1 ? "OK" : "NG",
    },
  ];
  const mergedKey = "khach_hang";
  const mergeColumn = [
    "ma_cuon_tbdx",
    "ma_vat_tu",
    "ten_ncc",
    "ma_cuon_ncc",
    "so_kg",
    "loai_giay",
    "kho_giay",
    "dinh_luong",
    "ok_ng",
  ];
  const mergeValue = mergeColumn.map((e) => {
    return { key: e, set: new Set() };
  });

  const isEditing = (col, record) =>
    col.editable === true && listCheck.includes(record.id);

  const onCell = (record, e) => {
    const props = {
      record,
      ...e,
      editable: isEditing(e, record),
      handleSave,
    };

    if (!mergeColumn.includes(e.key)) {
      return props;
    }

    const set = mergeValue.find((s) => s.key === e.key)?.set;
    if (set?.has(record[mergedKey])) {
      return { rowSpan: 0, ...props };
    }

    const rowCount = importList.filter(
      (data) => data[mergedKey] === record[mergedKey]
    ).length;
    set?.add(record[mergedKey]);
    return { rowSpan: rowCount, ...props };
  };

  const customColumns = columns.map((e) => ({
    ...e,
    onCell: (record) => onCell(record, e),
  }));

  const handleSave = async (row) => {
    setImportList((prev) => prev.map((e) => (e.id === row.id ? row : e)));
  };

  const getImportList = async () => {
    const res = await getListPlanMaterialImport(params);
    setImportList(res.data);
  };

  useEffect(() => {
    (async () => {
      if (currentTab === "1") {
        getImportList();
      } else {
        getExportList();
      }
    })();
  }, [currentTab]);
  const [loading, setLoading] = useState(false);
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

  const btn_click = () => {
    if (currentTab === "1") {
      getImportList();
    } else {
      getExportList();
    }
  };

  const [titleMdlEdit, setTitleMdlEdit] = useState("Cập nhật");
  const onEdit = () => {
    if (listCheck.length > 1) {
      message.info("Chỉ chọn 1 bản ghi để chỉnh sửa");
    } else if (listCheck.length == 0) {
      message.info("Chưa chọn bản ghi cần chỉnh sửa");
    } else {
      const result = importList.find((record) => record.id === listCheck[0]);
      form.setFieldsValue(result);
      setOpenMdlEdit(true);
      setTitleMdlEdit("Cập nhật");
    }
  };
  const componentRef1 = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef1.current,
  });

  const onInsert = () => {
    setTitleMdlEdit("Thêm mới");
    form.resetFields();
    setOpenMdlEdit(true);
  };
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    if (values.id) {
      const res = await updateWarehouseImport(values);
    } else {
      const res = await createWarehouseImport(values);
    }
    setOpenMdlEdit(false);
    getImportList();
  };

  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };
  const onCheck = (checkedKeys, info) => {
    console.log("onCheck", checkedKeys, info);
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys);
    },
  };

  const tabsMenu = [
    {
      key: "1",
      label: "Nhập dữ liệu nhập kho",
      children: [
        <Table
          bordered
          columns={columns}
          dataSource={importList.map((e) => {
            return { ...e, key: e.id };
          })}
          scroll={{
            x: "100vw",
            y: window.innerHeight * 0.70,
          }}
          className="h-100"
          rowSelection={rowSelection}
          pagination={false}
          size="small"
        />,
      ],
    },
    {
      key: "2",
      label: "Theo dõi xuất hàng",
      children: [
        <Table
          bordered
          columns={columns1}
          dataSource={exportList}
          scroll={{
            x: "100vw",
            y: "80vh",
          }}
          className="h-100"
          pagination={false}
          size="small"
        />,
      ],
    },
  ];
  const [exportLoading, setExportLoading] = useState(false);
  const exportFile = async () => {
    setExportLoading(true);
    var material_ids = [];
    importList.forEach((e) => {
      if (listCheck.includes(e.id)) {
        material_ids.push(e.material_id);
      }
    });
    const res = await exportWarehouseTicket({
      ...params,
      material_ids: material_ids,
    });
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
  return (
    <>
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
                  <Form.Item
                    label={currentTab === "1" ? "Mã cuộn TBDX" : "Máy"}
                    className="mb-3"
                  >
                    <Input
                      placeholder={
                        currentTab === "1" ? "Nhập mã cuộn TBDX" : "Nhập máy"
                      }
                      onChange={(e) =>
                        setParams({ ...params, material_id: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label={currentTab === "1" ? "Mã cuộn NCC" : "Mã vật tư"}
                    className="mb-3"
                  >
                    <Input
                      placeholder={
                        currentTab === "1"
                          ? "Nhập mã cuộn NCC"
                          : "Nhập mã vật tư"
                      }
                      onChange={(e) =>
                        setParams({ ...params, ma_cuon_ncc: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label={currentTab === "1" ? "Loại giấy" : "Mã cuộn TBDX"}
                    className="mb-3"
                  >
                    <Input
                      placeholder={
                        currentTab === "1"
                          ? "Nhập loại giấy"
                          : "Nhập mã cuộn TBDX"
                      }
                      onChange={(e) =>
                        setParams({ ...params, loai_giay: e.target.value })
                      }
                    />
                  </Form.Item>
                </Form>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Card style={{ height: '100%' }} className="custom-card scroll">
            <Tabs
              defaultActiveKey="1"
              onChange={(activeKey) => setCurrentTab(activeKey)}
              items={tabsMenu}
              tabBarExtraContent={
                currentTab === "1" ? (
                  <Space>
                    <Button
                      type="primary"
                      onClick={exportFile}
                      loading={exportLoading}
                    >
                      Xuất phiếu nhập kho
                    </Button>
                    <Upload
                      showUploadList={false}
                      name="file"
                      action={baseURL + "/api/upload-nhap-kho-nvl"}
                      headers={{
                        authorization: "authorization-text",
                      }}
                      onChange={(info) => {
                        setLoading(true);
                        if (info.file.status === "error") {
                          error();
                          setLoading(false);
                        } else if (info.file.status === "done") {
                          if (info.file.response.success === true) {
                            getImportList();
                            success();
                            setLoading(false);
                          } else {
                            getImportList();
                            message.error(info.file.response.message);
                            setLoading(false);
                          }
                        }
                      }}
                    >
                      <Button type="primary" loading={loading}>
                        Upload excel
                      </Button>
                    </Upload>
                    <Button type="primary" onClick={deleteRecord}>
                      Xóa
                    </Button>
                    <Button type="primary" onClick={onEdit}>
                      Sửa
                    </Button>
                    <Button type="primary" onClick={onInsert}>
                      Thêm
                    </Button>
                    <Button type="primary" onClick={handlePrint}>
                      In tem NVL
                    </Button>
                    <div className="report-history-invoice">
                      <TemNVL
                        listCheck={listMaterialCheck}
                        ref={componentRef1}
                      />
                    </div>
                  </Space>
                ) : null
              }
            ></Tabs>
          </Card>
        </Col>
      </Row>
      <Modal
        title={titleMdlEdit}
        open={openMdlEdit}
        onCancel={() => setOpenMdlEdit(false)}
        footer={null}
        width={800}
      >
        <Form
          style={{ margin: "0 15px" }}
          layout="vertical"
          form={form}
          onFinish={onFinish}
        >
          <Row gutter={[16, 16]}>
            <Col span={12} className="d-none">
              <Form.Item name="id" className="mb-3 d-none">
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Mã cuộn"
                name="material_id"
                className="mb-3"
              // rules={[{ required: true }]}
              >
                <Input placeholder="Nhập mã cuộn"></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Mã cuộn NCC"
                name="ma_cuon_ncc"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập mã cuộn nhà cung cấp"></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Loại giấy"
                name="loai_giay"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập loại giấy"></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="FSC"
                name="fsc"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder=""></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Khổ giấy"
                name="kho_giay"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập khổ giấy"></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Định lượng"
                name="dinh_luong"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập định lượng"></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số kg"
                name="so_kg"
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập số kg"></Input>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit">
              Lưu lại
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default WarehouseMLT;
