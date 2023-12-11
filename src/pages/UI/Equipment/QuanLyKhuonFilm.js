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
    title: "Số lượng đang lưu kho",
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
    title: "Số lượng đang PM",
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
    render: (value) => value || "-",
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
  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState([]);

  return (
    <>
      <Row style={{ padding: "8px" }} gutter={[8, 8]}>
        <Col span={4}>
          <Card
            style={{ height: "100%" }}
            bodyStyle={{ paddingInline: 0, paddingTop: 0 }}
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
                    style={{ maxHeight: "80px", overflowY: "auto" }}
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
                    onChange={(value) => setParams({ ...params, lo_sx: value })}
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
                    onChange={(value) => setParams({ ...params, lo_sx: value })}
                    options={listLoSX}
                  />
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
          </Card>
        </Col>
        <Col span={20}>
          <Card
            style={{ height: "100%" }}
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
            <Table columns={columnsTable} dataSource={dataTable} bordered className="mt-5"/>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default QuanLyKhuonFilm;
