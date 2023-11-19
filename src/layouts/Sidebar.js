import {
  Layout,
  Divider,
  Button,
  DatePicker,
  Form,
  Input,
  theme,
  Select,
  AutoComplete,
} from "antd";
import React, { useState } from "react";
const { Sider } = Layout;

const { RangePicker } = DatePicker;

const SidebarUI = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <React.Fragment>
      <Sider
        style={{
          backgroundColor: "white",
          minHeight: "100vh",
          float: "left",
          paddingTop: "15px",
        }}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
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
        <Divider>Thời gian</Divider>
        <div className="mb-3">
          <Form style={{ margin: "0 15px" }} layout="vertical">
            <RangePicker />
          </Form>
        </div>
        <Divider>Điều kiện</Divider>
        <div className="mb-3">
          <Form style={{ margin: "0 15px" }} layout="vertical">
            <Form.Item label="Mã lỗi" className="mb-3">
              <AutoComplete placeholder="Nhập mã lỗi"></AutoComplete>
            </Form.Item>
            <Form.Item label="Tên lỗi" className="mb-3">
              <AutoComplete placeholder="Nhập tên lỗi"></AutoComplete>
            </Form.Item>
            <Form.Item label="Nguyên nhân lỗi" className="mb-3">
              <Input placeholder="Nhập nguyên nhân lỗi"></Input>
            </Form.Item>
          </Form>
        </div>

        <div style={{ padding: "10px", textAlign: "center" }} layout="vertical">
          <Button type="primary" style={{ width: "80%" }}>
            Truy vấn
          </Button>
        </div>
      </Sider>
    </React.Fragment>
  );
};

export default SidebarUI;
