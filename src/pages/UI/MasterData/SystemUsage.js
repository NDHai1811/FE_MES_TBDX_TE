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
  Input,
  theme,
  Select,
  AutoComplete,
  Upload,
  message,
  Checkbox,
  Space,
  Modal,
  Spin,
  Popconfirm,
  Badge,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useRef, useEffect } from "react";
import {
  createUsers,
  deleteUsers,
  exportUsers,
  getSystemUsage,
  getUserRoles,
  getUsers,
  updateUsers,
} from "../../../api";
import { useProfile } from "../../../components/hooks/UserHooks";
import { Column } from "@ant-design/plots";
import "./masterDataStyle.css"
import dayjs from "dayjs";

const SystemUsage = () => {
  document.title = "Đánh giá tỷ lệ sử dụng MES";
  const [params, setParams] = useState({
    start_date: dayjs().add(-7, 'days'),
    end_date: dayjs(),
  });
  const [columns, setColumns] = useState([]);

  function btn_click() {
    loadListTable(params);
  }

  const [data, setData] = useState([]);
  const [usageData, setUsageData] = useState({});
  const loadListTable = async (params) => {
    setLoading(true);
    const res = await getSystemUsage(params);
    setUsageData(res.data);
    const parsedColumns = []
    parsedColumns.push(
      {
        title: "Kiểm tra",
        dataIndex: "title",
        align: "center",
        width: 250,
      },
      {
        title: "",
        dataIndex: "maximum",
        align: "center",
        width: 70,
      }
    );
    const keyData = ['usage_time', 'maintain_statistic', 'pqc_processing', 'khuon_data'];
    const typeData = ['rate', 'score'];
    Object.keys(res.data).map(date => {
      typeData.map(type => {
        parsedColumns.push({
          title: date,
          dataIndex: `${date}-${type}`,
          align: "center",
          colSpan: type === 'rate' ? 2 : 0,
          width: 70,
        })
      })
    });
    const parsedData = [];
    keyData.map(e => {
      let row = { maximum: 25 };
      switch (e) {
        case 'usage_time':
          row['title'] = '1. Kiểm tra số lần truy cập user';
          break;
        case 'maintain_statistic':
          row['title'] = '2. Kiểm tra kế hoạch đăng ký bảo trì';
          break;
        case 'pqc_processing':
          row['title'] = '3. Kiểm tra PQC';
          break;
        case 'khuon_data':
          row['title'] = '4. Kiểm tra dữ liệu khuôn bế';
          break;
        default:
          break;
      }
      Object.keys(res.data).map(date => {
        typeData.map(type => {
          let value = res.data[date][e][type] ?? 0;
          if (type === 'rate') {
            value = `${Math.round((parseFloat(value) * 100) * 100) / 100}%`;
          }else{
            value = Math.round(value * 100) / 100
          }
          row[`${date}-${type}`] = value;
        })
      });
      parsedData.push(row);
    })
    console.log(parsedData);

    setColumns(parsedColumns);
    setData(parsedData);
    setLoading(false);
  };
  useEffect(() => {
    loadListTable(params);
  }, []);
  const [loading, setLoading] = useState(false);
  const Chart = () => {
    const chartData = Object.entries(usageData).map(([date, details]) => ({
      date,
      total: details.total,
    }));
    console.log(chartData);

    const config = {
      data: chartData,
      animation: false,
      xField: "date",
      yField: "total",
      columnWidthRatio: 0.8,
      label: {
        position: "middle"
      },
      xAxis: {
        label: {
          autoRotate: true, // Tự động xoay nhãn khi không đủ không gian
          autoHide: false // Không ẩn nhãn (bạn có thể đặt true nếu cần)
        }
      },
      yAxis: {
        max: 100 // Giới hạn trục tung tối đa 100
      },
      color: "#1890ff",
      meta: {
        date: { alias: "Ngày" },
        total: { alias: "Tổng điểm" }
      },
      height: 380 // Giới hạn chiều cao của biểu đồ
    };

    return <Column {...config} style={{ width: "100%", height: "380" }} />;
  };

  return (
    <>
      <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
        <Col span={4}>
          <div className="slide-bar">
            <Card style={{ height: "100%" }} bodyStyle={{ padding: 0 }} className="custom-card" actions={[
              <Button
                type="primary"
                onClick={btn_click}
                style={{ width: "80%" }}
              >
                Tìm kiếm
              </Button>
            ]}>
              <Divider>Thời gian truy vấn</Divider>
              <div className="mb-3">
                <Form style={{ margin: "0 15px" }} layout="vertical">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <DatePicker
                      allowClear={false}
                      placeholder="Bắt đầu"
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        setParams({ ...params, start_date: value })
                      }
                      value={params.start_date}
                    />
                    <DatePicker
                      allowClear={false}
                      placeholder="Kết thúc"
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        setParams({ ...params, end_date: value })
                      }
                      value={params.end_date}
                    />
                  </Space>
                </Form>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={20}>
          <Spin spinning={loading}>
            <Card
              style={{ height: '100%' }}
              styles={
                {
                  body: {

                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }
                }}
              title="Đánh giá tỷ lệ sử dụng MES"
              className="custom-card scroll system-usage-card"
            >

              <Table
                size="small"
                bordered
                pagination={false}
                scroll={{
                  x: "100%",
                  y: '380',
                }}
                columns={columns}
                dataSource={data}
                // rowSelection={rowSelection}
                summary={(pageData) => {
                  const dateTotals = {};
                  // Tính tổng giá trị của cột "maximum" và "score"
                  pageData.forEach((row) => {
                    Object.keys(row).forEach((key) => {
                      const match = key.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})-score/);
                      if (match) {
                        const date = match[1];
                        dateTotals[date] = (dateTotals[date] || 0) + row[key];
                      }
                    });
                  });

                  return (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} align="center"><strong>TOTAL</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="center"><strong>100</strong></Table.Summary.Cell>
                      {Object.keys(dateTotals).map((date, index) => (
                        <>
                          <Table.Summary.Cell index={2 + index * 2} align="center"></Table.Summary.Cell>
                          <Table.Summary.Cell index={3 + index * 2} align="center"><strong>{dateTotals[date]}</strong></Table.Summary.Cell>
                        </>
                      ))}
                    </Table.Summary.Row>
                  );
                }}
              />
              <Chart />
            </Card>
          </Spin>
        </Col>
      </Row>
    </>
  );
};

export default SystemUsage;
