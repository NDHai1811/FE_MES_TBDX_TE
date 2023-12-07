import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import Import from "./Import";
import Export from "./Export";

const Warehouse = (props) => {
  document.title = "Kho";
  const { line } = useParams();
  const history = useHistory();

  const userPermissions = JSON.parse(window.localStorage.getItem("authUser"));
  const isRawMaterialWarehouse = userPermissions.permission.includes("kho-nvl");

  useEffect(() => {
    if (!line) {
      history.push(
        `/warehouse/${isRawMaterialWarehouse ? "kho-nvl" : "kho-tp"}/nhap`
      );
    }
  }, [line]);
  return (
    <React.Fragment>
      {line === "nhap" && <Import />}
      {line === "xuat" && <Export />}
    </React.Fragment>
  );
};

export default withRouter(Warehouse);
