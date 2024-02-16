import React, { useEffect, useState } from "react";
import { Row, Col, Tabs, Card, Table, Select } from "antd";
import { withRouter } from "react-router-dom";
import "../style.scss";
import { useHistory, useParams } from "react-router-dom";
import Error from "./error";
import { getEquipmentOverall, getMachines } from "../../../api/oi/equipment";
import Mapping from "./mapping";
import dayjs from "dayjs";
import { COMMON_DATE_FORMAT_REQUEST } from "../../../commons/constants";
import { formatDateTime } from "../../../commons/utils";

const Equipment = (props) => {
  document.title = "Thiết bị";
  const { machine_id } = useParams();
  const history = useHistory();
  const [machines, setMachines] = useState([]);
  const [machine, setMachine] = useState("");
  const [date, setDate] = useState({
    startDate: dayjs(),
    endDate: dayjs(),
  });
  const [overall, setOverall] = useState([
    {
      thoi_gian_chay: 0,
      thoi_gian_dung: 0,
      so_lan_dung: 0,
      ty_le_van_hanh: 0,
    },
  ]);

  const columns = [
    {
      title: "Công đoạn",
      dataIndex: "cong_doan",
      key: "cong_doan",
      align: "center",
      render: () => (
        <Select
          options={machines}
          value={machine_id}
          onChange={onChangeLine}
          style={{ width: "100%" }}
          bordered={false}
        />
      ),
    },
    {
      title: "Thời gian chạy",
      dataIndex: "thoi_gian_chay",
      key: "thoi_gian_chay",
      align: "center",
      width: "20%",
    },
    {
      title: "Thời gian dừng",
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

  useEffect(()=>{
    if (machines.length > 0) {
      var target = machines.find(e=>e.value === machine_id);
      if(!target){
        target = machines[0];
      }
      history.push('/oi/equipment/' + target.value);
    }
  }, [machines])

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
    console.log(value);
    history.push("/oi/equipment/" + value);
    setMachine(value);
  };
  return (
    <React.Fragment>
      <Row className="mt-3" gutter={[2, 12]}>
        <Col span={24}>
          <Table
            size="small"
            className="custom-table"
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
