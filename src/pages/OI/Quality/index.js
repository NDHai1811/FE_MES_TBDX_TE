import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import "../style.scss";
import {
  useHistory, useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { useProfile } from "../../../components/hooks/UserHooks";
import QCByLine from "./QCByLine";
import QCByMachine from "./QCByMachine";

const Quality = (props) => {
  document.title = "Kiểm tra chất lượng";
  const {type} = useParams()
  const history = useHistory();
  const { userProfile } = useProfile();
  const qcPermission = ["pqc", "oqc", "iqc"].filter((value) =>
    (userProfile?.permission ?? []).includes(value)
  );
  useEffect(()=>{
    if(qcPermission.length > 0){
      history.push('/oi/quality/qc');
    }else{
      history.push('/oi/quality/sx');
    }
  }, []);

  return (
    <React.Fragment>
      {type === 'qc' ? <QCByLine/> : <QCByMachine/>}
    </React.Fragment>
  );
};

export default withRouter(Quality);
