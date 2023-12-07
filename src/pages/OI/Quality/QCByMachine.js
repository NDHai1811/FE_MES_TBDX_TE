import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Table,
  Modal,
  Spin,
  Form,
  InputNumber,
  message,
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
import { getListMachine } from "../../../api";
import {
  getLotQCList,
  getQCLine,
  getQCOverall,
  sendQCResult,
} from "../../../api/oi/quality";
import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import Checksheet2 from "../../../components/Popup/Checksheet2";
import { getMachines } from "../../../api/oi/equipment";
import dayjs from "dayjs";
import { getLine } from "../../../api/oi/manufacture";
import Checksheet1 from "../../../components/Popup/Checksheet1";

const QCByMachine = (props) => {
  document.title = "Kiểm tra chất lượng";
  const { machine_id } = useParams();
  const history = useHistory();
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState([]);
  const [lineOptions, setLineOptions] = useState([]);
  const [machineOptions, setMachineOptions] = useState([]);
  const [params, setParams] = useState([]);
  const [overall, setOverall] = useState([]);
  const { userProfile } = useProfile();
  const [openModalCK1, setOpenModalCK1] = useState(false);
  const [openModalCK2, setOpenModalCK2] = useState(false);
  const overallColumns = [
    {
      title: "Công đoạn",
      dataIndex: "cong_doan",
      key: "cong_doan",
      align: "center",
      render: () => (
        <Select
          options={machineOptions}
          value={machine_id}
          onChange={onChangeLine}
          style={{ width: "100%" }}
          bordered={false}
        />
      ),
    },
    {
      title: "Số lượng kiểm tra",
      dataIndex: "sl_kiem_tra",
      key: "sl_kiem_tra",
      align: "center",
    },
    {
      title: "Số lượng đạt",
      dataIndex: "sl_ok",
      key: "sl_ok",
      align: "center",
    },
    {
      title: "Số phế",
      dataIndex: "sl_ng",
      key: "sl_ng",
      align: "center",
    },
    {
      title: "Tỉ lệ OK",
      dataIndex: "ti_le",
      key: "ti_le",
      align: "center",
    },
  ];

  const checkingTable = [
    {
      title: "Mã Lot",
      dataIndex: "lot_id",
      key: "lot_id",
      align: "center",
      width: "30%",
    },
    {
      title: "Kiểm tra tính năng",
      dataIndex: "sl_tinh_nang",
      key: "sl_tinh_nang",
      align: "center",
      width: "20%",
      onHeaderCell: (column) => {
        return {
          onClick: () => {
            setOpenModalCK1(true);
          },
        };
      },
      // render: () => (
      //   <div onClick={() => setOpenModal(true)}>
      //     <Checksheet1
      //       text="Kiểm"
      //       selectedLot={selectedRow}
      //       onSubmit={onSubmitResult}
      //       onClose={() => setOpenModal(false)}
      //       machine_id={machine_id}
      //     />
      //   </div>
      // ),
    },
    {
      title: "Kiểm tra ngoại quan",
      dataIndex: "sl_ngoai_quan",
      key: "sl_ngoai_quan",
      align: "center",
      width: "20%",
      onHeaderCell: (column) => {
        return {
          onClick: () => {
            setOpenModalCK2(true);
          },
        };
      },
      // render: () => (
      //   <div onClick={() => setOpenModal(true)}>
      //     <Checksheet2
      //       text="Kiểm"
      //       selectedLot={selectedRow}
      //       onSubmit={onSubmitResult}
      //       onClose={() => setOpenModal(false)}
      //       machine_id={machine_id}
      //     />
      //   </div>
      // ),
    },
    {
      title: "Số phế",
      dataIndex: "sl_ng_qc",
      key: "sl_ng_qc",
      align: "center",
      width: "14%",
      onHeaderCell: (column) => {
        return {
          onClick: () => {
            setOpenModal1(true);
          },
        };
      },
      // render: (text, record) => (
      //   <InputNumber
      //     value={text}
      //     onChange={(value) => handleInputChange(record, value)}
      //     onPressEnter={(event) =>
      //       onSubmitSLP({ sl_ng_qc: event.target.value })
      //     }
      //     placeholder="Nhập số lượng"
      //   />
      // ),
    },
    {
      title: "Phán định",
      dataIndex: "phan_dinh",
      key: "phan_dinh",
      align: "center",
      render: (value) => {
        switch (value) {
          case 0:
            return "waiting";
          case 1:
            return "OK";
          case 2:
            return "NG";
          default:
            return "";
        }
      },
    },
  ];

  const columns = [
    {
      title: "Mã Lot",
      dataIndex: "lot_id",
      key: "lot_id",
      align: "center",
    },
    {
      title: "Khách hàng",
      dataIndex: "san_luong",
      key: "san_luong",
      align: "center",
    },
    {
      title: "SL lỗi tính năng",
      dataIndex: "sl_tinh_nang",
      key: "sl_loi",
      align: "center",
    },
    {
      title: "SL lỗi ngoại quan",
      dataIndex: "sl_ngoai_quan",
      key: "sl_ngoai_quan",
      align: "center",
      render: (value, record, index) =>
        value ? value : record.phan_dinh !== 0 ? value : "-",
    },
    {
      title: "Tổng phế",
      dataIndex: "sl_ng",
      key: "sl_ng",
      align: "center",
      render: (value, record, index) =>
        value ? value : record.phan_dinh !== 0 ? value : "-",
    },
    {
      title: "Phán định",
      dataIndex: "phan_dinh",
      key: "phan_dinh",
      align: "center",
      render: (value) => {
        switch (value) {
          case 0:
            return "waiting";
          case 1:
            return "OK";
          case 2:
            return "NG";
          default:
            return "";
        }
      },
    },
  ];

  const handleInputChange = (record, value) => {
    const newData = [...data];
    const index = newData.findIndex((item) => record.key === item.key);
    newData[index].sl_ng_qc = value;
    setData(newData);
  };

  const rowClassName = (record, index) => {
    if (record.lot_id === selectedRow?.lot_id) {
      return "table-row-green";
    }
    switch (record.phan_dinh) {
      case 0:
        return "";
      case 1:
        return "table-row-grey";
      case 2:
        return "table-row-red";
      default:
        return "";
    }
  };

  const onClickRow = (event, record) => {
    if (!record.phan_dinh) {
      setSelectedRow(record);
    }
  };

  const onDBClickRow = (event, record, index) => {
    if (!record.phan_dinh) {
      setSelectedRow(record);
    }
  };

  useEffect(() => {
    getListOption();
    // getMachineList();
  }, []);

  const getMachineList = () => {
    getMachines()
      .then((res) => setMachines(res.data))
      .catch((err) => console.log("Get machines error: ", err));
  };

  const getListOption = async () => {
    setLoading(true);
    var machine = await getQCLine();
    console.log(machine);
    setMachineOptions(machine.data);
    setLoading(false);
  };
  async function getData() {
    setLoading(true);
    var overall = await getQCOverall({ ...params, machine_id: machine_id });
    setOverall(overall.data);
    var res = await getLotQCList({ ...params, machine_id: machine_id });
    setData(res.data);
    if (res.data.length > 0) {
      var current = res.data.find((e) => e?.id === selectedRow?.id);
      if (current?.phan_dinh !== selectedRow?.phan_dinh) {
        setSelectedRow();
      }
    }
    setLoading(false);
  }
  useEffect(() => {
    if (machine_id) {
      getData();
    }
  }, [machine_id]);
  useEffect(() => {
    console.log(machineOptions);
    if (machineOptions.length > 0) {
      var target = machineOptions.find((e) => e.value === machine_id);
      if (!target) {
        target = machineOptions[0];
      }
      if (qcPermission.length > 0) {
        history.push("/quality/qc/" + target.value);
      } else {
        history.push("/quality/sx/" + target.value);
      }
    }
  }, [machineOptions]);
  const onChangeLine = (value) => {
    if (qcPermission.length > 0) {
      history.push("/quality/qc/" + value);
    } else {
      history.push("/quality/sx/" + value);
    }
  };
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const onSubmitSLP = async (values) => {
    if (selectedRow?.lot_id) {
      onSubmitResult(values);
    }
    setOpenModal1(false);
    form1.resetFields();
  };
  const onSubmitPhanDinh = async (values) => {
    if (selectedRow?.lot_id) {
      onSubmitResult(values);
    }
    setOpenModal2(false);
    form2.resetFields();
  };
  const qcPermission = ["pqc", "oqc", "iqc"].filter((value) =>
    (userProfile?.permission ?? []).includes(value)
  );
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);

  const onSubmitResult = async (values) => {
    var res = await sendQCResult({
      machine_id: machine_id,
      lot_id: selectedRow?.lot_id,
      data: values,
    });
    getData();
  };
  return (
    <React.Fragment>
      <Spin spinning={loading}>
        <Row gutter={[6, 8]} className="mt-3">
          <Col span={24}>
            <Table
              locale={{ emptyText: "Trống" }}
              pagination={false}
              bordered={true}
              columns={overallColumns}
              dataSource={overall}
              size="small"
              className="custom-table"
              style={{ borderRadius: 12 }}
              // scroll={
              //   window.screen.width < 720
              //     ? {
              //         x: window.screen.width,
              //       }
              //     : false
              // }
            />
          </Col>
        </Row>

        <Row className="mt-2" style={{ justifyContent: "space-between" }}>
          <Col span={24}>
            <Table
              locale={{ emptyText: "Trống" }}
              pagination={false}
              bordered={true}
              scroll={
                window.screen.width < 720
                  ? {
                      x: window.screen.width,
                    }
                  : false
              }
              columns={checkingTable}
              dataSource={selectedRow ? [selectedRow] : []}
              size="small"
            />
          </Col>
        </Row>

        <Row
          className="mt-2"
          gutter={[3, 8]}
          style={{ justifyContent: "space-between" }}
        >
          <Col span={12}>
            <DatePicker
              placeholder="Từ ngày"
              style={{ width: "100%" }}
              format={COMMON_DATE_FORMAT}
              defaultValue={dayjs()}
              onChange={(value) =>
                value.isValid() && setParams({ ...params, start_date: value })
              }
            />
          </Col>
          <Col span={12}>
            <DatePicker
              placeholder="Đến ngày"
              style={{ width: "100%" }}
              format={COMMON_DATE_FORMAT}
              defaultValue={dayjs()}
              onChange={(value) =>
                value.isValid() && setParams({ ...params, end_date: value })
              }
            />
          </Col>
        </Row>

        <Table
          rowClassName={(record, index) => {
            return "no-hover " + rowClassName(record, index);
          }}
          scroll={{
            x: "calc(700px + 50%)",
            y: 300,
          }}
          pagination={false}
          bordered={true}
          className="mt-2 mb-3"
          columns={columns}
          dataSource={data}
          size="small"
          onRow={(record, index) => {
            return {
              onClick: (event) => {
                onClickRow(event, record);
              }, // click row
              // onDoubleClick: (event) => {
              //   onDBClickRow(event, record, index);
              // }, // double click row
            };
          }}
          components={{
            rowHoverBg: "#000000",
          }}
        />
        <Modal
          title="Số lượng phế"
          open={openModal1}
          onCancel={() => setOpenModal1(false)}
          okText={"Xác nhận"}
          okButtonProps={{
            onClick: () => form1.submit(),
          }}
        >
          <Form
            form={form1}
            initialValues={{
              sl_ng_qc: 0,
            }}
            onFinish={onSubmitSLP}
          >
            <Form.Item name={"sl_ng_qc"}>
              <InputNumber
                style={{ width: "100%" }}
                inputMode="numeric"
                onPressEnter={() => form1.submit()}
              />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Phán định"
          open={openModal2}
          onCancel={() => setOpenModal2(false)}
          okText={"Xác nhận"}
          okButtonProps={{
            onClick: () => form1.submit(),
          }}
        >
          <Form
            form={form2}
            initialValues={{
              result: 0,
            }}
            onFinish={onSubmitPhanDinh}
          >
            <Form.Item name={"phan-dinh"}>
              <Radio.Group
                size="large"
                style={{ float: "right", width: "100%", height: "100%" }}
                className="d-flex"
                optionType="button"
                buttonStyle="solid"
              >
                <Radio.Button
                  value={1}
                  className={
                    "positive-radio text-center h-100 d-flex align-items-center justify-content-center"
                  }
                  style={{ flex: 1 }}
                >
                  OK
                </Radio.Button>
                <Radio.Button
                  value={2}
                  className="negative-radio text-center h-100 d-flex align-items-center justify-content-center"
                  style={{ flex: 1 }}
                >
                  NG
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
      <Checksheet1
        open={openModalCK1}
        selectedLot={selectedRow}
        onSubmit={onSubmitResult}
        setOpen={setOpenModalCK1}
        machine_id={machine_id}
      />
      <Checksheet2
        open={openModalCK2}
        selectedLot={selectedRow}
        onSubmit={onSubmitResult}
        setOpen={setOpenModalCK2}
        machine_id={machine_id}
      />
    </React.Fragment>
  );
};

export default withRouter(QCByMachine);
