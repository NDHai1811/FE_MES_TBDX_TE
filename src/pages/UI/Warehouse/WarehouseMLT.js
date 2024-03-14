import React, { useState, useEffect, useRef } from "react";
import {
  Divider,
  Button,
  Table,
  Modal,
  Card,
  DatePicker,
  Form,
  Input,
  Upload,
  message,
  Tabs,
  Col,
  Row,
  Space,
  Typography,
  Spin,
} from "antd";
import { useReactToPrint } from "react-to-print";
import "../style.scss";
import { baseURL } from "../../../config";
import dayjs from "dayjs";
import {
  createWarehouseImport,
  deleteGoodsReceiptNote,
  exportVehicleWeightTicket,
  exportWarehouseTicket,
  getGoodsReceiptNote,
  getListPlanMaterialExport,
  getListPlanMaterialImport,
  updateGoodsReceiptNote,
  updateWarehouseImport,
} from "../../../api/ui/warehouse";
import TemNVL from "./TemNVL";
import { useProfile } from "../../../components/hooks/UserHooks";
import EditableTable from "../../../components/Table/EditableTable";
import { EditOutlined } from "@ant-design/icons";
import Actions from "../../../components/Table/Actions";

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
  const [editingKey, setEditingKey] = useState();
  useEffect(() => {
    const new_data = importList.filter((datainput) =>
      listCheck.includes(datainput.id)
    );
    setListMaterialCheck(new_data);
  }, [listCheck, importList]);

  const [exportParams, setExportParams] = useState({ page: 1, pageSize: 20, totalPage: 1 });
  const getExportList = async () => {
    setLoading(true);
    setImportList([])
    var res = await getListPlanMaterialExport({ ...params, ...exportParams });
    if (res.success) {
      setExportList(res.data.data);
      setExportParams({ ...exportParams, totalPage: res.data.totalPage })
    }
    setLoading(false);
  };
  const [formImport] = Form.useForm();
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center",
      render: (value, item, index) => (index + 1),
    },
    {
      title: "Mã cuộn TBDX",
      dataIndex: "material_id",
      key: "material_id",
      align: "center",
    },

    {
      title: "Tên NCC",
      dataIndex: "ten_ncc",
      key: "ten_ncc",
      align: "center",
    },
    {
      title: "Loại giấy",
      dataIndex: "loai_giay",
      key: "loai_giay",
      align: "center",
      width: '8%',
      editable: true,
    },
    {
      title: "FSC",
      dataIndex: "fsc",
      key: "fsc",
      align: "center",
      render: (value, item, index) => (value === 1 ? "X" : ""),
      width: '5%',
      editable: true,
    },
    {
      title: "Khổ giấy",
      dataIndex: "kho_giay",
      key: "kho_giay",
      align: "center",
      editable: true,
    },
    {
      title: "Định lượng",
      dataIndex: "dinh_luong",
      key: "dinh_luong",
      align: "center",
      editable: true,
    },
    {
      title: "Số ký nhập",
      dataIndex: "so_kg",
      key: "so_kg",
      align: "center",
      width: '6%',
      editable: true,
    },
    {
      title: "Mã cuộn NCC",
      dataIndex: "ma_cuon_ncc",
      key: "ma_cuon_ncc",
      align: "center",
      editable: true
    },
    {
      title: "Mã vật tư",
      dataIndex: "ma_vat_tu",
      key: "ma_vat_tu",
      align: "center",
    },
    {
      title: "Ngày nhập",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (value, item, index) => dayjs(value).format('DD-MM-YYYY'),
    },
    {
      title: "Số phiếu nhập kho",
      dataIndex: "goods_receipt_note_id",
      key: "goods_receipt_note_id",
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
  const onUpdate = async (record) => {
    setLoading(true);
    var res = await updateWarehouseImport(record);
    await btn_click();
    setLoading(false)
  }
  const onChange = async (record) => {

  }
  const onSelect = async (record) => {

  }

  const getImportList = async () => {
    setExportList([]);
    setLoading(true);
    const res = await getListPlanMaterialImport(params);
    setImportList(res.data.map((e) => {
      return { ...e, key: e.id };
    }));
    setLoading(false);
  };

  useEffect(() => {
    btn_click();
  }, [currentTab, exportParams.page, exportParams.pageSize]);

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

  const btn_click = async () => {
    console.log(exportParams);
    if (currentTab === "1") {
      getImportList();
    } else {
      getExportList();
    }
  };
  const componentRef1 = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef1.current,
  });
  const [form] = Form.useForm();
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
        <Form form={formImport}>
          <EditableTable
            form={formImport}
            bordered
            columns={columns}
            dataSource={importList}
            scroll={{
              y: "50vh",
            }}
            className="h-100"
            rowSelection={rowSelection}
            pagination={false}
            size="small"
            onSave={onUpdate}
          />
        </Form>
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
            y: "50vh",
          }}
          className="h-100"
          pagination={{
            current: exportParams.page,
            size: "small",
            total: exportParams.totalPage,
            pageSize: exportParams.pageSize,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              setExportParams({ ...exportParams, page: page, pageSize: pageSize });
            },
          }}
          size="small"
        />,
      ],
    },
  ];
  const [exportLoading, setExportLoading] = useState(false);
  const exportFileReceiptNote = async () => {
    setExportLoading(true);
    if (listCheckReceipt.length) {
      const res = await exportWarehouseTicket({ id: listCheckReceipt[0] });
      if (res.success) {
        window.location.href = baseURL + res.data;
      }
    }
    setExportLoading(false);
  };
  const [exportLoading1, setExportLoading1] = useState(false);
  const exportFileVehicleWeightNote = async () => {
    setExportLoading1(true);
    if (listCheckReceipt.length) {
      const res = await exportVehicleWeightTicket({ id: listCheckReceipt[0] });
      if (res.success) {
        window.location.href = baseURL + res.data;
      }
    }
    setExportLoading1(false);
  };
  const { userProfile } = useProfile();
  const [openExportModal, setOpenExportModal] = useState(false);
  const [receiptNote, setReceiptNote] = useState([]);
  const [listCheckReceipt, setListCheckReceipt] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const getReceiptNote = async () => {
    setLoadingNotes(true);
    var res = await getGoodsReceiptNote();
    setReceiptNote(res);
    setLoadingNotes(false);
  }
  const receiptNoteColumns = [
    {
      title: "Mã phiếu",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 100
    },

    {
      title: "Tên nhà cung cấp",
      dataIndex: "supplier_name",
      key: "supplier_name",
      align: "center",
      width: 250
    },
    {
      title: "Số xe",
      dataIndex: "vehicle_number",
      key: "vehicle_number",
      align: "center",
      width: 120
    },
    {
      title: "Khối lượng tổng",
      dataIndex: "total_weight",
      key: "total_weight",
      align: "center",
      editable: true
    },
    {
      title: "Khối lượng xe",
      dataIndex: "vehicle_weight",
      key: "vehicle_weight",
      align: "center",
      editable: true
    },
    {
      title: "Khối lượng hàng",
      dataIndex: "material_weight",
      key: "material_weight",
      align: "center",
      editable: true
    },
  ];
  useEffect(() => {
    openExportModal && getReceiptNote()
  }, [openExportModal]);
  const rowSelectionReceipt = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRowKeys, selectedRows);
      setListCheckReceipt(selectedRowKeys);
    },
    type: 'radio',
  };
  const [loadingUpload, setLoadingUpload] = useState(false);

  const [formNote] = Form.useForm();
  const onSaveNote = async (record) => {
    var res = await updateGoodsReceiptNote(record);
    getReceiptNote();
  }
  const onDeleteNote = async (record) => {
    var res = await deleteGoodsReceiptNote(record);
    getReceiptNote();
  }
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
                    onClick={()=>currentTab === '1' ? btn_click() : setExportParams({...exportParams, page: 1})}
                  >
                    Truy vấn
                  </Button>
                </div>
              ]}
            >
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
                  <Form.Item
                    label={"Mã cuộn TBDX"}
                    className="mb-3"
                  >
                    <Input
                      placeholder={"Nhập mã cuộn TBDX"}
                      onChange={(e) =>
                        setParams({ ...params, material_id: e.target.value })
                      }
                    />
                  </Form.Item>
                  {currentTab === '1' && <Form.Item
                    label={"Mã cuộn NCC"}
                    className="mb-3"
                  >
                    <Input
                      placeholder={"Nhập mã cuộn NCC"}
                      onChange={(e) =>
                        setParams({ ...params, ma_cuon_ncc: e.target.value })
                      }
                    />
                  </Form.Item>}
                  <Form.Item
                    label={"Loại giấy"}
                    className="mb-3"
                  >
                    <Input
                      placeholder={"Nhập loại giấy"}
                      onChange={(e) =>
                        setParams({ ...params, loai_giay: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label={"Mã vật tư"}
                    className="mb-3"
                  >
                    <Input
                      placeholder={"Nhập mã vật tư"}
                      onChange={(e) =>
                        setParams({ ...params, ma_vat_tu: e.target.value })
                      }
                    />
                  </Form.Item>
                </Form>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Spin spinning={loading}>
            <Card style={{ height: '100%' }}>
              <Tabs
                onChange={(activeKey) => setCurrentTab(activeKey)}
                items={tabsMenu}
                tabBarExtraContent={
                  currentTab === "1" ? (
                    <Space>
                      <Button
                        type="primary"
                        onClick={() => setOpenExportModal(true)}
                      // loading={exportLoading}
                      >
                        Xuất phiếu nhập kho
                      </Button>
                      <Upload
                        showUploadList={false}
                        name="file"
                        action={baseURL + "/api/upload-nhap-kho-nvl"}
                        headers={{
                          authorization: "Bearer " + userProfile.token,
                        }}
                        onChange={(info) => {
                          setLoadingUpload(true);
                          if (info.file.status === "error") {
                            error();
                            setLoadingUpload(false);
                          } else if (info.file.status === "done") {
                            if (info.file.response.success === true) {
                              success();
                              setLoadingUpload(false);
                              btn_click();
                            } else {
                              message.error(info.file.response.message);
                              setLoadingUpload(false);
                              btn_click();
                            }
                          }
                        }}
                      >
                        <Button type="primary" loading={loadingUpload}>
                          Upload excel
                        </Button>
                      </Upload>
                      {/* <Button type="primary" onClick={deleteRecord}>
                      Xóa
                    </Button>
                    <Button type="primary" onClick={onEdit}>
                      Sửa
                    </Button>
                    <Button type="primary" onClick={onInsert}>
                      Thêm
                    </Button> */}
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
          </Spin>
        </Col>
      </Row>
      {/* <Modal
        title={"Cập nhật"}
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
      </Modal> */}
      <Modal title={"Xuất phiếu nhập kho"} open={openExportModal} onCancel={() => setOpenExportModal(false)} width={1000}
        // onOk={exportFile}
        // okButtonProps={{loading: exportLoading}}
        // okText={"Tải xuống"}
        footer={
          <Space>
            <Button>Huỷ</Button>
            <Button type="primary" onClick={exportFileReceiptNote} loading={exportLoading}>Phiếu nhập kho</Button>
            <Button type="primary" onClick={exportFileVehicleWeightNote} loading={exportLoading1}>Phiếu cân xe</Button>
          </Space>
        }>
        <Form form={formNote}>
          <EditableTable
            bordered
            loading={loadingNotes}
            form={formNote}
            columns={receiptNoteColumns}
            dataSource={receiptNote.map((e) => {
              return { ...e, key: e.id };
            })}
            scroll={{
              y: "50vh",
            }}
            className="h-100"
            rowSelection={rowSelectionReceipt}
            pagination={false}
            size="small"
            onSave={onSaveNote}
            onDelete={onDeleteNote}
          />
        </Form>
      </Modal>
    </>
  );
};

export default WarehouseMLT;
