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
import { getMachines } from "../../../api/oi/equipment";
const Manufacture = () => {
  document.title = "Sản xuất";
  const { machine_id } = useParams();
  const history = useHistory();
  const [IOTList, setIOTList] = useState([])
  const [machineOptions, setMachineOptions] = useState([]);
  const getListMachine = async () => {
    var res = await getMachines()
    setMachineOptions(res.data);
  };
  useEffect(()=>{
    getListMachine();
  }, [])
  useEffect(() => {
    if(machineOptions.length > 0){
      var target = machineOptions.find((e) => e.value === machine_id);
      if (!target) {
        target = machineOptions[0];
      }
      history.push("/oi/manufacture/" + target.value);
      var iot_machine = [];
      (machineOptions).forEach(element => {
        if(element?.is_iot){
          iot_machine.push(element.value);
        }
      });
      setIOTList(iot_machine);
    }
  }, [machineOptions, machine_id]);
  

  return (
    <React.Fragment>
      {
        machine_id === "S01" ? 
        <Manufacture1 machineOptions={machineOptions}/> :
        IOTList.includes(machine_id) ? 
        <InDan machineOptions={machineOptions}/> : 
        <NhapTay machineOptions={machineOptions}/>
      }
    </React.Fragment>
  );
};

export default withRouter(Manufacture);
