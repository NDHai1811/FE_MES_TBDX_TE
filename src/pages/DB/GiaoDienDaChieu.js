import React, { Suspense, useEffect, useState } from "react";
import { Canvas, useThree } from "react-three-fiber";
import Model from "./Model";
import CameraController from "./CameraController";
import { Col, List, Layout, Row, Divider } from "antd";
// import ReactFullscreen from "react-easyfullscreen";
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { GridHelper } from "three";
import ModalDetail from "./ModalDetail";
import { Sprite, TextureLoader, SpriteMaterial } from "three";

import warning1 from "../../assets/images/sxtt.png";
import warning2 from "../../assets/images/cllt.png";

const WarningPin = ({ position, warningImage }) => {
  const { scene } = useThree();
  const texture = new TextureLoader().load(warningImage);
  const spriteMaterial = new SpriteMaterial({ map: texture });
  const sprite = new Sprite(spriteMaterial);
  sprite.position.set(...position);
  sprite.scale.set(10, 10, 1);
  scene.add(sprite);
  return null;
};

function Grid({ position }) {
  const { scene } = useThree();
  const grid = new GridHelper(10000, 2500);
  grid.position.set(...position);
  scene.add(grid);
  return null;
}

const modelPositions = [
  [30, 0, -30],
  [30, 0, -10],
  [50, 0, -60],
  [30, 0, -95],
  [0, 0, -5],
  [0, 0, 0],
];

const averagePosition = modelPositions
  .reduce((acc, pos) => acc.map((val, i) => val + pos[i]), [0, 0, 0])
  .map((val) => val / modelPositions.length);

// const treeData = [
//   {
//     title: "Sóng",
//     key: "0-0",
//   },
//   {
//     title: "In",
//     key: "1-0",
//     children: [
//       {
//         title: "Máy in P.06",
//         key: "1-1",
//         isLeaf: true,
//       },
//       {
//         title: "Máy in P.16",
//         key: "1-2",
//         isLeaf: true,
//       },
//     ],
//   },
//   {
//     title: "Dán",
//     key: "2-0",
//     children: [
//       {
//         title: "Máy dán D.05",
//         key: "2-1",
//         isLeaf: true,
//       },
//       {
//         title: "Máy dán D.06",
//         key: "2-2",
//         isLeaf: true,
//       },
//     ],
//   },
// ];

const data = [
  {
    title: "Cảnh báo sản xuất",
  },
  {
    title: "Cảnh báo chất lượng",
  },
  {
    title: "Cảnh báo sản xuất",
  },
  {
    title: "Cảnh báo chất lượng",
  },
];

const GiaoDienDaChieu = () => {
  const [clock, setClock] = useState(new Date());
  const [isFullCreen, setIsFullScreen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => tick(), 1000);
    return clearInterval(interval);
  }, []);

  const tick = () => {
    setClock(new Date());
  };
  function fullscreenSwitch() {
    var element = document.documentElement;
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    } else {
      if (element.requestFullScreen) {
        element.requestFullScreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      }
    }
  }
  return (
    <React.Fragment>
      {/* <ReactFullscreen> */}
      <Layout


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
          <div>
            {isFullCreen ? (
              <FullscreenExitOutlined
                style={{ fontSize: "30px" }}
                onClick={() => {
                  if (isFullCreen) fullscreenSwitch();
                  setIsFullScreen(false);
                }}
              />
            ) : (
              <FullscreenOutlined
                style={{ fontSize: "30px" }}
                onClick={() => {
                  fullscreenSwitch();
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
        <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
          {/* <Col span={3} style={{ backgroundColor: "white" }}>
                <Divider>Tổ chức</Divider>
                <Tree
                  checkable
                  defaultExpandedKeys={["0-0-0", "0-0-1"]}
                  defaultSelectedKeys={["0-0-0", "0-0-1"]}
                  defaultCheckedKeys={["0-0-0", "0-0-1"]}
                  treeData={treeData}
                />
              </Col> */}
          <Col span={21}>
            <Canvas
              style={{
                position: "fixed",
                width: "100%",
                height: "100%",
              }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={1} />
                <color attach="background" args={["#ffffff"]} />
                <Grid position={averagePosition} />
                <Model
                  objPath="/assets/machine1.obj"
                  mtlPath="/assets/machine1.mtl"
                  position={[35, 0, -5]}
                  scale={0.1}
                  onClick={() =>
                    setSelectedModel("Máy in-chạp-bế 5 màu (P6)")
                  }
                />
                <WarningPin
                  position={[35, 5, -10]}
                  warningImage={warning1}
                />
                <Model
                  objPath="/assets/machine2.obj"
                  mtlPath="/assets/machine2.mtl"
                  position={[35, 0, -35]}
                  scale={0.1}
                  onClick={() =>
                    setSelectedModel("Máy in-chạp-bế 5 màu (P15)")
                  }
                />
                <WarningPin
                  position={[35, 5, -55]}
                  warningImage={warning2}
                />
                <Model
                  objPath="/assets/machine3.obj"
                  mtlPath="/assets/machine3.mtl"
                  position={[10, 0, -35]}
                  scale={0.1}
                  onClick={() => setSelectedModel("Máy dán tự động (D05)")}
                />
                <WarningPin
                  position={[2, 5, -55]}
                  warningImage={warning2}
                />
                <Model
                  objPath="/assets/machine4.obj"
                  mtlPath="/assets/machine4.mtl"
                  position={[10, 0, -80]}
                  scale={0.1}
                  onClick={() => setSelectedModel("Máy dán tự động (D06)")}
                />
                <WarningPin
                  position={[5, 5, -95]}
                  warningImage={warning1}
                />
                <Model
                  objPath="/assets/may-song.obj"
                  mtlPath="/assets/may-song.mtl"
                  position={[75, 0, -5]}
                  scale={1.1}
                  onClick={() =>
                    setSelectedModel("Dây chuyền máy dợn sóng 7 lớp")
                  }
                />
                <WarningPin
                  position={[75, 5, -2]}
                  warningImage={warning1}
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
            <Divider>Danh sách cảnh báo</Divider>
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description="Nội dung cảnh báo bất thường"
                  />
                </List.Item>
              )}
              style={{ marginLeft: 8 }}
            />
          </Col>
        </div>
      </Layout>
      {/* </ReactFullscreen> */}
      <ModalDetail
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
    </React.Fragment>
  );
};

export default GiaoDienDaChieu;
