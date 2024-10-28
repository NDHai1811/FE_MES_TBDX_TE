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
import { Spin } from "antd";
const Manufacture = () => {
  document.title = "Sản xuất";
  const { machine_id } = useParams();
  if (machine_id) {
    localStorage.setItem('machine_id', machine_id);
  }
  const history = useHistory();
  const [IOTList, setIOTList] = useState([])
  const [machineOptions, setMachineOptions] = useState([]);
  const [content, setContent] = useState();
  const getListMachine = async () => {
    var res = await getMachines();
    if (res.data.length > 0) {
      setMachineOptions(res.data);
      if(!machine_id){
        const machineId = localStorage.getItem('machine_id');
        if (machineId) {
          history.push('/oi/manufacture/' + machineId);
        } else {
          history.push('/oi/manufacture/' + res.data[0]?.value);
        }
      }
    } else {
      history.push('/screen');
    }
  };
  useEffect(() => {
    getListMachine();
  }, [])
  useEffect(() => {
    if (machineOptions.length > 0) {
      if (machine_id === 'So01') {
        setContent(<Manufacture1 machineOptions={machineOptions} />);
      } else {
        machineOptions.forEach(e => {
          if (e.value === machine_id) {
            if (e.is_iot) {
              setContent(<InDan machineOptions={machineOptions} />);
            } else {
              setContent(<NhapTay machineOptions={machineOptions} />);
            }
          }
        })
      }
    }
  }, [machineOptions, machine_id]);


  return (
    <React.Fragment>
      {content ?? <Spin spinning={true} style={{ textAlign: 'center', width: '100%' }} />}
    </React.Fragment>
  );
};

export default withRouter(Manufacture);
