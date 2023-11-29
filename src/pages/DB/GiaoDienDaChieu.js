import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import Model from "./Model";

const GiaoDienDaChieu = () => {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
        <Model
          objPath="/assets/machine2.obj"
          mtlPath="/assets/machine2.mtl"
          position={[30, 0, 10]}
          scale={0.1}
        />
        <Model
          objPath="/assets/machine1.obj"
          mtlPath="/assets/machine1.mtl"
          position={[20, 0, -30]}
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