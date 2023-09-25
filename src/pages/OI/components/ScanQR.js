import { Html5Qrcode } from "html5-qrcode";
import React, { useEffect} from "react";

const qrConfig = { fps: 10, qrbox: { width: 200, height: 200 } };
const brConfig = { fps: 10, qrbox: { width: 300, height: 150 } };
let html5QrCode;
const ScanQR = (props) => {
  const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    console.info(decodedResult, decodedText);
    props.onResult(decodedText);
    handleStop();
  };
  useEffect(() => {
    html5QrCode = new Html5Qrcode("reader");
    const oldRegion = document.getElementById("qr-shaded-region");
    oldRegion && oldRegion.remove();
  }, []);
  useEffect(() => {
    if (props.isScan === 1) {
      html5QrCode
        .start(
          { facingMode: "environment" },
          qrConfig,
          qrCodeSuccessCallback
        )
        .then(() => {
          // const oldRegion = document.getElementById("qr-shaded-region");
          // if (oldRegion) oldRegion.innerHTML = "";
        });
    }
    if (props.isScan === 2) {
      handleStop();
    }
  }, [props.isScan])

  const handleStop = () => {
    try {
      html5QrCode
        .stop()
        .then((res) => {
          html5QrCode.clear();
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div id="reader" width="100%"></div>
  );
}
export default ScanQR