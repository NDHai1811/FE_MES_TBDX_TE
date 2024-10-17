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
  Select,
} from "antd";
import { useReactToPrint } from "react-to-print";
import "../style.scss";
import { baseURL } from "../../../config";
import dayjs from "dayjs";
import {
  createWarehouseImport,
  deleteGoodsReceiptNote,
  deleteWarehouseImport,
  exportListMaterialExport,
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
import { getShifts } from "../../../api";

const columns1 = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    align: "center",
    width: 50,
    render: (value, item, index) => index + 1,
  },
  {
    title: "Máy",
    dataIndex: "machine",
    key: "machine",
    align: "center",
    width: 50,
  },
  {
    title: "Đầu sóng",
    dataIndex: "dau_may",
    key: "dau_may",
    align: "center",
    width: 100,
  },
  {
    title: "Mã vật tư",
    dataIndex: "ma_vat_tu",
    key: "ma_vat_tu",
    align: "center",
    width: 100,
  },
  {
    title: "Mã cuộn",
    dataIndex: "material_id",
    key: "material_id",
    align: "center",
    width: 100,
  },
  {
    title: "Vị trí",
    dataIndex: "locator_id",
    key: "locator_id",
    align: "center",
    width: 70,
  },
  {
    title: "Loại giấy",
    dataIndex: "loai_giay",
    key: "loai_giay",
    align: "center",
    width: 80,
  },
  {
    title: "FSC",
    dataIndex: "fsc",
    key: "fsc",
    align: "center",
    width: 50,
    render: (value) => value ? "X" : ""
  },
  {
    title: "Khổ giấy",
    dataIndex: "kho_giay",
    key: "kho_giay",
    align: "center",
    width: 80,
  },
  {
    title: "Định lượng",
    dataIndex: "dinh_luong",
    key: "dinh_luong",
    align: "center",
    width: 90,
  },
  {
    title: "Số ký nhập",
    dataIndex: "so_kg_nhap",
    key: "so_kg_nhap",
    align: "center",
    width: 100,
  },
  {
    title: "Số ký ban đầu",
    dataIndex: "so_kg_ban_dau",
    key: "so_kg_ban_dau",
    align: "center",
    width: 120,
  },
  {
    title: "Số ký xuất",
    dataIndex: "so_kg_xuat",
    key: "so_kg_xuat",
    align: "center",
    width: 100,
  },
  {
    title: "Số ký còn lại",
    dataIndex: "so_kg_con_lai",
    key: "so_kg_con_lai",
    align: "center",
    width: 100,
  },
  {
    title: "Số m",
    dataIndex: "so_m_toi",
    key: "so_m_toi",
    align: "center",
    width: 60,
  },
  {
    title: "Thời gian cần dự kiến",
    dataIndex: "time_need",
    key: "time_need",
    align: "center",
    width: 160,
  },
  {
    title: "Ca làm việc",
    dataIndex: "ca_sx",
    key: "ca_sx",
    align: "center",
    width: 90,
  },
];
const WarehouseMLT = (props) => {
  document.title = "UI - Quản lý giấy cuộn";

  const [listCheck, setListCheck] = useState([]);
  const [listMaterialCheck, setListMaterialCheck] = useState([]);
  const [shiftList, setShiftList] = useState([]);
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
    const new_data = importList.filter((_, index) =>
      listCheck.includes(index)
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
  const onDelete = async (ids) => {
    const res = await deleteWarehouseImport({ id: ids });
    setListCheck([]);
    getImportList();
  };
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
  useEffect(() => {
    getReceiptNote();
    getShiftList();
  }, []);

  const getShiftList = async () => {
    var shifts = await getShifts();
    setShiftList(shifts.map(e => ({ ...e, value: e.id, label: e.name })));
  }

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
  }, [importList, exportList]);
  const tabsMenu = [
    {
      key: "1",
      label: "Nhập dữ liệu nhập kho",
      children: <EditableTable
        bordered
        loading={loading}
        columns={columns}
        dataSource={importList}
        setDataSource={setImportList}
        scroll={{
          y: tableHeight,
        }}
        className="h-100"
        rowSelection={rowSelection}
        pagination={false}
        size="small"
        onUpdate={onUpdate}
        onDelete={(record) => onDelete([record.id])}
      />
    },
    {
      key: "2",
      label: "Theo dõi xuất hàng",
      children: <Table
        bordered
        loading={loading}
        columns={columns1}
        dataSource={exportList}
        scroll={{
          // x: "100vw",
          y: tableHeight,
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
      />
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
  const rowSelectionReceipt = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRowKeys, selectedRows);
      setListCheckReceipt(selectedRows.map(e => e.id));
    },
    type: 'radio',
  };
  const [loadingUpload, setLoadingUpload] = useState(false);

  const onSaveNote = async (record) => {
    var res = await updateGoodsReceiptNote(record);
    getReceiptNote();
  }
  const onDeleteNote = async (record) => {
    var res = await deleteGoodsReceiptNote(record);
    getReceiptNote();
  }

  const exportFileExcel = async () => {
    setExportLoading(true);
    const res = await exportListMaterialExport({ ...params, ...exportParams });
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  }
  return (
    <>
      {contextHolder}
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Card
              styles={{ body: { paddingInline: 0, paddingTop: 0 } }}
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
                  {currentTab === '2' && <Form.Item
                    label={"Ca làm việc"}
                    className="mb-3"
                  >
                    <Select
                      placeholder={"Chọn ca"}
                      options={shiftList}
                      onChange={(value) =>
                        setParams({ ...params, export_shift: value })
                      }
                      allowClear
                    />
                  </Form.Item>}
                </Form>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Card style={{ height: '100%' }} className="custom-card">
            <Tabs
              onChange={(activeKey) => setCurrentTab(activeKey)}
              items={tabsMenu}
              destroyInactiveTabPane={true}
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
                    <Button type="primary" onClick={handlePrint}>
                      In tem NVL
                    </Button>
                    <Button type="primary" onClick={() => onDelete(importList.filter((e, i) => listCheck.includes(i)).map(e => e.id))}>
                      Xóa
                    </Button>
                    <div className="report-history-invoice">
                      <TemNVL
                        listCheck={listMaterialCheck}
                        ref={componentRef1}
                      />
                    </div>
                  </Space>
                ) : <Space>
                  <Button
                    type="primary"
                    onClick={() => exportFileExcel()}
                    loading={exportLoading}
                  >
                    Excel
                  </Button>
                </Space>
              }
            ></Tabs>
          </Card>
        </Col>
      </Row>

      <Modal title={"Xuất phiếu nhập kho"} open={openExportModal} onCancel={() => setOpenExportModal(false)} width={1000}
        centered
        footer={
          <Space>
            <Button onClick={() => setOpenExportModal(false)}>Huỷ</Button>
            <Button type="primary" onClick={exportFileReceiptNote} loading={exportLoading}>Phiếu nhập kho</Button>
            <Button type="primary" onClick={exportFileVehicleWeightNote} loading={exportLoading1}>Phiếu cân xe</Button>
          </Space>
        }>
        <EditableTable
          bordered
          loading={loadingNotes}
          columns={receiptNoteColumns}
          dataSource={receiptNote}
          setDataSource={setReceiptNote}
          scroll={{
            y: "50vh",
          }}
          // virtual
          className="h-100"
          rowSelection={rowSelectionReceipt}
          pagination={true}
          size="small"
          onUpdate={onSaveNote}
          onDelete={onDeleteNote}
        />
      </Modal>
    </>
  );
};

export default WarehouseMLT;
