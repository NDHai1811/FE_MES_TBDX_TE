import React, { useEffect, useState } from "react";
import { Row, Col, Tabs, Card } from "antd";
import { withRouter } from "react-router-dom";
import DataDetail from "../../../components/DataDetail";
import SelectButton from "../../../components/Button/SelectButton";
import "../style.scss";
import { useHistory, useParams } from "react-router-dom";
import Error from "./error";
import {
  getLine,
  getListMachineOfLine,
  getMachines,
} from "../../../api/oi/equipment";
import Mapping from "./mapping";

const Equipment = (props) => {
  document.title = "Thiết bị";
  const { machine_id } = useParams();
  const history = useHistory();
  const [optionsLine, setOptionsLine] = useState([]);
  // const [line, setLine] = useState();
  const [listMachine, setListMachine] = useState([]);
  const [machines, setMachines] = useState([]);
  const [machine, setMachine] = useState("");
  // useEffect(() => {
  //   (async () => {
  //     const list_line = await getLine({ type: "tb" });
  //     setOptionsLine(list_line.success == true ? list_line.data : []);
  //     if (!line) {
  //       history.push("/equipment/" + list_line.data[0].value);
  //     }
  //     // setLine(list_line.data[0]?.value);
  //   })();
  // }, []);

  useEffect(() => {
    if (machine_id) {
      const screen = JSON.parse(localStorage.getItem("screen"));
      localStorage.setItem(
        "screen",
        JSON.stringify({ ...screen, equipment: machine_id ? machine_id : "" })
      );
    }else{
      history.push("/equipment/S01");
    }
  }, [machine_id]);

  useEffect(() => {
    getMachineList();
  }, []);

  const getMachineList = () => {
    getMachines()
      .then((res) => {
        if (res.data.length > 0) {
          setMachines(res.data);
          setMachine(res.data[0].value);
        }
      })
      .catch((err) => console.log("Lấy danh sách máy thất bại: ", err));
  };

  const [row1, setRow1] = useState([
    {
      title: "Thời gian chạy",
      value: "0",
    },
    {
      title: "Thời gian dừng",
      value: "0",
    },
    {
      title: "Số lần dừng",
      value: "0",
    },
    {
      title: "Tỷ lệ vận hành",
      value: "0",
    },
  ]);
  const items = [
    {
      key: 1,
      label: `Mapping và thông số`,
      children: <Mapping />,
    },
    {
      key: 2,
      label: `Sự cố`,
      children: <Error machine={machine} />,
    },
  ];
  const onChangeLine = (value) => {
    history.push("/equipment/" + value.key);
    setMachine(value.value);
  };
  return (
    <React.Fragment>
      <Row className="mt-3" gutter={[2, 12]}>
        <Col span={6}>
          <SelectButton
            value={machine}
            options={machines}
            label="Công đoạn"
            onChange={(value) => onChangeLine(value)}
            labelInValue={true}
          />
        </Col>
        <Col span={18}>
          <DataDetail data={row1} />
        </Col>
        <Col span={24}>
          <Card bodyStyle={{ padding: 12 }}>
            <Tabs
              defaultActiveKey={1}
              items={items}
              destroyInactiveTabPane={true}
            />
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default withRouter(Equipment);
