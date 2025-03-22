import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Col,
  Row,
  Card,
  Table,
  Tag,
  Layout,
  Divider,
  Button,
  Form,
  Select,
  AutoComplete,
  Progress,
  Space,
  Tree,
} from "antd";
import "../style.scss";
import {
  exportKPI,
} from "../../../api/ui/main";
import dayjs from "dayjs";
import { baseURL } from "../../../config";
import TyLeKeHoach from "./Chart/TyLeKeHoachSong";
import { kpiTonKhoNVL, kpiTonKhoTP, kpiTyLeKeHoach, kpiTyLeKeHoachIn, kpiTyLeLoiMay, kpiTyLeNGOQC, kpiTyLeNGPQC, kpiTyLeVanHanh } from "../../../api/ui/kpi";
import TonKhoNVL from "./Chart/TonKhoNVL";
import TyLeNGPQC from "./Chart/TyLeNGPQC";
import TyLeVanHanhThietBi from "./Chart/TyLeVanHanhThietBi";
import TyLeKeHoachSong from "./Chart/TyLeKeHoachSong";
import TyLeKeHoachIn from "./Chart/TyLeKeHoachIn";
import TyLeKeLoiMay from "./Chart/TyLeKeLoiMay";
import TonKhoTP from "./Chart/TonKhoTP";
import TyLeNGOQC from "./Chart/TyLeNGOQC";

const { Sider } = Layout;
const { RangePicker } = DatePicker;

const KPI = (props) => {
  document.title = "UI - KPI";
  const [listLines, setListLines] = useState([]);
  const [params, setParams] = useState({
    start_date: dayjs().subtract(6, "days"),
    end_date: dayjs(),
  });

  useEffect(() => {
    btn_click();
  }, []);

  const [tyLeKeHoachSong, setTyLeKeHoachSong] = useState({ data: {}, loading: false });
  const [tonKhoNVL, setTonKhoNVL] = useState({ data: {}, loading: false });
  const [tyLeNGPQC, setTyleNGPQC] = useState({ data: {}, loading: false });
  const [tyLeVanHanhTB, setTyLeVanHanhTB] = useState({ data: {}, loading: false });
  const [tyLeKeHoachIn, setTyLeKeHoachIn] = useState({ data: {}, loading: false });
  const [tyLeLoiMay, setTyLeLoiMay] = useState({ data: {}, loading: false });
  const [tonKhoTP, setTonKhoTP] = useState({ data: {}, loading: false });
  const [tyLeNGOQC, setTyleNGOQC] = useState({ data: {}, loading: false });
  const fetchChart1 = async () => {
    setTyLeKeHoachSong({ ...tyLeKeHoachSong, loading: true });
    var res = await kpiTyLeKeHoach(params);
    setTyLeKeHoachSong({ data: res.data, loading: false });
  }
  const fetchChart2 = async () => {
    setTonKhoNVL({ ...tonKhoNVL, loading: true });
    var res = await kpiTonKhoNVL(params);
    setTonKhoNVL({ data: res.data, loading: false });
  }
  const fetchChart3 = async () => {
    setTyleNGPQC({ ...tyLeNGPQC, loading: true });
    var res = await kpiTyLeNGPQC(params);
    setTyleNGPQC({ data: res.data, loading: false });
  }
  const fetchChart4 = async () => {
    setTyLeVanHanhTB({ ...tyLeVanHanhTB, loading: true });
    var res = await kpiTyLeVanHanh(params);
    setTyLeVanHanhTB({ data: res.data, loading: false });
  }
  const fetchChart5 = async () => {
    setTyLeKeHoachIn({ ...tyLeKeHoachIn, loading: true });
    var res = await kpiTyLeKeHoachIn(params);
    setTyLeKeHoachIn({ data: res.data, loading: false });
  }
  const fetchChart6 = async () => {
    setTonKhoTP({ ...tonKhoTP, loading: true });
    var res = await kpiTonKhoTP(params);
    setTonKhoTP({ data: res.data, loading: false });
  }
  const fetchChart7 = async () => {
    setTyleNGOQC({ ...tyLeNGOQC, loading: true });
    var res = await kpiTyLeNGOQC(params);
    setTyleNGOQC({ data: res.data, loading: false });
  }
  const fetchChart8 = async () => {
    setTyLeLoiMay({ ...tyLeLoiMay, loading: true });
    var res = await kpiTyLeLoiMay(params);
    setTyLeLoiMay({ data: res.data, loading: false });
  }
  async function btn_click() {
    fetchChart1();
    fetchChart2();
    fetchChart3();
    fetchChart4();
    fetchChart5();
    fetchChart7();
    fetchChart8();
    fetchChart6();
  }
  return (
    <React.Fragment>
      <Row
        gutter={[8, 8]}
        style={{
          padding: "8px", marginRight: 0
        }}
      >
        <Col span={4}>
            <Card bodyStyle={{ paddingInline: 0, paddingTop: 0, height: 'calc(100vh - 80px)' }} >
              <Divider>Thời gian truy vấn</Divider>
              <Row style={{ margin: "0 15px" }}>
                <Col span={24}>
                  <Form.Item name="start_date">
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <DatePicker
                        allowClear={false}
                        placeholder="Bắt đầu"
                        style={{ width: "100%" }}
                        value={params.start_date}
                        onChange={(value) =>
                          setParams({
                            ...params,
                            start_date: value,
                          })
                        }
                      />
                      <DatePicker
                        allowClear={false}
                        placeholder="Kết thúc"
                        style={{ width: "100%" }}
                        value={params.end_date}
                        onChange={(value) =>
                          setParams({
                            ...params,
                            end_date: value,
                          })
                        }
                      />
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
              <div
                style={{
                  padding: "10px",
                  textAlign: "center",
                }}
                layout="vertical"
              >
                <Button
                  type="primary"
                  style={{ width: "80%" }}
                  onClick={btn_click}
                >
                  Truy vấn
                </Button>
              </div>
            </Card>
        </Col>
        <Col span={20}>
          <Row gutter={[8, 8]} style={{overflowY: 'auto', height: 'calc(100vh - 80px)'}}>
            <Col span={24}>
              <Row gutter={[8, 8]}>
                <Col sm={24} md={12} lg={12} xl={12}>
                  <TyLeKeHoachSong {...tyLeKeHoachSong} />
                </Col>
                <Col sm={24} md={12} lg={12} xl={12}>
                  <TyLeKeHoachIn {...tyLeKeHoachIn} />
                </Col>
                <Col sm={24} md={12} lg={12} xl={12}>
                  <TonKhoNVL {...tonKhoNVL} />
                </Col>
                <Col sm={24} md={12} lg={12} xl={12}>
                  <TonKhoTP {...tonKhoTP} />
                </Col>
                <Col sm={24} md={12} lg={12} xl={12}>
                  <TyLeNGPQC {...tyLeNGPQC} />
                </Col>
                <Col sm={24} md={12} lg={12} xl={12}>
                  <TyLeNGOQC {...tyLeNGOQC} />
                </Col>
                <Col sm={24} md={12} lg={12} xl={12}>
                  <TyLeVanHanhThietBi {...tyLeVanHanhTB} />
                </Col>
                <Col sm={24} md={12} lg={12} xl={12}>
                  <TyLeKeLoiMay {...tyLeLoiMay} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default KPI;
