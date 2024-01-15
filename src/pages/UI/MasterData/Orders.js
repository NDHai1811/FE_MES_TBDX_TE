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
  Spin,
  Popconfirm,
  Typography,
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
  getOrders,
  splitOrders,
  updateOrder,
} from "../../../api";
import { DeleteOutlined, EditOutlined, LinkOutlined } from "@ant-design/icons";
import "../style.scss";
import { COMMON_DATE_TABLE_FORMAT_REQUEST } from "../../../commons/constants";
import dayjs from "dayjs";
import { formatDateTime } from "../../../commons/utils";
import {
  getBuyers,
  getListDRC,
  getListLayout,
} from "../../../api/ui/manufacture";

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
          bordered
          showSearch
        />
      );
      break;
    default:
      inputNode = <Input />;
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
  },
  {
    label: "Thùng 2 mảnh",
    value: "thung-2-manh",
  },
  {
    label: "Thùng 4 mảnh",
    value: "thung-4-manh",
  },
  {
    label: "Thùng thường",
    value: "thung-thuong",
  },
  {
    label: "Thùng bế",
    value: "thung-be",
  },
  {
    label: "Thùng 1 nắp",
    value: "thung-1-nap",
  },
  {
    label: "Cánh chồm",
    value: "canh-chom",
  },
  {
    label: "Pad U",
    value: "pad-u",
  },
  {
    label: "Pad Z, rãnh",
    value: "pad-z-ranh",
  },
  {
    label: "Giấy tấm không tề",
    value: "giay-tam-khong-te",
  },
  {
    label: "Giấy tấm có tề 1 mảnh (DxR)",
    value: "giay-tam-co-te-1-manh-dxr",
  },
  {
    label: "Giấy tấm có tề 1 mảnh (DxRxC)",
    value: "giay-tam-co-te-1-manh-dxrxc",
  },
  {
    label: "Giấy tấm có tề 2 mảnh (DxRxC)",
    value: "giay-tam-co-te-2-manh-dxrxc",
  },
];
const Orders = () => {
  document.title = "Quản lý đơn hàng";
  const [form] = Form.useForm();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
  });
  const [editingKey, setEditingKey] = useState("");
  const [splitKey, setSplitKey] = useState("");
  const [data, setData] = useState([]);
  const isEditing = (record) => record.key === editingKey;
  const [buyers, setBuyers] = useState([]);
  const [layouts, setLayouts] = useState([]);
  const [listDRC, setListDRC] = useState([]);
  const [listCheck, setListCheck] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [inputData, setInputData] = useState([
    {
      so_luong: 0,
      ngay_giao: "",
      xuong_giao: "",
    },
  ]);

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
      width: "2%",
    },
    {
      title: "MDH",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
      editable: true,
      checked: true,
      fixed: "left",
      width: "1.6%",
    },
    {
      title: "L",
      dataIndex: "length",
      key: "length",
      align: "center",
      editable: true,
      checked: true,
      fixed: "left",
      width: "1.2%",
    },
    {
      title: "W",
      dataIndex: "width",
      key: "width",
      align: "center",
      editable: true,
      checked: true,
      fixed: "left",
      width: "1.2%",
    },
    {
      title: "H",
      dataIndex: "height",
      key: "height",
      align: "center",
      editable: true,
      checked: true,
      fixed: "left",
      width: "1.2%",
    },
    {
      title: "Kích thước ĐH",
      dataIndex: "kich_thuoc",
      key: "kich_thuoc",
      align: "center",
      editable: true,
      fixed: "left",
      checked: true,
    },
    {
      title: "MQL",
      dataIndex: "mql",
      key: "mql",
      align: "center",
      editable: true,
      checked: true,
      width: "1%",
    },
    {
      title: "SL",
      dataIndex: "sl",
      key: "sl",
      align: "center",
      width: "1.2%",
      editable: true,
      checked: true,
    },
    {
      title: "Đơn vị tính",
      dataIndex: "unit",
      key: "unit",
      align: "center",
      width: "1.2%",
      editable: true,
      checked: true,
    },
    {
      title: "Kích thước chuẩn",
      dataIndex: "kich_thuoc_chuan",
      key: "kich_thuoc_chuan",
      align: "center",
      width: "2.5%",
      editable: true,
      checked: true,
    },
    {
      title: "Phân loại 1",
      dataIndex: "phan_loai_1",
      key: "phan_loai_1",
      align: "center",
      width: "2%",
      editable: true,
      checked: true,
      render: (value) => PL1s.find(e => e.value === value)?.label
    },
    {
      title: "Quy cách DRC",
      dataIndex: "quy_cach_drc",
      key: "quy_cach_drc",
      align: "center",
      width: "2%",
      editable: true,
      checked: true,
    },
    {
      title: "Phân loại 2",
      dataIndex: "phan_loai_2",
      key: "phan_loai_2",
      align: "center",
      width: "4%",
      editable: true,
      checked: true,
      render: (value) => PL2s.find(e => e.value === value)?.label
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
      title: "Đợt",
      dataIndex: "dot",
      key: "dot",
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
          <span>
            <Typography.Link
              onClick={() => onUpdate(record)}
              style={{
                marginRight: 8,
              }}
            >
              Lưu
            </Typography.Link>
            <Popconfirm title="Bạn có chắc chắn muốn hủy?" onConfirm={cancel}>
              <a>Hủy</a>
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
    if (!col.editable) {
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
        options: options(col.dataIndex)
      })
    };
  });

  const options = (dataIndex) => {
    var record = data.find(e => e.id === editingKey);
    let filteredOptions = [];
    switch (dataIndex) {
      case 'buyer_id':
        var phan_loai_1 = PL1s.find(e => e.value?.toLowerCase() === record?.phan_loai_1?.toLowerCase())?.label;
        filteredOptions = buyers.filter(e => e.value?.endsWith(phan_loai_1?.toUpperCase()) && e.value?.startsWith(record?.customer_id));
        break;
      case 'layout_type':
        filteredOptions = layoutTypes;
        break;
      case 'layout_id':
        filteredOptions = layouts;
        break;
      case 'phan_loai_1':
        filteredOptions = PL1s;
        break;
      case 'phan_loai_2':
        filteredOptions = PL2s;
        break;
      default:
        var options = record?.customer_specifications ?? [];
        filteredOptions = options.filter(e => record?.phan_loai_1 === e?.phan_loai_1 && record?.customer_id === e?.customer_id).map(e => ({ value: e.drc_id, label: e.drc_id }));
        if (filteredOptions.length <= 0) {
          filteredOptions = listDRC;
        }
        break;
    }
    return filteredOptions;
  }
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
      // options={mergedColumns
      //   .filter((col) => col.key !== "action")
      //   .map((col) => ({
      //     label: col.title,
      //     value: col.key,
      //   }))}
      defaultValue={mergedColumns
        .filter((col) => col.key !== "action")
        .map((col) => col.key)}
      onChange={handleVisibleChange}
    >
      <Row gutter={[4, 4]} style={{ width: '100%' }}>
        {
          mergedColumns
            .filter((col) => col.key !== "action")
            .map((col) => (<Col span={4}><Checkbox value={col.dataIndex}>{col.title}</Checkbox></Col>))
        }
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

  const handleCancel = () => {
    setIsModalVisible(false);
    setInputData([
      {
        so_luong: 0,
        ngay_giao: "",
        xuong_giao: "",
      },
    ]);
  };

  useEffect(() => {
    getBuyerList();
    getLayouts();
    getDRCs();
  }, []);

  useEffect(() => {
    if (editingKey) {
      getBuyerList();
    }
  }, [editingKey]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setListCheck(selectedRowKeys);
    },
  };

  const removeAccents = (str) => {
    if (str) {
      // return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return PL1s.find(e => e.value === str)?.label;
    }
    else {
      return "";
    }
  };

  const getBuyerList = async () => {
    const item = data.find((value) => value.key === editingKey);
    const res = await getBuyers();
    // const filteredBuyers = res.filter(
    //   (val) =>
    //     val.customer_id.startsWith(item?.customer_id) &&
    //     removeAccents(val.phan_loai_1)
    //       .toLowerCase()
    //       .endsWith(removeAccents(item?.phan_loai_1).toLowerCase())
    // );
    setBuyers(res.map((val) => ({ label: val.id, value: val.id })));
  };

  const onSelect = (value, dataIndex) => {
    const items = data.map((val) => {
      if (val.key === editingKey) {
        val[dataIndex] = value;
      }
      return { ...val };
    });
    if (dataIndex === "phan_loai_1") {
      getBuyerList();
    }
    setData(items);
  };

  const getLayouts = async () => {
    const res = await getListLayout();
    setLayouts(
      res.map((val) => ({ label: val.layout_id, value: val.layout_id }))
    );
  };

  const getDRCs = async () => {
    const res = await getListDRC();
    setListDRC(res.map((val) => ({ label: val.id, value: val.id })));
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
    loadListTable(params)
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
    setTotalPage(res.totalPage);
    setData(
      res.data.map((e) => {
        return { ...e, key: e.id };
      })
    );
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
      // !item?.ngay_dat_hang && delete row?.ngay_dat_hang;
      // !item?.han_giao && delete row?.han_giao;
      // !item?.han_giao_sx && delete row?.han_giao_sx;
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
      }
      const res = await updateOrder(row);
      if (res) {
        form.resetFields();
        loadListTable(params);
        setEditingKey("");
        // if (listCheck.length > 0) {
        //   setListCheck([]);
        // }
      }
    }
  };

  const onDetele = async (record) => {
    await deleteOrders({ id: record.id });
    loadListTable(params);
  };

  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingExport1, setLoadingExport1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
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
        <Col span={12}>
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

  return (
    <>
      {contextHolder}
      <Row style={{ padding: "8px", height: "90vh" }} gutter={[8, 8]}>
        <Col span={4}>
          <Card style={{ height: "100%" }} bodyStyle={{ padding: 0 }}>
            <Divider>Tìm kiếm</Divider>
            <div className="mb-3">
              <Form
                style={{ margin: "0 5px" }}
                layout="vertical"
                onFinish={btn_click}
              >
                <div
                  style={{
                    overflow: "auto scroll",
                    maxHeight: "75vh",
                    padding: "0 5px",
                    marginBottom: "10px",
                  }}
                >
                  <Form.Item label="Mã khách hàng" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, customer_id: e.target.value, page: 1 }); setPage(1)
                      }
                      }
                      placeholder="Nhập mã khách hàng"
                    />
                  </Form.Item>
                  <Form.Item label="MDH" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, mdh: e.target.value, page: 1 }); setPage(1)
                      }
                      }
                      placeholder="Nhập MDH"
                    />
                  </Form.Item>
                  <Form.Item label="L" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, length: e.target.value, page: 1 }); setPage(1)
                      }
                      }
                      placeholder="Nhập L"
                    />
                  </Form.Item>
                  <Form.Item label="W" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, width: e.target.value, page: 1 }); setPage(1)
                      }
                      }
                      placeholder="Nhập W"
                    />
                  </Form.Item>
                  <Form.Item label="H" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, height: e.target.value, page: 1 }); setPage(1)
                      }
                      }
                      placeholder="Nhập H"
                    />
                  </Form.Item>
                  <Form.Item label="Kích thước" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, kich_thuoc: e.target.value, page: 1 }); setPage(1)
                      }
                      }
                      placeholder="Nhập kích thước"
                    />
                  </Form.Item>
                  <Form.Item label="Order" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, order: e.target.value, page: 1 }); setPage(1)
                      }
                      }
                      placeholder="Nhập order"
                    />
                  </Form.Item>
                  <Form.Item label="MQL" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, mql: e.target.value, page: 1 }); setPage(1)
                      }
                      }
                      placeholder="Nhập MQL"
                    />
                  </Form.Item>
                  <Form.Item label="PO" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, po: e.target.value, page: 1 }); setPage(1)
                      }
                      }
                      placeholder="Nhập PO"
                    />
                  </Form.Item>
                  <Form.Item label="STYLE" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, style: e.target.value, page: 1 }); setPage(1)
                      }
                      }
                      placeholder="Nhập STYLE"
                    />
                  </Form.Item>
                  <Form.Item label="STYLE NO" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, style_no: e.target.value, page: 1 }); setPage(1)
                      }
                      }
                      placeholder="Nhập STYLE NO"
                    />
                  </Form.Item>
                  <Form.Item label="COLOR" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, color: e.target.value, page: 1 }); setPage(1)
                      }
                      }
                      placeholder="Nhập COLOR"
                    />
                  </Form.Item>
                  <Form.Item label="ITEM" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, item: e.target.value, page: 1 }); setPage(1)
                      }
                      }
                      placeholder="Nhập ITEM"
                    />
                  </Form.Item>
                  <Form.Item label="RM" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, rm: e.target.value, page: 1 }); setPage(1)
                      }
                      }
                      placeholder="Nhập RM"
                    />
                  </Form.Item>
                  <Form.Item label="SIZE" className="mb-3">
                    <Input
                      allowClear
                      onChange={(e) => {
                        setParams({ ...params, size: e.target.value, page: 1 }); setPage(1)
                      }
                      }
                      placeholder="Nhập SIZE"
                    />
                  </Form.Item>
                </div>
                <Form.Item style={{ textAlign: "center" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "80%" }}
                  >
                    Tìm kiếm
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </Col>
        <Col span={20}>
          <Card
            style={{ height: "100%" }}
            title="Quản lý đơn hàng"
            extra={
              <Space>
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
                  <Button
                    style={{ marginLeft: "15px" }}
                    type="primary"
                    loading={loadingExport1}
                  >
                    Upload từ KHSX
                  </Button>
                </Upload>
                <Upload
                  showUploadList={false}
                  name="files"
                  action={baseURL + "/api/orders/import"}
                  headers={{
                    authorization: "authorization-text",
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
              </Space>
            }
          >
            <Popover content={content} title="Ẩn/Hiện cột" trigger="click">
              <Button style={{ marginBottom: "4px" }}>Ẩn/Hiện cột</Button>
            </Popover>
            <Spin spinning={loading}>
              <Form form={form} component={false}>
                <Table
                  rowSelection={rowSelection}
                  size="small"
                  bordered
                  pagination={{
                    current: page,
                    size: 'default',
                    total: totalPage,
                    showSizeChanger: true,
                    onChange: (page, pageSize) => {
                      setPage(page);
                      setPageSize(pageSize);
                      setParams({ ...params, page: page, pageSize: pageSize });
                    }
                  }}
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  rowClassName="editable-row"
                  scroll={{
                    x: "380vw",
                    y: "80vh",
                  }}
                  columns={mergedColumns.filter(
                    (column) => !hideData.includes(column.key)
                  )}
                  dataSource={data}
                />
              </Form>
            </Spin>
          </Card>
        </Col>
      </Row>
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
    </>
  );
};

export default Orders;
