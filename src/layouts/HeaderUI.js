import { CloseOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Layout, Row, Menu, Avatar, Space, Button, Dropdown } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import logolight from "../assets/images/logo.jpg";
import { useProfile } from "../components/hooks/UserHooks";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import './layoutStyle.scss';
import { authProtectedRoutes } from "../routes/allRoutes";
const HeaderUI = () => {
  const { userProfile } = useProfile();
  const uiRoutes = authProtectedRoutes.filter(e => e?.path.includes('ui/') && e?.label && (userProfile?.username === 'admin' || userProfile?.permission?.includes(e?.permission))).map(e => ({ ...e, label: e?.label, key: e.path }));
  const masterDataSubMenu = [];
  [
    {
      label: "Sản xuất",
      key: 'master-data/san-xuat',
    },
    {
      label: "Tổ chức",
      key: 'master-data/to-chuc',
    },
    {
      label: "Kho",
      key: 'master-data/kho',
    },

    {
      label: "Bảo trì",
      key: 'master-data/bao-tri',
    },
  ].map(e => {
    const routes = uiRoutes.filter(r => r.path.includes(e.key));
    if (routes.length > 0) {
      masterDataSubMenu.push({ label: e.label, children: routes})
    }
  })
  const items = [
    {
      label: "Sản xuất",
      key: "manufacture",
      children: uiRoutes.filter(e => e?.path.includes('manufacture')),
      permission: "ui-sx",
      hidden: uiRoutes.filter(e => e?.path.includes('manufacture')).length > 0 ? false : true
    },
    {
      label: "Chất lượng",
      key: "quality",
      permission: "ui-cl",
      children: uiRoutes.filter(e => e?.path.includes('quality')),
      hidden: uiRoutes.filter(e => e?.path.includes('quality')).length > 0 ? false : true
    },
    {
      label: "Thiết bị",
      key: "equipment",
      children: uiRoutes.filter(e => e?.path.includes('equipment')),
      permission: "ui-tb",
      hidden: uiRoutes.filter(e => e?.path.includes('equipment')).length > 0 ? false : true
    },
    {
      label: "Kho",
      key: "warehouse",
      children: uiRoutes.filter(e => e?.path.includes('warehouse')),
      permission: "ui-kho",
      hidden: uiRoutes.filter(e => e?.path.includes('warehouse')).length > 0 ? false : true
    },
    {
      label: "KPI",
      key: "kpi",
      children: uiRoutes.filter(e => e?.path.includes('kpi')),
      permission: "ui-kpi",
      hidden: uiRoutes.filter(e => e?.path.includes('kpi')).length > 0 ? false : true
    },
    {
      label: "Master Data",
      key: "master-data",
      hidden: uiRoutes.filter(e => e?.path.includes('kpi')).length > 0 ||
        uiRoutes.filter(e => e?.path.includes('master-data/san-xuat')).length > 0 ||
        uiRoutes.filter(e => e?.path.includes('master-data/to-chuc')).length > 0 ||
        uiRoutes.filter(e => e?.path.includes('master-data/kho')).length > 0 ||
        uiRoutes.filter(e => e?.path.includes('master-data/bao-tri')).length > 0
        ? false : true,
      children: masterDataSubMenu,
      permission: "master-data",
    },
  ];
  const [clock, setClock] = useState(new Date());
  useEffect(() => {
    setInterval(() => tick(), 1000);
  }, []);
  const tick = () => {
    setClock(new Date());
  };

  const history = useHistory();
  const selectMenu = (item) => {
    let r = item.key;
    history.push(r);
  };

  const logout = () => {
    window.location.href = "/logout";
  };
  const itemsDropdown = [
    {
      key: "1",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: () => logout(),
    },
  ];
  return (
    <React.Fragment>
      <Layout
        style={{
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#2462A3",
          paddingLeft: "10px",
          paddingRight: "10px",
          paddingTop: "3px",
          paddingBottom: "3px",
        }}
        className="fixed-header"
      >
        <Row style={{ alignItems: "center" }}>
          <Col span={4}>
            <div className="demo-logo" style={{ display: "flex" }}>
              <img
                style={{ height: "3.5em", margin: "auto 0" }}
                src={logolight}
              />
            </div>
          </Col>
          <Col span={14}>
            <Menu
              mode="horizontal"
              selectedKeys={[window.location.pathname]}
              style={{
                // width: '100%',
                // height: '100%',
                alignItems: "center",
                background: "#2462a3",
                color: "#fff",
                fontWeight: "600",
              }}
              items={items.filter(
                (e) => !e?.hidden
                // (userProfile?.permission ?? []).includes("*") ||
                // (userProfile?.permission ?? []).includes(e.permission)
              )}
              onSelect={selectMenu}
            />
          </Col>
          <Col
            span={6}
            className="text-end align-items-center d-flex justify-content-end"
          >
            <Dropdown
              menu={{ items: itemsDropdown }}
              placement="bottomRight"
              arrow
              trigger={"click"}
            >
              <Button
                type="text"
                style={{
                  float: "right",
                  color: "white",
                  paddingRight: "10px",
                  alignContent: "center",
                  display: "flex",
                }}
                className="h-100"
              >
                <div style={{ textAlign: "center" }}>
                  {userProfile?.name ?? "User name"}
                  <div>
                    {clock.toLocaleString(["en-GB"], { hour12: false })}
                  </div>
                </div>
                <Avatar
                  size="large"
                  style={{ backgroundColor: "white", marginLeft: "10px" }}
                  src={userProfile?.avatar}
                  icon={<UserOutlined style={{ color: "black" }} />}
                ></Avatar>
              </Button>
            </Dropdown>
            <Link to={"/screen"} style={{ margin: "auto 0" }}>
              <CloseOutlined
                className="text-white"
                style={{ fontSize: "1.4em" }}
              />
            </Link>
          </Col>
        </Row>
      </Layout>
    </React.Fragment>
  );
};

export default HeaderUI;
