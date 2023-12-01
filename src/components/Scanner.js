import { Html5QrcodeScanner } from "html5-qrcode";
import React, { useEffect } from "react";
import "./scanner.scss";
const qrcodeRegionId = "html5qr-code-full-region";

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props) => {
  let config = {};
  if (props.fps) {
    config.fps = props.fps;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  return config;
};

const Html5QrcodePlugin = (props) => {
  const { isHideButton } = props;
  useEffect(() => {
    // when component mounts
    const config = createConfig(props);
    const verbose = props.verbose === true;
    // Suceess callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw "qrCodeSuccessCallback is required callback.";
    }
    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      verbose
    );
    html5QrcodeScanner.render(
      props.qrCodeSuccessCallback,
      props.qrCodeErrorCallback
    );

    // cleanup function when component will unmount
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []);

  return (
    <div id={qrcodeRegionId} className={isHideButton ? "hide-button" : ""} />
  );
};

const ScanQR = (props) => {
  const { isHideButton } = props;

  const onNewScanResult = (decodedText, decodedResult) => {
    props.onResult(decodedText);
  };

  return (
    <div width="100%">
      <Html5QrcodePlugin
        fps={10}
        qrbox={250}
        disableFlip={true}
        qrCodeSuccessCallback={onNewScanResult}
        isHideButton={isHideButton}
      />
    </div>
  );
};
export default ScanQR;
