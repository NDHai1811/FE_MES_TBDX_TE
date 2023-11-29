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
  Button,
  Radio,
  DatePicker,
} from "antd";
import { withRouter } from "react-router-dom";
import "../style.scss";
import { SaveOutlined } from "@ant-design/icons";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import SelectButton from "../../../components/Button/SelectButton";
import { useProfile } from "../../../components/hooks/UserHooks";
import { getListMachine } from "../../../api";
import {
  getLotQCList,
  getQCOverall,
  sendQCResult,
} from "../../../api/oi/quality";
import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import Checksheet2 from "../../../components/Popup/Checksheet2";
import { getMachines } from "../../../api/oi/equipment";
import dayjs from "dayjs";
import { getLine } from "../../../api/oi/manufacture";
import Checksheet1 from "../../../components/Popup/Checksheet1";

const Quality = (props) => {
  document.title = "Kiểm tra chất lượng";
  const [messageApi, contextHolder] = message.useMessage();
  const { line } = useParams();
  const { machine_id } = useParams();
  const history = useHistory();
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState([
    {
      lot_id: "xxxxxxxx.01",
      san_luong: "100",
      sl_loi: "0",
      sl_ng: "0",
      result: 0,
    },
    {
      lot_id: "xxxxxxxx.02",
      san_luong: "100",
      sl_loi: "0",
      sl_ng: "0",
      result: 0,
    },
    {
      lot_id: "xxxxxxxx.03",
      san_luong: "100",
      sl_loi: "0",
      sl_ng: "0",
      result: 0,
    },
    {
      lot_id: "xxxxxxxx.04",
      san_luong: "100",
      sl_loi: "0",
      sl_ng: "0",
      result: 0,
    },
    {
      lot_id: "xxxxxxxx.05",
      san_luong: "100",
      sl_loi: "0",
      sl_ng: "0",
      result: 2,
    },
    {
      lot_id: "xxxxxxxx.06",
      san_luong: "100",
      sl_loi: "0",
      sl_ng: "0",
      result: 1,
    },
    {
      lot_id: "xxxxxxxx.07",
      san_luong: "100",
      sl_loi: "1",
      sl_ng: "100",
      result: 1,
    },
    {
      lot_id: "xxxxxxxx.08",
      san_luong: "100",
      sl_loi: "1",
      sl_ng: "100",
      result: 1,
    },
  ]);
  const [lineOptions, setLineOptions] = useState([]);
  const [machineOptions, setMachineOptions] = useState([]);
  const [params, setParams] = useState([]);
  const [overall, setOverall] = useState([]);
  const { userProfile } = useProfile();

  const overallColumns = [
    {
      title: "Tổng Lot Kiểm",
      dataIndex: "tong_lot_kiem",
      key: "tong_lot_kiem",
      align: "center",
      width: 100 / 4 + "%",
    },
    {
      title: "Số Lot Đạt",
      dataIndex: "so_lot_dat",
      key: "so_lot_dat",
      align: "center",
      width: 100 / 4 + "%",
    },
    {
      title: "Tổng phế (SX+OC)",
      dataIndex: "tong_phe",
      key: "tong_phe",
      align: "center",
      width: 100 / 4 + "%",
    },
    {
      title: "Tỉ lệ thành phẩm OK",
      dataIndex: "ti_le",
      key: "ti_le",
      align: "center",
      width: 100 / 4 + "%",
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
      render: () => (
        <div onClick={() => setOpenModal(true)}>
          <Checksheet1
            text="Kiểm"
            selectedLot={selectedRow}
            onSubmit={onSubmitResult}
            onClose={() => setOpenModal(false)}
            machine_id={machine_id}
          />
        </div>
      ),
    },
    {
      title: "Kiểm tra ngoại quan",
      dataIndex: "sl_ngoai_quan",
      key: "sl_ngoai_quan",
      align: "center",
      width: "20%",
      render: () => (
        <div onClick={() => setOpenModal(true)}>
          <Checksheet2
            text="Kiểm"
            selectedLot={selectedRow}
            onSubmit={onSubmitResult}
            onClose={() => setOpenModal(false)}
            machine_id={machine_id}
          />
        </div>
      ),
    },
    {
      title: "Số phế",
      dataIndex: "sl_ng_qc",
      key: "sl_ng_qc",
      align: "center",
      width: "14%",
      render: (text, record) => (
        <InputNumber
          defaultValue={text}
          onChange={(value) => handleInputChange(record, value)}
          placeholder="Nhập số lượng"
        />
      ),
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
      width: "32%",
    },
    {
      title: "Khách hàng",
      dataIndex: "san_luong",
      key: "san_luong",
      align: "center",
      width: "18%",
    },
    {
      title: "Quá trình",
      dataIndex: "sl_loi",
      key: "sl_loi",
      align: "center",
      width: "18%",
    },
    {
      title: "Tổng lỗi",
      dataIndex: "sl_ng",
      key: "sl_ng",
      align: "center",
      width: "16%",
      render: (value, record, index) =>
        value ? value : record.phan_dinh !== 0 ? value : "-",
    },
    {
      title: "Phế QC",
      dataIndex: "sl_ng",
      key: "sl_ng",
      align: "center",
      width: "16%",
      render: (value, record, index) =>
        value ? value : record.phan_dinh !== 0 ? value : "-",
    },
    {
      title: "Phán định",
      dataIndex: "phan_dinh",
      key: "phan_dinh",
      align: "center",
      width: "16%",
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
    // const newData = [...data];
    // const index = newData.findIndex((item) => record.key === item.key);
    // newData[index].sl_kich_thuoc = value;
    // setData(newData);
  };

  const rowClassName = (record, index) => {
    if (record.lot_id === selectedRow?.lot_id) {
      return "table-row-green";
    }
    switch (record.result) {
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
    // setSelectedRow(record);
  };

  const onDBClickRow = (event, record, index) => {
    if (record.result === 0) {
      setSelectedRow(record);
      // setData(prev=>{
      //     const newData = [...prev];
      //     newData.splice(index, 1);
      //     newData.unshift(record)
      //     return newData;
      // })
    }
  };

  useEffect(() => {
    getListOption();
    getMachineList();
  }, []);

  const getMachineList = () => {
    getMachines()
      .then((res) => setMachines(res.data))
      .catch((err) => console.log("Get machines error: ", err));
  };

  const getListOption = async () => {
    setLoading(true);
    var line = await getLine();
    setLineOptions(line.data);
    var machine = await getListMachine();
    setMachineOptions(machine);
    setLoading(false);
  };
  async function getData() {
    setLoading(true);
    var overall = await getQCOverall({...params, machine_id});
    setOverall(overall.data);
    var res = await getLotQCList({...params, machine_id});
    setData(res.data);
    if (res.data.length > 0 && res.data[0].phan_dinh === 0) {
      setSelectedRow(res.data[0]);
    }
    setLoading(false);
  }
  useEffect(() => {
    setParams({
      ...params,
      machine_id: machine_id,
    });
  }, [machine_id, machineOptions]);
  useEffect(() => {
    if (machine_id) {
      getData();
    }
  }, machine_id);
  useEffect(() => {
    if (line) {
      const screen = JSON.parse(localStorage.getItem("screen"));
      localStorage.setItem(
        "screen",
        JSON.stringify({ ...screen, quality: line ? line : "" })
      );
    } else {
      history.push("/quality/S01");
    }
  }, [line]);
  const onChangeLine = (value) => {
    history.push("/quality/" + value);
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
  const qcPermission = ["pqc", "oqc", "*"].filter((value) =>
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
      {contextHolder}
      <Spin spinning={loading}>
        <Row gutter={[6, 8]} className="mt-3">
          <Col span={window.screen.width < 720 ? 7 : 5}>
            <SelectButton
              options={machineOptions}
              value={machine_id}
              label="Máy"
              onChange={onChangeLine}
            />
          </Col>
          <Col span={window.screen.width < 720 ? 17 : 19}>
            <Table
              locale={{ emptyText: "Trống" }}
              pagination={false}
              bordered={true}
              columns={overallColumns}
              dataSource={overall}
              size="small"
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

        <Row className="mt-3" style={{ justifyContent: "space-between" }}>
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
              dataSource={selectedRow ? [selectedRow] : [{
                lot_id: 'L9328MC'
              }]}
              size="small"
            />
          </Col>
        </Row>

        <Row
          className="mt-2"
          gutter={[3, 8]}
          style={{ justifyContent: "space-between" }}
        >
          <Col span={11}>
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
          <Col span={11}>
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
          <Col span={2}>
            <Button
              type="primary"
              style={{ width: "100%" }}
              icon={<SaveOutlined style={{ fontSize: "22px" }} />}
            ></Button>
          </Col>
        </Row>

        <Table
          rowClassName={(record, index) => {
            return "no-hover " + rowClassName(record, index);
          }}
          scroll={{
            x: window.screen.width,
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
              onDoubleClick: (event) => {
                onDBClickRow(event, record, index);
              }, // double click row
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
              sl_ng: 0,
            }}
            onFinish={onSubmitSLP}
          >
            <Form.Item name={"sl_ng_qc"}>
              <InputNumber style={{ width: "100%" }} inputMode="numeric" onPressEnter={()=>form1.submit()}/>
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
        {openModal && (
          <Checksheet2
            text="KT kích thước"
            selectedLot={selectedRow}
            onSubmit={onSubmitResult}
            onClose={() => setOpenModal(false)}
          />
        )}
      </Spin>
    </React.Fragment>
  );
};

export default withRouter(Quality);
