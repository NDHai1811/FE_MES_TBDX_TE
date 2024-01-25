import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Col,
  Row,
  Card,
  Divider,
  Button,
  Form,
  Select,
  Space,
  Tree,
  Table,
} from "antd";
import "../style.scss";
import dayjs from "dayjs";

const itemsMenu = [
  {
    title: "Xưởng",
    key: "30",
    children: [
      {
        title: "Chuyền máy dợn sóng",
        key: "S01",
      },
    ],
  },
  {
    title: "Công đoạn",
    key: "31",
    children: [
      {
        title: "Máy in P.06",
        key: "P06",
      },
      {
        title: "Máy in P.15",
        key: "P15",
      },
    ],
  },
  {
    title: "Tên Máy",
    key: "32",
    children: [
      {
        title: "Máy dán D.05",
        key: "D05",
      },
      {
        title: "Máy dán D.06",
        key: "D06",
      },
    ],
  },
];

const columns = [
  {
    title: "Số lượng đang sở hữu",
    children: [
      {
        title: "Khuôn",
        dataIndex: "khuon",
        key: "khuon",
        align: "center",
      },
      {
        title: "Film",
        dataIndex: "film",
        key: "film",
        align: "center",
      },
    ],
  },
  {
    title: "Số lượng đang chạy",
    children: [
      {
        title: "Khuôn",
        dataIndex: "khuon_chay",
        key: "khuon_chay",
        align: "center",
      },
      {
        title: "Film",
        dataIndex: "film_chay",
        key: "film_chay",
        align: "center",
      },
    ],
  },
  {
    title: "Số lượng đang lưu kho",
    children: [
      {
        title: "Khuôn",
        dataIndex: "khuon_luu",
        key: "khuon_luu",
        align: "center",
      },
      {
        title: "Film",
        dataIndex: "film_luu",
        key: "film_luu",
        align: "center",
      },
    ],
  },
  {
    title: "Số lượng đang PM",
    children: [
      {
        title: "Khuôn",
        dataIndex: "khuon_pm",
        key: "khuon_pm",
        align: "center",
      },
      {
        title: "Film",
        dataIndex: "film_pm",
        key: "film_pm",
        align: "center",
      },
    ],
  },
  {
    title: "Tỷ lệ tuân thủ thời gian PM",
    dataIndex: "ty_le",
    key: "ty_le",
    align: "center",
  },
];

const columnsTable = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
    align: "center",
    render: (item, record, index) => index + 1,
  },
  {
    title: "Mã khuôn/film",
    dataIndex: "ma_khuon",
    key: "ma_khuon",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Tên khuôn/film",
    dataIndex: "ten_khuon",
    key: "ten_khuon",
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
  {
    title: "Ngày tạo",
    dataIndex: "ngay_tao",
    key: "ngay_tao",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Ngày PM gần nhất",
    dataIndex: "ngay_pm",
    key: "ngay_pm",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Số shot khi PM",
    dataIndex: "so_shot",
    key: "so_shot",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Người PM",
    dataIndex: "nguoi_pm",
    key: "nguoi_pm",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Chu kỳ PM",
    dataIndex: "chu_ky_pm",
    key: "chu_ky_pm",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Dự kiến ngày bảo trì tiếp theo",
    dataIndex: "ngay_bao_tri_tiep_theo",
    key: "ngay_bao_tri_tiep_theo",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Tình trạng khuôn/film",
    dataIndex: "tinh_trang_khuon",
    key: "tinh_trang_khuon",
    align: "center",
    render: (value) => value || "Bình thường",
  },
  {
    title: "Hành động cuối",
    dataIndex: "hanh_dong_cuoi",
    key: "hanh_dong_cuoi",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Vị trí khuôn/film",
    dataIndex: "vị_tri_khuon",
    key: "vị_tri_khuon",
    align: "center",
    render: (value) => value || "-",
  },
  {
    title: "Ngày lên khuôn gần nhất",
    dataIndex: "ngay_len_khuon_gan_nhat",
    key: "ngay_len_khuon_gan_nhat",
    align: "center",
    render: (value) => value || "-",
  },
];

