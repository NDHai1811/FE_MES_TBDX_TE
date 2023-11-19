import React, { useEffect, useState } from "react";
import { CloseOutlined, QrcodeOutlined } from "@ant-design/icons";
import {
  Layout,
  Row,
  Col,
  Divider,
  Button,
  Table,
  Modal,
  Select,
  Input,
  Switch,
} from "antd";
//redux
import logolight from "../../assets/images/logo.png";
import { withRouter, Link } from "react-router-dom";
import CardInfo from "./components/CardInfo";
import ScanQR from "./components/ScanQR";
import ButtonGroup from "antd/es/button/button-group";
const { Header, Content } = Layout;
const headerStyle = {
  textAlign: "center",
  color: "#2462a3",
  height: 56,
  paddingInline: "1em",
  lineHeight: "32px",
  backgroundColor: "#2462a3",
};
const btnCustom = {
  width: "100%",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
  border: "1px solid #fff",
  borderRadius: "20px",
  backgroundImage: "linear-gradient(to right, #68beea , #273c93)",
};
const btnCustomTab = {
  backgroundColor: "#3750a2",
  width: "100%",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
  border: "1px solid #fff",
  padding: "0 5px",
};
const btnCustomTabActive = {
  width: "100%",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
  border: "1px solid #fff",
  padding: "0 5px",
};
const data = [
  {
    name1: "1",
    name2: "LSX001",
    name3: "AC001",
    name4: "200",
    name5: "150",
  },
  {
    name1: "2",
    name2: "LSX002",
    name3: "AC002",
    name4: "300",
    name5: "250",
  },
  {
    name1: "3",
    name2: "LSX003",
    name3: "AC003",
    name4: "200",
    name5: "150",
  },
  {
    name1: "4",
    name2: "LSX004",
    name3: "AC004",
    name4: "200",
    name5: "150",
  },
  {
    name1: "5",
    name2: "LSX005",
    name3: "AC005",
    name4: "200",
    name5: "150",
  },
  {
    name1: "6",
    name2: "LSX006",
    name3: "AC006",
    name4: "200",
    name5: "150",
  },
  {
    name1: "6",
    name2: "LSX006",
    name3: "AC006",
    name4: "200",
    name5: "150",
  },
  {
    name1: "6",
    name2: "LSX006",
    name3: "AC006",
    name4: "200",
    name5: "150",
  },
];
const columns = [
  {
    title: "NO",
    dataIndex: "name1",
    key: "name1",
  },
  {
    title: "LSX",
    dataIndex: "name2",
    key: "name2",
  },
  {
    title: "MSSP",
    dataIndex: "name3",
    key: "name3",
  },
  {
    title: "ĐẦU VÀO",
    dataIndex: "name4",
    key: "name4",
  },
  {
    title: "ĐẦU RA",
    dataIndex: "name5",
    key: "name5",
  },
];
const OI01 = (props) => {
  document.title = "Sản xuất";
  const [resultQR, setResultQr] = useState("");
  const [isOpenModal1, setIsOpenModal1] = useState(false);
  const [isOpenModal2, setIsOpenModal2] = useState(false);
  const [isOpenModal3, setIsOpenModal3] = useState(false);
  const [isScan, setIsScan] = useState(0);
  const [listMachine, setListMachine] = useState([]);

  const handleCloseMdl = () => {
    setIsScan(2);
  };
  // useEffect(() => {
  //     if (isScan === 1) {
  //         setIsModalOpen(true);
  //     } else if (isScan === 2) {
  //         setIsModalOpen(false);
  //     }
  // }, [isScan])
  const items = [
    {
      label: <a href="https://www.antgroup.com">1st menu item</a>,
      key: "0",
    },
    {
      label: <a href="https://www.aliyun.com">2nd menu item</a>,
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: "3rd menu item",
      key: "3",
    },
  ];

  const openModal2 = () => {
    setIsOpenModal2(true);
  };

  const closeModal2 = () => {
    setIsOpenModal2(false);
  };

  const openModal3 = () => {
    setIsOpenModal3(true);
  };

  const closeModal3 = () => {
    setIsOpenModal3(false);
  };

  const openModal1 = () => {
    setIsOpenModal1(true);
  };

  const closeModal1 = () => {
    setIsOpenModal1(false);
  };

  return (
    <>
      <React.Fragment>
        <Layout style={{ height: "100%", backgroundColor: "#e3eaf0" }}>
          <Header style={headerStyle}>
            <Row>
              <Col span={5} className="text-start d-flex">
                <img
                  style={{ height: "50%", margin: "auto 0" }}
                  src={logolight}
                />
              </Col>
              <Col span={14} className="align-self-center">
                <h4 className="text-white mb-0">QUẢN LÝ SẢN XUẤT</h4>
              </Col>
              <Col span={5} className="text-end d-flex justify-content-end">
                <Link to={"/screen"} style={{ margin: "auto 0" }}>
                  <CloseOutlined
                    className="text-white"
                    style={{ fontSize: "1.4em" }}
                  />
                </Link>
              </Col>
            </Row>
          </Header>
          <Content style={{ paddingInline: "0.5em" }}>
            <Row gutter={[6, 6]} className="mt-4">
              <Col span={4}>
                <CardInfo
                  title="Line"
                  type="select"
                  content={
                    <Select
                      placeholder="Chọn máy"
                      style={{ width: "100%" }}
                      bordered={false}
                    >
                      <option value="1">Máy 1</option>
                      <option value="2">Máy 2</option>
                    </Select>
                  }
                />
              </Col>
              <Col span={4}>
                <CardInfo title="SL KH ngày" type="text" content="1000" />
              </Col>
              <Col span={4}>
                <CardInfo title="UPH" type="text" content="500" />
              </Col>
              <Col span={4}>
                <CardInfo title="SL T.Tế" type="text" content="500" />
              </Col>
              <Col span={4}>
                <CardInfo title="SL Tem vàng" type="text" content="450" />
              </Col>
              <Col span={4}>
                <CardInfo title="SL NG" type="text" content="450" />
              </Col>
            </Row>

            <Button type="primary" onClick={openModal1}>
              Open Modal
            </Button>

            {/* Modal kiểm tra chỉ tiêu */}
            <Modal
              title="Kiểm tra chỉ tiêu 1"
              open={isOpenModal1}
              onCancel={closeModal1}
              footer=""
            >
              <Row justify="space-around" align="middle" className="mb-1">
                <Col span={16}>
                  <p style={{ marginBottom: "0px" }}>Tiêu chuẩn kiểm tra 1</p>
                </Col>
                <Col span={8}>
                  <ButtonGroup style={{ borderRadius: "5px", width: "100%" }}>
                    <Button
                      type=""
                      style={{
                        backgroundColor: "#55c32a",
                        color: "white",
                        width: "50%",
                        borderColor: "#55c32a",
                        borderRight: "0px",
                      }}
                    >
                      OK
                    </Button>
                    <Button
                      type=""
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#2462A3",
                        width: "50%",
                        borderColor: "#fb4b50",
                        borderLeft: "0px",
                      }}
                    >
                      NG
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
              <Row justify="space-around" align="middle" className="mb-1">
                <Col span={16}>
                  <p style={{ marginBottom: "0px" }}>Tiêu chuẩn kiểm tra 1</p>
                </Col>
                <Col span={8}>
                  <ButtonGroup style={{ borderRadius: "5px", width: "100%" }}>
                    <Button
                      type=""
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#2462A3",
                        width: "50%",
                        borderColor: "#55c32a",
                        borderRight: "0px",
                      }}
                    >
                      OK
                    </Button>
                    <Button
                      type=""
                      style={{
                        backgroundColor: "#fb4b50",
                        color: "#ffffff",
                        width: "50%",
                        borderColor: "#fb4b50",
                        borderLeft: "0px",
                      }}
                    >
                      NG
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
              <Divider></Divider>
              <Row justify="space-around">
                <Col span={8} style={{ align: "top", justify: "start" }}>
                  <strong>Kết luận:</strong>
                </Col>
                <Col span={16}>
                  <Row justify="end">
                    <Button
                      type=""
                      style={{
                        backgroundColor: "#55c32a",
                        color: "white",
                        width: "30%",
                        marginRight: "5%",
                      }}
                    >
                      Duyệt
                    </Button>
                    <Button
                      type=""
                      style={{
                        backgroundColor: "#fb4b50",
                        color: "white",
                        width: "30%",
                      }}
                    >
                      NG
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Modal>

            {/* Modal kiểm tra đầu ra */}
            <Modal
              title="Kiểm tra đầu ra"
              open={isOpenModal2}
              onCancel={closeModal2}
              footer=""
            >
              <Row className="mb-1" gutter={[3, 3]} align="middle">
                <Col span={8} className="gutter-row">
                  <div
                    style={{
                      backgroundColor: "#EBEBEB",
                      textAlign: "center",
                      lineHeight: "32px",
                      borderRadius: "5px",
                    }}
                  >
                    Kích thước 1
                  </div>
                </Col>
                <Col span={8}>
                  <div
                    style={{
                      backgroundColor: "#EBEBEB",
                      textAlign: "center",
                      lineHeight: "32px",
                      borderRadius: "5px",
                    }}
                  >
                    Tiêu chuẩn 1
                  </div>
                </Col>
                <Col span={8}>
                  <Input placeholder="Nhập kết quả" />
                </Col>
              </Row>
              <Row className="mb-1" gutter={[3, 3]} align="middle">
                <Col span={8} className="gutter-row">
                  <div
                    style={{
                      backgroundColor: "#EBEBEB",
                      textAlign: "center",
                      lineHeight: "32px",
                      borderRadius: "5px",
                    }}
                  >
                    Ngoại quan 1
                  </div>
                </Col>
                <Col span={8}>
                  <div
                    style={{
                      backgroundColor: "#EBEBEB",
                      textAlign: "center",
                      lineHeight: "32px",
                      borderRadius: "5px",
                    }}
                  >
                    Tiêu chuẩn 1
                  </div>
                </Col>
                <Col span={8}>
                  <ButtonGroup style={{ borderRadius: "5px", width: "100%" }}>
                    <Button
                      type=""
                      style={{
                        backgroundColor: "#55c32a",
                        color: "white",
                        width: "50%",
                        borderColor: "#55c32a",
                        borderRight: "0px",
                      }}
                    >
                      OK
                    </Button>
                    <Button
                      type=""
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#2462A3",
                        width: "50%",
                        borderColor: "#fb4b50",
                        borderLeft: "0px",
                      }}
                    >
                      NG
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
              <Row className="mb-1" gutter={[3, 3]} align="middle">
                <Col span={8} className="gutter-row">
                  <div
                    style={{
                      backgroundColor: "#EBEBEB",
                      textAlign: "center",
                      lineHeight: "32px",
                      borderRadius: "5px",
                    }}
                  >
                    Ngoại quan 1
                  </div>
                </Col>
                <Col span={8}>
                  <div
                    style={{
                      backgroundColor: "#EBEBEB",
                      textAlign: "center",
                      lineHeight: "32px",
                      borderRadius: "5px",
                    }}
                  >
                    Tiêu chuẩn 1
                  </div>
                </Col>
                <Col span={8}>
                  <ButtonGroup style={{ borderRadius: "5px", width: "100%" }}>
                    <Button
                      type=""
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#2462A3",
                        width: "50%",
                        borderColor: "#55c32a",
                        borderRight: "0px",
                      }}
                    >
                      OK
                    </Button>
                    <Button
                      type=""
                      style={{
                        backgroundColor: "#fb4b50",
                        color: "#ffffff",
                        width: "50%",
                        borderColor: "#fb4b50",
                        borderLeft: "0px",
                      }}
                    >
                      NG
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
              <Divider></Divider>
              <Row style={{ marginTop: "20px" }} justify="space-around">
                <Col span={8} style={{ align: "top", justify: "start" }}>
                  <strong>Kết luận:</strong>
                </Col>
                <Col span={16}>
                  <Row justify="end">
                    <Button
                      type=""
                      style={{
                        backgroundColor: "#55c32a",
                        color: "white",
                        width: "25%",
                        marginRight: "5%",
                      }}
                    >
                      Duyệt
                    </Button>
                    <Button
                      type=""
                      style={{
                        backgroundColor: "#f7ac27",
                        color: "white",
                        width: "35%",
                        marginRight: "5%",
                      }}
                    >
                      Khoanh vùng
                    </Button>
                    <Button
                      type=""
                      style={{
                        backgroundColor: "#fb4b50",
                        color: "white",
                        width: "25%",
                      }}
                    >
                      NG
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Modal>

            {/* Modal quản lý lỗi */}
            <Modal
              title="Quản lý lỗi"
              open={isOpenModal3}
              onCancel={closeModal3}
              footer=""
            >
              <Row justify="center" align="middle" className="mb-2">
                <Col span={22}>
                  <Input
                    placeholder="Nhập mã lỗi hoặc quét QR code"
                    prefix={
                      <QrcodeOutlined onClick={() => console.log("haha")} />
                    }
                  />
                </Col>
              </Row>
              <Row
                gutter={[3, 3]}
                justify="space-around"
                align="middle"
                className="mb-2"
              >
                <Col span={8}>
                  <div
                    class=""
                    style={{
                      backgroundColor: "#EBEBEB",
                      textAlign: "center",
                      lineHeight: "32px",
                      borderRadius: "5px",
                    }}
                  >
                    Mã lỗi phát sinh
                  </div>
                </Col>
                <Col span={8}>
                  <Input placeholder="Nhập số lượng"></Input>
                </Col>
                <Col span={8}>
                  <Button
                    type=""
                    style={{
                      backgroundColor: "#2f79fc",
                      width: "100%",
                      color: "#ffffff",
                    }}
                  >
                    Kết thúc
                  </Button>
                </Col>
              </Row>
              <Row
                gutter={[3, 3]}
                justify="space-around"
                align="middle"
                className="mb-2"
              >
                <Col span={8}>
                  <div
                    class=""
                    style={{
                      backgroundColor: "#EBEBEB",
                      textAlign: "center",
                      lineHeight: "32px",
                      borderRadius: "5px",
                    }}
                  >
                    Mã lỗi phát sinh
                  </div>
                </Col>
                <Col span={8}>
                  <Input placeholder="Nhập số lượng"></Input>
                </Col>
                <Col span={8}>
                  <Button
                    type=""
                    style={{
                      backgroundColor: "#2f79fc",
                      width: "100%",
                      color: "#ffffff",
                    }}
                  >
                    Kết thúc
                  </Button>
                </Col>
              </Row>
              <Row
                gutter={[3, 3]}
                justify="space-around"
                align="middle"
                className="mb-2"
              >
                <Col span={8}>
                  <div
                    class=""
                    style={{
                      backgroundColor: "#EBEBEB",
                      textAlign: "center",
                      lineHeight: "32px",
                      borderRadius: "5px",
                    }}
                  >
                    Mã lỗi phát sinh
                  </div>
                </Col>
                <Col span={8}>
                  <Input placeholder="Nhập số lượng"></Input>
                </Col>
                <Col span={8}>
                  <Button
                    type=""
                    style={{
                      backgroundColor: "#2f79fc",
                      width: "100%",
                      color: "#ffffff",
                    }}
                  >
                    Kết thúc
                  </Button>
                </Col>
              </Row>
            </Modal>

            <Row gutter={[12, 12]} className="mt-3">
              <Col span={6}>
                <Button
                  type="primary"
                  style={btnCustom}
                  onClick={() => {
                    setIsScan(1);
                  }}
                >
                  SCAN
                </Button>
              </Col>
              <Col span={6}>
                <Button type="primary" style={btnCustom}>
                  MANUAL
                </Button>
              </Col>
              <Col span={6}>
                <Button type="primary" style={btnCustom}>
                  PRINT 1
                </Button>
              </Col>
              <Col span={6}>
                <Button type="primary" style={btnCustom}>
                  PRINT 2
                </Button>
              </Col>
            </Row>
            <Table
              scroll={{
                x: 200,
                y: 350,
              }}
              pagination={false}
              bordered
              className="mt-4 mb-4"
              columns={columns}
              dataSource={data}
            />
            <Row gutter={[2, 2]} className="mb-4">
              <Col span={6}>
                <Button type="primary" style={btnCustomTabActive}>
                  Sản xuất
                </Button>
              </Col>
              <Col span={6}>
                <Button type="primary" style={btnCustomTab}>
                  Chất lượng
                </Button>
              </Col>
              <Col span={6}>
                <Button type="primary" style={btnCustomTab}>
                  Thiết bị
                </Button>
              </Col>
              <Col span={6}>
                <Button type="primary" style={btnCustomTab}>
                  Kho
                </Button>
              </Col>
            </Row>
          </Content>
        </Layout>
        {/* <Modal title="Quét QR" open={isModalOpen} onCancel={handleCloseMdl} footer={null}>
                    <ScanQR isScan={isScan} onResult={(res) => { setResultQr(res); setIsScan(2) }} />
                </Modal> */}
      </React.Fragment>
    </>
  );
};

export default withRouter(OI01);
