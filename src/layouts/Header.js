import { CloseOutlined } from "@ant-design/icons";
import { Col, Layout, Row } from "antd";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import logolight from "../assets/images/logo.jpg";
import { useEffect } from "react";
const Header = () => {
  const location = useLocation();
  const [title, setTitle] = useState("");

  useEffect(() => {
    if(window.location.pathname.includes('manufacture')){
      setTitle("Quản lý sản xuất");
    }
    else if(window.location.pathname.includes('quality')){
      setTitle("Quản lý chất lượng");
    }
    else if(window.location.pathname.includes('equipment')){
      setTitle("Quản lý thiết bị");
    }
    else if(window.location.pathname.includes('kho-nvl')){
      setTitle("Quản lý Kho NVL");
    }
    else if(window.location.pathname.includes('kho-tp')){
      setTitle("Quản lý Kho TP");
    }
  }, [location]);

  return (
    <React.Fragment>
      <Layout
        style={{
          zIndex: 10,
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#0454a2",
          paddingLeft: "5px",
          paddingRight: "5px",
        }}
      >
        <Row gutter={10}>
          <Col span={5} style={{ display: "flex", padding: "0px" }}>
            <img
              style={{ height: "3.5em", margin: "auto 0" }}
              src={logolight}
            />
          </Col>
          <Col
            span={16}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h4 className="text-white mb-0">{title.toLocaleUpperCase()}</h4>
          </Col>
          <Col
            span={3}
            className="text-end align-items-center d-flex justify-content-end"
          >
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

export default Header;
