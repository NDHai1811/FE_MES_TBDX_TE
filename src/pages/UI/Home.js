import React from "react";
import { Row, Card, Col, Divider, Button, Typography } from "antd";
import {
  ArrowUpOutlined,
  ArrowRightOutlined,
  ArrowDownOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const data = Array.from({ length: 8 }, (_, i) => ({
  week: `W${i + 40}`,
  value: Math.floor(Math.random() * 30000),
}));

const data1 = Array.from({ length: 6 }, (_, i) => ({
  day: `11/${i + 14}`,
  value: Math.random().toFixed(2) * 2,
}));

const data2 = Array.from({ length: 6 }, (_, i) => ({
  day: `11/${i + 14}`,
  value: Math.round(Math.random() * 100),
}));

const data3 = Array.from({ length: 6 }, (_, i) => ({
  day: `11/${i + 14}`,
  value: Math.round(Math.random() * 10000),
}));

const { Title, Text } = Typography;

const HomeUi = () => {
  return (
    <Row style={{ padding: "8px" }} gutter={[8, 8]}>
      <Col span={4}>
        <Card
          style={{ height: "100%" }}
          bodyStyle={{ paddingInline: 0, paddingTop: 0 }}
        >
          <div className="mb-3">
            <Button
              type="primary"
              style={{
                backgroundColor: "orange",
                borderColor: "orange",
                borderRadius: 16,
                margin: 12,
                marginBottom: 8,
                width: 200,
              }}
            >
              Sản xuất
            </Button>
            <div style={{ marginLeft: 12, marginBottom: -8 }}>
              <Title level={4}>Tỷ lệ thực thi S&OP</Title>
              <Text style={{ fontSize: 16 }}>
                15:00 <Text style={{ fontWeight: "bold" }}>23456</Text>{" "}
                <ArrowRightOutlined style={{ color: "black" }} /> 15:01{" "}
                <Text style={{ fontWeight: "bold" }}>24234</Text>{" "}
                <Text
                  style={{ color: "red", fontWeight: "bold", fontSize: 16 }}
                >
                  (18
                  <ArrowUpOutlined style={{ color: "red" }} />)
                </Text>
              </Text>
            </div>
          </div>
          <Divider style={{ marginBottom: 0 }} />
          <div className="mb-3">
            <Button
              type="primary"
              style={{
                backgroundColor: "green",
                borderColor: "green",
                borderRadius: 16,
                margin: 12,
                marginBottom: 8,
                width: 200,
              }}
            >
              Chất lượng
            </Button>
            <div style={{ marginLeft: 12 }}>
              <Title level={4}>Tỷ lệ đạt chất lương (Q)</Title>
              <Text style={{ fontSize: 16 }}>
                15:00 <Text style={{ fontWeight: "bold" }}>23456</Text>{" "}
                <ArrowRightOutlined style={{ color: "black" }} /> 15:01{" "}
                <Text style={{ fontWeight: "bold" }}>22234</Text>{" "}
                <Text
                  style={{ color: "#1677ff", fontWeight: "bold", fontSize: 16 }}
                >
                  (5
                  <ArrowDownOutlined style={{ color: "#1677ff" }} />)
                </Text>
              </Text>
            </div>
          </div>
          <Divider style={{ marginBottom: 0 }} />
          <div className="mb-3">
            <Button
              type="primary"
              style={{
                backgroundColor: "#1677ff",
                borderColor: "#1677ff",
                borderRadius: 16,
                margin: 12,
                marginBottom: 8,
                width: 200,
              }}
            >
              Thiết bị
            </Button>
            <div style={{ marginLeft: 12, marginBottom: -8 }}>
              <Title level={4}>Hiệu suất tổng thể (OEE)</Title>
              <Text style={{ fontSize: 16 }}>
                15:00 <Text style={{ fontWeight: "bold" }}>23456</Text>{" "}
                <ArrowRightOutlined style={{ color: "black" }} /> 15:01{" "}
                <Text style={{ fontWeight: "bold" }}>22234</Text>{" "}
                <Text
                  style={{ color: "#1677ff", fontWeight: "bold", fontSize: 16 }}
                >
                  (5
                  <ArrowDownOutlined style={{ color: "#1677ff" }} />)
                </Text>
              </Text>
            </div>
          </div>
          <Divider style={{ marginBottom: 0 }} />
          <div className="mb-3">
            <Button
              type="primary"
              style={{
                backgroundColor: "grey",
                borderColor: "grey",
                borderRadius: 16,
                margin: 12,
                marginBottom: 8,
                width: 200,
              }}
            >
              Kho
            </Button>
            <div style={{ marginLeft: 12, marginBottom: -8 }}>
              <Title level={4}>Quản lý tồn kho</Title>
              <Text style={{ fontSize: 16 }}>
                15:00 <Text style={{ fontWeight: "bold" }}>23456</Text>{" "}
                <ArrowRightOutlined style={{ color: "black" }} /> 15:01{" "}
                <Text style={{ fontWeight: "bold" }}>22234</Text>{" "}
                <Text
                  style={{ color: "#1677ff", fontWeight: "bold", fontSize: 16 }}
                >
                  (5
                  <ArrowDownOutlined style={{ color: "#1677ff" }} />)
                </Text>
              </Text>
            </div>
          </div>
          <Divider style={{ marginBottom: 0 }} />
        </Card>
      </Col>
      <Col span={20}>
        <Row gutter={[4, 8]}>
          <Col span={12}>
            <Card
              title="Sản xuất"
              style={{ height: "100%" }}
              headStyle={{ textAlign: "center" }}
              bodyStyle={{ paddingInline: 0, paddingTop: 0 }}
              extra={
                <div>
                  <UnorderedListOutlined style={{ color: "red" }} />
                </div>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[0, 30000]} />
                  <Tooltip />
                  <Title style={{ fontWeight: "bold" }}>
                    Tỷ lệ thực thi S&OP
                  </Title>
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title="Chất lượng"
              style={{ height: "100%" }}
              headStyle={{ textAlign: "center" }}
              bodyStyle={{ paddingInline: 0, paddingTop: 0 }}
              extra={
                <div>
                  <UnorderedListOutlined style={{ color: "red" }} />
                </div>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={data1}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 2]} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Bar
                    dataKey="value"
                    fill="#8884d8"
                    label={{ position: "top" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
        <Row style={{ padding: "4px" }} gutter={[4, 8]}>
          <Col span={12}>
            <Card
              title="Thiết bị"
              style={{ height: "100%" }}
              headStyle={{ textAlign: "center" }}
              bodyStyle={{ paddingInline: 0, paddingTop: 0 }}
              extra={
                <div>
                  <UnorderedListOutlined style={{ color: "red" }} />
                </div>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={data2}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Bar
                    dataKey="value"
                    fill="#8884d8"
                    label={{ position: "top" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title="Kho"
              style={{ height: "100%" }}
              headStyle={{ textAlign: "center" }}
              bodyStyle={{ paddingInline: 0, paddingTop: 0 }}
              extra={
                <div>
                  <UnorderedListOutlined style={{ color: "red" }} />
                </div>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={data3}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 10000]} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Bar
                    dataKey="value"
                    fill="#8884d8"
                    label={{ position: "top" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default HomeUi;
