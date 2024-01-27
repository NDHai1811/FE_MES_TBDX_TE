import React, { useEffect, useState } from "react";
import { Row, Col, Table, Button, Modal, Select, Input, Form } from "antd";
import "../../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { warehousExportTPData } from "../mock-data";
import ScanQR from "../../../../components/Scanner";
import PopupQuetQrNhapKho from "../../../../components/Popup/PopupQuetQrNhapKho";
import { PrinterOutlined, QrcodeOutlined } from "@ant-design/icons";
import { exportPallet, getWarehouseFGExportLogs } from "../../../../api/oi/warehouse";

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
  const { line } = useParams();
  const history = useHistory();
  const [selectedItem, setSelectedItem] = useState();
  const [overall, setOverall] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
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
      title: "Vị trí",
      dataIndex: "locator_id",
      key: "locator_id",
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "Pallet",
      dataIndex: "pallet_id",
      key: "pallet_id",
      align: "center",
      render: (value) => value || "-",
    },
    {
      title: "Số lượng xuất",
      dataIndex: "so_luong",
      key: "so_luong",
      align: "center",
      render: (value) => value || "-",
      onHeaderCell: (column) => {
        return {
          onClick: () => {
            selectedItem && setVisible(true);
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
    history.push("/warehouse/kho-tp/" + value);
  };

  const onSelectItem = (val) => {
    setSelectedItem(val);
    form.setFieldsValue(val?.lo_sx);
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    loadData()
  }, []);

  const loadData = async () => {
    var res = await getWarehouseFGExportLogs();
    setData(res.data);
    setSelectedItem();
  }
  const onFinish = async (values) => {
    const params = {pallet_id: selectedItem?.pallet_id, lo_sx: values}
    var res = await exportPallet(params);
    if(res.success){
      setVisible(false);
      form.resetFields();
      loadData();
    }
  }
  return (
    <React.Fragment>
      <Row className="mt-3" gutter={[4, 12]}>
        <Col span={24}>
          <Table
            pagination={false}
            bordered
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
            className="mb-1"
            locale={{ emptyText: 'Trống' }}
            columns={columnDetail}
            dataSource={selectedItem ? [selectedItem] : []}
          />
        </Col>
        {/* <Col span={24}>
          <Row gutter={8}>
            <Col span={12}>
              <Button
                block
                className="h-100 w-100"
                icon={<QrcodeOutlined style={{ fontSize: "20px" }} />}
                type="primary"
                onClick={() => setIsScan(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Quét QR Code
              </Button>
            </Col>
            <Col span={12}>
              <Button
                block
                className="h-100 w-100"
                icon={<PrinterOutlined style={{ fontSize: "20px" }} />}
                type="primary"
                onClick={onShowPopup}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                In tem lại
              </Button>
            </Col>
          </Row>
        </Col> */}
        <Col span={24}>
          <Table
            rowClassName={(record, index) =>
              'no-hover ' + (record?.pallet_id === selectedItem?.pallet_id ? "table-row-green" : "")
            }
            pagination={false}
            bordered
            scroll={{y: '30vh'}}
            className="mb-4"
            columns={exportColumns}
            dataSource={data}
            onRow={(record) => {
              return {
                onClick: () => onSelectItem(record),
              };
            }}
          />
        </Col>
      </Row>
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
