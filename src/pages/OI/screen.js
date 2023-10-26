import React from 'react';
import { Button, Card, Col, Divider, Row, Typography } from 'antd';
//redux

import { withRouter, Link } from "react-router-dom";

import logo from "../../assets/images/logo.png";
import { useProfile } from '../../components/hooks/UserHooks';
import { LogoutOutlined } from '@ant-design/icons';

const Screen = (props) => {
    const { userProfile } = useProfile();
    console.log(userProfile);
    const { Title } = Typography;
    document.title = "Danh sách màn hình";
    const dashboard = [
        {
            title: 'Dashboard',
            link: '/dashboard-slide',
        },
        {
            title: 'Tình hình sản xuất',
            link: '/dashboard/tinh-hinh-san-xuat',
        },
        {
            title: 'Hiệu suất thiết bị',
            link: '/dashboard/hieu-suat-thiet-bi',
        },
        {
            title: 'Cảnh báo bất thường',
            link: '/dashboard/canh-bao-bat-thuong',
        },
    ]
    const listOI = [
        {
            title: 'Sản xuất',
            link: '/manufacture',
            permission: 'oi-sx',
        },
        {
            title: 'Chất lượng',
            link: '/quality',
            permission: 'oi-cl',
        },
        {
            title: 'Thiết bị',
            link: '/equipment',
            permission: 'oi-tb',
        },
        {
            title: 'Kho',
            link: '/warehouse',
            permission: 'oi-kho',
        },
    ];
    const listUI = [
        {
            title: 'Sản xuất',
            link: '/ui/manufacture/giay-bao-on',
            permission: 'ui-sx',
        },
        {
            title: 'Chất lượng',
            link: '/ui/quality/PQC',
            permission: 'ui-cl',
        },
        {
            title: 'Thiết bị',
            link: '/ui/equipment/thong-ke-loi',
            permission: 'ui-tb',
        },
        {
            title: 'Kho',
            link: '/ui/warehouse/thanh-pham-giay',
            permission: 'ui-kho',
        },
        {
            title: 'KPI',
            link: '/ui/kpi',
            permission: 'ui-kpi',
        },
    ];
    const permissionOI = (listOI ?? []).filter(e=>(userProfile?.permission??[]).includes('*') || (userProfile?.permission??[]).includes(e.permission))
    const permissionUI = (listUI ?? []).filter(e=>(userProfile?.permission??[]).includes('*') || (userProfile?.permission??[]).includes(e.permission))

    const logout = () =>{
        window.location.href = '/logout';
    }
    return (
        <React.Fragment>
            <div className="auth-page-content">
                <Row className="justify-content-center" justify="center">
                    <Col md={12} lg={12} xl={8}>
                        <Card className="mt-4">
                            <div className="text-center mt-2">
                                <img className='mb-3' src={logo} />
                                <Title level={4}>Công ty bao bì Thăng Long</Title>
                            </div>
                            <div className="p-2 mt-3">
                                <Row gutter={[16, 16]}>
                                    {dashboard.length > 0 && <Divider style={{margin:0}}>DASHBOARD</Divider>}
                                    {(dashboard ?? []).map(e=>{
                                        // if((userProfile.permission??[]).includes('*') || (userProfile.permission??[]).includes(e.permission)){
                                            return (
                                            <Col span={12}>
                                                <Link to={e.link}>
                                                    <Button type="primary" className='w-100'>{e.title}</Button>
                                                </Link>
                                            </Col>
                                            )
                                        // }
                                    })}
                                </Row>
                                <Row gutter={[16, 16]} className='mt-3'>
                                    {permissionOI.length > 0 && <Divider style={{margin:0}}>OI</Divider>}
                                    {(permissionOI ?? []).map(e=>{
                                        // if((userProfile.permission??[]).includes('*') || (userProfile.permission??[]).includes(e.permission)){
                                            return (
                                            <Col span={12}>
                                                <Link to={e.link}>
                                                    <Button type="primary" className='w-100'>{e.title}</Button>
                                                </Link>
                                            </Col>
                                            )
                                        // }
                                    })}
                                    <Col span={12}>
                                        <Link to={'tao-tem'}>
                                            <Button type="primary" className='w-100'>Tạo tem</Button>
                                        </Link>
                                    </Col>
                                </Row>
                                <Row gutter={[16, 16]} className='mt-3'>
                                    {permissionUI.length > 0 && <Divider style={{margin:0}}>UI</Divider>}
                                    {(permissionUI ?? []).map(e=>{
                                        // if((userProfile.permission??[]).includes('*') || (userProfile.permission??[]).includes(e.permission)){
                                            return (
                                            <Col span={12}>
                                                <Link to={e.link}>
                                                    <Button type="primary" className='w-100'>{e.title}</Button>
                                                </Link>
                                            </Col>
                                            )
                                        // }
                                    })}
                                </Row>
                            </div>
                            <Divider/>
                            <div className="p-2 mt-3">
                            <Button icon={<LogoutOutlined/>} onClick={logout} className='w-100'>Đăng xuất</Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
                
            </div>
        </React.Fragment>
    );
};

export default withRouter(Screen);