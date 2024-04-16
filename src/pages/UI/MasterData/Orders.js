import {
  Col,
  Row,
  Card,
  Table,
  Divider,
  Button,
  Form,
  Input,
  Upload,
  message,
  Space,
  DatePicker,
  Popconfirm,
  InputNumber,
  Select,
  Modal,
  Checkbox,
  Popover,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useEffect } from "react";
import {
  createOrder,
  deleteOrders,
  exportOrders,
  getKhuon,
  getOrders,
  splitOrders,
  updateOrder,
} from "../../../api";
import { DeleteOutlined, EditOutlined, LinkOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import "../style.scss";
import { COMMON_DATE_TABLE_FORMAT_REQUEST } from "../../../commons/constants";
import dayjs from "dayjs";
import { formatDateTime } from "../../../commons/utils";
import {
  getBuyers,
  getListDRC,
  getListLayout,
} from "../../../api/ui/manufacture";
import "../style.scss";
import { useProfile } from "../../../components/hooks/UserHooks";

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
          showSearch
        />
      );
      break;
    default:
      inputNode = <Input onChange={(event) => onChange(event.target.value, dataIndex)} />;
  }
  const dateValue = record?.[dataIndex] ? dayjs(record?.[dataIndex]) : null;
  return (
    <td {...restProps}>
      {editing ? (
        inputType === "dateTime" ? (
          <DatePicker
            format={COMMON_DATE_TABLE_FORMAT_REQUEST}
            placeholder="Chọn ngày"
            value={dateValue}
            onChange={(value) => onChange(value, dataIndex)}
          />
        ) : (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            initialValue={record?.[dataIndex]}
          >
            {inputNode}
          </Form.Item>
        )
      ) : (
        children
      )}
    </td>
  );
};

