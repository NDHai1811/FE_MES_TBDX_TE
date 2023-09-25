import { CloseOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Layout, Row, Menu, Avatar, Space, Button, Dropdown } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom'
import logolight from "../assets/images/logo.png";
import { useProfile } from "../components/hooks/UserHooks";
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const items = [
    {
        label: 'Sản xuất',
        key:'manufacture',
        children: [
            {
                label: 'Quản lý giấy và bảo ôn',
                key:'manufacture/giay-bao-on',
            },
            {
                label: 'Kế hoạch sản xuất',
                key:'manufacture/ke-hoach-san-xuat',
            },
            {
                label: 'Lịch sử sản xuất',
                key:'manufacture/lich-su-san-xuat',
            },
        ],
        
        permission:'ui-sx'
    },
    {
        label: 'Chất lượng',
        key:'quality',
        children:[
            {
                label: 'PQC',
                key:'quality/PQC',
            },
            {
                label: 'OQC',
                key:'quality/OQC',
            }
        ],
        permission:'ui-cl'
    },
    {
        label: 'Thiết bị',
        key:'equipment',
        children:[
            {
                label: 'Thống kê lỗi',
                key:'equipment/thong-ke-loi',
            },
            {
                label: 'Thông số máy',
                key:'equipment/thong-so-may',
            }
        ],
        permission:'ui-tb'
    }, 
    {
        label: 'Kho',
        key:'warehouse',
        children:[
            {
                label: 'Quản lý kho thành phẩm giấy',
                key:'warehouse/thanh-pham-giay',
            },
            {
                label: 'Kế hoạch xuất kho',
                key:'warehouse/ke-hoach-xuat-kho',
            }
        ],
        permission:'ui-kho'
    },
    {
        label: 'KPI',
        key:'kpi',
        permission:'ui-kpi'
    },
    {
        label: 'Giám sát bất thường',
        key:'abnormal',
        children:[
            {
                label: 'Kịch bản bất thường',
                key:'abnormal/kich-ban-bat-thuong',
            },
            {
                label: 'Lịch sử bất thường',
                key:'abnormal/lich-su-bat-thuong',
            }
        ],
        permission:'ui-abnormal'
    },

]
const HeaderUI = () => {
    const { userProfile } = useProfile();
    const [clock, setClock] = useState(new Date())
    useEffect(()=>{
        setInterval(() => tick(), 1000);
    }, [])
    const tick = () => {
        setClock(new Date());
    }

    const [ui, setUI] = useState(window.location.pathname.split('/ui/')[1]);
    const [userInfo, setUserInfo] = useState()
    const history = useHistory();
    const selectMenu = (key) => {
        let r = '/ui/' + key.key
        history.push(r);
        setUI(key.key)
    }
    useEffect(()=>{
        console.log(ui);
    }, [ui])
    const logout = () =>{
        window.location.href = '/logout';
    }
    const itemsDropdown = [
        {
            key: '1',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            onClick: ()=>logout(),
        },
    ]
    return (
        <React.Fragment>
            <Layout  style={{top: 0, left: 0, width:'100%', backgroundColor:'#2462A3', paddingLeft:'10px', paddingRight:'10px', paddingTop:'3px', paddingBottom:'3px'}}>
                  <Row style={{alignItems:'center'}}>
                        <Col span = {4}>
                              <div className="demo-logo" style={{ display: 'flex'}} >
                              <img style={{ height: '80%'}} src={logolight} />
                              </div>
                        </Col>
                        <Col span = {14}>
                            <Menu
                                mode="horizontal"
                                defaultSelectedKeys={[ui]}
                                selectedKeys={[ui]}
                                style={{
                                    // width: '100%',
                                    // height: '100%',
                                    alignItems: 'center',
                                    background: '#2462a3',
                                    color: '#fff',
                                    fontWeight: '600'
                                }}
                                items={items.filter(e=>(userProfile?.permission??[]).includes('*') || (userProfile?.permission??[]).includes(e.permission))}
                                onSelect={selectMenu}
                            />
                        </Col>
                        <Col span={6} className='text-end align-items-center d-flex justify-content-end'>
                            <Dropdown menu={{items:itemsDropdown}} placement="bottomRight" arrow trigger={'click'}>
                                <Button type='text' style={{float:'right',color:'white', paddingRight:'10px', alignContent:'center', display:'flex'}} className='h-100'>
                                    <div style={{textAlign:'center'}}>
                                        {userProfile?.name ?? 'User name'}
                                        <div>{clock.toLocaleString(['en-GB'], { hour12: false })}</div>
                                    </div>
                                    <Avatar size='large' style={{backgroundColor:'white', marginLeft:'10px'}} src={userProfile?.avatar} icon={<UserOutlined style={{color:'black'}}/>}></Avatar>
                                </Button>
                            </Dropdown>
                            <Link to={'/screen'} style={{ margin: 'auto 0' }}>
                                <CloseOutlined className='text-white' style={{ fontSize: '1.4em' }} />
                            </Link>
                        </Col>
                  </Row>
            </Layout>
        </React.Fragment>
    );
};

export default HeaderUI;