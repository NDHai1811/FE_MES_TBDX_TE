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
  const { machine_id } = useParams();
  const history = useHistory();
  // useEffect(() => {
  //   const screen = JSON.parse(localStorage.getItem("screen"));
  //   localStorage.setItem(
  //     "screen",
  //     JSON.stringify({ ...screen, manufacture: machine_id ?? "" })
  //   );
  //   if (!machine_id) {
  //     history.push("/manufacture/S01");
  //   }
  // }, [machine_id]);
  return (
    <React.Fragment>
      <Manufacture1 />
    </React.Fragment>
  );
};

export default withRouter(Manufacture);
