import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "./Model";

const GiaoDienDaChieu = () => {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <Suspense fallback={null}>
        <ambientLight intensity={1} />
        <Model
          objPath="/assets/machine1.obj"
          mtlPath="/assets/machine1.mtl"
          position={[30, 0, -10]}
          scale={0.1}
        />
        <Model
          objPath="/assets/machine2.obj"
          mtlPath="/assets/machine2.mtl"
          position={[30, 0, 10]}
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
          position={[30, 0, -100]}
          scale={0.1}
        />
        <Model
          objPath="/assets/may-song.obj"
          mtlPath="/assets/may-song.mtl"
          position={[0, 0, 0]}
          scale={1.1}
        />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

export default GiaoDienDaChieu;