const QuanLyKhuonFilm = () => {
  const [params, setParams] = useState({
    machine_code: "",
    date: [dayjs(), dayjs()],
  });
  const [listLoSX, setListLoSX] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const data = [
    {
      khuon: "66",
      film: "134",
      khuon_chay: "2",
      film_chay: "2",
      khuon_luu: "120",
      film_luu: "170",
      khuon_pm: "17",
      film_pm: "15",
      ty_le: "100%",
    },
  ];
  const dataTable = [
    {
      stt: "1",
      ma_khuon: "KBL-129",
      ten_khuon: "KBL-129",
      khach_hang: "TAICERA",
      ngay_tao: "10/12/2023",
      ngay_pm: "10/12/2023",
      so_shot: "1",
      nguoi_pm: "Trần Văn Thái",
      chu_ky_pm: "1",
      ngay_bao_tri_tiep_theo: "20/12/2023",
      tinh_trang: "1",
      hanh_dong_cuoi: "",
      vị_tri_khuon: "P16",
      ngay_len_khuon_gan_nhat: "10/12/2023",
    },
    {
      stt: "2",
      ma_khuon: "KBL-019",
      ten_khuon: "KBL-019",
      khach_hang: "TAICERA",
      ngay_tao: "10/12/2023",
      ngay_pm: "10/12/2023",
      so_shot: "1",
      nguoi_pm: "Trần Văn Thái",
      chu_ky_pm: "1",
      ngay_bao_tri_tiep_theo: "20/12/2023",
      tinh_trang: "1",
      hanh_dong_cuoi: "",
      vị_tri_khuon: "P16",
      ngay_len_khuon_gan_nhat: "10/12/2023",
    },
    {
      stt: "3",
      ma_khuon: "KBL-129",
      ten_khuon: "KBL-129",
      khach_hang: "TAICERA",
      ngay_tao: "10/12/2023",
      ngay_pm: "10/12/2023",
      so_shot: "1",
      nguoi_pm: "Trần Văn Thái",
      chu_ky_pm: "1",
      ngay_bao_tri_tiep_theo: "20/12/2023",
      tinh_trang: "1",
      hanh_dong_cuoi: "",
      vị_tri_khuon: "P16",
      ngay_len_khuon_gan_nhat: "10/12/2023",
    },
    {
      stt: "4",
      ma_khuon: "KBL-076",
      ten_khuon: "KBL-076",
      khach_hang: "TAICERA",
      ngay_tao: "10/12/2023",
      ngay_pm: "10/12/2023",
      so_shot: "1",
      nguoi_pm: "Trần Văn Thái",
      chu_ky_pm: "1",
      ngay_bao_tri_tiep_theo: "20/12/2023",
      tinh_trang: "1",
      hanh_dong_cuoi: "",
      vị_tri_khuon: "P16",
      ngay_len_khuon_gan_nhat: "10/12/2023",
    },
    {
      stt: "5",
      ma_khuon: "KBL-129",
      ten_khuon: "KBL-129",
      khach_hang: "TAICERA",
      ngay_tao: "10/12/2023",
      ngay_pm: "10/12/2023",
      so_shot: "1",
      nguoi_pm: "Trần Văn Thái",
      chu_ky_pm: "1",
      ngay_bao_tri_tiep_theo: "20/12/2023",
      tinh_trang: "1",
      hanh_dong_cuoi: "",
      vị_tri_khuon: "P16",
      ngay_len_khuon_gan_nhat: "10/12/2023",
    },
    {
      stt: "6",
      ma_khuon: "KBL-018",
      ten_khuon: "KBL-018",
      khach_hang: "TAICERA",
      ngay_tao: "10/12/2023",
      ngay_pm: "10/12/2023",
      so_shot: "1",
      nguoi_pm: "Trần Văn Thái",
      chu_ky_pm: "1",
      ngay_bao_tri_tiep_theo: "20/12/2023",
      tinh_trang: "1",
      hanh_dong_cuoi: "",
      vị_tri_khuon: "P16",
      ngay_len_khuon_gan_nhat: "10/12/2023",
    },
    {
      stt: "7",
      ma_khuon: "KBL-035",
      ten_khuon: "KBL-035",
      khach_hang: "TAICERA",
      ngay_tao: "10/12/2023",
      ngay_pm: "10/12/2023",
      so_shot: "1",
      nguoi_pm: "Trần Văn Thái",
      chu_ky_pm: "1",
      ngay_bao_tri_tiep_theo: "20/12/2023",
      tinh_trang: "1",
      hanh_dong_cuoi: "",
      vị_tri_khuon: "P16",
      ngay_len_khuon_gan_nhat: "10/12/2023",
    },
    {
      stt: "8",
      ma_khuon: "KBL-017",
      ten_khuon: "KBL-017",
      khach_hang: "TAICERA",
      ngay_tao: "10/12/2023",
      ngay_pm: "10/12/2023",
      so_shot: "1",
      nguoi_pm: "Trần Văn Thái",
      chu_ky_pm: "1",
      ngay_bao_tri_tiep_theo: "20/12/2023",
      tinh_trang: "1",
      hanh_dong_cuoi: "",
      vị_tri_khuon: "P16",
      ngay_len_khuon_gan_nhat: "10/12/2023",
    },
    {
      stt: "9",
      ma_khuon: "KBL-018",
      ten_khuon: "KBL-018",
      khach_hang: "TAICERA",
      ngay_tao: "10/12/2023",
      ngay_pm: "10/12/2023",
      so_shot: "1",
      nguoi_pm: "Trần Văn Thái",
      chu_ky_pm: "1",
      ngay_bao_tri_tiep_theo: "20/12/2023",
      tinh_trang: "1",
      hanh_dong_cuoi: "",
      vị_tri_khuon: "P16",
      ngay_len_khuon_gan_nhat: "10/12/2023",
    },
  ];
  return (
    <>
      <Row style={{ padding: "8px" }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Card
              style={{ height: "100%" }}
              bodyStyle={{ paddingInline: 0, paddingTop: 0 }}
              className="custom-card scroll"
              actions={[
                <div layout="vertical">
                  <Button type="primary" style={{ width: "80%" }}>
                    Truy vấn
                  </Button>
                </div>,
              ]}
            >
              <div className="mb-3">
                <Form style={{ margin: "0 15px" }} layout="vertical">
                  <Divider>Công đoạn</Divider>
                  <Form.Item className="mb-3">
                    <Tree
                      checkable
                      defaultExpandedKeys={["0-0-0", "0-0-1"]}
                      defaultSelectedKeys={["0-0-0", "0-0-1"]}
                      defaultCheckedKeys={["0-0-0", "0-0-1"]}
                      // onSelect={onSelect}
                      // onCheck={onCheck}
                      treeData={itemsMenu}
                      // style={{ maxHeight: "80px", overflowY: "auto" }}
                    />
                  </Form.Item>
                </Form>
              </div>
              <Divider>Thời gian truy vấn</Divider>
              <div className="mb-3">
                <Form style={{ margin: "0 15px" }} layout="vertical">
                  {/* <RangePicker placeholder={["Bắt đầu", "Kết thúc"]} /> */}
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
                <Form style={{ margin: "0 15px" }} layout="vertical">
                  <Form.Item label="Tên/mã khuôn/film" className="mb-3">
                    <Select
                      allowClear
                      showSearch
                      placeholder="Chọn khuôn/film"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      onChange={(value) =>
                        setParams({ ...params, lo_sx: value })
                      }
                      options={listLoSX}
                    />
                  </Form.Item>
                  <Form.Item label="Vị trí" className="mb-3">
                    <Select
                      allowClear
                      showSearch
                      onChange={(value) => {
                        setParams({ ...params, ten_sp: value });
                      }}
                      placeholder="Chọn vị trí"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={[]}
                    />
                  </Form.Item>
                  <Form.Item label="Khách hàng" className="mb-3">
                    <Select
                      allowClear
                      showSearch
                      placeholder="Chọn khách hàng"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      onChange={(value) =>
                        setParams({ ...params, lo_sx: value })
                      }
                      options={listLoSX}
                    />
                  </Form.Item>
                </Form>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Card
            style={{ height: "100%" }}
            bodyStyle={{ paddingBottom: 0 }}
            className="custom-card scroll"
            extra={
              <>
                <Button type="primary">Xuất excel</Button>
                <Button type="primary" style={{ marginLeft: 12 }}>
                  Report
                </Button>
              </>
            }
          >
            <Table columns={columns} dataSource={data} bordered />
            <Table
              columns={columnsTable}
              dataSource={dataTable}
              bordered
              className="mt-5"
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default QuanLyKhuonFilm;
