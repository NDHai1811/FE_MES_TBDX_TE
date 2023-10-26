import React, { useState, useEffect } from 'react';
import { Layout, Tag, Col, Row, Card } from 'antd';
import ReactFullscreen from 'react-easyfullscreen';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { getPerfomanceMachine } from '../../api/db/main';
import { Gauge } from '@ant-design/charts';


const HieuSuatThietBi = () => {
  const [isFullCreen, setIsFullScreen] = useState(false);
  const [clock, setClock] = useState(new Date());
  const [data, setData] = useState([
    {

      machine_name: "MÁY IN TỜ RỜI KOMORI",
      status: 1,
      thoi_gian_kh: 373,
      thoi_gian_thuc_te: 390,

    },
    {

      machine_name: "MÁY PHỦ UV CỤC BỘ",
      status: 1,
      thoi_gian_kh: 373,
      thoi_gian_thuc_te: 380,

    },
    {

      machine_name: "MÁY BẾ TỜ RỜI",
      status: 1,
      thoi_gian_kh: 373,
      thoi_gian_thuc_te: 459,

    },
    {

      machine_name: "MÁY GẤP HỘP",
      status: 1,
      thoi_gian_kh: 373,
      thoi_gian_thuc_te: 450,

    }

  ]);
  const [show, setShow] = useState();
  const tick = () => {
    setClock(new Date());
  };
  let interval1;
  useEffect(() => {
    interval1 = setInterval(async () => {
      const res1 = await getPerfomanceMachine();
      setData(res1.data);
    }, 5000)
    return () => clearInterval(interval1);
  }, [])

  useEffect(() => {
    setInterval(() => tick(), 1000);
    (async () => {
      const res1 = await getPerfomanceMachine();
      setData(res1.data);
    })()
  }, []);

  useEffect(() => {
    if (!data) return;
    setShow(Object.keys(data).map((value, index) => {
      let percent = data[value].percent/100;
      let config = {
        height: 340,
        percent: percent,
        range: {
          ticks: [0, 0.4, 0.7, 1],
          color: ['#FB4B50', '#f7ac27', '#30BF78'],
        },
        statistic: {
          content: {
            formatter: ({ percent }) => {
              return parseInt(percent*100) + "%";
            },
            style: {
              fontSize: '36px',
              lineHeight: '36px',
            },
          },
        },
        axis: {
          label: {
            formatter(v) {
              return Number(v) * 100;
            },
          },
          subTickLine: {
            count: 3,
          },
        },
      };
      return <Col span={8} >
        <Card title={<div style={{ fontWeight: '700', fontSize: '1.8em' }}>{data[value]['machine_name']}</div>} style={{ height: '45vh', padding: '0px' }}
          extra={<Tag style={{ width: '30px', height: '30px', borderRadius: '15px' }} color={data[value]['status'] == 0 ? '#FB4B50' : '#30BF78'}></Tag>}
        >
          <Gauge {...config} />
        </Card>
      </Col>
    }));

  }, [data]);

  return (
    <React.Fragment>
      <ReactFullscreen>
        {({ ref, onRequest, onExit }) => (
          <Layout ref={ref} style={{ height: '100vh', backgroundColor: '#e3eaf0' }}>
            <Row className='w-100' style={{ verticalAlign: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#2462a3', color: 'white' }}>
              <div style={{ fontSize: '22px', fontWeight: '700', }}>{clock.toLocaleString(['en-GB'], { hour12: false })}</div>
              <div style={{ fontWeight: 700, fontSize: '24px' }}>HIỆU SUẤT THIẾT BỊ</div>
              {
                isFullCreen == false ? <FullscreenOutlined style={{ fontSize: '30px' }} onClick={() => { onRequest(); setIsFullScreen(true) }} />
                  : <FullscreenExitOutlined style={{ fontSize: '30px' }} onClick={() => { onExit(); setIsFullScreen(false) }} />
              }
            </Row>
            <Row style={{ padding: '15px' }} gutter={[8, 8]}>
              {show}
            </Row>
          </Layout>
        )}
      </ReactFullscreen>

    </React.Fragment>
  );
};

export default HieuSuatThietBi;