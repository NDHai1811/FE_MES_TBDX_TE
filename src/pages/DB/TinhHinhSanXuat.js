import React, { useState, useEffect } from "react";
import { Layout, Table, Col, Row } from "antd";
import ReactFullscreen from "react-easyfullscreen";
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { getProductFMB } from "../../api/db/main";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "./THSX.css";

const colTable = [
  {
    title: "CÔNG ĐOẠN",
    dataIndex: "cong_doan",
    key: "cong_doan",
    align: "center",
    render: (text) => <div style={{ fontSize: "70px" }}>{text}</div>,
  },
  {
    title: "KẾ HOẠCH CA",
    dataIndex: "ke_hoach_ca",
    key: "ke_hoach_ca",
    align: "center",
    render: (text) => <div style={{ fontSize: "70px" }}>{text}</div>,
  },
  {
    title: "MỤC TIÊU HIỆN TẠI",
    dataIndex: "sl_muc_tieu",
    key: "sl_muc_tieu",
    align: "center",
    render: (text) => <div style={{ fontSize: "70px" }}>{text}</div>,
  },
  {
    title: "SẢN LƯỢNG HIỆN TẠI",
    dataIndex: "sl_hien_tai",
    key: "sl_hien_tai",
    align: "center",
    render: (text) => <div style={{ fontSize: "70px" }}>{text}</div>,
  },
  {
    title: "TỈ LỆ %",
    dataIndex: "ti_le",
    key: "ti_le",
    align: "center",
    render: (text) => <div style={{ fontSize: "70px" }}>{`${text || 0}%`}</div>,
  },
  {
    title: "Đánh giá",
    dataIndex: "status",
    key: "status",
    render: (value) => {
      let color = "";
      if (value === 3) {
        color = "red";
      } else if (value === 2) {
        color = "yellow";
      } else if (value === 1) {
        color = "green";
      }
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              height: 100,
              width: 100,
              backgroundColor: color,
              borderRadius: "50%",
            }}
          />
        </div>
      );
    },
    align: "center",
  },
];

const TinhHinhSanXuat = () => {
  // const history = useHistory();
  const [isFullCreen, setIsFullScreen] = useState(false);
  const [clock, setClock] = useState(new Date());
  const tick = () => {
    setClock(new Date());
  };
  useEffect(() => {
    setInterval(() => tick(), 1000);
    (async () => {
      const res1 = await getProductFMB();
      setDataTable(
        res1.data.map((e) => {
          return { ...e };
        })
      );
    })();
  }, []);

  const [dataTable, setDataTable] = useState([]);
  // useEffect(() => {
  //   let interval;
  //   interval = setInterval(() => {
  //     (async () => {
  //       const res1 = await getProductFMB();
  //       setDataTable(
  //         res1.data.map((e) => {
  //           return { ...e };
  //         })
  //       );
  //     })();
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {
  //     interval = setInterval(async () => {
  //       history.push('/dashboard/canh-bao-bat-thuong');
  //     }, 30000);
  //     return () => clearInterval(interval1);
  // }, []);

  return (
    <React.Fragment>
      <ReactFullscreen>
        {({ ref, onRequest, onExit }) => (
          <Layout
            ref={ref}
            style={{ height: "100vh", backgroundColor: "#e3eaf0" }}
          >
            <Row
              className="w-100"
              style={{
                verticalAlign: "center",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                backgroundColor: "#2462a3",
                color: "white",
              }}
            >
              <div
                style={{
                  fontSize: "2em",
                  fontWeight: "700",
                  lineHeight: "2.2em",
                }}
              >
                {clock.toLocaleString(["en-GB"], { hour12: false })}
              </div>
              <div style={{ fontWeight: 700, fontSize: "3em" }}>
                TÌNH HÌNH SẢN XUẤT
              </div>
              <div>
                {isFullCreen ? (
                  <FullscreenExitOutlined
                    style={{ fontSize: "30px" }}
                    onClick={() => {
                      if (isFullCreen) onExit();
                      setIsFullScreen(false);
                    }}
                  />
                ) : (
                  <FullscreenOutlined
                    style={{ fontSize: "30px" }}
                    onClick={() => {
                      onRequest();
                      setIsFullScreen(true);
                    }}
                  />
                )}
                <Link to={"/screen"} style={{ margin: "auto 0" }}>
                  <CloseOutlined
                    className="text-white"
                    style={{
                      fontSize: "30px",
                      marginLeft: 24,
                      marginRight: 12,
                    }}
                  />
                </Link>
              </div>
            </Row>
            <Row style={{ padding: "15px", height: "100%" }} gutter={[8, 8]}>
              <Col span={24} style={{ height: "100%" }}>
                <Table
                  className="mt-3 table-db"
                  bordered
                  pagination={false}
                  scroll={{ x: "100%", y: "100vh" }}
                  columns={colTable}
                  dataSource={dataTable}
                />
              </Col>
            </Row>
          </Layout>
        )}
      </ReactFullscreen>
    </React.Fragment>
  );
};

export default TinhHinhSanXuat;
