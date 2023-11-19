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
import { useEffect, useState } from "react";

const { Sider } = Layout;
const { RangePicker } = DatePicker;

const colLine = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    render: (value, record, index) => index + 1,
    align: "center",
  },
  {
    title: "Nhà máy",
    dataIndex: "manufactor",
    key: "manufactor",
    align: "center",
  },
  {
    title: "Bộ phận",
    dataIndex: "department",
    key: "department",
    align: "center",
  },
  {
    title: "Công đoạn",
    dataIndex: "line",
    key: "line",
    align: "center",
  },
  {
    title: "Tên máy",
    dataIndex: "name_machine",
    key: "name_machine",
    align: "center",
  },
  {
    title: "Mã máy",
    dataIndex: "model_machine",
    key: "model_machine",
    align: "center",
  },
  {
    title: "Mã nhân viên",
    dataIndex: "id_staff",
    key: "id_staff",
    align: "center",
  },
  {
    title: "Tên công nhân",
    dataIndex: "name_worker",
    key: "name_worker",
    align: "center",
  },
  {
    title: "Thợ chính/Thợ phụ",
    dataIndex: "position_worker",
    key: "position_worker",
    reder: (record) => (record == "main" ? "Thợ chính" : "Thợ phụ"),
    align: "center",
  },
  {
    title: "Công việc thực hiện",
    dataIndex: "detail_work",
    key: "detail_work",
    align: "center",
  },
  {
    title: "Người cập nhập",
    dataIndex: "updated_user",
    key: "updated_user",
    align: "center",
  },
  {
    title: "Thời gian cập nhập",
    dataIndex: "updated_time",
    key: "updated_time",
    align: "center",
  },
  {
    title: "Hành động",
    render: () => {
      return (
        <>
          <Tag icon={<EditOutlined />} color="#108ee9">
            Sửa
          </Tag>
          <Tag icon={<DeleteOutlined />} color="#cd201f">
            Xóa
          </Tag>
        </>
      );
    },
    align: "center",
  },
];
const dataLine = [];
for (let i = 0; i < 10; i++) {
  let data = {
    stt: i,
    manufactor: "Thăng Long",
    department: "Giấy",
    line: "Công đoạn " + i,
    name_machine: "Tên máy " + i,
    model_machine: "Mã máy " + i,
    id_staff: "NV" + i,
    name_worker: "Tên công nhân " + i,
    position_worker: "main",
    detail_work: "Công việc thực hiện " + i,
    updated_user: "Nhân viên " + i,
    updated_time: "9:48 2/8/2023",
  };
  dataLine.push(data);
}

const colBom = [
  {
    title: "NO",
    dataIndex: "index",
    key: "index",
    render: (value, record, index) => index + 1,
    align: "center",
  },
  {
    title: "Mã hàng",
    dataIndex: "id_product",
    key: "id_product",
    align: "center",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name_product",
    key: "name_product",
    align: "center",
  },
  {
    title: "Khách hàng",
    dataIndex: "customer",
    key: "customer",
    align: "center",
  },
  {
    title: "Mã NVL",
    dataIndex: "id_nvl",
    key: "id_nvl",
    align: "center",
  },
  {
    title: "Tên NVL",
    dataIndex: "name_nvl",
    key: "name_nvl",
    align: "center",
  },
  {
    title: "Mã khuôn",
    dataIndex: "id_mold",
    key: "id_mold",
    align: "center",
  },
  {
    title: "Số bát",
    dataIndex: "number_bat",
    key: "number_bat",
    align: "center",
  },
  {
    title: "Số màu",
    dataIndex: "number_color",
    key: "number_color",
    align: "center",
  },
  {
    title: "Tiêu chuẩn kích thước",
    dataIndex: "size_standard",
    key: "size_standard",
    align: "center",
  },
  {
    title: "Tiêu chuẩn đặc tính",
    dataIndex: "feature_standard",
    key: "feature_standard",
    align: "center",
  },
  {
    title: "Ngoại quan",
    dataIndex: "apperance",
    key: "apperance",
    align: "center",
  },
  {
    title: "Đóng gói",
    dataIndex: "package",
    key: "package",
    align: "center",
  },
  {
    title: "Người cập nhập",
    dataIndex: "updated_user",
    key: "updated_user",
    align: "center",
  },
  {
    title: "Thời gian cập nhập",
    dataIndex: "updated_time",
    key: "updated_time",
    align: "center",
  },
  {
    title: "Hành động",
    render: () => {
      return (
        <>
          <Tag icon={<EditOutlined />} color="#108ee9">
            Sửa
          </Tag>
          <Tag icon={<DeleteOutlined />} color="#cd201f">
            Xóa
          </Tag>
        </>
      );
    },
    align: "center",
  },
];
const dataBom = [];
for (let i = 0; i < 10; i++) {
  let data = {
    id_product: "Mã hàng " + i,
    name_product: "Tên sản phẩm " + i,
    customer: "Khách hàng " + i,
    id_nvl: "Mã NVL " + i,
    name_nvl: "Tên NVL " + i,
    id_mold: "Mã khuôn" + i,
    number_bat: "Số bát " + i,
    number_color: "Số màu " + i,
    size_standard: "TC size " + i,
    feature_standard: "TC đặc tính " + i,
    apperance: "Ngoại quan " + i,
    package: "Đóng gói " + i,
    updated_user: "Nhân viên " + i,
    updated_time: "10:29 2/8/2023",
  };
  dataBom.push(data);
}

