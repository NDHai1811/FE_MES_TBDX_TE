import {
  DatePicker,
  Col,
  Row,
  Card,
  Table,
  Divider,
  Button,
  Form,
  Select,
  Spin,
  Space,
  Modal,
  Checkbox,
  Tree,
} from "antd";
import React, { useEffect, useState } from "react";
import { getThongSoMay, getUIItemMenu } from "../../../api/ui/main";
import { baseURL } from "../../../config";
import { exportThongSoMay } from "../../../api/ui/export";
import dayjs from "dayjs";
import { getMachineParamLogs } from "../../../api/ui/machine";
import "../style.scss";

const dataChart = Array.from({ length: 12 }, (_, i) => ({
  time: `10:${String(i * 5).padStart(2, "0")}`,
  value: Math.floor(Math.random() * 400),
}));

const cards = [
  {
    name: "Độ nhớt hồ",
    checked: false,
  },
  {
    name: "Nhiệt độ",
    checked: false,
  },
  {
    name: "Lực ép lô láng C",
    checked: false,
  },
  {
    name: "Khe hở lô hồ",
    checked: false,
  },
  {
    name: "Thông số",
    checked: false,
  },
  {
    name: "Thông số",
    checked: false,
  },
  {
    name: "Thông số",
    checked: false,
  },
  {
    name: "Thông số",
    checked: false,
  },
  {
    name: "Thông số",
    checked: false,
  },
  {
    name: "Thông số",
    checked: false,
  },
];

