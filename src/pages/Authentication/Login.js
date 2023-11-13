import React, { useEffect, useState } from 'react';
import { EyeTwoTone, EyeInvisibleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Button, Input, Card, Col, Row, Typography } from 'antd';
//redux
import { useSelector, useDispatch } from "react-redux";

import { withRouter, Link } from "react-router-dom";

import { loginUser, resetLoginFlag } from "../../store/actions";
import logo from "../../assets/images/logo.jpg";
import background1 from "../../assets/images/bg2.jpg";

const Login = (props) => {
    useEffect(() => {
        localStorage.removeItem('authUser');
    }, [])
    const dispatch = useDispatch();
    const { error } = useSelector(state => ({
        error: state.Login.error,
    }));
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            dispatch(resetLoginFlag());
        }, 4000);

    }, [dispatch, error]);
    const onFinish = async (values) => {
        dispatch(loginUser(values, props.history, setLoading));
    }
    const { Title } = Typography;
    document.title = "Đăng nhập";
    return (
        <React.Fragment>
            <div className="auth-page-content" style={{ backgroundImage: `url(${background1})`, backgroundSize: 'cover', height: '100vh', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                <Row className="justify-content-center w-100" justify="center">
                    <Col lg={{ span: 10 }} xs={{ span: 22 }}>
                        <Card className="" style={{ width: '100%', justifyContent: 'center', alignContent: 'center' }}>
                            <div className="text-center mt-3">
                                <img className='mb-3 w-25' src={logo} />
                            </div>
                            <h6 className='text-center text-primary mb-0'>CÔNG TY CỔ PHẦN BAO BÌ GIẤY THÁI BÌNH DƯƠNG XANH</h6>
                            <div className="p-2 mt-3 text-center">
                                <Form layout="vertical" onFinish={onFinish}>
                                    <Form.Item className="mb-4" name="username">
                                        <Input
                                            prefix={<UserOutlined className="site-form-item-icon" />}
                                            placeholder="Nhập mã nhân viên"
                                            rules={[{
                                                message: "Cần nhập mã nhân viên",
                                                required: true,
                                            },]}
                                        />
                                    </Form.Item>
                                    <Form.Item className="mb-4" name="password">
                                        <Input.Password
                                            placeholder="Mật khẩu"
                                            prefix={<LockOutlined className="site-form-item-icon" />}
                                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                            rules={[{
                                                message: "Cần nhập mật khẩu",
                                                required: true,
                                            },]} />
                                    </Form.Item>
                                    <Form.Item className="mb-4" name="password">
                                        <Button className="" type='primary' htmlType='submit' style={{ width: '100%' }} loading={loading}>Đăng nhập</Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Card>
                    </Col>
                </Row>

            </div>
        </React.Fragment>
    );
};

export default withRouter(Login);