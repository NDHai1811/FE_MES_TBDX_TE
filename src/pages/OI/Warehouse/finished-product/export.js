import React, { useEffect, useState, useRef, useCallback } from "react";
import { Row, Col, Table, Modal, Select, Input, Form, Button, message, DatePicker, InputNumber, Space, Checkbox } from "antd";
import "../../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { downloadDeliveryNote, exportPallet, getDeliveryNoteList, getWarehouseFGExportLogs, getWarehouseFGOverall } from "../../../../api/oi/warehouse";
import { DownloadOutlined, QrcodeOutlined } from "@ant-design/icons";
import ScanQR from "../../../../components/Scanner";
import { baseURL } from "../../../../config";
import dayjs from "dayjs";

const exportColumns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
    align: "center",
    render: (value, record, index) => index + 1,
    width: 50,
  },
  {
    title: "Lệnh xuất",
    dataIndex: "delivery_note_id",
    key: "delivery_note_id",
    align: "center",
    width: 120,
    render: (value) => value || "-",
  },
  {
    title: "Số xe",
    dataIndex: "vehicle_id",
    key: "vehicle_id",
    align: "center",
    width: 120,
    render: (value) => value || "-",
  },
  {
    title: "Mã pallet",
    dataIndex: "pallet_id",
    key: "pallet_id",
    align: "center",
    render: (value) => value || "-",
    width: 150,
  },
  {
    title: "Số lượng của pallet",
    dataIndex: "so_luong",
    key: "so_luong",
    align: "center",
    render: (value) => value || "-",
    width: 100,
  },
  {
    title: "Số lượng có thể xuất",
    dataIndex: "so_luong_ton",
    key: "so_luong_ton",
    align: "center",
    render: (value, record) => (record.lsx_pallets ?? []).reduce((acc, curr) => acc + (curr.remain_quantity ?? 0), 0) || "-",
    width: 100,
  },
  {
    title: "Vị trí",
    dataIndex: "locator_id",
    key: "locator_id",
    align: "center",
    render: (value) => value || "-",
    width: 100,
  },
  {
    title: "Khách hàng",
    dataIndex: "customer_id",
    key: "customer_id",
    align: "center",
    render: (value) => value || "-",
    width: 150,
  },
];

const options = [
  {
    label: "Nhập",
    value: "nhap",
  },
  {
    label: "Xuất",
    value: "xuat",
  },
];

