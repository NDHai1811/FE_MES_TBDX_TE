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
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import Import from "./finished-product/import";
import Export from "./finished-product/export";
const { Header, Content } = Layout;
const data = [
  {
    index: "1",
    id: "LSX001",
    order_quanlity: "AC001",
    time_require_complete: "200",
    paper_type: "150",
  },
  {
    index: "2",
    id: "LSX002",
    order_quanlity: "AC002",
    time_require_complete: "300",
    paper_type: "250",
  },
  {
    index: "3",
    id: "LSX003",
    order_quanlity: "AC003",
    time_require_complete: "200",
    paper_type: "150",
  },
  {
    index: "4",
    id: "LSX004",
    order_quanlity: "AC004",
    time_require_complete: "200",
    paper_type: "150",
  },
  {
    index: "5",
    id: "LSX005",
    order_quanlity: "AC005",
    time_require_complete: "200",
    paper_type: "150",
  },
  {
    index: "6",
    id: "LSX006",
    order_quanlity: "AC006",
    time_require_complete: "200",
    paper_type: "150",
  },
  {
    index: "6",
    id: "LSX006",
    order_quanlity: "AC006",
    time_require_complete: "200",
    paper_type: "150",
  },
  {
    index: "6",
    id: "LSX006",
    order_quanlity: "AC006",
    time_require_complete: "200",
    paper_type: "150",
  },
];
const Warehouse = (props) => {
  document.title = "Kho";
  const { line } = useParams();
  const history = useHistory();
  const [resultQR, setResultQr] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScan, setIsScan] = useState(0);
  useEffect(() => {
    if (isScan === 1) {
      setIsModalOpen(true);
    } else if (isScan === 2) {
      setIsModalOpen(false);
    }
  }, [isScan]);
  const [openDefect, setOpenDefect] = useState(false);
  useEffect(() => {
    if (line == undefined) {
      history.push("/warehouse/nhap");
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
