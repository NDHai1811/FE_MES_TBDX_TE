import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import "../../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import Import from "./import";
import Export from "./export";

const WarehouseTP = (props) => {
  document.title = "Kho";
  const { line } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (!line) {
      history.push("/warehouse/kho-tp/nhap");
    }
  }, [line]);
  return (
    <React.Fragment>
      {line === "nhap" && <Import />}
      {line === "xuat" && <Export />}
    </React.Fragment>
  );
};

export default withRouter(WarehouseTP);
