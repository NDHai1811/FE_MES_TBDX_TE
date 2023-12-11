import React, { useEffect, useRef } from "react";
import { useThree } from "react-three-fiber";
import { OrbitControls } from "@react-three/drei";

const CameraController = () => {
  const controls = useRef();
  const { camera, gl } = useThree();

  useEffect(() => {
    const avgPosition = [
      (30 + 30 + 50 + 30 + 0 + 0) / 6,
      (0 + 0 + 0 + 0 + 0 + 0) / 6,
      (-30 - 10 - 60 - 95 - 5 + 0) / 6,
    ];

    controls.current.target.set(...avgPosition);
    camera.position.set(-42, 45, 18);
    camera.zoom = 2;
    camera.updateProjectionMatrix();
  }, [camera]);

  return <OrbitControls ref={controls} args={[camera, gl.domElement]} />;
};

export default CameraController;