const Export = (props) => {
  document.title = "Kho thành phẩm";
  const SCAN_TIME_OUT = 1000;
  const { line } = useParams();
  const history = useHistory();
  const [selectedItem, setSelectedItem] = useState([]);
  const [overall, setOverall] = useState([{}]);
  const [visible, setVisible] = useState(false);
  const [isOpenQRScanner, setIsOpenQRScanner] = useState();
  const [deliveryNoteList, setDeliveryNote] = useState([]);
  const [vehicleList, setVehicle] = useState([]);
  const [deliveryNoteID, setDeliveryNoteID] = useState();
  const [loadingTable, setLoadingTable] = useState(false);
  const [form] = Form.useForm();
  const scanRef = useRef();
  const [params, setParams] = useState({ start_date: dayjs(), end_date: dayjs() });
  const [selectedExportPlan, setSelectedExportPlan] = useState();
  const column2 = [
    {
      title: "Kho",
      dataIndex: "kho",
      key: "kho",
      align: "center",
      render: () => (
        <Select
          options={options}
          value={line}
          onChange={onChangeLine}
          style={{ width: "100%" }}
          bordered={false}
        />
      ),
    },
    {
      title: "Tổng pallet tạo",
      dataIndex: "sl_pallet_tao",
      key: "sl_pallet_tao",
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "Tổng số pallet nhập",
      dataIndex: "sl_nhap",
      key: "sl_nhap",
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "Sl xuất",
      dataIndex: "sl_xuat",
      key: "sl_xuat",
      align: "center",
      render: (value) => value || "-",
    },
  ];
  const columnDetail = [
    {
      title: "Số xe",
      dataIndex: "vehicle_id",
      key: "vehicle_id",
      align: "center",
      width: 150,
      render: () => (
        <Select
          options={vehicleList}
          allowClear
          onChange={(value) => setParams({ ...params, vehicle_id: value })}
          style={{ width: "100%" }}
          showSearch
          optionFilterProp="label"
          bordered={false}
        />
      ),
    },
    {
      title: "Lệnh xuất kho",
      dataIndex: "lenh_xuat_kho",
      key: "lenh_xuat_kho",
      align: "center",
      width: 150,
      render: () => (
        <Select
          options={deliveryNoteList}
          allowClear
          onChange={(value) => setParams({ ...params, delivery_note_id: value })}
          style={{ width: "100%" }}
          showSearch
          optionFilterProp="label"
          bordered={false}
        />
      ),
    },
    {
      title: "Vị trí",
      dataIndex: "locator_id",
      key: "locator_id",
      align: "center",
      width: 100,
      render: (value) => value || "-",
    },
    {
      title: "Pallet",
      dataIndex: "pallet_id",
      key: "pallet_id",
      align: "center",
      width: 150,
      render: (value) => value || "-",
    },
    {
      title: "Số lượng",
      dataIndex: "so_luong_con_lai",
      key: "so_luong_con_lai",
      align: "center",
      fixed: 'right',
      width: 100,
      render: (value) => value || "-",
      onHeaderCell: (column) => {
        return {
          onClick: () => {
            selectedItem.length > 0 && setVisible(true);
          },
          style: {
            cursor: 'pointer'
          },
        };
      },
    },
  ];

  const lsxColumns = [
    // {
    //   title: "Mã pallet",
    //   dataIndex: "pallet_id",
    //   key: "pallet_id",
    //   align: "center",
    //   width: 150,
    //   render: (value) => value || "-",
    // },
    {
      title: "Lô sản xuất",
      dataIndex: "lo_sx",
      key: "lo_sx",
      align: "center",
      width: 150,
      render: (value) => value || "-",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer_id",
      key: "customer_id",
      align: "center",
      width: 120,
      render: (value) => value || "-",
    },
    {
      title: "MĐH",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
      width: 120,
      render: (value) => value || "-",
    },
    {
      title: "MQL",
      dataIndex: "mql",
      key: "mql",
      align: "center",
      width: 80,
      render: (value) => value || "-",
    },
    {
      title: "Số lượng ban đầu",
      dataIndex: "so_luong",
      key: "so_luong",
      align: "center",
      width: 150,
      render: (value) => value || "-",
    },
    {
      title: "Số lượng xuất",
      dataIndex: "remain_quantity",
      key: "remain_quantity",
      width: 150,
      align: "center",
      render: (value, record, index) =>
        <InputNumber disabled={record.status === 2 && record.remain_quantity === 0} value={value} onChange={(value) => setSelectedItem(
            [...selectedItem].map((e, i) => {
              if (i === index) {
                return { ...e, remain_quantity: value }
              }
              return e;
            })
        )} />
      ,
    },
  ]

  const onChangeLine = (value) => {
    history.push("/oi/warehouse/kho-tp/" + value);
  };

  const onChangeDeliveryNote = async (value) => {
    setDeliveryNoteID(value);
  }

  const loadDataTable = async () => {
    setLoadingTable(true);
    const res = await getWarehouseFGExportLogs({ ...params });
    if (res.success) {
      setData(res.data.data);
      setDeliveryNote((res.data.delivery_notes ?? []).map(e=>({label: e.id, value: e.id})));
      setVehicle((res.data.vehicles ?? []).map(e=>({label: e.id, value: e.id})));
    }
    setLoadingTable(false);
  }
  useEffect(() => {
    if (deliveryNoteID) {
      loadDataTable(deliveryNoteID)
    }
  }, [deliveryNoteID]);

  const handleCloseMdl = () => {
    setIsOpenQRScanner(false);
  };
  const [data, setData] = useState([]);
  useEffect(()=>{
    if(data.length){
      const result = data.find((element) => element.pallet_id == selectedExportPlan?.pallet_id);
      setSelectedExportPlan(result);
      setSelectedItem(result?.lsx_pallets ?? []);
    } else {
      setSelectedItem([]);
    }
  }, [data])
  const onScan = async (result) => {
    setSelectedExportPlan(data.find((element) => element.id == result));
  };
  const loadData = async () => {
    var res2 = await getWarehouseFGOverall(params);
    setOverall([res2.data]);
  }
  const saveExportPallet = async () => {
    var res = await exportPallet(selectedItem.filter((e) => selectedRowKeys.includes(e.id)));
    if (res.success) {
      setVisible(false);
      form.resetFields();
      // loadData();
      loadDataTable(deliveryNoteID);
      setSelectedRowKeys([]);
    }
  }
  const [isDownloading, setIsDownloading] = useState(false)
  const onDownloadDeliveryNote = async () => {
    if (!params?.delivery_note_id) {
      message.warning('Chưa chọn lệnh xuất kho')
      return 0;
    }
    setIsDownloading(true);
    var res = await downloadDeliveryNote({ delivery_note_id: params?.delivery_note_id });
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setIsDownloading(false);
  }
  useEffect(() => {
    loadData();
    loadDataTable(deliveryNoteID);
  }, [params])

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  return (
    <React.Fragment>
      <Row className="mt-1" gutter={[4, 12]}>
        <Col span={24}>
          <Table
            pagination={false}
            bordered
            size="small"
            className="mb-1"
            locale={{ emptyText: 'Trống' }}
            columns={column2}
            dataSource={overall}
          />
        </Col>
        <Col span={24}>
          <Table
            pagination={false}
            bordered
            size="small"
            className="mb-1"
            locale={{ emptyText: 'Trống' }}
            scroll={{ x: '100%' }}
            columns={columnDetail}
            dataSource={[selectedExportPlan]}
          />
        </Col>
        <Col span={8}>
          <DatePicker
            allowClear={false}
            placeholder="Từ ngày"
            style={{ width: "100%" }}
            format={'DD/MM/YYYY'}
            defaultValue={params.start_date}
            onChange={(value) => value && value?.isValid() && setParams({ ...params, start_date: value })}
          />
        </Col>
        <Col span={8}>
          <DatePicker
            allowClear={false}
            placeholder="Đến ngày"
            style={{ width: "100%" }}
            format={'DD/MM/YYYY'}
            defaultValue={params.end_date}
            onChange={(value) => value && value?.isValid() && setParams({ ...params, end_date: value })}
          />
        </Col>
        <Col span={4}>
          <Button
            block
            className="h-100 w-100"
            icon={<QrcodeOutlined style={{ fontSize: "20px" }} />}
            type="primary"
            onClick={() => setIsOpenQRScanner(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
          </Button>
        </Col>
        <Col span={4}>
          <Button
            block
            disabled={!params?.delivery_note_id}
            title={!params?.delivery_note_id ? 'Chưa chọn lệnh xuất kho' : 'Tải xuống lệnh xuất kho'}
            className="h-100 w-100"
            icon={<DownloadOutlined style={{ fontSize: "20px" }} />}
            type="primary"
            loading={isDownloading}
            onClick={onDownloadDeliveryNote}
          >
          </Button>
        </Col>
        <Col span={24}>
          <Table
            rowClassName={(record, index) =>
              'no-hover ' + (record?.pallet_id === selectedExportPlan?.pallet_id ? "table-row-green" : "")
            }
            loading={loadingTable}
            pagination={false}
            bordered
            scroll={{ y: 'calc(100vh - 50vh)', x: '100%' }}
            className="mb-4"
            size="small"
            rowHoverable={false}
            columns={exportColumns}
            dataSource={data}
            onRow={(record) => {
              return {
                onClick: () => {setSelectedExportPlan(record); setSelectedItem(record?.lsx_pallets ?? [])},
              };
            }}
          />
        </Col>
      </Row>
      {isOpenQRScanner && (
        <Modal
          title="Quét QR"
          open={isOpenQRScanner}
          onCancel={handleCloseMdl}
          footer={null}
        >
          <ScanQR
            isScan={isOpenQRScanner}
            onResult={(res) => {
              onScan(res);
              setIsOpenQRScanner(false);
            }}
          />
        </Modal>
      )}
      {visible && (
        <Modal
          title="Danh sách lô cần xuất"
          open={visible}
          onCancel={() => {
            setVisible(false);
            setSelectedRowKeys([]);
            setSelectedItem(data.find((e) => e.pallet_id === selectedExportPlan?.pallet_id)?.lsx_pallets ?? []);
          }}
          okButtonProps={{
            disabled: selectedRowKeys.length <= 0
          }}
          okText={"Lưu"}
          onOk={() => saveExportPallet()}
          width={1000}
        >
          <Table
            rowClassName={(record, index) =>
                record.status === 2 && record.remain_quantity === 0
                  ? "table-row-grey"
                  : ""
            }
            scroll={{
              x: '100%',
              y: 'calc(100vh - 50vh)'
            }}
            pagination={false}
            bordered
            className="mb-4"
            columns={lsxColumns}
            dataSource={selectedItem}
            rowKey={(record) => record.id}
            rowSelection={{
              type: 'checkbox',
              columnTitle: <span><Checkbox disabled={selectedItem.every((e) => e.status === 2 && e.remain_quantity === 0)} indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < selectedItem.length} checked={selectedRowKeys.length === selectedItem.length} onChange={(e) => setSelectedRowKeys(e.target.checked ? selectedItem.filter((e) => !(e.status === 2 && e.remain_quantity === 0)).map((e) => e.id) : [])}/> Chọn để xuất</span>,
              columnWidth: 70,
              selectedRowKeys,
              getCheckboxProps: (record) => ({
                disabled: record.status === 2 && record.remain_quantity === 0,
              }),
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRowKeys(selectedRowKeys);
              },
            }}
          />
          <Space direction="vertical" style={{ width: '100%' }}>
            <strong>Tổng số lô đã chọn để xuất: {selectedRowKeys.length}</strong>
            <strong>Tổng số lượng xuất: {selectedItem.filter((e) => selectedRowKeys.includes(e.id)).reduce((acc, curr) => acc + (curr.remain_quantity ?? 0), 0)}</strong>
          </Space>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default Export;
