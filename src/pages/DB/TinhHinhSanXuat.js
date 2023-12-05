import React, { useState, useEffect } from "react";
import { Layout, Table, Col, Row } from "antd";
import ReactFullscreen from "react-easyfullscreen";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import { getProductFMB } from "../../api/db/main";
import "./THSX.css";

const colTable = [
  {
    title: "CÔNG ĐOẠN",
    dataIndex: "cong_doan",
    key: "cong_doan",
    align: "center",
  },
  {
    title: "KẾ HOẠCH CA",
    dataIndex: "ke_hoach_ca",
    key: "ke_hoach_ca",
    align: "center",
  },
  {
    title: "MỤC TIÊU HIỆN TẠI",
    dataIndex: "muc_tieu_hien_tai",
    key: "muc_tieu_hien_tai",
    align: "center",
  },
  {
    title: "SẢN LƯỢNG HIỆN TẠI",
    dataIndex: "sl_hien_tai",
    key: "sl_hien_tai",
    align: "center",
  },
  {
    title: "TỈ LỆ %",
    dataIndex: "ti_le_ht",
    key: "ti_le_ht",
    align: "center",
    render: (value) => `${value}%`,
  },
  {
    title: "Đánh giá",
    dataIndex: "ti_le_ht",
    key: "ti_le_ht",
    render: (value) => {
      let color = "";
      if (value < 90) {
        color = "red";
      } else if (value >= 90 && value < 95) {
        color = "yellow";
      } else if (value >= 95) {
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
              height: 60,
              width: 60,
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

const mockData = [
  {
    cong_doan: "SÓNG",
    ke_hoach_ca: "1500",
    muc_tieu_hien_tai: "1000",
    sl_hien_tai: "900",
    ti_le_ht: 90,
  },
  {
    cong_doan: "IN",
    ke_hoach_ca: "1500",
    muc_tieu_hien_tai: "1000",
    sl_hien_tai: "950",
    ti_le_ht: 95,
  },
  {
    cong_doan: "DÁN",
    ke_hoach_ca: "1500",
    muc_tieu_hien_tai: "1000",
    sl_hien_tai: "850",
    ti_le_ht: 85,
  },
];

const TinhHinhSanXuat = () => {
  // const history = useHistory();
  const [isFullCreen, setIsFullScreen] = useState(false);
  const [clock, setClock] = useState(new Date());
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
  const tick = () => {
    setClock(new Date());
  };

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
              {isFullCreen == false ? (
                <FullscreenOutlined
                  style={{ fontSize: "30px" }}
                  onClick={() => {
                    onRequest();
                    setIsFullScreen(true);
                  }}
                />
              ) : (
                <FullscreenExitOutlined
                  style={{ fontSize: "30px" }}
                  onClick={() => {
                    onExit();
                    setIsFullScreen(false);
                  }}
                />
              )}
            </Row>
            <Row style={{ padding: "15px", height:'100%' }} gutter={[8, 8]}>
              <Col span={24} style={{height:'100%'}}>
                <Table
                  className="mt-3 table-db"
                  bordered
                  pagination={false}
                  scroll={{ x: "100%", y: "100vh" }}
                  columns={colTable}
                  dataSource={mockData}
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
