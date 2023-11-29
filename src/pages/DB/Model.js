import React, { Suspense } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { useLoader } from "@react-three/fiber";
import { Box3, Vector3 } from "three";

const Model = ({ objPath, mtlPath, position, scale = 1 }) => {
    const materials = useLoader(MTLLoader, mtlPath);
    materials.preload();
    const object = useLoader(OBJLoader, objPath, (loader) =>{
      loader.setMaterials(materials);
    });
  
    const box = new Box3().setFromObject(object);
    const center = box.getCenter(new Vector3());
  
    object.position.sub(center);
  
    return <primitive object={object} position={position} scale={scale} />;
};

export default Model;