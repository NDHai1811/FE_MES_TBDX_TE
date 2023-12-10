import React, { useEffect, useState } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { Box3, Vector3 } from "three";

const Model = ({ objPath, mtlPath, position, scale = 1, onClick }) => {
  const [object, setObject] = useState(null);

  useEffect(() => {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();

    mtlLoader.load(mtlPath, (materials) => {
      objLoader.setMaterials(materials);
      objLoader.load(objPath, (object) => {
        const box = new Box3().setFromObject(object);
        const center = box.getCenter(new Vector3());
        object.position.sub(center);
        setObject(object);
      });
    });
  }, [objPath, mtlPath]);

  return object ? (
    <mesh onClick={onClick || null}>
      <primitive object={object} position={position} scale={scale} />
    </mesh>
  ) : null;
};

export default Model;
