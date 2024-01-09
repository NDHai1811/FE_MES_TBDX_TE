import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import Manufacture1 from "./Manufacture1";
import NhapTay from "./NhapTay";
import InDan from "./NhapTay";
const Manufacture = () => {
  document.title = "Sản xuất";
  const { machine_id } = useParams();
  const history = useHistory();

  // const userPermissions = JSON.parse(
  //   window.localStorage.getItem("authUser")
  // ).permission;

  // const isWave = userPermissions?.some((val) => val === "oi-sx-song");
  // const isPrintStick = userPermissions?.some((val) => val === "oi-sx-in-dan");
  // const isHandInput = userPermissions?.some((val) => val === "oi-sx-nhap-tay");

  useEffect(() => {
    // const screen = JSON.parse(localStorage.getItem("screen"));
    // localStorage.setItem(
    //   "screen",
    //   JSON.stringify({ ...screen, manufacture: machine_id ?? "" })
    // );
    if (!machine_id) {
      history.push("/manufacture/S01");
    }
  }, [machine_id]);

  return (
    <React.Fragment>
      {machine_id === "S01" ? (
        <Manufacture1 />
      ) : (machine_id === "D05" || machine_id === "D06") ? (
        <NhapTay />
      ) : (
        <InDan />
      )}
    </React.Fragment>
  );
};

export default withRouter(Manufacture);
