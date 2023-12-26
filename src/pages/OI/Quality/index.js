import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import "../style.scss";
import {
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import { useProfile } from "../../../components/hooks/UserHooks";

const Quality = (props) => {
  document.title = "Kiểm tra chất lượng";
  const history = useHistory();
  const { userProfile } = useProfile();
  const qcPermission = ["pqc", "oqc", "iqc"].filter((value) =>
    (userProfile?.permission ?? []).includes(value)
  );
  useEffect(()=>{
    if(qcPermission.length > 0){
      history.push('/quality/qc/iqc');
    }else{
      history.push('/quality/sx/S01');
    }
  }, []);

  return (
    <React.Fragment>
    </React.Fragment>
  );
};

export default withRouter(Quality);
