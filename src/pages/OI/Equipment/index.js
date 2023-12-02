import React, { useEffect, useState } from "react";
import { Row, Col, Tabs, Card, Table } from "antd";
import { withRouter } from "react-router-dom";
import SelectButton from "../../../components/Button/SelectButton";
import "../style.scss";
import { useHistory, useParams } from "react-router-dom";
import Error from "./error";
import { getEquipmentOverall, getMachines } from "../../../api/oi/equipment";
import Mapping from "./mapping";
import dayjs from "dayjs";
import { COMMON_DATE_FORMAT_REQUEST } from "../../../commons/constants";
import { formatDateTime } from "../../../commons/utils";

const columns = [
  {
    title: "Tg chạy",
    dataIndex: "thoi_gian_chay",
    key: "thoi_gian_chay",
    align: "center",
    width: "20%",
  },
  {
    title: "Tg dừng",
    dataIndex: "thoi_gian_dung",
    key: "thoi_gian_dung",
    align: "center",
    width: "20%",
  },
  {
    title: "Số lần dừng",
    dataIndex: "so_lan_dung",
    key: "so_lan_dung",
    align: "center",
    width: "20%",
  },
  {
    title: "Tỷ lệ vận hành",
    dataIndex: "ty_le_van_hanh",
    key: "ty_le_van_hanh",
    align: "center",
    width: "20%",
  },
];

const Equipment = (props) => {
  document.title = "Thiết bị";
  const { machine_id } = useParams();
  const history = useHistory();
  // const [line, setLine] = useState();
  const [machines, setMachines] = useState([]);
  const [machine, setMachine] = useState("");
  const [date, setDate] = useState({
    startDate: dayjs(),
    endDate: dayjs(),
  });
  const [overall, setOverall] = useState([]);
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
      getOverAll();
    } else {
      history.push("/equipment/S01");
    }
  }, [machine_id]);

  useEffect(() => {
    if (machine_id) {
      getOverAll();
    }
  }, [machine_id, date.startDate, date.endDate]);

  useEffect(() => {
    getMachineList();
  }, []);

  const getOverAll = () => {
    const resData = {
      machine_id,
      start_date: formatDateTime(date.startDate, COMMON_DATE_FORMAT_REQUEST),
      end_date: formatDateTime(date.endDate, COMMON_DATE_FORMAT_REQUEST),
    };
    getEquipmentOverall(resData)
      .then((res) => setOverall([res.data]))
      .catch((err) => console.log("Lấy thông tin thất bại: ", err));
  };

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
      title: "Tg chạy",
      value: "0",
    },
    {
      title: "Tg dừng",
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
          <Table
            dataSource={overall}
            columns={columns}
            bordered
            pagination={false}
          />
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
