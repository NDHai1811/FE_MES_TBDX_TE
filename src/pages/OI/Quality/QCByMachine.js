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
  Button,
  message,
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
import { getListMachine } from "../../../api";
import Checksheet3 from "../../../components/Popup/Checksheet3";
import { QrcodeOutlined } from "@ant-design/icons";
import ScanQR from "../../../components/Scanner";

const QCByMachine = (props) => {
  document.title = "Kiểm tra chất lượng";
  const { machine_id } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const [data, setData] = useState([]);
  const [machineOptions, setMachineOptions] = useState([]);
  const [params, setParams] = useState({ machine: [machine_id], start_date: dayjs(), end_date: dayjs() });
  const [overall, setOverall] = useState([{}]);
  const { userProfile } = useProfile();
  const [openModalCK1, setOpenModalCK1] = useState(false);
  const [openModalCK2, setOpenModalCK2] = useState(false);
  const [openModalCK3, setOpenModalCK3] = useState(false);
  const [isOpenQRScanner, setIsOpenQRScanner] = useState(false);
  const overallColumns = [
    {
      title: "Máy",
      dataIndex: "cong_doan",
      key: "cong_doan",
      align: "center",
      render: () => (
        <Select
          options={machineOptions}
          value={machine_id}
          onChange={onChangeLine}
          style={{ width: "100%" }}
          showSearch
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
      render: (text, record) => {
        if (record.checked_tinh_nang) {
          return record.sl_tinh_nang;
        } else {
          return "-";
        }
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
      render: (text, record) => {
        if (record.checked_ngoai_quan) {
          return record.sl_ngoai_quan;
        } else {
          return "-";
        }
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
            selectedRow?.checked_sl_ng === false && setOpenModalCK3(true);
          },
          style: {
            cursor: 'pointer'
          },
        };
      },
      render: (text, record) => {
        if (record.checked_sl_ng) {
          return record.sl_ng_qc;
        } else {
          return "-";
        }
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
      title: "Khách hàng",
      dataIndex: "khach_hang",
      key: "khach_hang",
      align: "center",
    },
    {
      title: "MDH",
      dataIndex: "mdh",
      key: "mdh",
      align: "center",
    },
    {
      title: "MQL",
      dataIndex: "mql",
      key: "mql",
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
  ];

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
    var machine = await getListMachine();
    setMachineOptions(machine);
    setLoading(false);
  };
  async function getData() {
    setLoading(true);
    var overall = await getQCOverall({ ...params });
    setOverall(overall.data);
    var res = await getLotQCList({ ...params });
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
    if (machine_id && params.machine.length > 0 && machine_id !== params.machine[0]) {
      setParams({ ...params, machine: [machine_id] })
    }
    setSelectedRow()
  }, [machine_id]);
  useEffect(() => {
    if (params?.machine?.length) {
      getData();
    }
  }, [params]);
  useEffect(() => {
    if (machineOptions.length > 0) {
      var target = machineOptions.find((e) => e.value === machine_id);
      if (!target) {
        target = machineOptions[0];
      }
      if (target.is_iot) {
        history.push("/oi/quality/machine-iot/" + target.value);
      } else {
        history.push("/oi/quality/machine/" + target.value);
      }
    }
  }, [machineOptions]);
  const onChangeLine = (value, option) => {
    console.log(option);
    setParams({ ...params, machine: value ? [value] : [] })
    if (option.is_iot) {
      history.push("/oi/quality/machine-iot/" + value);
    } else {
      history.push("/oi/quality/machine/" + value);
    }
  };
  const [isScan, setIsScan] = useState(0);
  useEffect(() => {
    if (isScan === 1) {
      setIsOpenQRScanner(true);
    } else if (isScan === 2) {
      setIsOpenQRScanner(false);
    }
  }, [isScan]);

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
  const onScan = async (result) => {
    const lo_sx = JSON.parse(result).lo_sx;
    const target = data.find(e => e.lo_sx === lo_sx);
    if (target) {
      setSelectedRow(target);
    } else {
      message.info('Không tìm thấy lô')
    }

    setIsOpenQRScanner(false);
    setIsScan(2)
  };
  const handleCloseMdl = () => {
    setIsOpenQRScanner(false);
    setIsScan(2);
  };
  return (
    <React.Fragment>
      <Spin spinning={loading}>
        <Row gutter={[6, 8]} className="mt-1">
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
          <Col span={8}>
            <DatePicker
              placeholder="Từ ngày"
              style={{ width: "100%" }}
              format={COMMON_DATE_FORMAT}
              defaultValue={dayjs()}
              // disabledDate={disabledStartDate}
              onChange={(value) => value.isValid() && setParams({ ...params, start_date: value })}
            />
          </Col>
          <Col span={8}>
            <DatePicker
              placeholder="Đến ngày"
              style={{ width: "100%" }}
              format={COMMON_DATE_FORMAT}
              defaultValue={dayjs()}
              // disabledDate={disabledEndDate}
              onChange={(value) => value.isValid() && setParams({ ...params, end_date: value })}
            />
          </Col>
          <Col span={8}>
            <Button
              size="medium"
              type="primary"
              style={{ width: "100%" }}
              onClick={() => setIsScan(1)}
              icon={<QrcodeOutlined style={{ fontSize: "24px" }} />}
            />
          </Col>
        </Row>

        <Table
          rowClassName={(record, index) => {
            return "no-hover " + rowClassName(record, index);
          }}
          scroll={{
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
      <Checksheet3
        open={openModalCK3}
        text={'Nhập số phế'}
        selectedLot={selectedRow}
        onSubmit={onSubmitResult}
        setOpen={setOpenModalCK3}
        machine_id={machine_id}
      />
      {isOpenQRScanner && (
        <Modal
          title="Quét QR"
          open={isOpenQRScanner}
          onCancel={handleCloseMdl}
          footer={null}
        >
          <ScanQR
            isScan={isOpenQRScanner}
            onResult={(res) => {
              onScan(res);
              setIsOpenQRScanner(false);
            }}
          />
        </Modal>
      )}
    </React.Fragment>
  );
};

export default withRouter(QCByMachine);
