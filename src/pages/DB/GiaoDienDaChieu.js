import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Box3, Vector3 } from "three";

const Model = ({ objPath, mtlPath, position }) => {
  const materials = useLoader(MTLLoader, mtlPath);
  const object = useLoader(OBJLoader, objPath, (loader) =>
    loader.setMaterials(materials)
  );

  const box = new Box3().setFromObject(object);
  const center = box.getCenter(new Vector3());

  object.position.sub(center);

  return <primitive object={object} position={position} />;
};

const GiaoDienDaChieu = () => {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <ambientLight intensity={0.5} />
      <Suspense fallback={null}>
        <Model
          objPath="/assets/machine1.obj"
          mtlPath="/assets/machine1.mtl"
          position={[-2, 0, 0]}
        />
        {/* <Model objPath="/assets/machine2.obj" mtlPath="/assets/machine2.mtl" position={[0, 0, 0]} />
        <Model objPath="/assets/machine3.obj" mtlPath="/assets/machine3.mtl" position={[2, 0, 0]} />
        <Model objPath="/assets/machine4.obj" mtlPath="/assets/machine4.mtl" position={[4, 0, 0]} /> */}
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

export default GiaoDienDaChieu;
