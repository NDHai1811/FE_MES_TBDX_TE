import React, { useEffect, useState } from "react";
import {
  CloseOutlined,
  PrinterOutlined,
  QrcodeOutlined,
  CheckOutlined,
  ReconciliationFilled,
} from "@ant-design/icons";
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
  Popconfirm,
  Form,
  Checkbox,
  AutoComplete,
  Switch,
  Tag,
  message,
} from "antd";
import { withRouter, Link } from "react-router-dom";
import CardInfo from "../components/CardInfo";
import DataDetail from "../../../components/DataDetail";
import SelectButton from "../../../components/Button/SelectButton";
import "../style.scss";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { log } from "@antv/g2plot/lib/utils";
import {
  getErrorOfLine,
  getMachineLog,
  updateMachineLog,
} from "../../../api/oi/equipment";
import dayjs from "dayjs";

const columns = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    align: "center",
    render: (value, item, index) => index + 1,
  },
  {
    title: "Thời gian dừng",
    dataIndex: "stopTime",
    key: "stopTime",
    align: "center",
  },
  {
    title: "Thời gian chạy",
    dataIndex: "runTime",
    key: "runTime",
    align: "center",
  },
  {
    title: "Mã lỗi",
    dataIndex: "code_error",
    key: "code_error",
    align: "center",
  },
  {
    title: "Tên lỗi",
    dataIndex: "name_error",
    key: "name_error",
    align: "center",
  },
  {
    title: "Nguyên nhân lỗi",
    dataIndex: "nguyen_nhan_error",
    key: "nguyen_nhan_error",
    align: "center",
  },
  {
    title: "Biện pháp khách phục",
    dataIndex: "khac_phuc_error",
    key: "khac_phuc_error",
    align: "center",
  },
  {
    title: "Biện pháp phòng ngừa",
    dataIndex: "phong_ngua_error",
    key: "phong_ngua_error",
    align: "center",
  },
  {
    title: "Tình trạng",
    dataIndex: "status",
    key: "status",
    align: "center",
    render: (text, record) =>
      record.status == 0 ? (
        <strong>Chưa xử lý</strong>
      ) : (
        <strong>Đã hoàn thành</strong>
      ),
  },
];
const SelectError = (props) => {
  const machine = props?.machine;
  const line = props?.line;

  const [logsMachine, setLogsMachine] = useState([]);
  const [dataTableLog, setDataTableLog] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await getMachineLog({ machine_id: machine?.value });
      setLogsMachine(res.success == true ? res.data : []);
    })();
  }, [machine]);

  useEffect(() => {
    let list = [];
    for (let i = 0; i < logsMachine.length; i++) {
      let log = logsMachine[i];
      let data = {
        id: log.id,
        stopTime: log.info.start_time ? log.info.start_time : "",
        runTime: log.info.end_time ? log.info.end_time : "",
        id_error: log?.error?.id,
        code_error: log?.error?.code,
        name_error: log?.error?.name,
        nguyen_nhan_error: log?.error?.nguyen_nhan,
        khac_phuc_error: log?.error?.khac_phuc,
        phong_ngua_error: log?.error?.phong_ngua,
        status: log.error == undefined ? 0 : 1,
      };
      list.push(data);
    }
    setDataTableLog(list);
  }, [logsMachine]);

  const [optionsError, setOptionsError] = useState([]);
  const [optionsNameError, setOptionsNameError] = useState([]);
  const [optionsIdError, setOptionsIdError] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await getErrorOfLine({ line_id: line });
      setOptionsError(res.success == true ? res.data : []);
    })();
  }, [line]);

  useEffect(() => {
    let nameError = [];
    let idError = [];
    for (let i = 0; i < optionsError.length; i++) {
      let name = {
        label: optionsError[i]?.name,
        value: optionsError[i]?.name,
        id: optionsError[i]?.id,
      };
      let id = {
        label: optionsError[i]?.code,
        value: optionsError[i]?.id,
        id: optionsError[i]?.id,
        name: optionsError[i]?.name,
      };
      nameError.push(name);
      idError.push(id);
    }
    setOptionsNameError(nameError);
    setOptionsIdError(idError);
  }, [optionsError]);

  // autoComplete search
  const [inputValue, setInputValue] = useState("");
  const [inputCodeError, setInputCodeError] = useState("");

  const onInput = (value, type) => {
    setCurrentError({
      ...currentError,
      [type]: value,
    });
    if (type == "name_error") {
      setCurrentError({
        id: currentError?.id,
        stopTime: currentError?.stopTime,
        runTime: currentError?.runTime,
        [type]: value,
      });
    }
  };

  const [selectedOption, setSelectedOption] = useState("");

  const onSelect = (data = null, option) => {
    let id_error = option.id;
    for (let i = 0; i < optionsError.length; i++) {
      if (optionsError[i].id == id_error) {
        let error = optionsError[i];
        setCurrentError({
          id: currentError?.id,
          stopTime: currentError?.stopTime,
          runTime: currentError?.runTime,
          id_error: error?.id,
          name_error: error?.name,
          code_error: error?.code,
          nguyen_nhan_error: error?.nguyen_nhan,
          khac_phuc_error: error?.khac_phuc,
          phong_ngua_error: error?.phong_ngua,
        });
        break;
      }
    }
  };

  const onSelectIdError = (data, option) => {
    let optionName = {
      label: option.name,
      value: option.name,
      id: option.value,
    };
    onSelect(null, optionName);
  };

  const [currentError, setCurrentError] = useState({});

  useEffect(() => {
    setInputValue(currentError?.name_error);
    setInputCodeError(currentError?.code_error);
  }, [currentError]);

  function save() {
    (async () => {
      const res = await updateMachineLog({ machine_log: currentError });
      if (res.success == true) {
        (async () => {
          const res = await getMachineLog({ machine_id: machine?.value });
          setLogsMachine(res.success == true ? res.data : []);
        })();

        setCurrentError({
          id: "",
          stopTime: "",
          runTime: "",
          id_error: "",
          name_error: "",
          code_error: "",
          nguyen_nhan_error: "",
          khac_phuc_error: "",
          phong_ngua_error: "",
        });
      }
    })();
  }

  const column1 = [
    {
      title: "Thời gian dừng",
      dataIndex: "stopTime",
      key: "stopTime",
      align: "center",
    },
    {
      title: "Thời gian chạy",
      dataIndex: "runTime",
      key: "runTime",
      align: "center",
    },
    {
      title: "Tên lỗi",
      dataIndex: "name_error",
      key: "name_error",
      align: "center",
      render: (value, record, index) => {
        return (
          <AutoComplete
            bordered={true}
            options={optionsNameError}
            value={value}
            // filterOption={(inputValue, option) =>
            //     {
            //         return option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            //     }
            // }
            onSelect={onSelect}
            onSearch={(value) => onInput(value, "name_error")}
            disabled={currentError?.status || !record.stopTime}
          >
            <Input
              value={inputValue}
              onChange={(e) => onInput(e.target.value, "name_error")}
              bordered={false}
              placeholder="Nhập tên lỗi"
            />
          </AutoComplete>
        );
      },
    },
    {
      title: "Mã lỗi",
      dataIndex: "code_error",
      key: "code_error",
      align: "center",
      render: (value, record, index) =>
        !currentError?.id_error &&
        (currentError?.name_error || currentError?.name_error !== "") ? (
          <></>
        ) : (
          <Select
            style={{ width: "80%" }}
            showSearch
            disabled={currentError?.status || !record.stopTime}
            value={value}
            placeholder="Nhập mã lỗi"
            optionFilterProp="children"
            onChange={onSelectIdError}
            options={optionsIdError}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        ),
    },
    {
      title: "Nguyên nhân",
      dataIndex: "nguyen_nhan",
      key: "nguyen_nhan",
      align: "center",
      render: (value, record, index) =>
        !currentError?.id_error ? (
          <Input
            disabled={currentError?.status || !record.stopTime}
            onChange={(e) => onInput(e.target.value, "nguyen_nhan_error")}
            bordered={false}
            placeholder="Nhập nguyên nhân"
          />
        ) : (
          currentError?.nguyen_nhan_error
        ),
    },
    {
      title: "Khắc phục",
      dataIndex: "khac_phuc",
      key: "khac_phuc",
      align: "center",
      render: (value, record, index) =>
        !currentError?.id_error ? (
          <Input
            disabled={currentError?.status || !record.stopTime}
            onChange={(e) => onInput(e.target.value, "khac_phuc_error")}
            bordered={false}
            placeholder="Nhập cách khắc phục"
          />
        ) : (
          currentError?.khac_phuc_error
        ),
    },
    {
      title: "Phòng ngừa",
      dataIndex: "phong_ngua",
      key: "phong_ngua",
      align: "center",
      render: (value, record, index) =>
        !currentError?.id_error ? (
          <Input
            disabled={currentError?.status || !record.stopTime}
            onChange={(e) => onInput(e.target.value, "phong_ngua_error")}
            bordered={false}
            placeholder="Nhập phòng ngừa"
          />
        ) : (
          currentError?.phong_ngua_error
        ),
    },
    {
      title: currentError.status == 1 ? "Tình trạng" : "-",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value, record, index) => {
        let show_button =
          currentError?.runTime &&
          currentError?.stopTime &&
          currentError?.name_error &&
          currentError.nguyen_nhan_error &&
          currentError.khac_phuc_error;
        return currentError.status == 1 ? (
          <Tag color="#87d068">Đã hoàn thành</Tag>
        ) : (
          <Button
            onClick={() => {
              save(record);
            }}
            disabled={!show_button}
            size="large"
            type="primary"
          >
            Lưu lại
          </Button>
        );
      },
    },
  ];

  document.title = "Thiết bị";
  return machine ? (
    <React.Fragment>
      <Row gutter={8}>
        <Col span={24}>
          <Table
            scroll={{
              x: window.screen.width,
            }}
            pagination={false}
            bordered
            className="mb-4"
            columns={column1}
            dataSource={[currentError]}
          />
        </Col>
        {/* <Col hidden={currentError.status == 1 ? true : false} span={2}>
                    <Button size='large' type='primary' style={{height:'70%', width:'100%'}}>Lưu lại</Button>
                </Col> */}
      </Row>
      <Row className="mt-4">
        <Col span={24}>
          <Table
            scroll={{
              x: window.screen.width,
            }}
            onRow={(record, index) => {
              return {
                onClick: (event) => {
                  setCurrentError(record);
                },
              };
            }}
            size="small"
            rowClassName={(record, index) =>
              record.status === 0 ? "table-row-light" : "table-row-green"
            }
            pagination={false}
            bordered
            className="mb-4"
            columns={columns}
            dataSource={dataTableLog}
          />
        </Col>
      </Row>
    </React.Fragment>
  ) : (
    <>Công đoạn không có máy</>
  );
};

export default withRouter(SelectError);
