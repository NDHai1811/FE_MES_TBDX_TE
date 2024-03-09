import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Table,
  Spin,
  Form,
  InputNumber,
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
  getQCOverall,
  getLotQCList,
  getQCLine,
  sendQCResult,
} from "../../../api/oi/quality";
import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import Checksheet2 from "../../../components/Popup/Checksheet2";
import dayjs from "dayjs";
import Checksheet1 from "../../../components/Popup/Checksheet1";
import Checksheet3 from "../../../components/Popup/Checksheet3";

const PQC_OQC = (props) => {
  document.title = "Kiểm tra chất lượng";
  const { line_id } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const [data, setData] = useState([]);
  const [lineOptions, setLineOptions] = useState([]);
  const [params, setParams] = useState({ line_id: line_id, start_date: dayjs(), end_date: dayjs() });
  const [overall, setOverall] = useState([{}]);
  const { userProfile } = useProfile();
  const [openModalCK1, setOpenModalCK1] = useState(false);
  const [openModalCK2, setOpenModalCK2] = useState(false);
  const [openModalCK3, setOpenModalCK3] = useState(false);
  useEffect(()=>{
    if(!line_id && lineOptions.length > 0){
      const item = lineOptions[0];
      history.push('/oi/quality/qc/'+item?.value);
    }else if(line_id && lineOptions.length > 0){
      const item = lineOptions.find(e=>e.value === line_id);
      setParams({...params, machine: item?.machine})
    }
  }, [line_id, lineOptions])
  const overallColumns = [
    {
      title: "IQC/PQC/OQC",
      dataIndex: "cong_doan",
      key: "cong_doan",
      align: "center",
      render: () => (
        <Select
          options={lineOptions}
          value={line_id}
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
          return record.sl_ng;
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
      title: "Sản lượng đầu ra",
      dataIndex: "sl_dau_ra_hang_loat",
      key: "sl_dau_ra_hang_loat",
      align: "center",
    },
    {
      title: "Số lượng đạt",
      dataIndex: "sl_ok",
      key: "sl_ok",
      align: "center",
    },
    {
      title: "SL lỗi tính năng",
      dataIndex: "sl_tinh_nang",
      key: "sl_loi",
      align: "center",
      render: (text, record) => {
        if (record.checked_tinh_nang) {
          return record.sl_tinh_nang;
        } else {
          return "-";
        }
      },
    },
    {
      title: "SL lỗi ngoại quan",
      dataIndex: "sl_ngoai_quan",
      key: "sl_ngoai_quan",
      align: "center",
      render: (text, record) => {
        if (record.checked_ngoai_quan) {
          return record.sl_ngoai_quan;
        } else {
          return "-";
        }
      },
    },
    {
      title: "Tổng phế",
      dataIndex: "sl_ng",
      key: "sl_ng",
      align: "center",
      render: (text, record) => {
        if (record.phan_dinh !== 0) {
          return record.sl_ng;
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
    if (!record.phan_dinh) {
      setSelectedRow(record);
    }
  };

  const getListOption = async () => {
    setLoading(true);
    var res = await getQCLine();
    setLineOptions(res.data);
    setLoading(false);
  };

  const getQcData = async () => {
    console.log(lineOptions);
    setLoading(true);
    var overall = await getQCOverall({ ...params });
    setOverall(overall.data);
    var res = await getLotQCList({ ...params });
    setData(res.data);
    if (res.data.length > 0) {
      var current = res.data.find((e) => e.id === selectedRow?.id);
      if (
        current?.phan_dinh &&
        current?.phan_dinh !== selectedRow?.phan_dinh
      ) {
        setSelectedRow();
      }
    }
    setLoading(false);
  };

  useEffect(()=>{
    getListOption();
  }, [])
  useEffect(() => {
    if(params.machine && params.machine?.length){
      getQcData();
    }
  }, [params]);

  const onChangeLine = (value) => {
    history.push("/oi/quality/qc/" + value);
    const item = lineOptions.find(e=>e.value === value);
    setParams({...params, machine: item?.machine});
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
      machine_id: selectedRow?.machine_id,
      lot_id: selectedRow?.lot_id,
      lo_sx: selectedRow?.lo_sx,
      data: values,
    });
    getQcData();
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
            y: 350,
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
              },
            };
          }}
          components={{
            rowHoverBg: "#000000",
          }}
        />
      </Spin>
      <Checksheet1
        text="tính năng"
        open={openModalCK1}
        selectedLot={selectedRow}
        onSubmit={onSubmitResult}
        setOpen={setOpenModalCK1}
        line_id={line_id}
        machines={params.machine ?? []}
      />
      <Checksheet2
        text="ngoại quan"
        open={openModalCK2}
        selectedLot={selectedRow}
        onSubmit={onSubmitResult}
        setOpen={setOpenModalCK2}
        line_id={line_id}
      />
      <Checksheet3
        text="Số lượng phế"
        open={openModalCK3}
        selectedLot={selectedRow}
        onSubmit={onSubmitResult}
        setOpen={setOpenModalCK3}
        line_id={line_id}
      />
    </React.Fragment>
  );
};

export default withRouter(PQC_OQC);
