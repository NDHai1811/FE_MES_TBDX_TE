import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Dropdown, Row, Space, Badge } from "antd";
import React, { useEffect, useState } from "react";
import { useProfile } from "../components/hooks/UserHooks";
import { getStatusIOT } from "../api";

const UserCard = () => {
  const { userProfile } = useProfile();
  const [clock, setClock] = useState(new Date());
  const [color, setColor] = useState("red");
  useEffect(() => {
    setInterval(() => tick(), 1000);
  }, []);
  const tick = () => {
    setClock(new Date());
  };
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
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
  var interval;
  return (
    <React.Fragment>
      <div className="justify-content-between d-flex w-100 mt-1 align-content-center flex-wrap">
        <Dropdown
          menu={{ items: itemsDropdown }}
          placement="bottomLeft"
          arrow
          trigger={"click"}
        >
          <Button type="text" className="h-100 p-0" size="large">
            <Space>
              <Avatar
                src={userProfile?.avatar}
                icon={<UserOutlined />}
              ></Avatar>
              <span>{userProfile?.name ?? ""}</span>
            </Space>
          </Button>
        </Dropdown>
        <div className="align-content-center d-flex flex-wrap">
          {clock.toLocaleString(["en-GB"], { hour12: false })}{" "}
        </div>
      </div>
    </React.Fragment>
  );
};
export default UserCard;
