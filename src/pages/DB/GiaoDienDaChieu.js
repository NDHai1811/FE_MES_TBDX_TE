import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "react-three-fiber";
import Model from "./Model";
import CameraController from "./CameraController";
import { Tree, Col, List, Layout, Row } from "antd";
import ReactFullscreen from "react-easyfullscreen";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";

const treeData = [
  {
    title: "Data 0",
    key: "0-0",
    children: [
      {
        title: "Data 0-1",
        key: "0-1",
        isLeaf: true,
      },
      {
        title: "Data 0-2",
        key: "0-2",
        isLeaf: true,
      },
      {
        title: "Data 0-3",
        key: "0-3",
        isLeaf: true,
      },
    ],
  },
  {
    title: "Data 1",
    key: "1-0",
    children: [
      {
        title: "Data 1-1",
        key: "1-1",
        isLeaf: true,
      },
      {
        title: "Data 1-2",
        key: "1-2",
        isLeaf: true,
      },
    ],
  },
  {
    title: "Data 2",
    key: "2-0",
    children: [
      {
        title: "Data 2-1",
        key: "2-1",
        isLeaf: true,
      },
      {
        title: "Data 2-2",
        key: "2-2",
        isLeaf: true,
      },
    ],
  },
];

const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
];

const GiaoDienDaChieu = () => {
  const [clock, setClock] = useState(new Date());
  const [isFullCreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => tick(), 1000);
    return clearInterval(interval);
  }, []);

  const tick = () => {
    setClock(new Date());
  };
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
                GIAO DIỆN 3D
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
            <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
              <Col span={3} style={{ backgroundColor: "white" }}>
                <Tree
                  checkable
                  defaultExpandedKeys={["0-0-0", "0-0-1"]}
                  defaultSelectedKeys={["0-0-0", "0-0-1"]}
                  defaultCheckedKeys={["0-0-0", "0-0-1"]}
                  treeData={treeData}
                />
              </Col>
              <Col span={18}>
                <Canvas style={{ width: "100vw", height: "100vh" }}>
                  <Suspense fallback={null}>
                    <ambientLight intensity={1} />
                    <color attach="background" args={["#6c757d"]} />
                    <Model
                      objPath="/assets/machine1.obj"
                      mtlPath="/assets/machine1.mtl"
                      position={[30, 0, -30]}
                      scale={0.1}
                    />
                    <Model
                      objPath="/assets/machine2.obj"
                      mtlPath="/assets/machine2.mtl"
                      position={[30, 0, -10]}
                      scale={0.1}
                    />
                    <Model
                      objPath="/assets/machine3.obj"
                      mtlPath="/assets/machine3.mtl"
                      position={[50, 0, -60]}
                      scale={0.1}
                    />
                    <Model
                      objPath="/assets/machine4.obj"
                      mtlPath="/assets/machine4.mtl"
                      position={[30, 0, -95]}
                      scale={0.1}
                    />
                    <Model
                      objPath="/assets/may-song.obj"
                      mtlPath="/assets/may-song.mtl"
                      position={[0, 0, -5]}
                      scale={1.1}
                    />
                    <Model
                      objPath="/Layout.obj"
                      mtlPath="/Layout.mtl"
                      position={[0, 0, 0]}
                      scale={1.1}
                    />
                  </Suspense>
                  <CameraController />
                </Canvas>
              </Col>
              <Col span={3} style={{ backgroundColor: "white" }}>
                <List
                  itemLayout="horizontal"
                  dataSource={data}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        title={<a href="https://ant.design">{item.title}</a>}
                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                      />
                    </List.Item>
                  )}
                  style={{ marginLeft: 8 }}
                />
              </Col>
            </div>
          </Layout>
        )}
      </ReactFullscreen>
    </React.Fragment>
  );
};

export default GiaoDienDaChieu;
