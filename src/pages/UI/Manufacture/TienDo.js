import React, { useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  PlusOutlined,
  FileExcelOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  DatePicker,
  Col,
  Row,
  Card,
  Table,
  Tag,
  Layout,
  Divider,
  Button,
  Form,
  Input,
  theme,
  Select,
  AutoComplete,
} from "antd";
import "../style.scss";

const { Sider } = Layout;
const { RangePicker } = DatePicker;

const columns1 = [
  {
    title: "Tổng thời gian thực hiện kế hoạch",
    dataIndex: "tong_tg_ke_hoach",
    key: "tong_tg_ke_hoach",
    align: "center",
  },
  {
    title: "Tổng thời gian thực hiện thực tế",
    dataIndex: "tong_tg_thuc_te",
    key: "tong_tg_thuc_te",
    align: "center",
  },
  {
    title: "Tổng thời gian vào hàng",
    dataIndex: "tong_tg_vao_hang",
    key: "tong_tg_vao_hang",
    align: "center",
  },
  {
    title: "Tổng thời gian sx sản lượng",
    dataIndex: "tong_tg_sx_san_luong",
    key: "tong_tg_sx_san_luong",
    align: "center",
  },
  {
    title: "Tỉ lệ hoàn thành",
    dataIndex: "ti_le_hoan_thanh",
    key: "ti_le_hoan_thanh",
    align: "center",
  },
  {
    title: "Tổng thời gian máy dừng hết KH",
    dataIndex: "tong_tg_dung_may",
    key: "tong_tg_dung_may",
    align: "center",
  },
];
const dataTable1 = [
  {
    tong_tg_ke_hoach: "1000",
    tong_tg_thuc_te: "1000",
    tong_tg_vao_hang: "1000",
    tong_tg_sx_san_luong: "1000",
    ti_le_hoan_thanh: "1000",
    tong_tg_dung_may: "1000",
  },
];

const columns2 = [
  {
    title: "Lô SX",
    dataIndex: "lo_sx",
    key: "lo_sx",
    align: "center",
  },
  {
    title: "Mã thùng/pallet",
    dataIndex: "id_thung",
    key: "id_thung",
    align: "center",
  },
  {
    title: "Tên SP",
    dataIndex: "ten_sp",
    key: "ten_sp",
    align: "center",
  },
  {
    title: "Mã hàng",
    dataIndex: "ma_hang",
    key: "ma_hang",
    align: "center",
  },
  {
    title: "Công đoạn SX",
    dataIndex: "cong_doan_sx",
    key: "cong_doan_sx",
    align: "center",
  },
  {
    title: "Máy sản xuất",
    dataIndex: "may_sx",
    key: "may_sx",
    align: "center",
  },
  {
    title: "Đơn vị tính",
    dataIndex: "unit",
    key: "unit",
    align: "center",
  },
  {
    title: "Kế hoạch",
    children: [
      {
        title: "Thời gian bắt đầu",
        dataIndex: "tg_bat_dau_kh",
        key: "tg_bat_dau_kh",
        align: "center",
      },
      {
        title: "Thời gian kết thúc",
        dataIndex: "tg_ket_thuc_kh",
        key: "tg_ket_thuc_kh",
        align: "center",
      },
      {
        title: "Tổng thời gian thực hiện",
        dataIndex: "tong_tg_kh",
        key: "tong_tg_kh",
        align: "center",
      },
      {
        title: "Nhân lực",
        dataIndex: "nhan_luc",
        key: "nhan_luc",
        align: "center",
      },
    ],
  },
  {
    title: "Thực tế",
    children: [
      {
        title: "Thời gian bắt đầu",
        dataIndex: "tg_bat_dau_tt",
        key: "tg_bat_dau_tt",
        align: "center",
      },
      {
        title: "Thời gian kết thúc",
        dataIndex: "tg_ket_thuc_tt",
        key: "tg_ket_thuc_tt",
        align: "center",
      },
      {
        title: "Thời gian vào hàng",
        dataIndex: "tg_vao_hang",
        key: "tg_vao_hang",
        align: "center",
      },
      {
        title: "Thời gian chạy sản lượng",
        dataIndex: "tg_chay_sl",
        key: "tg_chay_sl",
        align: "center",
      },
      {
        title: "Tổng thời gian thực hiện",
        dataIndex: "tong_tg_tt",
        key: "tong_tg_tt",
        align: "center",
      },
    ],
  },
  {
    title: "Chênh lệch (TT-KH)",
    dataIndex: "chenh_lech_tt_kh",
    key: "chenh_lech_tt_kh",
    align: "center",
  },
  {
    title: "Thời gian dự kiến hoàn thành",
    dataIndex: "tg_du_kien_ht",
    key: "tg_du_kien_ht",
    align: "center",
  },
  {
    title: "Tỉ lệ hoàn thành",
    dataIndex: "ti_le_hoan_thanh",
    key: "ti_le_hoan_thanh",
    align: "center",
  },
];
const dataTable2 = [];
for (let i = 0; i < 20; i++) {
  let data = {
    lo_sx: "Lô SX1",
    id_thung: "Thùng 1",
    ten_sp: "Sản phẩm 1",
    ma_hang: "SP1",
    cong_doan_sx: "In",
    may_sx: "Máy 1",
    unit: "Phút",
    tg_bat_dau_kh: "1",
    tg_ket_thuc_kh: "1",
    tong_tg_kh: "1",
    nhan_luc: "1",
    tg_bat_dau_tt: "1",
    tg_ket_thuc_tt: "1",
    tg_vao_hang: "1",
    tg_chay_sl: "1",
    tong_tg_tt: "1",
    chenh_lech_tt_kh: "1",
    tg_du_kien_ht: "1",
    ti_le_hoan_thanh: "1",
  };
  dataTable2.push(data);
}

