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
import {
  createWareHouseExport,
  deleteWareHouseExport,
  getListWarehouseMLTImport,
  updateWareHouseExport,
} from "../../../api";
import EditableTable from "../../../components/Table/EditableTable";
import dayjs from "dayjs";
import { getListPlanMaterialExport } from "../../../api/ui/warehouse";
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
    dataIndex: "may",
    key: "may",
    align: "center",
  },
  {
    title: "Đầu sóng",
    dataIndex: "dau_song",
    key: "dau_song",
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
    dataIndex: "ma_cuon",
    key: "ma_cuon",
    align: "center",
  },
  {
    title: "Vị trí",
    dataIndex: "vi_tri",
    key: "vi_tri",
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
    dataIndex: "kho",
    key: "kho",
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
    dataIndex: "so_m",
    key: "so_m",
    align: "center",
  },
  {
    title: "Thời gian cần dự kiếm",
    dataIndex: "tg_du_kien",
    key: "tg_du_kien",
    align: "center",
  },
];

const { Sider } = Layout;
const WarehouseExportPlan = (props) => {
  document.title = "UI - Kế hoạch xuất kho";
  const [data, setData] = useState([]);
  const [listCheck, setListCheck] = useState([]);
  const [listMaterialCheck, setListMaterialCheck] = useState([]);
  const [currentTab, setCurrentTab] = useState("1");
  const [params, setParams] = useState({ date: [dayjs(), dayjs()] });
  const [openMdlEdit, setOpenMdlEdit] = useState(false);
  const [logs, setLogs] = useState([]);
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
    const new_data = logs.filter((datainput) =>
      listCheck.includes(datainput.material_id)
    );
    console.log(new_data);
    setListMaterialCheck(new_data);
  }, [listCheck]);

  useEffect(() => {
    getLogs();
  }, []);

  const getLogs = () => {
    getListPlanMaterialExport()
      .then((res) => setLogs(res.data))
      .catch((err) =>
        console.log("Lấy danh sách bảng nhập kho nvl thất bại: ", err)
      );
  };

  // useEffect(() => {
  //   (async () => {
  //     var res = await getDataFilterUI({ khach_hang: params.khach_hang });
  //     if (res.success) {
  //       setListNameProducts(
  //         res.data.product.map((e) => {
  //           return { ...e, label: e.name, value: e.id };
  //         })
  //       );
  //       // setListLoSX(Object.values(res.data.lo_sx).map(e => {
  //       //         return { label: e, value: e }
  //       // }));
  //     }
  //   })();
  // }, [params.khach_hang]);

  const deleteRecord = async () => {
    if (listCheck.length > 0) {
      const res = await deleteWareHouseExport(listCheck);
      setListCheck([]);
      loadListTable();
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

    const rowCount = data.filter(
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
    setData((prev) => prev.map((e) => (e.id === row.id ? row : e)));
  };

  const loadListTable = async () => {
    const res = await getListWarehouseMLTImport(params);
    setData(res.data);
  };

  useEffect(() => {
    (async () => {
      loadListTable();
    })();
  }, []);
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
    loadListTable();
  };

  const [titleMdlEdit, setTitleMdlEdit] = useState("Cập nhật");
  const onEdit = () => {
    if (listCheck.length > 1) {
      message.info("Chỉ chọn 1 bản ghi để chỉnh sửa");
    } else if (listCheck.length == 0) {
      message.info("Chưa chọn bản ghi cần chỉnh sửa");
    } else {
      const result = data.find((record) => record.id === listCheck[0]);
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
      const res = await updateWareHouseExport(values);
    } else {
      const res = await createWareHouseExport(values);
    }
    setOpenMdlEdit(false);
    loadListTable();
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
    getCheckboxProps: (record) => ({
      disabled: !record.material_id,
    }),
  };
  return (
    <>
      {contextHolder}
      <Row style={{ padding: "8px", height: "90vh" }} gutter={[8, 8]}>
        <Col span={4}>
          <Card
            style={{ height: "100%" }}
            bodyStyle={{ paddingInline: 0, paddingTop: 0 }}
          >
            <Divider>Tổ chức</Divider>
            <Tree
              checkable
              defaultExpandedKeys={["0-0-0", "0-0-1"]}
              defaultSelectedKeys={["0-0-0", "0-0-1"]}
              defaultCheckedKeys={["0-0-0", "0-0-1"]}
              onSelect={onSelect}
              onCheck={onCheck}
              treeData={itemsMenu}
              style={{ maxHeight: "80px", overflowY: "auto" }}
            />
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
                      setParams({ ...params, date: [value, params.date[1]] })
                    }
                    value={params.date[0]}
                  />
                  <DatePicker
                    allowClear={false}
                    placeholder="Kết thúc"
                    style={{ width: "100%" }}
                    onChange={(value) =>
                      setParams({ ...params, date: [params.date[0], value] })
                    }
                    value={params.date[1]}
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
                  />
                </Form.Item>
                <Form.Item
                  label={currentTab === "1" ? "Tên nhà cung cấp" : "Đầu sóng"}
                  className="mb-3"
                >
                  <Input
                    placeholder={
                      currentTab === "1" ? "Nhập tên NCC" : "Nhập đầu sóng"
                    }
                  />
                </Form.Item>
                <Form.Item
                  label={currentTab === "1" ? "Mã cuộn NCC" : "Mã vật tư"}
                  className="mb-3"
                >
                  <Input
                    placeholder={
                      currentTab === "1" ? "Nhập mã cuộn NCC" : "Nhập mã vật tư"
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
                  />
                </Form.Item>
              </Form>
            </div>
            <div
              style={{
                padding: "10px",
                textAlign: "center",
              }}
              layout="vertical"
            >
              <Button
                type="primary"
                onClick={btn_click}
                style={{ width: "80%" }}
              >
                Truy vấn
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={20}>
          <Row
            style={{ paddingLeft: "4px", paddingRight: "4px", height: "100vh" }}
            gutter={[8, 8]}
          >
            <Card
              title={
                <Tabs
                  defaultActiveKey="1"
                  onChange={(activeKey) => setCurrentTab(activeKey)}
                >
                  <TabPane tab="Nhập dữ liệu nhập kho" key="1"></TabPane>
                  <TabPane tab="Theo dõi xuất hàng" key="2"></TabPane>
                </Tabs>
              }
              extra={
                currentTab === "1" ? (
                  <Space>
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
                            getLogs();
                            success();
                            setLoading(false);
                          } else {
                            getLogs();
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
              style={{ width: "100%" }}
            >
              {/* <EditableTable
                bordered
                columns={currentTab === "1" ? columns : columns1}
                dataSource={currentTab === "1" ? logs : data}
                scroll={{
                  x: "100vw",
                  y: "55vh",
                }}
                pagination={false}
                size="small"
                setDataSource={data}
                onEditEnd={() => null}
              /> */}
              <Table
              bordered
              columns={currentTab === "1" ? columns : columns1}
              dataSource={currentTab === "1" ? logs.map(e=>{return {...e, key:e.material_id}}) : data}
              scroll={{
                x: "100vw",
                y: "55vh",
              }}
              rowSelection={rowSelection}
              pagination={false}
              size="small"
              />
            </Card>
          </Row>
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
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập mã cuộn"></Input>
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
            <Col span={12}>
              <Form.Item
                label="Mã cuộn NCC"
                name="ma_cuon_ncc"
                className="mb-3"
              >
                <Input placeholder="Nhập mã cuộn nhà cung cấp"></Input>
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

export default WarehouseExportPlan;
