import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import Model from "./Model";
import CameraController from "./CameraController";
// import { Tree } from "antd";

// const treeData = [
//   {
//     title: "Parent 1",
//     key: "0-0",
//     children: [
//       {
//         title: "Child 1",
//         key: "0-0-0",
//       },
//       {
//         title: "Child 2",
//         key: "0-0-1",
//       },
//     ],
//   },
// ];

const GiaoDienDaChieu = () => {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      {/* <Tree.DirectoryTree defaultExpandAll treeData={treeData} /> */}
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
  );
};

export default GiaoDienDaChieu;
