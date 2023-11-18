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

const col_report = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    render: (value, record, index) => index + 1,
    align: "center",
  },
  {
    title: "Mã khách hàng",
    dataIndex: "id_customer",
    key: "id_customer",
    align: "center",
  },
  {
    title: "Tên khách hàng",
    dataIndex: "name_customer",
    key: "name_customer",
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
    title: "Đơn vị tính",
    dataIndex: "unit",
    key: "unit",
    align: "center",
  },
  {
    title: "PO",
    dataIndex: "po",
    key: "po",
    align: "center",
  },
  {
    title: "Kho",
    dataIndex: "warehouse",
    key: "warehouse",
    align: "center",
  },
  {
    title: "Mã thùng",
    dataIndex: "id_pallet",
    key: "id_pallet",
    align: "center",
  },
];
const data_report = [];
const col_planExport = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    render: (value, record, index) => index + 1,
    align: "center",
  },
  {
    title: "Mã KH",
    dataIndex: "id_customer",
    key: "id_customer",
    align: "center",
  },
  {
    title: "Tên KH",
    dataIndex: "name_customer",
    key: "name_customer",
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
    title: "Đơn vị tính",
    dataIndex: "unit",
    key: "unit",
    align: "center",
  },
  {
    title: "PO",
    dataIndex: "po",
    key: "po",
    align: "center",
  },
  {
    title: "Kế hoạch",
    dataIndex: "plan",
    key: "plan",
    align: "center",
  },
  {
    title: "Tồn kho",
    dataIndex: "inventory",
    key: "inventory",
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
const data_planExport = [];
for (let i = 0; i < 50; i++) {
  let data = {
    stt: i,
    id_customer: "KH" + i,
    name_customer: "Tên khách hàng " + i,
    id_product: "SP" + i,
    name_product: "Tên sản phẩm " + i,
    unit: "Chiếc",
    po: "PO" + i,
    plan: "Kế hoạch " + i,
    inventory: "Tồn kho " + i,
  };
  data_planExport.push(data);
}
for (let i = 0; i < 50; i++) {
  let data = {
    stt: i,
    id_customer: "KH" + i,
    name_customer: "Tên khách hàng " + i,
    id_product: "SP" + i,
    name_product: "Tên sản phẩm " + i,
    unit: "Chiếc",
    po: "PO" + i,
    warehouse: "Kho " + i,
    id_pallet: "Thùng" + i,
  };
  data_report.push(data);
}

const Warehouse = (props) => {
  const [isSelectAction, setIsSelectAction] = useState(false);
  const selectScreen = (value) => {
    value == 0 ? setIsSelectAction(false) : setIsSelectAction(true);
  };
  return (
    <>
      <Sider
        style={{
          backgroundColor: "white",
          maxHeight: "90vh",
          float: "left",
          overflow: "auto",
        }}
      >
        <Divider>Chọn chức năng</Divider>
        <div className="mb-3">
          <Form style={{ margin: "0 15px" }} layout="vertical">
            <Form.Item className="mb-3">
              <Select
                defaultValue="0"
                options={[
                  { value: "0", label: "Kế hoạch xuất kho" },
                  { value: "1", label: "Thống kê báo cáo" },
                ]}
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
        {isSelectAction == 1 && (
          <>
            <Divider>Chức năng truy vấn</Divider>
            <div className="mb-3">
              <Form style={{ margin: "0 15px" }} layout="vertical">
                <Form.Item className="mb-3">
                  <Select
                    defaultValue="nhap"
                    options={[
                      { value: "xuat", label: "Xuất" },
                      { value: "nhap", label: "Nhập" },
                      { value: "ton", label: "Tồn" },
                      { value: "xnt", label: "X-N-T" },
                      { value: "ton-lau", label: "Tồn lâu" },
                    ]}
                    onSelect={selectScreen}
                  />
                </Form.Item>
              </Form>
            </div>
          </>
        )}
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
          <Card
            style={{ height: "100%" }}
            title={
              isSelectAction == false ? "Kế hoạch xuất kho" : "Thống kê báo cáo"
            }
          >
            {isSelectAction == false ? (
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
            ) : (
              <>
                <Row style={{ float: "right" }} className="mb-3">
                  <Button
                    style={{ marginLeft: "15px" }}
                    type="primary"
                    icon={<FileExcelOutlined />}
                  >
                    Xuất Excel
                  </Button>
                  <Button
                    style={{ marginLeft: "15px" }}
                    icon={<PrinterOutlined />}
                    type="primary"
                  >
                    In file
                  </Button>
                </Row>
              </>
            )}

            <Table
              size="small"
              bordered
              pagination={false}
              scroll={{ x: "100%", y: "60vh" }}
              columns={isSelectAction == false ? col_planExport : col_report}
              dataSource={
                isSelectAction == false ? data_planExport : data_report
              }
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Warehouse;
