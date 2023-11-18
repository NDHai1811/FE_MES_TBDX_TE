import React, { useEffect, useState } from "react";
import { Row, Col, Tabs, Card } from "antd";
import { withRouter } from "react-router-dom";
import DataDetail from "../../../components/DataDetail";
import SelectButton from "../../../components/Button/SelectButton";
import "../style.scss";
import { useHistory, useParams } from "react-router-dom";
import CheckSheet from "./Checksheet";
import SelectError from "./SelectError";
import Measurement from "./Measurement";
import {
  getLine,
  getListMachineOfLine,
  getMachineOverall,
  getMachines,
} from "../../../api/oi/equipment";

const Equipment = (props) => {
  document.title = "Thiết bị";
  const { line } = useParams();
  const history = useHistory();
  const [optionsLine, setOptionsLine] = useState([]);
  // const [line, setLine] = useState();
  const [listMachine, setListMachine] = useState([]);
  const [machines, setMachines] = useState([]);
  const [optionsMachine, setOptionsMachine] = useState([]);
  const [machine, setMachine] = useState();
  useEffect(() => {
    (async () => {
      const list_line = await getLine({ type: "tb" });
      setOptionsLine(list_line.success == true ? list_line.data : []);
      if (!line) {
        history.push("/equipment/" + list_line.data[0].value);
      }
      // setLine(list_line.data[0]?.value);
    })();
  }, []);

  useEffect(() => {
    if (line) {
      (async () => {
        const list_machine = await getListMachineOfLine({ line_id: line });
        setListMachine(list_machine.success == true ? list_machine.data : []);
      })();
      const screen = JSON.parse(localStorage.getItem("screen"));
      localStorage.setItem(
        "screen",
        JSON.stringify({ ...screen, equipment: line ? line : "" })
      );
    }
  }, [line]);
  useEffect(() => {
    let listOption = [];
    for (let i = 0; i < listMachine.length; i++) {
      let res = {
        value: listMachine[i].id,
        label: listMachine[i].name,
        code: listMachine[i].code,
      };
      listOption.push(res);
    }
    setOptionsMachine(listOption);
    setMachine(listOption[0]);
  }, [listMachine]);

  useEffect(() => {
    if (machine) {
      (async () => {
        var res = await getMachineOverall({ machine_id: machine?.value });
        if (res.success) {
          const totalSeconds = Math.floor(
            res.data.tg_dung ? parseInt(res.data.tg_dung) : 0 / 1000
          );
          const totalMinutes = Math.floor(totalSeconds / 60);
          const totalHours = Math.floor(totalMinutes / 60);
          // return dayjs.duration(time).format('HH:mm:ss')

          setRow1([
            {
              title: "Tổng TG dừng",
              value: `${("0" + totalHours).slice(-2)}:${(
                "0" +
                (totalMinutes % 60)
              ).slice(-2)}:${("0" + (totalSeconds % 60)).slice(-2)}`,
            },
            {
              title: "Tổng số lần dừng",
              value: res.data.so_lan_dung,
            },
            {
              title: "Tổng số lỗi",
              value: res.data.so_loi,
            },
          ]);
        }
      })();
    }
  }, [machine]);

  useEffect(() => {
    getMachineList();
  }, []);

  const getMachineList = () => {
    getMachines()
      .then((res) => setMachines(res.data))
      .catch((err) => console.log("Lấy danh sách máy thất bại: ", err));
  };

  const [row1, setRow1] = useState([
    {
      title: "Tổng TG dừng",
      value: "0",
    },
    {
      title: "Tổng số lần dừng",
      value: "0",
    },
    {
      title: "Tổng số lỗi",
      value: "0",
    },
  ]);
  const items = [
    {
      key: 1,
      label: `Check sheet`,
      children: <CheckSheet line={line} machine={machine} />,
    },
    {
      key: 2,
      label: `Chọn lỗi`,
      children: <SelectError line={line} machine={machine} />,
    },
    {
      key: 3,
      label: `Thông số đo`,
      children: <Measurement machine={machine} />,
    },
  ];
  const onChangeLine = (value) => {
    history.push("/equipment/" + value);
  };
  return (
    <React.Fragment>
      <Row className="mt-3" gutter={[8, 8]}>
        <Col span={6}>
          <SelectButton
            value={machine}
            options={machines}
            label="Máy"
            onChange={(value) => setMachine(value)}
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