const SanLuong = (props) => {
  return (
    <React.Fragment>
      <Sider
        style={{
          backgroundColor: "white",
          height: "100vh",
          overflow: "auto",
          float: "left",
          paddingTop: "15px",
        }}
      >
        <div className="mb-3">
          <Form style={{ margin: "0 15px" }} layout="vertical">
            <Form.Item label="Công đoạn" className="mb-3">
              <Select
                defaultValue="In"
                options={[
                  { value: "in", label: "In" },
                  { value: "bao-on", label: "Bảo ôn" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Máy" className="mb-3">
              <Select
                defaultValue="Máy 1"
                options={[
                  { value: "1", label: "Máy 1" },
                  { value: "2", label: "Máy 2" },
                ]}
              />
            </Form.Item>
          </Form>
        </div>
        <Divider>Thời gian truy vấn</Divider>
        <div className="mb-3">
          <Form style={{ margin: "0 15px" }} layout="vertical">
            <RangePicker placeholder={["Bắt đầu", "Kết thúc"]} />
          </Form>
        </div>
        <Divider>Điều kiện truy vấn</Divider>
        <div className="mb-3">
          <Form style={{ margin: "0 15px" }} layout="vertical">
            <Form.Item label="Mã hàng" className="mb-3">
              <AutoComplete placeholder="Nhập mã hàng"></AutoComplete>
            </Form.Item>
            <Form.Item label="Tên sản phẩm" className="mb-3">
              <Input placeholder="Nhập tên sản phẩm"></Input>
            </Form.Item>
            <Form.Item label="Lô Sản xuất" className="mb-3">
              <Input placeholder="Nhập lô SX"></Input>
            </Form.Item>
            <Form.Item label="Nhân viên" className="mb-3">
              <Input placeholder="Nhập mã nhân viên"></Input>
            </Form.Item>
          </Form>
        </div>

        <div
          style={{
            padding: "10px",
            textAlign: "center",
          }}
          layout="vertical"
        >
          <Button type="primary" style={{ width: "80%" }}>
            Truy vấn
          </Button>
        </div>
      </Sider>
      <Row style={{ padding: "8px", height: "100vh" }} gutter={[8, 8]}>
        <Col span={24}>
          <Card
            style={{ height: "100%" }}
            title="Báo cáo tiến độ"
            extra={
              <Button style={{ marginLeft: "15px" }} type="primary">
                Xuất Excel
              </Button>
            }
          >
            <Table
              className="mb-3"
              size="small"
              bordered
              pagination={false}
              //   scroll={
              //   {
              //         x: '100%',
              //         y: '20vh'
              //   }
              //   }
              columns={columns1}
              dataSource={dataTable1}
            />
            <Table
              size="small"
              bordered
              pagination={false}
              scroll={{
                x: "100%",
                y: "50vh",
              }}
              columns={columns2}
              dataSource={dataTable2}
            />
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default SanLuong;