const colSchedule = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    render: (value, record, index) => index + 1,
    align: "center",
  },
  {
    title: "Nhà máy",
    dataIndex: "manufactor",
    key: "manufactor",
    align: "center",
  },
  {
    title: "Bộ phận",
    dataIndex: "department",
    key: "department",
    align: "center",
  },
  {
    title: "Công đoạn",
    dataIndex: "line",
    key: "line",
    align: "center",
  },
  {
    title: "Tên máy",
    dataIndex: "name_machine",
    key: "name_machine",
    align: "center",
  },
  {
    title: "Mã máy",
    dataIndex: "model_machine",
    key: "model_machine",
    align: "center",
  },
  {
    title: "Ca sản xuất",
    dataIndex: "production_shift",
    key: "production_shift",
    align: "center",
  },
  {
    title: "Mã thời gian làm việc",
    dataIndex: "model_time_work",
    key: "model_time_work",
    align: "center",
  },
  {
    title: "Thời gian làm việc bình thường",
    dataIndex: "work_time_normal",
    key: "work_time_normal",
    align: "center",
  },
  {
    title: "Tăng ca",
    dataIndex: "overtime_work",
    key: "overtime_work",
    align: "center",
  },
  {
    title: "Thời gian nghỉ ngơi",
    dataIndex: "rest_time",
    key: "rest_time",
    align: "center",
  },
  {
    title: "Thời gian bắt đầu",
    dataIndex: "start_time",
    key: "start_time",
    align: "center",
  },

  {
    title: "Thời gian kết thúc",
    dataIndex: "end_time",
    key: "end_time",
    align: "center",
  },
  {
    title: "Thời gian bắt đầu nghỉ giữa ca",
    dataIndex: "start_time_rest",
    key: "start_time_rest",
    align: "center",
  },
  {
    title: "Thời gian kết thúc nghỉ giữa ca",
    dataIndex: "end_time_rest",
    key: "end_time_rest",
    align: "center",
  },
  {
    title: "Người cập nhập",
    dataIndex: "updated_user",
    key: "updated_user",
    align: "center",
  },
  {
    title: "Thời gian cập nhập",
    dataIndex: "updated_time",
    key: "updated_time",
    align: "center",
  },
  {
    title: "Hành động",
    render: () => {
      return (
        <>
          <Tag icon={<EditOutlined />} color="#108ee9">
            Sửa
          </Tag>
          <Tag icon={<DeleteOutlined />} color="#cd201f">
            Xóa
          </Tag>
        </>
      );
    },
    align: "center",
  },
];
const dataSchedule = [];
for (let i = 0; i < 10; i++) {
  let data = {
    stt: i,
    manufactor: "Thăng Long",
    department: "Giấy",
    line: "Công đoạn " + i,
    name_machine: "Tên máy " + i,
    model_machine: "Mã máy " + i,
    production_shift: "Ca sản xuất " + i,
    model_time_work: "Mã thời gian làm việc " + i,
    work_time_normal: "660",
    overtime_work: "0",
    rest_time: "60",
    start_time: "7:00",
    end_time: "19:00",
    start_time_rest: "12:00",
    end_time_rest: "13:00",
    updated_user: "Nhân viên " + i,
    updated_time: "9:48 2/8/2023",
  };
  dataSchedule.push(data);
}
const options = [
  {
    value: "0",
    label: "Quản lý Line",
    titleCard: "Danh sách Line",
    colTable: colLine,
    dataTable: dataLine,
  },
  {
    value: "1",
    label: "Quản lý BOM",
    titleCard: "Danh sách BOM",
    colTable: colBom,
    dataTable: dataBom,
  },
  {
    value: "2",
    label: "QL Lịch làm việc",
    titleCard: "Lịch làm việc",
    colTable: colSchedule,
    dataTable: dataSchedule,
  },
];

