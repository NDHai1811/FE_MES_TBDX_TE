import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Table, Form, Button } from "antd";
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import SelectButton from "../../../components/Button/SelectButton";
import { useProfile } from "../../../components/hooks/UserHooks";
import { useReactToPrint } from "react-to-print";
import { warehousExportNVLData } from "./mock-data";
import ScanButton from "../../../components/Button/ScanButton";
import { PrinterOutlined } from "@ant-design/icons";

const columnDetail = [
  {
    title: "Vị trí",
    dataIndex: "vi_tri",
    key: "vi_tri",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Mã cuộn TBDX",
    dataIndex: "TBDX_id",
    key: "TBDX_id",
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
    dataIndex: "vi_tri",
    key: "vi_tri",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Mã cuộn TBDX",
    dataIndex: "ma_cuon_tbdx",
    key: "ma_cuon_tbdx",
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
    dataIndex: "time",
    key: "time",
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
    dataIndex: "kho",
    key: "kho",
    align: "center",
    render: (value) => value || "-",
  },
];

const column2 = [
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
  const [customersData, setCustomersData] = useState([]);
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ plan_export: 0, actual_export: 0 });
  const { userProfile } = useProfile();
  const [listTem, setListTem] = useState([]);
  const [selectedItem, setSelectedItem] = useState([
    {
      ma_cuon_tbdx: "456",
      dau_song: "sC",
      vi_tri: "A01",
    },
  ]);

  useEffect(() => {
    if (data.length > 0) {
      let sum = { plan_export: 0, actual_export: 0 };
      data.forEach((e) => {
        sum.plan_export += e?.plan_export ?? 0;
        sum.actual_export += e?.actual_export ?? 0;
      });
      setSummary(sum);
    }
  }, data);

  const onSelectItem = (val) => {
    setSelectedItem([val]);
  };

  const onChangeLine = (value) => {
    history.push("/warehouse/kho-nvl/" + value);
  };
  const [customers, setCustomers] = useState([]);
  const [row1, setRow1] = useState([
    {
      title: "Kế hoạch xuất",
      value: 1000,
    },
    {
      title: "Số lượng",
      value: 1000,
    },
    {
      title: "Tỷ lệ",
      value: 1000,
    },
  ]);
  const [row2, setRow2] = useState([
    {
      title: "Số lot",
      value: "",
    },
    {
      title: "Số MQL",
      value: "",
    },
    {
      title: "Số lượng",
      value: "",
    },
    {
      title: "Vị trí",
      value: "",
    },
  ]);
  const [openModal, setOpenModal] = useState(false);
  const [currentLot, setCurrentLot] = useState([
    {
      soKgNhapTrongNgay: 0,
      soCuonNhapTrongNgay: 0,
      soKgTonTrongKho: 0,
      soCuonTonTrongKho: 0,
    },
  ]);

  const [valueQR, setValueQR] = useState("");
  const [form] = Form.useForm();
  // const onFinish = async (values) => {
  //   values.lot_id = currentLot.lot_id;
  //   const res = await splitBarrel(values);
  //   setListTem(res);
  //   setOpenModal(false);
  //   setData((prev) =>
  //     prev.map((e) => {
  //       if (e.lot_id === currentLot.lot_id) {
  //         e.so_luong = values.remain_quanlity;
  //       }
  //       return e;
  //     })
  //   );
  //   setCurrentLot();
  //   setRow2([
  //     {
  //       title: "Mã hàng",
  //       value: "",
  //     },
  //     {
  //       title: "Tên SP",
  //       value: "",
  //     },
  //     {
  //       title: "Mã thùng",
  //       value: "",
  //     },
  //     {
  //       title: "Số lượng",
  //       value: "",
  //     },
  //     {
  //       title: "Vị trí",
  //       value: "",
  //     },
  //   ]);
  // };
  useEffect(() => {
    if (listTem.length > 0) {
      handlePrint();
      setListTem([]);
    }
  }, [listTem.length]);

  // const onClickRow = (record) => {
  //   setData((prev) =>
  //     prev.map((e) => {
  //       if (e.lot_id === record.lot_id && record.status !== 2) {
  //         return { ...e, status: 1 };
  //       }
  //       if (e.status === 2) {
  //         return e;
  //       }
  //       return { ...e, status: 0 };
  //     })
  //   );
  // };
  // const onChangeCustomer = async (value) => {
  //   setCurrentKhachHang(value);
  //   const res = await getProposeExportWareHouse({ khach_hang: value });
  //   setData(res);
  // };
  // const loadInfo = async () => {
  //   setRow1(await getInfoExportWareHouse());
  // };
  // const loadCustomer = async () => {
  //   setCustomersData(await getListCustomerExport());
  // };
  // useEffect(() => {
  //   (async () => {
  //     loadCustomer();
  //     loadInfo();
  //   })();
  // }, []);
  // const getLotCurrent = async (e) => {
  //   if (currentKhachHang) {
  //     const current_lot = data.find(
  //       (old_data) => old_data.lot_id === e.target.value
  //     );
  //     if (current_lot !== undefined) {
  //       if (current_lot.status === 2) {
  //         message.error("Thùng hàng đã xuất");
  //       } else {
  //         setCurrentLot(current_lot);
  //         setRow2([
  //           {
  //             title: "Mã hàng",
  //             value: current_lot.product_id,
  //             cell_color: "#fdfdb4",
  //           },
  //           {
  //             title: "Tên SP",
  //             value: current_lot.ten_san_pham,
  //             cell_color: "#fdfdb4",
  //           },
  //           {
  //             title: "Mã thùng",
  //             value: current_lot.lot_id,
  //             cell_color: "#fdfdb4",
  //           },
  //           {
  //             title: "Số lượng",
  //             value: current_lot.so_luong,
  //             cell_color: "#fdfdb4",
  //           },
  //           {
  //             title: "Vị trí",
  //             value: current_lot.vi_tri,
  //             cell_color: "#fdfdb4",
  //           },
  //         ]);
  //         setValueQR("");
  //       }
  //     } else {
  //       message.error("Mã thùng không có trong danh sách gợi ý");
  //     }
  //   } else {
  //     const res = await getDetailLot({ lot_id: e.target.value });
  //     setCurrentLot(res);
  //     setRow2([
  //       {
  //         title: "Mã hàng",
  //         value: res.product_id,
  //         cell_color: "#fdfdb4",
  //       },
  //       {
  //         title: "Tên SP",
  //         value: res.ten_san_pham,
  //         cell_color: "#fdfdb4",
  //       },
  //       {
  //         title: "Mã thùng",
  //         value: res.lot_id,
  //         cell_color: "#fdfdb4",
  //       },
  //       {
  //         title: "Số lượng",
  //         value: res.so_luong,
  //         cell_color: "#fdfdb4",
  //       },
  //       {
  //         title: "Vị trí",
  //         value: res.vi_tri,
  //         cell_color: "#fdfdb4",
  //       },
  //     ]);
  //     setValueQR("");
  //   }
  // };
  // const saveLogWareHouse = async (e) => {
  //   if (e.target.value === currentLot.vi_tri) {
  //     const res = await exportWareHouse({
  //       lot_id: currentLot.lot_id,
  //       cell_id: e.target.value,
  //       khach_hang: currentKhachHang,
  //     });
  //     setCurrentLot();
  //     const new_data = data.filter((old_data) => {
  //       if (old_data.product_id === currentLot.product_id) {
  //         old_data.thuc_te_xuat = old_data.thuc_te_xuat + currentLot.so_luong;
  //       }
  //       if (old_data.lot_id !== currentLot.lot_id) {
  //         return old_data;
  //       }
  //     });
  //     setData(new_data);
  //     setRow2([
  //       {
  //         title: "Mã hàng",
  //         value: "",
  //       },
  //       {
  //         title: "Tên SP",
  //         value: "",
  //       },
  //       {
  //         title: "Mã thùng",
  //         value: "",
  //       },
  //       {
  //         title: "Số lượng",
  //         value: "",
  //       },
  //       {
  //         title: "Vị trí",
  //         value: "",
  //       },
  //     ]);
  //     loadInfo();
  //     setValueQR("");
  //   } else {
  //     message.error("Không đúng vị trí đề xuất");
  //   }
  // };

  // const changeRemain = (value) => {
  //   form.setFieldValue("remain_quanlity", currentLot.so_luong - value);
  // };

  const componentRef1 = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef1.current,
  });

  // const [openModalGT, setOpenModalGT] = useState(false);

  // const [formGT] = Form.useForm();

  // const selectedGT = Form.useWatch([], formGT);

  // const onFinishGT = async (values) => {
  //   if (values.sl_gop > values.sl_thung2) {
  //     message.info("Số lượng gộp không được lớn hơn thùng gộp");
  //     return;
  //   }
  //   if (values.sl_gop <= 0) {
  //     message.info("Số lượng gộp phải lớn hơn 0");
  //     return;
  //   }
  //   var res = await gopThung(values);
  //   if (res) {
  //     setListTem(res);
  //   }
  //   formGT.resetFields();
  // };

  // const getDataThung = async () => {
  //   var res = await prepareGT(formGT.getFieldsValue(true));
  //   if (res) {
  //     formGT.setFieldsValue(res);
  //   }
  // };

  const onScan = () => {};
  return (
    <React.Fragment>
      <Row className="mt-3" gutter={[6, 12]}>
        <Col span={6}>
          <SelectButton
            value={line}
            options={options}
            label="Chọn"
            onChange={onChangeLine}
          />
        </Col>
        <Col span={18}>
          <Table
            // rowClassName={(record, index) =>
            //   record.status === 1
            //     ? "table-row-yellow"
            //     : record.status === 2
            //     ? "table-row-grey"
            //     : "table-row-green"
            // }
            pagination={false}
            bordered
            className="mb-1"
            columns={column2}
            dataSource={currentLot}
          />
        </Col>
        <Col span={24}>
          <Table
            // rowClassName={(record, index) =>
            //   record.status === 1
            //     ? "table-row-yellow"
            //     : record.status === 2
            //     ? "table-row-grey"
            //     : "table-row-green"
            // }
            pagination={false}
            bordered
            className="mb-1"
            columns={columnDetail}
            dataSource={selectedItem}
          />
        </Col>
        <Col span={12}>
          <ScanButton placeholder={"Nhập mã hoặc quét mã QR"} onScan={onScan} />
        </Col>
        <Col span={12}>
          <Button
            block
            className="h-100 w-100"
            icon={<PrinterOutlined style={{ fontSize: "20px" }} />}
            type="primary"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            In tem pallet
          </Button>
        </Col>
        <Col span={24}>
          <Table
            scroll={{
              x: window.screen.width,
            }}
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
            columns={exportColumns}
            dataSource={warehousExportNVLData}
            onRow={(record) => {
              return {
                onClick: () => onSelectItem(record),
              };
            }}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Export;
