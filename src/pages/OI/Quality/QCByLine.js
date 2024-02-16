import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Table,
  Modal,
  Spin,
  Form,
  InputNumber,
  Radio,
  DatePicker,
  Select,
} from "antd";
import { withRouter } from "react-router-dom";
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { useProfile } from "../../../components/hooks/UserHooks";
import {
  getIQCOverall,
  getQCOverall,
  getLotIQCList,
  getLotQCList,
  getQCLine,
  sendIQCResult,
  sendQCResult,
} from "../../../api/oi/quality";
import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import Checksheet2 from "../../../components/Popup/Checksheet2";
import dayjs from "dayjs";
import Checksheet1 from "../../../components/Popup/Checksheet1";
import { useRef } from "react";
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