const col_detailTable = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    render: (value, record, index) => index + 1,
    align: "center",
    fixed: "left",
  },
  {
    title: "Ngày sản xuất",
    dataIndex: "ngay_sx",
    key: "ngay_sx",
    align: "center",
    fixed: "left",
  },
  {
    title: "Lô sản xuất",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
    fixed: "left",
  },
  {
    title: "Lot sản xuất",
    dataIndex: "lot_id",
    key: "lot_id",
    align: "center",
    fixed: "left",
    render: (value, record, index) =>
      record.lo_sx + "00" + Math.floor(Math.random() * 10),
  },
  {
    title: "Mã máy",
    dataIndex: "machine_id",
    key: "machine_id",
    fixed: "left",
    align: "center",
  },
  {
    title: "Sóng",
    dataIndex: "S01",
    key: "S01",
    align: "center",
    children: [
      {
        title: "Số m đã chạy lô cuốn 1",
        dataIndex: "Roll1_Counter",
        key: "Roll1_Counter",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Số m đã chạy lô cuốn 2",
        dataIndex: "Roll2_Counter",
        key: "Roll2_Counter",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Số m đã chạy lô cuốn 3",
        dataIndex: "Roll3_Counter",
        key: "Roll3_Counter",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Số m đã chạy lô cuốn 4",
        dataIndex: "Roll4_Counter",
        key: "Roll4_Counter",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Số m đã chạy lô cuốn 5",
        dataIndex: "Roll5_Counter",
        key: "Roll5_Counter",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Số m đã chạy lô cuốn 6",
        dataIndex: "Roll6_Counter",
        key: "Roll6_Counter",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Số m đã chạy lô cuốn 7",
        dataIndex: "Roll7_Counter",
        key: "Roll7_Counter",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Cảnh báo hết nguyên liệu lô cuốn 1",
        dataIndex: "Roll1_Alarm",
        key: "Roll1_Alarm",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Cảnh báo hết nguyên liệu lô cuốn 2",
        dataIndex: "Roll2_Alarm",
        key: "Roll2_Alarm",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Cảnh báo hết nguyên liệu lô cuốn 3",
        dataIndex: "Roll3_Alarm",
        key: "Roll3_Alarm",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Cảnh báo hết nguyên liệu lô cuốn 4",
        dataIndex: "Roll4_Alarm",
        key: "Roll4_Alarm",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Cảnh báo hết nguyên liệu lô cuốn 5",
        dataIndex: "Roll5_Alarm",
        key: "Roll5_Alarm",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Cảnh báo hết nguyên liệu lô cuốn 6",
        dataIndex: "Roll6_Alarm",
        key: "Roll6_Alarm",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Cảnh báo hết nguyên liệu lô cuốn 7",
        dataIndex: "Roll7_Alarm",
        key: "Roll7_Alarm",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Tốc độ lô cuốn 1",
        dataIndex: "Roll1_Speed",
        key: "Roll1_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Tốc độ lô cuốn 2",
        dataIndex: "Roll2_Speed",
        key: "Roll2_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Tốc độ lô cuốn 3",
        dataIndex: "Roll3_Speed",
        key: "Roll3_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Tốc độ lô cuốn 4",
        dataIndex: "Roll4_Speed",
        key: "Roll4_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Tốc độ lô cuốn 5",
        dataIndex: "Roll5_Speed",
        key: "Roll5_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Tốc độ lô cuốn 6",
        dataIndex: "Roll6_Speed",
        key: "Roll6_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Tốc độ lô cuốn 7",
        dataIndex: "Roll7_Speed",
        key: "Roll7_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Khe hở lô hồ",
        dataIndex: "Roll7_Speed",
        key: "Roll7_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Độ nhớt hồ đầu C",
        dataIndex: "do_nhot_ho_c",
        key: "Roll7_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Độ nhớt hồ đầu B",
        dataIndex: "do_nhot_ho_b",
        key: "Roll7_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Độ nhớt hồ đầu E",
        dataIndex: "do_nhot_ho_e",
        key: "Roll7_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Độ nhớt hồ đầu F",
        dataIndex: "do_nhot_ho_f",
        key: "Roll7_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
    ],
  },
  {
    title: "In",
    dataIndex: "IN",
    key: "IN",
    align: "center",
    children: [
      {
        title: "Tốc độ máy",
        dataIndex: "Machine_Speed",
        key: "Machine_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Góc chỉnh film",
        dataIndex: "Film_Angle",
        key: "Film_Angle",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Độ nhớt mực lô 1",
        dataIndex: "do_nhot_muc_lo_1",
        key: "do_nhot_muc_lo_1",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Độ nhớt mực lô 2",
        dataIndex: "do_nhot_muc_lo_2",
        key: "do_nhot_muc_lo_2",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Độ nhớt mực lô 3",
        dataIndex: "do_nhot_muc_lo_3",
        key: "do_nhot_muc_lo_3",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Độ nhớt mực lô 4",
        dataIndex: "do_nhot_muc_lo_4",
        key: "do_nhot_muc_lo_4",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Độ nhớt mực lô 5",
        dataIndex: "do_nhot_muc_lo_5",
        key: "do_nhot_muc_lo_5",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô film 1",
        dataIndex: "ap_luc_ep_lo_film_1",
        key: "ap_luc_ep_lo_film_1",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô film 2",
        dataIndex: "ap_luc_ep_lo_film_2",
        key: "ap_luc_ep_lo_film_2",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô film 3",
        dataIndex: "ap_luc_ep_lo_film_3",
        key: "ap_luc_ep_lo_film_3",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô film 4",
        dataIndex: "ap_luc_ep_lo_film_4",
        key: "ap_luc_ep_lo_film_4",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô film 5",
        dataIndex: "ap_luc_ep_lo_film_5",
        key: "ap_luc_ep_lo_film_5",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô mực 1",
        dataIndex: "ap_luc_ep_lo_muc_1",
        key: "ap_luc_ep_lo_muc_1",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô mực 2",
        dataIndex: "ap_luc_ep_lo_muc_2",
        key: "ap_luc_ep_lo_muc_2",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô mực 3",
        dataIndex: "ap_luc_ep_lo_muc_3",
        key: "ap_luc_ep_lo_muc_3",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô mực 4",
        dataIndex: "ap_luc_ep_lo_muc_4",
        key: "ap_luc_ep_lo_muc_4",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
      {
        title: "Áp lực ép lô mực 5",
        dataIndex: "ap_luc_ep_lo_muc_5",
        key: "ap_luc_ep_lo_muc_5",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
    ],
  },
  {
    title: "Dán",
    dataIndex: "Dan",
    key: "Dan",
    align: "center",
    children: [
      {
        title: "Tốc độ máy",
        dataIndex: "Machine_Speed",
        key: "Machine_Speed",
        align: "center",
        render: (value) => Math.floor(Math.random() * 100),
      },
    ],
  },
];
Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};
const dataTable = Array.from({ length: 32 }, (_, i) => {
  return {
    machine_id: ["S01", "P15", "P06", "D05", "D06"].random(),
    khach_hang: "VICTORY",
    don_hang: "A21" + Math.floor(Math.random() * 30),
    lo_sx: [
      "231209043",
      "231209044",
      "231209001",
      "231209002",
      "231209003",
    ].random(),
    ngay_sx: dayjs(
      new Date(+new Date() - Math.floor(Math.random() * 10000000000))
    ).format("DD/MM/YYYY HH:mm:ss"),
  };
});

const Equipment2 = (props) => {
  document.title = "UI - Thông số máy";
  const [listMachines, setListMachines] = useState([]);
  const [listStaffs, setListStaffs] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState();

  const [data, setData] = useState([]);
  const [params, setParams] = useState({
    machine_code: "",
    ca_sx: "",
    date: [dayjs(), dayjs()],
  });
  async function btn_click() {
    setLoSX();
    setLoading(false);
    const res = await getMachineParamLogs(params);
    if (res.success) {
      setData(res.data);
      // setData(
      //   res.data.map((e) => {
      //     let dataIf = e.data_if;
      //     Object.keys(dataIf ?? {}).forEach(function (key, index) {
      //       dataIf[key] = { is_if: true, value: dataIf[key] };
      //     });
      //     let dataInput = e.data_input;
      //     Object.keys(dataInput ?? {}).forEach(function (key, index) {
      //       dataInput[key] = { is_if: false, value: dataInput[key] };
      //     });
      //     return { ...e, ...dataIf, ...dataInput };
      //   })
      // );
    }
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      const res1 = await getUIItemMenu();
      setItemMenu(res1.data);
    })();
    btn_click();
  }, []);
  const [loading, setLoading] = useState(false);

  const [exportLoading, setExportLoading] = useState(false);
  const exportFile = async () => {
    setExportLoading(true);
    const res = await exportThongSoMay({ ...params, lo_sx: loSX });
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading(false);
  };
  const [openDetail, setOpenDetail] = useState(false);
  const detailColumns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (value, record, index) => index + 1,
      align: "center",
    },
    {
      title: "Lô sx",
      dataIndex: "lo_sx",
      key: "lo_sx",
      align: "center",
    },
    {
      title: "Mã thùng/pallet",
      dataIndex: "lot_id",
      key: "lot_id",
      align: "center",
    },

    {
      title: "Mã máy",
      dataIndex: "machine_code",
      key: "machine_code",
      align: "center",
    },
    {
      title: "In",
      align: "center",
      children: [
        {
          title: "Tốc độ",
          dataIndex: "speed",
          key: "speed",
          align: "center",
          render: (value, record) => {
            return {
              props: {
                style: { backgroundColor: value?.is_if ? "#ebebeb" : "" },
              },
              children: value?.value ? Math.round(value?.value) : "-",
            };
          },
        },
        {
          title: "Độ ph",
          dataIndex: "ph",
          key: "ph",
          align: "center",
          render: (value, record) => {
            return {
              props: {
                style: { backgroundColor: value?.is_if ? "#ebebeb" : "" },
              },
              children: value?.value ? value?.value : "-",
            };
          },
        },
        {
          title: "Nhiệt độ nước",
          dataIndex: "w_temp",
          key: "w_temp",
          align: "center",
          render: (value, record) => {
            return {
              props: {
                style: { backgroundColor: value?.is_if ? "#ebebeb" : "" },
              },
              children: value?.value ? value?.value : "-",
            };
          },
        },
        {
          title: "Nhiệt độ môi trường",
          dataIndex: "t_ev",
          key: "t_ev",
          align: "center",
          render: (value, record) => {
            return {
              props: {
                style: { backgroundColor: value?.is_if ? "#ebebeb" : "" },
              },
              children: value?.value ? value?.value : "-",
            };
          },
        },
        {
          title: "Độ ẩm môi trường",
          dataIndex: "e_hum",
          key: "e_hum",
          align: "center",
          render: (value, record) => {
            return {
              props: {
                style: { backgroundColor: value?.is_if ? "#ebebeb" : "" },
              },
              children: value?.value ? value?.value : "-",
            };
          },
        },
      ],
    },
    {
      title: "Phủ",
      align: "center",
      children: [
        {
          title: "Công suất đèn UV1",
          dataIndex: "uv1",
          key: "uv1",
          align: "center",
          render: (value, record) => {
            return {
              props: {
                style: { backgroundColor: value?.is_if ? "#ebebeb" : "" },
              },
              children: value?.value ? value?.value : "-",
            };
          },
        },
        {
          title: "Công suất đèn UV2",
          dataIndex: "uv2",
          key: "uv2",
          align: "center",
          render: (value, record) => {
            return {
              props: {
                style: { backgroundColor: value?.is_if ? "#ebebeb" : "" },
              },
              children: value?.value ? value?.value : "-",
            };
          },
        },
        {
          title: "Công suất đèn UV3",
          dataIndex: "uv3",
          key: "uv3",
          align: "center",
          render: (value, record) => {
            return {
              props: {
                style: { backgroundColor: value?.is_if ? "#ebebeb" : "" },
              },
              children: value?.value ? value?.value : "-",
            };
          },
        },
      ],
    },
    {
      title: "Bế",
      align: "center",
      children: [
        {
          title: "Áp lực bế",
          dataIndex: "p_be",
          key: "p_be",
          align: "center",
          render: (value, record) => {
            return {
              props: {
                style: { backgroundColor: value?.is_if ? "#ebebeb" : "" },
              },
              children: value?.value ? value?.value : "-",
            };
          },
        },
      ],
    },
    {
      title: "Gấp dán",
      align: "center",
      children: [
        {
          title: "Áp lực băng tải 1",
          dataIndex: "p_conv1",
          key: "p_conv1",
          align: "center",
          render: (value, record) => {
            return {
              props: {
                style: { backgroundColor: value?.is_if ? "#ebebeb" : "" },
              },
              children: value?.value ? value?.value : "-",
            };
          },
        },
        {
          title: "Áp lực băng tải 2",
          dataIndex: "p_conv2",
          key: "p_conv2",
          align: "center",
          render: (value, record) => {
            return {
              props: {
                style: { backgroundColor: value?.is_if ? "#ebebeb" : "" },
              },
              children: value?.value ? value?.value : "-",
            };
          },
        },
        {
          title: "Áp lực súng bắn keo",
          dataIndex: "p_gun",
          key: "p_gun",
          align: "center",
          render: (value, record) => {
            return {
              props: {
                style: { backgroundColor: value?.is_if ? "#ebebeb" : "" },
              },
              children: value?.value ? value?.value : "-",
            };
          },
        },
        {
          title: "Nhiệt độ thùng keo",
          dataIndex: "t_gun",
          key: "t_gun",
          align: "center",
          render: (value, record) => {
            return {
              props: {
                style: { backgroundColor: value?.is_if ? "#ebebeb" : "" },
              },
              children: value?.value ? value?.value : "-",
            };
          },
        },
      ],
    },
  ];
  const [loSX, setLoSX] = useState();
  const onClickRow = async (record) => {
    setLoSX(record.lo_sx);
  };
  const [itemsMenu, setItemMenu] = useState([]);
  const onCheck = (selectedKeys, e) => {
    const filteredKeys = selectedKeys.filter(
      (key) => !itemsMenu.some((e) => e.key === key)
    );
    setParams({ ...params, machine: filteredKeys });
  };
  return (
    <>
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
                    onClick={btn_click}
                  >
                    Truy vấn
                  </Button>
                </div>
              ]}
            >
              <div className="mb-3">
                <Form style={{ margin: "0 15px" }} layout="vertical">
                  <Divider>Công đoạn</Divider>
                  <Form.Item className="mb-3">
                    <Tree
                      checkable
                      onCheck={onCheck}
                      treeData={itemsMenu}
                    />
                  </Form.Item>
                </Form>
              </div>
              <div className="mb-3">
                <Form style={{ margin: "0 15px" }} layout="vertical">
                  <Form.Item label="Phân loại" className="mb-3">
                    <Select
                      allowClear
                      placeholder="Chọn phân loại"
                      options={listMachines}
                      onChange={(value) =>
                        setParams({ ...params, machine_code: value })
                      }
                    />
                  </Form.Item>
                </Form>
              </div>
              <Divider>Thời gian truy vấn</Divider>
              <div className="mb-3">
                <Form style={{ margin: "0 15px" }} layout="vertical">
                  {/* <RangePicker placeholder={["Bắt đầu", "Kết thúc"]} onChange={(value)=>setParams({...params, date: value})} value={params.date}/> */}
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
                <Form
                  style={{ margin: "0 15px" }}
                  layout="vertical"
                  onValuesChange={(value) => setParams({ ...params, ...value })}
                >
                  <Form.Item label="Máy" className="mb-3" name={"ca_sx"}>
                    <Select
                      showSearch
                      allowClear
                      placeholder="Chọn máy"
                      options={[
                        {
                          label: "Ca 1",
                          value: 1,
                        },
                        {
                          label: "Ca 2",
                          value: 2,
                        },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Thời gian"
                    className="mb-3"
                    name={"date_if"}
                  >
                    <DatePicker
                      placeholder="Chọn thời gian"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item label="Thông số" className="mb-3">
                    <Select
                      showSearch
                      onChange={(value) => {
                        setSelectedStaff(value);
                      }}
                      placeholder="Chọn thông số"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={listStaffs}
                    />
                  </Form.Item>
                  <Form.Item label="Khách hàng" className="mb-3">
                    <Select
                      showSearch
                      onChange={(value) => {
                        setSelectedStaff(value);
                      }}
                      placeholder="Chọn khách hàng"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={listStaffs}
                    />
                  </Form.Item>
                </Form>
              </div>
            </Card>
          </div>
        </Col>

        <Col span={20}>
          <Card
            title="Thông số máy"
            style={{ height: "100%" }}
            className="custom-card scroll"
            extra={
              <>
                <Button
                  type="primary"
                  onClick={exportFile}
                  loading={exportLoading}
                >
                  Xuất excel
                </Button>
                <Button
                  type="primary"
                  onClick={exportFile}
                  loading={exportLoading}
                  style={{ marginLeft: 12 }}
                >
                  Report
                </Button>
              </>
            }
          >
            <Spin spinning={loading}>
              <Table
                size="small"
                bordered
                pagination={false}
                scroll={{
                  x: "500%",
                  y: "50vh",
                }}
                // style={{height:'100%'}}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: (event) => {
                      onClickRow(record);
                    },
                  };
                }}
                columns={col_detailTable}
                dataSource={dataTable}
              />
            </Spin>
          </Card>
        </Col>
        <Modal
          title="Chi tiết thông số máy"
          open={openDetail}
          onCancel={() => setOpenDetail(false)}
        >
          <Table
            size="small"
            bordered
            pagination={false}
            scroll={{
              x: "150vw",
              y: "60vh",
            }}
            // style={{height:'100%'}}
            columns={col_detailTable}
            dataSource={data}
          />
        </Modal>
      </Row>
    </>
  );
};

export default Equipment2;
