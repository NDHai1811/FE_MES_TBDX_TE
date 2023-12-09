import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Table, Button, Modal, Select, message } from "antd";
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { useReactToPrint } from "react-to-print";
import { PrinterOutlined, QrcodeOutlined } from "@ant-design/icons";
import ScanQR from "../../../components/Scanner";
import {
  exportNvlData,
  getExportNvlLogs,
  getWarehouseOverall,
} from "../../../api/oi/warehouse";
import "./style.css";

const columnDetail = [
  {
    title: "Vị trí",
    dataIndex: "locator_id",
    key: "locator_id",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Mã cuộn TBDX",
    dataIndex: "material_id",
    key: "material_id",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Đầu máy",
    dataIndex: "dau_may",
    key: "dau_may",
    align: "center",
    render: (value) => value || "-",
  },
];

const exportColumns = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
    align: "center",
    render: (value, record, index) => index + 1,
  },
  {
    title: "Vị trí",
    dataIndex: "locator_id",
    key: "locator_id",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Mã cuộn TBDX",
    dataIndex: "material_id",
    key: "material_id",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Đầu máy",
    dataIndex: "dau_may",
    key: "dau_song",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Thời gian cần",
    dataIndex: "time_need",
    key: "time_need",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Số kg",
    dataIndex: "so_kg",
    key: "so_kg",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Loại giấy",
    dataIndex: "loai_giay",
    key: "loai_giay",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Khổ",
    dataIndex: "kho_giay",
    key: "kho_giay",
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
  document.title = "Kho";
  const { line } = useParams();
  const history = useHistory();
  const [listTem, setListTem] = useState([]);
  const [selectedItem, setSelectedItem] = useState([
    {
      material_id: "",
      dau_may: "",
      locator_id: "",
    },
  ]);
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  const [overall, setOverall] = useState([]);
  const [locaion, setLocaion] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const messageAlert = (content, type = "error") => {
    messageApi.open({
      type,
      content,
      className: "custom-class",
      style: {
        marginTop: "50%",
      },
    });
  };

  useEffect(() => {
    getLogs();
    getOverAll();
  }, []);

  const getLogs = () => {
    getExportNvlLogs()
      .then((res) => setLogs(res.data))
      .catch((err) => console.log("Lấy danh sách thất bại: ", err));
  };

  const getOverAll = () => {
    getWarehouseOverall()
      .then((res) => setOverall([res.data]))
      .catch((err) => console.log("Lấy dữ liệu thất bại: ", err));
  };

  const onShowPopup = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

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
      dataIndex: "so_ngay_ton",
      key: "so_ngay_ton",
      align: "center",
      render: (value) => value || "-",
    },
  ];

  const onSelectItem = (val) => {
    setSelectedItem([val]);
  };

  const onChangeLine = (value) => {
    history.push("/warehouse/kho-nvl/" + value);
  };

  useEffect(() => {
    if (listTem.length > 0) {
      handlePrint();
      setListTem([]);
    }
  }, [listTem.length]);

  const componentRef1 = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef1.current,
  });

  const onScanLocation = (result) => {
    if (result === selectedItem[0].locator_id) {
      setLocaion(result);
    } else {
      messageAlert("Vị trí chưa đúng, vui lòng quét lại vị trí!");
    }
  };

  const onScanMaterial = (result) => {
    if (result === selectedItem[0].material_id) {
      exportNvlData({ id: selectedItem[0].id })
        .then((res) => {
          messageAlert("Xuất kho thành công!", "success");
          console.log(res.data);
          getLogs();
          setLocaion("");
        })
        .catch((err) => {
          messageAlert("Xuất kho thất bại!");
          console.log("Xuất kho thất bại: ", err);
        });
    } else {
      messageAlert("Mã cuộn chưa đúng, vui lòng quét lại mã cuộn!");
    }
  };

  return (
    <React.Fragment>
      {contextHolder}
      <Row className="mt-3" gutter={[6, 12]}>
        <Col span={24}>
          <Table
            pagination={false}
            bordered
            className="mb-1"
            columns={column2}
            dataSource={overall}
          />
        </Col>
        <Col span={24}>
          <Table
            pagination={false}
            bordered
            className="mb-1"
            columns={columnDetail}
            dataSource={selectedItem}
          />
        </Col>
        <Col span={12}>
          <Button
            block
            className="h-100 w-100"
            icon={<QrcodeOutlined style={{ fontSize: "20px" }} />}
            type="primary"
            onClick={() => (selectedItem[0].material_id ? onShowPopup() : null)}
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
            // onClick={onShowPopup}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            In tem
          </Button>
        </Col>
        <Col span={24}>
          <Table
            scroll={{
              x: "calc(700px + 50%)",
              y: 300,
            }}
            rowClassName={(record, index) => {
              return record.id === selectedItem[0]?.id
                ? "no-hover " + "table-row-green"
                : "table-row-light";
            }}
            pagination={false}
            bordered
            className="mb-4"
            columns={exportColumns}
            dataSource={logs}
            onRow={(record) => {
              return {
                onClick: () => onSelectItem(record),
              };
            }}
          />
        </Col>
      </Row>
      {visible && (
        <Modal title="Quét QR" open={visible} onCancel={onClose} footer={null}>
          <ScanQR
            isScan={visible}
            onResult={(res) => {
              !locaion ? onScanLocation(res) : onScanMaterial(res);
              onClose();
            }}
          />
        </Modal>
      )}
    </React.Fragment>
  );
};

export default Export;
