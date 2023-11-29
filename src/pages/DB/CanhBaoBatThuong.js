import React, { useState, useEffect } from "react";
import ReactFullscreen from "react-easyfullscreen";
import { Canvas } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'
import { OBJModel } from 'react-3d-viewer'
import { Fisheye, CameraControls, PerspectiveCamera, Environment } from '@react-three/drei'
const CanhBaoBatThuong = () => {

  const obj = useLoader(OBJLoader, '/machine_1.obj')
  return (
    <React.Fragment>
      <Canvas>
        
          <CameraControls/>
          <ambientLight intensity={0.1} />
          <directionalLight color="red" position={[0, 0, 5]} />
          <pointLight position={[10, 10, 10]} />
          <primitive object={obj} />
        
      </Canvas>

    </React.Fragment>
  );
};

export default CanhBaoBatThuong;
