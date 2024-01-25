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
  Upload,
  message,
  Checkbox,
  Space,
  Modal,
  Spin,
  Popconfirm,
  Badge,
} from "antd";
import { baseURL } from "../../config";
import React, { useState, useRef, useEffect } from "react";
import {
  createUsers,
  deleteUsers,
  exportUsers,
  getUserRoles,
  getUsers,
  updateUsers,
} from "../../api";
import logo from "../../assets/images/logo.jpg";
import background1 from "../../assets/images/bg2.jpg";
import { UserOutlined } from "@ant-design/icons";
import { useProfile } from "../../components/hooks/UserHooks";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { changePassword } from "../../api/oi/login";

const ChangePassword = () => {
  document.title = "Đổi mật khẩu";
  const history = useHistory();
  const { userProfile } = useProfile();
  useEffect(() => {
    console.log(userProfile);
    if (!userProfile) {
      history.push("/login");
    } else {
      form.setFieldsValue(userProfile);
    }
  }, []);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    console.log(values);
    setLoading(true);
    var res = await changePassword(values);
    if (res.success) {
      history.push("/login");
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <div
        className="auth-page-content"
        style={{
          backgroundImage: `url(${background1})`,
          backgroundSize: "cover",
          height: "100vh",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* <Row className="justify-content-center" justify="center"> */}
        <Card
          className=""
          style={{
            width: "50%",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <div className="text-center mt-3">
            <img className="mb-3" src={logo} />
          </div>
          <h6 className="text-center text-primary mb-0">
            CÔNG TY CỔ PHẦN THÁI BÌNH DƯƠNG XANH
          </h6>
          <div className="p-2 mt-3 text-center">
            <Form layout="vertical" onFinish={onFinish} form={form}>
              <Form.Item className="mb-4" name="username" label="Đổi mật khẩu">
                <Input
                  disabled={true}
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Nhập mã nhân viên"
                />
              </Form.Item>
              <Form.Item
                name="password"
                label="Mật khẩu cũ"
                rules={[
                  {
                    required: true,
                    min: 6,
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                hasFeedback
                rules={[
                  {
                    required: true,
                    min: 6,
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item className="mb-4" name="password">
                <Button
                  className=""
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  loading={loading}
                >
                  Đổi mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>
        {/* </Row> */}
      </div>
    </React.Fragment>
  );
};

export default ChangePassword;
