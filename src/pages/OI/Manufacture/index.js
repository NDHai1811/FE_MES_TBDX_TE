import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import Manufacture1 from "./Manufacture1";
import NhapTay from "./NhapTay";
import InDan from "./InDan";
const Manufacture = () => {
  document.title = "Sản xuất";
  const { machine_id } = useParams();
  const history = useHistory();
  const [IOTList, setIOTList] = useState([])

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
    }else{
      const machines = JSON.parse(window.localStorage.getItem('machines'));
      console.log(machines);
      var iot_machine = [];
      (machines ?? []).forEach(element => {
        if(element?.is_iot){
          iot_machine.push(element.value);
        }
      });
      setIOTList(iot_machine);
    }
  }, [machine_id]);
  

  return (
    <React.Fragment>
      {
        machine_id === "S01" ? 
        <Manufacture1 /> :
        IOTList.includes(machine_id) ? 
        <InDan /> : 
        <NhapTay/>
      }
      {/* {(machine_id === "P15" || machine_id === "P06") && <InDan />} */}
    </React.Fragment>
  );
};

export default withRouter(Manufacture);
