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
  getIQCOverall,
  getQCOverall,
  getLotIQCList,
  getLotQCList,
  getQCLine,
  sendIQCResult,
  sendQCResult,
} from "../../../api/oi/quality";
import { COMMON_DATE_FORMAT } from "../../../commons/constants";
import Checksheet2 from "../../../components/Popup/Checksheet2";
import dayjs from "dayjs";
import Checksheet1 from "../../../components/Popup/Checksheet1";
import { useRef } from "react";
import IQC from "./IQC";
import PQC_OQC from "./PQC_OQC";

const QCByLine = (props) => {
  document.title = "Kiểm tra chất lượng";
  const { line_id } = useParams();
  // const history = useHistory();
  // const [machines, setMachines] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [selectedRow, setSelectedRow] = useState();
  // const [data, setData] = useState([]);
  // const [lineOptions, setLineOptions] = useState([]);
  // const [params, setParams] = useState({line_id: line_id, start_date: dayjs(), end_date: dayjs()});
  // const [overall, setOverall] = useState([]);
  // const { userProfile } = useProfile();
  // const [openModalCK1, setOpenModalCK1] = useState(false);
  // const [openModalCK2, setOpenModalCK2] = useState(false);
  // const qcPermission = ["pqc", "oqc", "iqc"].filter((value) =>
  //   (userProfile?.permission ?? []).includes(value)
  // );
  // const userPermissions = JSON.parse(
  //   window.localStorage.getItem("authUser")
  // ).permission;
  // const isGetOption = useRef(false);

  // const isIqc = userPermissions?.some((val) => val === "iqc");

  // const overallColumns = [
  //   {
  //     title: qcPermission.length > 0 ? "IQC/PQC/OQC" : "Công đoạn",
  //     dataIndex: "cong_doan",
  //     key: "cong_doan",
  //     align: "center",
  //     render: () => (
  //       <Select
  //         options={lineOptions}
  //         value={line_id}
  //         onChange={onChangeLine}
  //         style={{ width: "100%" }}
  //         bordered={false}
  //       />
  //     ),
  //   },
  //   {
  //     title: "Số lượng kiểm tra",
  //     dataIndex: "sl_kiem_tra",
  //     key: "sl_kiem_tra",
  //     align: "center",
  //   },
  //   {
  //     title: "Số lượng đạt",
  //     dataIndex: "sl_ok",
  //     key: "sl_ok",
  //     align: "center",
  //   },
  //   {
  //     title: "Số phế",
  //     dataIndex: "sl_ng",
  //     key: "sl_ng",
  //     align: "center",
  //   },
  //   {
  //     title: "Tỉ lệ OK",
  //     dataIndex: "ti_le",
  //     key: "ti_le",
  //     align: "center",
  //   },
  // ];

  // const checkingTable = [
  //   {
  //     title: line_id === "iqc" ? "Mã cuộn" : "Lô SX",
  //     dataIndex: line_id === "iqc" ? "ma_cuon_ncc" : "lo_sx",
  //     key: line_id === "iqc" ? "ma_cuon_ncc" : "lo_sx",
  //     align: "center",
  //     width: "30%",
  //   },
  //   {
  //     title: "Kiểm tra tính năng",
  //     dataIndex: "sl_tinh_nang",
  //     key: "sl_tinh_nang",
  //     align: "center",
  //     width: "20%",
  //     onHeaderCell: (column) => {
  //       return {
  //         onClick: () => {
  //           selectedRow?.checked_tinh_nang === false && setOpenModalCK1(true);
  //         },
  //       };
  //     },
  //     render: (text, record) => {
  //       if (record.phan_dinh !== 0) {
  //         if (line_id === "iqc") {
  //           return record.phan_dinh === 1 ? 0 : 1;
  //         } else {
  //           return record.sl_tinh_nang;
  //         }
  //       } else {
  //         return "-";
  //       }
  //     },
  //   },
  //   {
  //     title: "Kiểm tra ngoại quan",
  //     dataIndex: "sl_ngoai_quan",
  //     key: "sl_ngoai_quan",
  //     align: "center",
  //     width: "20%",
  //     onHeaderCell: (column) => {
  //       return {
  //         onClick: () => {
  //           selectedRow?.checked_ngoai_quan === false && setOpenModalCK2(true);
  //         },
  //       };
  //     },
  //     render: (text, record) => {
  //       if (record.phan_dinh !== 0) {
  //         if (line_id === "iqc") {
  //           return record.phan_dinh === 1 ? 0 : 1;
  //         } else {
  //           return record.sl_ngoai_quan;
  //         }
  //       } else {
  //         return "-";
  //       }
  //     },
  //   },
  //   {
  //     title: "Số phế",
  //     dataIndex: "sl_ng_qc",
  //     key: "sl_ng_qc",
  //     align: "center",
  //     width: "14%",
  //     onHeaderCell: (column) => {
  //       return {
  //         onClick: () => {
  //           selectedRow?.checked_sl_ng === false &&
  //             line_id !== "iqc" &&
  //             setOpenModal1(true);
  //         },
  //       };
  //     },
  //     render: (text, record) => {
  //       if (record.phan_dinh !== 0) {
  //         if (line_id === "iqc") {
  //           return record.phan_dinh === 1 ? 0 : 1;
  //         } else {
  //           return record.sl_ng;
  //         }
  //       } else {
  //         return "-";
  //       }
  //     },
  //   },
  //   {
  //     title: "Phán định",
  //     dataIndex: "phan_dinh",
  //     key: "phan_dinh",
  //     align: "center",
  //     render: (value) => {
  //       switch (value) {
  //         case 0:
  //           return "waiting";
  //         case 1:
  //           return "OK";
  //         case 2:
  //           return "NG";
  //         default:
  //           return "";
  //       }
  //     },
  //   },
  // ];

  // const columns = [
  //   {
  //     title: line_id === "iqc" ? "Mã cuộn" : "Lô SX",
  //     dataIndex: line_id === "iqc" ? "ma_cuon_ncc" : "lo_sx",
  //     key: line_id === "iqc" ? "ma_cuon_ncc" : "lo_sx",
  //     align: "center",
  //   },
  //   {
  //     title: line_id === "iqc" ? "Nhà cung cấp" : "Khách hàng",
  //     dataIndex: line_id === "iqc" ? "ten_ncc" : "khach_hang",
  //     key: line_id === "iqc" ? "ten_ncc" : "khach_hang",
  //     align: "center",
  //   },
  //   {
  //     title: "Sản lượng đầu ra",
  //     dataIndex: "sl_dau_ra_hang_loat",
  //     key: "sl_dau_ra_hang_loat",
  //     align: "center",
  //   },
  //   {
  //     title: "Số lượng đạt",
  //     dataIndex: "sl_ok",
  //     key: "sl_ok",
  //     align: "center",
  //   },
  //   {
  //     title: "SL lỗi tính năng",
  //     dataIndex: "sl_tinh_nang",
  //     key: "sl_loi",
  //     align: "center",
  //     render: (text, record) => {
  //       if (record.phan_dinh !== 0) {
  //         if (line_id === "iqc") {
  //           return record.phan_dinh === 1 ? 0 : 1;
  //         } else {
  //           return record.sl_tinh_nang;
  //         }
  //       } else {
  //         return "-";
  //       }
  //     },
  //   },
  //   {
  //     title: "SL lỗi ngoại quan",
  //     dataIndex: "sl_ngoai_quan",
  //     key: "sl_ngoai_quan",
  //     align: "center",
  //     render: (text, record) => {
  //       if (record.phan_dinh !== 0) {
  //         if (line_id === "iqc") {
  //           return record.phan_dinh === 1 ? 0 : 1;
  //         } else {
  //           return record.sl_ngoai_quan;
  //         }
  //       } else {
  //         return "-";
  //       }
  //     },
  //   },
  //   {
  //     title: "Tổng phế",
  //     dataIndex: "sl_ng",
  //     key: "sl_ng",
  //     align: "center",
  //     render: (text, record) => {
  //       if (record.phan_dinh !== 0) {
  //         if (line_id === "iqc") {
  //           return record.phan_dinh === 1 ? 0 : 1;
  //         } else {
  //           return record.sl_ng;
  //         }
  //       } else {
  //         return "-";
  //       }
  //     },
  //   },
  //   {
  //     title: "Phán định",
  //     dataIndex: "phan_dinh",
  //     key: "phan_dinh",
  //     align: "center",
  //     render: (value) => {
  //       switch (value) {
  //         case 0:
  //           return "waiting";
  //         case 1:
  //           return "OK";
  //         case 2:
  //           return "NG";
  //         default:
  //           return "";
  //       }
  //     },
  //   },
  // ];

  // const handleInputChange = (record, value) => {
  //   const newData = [...data];
  //   const index = newData.findIndex((item) => record.key === item.key);
  //   newData[index].sl_ng_qc = value;
  //   setData(newData);
  // };

  // const rowClassName = (record, index) => {
  //   if (line_id === "iqc") {
  //     if (record.ma_cuon_ncc === selectedRow?.ma_cuon_ncc) {
  //       return "table-row-green";
  //     }
  //   } else {
  //     if (record.id === selectedRow?.id) {
  //       return "table-row-green";
  //     }
  //   }
  //   switch (record.iqc) {
  //     case 0:
  //       return "";
  //     case 1:
  //       return "table-row-grey";
  //     case 2:
  //       return "table-row-red";
  //     default:
  //       return "";
  //   }
  // };

  // const onClickRow = (event, record) => {
  //   if (!record.phan_dinh) {
  //     setSelectedRow(record);
  //   }
  // };

  // const onDBClickRow = (event, record, index) => {
  //   if (!record.phan_dinh) {
  //     setSelectedRow(record);
  //   }
  // };

  // const getListOption = async () => {
  //   if (!isGetOption.current) {
  //     isGetOption.current = true;
  //     setLoading(true);
  //     var res = await getQCLine();
  //     const items = res.data.filter?.((val) => val.value !== "iqc");
  //     line_id !== "iqc" && setParams({...params, machine: items[0]?.machine});
  //     setLineOptions(
  //       res.data.filter?.((val) =>
  //         isIqc ? val.value === "iqc" : val.value !== "iqc"
  //       )
  //     );
  //     if(line_id==='iqc'){
  //       isGetOption.current = false;
  //     }
  //     setLoading(false);
  //   }
  // };

  // async function getData() {
  //   if(line_id){
  //     setLoading(true);
  //     var overall = await getIQCOverall({ ...params});
  //     setOverall(overall.data);
  //     var res = await getLotIQCList({ ...params});
  //     setData(res.data);
  //     if (res.data.length > 0) {
  //       var current = res.data.find((e) => e.id === selectedRow?.id);
  //       if (
  //         current?.log?.phan_dinh &&
  //         current?.log?.phan_dinh !== selectedRow?.log?.phan_dinh
  //       ) {
  //         setSelectedRow();
  //       }
  //     }
  //   }
    
  //   setLoading(false);
  // }

  // const getQcData = async () => {
    
  //   if(params?.machine?.length){
  //     setLoading(true);
  //     var overall = await getQCOverall({ ...params});
  //     setOverall(overall.data);
  //     var res = await getLotQCList({ ...params});
  //     setData(res.data);
  //     if (res.data.length > 0) {
  //       var current = res.data.find((e) => e.id === selectedRow?.id);
  //       if (
  //         current?.log?.phan_dinh &&
  //         current?.log?.phan_dinh !== selectedRow?.log?.phan_dinh
  //       ) {
  //         setSelectedRow();
  //       }
  //     }
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   if (line_id === "iqc" && isIqc) {
  //     getData();
  //     getListOption();
  //   } else {
  //     getQcData();
  //     getListOption();
  //   }
  // }, [params]);

  // const onChangeLine = (value) => {
  //   const item = lineOptions?.find((val) => val.value === value);
  //   setParams({...params, machine: item?.machine});
  //   if (qcPermission.length > 0) {
  //     history.push("/quality/qc/" + value);
  //   } else {
  //     history.push("/quality/sx/" + value);
  //   }
  // };
  // const [form1] = Form.useForm();
  // const [form2] = Form.useForm();
  // const onSubmitSLP = async (values) => {
  //   if (selectedRow?.lot_id) {
  //     onSubmitResult(values);
  //   }
  //   setOpenModal1(false);
  //   form1.resetFields();
  // };
  // const onSubmitPhanDinh = async (values) => {
  //   if (selectedRow?.lot_id) {
  //     onSubmitResult(values);
  //   }
  //   setOpenModal2(false);
  //   form2.resetFields();
  // };

  // const [openModal1, setOpenModal1] = useState(false);
  // const [openModal2, setOpenModal2] = useState(false);

  // const onSubmitResult = async (values) => {
  //   if (values?.tinh_nang) {
  //     setSelectedRow({ ...selectedRow, checked_tinh_nang: true });
  //   } else if (values?.ngoai_quan) {
  //     setSelectedRow({ ...selectedRow, checked_ngoai_quan: true });
  //   } else if (values?.sl_ng_sx) {
  //     setSelectedRow({ ...selectedRow, checked_sl_ng: true });
  //   }
  //   if (line_id === "iqc") {
  //     var res = await sendIQCResult({
  //       line_id: line_id,
  //       ma_cuon_ncc: selectedRow?.ma_cuon_ncc,
  //       lo_sx: selectedRow?.lo_sx,
  //       data: values,
  //     });
  //   } else {
  //     var res = await sendQCResult({
  //       machine_id: selectedRow?.machine_id,
  //       lot_id: selectedRow?.lot_id,
  //       lo_sx: selectedRow?.lo_sx,
  //       data: values,
  //     });
  //   }
  //   if (line_id === "iqc" && isIqc) {
  //     getData();
  //   } else {
  //     getQcData();
  //   }
  // };
  return (
    <React.Fragment>
      {/* <Spin spinning={loading}>
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
        text="tính năng"
        open={openModalCK1}
        selectedLot={selectedRow}
        onSubmit={onSubmitResult}
        setOpen={setOpenModalCK1}
        line_id={line_id}
      />
      <Checksheet2
        text="ngoại quan"
        open={openModalCK2}
        selectedLot={selectedRow}
        onSubmit={onSubmitResult}
        setOpen={setOpenModalCK2}
        line_id={line_id}
      /> */}
      {line_id === 'iqc' ? <IQC/> : <PQC_OQC/>}
    </React.Fragment>
  );
};

export default withRouter(QCByLine);
