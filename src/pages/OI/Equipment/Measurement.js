import React, { useEffect, useState } from "react";
import { Row, Col, Table, InputNumber } from "antd";
import { withRouter } from "react-router-dom";
import "../style.scss";
import {
  getMachineParamtersData,
  updateMachineParamtersData,
} from "../../../api/oi/equipment";
import dayjs from "dayjs";

const Measurement = (props) => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([{}]);
  // useEffect(() => {
  //     const tmp = props?.machine?.parameter;
  //     let list_col = [
  //         {
  //             title: 'STT',
  //             dataIndex: 'no',
  //             key: 'no',
  //             align: 'center',
  //             render: (value, item, index) => index + 1
  //         },
  //         {
  //             title: 'Mốc thời gian',
  //             dataIndex: 'time',
  //             key: 'time',
  //             align: 'center',
  //         },
  //     ];
  //     for (let j = 0; j < parameter.length; j++)
  //         if ((tmp ?? []).includes(parameter[j].id)) {
  //             let col = {
  //                 title: parameter[j].name,
  //                 dataIndex: parameter[j].key,
  //                 key: parameter[j].key,
  //                 align: 'center',
  //                 render: (text, record, index) => {
  //                     // kiểm tra khoảng thời gian còn được nhập không
  //                     // if(record.time)

  //                     if (parameter[j].isIF == true) {
  //                         console.log(record[parameter[j].key]);
  //                         return <p>{record[parameter[j].key]}</p>
  //                     }
  //                     else {
  //                         let placeholder = "Nhập " + parameter[j].name;
  //                         return <InputNumber inputMode='numeric' placeholder={placeholder}></InputNumber>
  //                     }
  //                 }
  //             }
  //             list_col.push(col);
  //         }
  //     setColumns(list_col);
  // }, [props?.machine])
  const saveData = async (key, value) => {
    const params = {
      machine_id: props?.machine?.code,
      key: key,
      value: value,
      date: dayjs(),
    };
    console.log(params);
    var res = await updateMachineParamtersData(params);
  };
  const rowClassName = (record, index) => {
    var status = "";
    if (
      dayjs().isBefore(dayjs(record.start_time)) ||
      dayjs().isAfter(dayjs(record.end_time))
    ) {
      status = "table-row-grey";
    }
    return "editable-row " + status;
  };
  useEffect(() => {
    retriveData();
  }, [props?.machine]);

  let interval;
  useEffect(() => {
    interval = setInterval(async () => {
      retriveData();
    }, 5000);
    return () => clearInterval(interval);
  }, [props?.machine]);

  async function retriveData() {
    if (props?.machine) {
      console.log(props?.machine);
      (async () => {
        var res = await getMachineParamtersData({
          machine_id: props?.machine?.code,
        });
        if (res.success) {
          let columns = (res.data.columns ?? []).map((e) => {
            if (!e.is_if) {
              return {
                ...e,
                align: "center",
                render: (value, record) => (
                  <InputNumber
                    inputMode="numeric"
                    defaultValue={value}
                    onPressEnter={(event) => {
                      saveData(e.key, event.target.value);
                    }}
                    disabled={
                      dayjs().isBefore(dayjs(record.start_time)) ||
                      dayjs().isAfter(dayjs(record.end_time))
                    }
                  />
                ),
              };
            }
            return {
              ...e,
              align: "center",
              // editable: !e?.is_if && !dayjs().isAfter(dayjs(e.end_time))
              render: (value) => <span>{value}</span>,
            };
          });
          setColumns([
            {
              title: "STT",
              dataIndex: "stt",
              key: "stt",
              align: "center",
              render: (value, record, index) => index + 1,
            },
            {
              title: "Mốc thời gian",
              dataIndex: "ca_sx",
              key: "ca_sx",
              align: "center",
              render: (value, record, index) => {
                return (
                  dayjs(record?.start_time).format("H") +
                  "h-" +
                  dayjs(record?.end_time).format("H") +
                  "h"
                );
              },
            },
            ...columns,
          ]);
          setData(res.data.data ?? []);
        }
      })();
    }
  }

  return (
    <React.Fragment>
      <Row className="mt-1">
        {props?.machine ? (
          <Col span={24}>
            <Table
              scroll={{
                x: 200,
                y: 350,
              }}
              pagination={false}
              bordered
              rowClassName={rowClassName}
              columns={columns}
              dataSource={data}
            />
            {/* <EditableTable
                    columns={columns}
                    data={data}
                    setData={setData}
                    onEditEnd={saveData}
                    rowClassName={rowClassName}
                    /> */}
          </Col>
        ) : (
          "Công đoạn không có máy!"
        )}
      </Row>
    </React.Fragment>
  );
};

export default withRouter(Measurement);
