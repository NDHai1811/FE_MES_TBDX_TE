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
      key: "manufacture",
      permission: "oi-sx",
    },
    {
      label: "Chất lượng",
      icon: <StarOutlined />,
      key: "quality/sx",
      permission: "oi-cl",
    },
    {
      label: "Thiết bị",
      icon: <ToolOutlined />,
      key: "equipment",
      permission: "oi-tb",
    },
    {
      label: "Kho",
      icon: <AppstoreOutlined />,
      key: "warehouse",
      permission: "oi-kho",
    },
  ];
  const location = useLocation();
  const [screen, setScreen] = useState("");
  const [selectedItem, setSelectedItem] = useState();
  useEffect(() => {
    setScreen(location.pathname.split("/")[1]);
    var current = items.find(scr=>{return scr.key.split('/').includes(screen)})
    console.log(current);
    setSelectedItem(current)
  }, [location]);
  const history = useHistory();
  const onChangeScreen = (key) => {
    history.push("/" + key);
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
            (userProfile?.permission ?? []).includes("*") ||
            (userProfile?.permission ?? []).includes(e.permission)
          )
            return (
              <div
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  display: "flex",
                  cursor: "pointer",
                  opacity: e?.key === selectedItem?.key ? 1 : 0.5,
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
