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
  getLotQCList,
  getQCLine,
  getQCOverall,
  sendQCResult,
} from "../../../api/oi/quality";
import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import Checksheet2 from "../../../components/Popup/Checksheet2";
import dayjs from "dayjs";
import Checksheet1 from "../../../components/Popup/Checksheet1";

const QCByMachine = (props) => {
  document.title = "Kiểm tra chất lượng";
  const { machine_id } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const [data, setData] = useState([]);
  const [machineOptions, setMachineOptions] = useState([]);
  const [params, setParams] = useState({machine: [machine_id], start_date: dayjs(), end_date: dayjs()});
  const [overall, setOverall] = useState([{}]);
  const { userProfile } = useProfile();
  const [openModalCK1, setOpenModalCK1] = useState(false);
  const [openModalCK2, setOpenModalCK2] = useState(false);
  const [date, setDate] = useState({
    start_date: dayjs(),
    end_date: dayjs(),
  });
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
      title: "Lô SX",
      dataIndex: "lo_sx",
      key: "lo_sx",
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
            selectedRow?.checked_tinh_nang === false && setOpenModalCK1(true);
          },
          style: {
            cursor: 'pointer'
          },
        };
      },
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
            selectedRow?.checked_ngoai_quan === false && setOpenModalCK2(true);
          },
          style: {
            cursor: 'pointer'
          },
        };
      },
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
            selectedRow?.checked_sl_ng === false && setOpenModal1(true);
          },
          style: {
            cursor: 'pointer'
          },
        };
      },
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
      title: "Lô SX",
      dataIndex: "lo_sx",
      key: "lo_sx",
      align: "center",
    },
    {
      title: "SL lỗi tính năng",
      dataIndex: "sl_tinh_nang",
      key: "sl_loi",
      align: "center",
      render: (value, record, index) => record.checked_tinh_nang ? value : "-",
    },
    {
      title: "SL lỗi ngoại quan",
      dataIndex: "sl_ngoai_quan",
      key: "sl_ngoai_quan",
      align: "center",
      render: (value, record, index) => record.checked_ngoai_quan ? value : "-",
    },
    {
      title: "Tổng phế",
      dataIndex: "sl_ng",
      key: "sl_ng",
      align: "center",
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
    {
      title: "Mã layout",
      dataIndex: "layout_id",
      key: "layout_id",
      align: "center",
    },
    {
      title: "Khách hàng",
      dataIndex: "khach_hang",
      key: "khach_hang",
      align: "center",
    },
    {
      title: "Sản lượng đầu ra",
      dataIndex: "san_luong",
      key: "san_luong",
      align: "center",
    },
    {
      title: "Sản lượng đạt",
      dataIndex: "sl_ok",
      key: "sl_ok",
      align: "center",
    },
  ];

  const disabledStartDate = (current) => {
    return current && current < dayjs().subtract(7, "day");
  };

  const disabledEndDate = (current) => {
    return current && current.startOf("day") < date.start_date.startOf("day");
  };

  const rowClassName = (record, index) => {
    if (record.id === selectedRow?.id) {
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
      setSelectedRow(record);
  };

  useEffect(() => {
    getListOption();
  }, []);

  const getListOption = async () => {
    setLoading(true);
    var machine = await getQCLine();
    setMachineOptions(machine.data);
    setLoading(false);
  };
  async function getData() {
    setLoading(true);
    var overall = await getQCOverall({ ...params});
    setOverall(overall.data);
    var res = await getLotQCList({ ...params});
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
      setParams({...params, machine: [machine_id]})
    }
  }, [machine_id]);
  useEffect(() => {
    if (params.machine) {
      getData();
    }
  }, [params]);
  useEffect(() => {
    if (machineOptions.length > 0) {
      var target = machineOptions.find((e) => e.value === machine_id);
      if (!target) {
        target = machineOptions[0];
      }
        history.push("/oi/quality/sx/" + target.value);
    }
  }, [machineOptions]);
  const onChangeLine = (value) => {
    setParams({...params, machine: value ? [value] : []})
      history.push("/oi/quality/sx/" + value);
  };
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const onSubmitSLP = async (values) => {
    if (selectedRow?.lo_sx) {
      onSubmitResult(values);
    }
    setOpenModal1(false);
    form1.resetFields();
  };
  const onSubmitPhanDinh = async (values) => {
    if (selectedRow?.lo_sx) {
      onSubmitResult(values);
    }
    setOpenModal2(false);
    form2.resetFields();
  };
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);

  const onSubmitResult = async (values) => {
    if (values?.tinh_nang) {
      setSelectedRow({ ...selectedRow, checked_tinh_nang: true });
    } else if (values?.ngoai_quan) {
      setSelectedRow({ ...selectedRow, checked_ngoai_quan: true });
    } else if (values?.sl_ng_sx) {
      setSelectedRow({ ...selectedRow, checked_sl_ng: true });
    }
    var res = await sendQCResult({
      machine_id: machine_id,
      lo_sx: selectedRow?.lo_sx,
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
              className="custom-table"
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
              // disabledDate={disabledStartDate}
              onChange={(value) => value.isValid() && setParams({ ...params, start_date: value })}
            />
          </Col>
          <Col span={12}>
            <DatePicker
              placeholder="Đến ngày"
              style={{ width: "100%" }}
              format={COMMON_DATE_FORMAT}
              defaultValue={dayjs()}
              // disabledDate={disabledEndDate}
              onChange={(value) => value.isValid() && setParams({ ...params, end_date: value })}
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
