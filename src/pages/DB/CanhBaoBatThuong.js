import React, { useState, useEffect } from "react";
import { Layout, Col, Row } from "antd";
import ReactFullscreen from "react-easyfullscreen";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import background1 from "../../assets/images/layout8.png";
import CommentBox from "../../components/CommentBox";
import { getMonitor } from "../../api/db/main";
import "./style.css";

const img = {
  width: "100vw",
  display: "flex",
  height: "100vh",
};
const CanhBaoBatThuong = () => {
  const [isFullCreen, setIsFullScreen] = useState(false);
  const [clock, setClock] = useState(new Date());
  const tick = () => {
    setClock(new Date());
  };
  useEffect(() => {
    setInterval(() => tick(), 1000);
  }, []);
  const [demoMonitor, setDemoMonitor] = useState();
  const hanleGetMonitorSeparate = async () => {
    var res = await getMonitor();
    setDemoMonitor(res.data);
  };
  useEffect(() => {
    hanleGetMonitorSeparate();
  }, []);
  let interval1;
  useEffect(() => {
    interval1 = setInterval(async () => {
      hanleGetMonitorSeparate();
    }, 5000);
    return () => clearInterval(interval1);
  }, []);

  const listMC = [
    {
      code: "GL_637CIR",
      type: "cl",
      top: "13vh",
      left: "23vw",
    },
    {
      code: "GL_637CIR",
      type: "sx",
      top: "28vh",
      left: "6vw",
    },
    {
      code: "GL_637CIR",
      type: "tb",
      top: "19vh",
      left: "14vw",
    },
    {
      code: "SN_UV",
      type: "sx",
      top: "33vh",
      left: "27vw",
    },
    {
      code: "SN_UV",
      type: "tb",
      top: "32vh",
      left: "35vw",
    },
    {
      code: "MK1060MF",
      type: "sx",
      top: "36vh",
      left: "42vw",
    },
    {
      code: "MK1060MF",
      type: "tb",
      top: "31vh",
      left: "50vw",
    },
    {
      code: "ACE70CS",
      type: "sx",
      top: "47vh",
      left: "59vw",
    },
    {
      code: "ACE70CS",
      type: "cl",
      top: "30vh",
      left: "75vw",
    },
    {
      code: "ACE70CS",
      type: "tb",
      top: "38vh",
      left: "66vw",
    },
  ];

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
              <div style={{ fontSize: "22px", fontWeight: "700" }}>
                {clock.toLocaleString(["en-GB"], { hour12: false })}
              </div>
              <div style={{ fontWeight: 700, fontSize: "24px" }}>
                GIÁM SÁT CẢNH BÁO BẤT THƯỜNG
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
            <Row style={{ width: "100%", height: "80vh" }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  backgroundColor: "white",
                  float: "right",
                }}
              >
                {demoMonitor?.length > 0 ? (
                  demoMonitor.map((value) => {
                    return (
                      <CommentBox
                        title={value?.type?.toUpperCase()}
                        content={value?.content}
                        type={
                          value?.type === "sx"
                            ? "error"
                            : value?.type === "cl"
                            ? "warning"
                            : "success"
                        }
                        color={
                          value?.type === "sx"
                            ? "#90f"
                            : value?.type === "cl"
                            ? "#AA0000"
                            : "#00f"
                        }
                        top={
                          listMC.find(
                            (val) =>
                              val.code === value?.machine_id &&
                              val.type === value.type
                          )?.top
                        }
                        left={
                          listMC.find(
                            (val) =>
                              val.code == value?.machine_id &&
                              val.type === value.type
                          )?.left
                        }
                      ></CommentBox>
                    );
                  })
                ) : (
                  <></>
                )}
                <img style={img} src={background1} />
              </div>
            </Row>
          </Layout>
        )}
      </ReactFullscreen>
    </React.Fragment>
  );
};

export default CanhBaoBatThuong;
