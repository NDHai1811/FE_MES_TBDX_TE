import React from "react";
import { withRouter } from "react-router-dom";
import "../style.scss";
import {
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import IQC from "./IQC";
import PQC_OQC from "./PQC_OQC";

const QCByLine = (props) => {
  document.title = "Kiểm tra chất lượng";
  const { line_id } = useParams();
  return (
    <React.Fragment>
      {line_id === 'iqc' ? <IQC/> : <PQC_OQC/>}
    </React.Fragment>
  );
};

export default withRouter(QCByLine);
