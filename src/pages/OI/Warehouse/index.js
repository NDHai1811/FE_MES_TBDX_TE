import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import Import from "./Import";
import Export from "./Export";
import Export2 from "./Export2";

const Warehouse = (props) => {
  document.title = "Kho NVL";
  const { line } = useParams();
  const history = useHistory();
  useEffect(()=>{
    if(!line){
      history.push('/oi/warehouse/kho-nvl/nhap');
    }
  })
  return (
    <React.Fragment>
      {line === "nhap" && <Import />}
      {line === "xuat" && <Export2 />}
    </React.Fragment>
  );
};

export default withRouter(Warehouse);
