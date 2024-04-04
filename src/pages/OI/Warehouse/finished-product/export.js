import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Table, Modal, Select, Input, Form, Button, message } from "antd";
import "../../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { downloadDeliveryNote, exportPallet, getDeliveryNoteList, getWarehouseFGExportLogs, getWarehouseFGOverall } from "../../../../api/oi/warehouse";
import { DownloadOutlined, QrcodeOutlined } from "@ant-design/icons";
import ScanQR from "../../../../components/Scanner";
import { baseURL } from "../../../../config";

const exportColumns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
    align: "center",
    render: (value, record, index) => index + 1,
  },
  {
    title: "Thời gian xuất KH",
    dataIndex: "thoi_gian_xuat",
    key: "thoi_gian_xuat",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Vị trí",
    dataIndex: "locator_id",
    key: "locator_id",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Mã tem (pallet)",
    dataIndex: "pallet_id",
    key: "pallet_id",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Số lượng",
    dataIndex: "so_luong",
    key: "so_luong",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Khách hàng",
    dataIndex: "khach_hang",
    key: "khach_hang",
    align: "center",
    render: (value) => value || "-",
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
  const [selectedItem, setSelectedItem] = useState();
  const [overall, setOverall] = useState([{}]);
  const [visible, setVisible] = useState(false);
  const [isOpenQRScanner, setIsOpenQRScanner] = useState();
  const [deliveryNoteList, setDeliveryNote] = useState([]);
  const [deliveryNoteID, setDeliveryNoteID] = useState();
  const [form] = Form.useForm();
  const scanRef = useRef();
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
      title: "Sl nhập",
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
    {
      title: "Sl tồn",
      dataIndex: "sl_ton",
      key: "sl_ton",
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "Số ngày tồn kho",
      dataIndex: "so_ngay_ton_kho",
      key: "so_ngay_ton_kho",
      align: "center",
      render: (value) => value || "-",
    },
  ];
  const columnDetail = [
    {
      title: "Lệnh xuất kho",
      dataIndex: "lenh_xuat_kho",
      key: "lenh_xuat_kho",
      align: "center",
      width: '25%',
      render: () => (
        <Select
          options={deliveryNoteList}
          allowClear
          onChange={onChangeDeliveryNote}
          style={{ width: "100%" }}
          bordered={false}
        />
      ),
    },
    {
      title: "Vị trí",
      dataIndex: "locator_id",
      key: "locator_id",
      align: "center",
      width: '25%',
      render: (value) => value || "-",
    },
    {
      title: "Pallet",
      dataIndex: "pallet_id",
      key: "pallet_id",
      align: "center",
      width: '25%',
      render: (value) => value || "-",
    },
    {
      title: "Số lượng xuất",
      dataIndex: "so_luong",
      key: "so_luong",
      align: "center",
      width: '25%',
      render: (value) => value || "-",
      onHeaderCell: (column) => {
        return {
          onClick: () => {
            selectedItem && selectedItem?.lo_sx?.length > 0 && setVisible(true);
          },
          style: {
            cursor: 'pointer'
          },
        };
      },
    },
  ];

  const lsxColumns = [
    {
      title: "Lô SX",
      dataIndex: "lo_sx",
      key: "lo_sx",
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "MĐH",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "MQL",
      dataIndex: "mql",
      key: "mql",
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "Số lượng",
      dataIndex: "so_luong",
      key: "so_luong",
      align: "center",
      render: (value, record, index) =>
        <>
          <Form.Item name={[index, "lo_sx"]} noStyle hidden><Input /></Form.Item>
          <Form.Item name={[index, "so_luong"]} noStyle><Input /></Form.Item>
        </>
      ,
    },
  ]

  const onChangeLine = (value) => {
    history.push("/oi/warehouse/kho-tp/" + value);
  };

  const onChangeDeliveryNote = async (value) => {
    setDeliveryNoteID(value);
  }

  const [loadingTable, setLoadingTable] = useState(false);
  const loadDataTable = async () => {
    setLoadingTable(true);
    const res = await getWarehouseFGExportLogs({ 'delivery_note_id': deliveryNoteID });
    if (res.success) {
      setData(res.data);
    }
    setLoadingTable(false);
  }
  useEffect(() => {
    loadDataTable()
  }, [deliveryNoteID]);

  const handleCloseMdl = () => {
    setIsOpenQRScanner(false);
  };

  const onSelectItem = (val) => {
    setSelectedItem(val);
    form.setFieldsValue(val?.lo_sx);
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    loadData()
  }, []);
  const onScan = async (result) => {
    console.log(result);
    if (scanRef.current) {
      clearTimeout(scanRef.current);
    }
    scanRef.current = setTimeout(() => {
      const current_data = data.find((element) => {
        return element.pallet_id == result;
      })
      if (current_data) {
        onSelectItem(current_data);
      } else {
        message.info('Mã pallet không khớp');
        onSelectItem({});
      }
    }, SCAN_TIME_OUT);
  };
  const loadData = async () => {
    var res2 = await getWarehouseFGOverall();
    setOverall([res2.data])
    var res3 = await getDeliveryNoteList();
    const arr = [];
    res3.data.map((value) => {
      return arr.push({ 'label': value.id, 'value': value.id });
    });
    setDeliveryNote(arr);
    setSelectedItem();
  }
  const onFinish = async (values) => {
    const params = { pallet_id: selectedItem?.pallet_id, lo_sx: values, delivery_note_id: deliveryNoteID }
    var res = await exportPallet(params);
    if (res.success) {
      setVisible(false);
      form.resetFields();
      loadData();
      loadDataTable();
    }
  }
  const [isDownloading, setIsDownloading] = useState(false)
  const onDownloadDeliveryNote = async () => {
    if(!deliveryNoteID){
      message.warning('Chưa chọn lệnh xuất kho')
      return 0;
    }
    setIsDownloading(true);
    var res = await downloadDeliveryNote({delivery_note_id: deliveryNoteID});
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setIsDownloading(false);
  }
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
            columns={columnDetail}
            dataSource={selectedItem ? [selectedItem] : [{}]}
          />
        </Col>
        <Col span={12}>
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
            Quét tem gộp
          </Button>
        </Col>
        <Col span={12}>
          <Button
            block
            className="h-100 w-100"
            icon={<DownloadOutlined style={{ fontSize: "20px" }} />}
            type="primary"
            loading={isDownloading}
            onClick={onDownloadDeliveryNote}
          >
            Tải phiếu xuất hàng
          </Button>
        </Col>
        <Col span={24}>
          <Table
            rowClassName={(record, index) =>
              'no-hover ' + (record?.pallet_id === selectedItem?.pallet_id ? "table-row-green" : "")
            }
            loading={loadingTable}
            pagination={false}
            bordered
            scroll={{ y: '30vh' }}
            className="mb-4"
            size="small"
            columns={exportColumns}
            dataSource={data}
          // onRow={(record) => {
          //   return {
          //     onClick: () => onSelectItem(record),
          //   };
          // }}
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
          onCancel={() => setVisible(false)}
          okText={"Lưu"}
          onOk={() => form.submit()}
          width={600}
        >
          <Form form={form} onFinish={onFinish}>
            <Table
              rowClassName={(record, index) =>
                record.status === 1
                  ? "table-row-yellow"
                  : record.status === 2
                    ? "table-row-grey"
                    : ""
              }
              pagination={false}
              bordered
              className="mb-4"
              columns={lsxColumns}
              dataSource={selectedItem?.lo_sx ?? []}
            />
          </Form>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default Export;
