import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import { useMemo } from "react";

const Model = ({ objPath, mtlPath, position, scale = 1 }) => {
  const materials = useLoader(MTLLoader, mtlPath);
  const object = useLoader(OBJLoader, objPath, (loader) => {
    loader.setMaterials(materials)
  });

  const box = new Box3().setFromObject(object);
  const center = box.getCenter(new Vector3());

  object.position.sub(center);
  const clone = useMemo(() => object.clone(), [object])
  return <primitive object={clone} position={position} scale={scale}/>;
};

const GiaoDienDaChieu = () => {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <Model
            objPath="/assets/may-song.obj"
            mtlPath="/assets/may-song.mtl"
            position={[0, 0, 0]}
            scale={1.1}
          />
        </Suspense>
        <Suspense fallback={null}>
          <Model
            objPath="/assets/machine1.obj"
            mtlPath="/assets/machine1.mtl"
            position={[20, 0, -30]}
            scale={0.1}
          />
        </Suspense>
        <Model
          objPath="/assets/machine2.obj"
          mtlPath="/assets/machine2.mtl"
          position={[30, 0, 10]}
          scale={0.1}
        />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

export default GiaoDienDaChieu;