const Category = (props) => {
  const [titleCard, setTitleCard] = useState(options[0].label);
  const [colTable, setColTable] = useState(options[0].colTable);
  const [dataTable, setDataTable] = useState(options[0].dataTable);
  const selectScreen = (value) => {
    setTitleCard(options[value].titleCard);
    setColTable(options[value].colTable);
    setDataTable(options[value].dataTable);
  };
  return (
    <>
      <Sider
        style={{
          backgroundColor: "white",
          maxHeight: "100vh",
          float: "left",
          overflow: "auto",
        }}
      >
        <Divider>Chọn danh sách</Divider>
        <div className="mb-3">
          <Form style={{ margin: "0 15px" }} layout="vertical">
            <Form.Item className="mb-3">
              <Select
                defaultValue="0"
                options={options}
                onSelect={selectScreen}
              />
            </Form.Item>
          </Form>
        </div>
        <Divider>Thông tin kho</Divider>
        <div className="mb-3">
          <Form style={{ margin: "0 15px" }} layout="vertical">
            <Form.Item label="Kho" className="mb-3">
              <Select
                defaultValue="kho1"
                options={[
                  { value: "kho1", label: "Kho 1" },
                  { value: "kho2", label: "Kho 2" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Giá" className="mb-3">
              <Select
                defaultValue="gia1"
                options={[
                  { value: "1", label: "Giá 1" },
                  { value: "2", label: "Giá 2" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Rack" className="mb-3">
              <Select
                defaultValue="1"
                options={[
                  { value: "1", label: "Rack 1" },
                  { value: "2", label: "Rack 2" },
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
            <Form.Item label="Khách hàng" className="mb-3">
              <AutoComplete placeholder="Nhập khách hàng"></AutoComplete>
            </Form.Item>
            <Form.Item label="Mã hàng" className="mb-3">
              <AutoComplete placeholder="Nhập mã hàng"></AutoComplete>
            </Form.Item>
            <Form.Item label="Tên sản phẩm" className="mb-3">
              <AutoComplete placeholder="Nhập tên SP"></AutoComplete>
            </Form.Item>
            <Form.Item label="PO" className="mb-3">
              <Input placeholder="Nhập mã PO"></Input>
            </Form.Item>
            <Form.Item label="Nhân viên" className="mb-3">
              <Input placeholder="Nhập mã nhân viên"></Input>
            </Form.Item>
          </Form>
        </div>

        <div
          className="mb-3"
          style={{ padding: "10px", textAlign: "center" }}
          layout="vertical"
        >
          <Button type="primary" style={{ width: "80%" }}>
            Truy vấn
          </Button>
        </div>
      </Sider>
      <Row style={{ height: "90vh" }}>
        <Col span={24} style={{ padding: "10px" }}>
          <Card style={{ height: "100%" }} title={titleCard}>
            {
              <>
                <Row style={{ float: "right" }} className="mb-3">
                  <Button
                    style={{ marginLeft: "15px" }}
                    type="primary"
                    icon={<UploadOutlined />}
                  >
                    Up Excel
                  </Button>
                  <Button
                    style={{ marginLeft: "15px" }}
                    icon={<PlusOutlined />}
                    type="primary"
                  >
                    Thêm hàng
                  </Button>
                </Row>
              </>
            }

            <Table
              size="small"
              bordered
              pagination={false}
              scroll={{ x: "100%", y: "60vh" }}
              columns={colTable}
              dataSource={dataTable}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Category;
