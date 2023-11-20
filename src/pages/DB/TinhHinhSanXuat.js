import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Layout, Table, Tag, Col, Row } from "antd";
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
    title: "TÊN SẢN PHẨM",
    dataIndex: "product",
    key: "product",
    align: "center",
  },
  {
    title: "SL KẾ HOẠCH",
    dataIndex: "sl_dau_ra_kh",
    key: "sl_dau_ra_kh",
    align: "center",
  },
  {
    title: "MỤC TIÊU",
    dataIndex: "sl_muc_tieu",
    key: "sl_muc_tieu",
    align: "center",
  },
  {
    title: "SL THỰC TẾ",
    dataIndex: "sl_thuc_te",
    key: "sl_thuc_te",
    align: "center",
  },
  {
    title: "TỈ LỆ HOÀN THÀNH",
    dataIndex: "ti_le_ht",
    key: "ti_le_ht",
    align: "center",
  },
  {
    title: "TỈ LỆ NG",
    dataIndex: "ti_le_ng",
    key: "ti_le_ng",
    align: "center",
  },
  {
    title: "TÌNH TRẠNG",
    dataIndex: "status",
    key: "status",
    render: (value) => {
      if (value == "1")
        return (
          <Tag color={"orange"} className="bd-custom">
            VÀO HÀNG
          </Tag>
        );
      else if (value == "2")
        return (
          <Tag color={"blue"} className="bd-custom">
            SẢN XUẤT
          </Tag>
        );
      else if (value == "3")
        return (
          <Tag color={"green"} className="bd-custom">
            HOÀN THÀNH
          </Tag>
        );
      else return <Tag color="#929292">Ko có K.Hoạch</Tag>;
    },
    align: "center",
  },
];

const TinhHinhSanXuat = () => {
  const history = useHistory();
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
  let interval;
  useEffect(() => {
    interval = setInterval(() => {
      (async () => {
        const res1 = await getProductFMB();
        setDataTable(
          res1.data.map((e) => {
            return { ...e };
          })
        );
      })();
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  var interval1;
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
            <Row style={{ padding: "15px" }} gutter={[8, 8]}>
              <Col span={24}>
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
