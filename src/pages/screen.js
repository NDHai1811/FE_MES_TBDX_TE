import React from "react";
import { Button, Card, Col, Divider, Row, Typography, Space } from "antd";
//redux

import { withRouter, Link } from "react-router-dom";

import logo from "../assets/images/logo.jpg";
import { useProfile } from "../components/hooks/UserHooks";
import { LogoutOutlined, LockOutlined } from "@ant-design/icons";
import { authProtectedRoutes } from "../routes/allRoutes";

const Screen = (props) => {
  document.title = "Danh sách các màn"
  const { userProfile } = useProfile();
  const { Title } = Typography;

  const userPermissions = JSON.parse(window.localStorage.getItem("authUser"));
  const isRawMaterialWarehouse = userProfile.permission.includes("kho-nvl");
  const is_warehouse = userProfile.permission.some(e=>e.includes("kho"));
  const dashboard = [
    // {
    //   title: "Dashboard",
    //   link: "/dashboard-slide",
    // },
    {
      title: "Tình hình sản xuất",
      link: "/dashboard/tinh-hinh-san-xuat",
    },
    // {
    //   title: "Cảnh báo bất thường",
    //   link: "/dashboard/canh-bao-bat-thuong",
    // },
    {
      title: "Cảnh báo bất thường",
      link: "/dashboard/giao-dien-da-chieu",
    },
  ];
  const listOI = [
    {
      title: "Sản xuất",
      link: "/oi/manufacture",
      permission: "oi-manufacture",
    },
    {
      title: "Chất lượng",
      link: "/oi/quality/sx",
      permission: "oi-quality-sx",
    },
    {
      title: "Chất lượng",
      link: "/oi/quality/qc",
      permission: "oi-quality-cl",
    },
    {
      title: "Thiết bị",
      link: "/oi/equipment",
      permission: "oi-equipment",
    },
    {
      title: `Kho TP`,
      link: `/oi/warehouse/kho-tp/nhap`,
      permission: "oi-warehouse-tp",
    },
    {
      title: `Kho NVL`,
      link: `/oi/warehouse/kho-nvl/nhap`,
      permission: "oi-warehouse-nvl",
    },
  ];
  const listUI = [
    {
      title: "Sản xuất",
      link: "/ui/manufacture/ke-hoach-san-xuat",
      permission: "ui-sx",
    },
    {
      title: "Chất lượng",
      link: "/ui/quality/PQC",
      permission: "ui-cl",
    },
    {
      title: "Thiết bị",
      link: "/ui/equipment/thong-ke-loi",
      permission: "ui-tb",
    },
    {
      title: "Kho",
      link: "/ui/warehouse/quan-ly-kho",
      permission: "ui-kho",
    },
    {
      title: "KPI",
      link: "/ui/kpi",
      permission: "ui-kpi",
    },
    {
      title: "Master Data",
      link: "/ui/master-data/san-xuat/cong-doan",
      permission: "ui-master-data",
    },
  ];
  const permissionOI = (listOI ?? []).filter(
    (e) =>
    userProfile.username === 'admin' || 
    (userProfile?.permission ?? []).includes("*") ||
    (userProfile?.permission ?? []).includes(e.permission) || (e.permission === 'oi-kho' && is_warehouse)
  );
  const permissionUI = [];
  const availableUI = authProtectedRoutes.filter(e => e?.path.includes('ui/') && e?.label && (userProfile?.username === 'admin' || userProfile?.permission?.includes(e?.permission))).map(e => ({ ...e, title: e?.label, link: e.path, permission: e.permission }));
  const uiKeys = [{title: 'Sản xuất', key: 'manufacture'}, {title: 'Chất lượng', key: 'quality'}, {title: 'Thiết bị', key: 'equipment'}, {title: 'Kho', key: 'warehouse'}, {title: 'KPI', key: 'kpi'}, {title: 'Master Data', key: 'master-data'}];
  uiKeys.forEach(e=>{
    const routes = availableUI.filter(r=>r.path.includes(e.key));
    if(routes.length > 0){
      permissionUI.push({title: e.title, link: routes[0].link, permission: routes[0].permission})
    }
  });

  const logout = () => {
    window.location.href = "/logout";
  };
  const changePassword = () => {
    window.location.href = "/change-password";
  };
  return (
    <React.Fragment>
      <div className="auth-page-content">
        <Row className="justify-content-center" justify="center">
          <Col md={12} lg={12} xl={8}>
            <Card className="mt-4">
              <div className="text-center mt-2">
                <img className="mb-3 w-25" src={logo} />
                <Title level={4}>
                  CÔNG TY CỔ PHẦN THÁI BÌNH DƯƠNG XANH
                </Title>
              </div>
              <div className="p-2 mt-3">
                <Row gutter={[16, 16]}>
                  {dashboard.length > 0 && (
                    <Divider style={{ margin: 0 }}>DASHBOARD</Divider>
                  )}
                  {(dashboard ?? []).map((e, index) => {
                    // if((userProfile.permission??[]).includes('*') || (userProfile.permission??[]).includes(e.permission)){
                    return (
                      <Col span={12} key={index}>
                        <Link to={e.link}>
                          <Button type="primary" className="w-100">
                            {e.title}
                          </Button>
                        </Link>
                      </Col>
                    );
                    // }
                  })}
                </Row>
                <Row gutter={[16, 16]} className="mt-3">
                  {permissionOI.length > 0 && (
                    <Divider style={{ margin: 0 }}>OI</Divider>
                  )}
                  {(permissionOI ?? []).map((e, index) => {
                    // if((userProfile.permission??[]).includes('*') || (userProfile.permission??[]).includes(e.permission)){
                    return (
                      <Col span={12} key={index}>
                        <Link to={e.link}>
                          <Button type="primary" className="w-100">
                            {e.title}
                          </Button>
                        </Link>
                      </Col>
                    );
                    // }
                  })}
                </Row>
                <Row gutter={[16, 16]} className="mt-3">
                  {permissionUI.length > 0 && (
                    <Divider style={{ margin: 0 }}>UI</Divider>
                  )}
                  {(permissionUI ?? []).map((e, index) => {
                    // if((userProfile.permission??[]).includes('*') || (userProfile.permission??[]).includes(e.permission)){
                    return (
                      <Col span={12} key={index}>
                        <Link to={e.link}>
                          <Button type="primary" className="w-100">
                            {e.title}
                          </Button>
                        </Link>
                      </Col>
                    );
                    // }
                  })}
                </Row>
              </div>
              <Divider />
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  icon={<LogoutOutlined />}
                  onClick={logout}
                  className="w-100"
                >
                  Đăng xuất
                </Button>
                <Button
                  icon={<LockOutlined />}
                  onClick={changePassword}
                  className="w-100"
                >
                  Đổi mật khẩu
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Screen);
