import React, { useState, useRef } from "react";
import {
  Button,
  Table,
  Card,
  Checkbox,
  message,
  Modal,
  Space,
  InputNumber,
  Form,
  Input,
  Col,
  Row,
  Select,
  DatePicker,
} from "antd";
import "../style.scss";
import {
  exportHistoryMonitors,
  getHistoryMonitor,
  getListLsxUseMaterial,
  getListMaterialLog,
  getListScenario,
  updateScenario,
} from "../../../api";
import background1 from "../../../assets/images/layout8.png";
import CommentBoxUI from "../../../components/CommentBoxUI";
import { useEffect } from "react";
import { getMonitor, getMonitorList } from "../../../api/db/main";
import dayjs from "dayjs";
import { baseURL } from "../../../config";
const img = {
  width: "100%",
  display: "flex",
};

const Giamsat = (props) => {
  document.title = "UI - Lịch sử bất thường";
  const [dataTable, setDataTable] = useState([]);
  const [form] = Form.useForm();
  const columns = [
    {
      title: "STT",
      dataIndex: "name1",
      key: "name1",
      render: (value, item, index) => index + 1,
    },
    {
      title: "Loại cảnh báo",
      dataIndex: "type",
      key: "type",
      render: (value, item, index) =>
        item.type == "sx"
          ? "Sản xuất"
          : item.type == "cl"
          ? "Chất lượng"
          : "Thiết bị",
    },
    {
      title: "Thời gian bắt đầu cảnh báo",
      dataIndex: "created_at",
      key: "created_at",
      render: (value, item, index) => dayjs(item.created_at).format("HH:mm:ss"),
    },
    {
      title: "Ngày cảnh báo",
      dataIndex: "created_at",
      key: "created_at",
      render: (value, item, index) =>
        dayjs(item.created_at).format("DD/MM/YYYY"),
    },
    {
      title: "Tên máy",
      dataIndex: "name",
      key: "name",
      render: (value, item, index) => item?.machine?.name,
    },
    {
      title: "Tên lỗi",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Tình trạng xử lý",
      dataIndex: "status",
      key: "status",
      render: (value, item, index) => (item.status == 0 ? "NG" : "OK"),
    },
  ];
  const [dataList, setDataList] = useState([]);
  const hanleGetMonitorList = async () => {
    var res = await getMonitorList();
    setDataList(res.data);
  };
  const [demoMonitor, setDemoMonitor] = useState();
  const hanleGetMonitorSeparate = async () => {
    var res = await getMonitor();
    setDemoMonitor(res.data);
  };
  useEffect(() => {
    hanleGetMonitorList();
    hanleGetMonitorSeparate();
  }, []);
  let interval1;
  useEffect(() => {
    interval1 = setInterval(async () => {
      hanleGetMonitorList();
    }, 5000);
    return () => clearInterval(interval1);
  }, []);
  let interval2;
  useEffect(() => {
    interval2 = setInterval(async () => {
      hanleGetMonitorSeparate();
    }, 5000);
    return () => clearInterval(interval2);
  }, []);
  const onFinish = async (values) => {
    values.start_date = dayjs(values.start_date).format("YYYY-MM-DD");
    values.end_date = dayjs(values.end_date).format("YYYY-MM-DD");
    const res = await getHistoryMonitor(values);
    setDataTable(res);
  };
  const listMC = [
    {
      code: "GL_637CIR",
      type: "cl",
      top: "6vh",
      left: "11.5vw",
    },
    {
      code: "GL_637CIR",
      type: "sx",
      top: "12vh",
      left: "2vw",
    },
    {
      code: "GL_637CIR",
      type: "tb",
      top: "8vh",
      left: "7vw",
    },
    {
      code: "SN_UV",
      type: "sx",
      top: "15vh",
      left: "13vw",
    },
    {
      code: "SN_UV",
      type: "tb",
      top: "12vh",
      left: "18vw",
    },
    {
      code: "MK1060MF",
      type: "sx",
      top: "16vh",
      left: "19vw",
    },
    {
      code: "MK1060MF",
      type: "tb",
      top: "13vh",
      left: "23vw",
    },
    {
      code: "ACE70CS",
      type: "sx",
      top: "24vh",
      left: "29vw",
    },
    {
      code: "ACE70CS",
      type: "cl",
      top: "14vh",
      left: "35vw",
    },
    {
      code: "ACE70CS",
      type: "tb",
      top: "18vh",
      left: "31.5vw",
    },
  ];
  const loadListTable = async () => {
    const res = await getHistoryMonitor();
    setDataTable(res);
  };
  useEffect(() => {
    (async () => {
      loadListTable();
      form.setFieldValue("start_date", dayjs());
      form.setFieldValue("end_date", dayjs());
    })();
  }, []);
  const option_type = [
    {
      label: "Thiết bị",
      value: "tb",
    },
    {
      label: "Chất lượng",
      value: "cl",
    },
    {
      label: "Sản xuất",
      value: "sx",
    },
  ];
  const option_status = [
    {
      label: "OK",
      value: 0,
    },
    {
      label: "NG",
      value: 1,
    },
  ];
  const option_machine = [
    {
      label: "MÁY IN TỜ RỜI  KOMORI",
      value: "GL_637CIR",
    },
    {
      label: "MÁY PHỦ UV CỤC BỘ",
      value: "SN_UV",
    },
    {
      label: "MÁY BẾ TỜ RỜI",
      value: "MK1060MF",
    },
    {
      label: "MÁY GẤP HỘP",
      value: "ACE70CS",
    },
  ];
  const [exportLoading1, setExportLoading1] = useState(false);
  const exportFile = async () => {
    setExportLoading1(true);
    console.log(form.getFieldsValue(true));
    const res = await exportHistoryMonitors(form.getFieldsValue(true));
    if (res.success) {
      window.location.href = baseURL + res.data;
    }
    setExportLoading1(false);
  };
  return (
    <React.Fragment>
      <Card className="mt-3" title="Lịch sử bất thường">
        <Form layout={"vertical"} form={form} onFinish={onFinish}>
          <Row gutter={[16, 16]}>
            <Col span={4}>
              <Form.Item label="Bắt đầu" name="start_date">
                <DatePicker
                  allowClear={false}
                  placeholder="Bắt đầu"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Kết thúc" name="end_date">
                <DatePicker
                  allowClear={false}
                  placeholder="Kết thúc"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Loại cảnh báo" name="type">
                <Select
                  options={option_type}
                  placeholder="Chọn loại cảnh báo"
                  allowClear
                ></Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Tên máy" name="machine_id">
                <Select
                  options={option_machine}
                  placeholder="Chọn máy"
                  allowClear
                ></Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Tình trạng xử lý" name="status">
                <Select
                  options={option_status}
                  placeholder="Chọn tình trạng xử lý"
                  allowClear
                ></Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Space>
                <Button
                  htmlType="submit"
                  type="primary"
                  style={{ marginTop: "30px" }}
                >
                  Truy vấn
                </Button>
                <Button
                  type="primary"
                  style={{ marginTop: "30px" }}
                  onClick={exportFile}
                  loading={exportLoading1}
                >
                  Xuất Excel
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Table
              columns={columns}
              dataSource={dataTable}
              bordered
              pagination={true}
            />
          </Col>
          <Col span={12}>
            <div
              style={{
                position: "relative",
                width: "100%",
                backgroundColor: "white",
                float: "right",
              }}
            >
              {demoMonitor?.length > 0 ? (
                demoMonitor.map((value) => {
                  return (
                    <CommentBoxUI
                      title={value?.type?.toUpperCase()}
                      content={value?.content}
                      type={
                        value?.type === "sx"
                          ? "error"
                          : value?.type === "cl"
                          ? "warning"
                          : "success"
                      }
                      color={
                        value?.type === "sx"
                          ? "#90f"
                          : value?.type === "cl"
                          ? "#AA0000"
                          : "#00f"
                      }
                      top={
                        listMC.find(
                          (val) =>
                            val.code === value?.machine_id &&
                            val.type === value.type
                        )?.top
                      }
                      left={
                        listMC.find(
                          (val) =>
                            val.code == value?.machine_id &&
                            val.type === value.type
                        )?.left
                      }
                    />
                  );
                })
              ) : (
                <></>
              )}
              <img style={img} src={background1} />
            </div>
          </Col>
        </Row>
      </Card>
    </React.Fragment>
  );
};

export default Giamsat;
