import React, { useEffect, useState } from "react";
import {
  Layout,
  Row,
  Col,
  Divider,
  Button,
  Table,
  Modal,
  Select,
  Steps,
  Input,
  Radio,
} from "antd";
import { withRouter, Link } from "react-router-dom";
import DataDetail from "../../../components/DataDetail";
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import Manufacture1 from "./Manufacture1";
const Manufacture = (props) => {
  document.title = "Sản xuất";
  const { line } = useParams();
  const history = useHistory();
  useEffect(() => {
    const screen = JSON.parse(localStorage.getItem("screen"));
    localStorage.setItem(
      "screen",
      JSON.stringify({ ...screen, manufacture: line ?? "" })
    );
    if (!line) {
      history.push("/manufacture/30");
    }
  }, [line]);
  return (
    <React.Fragment>
      <Manufacture1 />
      {/* {line === '9' && <Manufacture1/>}
                {line === '21' && <Manufacture4/>}
                {['10', '11', '12', '13'].includes(line) && <Manufacture2/>}
                {line === '15' && <Manufacture3/>}
                {['22', '14'].includes(line) && <Manufacture5/>} */}
    </React.Fragment>
  );
};

export default withRouter(Manufacture);
