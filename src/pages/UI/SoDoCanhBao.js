import React, { useState, useEffect, useRef } from 'react';
import { Layout, Table, Tag, Col, Row, Card, Button, Space, Image, Popover, Tooltip } from 'antd';
import ReactFullscreen from 'react-easyfullscreen';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/plots';
import background1 from "../../assets/images/layout8.png";
import "./style.scss";
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';

const mw = 1366;
const mh = 281;
const cw = window.innerWidth;
const ch = window.innerHeight;


const UI = () => {
      function convertW(value) {
            return value * (cw / mw);
      }

      function convertH(value) {
            return value * (ch / mh);
      }

      document.title = "Sản xuất ép nhựa";
      const { screen, tab } = useParams();
      const history = useHistory();
      const [isFullCreen, setIsFullScreen] = useState(false);
      const [clock, setClock] = useState(new Date())
      useEffect(() => {
            setInterval(() => tick(), 1000);
      }, [])
      const tick = () => {
            setClock(new Date());
      }
      return (
            <React.Fragment>
                  <ReactFullscreen>
                        {({ ref, onRequest, onExit }) => (
                              <Layout ref={ref} style={{ height: '100vh', backgroundColor: '#e3eaf0' }}>
                                    <Row style={{ padding: '8px', height: '100vh' }} gutter={[8, 8]}>
                                          <Col span={24}>
                                                <Card style={{ height: '100%',position:'relative' }} title="GIÁM SÁT CẢNH BÁO BẤT THƯỜNG"
                                                      extra={isFullCreen == true ?
                                                            <>
                                                                  <div style={{ fontSize: '24px', fontWeight: '600' }}>
                                                                        {clock.toLocaleString(['en-GB'], { hour12: false })}
                                                                        <FullscreenExitOutlined style={{ fontSize: '30px', marginLeft: '20px' }} onClick={() => { onExit(); setIsFullScreen(false) }} />
                                                                  </div>
                                                            </>
                                                            :
                                                            <FullscreenOutlined style={{ fontSize: '30px' }} onClick={() => { onRequest(); setIsFullScreen(true) }} />
                                                      }
                                                      bodyStyle={{
                                                            backgroundImage: `url(${background1})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: '88%',
                                                            backgroundRepeat: 'no-repeat',
                                                            height: '100%',
                                                            width: '100%',
                                                            objectFit: 'cover',
                                                      }}
                                                >
                                                      <Tooltip title={<h5 style={{ padding: '5px 5px', marginBottom: '0' }}>PH:5.9</h5>} open={true} color='red'>
                                                            <Button style={{ opacity: '0', position: 'absolute', top: '38%', left: '22%' }}></Button>
                                                      </Tooltip>
                                                      <Tooltip title={<h5 style={{ padding: '5px 5px', marginBottom: '0' }}>Sự cố máy</h5>} open={true} color='orange'>
                                                            <Button style={{ opacity: '0', position: 'absolute', top: '58%', left: '32%' }}></Button>
                                                      </Tooltip>
                                                      
                                                </Card>
                                          </Col>
                                    </Row>
                              </Layout>
                        )}
                  </ReactFullscreen>

            </React.Fragment>
      );
};

export default UI;