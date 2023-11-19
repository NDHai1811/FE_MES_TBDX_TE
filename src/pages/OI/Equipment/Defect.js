import {
  AutoComplete,
  Button,
  Form,
  Input,
  Modal,
  Space,
  Table,
  TimePicker,
} from "antd";
import { useState } from "react";

const Defect = (props) => {
  const [data, setData] = useState([]);
  const columns = [
    {
      title: "STT",
      dataIndex: "no",
      key: "no",
      align: "center",
      render: (value, item, index) => index + 1,
    },
    {
      title: "Thời gian dừng",
      dataIndex: "no",
      key: "no",
      align: "center",
    },
    {
      title: "Thời gian chạy",
      dataIndex: "no",
      key: "no",
      align: "center",
    },
    {
      title: "Mã lỗi",
      dataIndex: "no",
      key: "no",
      align: "center",
    },
    {
      title: "Tên lỗi",
      dataIndex: "no",
      key: "no",
      align: "center",
    },
    {
      title: "Nguyên nhân lỗi",
      dataIndex: "no",
      key: "no",
      align: "center",
    },
    {
      title: "Biện pháp khắc phục",
      dataIndex: "no",
      key: "no",
      align: "center",
    },
    {
      title: "Biện pháp phòng ngừa",
      dataIndex: "no",
      key: "no",
      align: "center",
    },
    {
      title: "Tình trạng",
      dataIndex: "no",
      key: "no",
      align: "center",
    },
  ];
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();
  const onFinish = (values) => {};
  const defectData = [];
  const [searchData, setSearchData] = useState([]);
  const searchResult = (query) => {
    const result = defectData.filter((e) =>
      e?.name?.toLowerCase().includes(query?.toLowerCase())
    );
    return result.map((e) => {
      return { value: e.id, label: e.name };
    });
  };
  const handleSearch = (value) => {
    setSearchData(value ? searchResult(value) : []);
  };
  return (
    <Space direction="vertical">
      <Button
        type="primary"
        size="large"
        onClick={() => setOpenModal(true)}
        style={{ float: "right" }}
      >
        Nhập thông tin lỗi
      </Button>
      <Form>
        <Table
           scroll={{
            x: window.screen.width,
          }}
          pagination={false}
          bordered
          className="mb-4"
          columns={columns}
          dataSource={data}
        />
      </Form>
      <Modal
        title="Thông tin lỗi"
        open={openModal}
        onCancel={() => setOpenModal(false)}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name={"stop_time"} label="Thời gian dừng">
            <TimePicker />
          </Form.Item>
          <Form.Item name={"run_time"} label="Thời gian chạy">
            <TimePicker />
          </Form.Item>
          <Form.Item name={"defect_id"} label="Mã lỗi">
            <Input />
          </Form.Item>
          <Form.Item name={"defect_name"} label="Tên lỗi">
            <AutoComplete
              style={{
                width: "100%",
              }}
              options={searchData}
              onSearch={handleSearch}
            ></AutoComplete>
          </Form.Item>
          <Form.Item name={"cause"} label="Nguyên nhân lỗi">
            <Input />
          </Form.Item>
          <Form.Item name={"overcome"} label="Biện pháp khắc phục">
            <Input />
          </Form.Item>
          <Form.Item name={"prevent"} label="Biện pháp phòng ngừa">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};
export default Defect;
