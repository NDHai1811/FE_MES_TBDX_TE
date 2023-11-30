import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import Manufacture1 from "./Manufacture1";
const Manufacture = () => {
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
      history.push("/manufacture/S01");
    }
  }, [line]);
  return (
    <React.Fragment>
      <Manufacture1 />
    </React.Fragment>
  );
};

export default withRouter(Manufacture);
