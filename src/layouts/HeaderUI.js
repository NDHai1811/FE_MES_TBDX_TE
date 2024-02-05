import { CloseOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Layout, Row, Menu, Avatar, Space, Button, Dropdown } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import logolight from "../assets/images/logo.jpg";
import { useProfile } from "../components/hooks/UserHooks";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import './layoutStyle.scss';

const items = [
  {
    label: "Sản xuất",
    key: "manufacture",
    children: [
      {
        label: "Đơn hàng",
        key: "manufacture/don-hang",
      },
      {
        label: "Thông tin buyer",
        key: "manufacture/danh-sach-buyer",
      },
      {
        label: "Thông tin layout",
        key: "manufacture/layout",
      },
      {
        label: "Kế hoạch sản xuất",
        key: "manufacture/ke-hoach-san-xuat",
      },
      {
        label: "Lịch sử sản xuất",
        key: "manufacture/lich-su-san-xuat",
      },
      {
        label: "Tạo tem",
        key: "manufacture/tao-tem",
      },
    ],

    permission: "ui-sx",
  },
  {
    label: "Chất lượng",
    key: "quality/PQC",
    // children: [
    //   {
    //     label: "PQC",
    //     key: "quality/PQC",
    //   },
    //   {
    //     label: "OQC",
    //     key: "quality/OQC",
    //   },
    // ],
    permission: "ui-cl",
  },
  {
    label: "Thiết bị",
    key: "equipment",
    children: [
      {
        label: "Lịch sử sự cố thiết bị",
        key: "equipment/thong-ke-loi",
      },
      {
        label: "Thông số thiết bị",
        key: "equipment/thong-so-may",
      },
      {
        label: "Quản lý khuôn/film",
        key: "equipment/quan-ly-khuon-film",
      },
    ],
    permission: "ui-tb",
  },
  {
    label: "Kho",
    key: "warehouse",
    children: [
      {
        label: "Quản lý kho TP",
        key: "warehouse/quan-ly-kho",
      },
      {
        label: "Quản lý kho NVL",
        key: "warehouse/quan-ly-kho-nvl",
      },
      {
        label: "Kế hoạch xuất kho",
        key: "warehouse/ke-hoach-xuat-kho",
      },
      {
        label: "Quản lý giấy cuộn",
        key: "warehouse/quan-ly-giay-cuon",
      },
    ],
    permission: "ui-kho",
  },
  {
    label: "KPI",
    key: "kpi",
    permission: "ui-kpi",
  },
  // {
  //   label: "Giám sát bất thường",
  //   key: "abnormal",
  //   children: [
  //     {
  //       label: "Kịch bản bất thường",
  //       key: "abnormal/kich-ban-bat-thuong",
  //     },
  //     {
  //       label: "Lịch sử bất thường",
  //       key: "abnormal/lich-su-bat-thuong",
  //     },
  //   ],
  //   permission: "ui-abnormal",
  // },
  {
    label: "Master Data",
    key: "master-data",
    children: [
      {
        label: "Danh sách công đoạn",
        key: "master-data/cong-doan",
      },
      // {
      //   label: "Khách hàng",
      //   key: "master-data/customer",
      // },
      {
        label: "Máy và NVL",
        children: [
          {
            label: "Danh sách máy",
            key: "master-data/may",
          },
          // {
          //   label: "Spec sản phẩm",
          //   key: "master-data/spec-product",
          // },
          {
            label: "Nguyên vật liệu",
            key: "master-data/material",
          },

          {
            label: "Khuôn",
            key: "master-data/khuon",
          },
          // {
          //   label: "JIG",
          //   key: "master-data/jig",
          // },
        ],
      },

      {
        label: "Lỗi",
        children: [
          {
            label: "Danh sách lỗi",
            key: "master-data/errors",
          },
          {
            label: "Danh sách chỉ tiêu kiểm tra",
            key: "master-data/test_criteria",
          },
          {
            label: "Lỗi máy",
            key: "master-data/error-machines",
          },
        ],
      },

      {
        label: "Tổ chức",
        children: [
          {
            label: "Danh sách tài khoản",
            key: "master-data/users",
          },
          {
            label: "Bộ phận",
            key: "master-data/roles",
          },
          {
            label: "Quyền",
            key: "master-data/permissions",
          },
        ],
      },
      {
        label: "Kho",
        children: [
          {
            label: "Kho",
            key: "master-data/warehouse",
          },
          {
            label: "Vị trí kho",
            key: "master-data/cell",
          },
        ],
      },
      {
        label: "Bảo trì bảo dưỡng",
        key: "master-data/maintenance",
      },
      // {
      //   label: "Quản lý xe",
      //   key: "master-data/vehicle",
      // },
    ],
    permission: "master",
  },
];
const HeaderUI = () => {
  const { userProfile } = useProfile();
  const [clock, setClock] = useState(new Date());
  useEffect(() => {
    setInterval(() => tick(), 1000);
  }, []);
  const tick = () => {
    setClock(new Date());
  };

  const [ui, setUI] = useState(window.location.pathname.split("/ui/")[1]);
  const history = useHistory();
  const selectMenu = (key) => {
    let r = "/ui/" + key.key;
    history.push(r);
    // setUI(key.key);
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
              defaultSelectedKeys={[ui]}
              selectedKeys={[window.location.pathname.split("/ui/")[1]]}
              style={{
                // width: '100%',
                // height: '100%',
                alignItems: "center",
                background: "#2462a3",
                color: "#fff",
                fontWeight: "600",
              }}
              items={items.filter(
                (e) =>
                  (userProfile?.permission ?? []).includes("*") ||
                  (userProfile?.permission ?? []).includes(e.permission)
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