const layoutTypes = [
  {
    label: "M",
    value: "M",
  },
  {
    label: "P8",
    value: "P8",
  },
];
const PL1s = [
  {
    label: "THÙNG",
    value: "thung",
  },
  {
    label: "PAD",
    value: "pad",
  },
  {
    label: "INNER",
    value: "inner",
  },
];
const PL2s = [
  {
    label: "Thùng 1 mảnh",
    value: "thung-1-manh",
    phan_loai_1: 'thung'
  },
  {
    label: "Thùng 2 mảnh",
    value: "thung-2-manh",
    phan_loai_1: 'thung'
  },
  {
    label: "Thùng 4 mảnh",
    value: "thung-4-manh",
    phan_loai_1: 'thung'
  },
  {
    label: "Thùng 1 nắp",
    value: "thung-1-nap",
    phan_loai_1: 'thung'
  },
  {
    label: "Cánh chồm",
    value: "canh-chom",
    phan_loai_1: 'thung'
  },
  {
    label: "Thùng bế",
    value: "thung-be",
    phan_loai_1: 'thung'
  },
  {
    label: "Thùng thường",
    value: "thung-thuong",
    phan_loai_1: 'inner'
  },
  {
    label: "Thùng bế",
    value: "thung-be",
    phan_loai_1: 'inner'
  },
  {
    label: "Pad U",
    value: "pad-u",
    phan_loai_1: 'pad'
  },
  {
    label: "Pad Z, rãnh",
    value: "pad-z-ranh",
    phan_loai_1: 'pad'
  },
  {
    label: "Pad Bế",
    value: "pad-be",
    phan_loai_1: 'pad'
  },
  {
    label: "Giấy tấm không tề",
    value: "giay-tam-khong-te",
    phan_loai_1: 'pad'
  },
  {
    label: "Giấy tấm có tề 1 mảnh (DxR)",
    value: "giay-tam-co-te-1-manh-dxr",
    phan_loai_1: 'pad'
  },
  {
    label: "Giấy tấm có tề 1 mảnh (DxRxC)",
    value: "giay-tam-co-te-1-manh-dxrxc",
    phan_loai_1: 'pad'
  },
  {
    label: "Giấy tấm có tề 2 mảnh (DxRxC)",
    value: "giay-tam-co-te-2-manh-dxrxc",
    phan_loai_1: 'pad'
  },
];
const Orders = () => {
  document.title = "Quản lý đơn hàng";
  const [form] = Form.useForm();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 20,
  });
  const [editingKey, setEditingKey] = useState("");
  const [isSidebar, setIsSidebar] = useState(true);
  const [splitKey, setSplitKey] = useState("");
  const [data, setData] = useState([]);
  const isEditing = (record) => record.key === editingKey;
  const [buyers, setBuyers] = useState([]);
  const [layouts, setLayouts] = useState([]);
  const [listDRC, setListDRC] = useState([]);
  const [listKhuonLink, setListKhuonLink] = useState([]);
  const [listCheck, setListCheck] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isOpenMdl, setIsOpenMdl] = useState(false);
  const [rowUpdate, setRowUpdate] = useState({});
  const [listParams, setListParams] = useState([]);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingExport1, setLoadingExport1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [inputData, setInputData] = useState([
    {
      so_luong: 0,
      ngay_giao: "",
      xuong_giao: "",
    },
  ]);
  const defaulEditableColumns = ['short_name', 'mdh', 'length', 'width', 'height', 'kich_thuoc', 'mql', 'sl', 'unit', 'kich_thuoc_chuan', 'phan_loai_1', 'phan_loai_2', 'quy_cach_drc', 'buyer_id', 'khuon_id', 'toc_do', 'tg_doi_model', 'note_3', 'so_ra', 'kho', 'kho_tong', 'dai_tam', 'so_dao', 'so_met_toi', 'layout_type', 'layout_id', 'order', 'slg', 'slt', 'tmo', 'po', 'style', 'style_no', 'color', 'item', 'rm', 'size', 'price', 'into_money', 'xuong_giao', 'note_1', 'han_giao', 'han_giao_sx', 'nguoi_dat_hang', 'ngay_dat_hang', 'note_2', 'dot']
  const [editableColumns, setEditableColumns] = useState(defaulEditableColumns)
  const [optionChecks, setOptionChecks] = useState([
    {
      label: 'L',
      value: 'length',
    },
    {
      label: 'W',
      value: 'width',
    },
    {
      label: 'H',
      value: 'height',
    },
    {
      label: 'Khổ',
      value: 'kho',
    },
    {
      label: 'Khổ tổng',
      value: 'kho_tong',
    },
    {
      label: 'Dài tấm',
      value: 'dai_tam',
    },
    {
      label: 'Số ra',
      value: 'so_ra',
    },
    {
      label: 'Đơn vị',
      value: 'unit',
    },
    {
      label: 'Quy cách DRC',
      value: 'quy_cach_drc',
    },
    {
      label: 'Buyer',
      value: 'buyer_id',
    },
    {
      label: 'Tốc độ',
      value: 'toc_do',
    },
    {
      label: 'Thời gian đổi model',
      value: 'tg_doi_model',
    },
    {
      label: 'Kích thước chuẩn',
      value: 'kich_thuoc_chuan',
    },
    {
      label: 'Phân loại 1',
      value: 'phan_loai_1',
    },
    {
      label: 'Phân loại 2',
      value: 'phan_loai_2',
    },
    {
      label: 'Số dao',
      value: 'so_dao',
    },
    {
      label: 'Ghi chú sóng',
      value: 'note_3',
    },
    {
      label: 'Ghi chú TBDX',
      value: 'note_2',
    },
    {
      label: 'Ngày giao SX',
      value: 'han_giao_sx',
    },
    {
      label: 'Số mét tới',
      value: 'so_met_toi',
    },
    {
      label: 'Đợt',
      value: 'dot',
    },
    {
      label: 'Mã layout',
      value: 'layout_id',
    },
    {
      label: 'Chia máy + P8',
      value: 'layout_type',
    }
  ]);
  const checkAll = listParams.length > 0 ? optionChecks.length === listParams.length : false;
  const indeterminate = listParams.length > 0 && listParams.length < optionChecks.length;
  const onCheckAllChange = (e) => {
    const arr = optionChecks.map((value) => value.value);
    setListParams(e.target.checked ? arr : []);
  };
  const showInput = () => {
    setInputData([
      ...inputData,
      {
        so_luong: 0,
        ngay_giao: "",
        xuong_giao: "",
      },
    ]);
  };
  const [hideData, setHideData] = useState([]);
  const colDetailTable = [
    {
      title: "Khách hàng",
      dataIndex: "short_name",
      key: "short_name",
      align: "center",
      editable: true,
      checked: true,
      fixed: "left",
      width: 100,
    },
    {
      title: "MDH",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
      editable: true,
      checked: true,
      fixed: "left",
      width: 115,
    },
    {
      title: "L",
      dataIndex: "length",
      key: "length",
      align: "center",
      editable: true,
      checked: true,
      fixed: "left",
      width: 60,
    },
    {
      title: "W",
      dataIndex: "width",
      key: "width",
      align: "center",
      editable: true,
      checked: true,
      fixed: "left",
      width: 60,
    },
    {
      title: "H",
      dataIndex: "height",
      key: "height",
      align: "center",
      editable: true,
      checked: true,
      fixed: "left",
      width: 60,
    },
    {
      title: "Kích thước ĐH",
      dataIndex: "kich_thuoc",
      key: "kich_thuoc",
      align: "center",
      editable: true,
      fixed: "left",
      checked: true,
      width: 140
    },
    {
      title: "MQL",
      dataIndex: "mql",
      key: "mql",
      align: "center",
      editable: true,
      checked: true,
      width: 50,
      fixed: "left",
    },
    {
      title: "SL",
      dataIndex: "sl",
      key: "sl",
      align: "center",
      width: 60,
      editable: true,
      checked: true,
      fixed: "left",
    },
    {
      title: "Đơn vị tính",
      dataIndex: "unit",
      key: "unit",
      align: "center",
      width: 60,
      editable: true,
      checked: true,
    },
    {
      title: "Kích thước chuẩn",
      dataIndex: "kich_thuoc_chuan",
      key: "kich_thuoc_chuan",
      align: "center",
      editable: true,
      checked: true,
      width: 100
    },
    {
      title: "Phân loại 1",
      dataIndex: "phan_loai_1",
      key: "phan_loai_1",
      align: "center",
      width: 90,
      editable: true,
      checked: true,
      render: (value) => PL1s.find((e) => e.value === value)?.label,
    },
    {
      title: "Quy cách DRC",
      dataIndex: "quy_cach_drc",
      key: "quy_cach_drc",
      align: "center",
      width: 120,
      editable: true,
      checked: true,
    },
    {
      title: "Mã buyer",
      dataIndex: "buyer_id",
      key: "buyer_id",
      align: "center",
      editable: true,
      checked: true,
      width: "5%",
    },
    {
      title: "Phân loại 2",
      dataIndex: "phan_loai_2",
      key: "phan_loai_2",
      align: "center",
      width: 140,
      editable: true,
      checked: true,
      render: (value) => PL2s.find((e) => e.value === value)?.label,
    },
    {
      title: "Mã khuôn",
      dataIndex: "khuon_id",
      key: "khuon_id",
      align: "center",
      width: "5%",
      editable: true
    },
    {
      title: "Tốc độ",
      dataIndex: "toc_do",
      key: "toc_do",
      align: "center",
      editable: true,
      checked: true,
      width: "2%",
    },
    {
      title: "Thời gian thay model",
      dataIndex: "tg_doi_model",
      key: "tg_doi_model",
      align: "center",
      editable: true,
      checked: true,
      width: "2%",
    },
    {
      title: "Ghi chú sóng",
      dataIndex: "note_3",
      key: "note_3",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "Dài",
      dataIndex: "dai",
      key: "dai",
      align: "center",
      checked: true,
    },
    {
      title: "Rộng",
      dataIndex: "rong",
      key: "rong",
      align: "center",
      checked: true,
    },
    {
      title: "Cao",
      dataIndex: "cao",
      key: "cao",
      align: "center",
      checked: true,
    },
    {
      title: "Số ra",
      dataIndex: "so_ra",
      key: "so_ra",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "Khổ",
      dataIndex: "kho",
      key: "kho",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "Khổ tổng",
      dataIndex: "kho_tong",
      key: "kho_tong",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "Dài tấm",
      dataIndex: "dai_tam",
      key: "dai_tam",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "Số dao",
      dataIndex: "so_dao",
      key: "so_dao",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "Số mét tới",
      dataIndex: "so_met_toi",
      key: "so_met_toi",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "Chia máy + p8",
      dataIndex: "layout_type",
      key: "layout_type",
      align: "center",
      editable: true,
      checked: true,
      width: "2%",
    },
    {
      title: "Mã layout",
      dataIndex: "layout_id",
      key: "layout_id",
      align: "center",
      editable: true,
      checked: true,
      width: "4%",
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      align: "center",
      editable: true,
      checked: true,
      width: "6%",
    },
    {
      title: "SLG",
      dataIndex: "slg",
      key: "slg",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "SLT",
      dataIndex: "slt",
      key: "slt",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "TMO",
      dataIndex: "tmo",
      key: "tmo",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "PO",
      dataIndex: "po",
      key: "po",
      align: "center",
      editable: true,
      checked: true,
      width: "3%",
    },
    {
      title: "STYLE",
      dataIndex: "style",
      key: "style",
      align: "center",
      editable: true,
      checked: true,
      width: "10%",
    },
    {
      title: "STYLE NO",
      dataIndex: "style_no",
      key: "style_no",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "COLOR",
      dataIndex: "color",
      key: "color",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "ITEM",
      dataIndex: "item",
      key: "item",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "RM",
      dataIndex: "rm",
      key: "rm",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "SIZE",
      dataIndex: "size",
      key: "size",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "Thành tiền",
      dataIndex: "into_money",
      key: "into_money",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "Xưởng giao",
      dataIndex: "xuong_giao",
      key: "xuong_giao",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "Ghi chú khách hàng",
      dataIndex: "note_1",
      key: "note_1",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "Ngày giao hàng trên đơn",
      dataIndex: "han_giao",
      key: "han_giao",
      align: "center",
      width: "2.6%",
      editable: true,
      checked: true,
    },
    {
      title: "Ngày giao hàng SX",
      dataIndex: "han_giao_sx",
      key: "han_giao_sx",
      align: "center",
      width: "2.6%",
      editable: true,
      checked: true,
    },
    {
      title: "Người đặt hàng",
      dataIndex: "nguoi_dat_hang",
      key: "nguoi_dat_hang",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "ngay_dat_hang",
      key: "ngay_dat_hang",
      align: "center",
      width: "2.6%",
      editable: true,
      checked: true,
    },
    {
      title: "Ghi chú của TBDX",
      dataIndex: "note_2",
      key: "note_2",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "Đợt",
      dataIndex: "dot",
      key: "dot",
      align: "center",
      editable: true,
      checked: true,
    },
    {
      title: "Ngày thực hiện KH",
      dataIndex: "ngay_kh",
      key: "ngay_kh",
      align: "center",
      width: '2%',
      render: (value, item, index) => item.group_plan_order ? dayjs(item.group_plan_order.plan?.thoi_gian_bat_dau).format('DD-MM-YYYY') : '',
    },
    {
      title: "Tác vụ",
      dataIndex: "action",
      key: "action",
      checked: true,
      align: "center",
      fixed: "right",
      width: "2%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span className="d-flex justify-content-evenly flex-wrap">
            <Button
              onClick={() => onUpdate(record)}
              size="small"
              type="primary"
              style={{ margin: 2, }}
            >
              Lưu
            </Button>
            <Popconfirm title="Bạn có chắc chắn muốn hủy?" onConfirm={cancel}>
              <Button size="small" type="primary" danger style={{ margin: 2, }}>Hủy</Button>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <LinkOutlined
              style={{ color: "#1677ff", fontSize: 18 }}
              onClick={() => showModal(record)}
            />
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

  const mergedColumns = colDetailTable.map((col) => {
    if (!editableColumns.includes(col.dataIndex)) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "cao" ||
            col.dataIndex === "dai" ||
            col.dataIndex === "price" ||
            col.dataIndex === "rong"
            ? "number"
            : col.dataIndex === "ngay_dat_hang" ||
              col.dataIndex === "han_giao" ||
              col.dataIndex === "han_giao_sx"
              ? "dateTime"
              : col.dataIndex === "buyer_id" ||
                col.dataIndex === "layout_id" ||
                col.dataIndex === "layout_type" ||
                col.dataIndex === "phan_loai_1" ||
                col.dataIndex === "phan_loai_2" ||
                col.dataIndex === "quy_cach_drc"
                ? "select"
                : "text",
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
    switch (dataIndex) {
      case "buyer_id":
        var phan_loai_1 = PL1s.find(
          (e) => e.value?.toLowerCase() === record?.phan_loai_1?.toLowerCase()
        )?.label;
        filteredOptions = buyers.filter(
          (e) =>
            e.value?.endsWith(phan_loai_1?.toUpperCase()) &&
            e.value?.startsWith(record?.customer_id)
        );
        break;
      case "layout_type":
        filteredOptions = layoutTypes;
        break;
      case "layout_id":
        filteredOptions = layouts;
        break;
      case "phan_loai_1":
        filteredOptions = PL1s;
        break;
      case "phan_loai_2":
        filteredOptions = PL2s.filter(e => e?.phan_loai_1 === record?.phan_loai_1);
        const khuon = null;
        let formData = { ...record };
        if (record?.buyer_id && record?.phan_loai_1 && record?.dai && record?.rong) {
          const khuon = listKhuonLink.find(e => e.buyer_id == record.buyer_id && e.phan_loai == record.phan_loai && e.dai == record.dai && e.rong == record.rong && e?.cao == record?.cao);
          if (khuon) {
            filteredOptions = PL2s.filter(e => e?.phan_loai_1 === record?.phan_loai_1 && e.value.includes('be'));
            formData = { ...formData, khuon_id: khuon?.khuon_id, phan_loai_2: filteredOptions[0]?.value }
          }
        }
        form.setFieldsValue(formData);
        break;
      case 'quy_cach_drc':
        var options = record?.customer_specifications ?? [];
        filteredOptions = options
          .filter(
            (e) =>
              record?.phan_loai_1 === e?.phan_loai_1 &&
              record?.customer_id === e?.customer_id
          )
          .map((e) => ({
            value: e.drc_id,
            label: e.drc_id + (e.drc?.description ? " (" + e.drc?.description + ")" : ""),
          }));
        // if (filteredOptions.length <= 0) {
        //   filteredOptions = listDRC;
        // }
        break;
      default:
        break;
    }
    return filteredOptions;
  };
  const handleVisibleChange = (checkedValues) => {
    if (mergedColumns) {
      const uncheckedColumns = mergedColumns
        .filter(
          (col) => !checkedValues.includes(col.key) && col.key !== "action"
        )
        .map((val) => val.key);
      setHideData(uncheckedColumns);
    }
  };

  const content = (
    <Checkbox.Group
      style={{ width: "100%" }}
      defaultValue={mergedColumns
        .filter((col) => col.key !== "action")
        .map((col) => col.key)}
      onChange={handleVisibleChange}
    >
      <Row gutter={[4, 4]} style={{ width: "100%" }}>
        {mergedColumns
          .filter((col) => col.key !== "action")
          .map((col) => (
            <Col span={4} key={col.key}>
              <Checkbox value={col.dataIndex}>{col.title}</Checkbox>
            </Col>
          ))}
      </Row>
    </Checkbox.Group>
  );

  const showModal = (record) => {
    setSplitKey(record.id);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    await splitOrders({ id: splitKey, inputData: inputData });
    setInputData([
      {
        so_luong: 0,
        ngay_giao: "",
        xuong_giao: "",
      },
    ]);
  };

  const handleOkMdl = async () => {
    rowUpdate.listParams = listParams;
    const res = await updateOrder(rowUpdate);
    if (res) {
      form.resetFields();
      loadListTable(params);
      setEditingKey("");
      if (listCheck.length > 0) {
        setListCheck([]);
      }
      if (listParams.length > 0) {
        setListParams([]);
      }
    }
    setIsOpenMdl(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setInputData([
      {
        so_luong: 0,
        ngay_giao: "",
        dot: 1,
        xuong_giao: "",
      },
    ]);
  };

  const handleCancelMdl = () => {
    setIsOpenMdl(false);
  };

  useEffect(() => {
    getBuyerList();
    getLayouts();
    getDRCs();
    getKhuonLink();
  }, []);

  const rowSelection = {
    selectedRowKeys: listCheck,
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys);
    },
  };

  const getBuyerList = async () => {
    const item = data.find((value) => value.key === editingKey);
    const res = await getBuyers();
    setBuyers(res.map((val) => ({ label: val.id, value: val.id })));
  };

  const getLayouts = async () => {
    const res = await getListLayout();
    const check_arr = [];
    const result = [];
    res.map((val) => {
      if (!check_arr.includes(val.layout_id)) {
        check_arr.push(val.layout_id);
        result.push({ label: val.layout_id, value: val.layout_id });
      }
    })
    setLayouts(result);
  };

  const getDRCs = async () => {
    const res = await getListDRC();
    setListDRC(
      res.map((val) => ({
        label: val.id + " (" + val.description + ")",
        value: val.id,
      }))
    );
  };

  const getKhuonLink = async () => {
    const res = await getKhuon();
    setListKhuonLink(res);
  }
  const onSelect = (value, dataIndex) => {
    const items = data.map((val) => {
      if (val.key === editingKey) {
        val[dataIndex] = value;
      }
      return { ...val };
    });
    console.log(items);
    setData(items);
  };

  const onChange = (value, dataIndex) => {
    const items = data.map((val) => {
      if (val.key === editingKey) {
        val[dataIndex] = value;
      }
      return { ...val };
    });
    console.log(items);
    setData(items);
  };

  function btn_click() {
    loadListTable(params);
  }

  const onAdd = () => {
    form.resetFields();
    setData([
      {
        key: data.length + 1,
        khach_hang: "",
        nguoi_dat_hang: "",
        mdh: "",
        order: "",
        sl: "",
        slg: "",
        slt: "",
        tmo: "",
        po: "",
        style: "",
        style_no: "",
        color: "",
        item: "",
        rm: "",
        size: "",
        note_1: "",
        note_2: "",
      },
      ...data,
    ]);
    setEditingKey(data.length + 1);
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

  const loadListTable = async (params) => {
    setLoading(true);
    const res = await getOrders(params);
    console.log(res);
    setTotalPage(res.totalPage);
    setData(
      res.data.map((e) => {
        return { ...e, key: e.id };
      })
    );
    if (res?.editableColumns) {
      setEditableColumns(res.editableColumns);
      setOptionChecks(optionChecks.filter(option => res.editableColumns.includes(option.value)));
    } else {
      setEditableColumns(defaulEditableColumns);
    }
    setTotalPage(res.totalPage);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      loadListTable(params);
    })();
  }, [params.page, params.pageSize]);

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

    if (item) {
      row.ngay_dat_hang = formatDateTime(
        item?.ngay_dat_hang,
        COMMON_DATE_TABLE_FORMAT_REQUEST
      );
      row.han_giao = formatDateTime(
        item?.han_giao,
        COMMON_DATE_TABLE_FORMAT_REQUEST
      );
      row.han_giao_sx = formatDateTime(
        item?.han_giao_sx,
        COMMON_DATE_TABLE_FORMAT_REQUEST
      );
    }

    if (typeof editingKey === "number") {
      const res = await createOrder(row);
      if (res) {
        form.resetFields();
        loadListTable(params);
        setEditingKey("");
      }
    } else {
      row.id = editingKey;
      if (listCheck.length > 0) {
        row.ids = listCheck;
        setRowUpdate(row);
        setListParams([]);
        setIsOpenMdl(true);
      } else {
        const res = await updateOrder(row);
        if (res) {
          form.resetFields();
          loadListTable(params);
          setEditingKey("");
          if (listCheck.length > 0) {
            setListCheck([]);
          }
        }
      }
    }
  };

  const onDetele = async (record) => {
    await deleteOrders({ ids: listCheck });
    loadListTable(params);
    message.success('Xoá thành công');
  };

  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportOrders(params);
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };

  const renderInputData = (item, index) => {
    return (
      <Row
        key={index}
        style={{ flexDirection: "row", marginBottom: 8 }}
        gutter={[8, 8]}
      >
        <Col span={6}>
          <div>
            <p3 style={{ display: "block" }}>Số lượng</p3>
            <InputNumber
              min={1}
              placeholder="Nhập số lượng"
              onChange={(value) => onChangeQuantity(value, index)}
              style={{ width: "100%" }}
            />
          </div>
        </Col>
        <Col span={6}>
          <div>
            <p3 style={{ display: "block" }}>Ngày giao</p3>
            <DatePicker
              format={COMMON_DATE_TABLE_FORMAT_REQUEST}
              value={item.ngay_giao}
              onChange={(value) =>
                value.isValid() && onChangeDate(value, index)
              }
              style={{ width: "100%" }}
            />
          </div>
        </Col>
        <Col span={3}>
          <div>
            <p3 style={{ display: "block" }}>Đợt</p3>
            <Input
              placeholder="Nhập đợt"
              onChange={(e) => onChangeDot(e.target.value, index)}
              style={{ width: "100%" }}
            />
          </div>
        </Col>
        <Col span={9}>
          <div>
            <p3 style={{ display: "block" }}>Nơi giao</p3>
            <Input
              placeholder="Nhập xưởng giao"
              onChange={(e) => onChangeAddress(e.target.value, index)}
              style={{ width: "100%" }}
            />
          </div>
        </Col>
      </Row>
    );
  };

  const onChangeDate = (value, index) => {
    const items = inputData.map((val, i) => {
      if (i === index) {
        val.ngay_giao = value;
      }
      return { ...val };
    });
    setInputData(items);
  };

  const onChangeQuantity = (value, index) => {
    const items = inputData.map((val, i) => {
      if (i === index) {
        val.so_luong = value;
      }
      return { ...val };
    });
    setInputData(items);
  };

  const onChangeAddress = (value, index) => {
    const items = inputData.map((val, i) => {
      if (i === index) {
        val.xuong_giao = value;
      }
      return { ...val };
    });
    setInputData(items);
  };

  const onChangeDot = (value, index) => {
    const items = inputData.map((val, i) => {
      if (i === index) {
        val.dot = value;
      }
      return { ...val };
    });
    setInputData(items);
  };
  const { userProfile } = useProfile();
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
      <div style={{ padding: "8px", marginRight: 0, height: 'calc(100vh - 60px)', display: 'flex', gap: 4 }}>
        <div className={isSidebar ? 'ant-col ant-col-4' : 'ant-col-0'}>
          <div className="slide-bar">
            <Card
              style={{ height: "100%" }}
              bodyStyle={{ padding: 0 }}
              className="custom-card scroll"
              actions={[
                <div layout="vertical">
                  <Button
                    type="primary"
                    style={{ width: "80%" }}
                    onClick={btn_click}
                  >
                    Truy vấn
                  </Button>
                </div>,
              ]}
            >
              <Divider>Tìm kiếm</Divider>
              <div className="mb-3" >
                <Form
                  style={{ margin: "0 15px" }}
                  layout="vertical"
                  onFinish={btn_click}
                >
                  <Form.Item label="Ngày đặt hàng" className="mb-3">
                    <DatePicker
                      allowClear={false}
                      placeholder="Ngày đặt hàng"
                      style={{ width: "100%" }}
                      onChange={(value) => {
                        setParams({ ...params, ngay_dat_hang: value, page: 1, })
                        setPage(1);
                      }
                      }
                      value={params.ngay_dat_hang}
                    />
                  </Form.Item>
                  <Form.Item label="Mã khách hàng" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          customer_id: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập mã khách hàng"
                    />
                  </Form.Item>
                  <Form.Item label="Tên khách hàng viết tắt" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          short_name: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập mã khách hàng"
                    />
                  </Form.Item>
                  <Form.Item label="MDH" className="mb-3">
                    <Select
                      mode="tags"
                      style={{ width: "100%" }}
                      placeholder="Nhập mã đơn hàng"
                      onChange={(value) => {
                        setParams({
                          ...params,
                          mdh: value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      suffixIcon={null}
                      open={false}
                      tokenSeparators={[',']}
                      options={[]}
                    />
                  </Form.Item>
                  <Form.Item label="MQL" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          mql: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập MQL"
                    />
                  </Form.Item>
                  <Form.Item label="L" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          length: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập L"
                    />
                  </Form.Item>
                  <Form.Item label="W" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          width: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập W"
                    />
                  </Form.Item>
                  <Form.Item label="H" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          height: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập H"
                    />
                  </Form.Item>
                  <Form.Item label="Kích thước" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          kich_thuoc: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập kích thước"
                    />
                  </Form.Item>
                  <Form.Item label="Order" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          order: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập order"
                    />
                  </Form.Item>
                  <Form.Item label="PO" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, po: e.target.value, page: 1 });
                        setPage(1);
                      }}
                      placeholder="Nhập PO"
                    />
                  </Form.Item>
                  <Form.Item label="STYLE" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          style: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập STYLE"
                    />
                  </Form.Item>
                  <Form.Item label="STYLE NO" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          style_no: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập STYLE NO"
                    />
                  </Form.Item>
                  <Form.Item label="COLOR" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          color: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập COLOR"
                    />
                  </Form.Item>
                  <Form.Item label="ITEM" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          item: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập ITEM"
                    />
                  </Form.Item>
                  <Form.Item label="RM" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, rm: e.target.value, page: 1 });
                        setPage(1);
                      }}
                      placeholder="Nhập RM"
                    />
                  </Form.Item>
                  <Form.Item label="SIZE" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          size: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập SIZE"
                    />
                  </Form.Item>
                  <Form.Item label="Ngày giao hàng trên đơn" className="mb-3">
                    <DatePicker
                      allowClear={false}
                      placeholder="Ngày giao hàng trên đơn"
                      style={{ width: "100%" }}
                      onChange={(value) => {
                        setParams({ ...params, han_giao: value, page: 1, })
                        setPage(1);
                      }
                      }
                      value={params.han_giao}
                    />
                  </Form.Item>
                  <Form.Item label="Ngày giao hàng sản xuất" className="mb-3">
                    <DatePicker
                      allowClear={false}
                      placeholder="Ngày giao hàng sản xuất"
                      style={{ width: "100%" }}
                      onChange={(value) => {
                        setParams({ ...params, han_giao_sx: value, page: 1, })
                        setPage(1);
                      }
                      }
                      value={params.han_giao_sx}
                    />
                  </Form.Item>
                  <Form.Item label="Ngày thực hiện kế hoạch" className="mb-3">
                    <DatePicker
                      allowClear={false}
                      placeholder="Ngày thực hiện kế hoạch"
                      style={{ width: "100%" }}
                      onChange={(value) => {
                        setParams({ ...params, ngay_kh: value, page: 1, })
                        setPage(1);
                      }
                      }
                      value={params.ngay_kh}
                    />
                  </Form.Item>
                  <Form.Item label="Đợt" className="mb-3">
                    <Input
                      allowClear={false}
                      placeholder="Đợt"
                      style={{ width: "100%" }}
                      onChange={(value) => {
                        setParams({ ...params, dot: value.target.value, page: 1, });
                        setPage(1);
                      }
                      }
                      value={params.dot}
                    />
                  </Form.Item>
                  <Form.Item label="Ghi chú TBDX" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({
                          ...params,
                          note_2: e.target.value,
                          page: 1,
                        });
                        setPage(1);
                      }}
                      placeholder="Nhập ghi chú TBDX"
                    />
                  </Form.Item>
                  <Button hidden htmlType="submit"></Button>
                </Form>
              </div>
            </Card>
          </div>
        </div>
        <div className='w-100 overflow-auto px-1'>
          <Card
            style={{ display: 'block', height: "100%", overflow: 'hidden' }}
            title={<><Button type="text" onClick={() => setIsSidebar(!isSidebar)} size="small" icon={isSidebar ? <LeftOutlined /> : <RightOutlined />}></Button><span style={{ fontSize: '16px', marginLeft: '6px' }}>Quản lý đơn hàng</span></>}
            className="custom-card"
            extra={
              <Space>
                <Popover content={content} title="Ẩn/Hiện cột" trigger="click">
                  <Button>Ẩn/Hiện cột</Button>
                </Popover>
                <Upload
                  showUploadList={false}
                  name="files"
                  action={baseURL + "/api/orders/import-from-plan"}
                  headers={{
                    authorization: "authorization-text",
                  }}
                  onChange={(info) => {
                    setLoadingExport1(true);
                    if (info.file.status === "error") {
                      setLoadingExport1(false);
                      error();
                    } else if (info.file.status === "done") {
                      if (info.file.response.success === true) {
                        loadListTable(params);
                        success();
                        setLoadingExport1(false);
                      } else {
                        loadListTable(params);
                        message.error(info.file.response.message);
                        setLoadingExport1(false);
                      }
                    }
                  }}
                >
                </Upload>
                <Upload
                  showUploadList={false}
                  name="files"
                  action={baseURL + "/api/orders/import"}
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
                        loadListTable(params);
                        success();
                        setLoadingExport(false);
                      } else {
                        loadListTable(params);
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
                <Button type="primary" onClick={onAdd}>
                  Thêm đơn hàng
                </Button>
                <Button type="primary" onClick={() => exportFile()} loading={exportLoading} className="w-100">Tải file excel</Button>
              </Space>
            }
          >
            <Form form={form} component={false}>
              <Table
                loading={loading}
                rowSelection={rowSelection}
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
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                rowClassName="editable-row"
                scroll={{
                  x: "380vw",
                  y: tableHeight,
                }}
                columns={mergedColumns.filter(
                  (column) => !hideData.includes(column.key)
                )}
                dataSource={data}
              />
            </Form>
          </Card>
        </div>
      </div>
      <Modal
        title="Tách đơn hàng"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        width={700}
      >
        <Button type="primary" onClick={showInput} style={{ marginBottom: 12 }}>
          Thêm dòng
        </Button>
        {inputData.map(renderInputData)}
      </Modal>
      <Modal
        title="Chọn thông tin cần coppy"
        open={isOpenMdl}
        onOk={handleOkMdl}
        onCancel={handleCancelMdl}
        okText="Lưu"
        width={400}
      >
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          Chọn tất cả
        </Checkbox>
        <Checkbox.Group
          style={{
            width: '100%',
          }}
          value={listParams}
          onChange={(values) => setListParams(values)}
        >
          <Row>
            {
              optionChecks.map((option, index) =>
              (
                <Col span={24} key={index}>
                  <Checkbox value={option.value} >{option.label}</Checkbox>
                </Col>
              )
              )
            }
          </Row>
        </Checkbox.Group>
      </Modal>
    </>
  );
};

export default Orders;
