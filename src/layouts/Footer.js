import {
  AppstoreOutlined,
  ControlOutlined,
  MailOutlined,
  SettingOutlined,
  StarOutlined,
  ToolOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import { Button, Menu, Layout } from "antd";
import React, { useEffect, useState } from "react";
import {
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { useProfile } from "../components/hooks/UserHooks";

const Footer = () => {
  const { userProfile } = useProfile();
  const items = [
    {
      label: "Sản xuất",
      icon: <ControlOutlined />,
      key: "/oi/manufacture",
      permission: "oi-manufacture",
    },
    {
      label: "Chất lượng (IQC)",
      icon: <StarOutlined />,
      key: "/oi/quality/iqc",
      permission: "oi-quality-iqc",
    },
    {
      label: "Chất lượng (SX)",
      icon: <StarOutlined />,
      key: "/oi/quality/machine",
      permission: "oi-quality-machine-iot",
    },
    {
      label: "Thiết bị",
      icon: <ToolOutlined />,
      key: "/oi/equipment",
      permission: "oi-equipment",
    },
    {
      label: "Kho NVL",
      icon: <AppstoreOutlined />,
      key: "/oi/warehouse/kho-nvl",
      permission: "oi-warehouse-nvl",
    },
    {
      label: "Kho TP",
      icon: <AppstoreOutlined />,
      key: "/oi/warehouse/kho-tp",
      permission: "oi-warehouse-tp",
    },
  ];
  const history = useHistory();
  const onChangeScreen = (key) => {
    history.push(key);
  };

  return (
    <React.Fragment>
      <Layout.Footer
        style={{
          position: "fixed",
          bottom: "0",
          display: "flex",
          justifyContent: "space-around",
          padding: 8,
          backgroundColor: "#0454a2",
          color: "white",
          width: "100%",
          borderRadius: "15px 15px 0 0",
          zIndex: 999,
        }}
      >
        {items.map((e) => {
          if (
            userProfile?.username === 'admin' ||
            (userProfile?.permission ?? []).includes(e.permission)
          )
            return (
              <div
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  display: "flex",
                  cursor: "pointer",
                  opacity: window.location.pathname.includes(e.key) ? 1 : 0.5,
                }}
                onClick={() => onChangeScreen(e.key)}
              >
                {e.icon}
                {e.label}
              </div>
            );
        })}
      </Layout.Footer>
    </React.Fragment>
  );
};

export default Footer;
