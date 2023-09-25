import React, { useState, useEffect } from 'react';
import { Layout, Table, Tag, Col, Row } from 'antd';
import ReactFullscreen from 'react-easyfullscreen';
import {FullscreenOutlined, FullscreenExitOutlined} from '@ant-design/icons';
import { Column } from '@ant-design/plots';


import "./style.scss";

import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';

const colTable =[
    {
        title: 'Thiết bị',
        dataIndex: 'equipment',
        key: 'equipment',
        align:'center',
    },
    {
        title: 'Mã hàng',
        dataIndex: 'id_product',
        key: 'id_product',
        align:'center',
    },
    {
        title: 'SL kế hoạch',
        dataIndex: 'plan_quanlity',
        key: 'plan_quanlity',
        align:'center',
    },
    {
        title: 'TG xong theo K.Hoạch',
        dataIndex: 'plan_endtime',
        key: 'plan_endtime',
        align:'center',
    },
    {
        title: 'SL Thực tế',
        dataIndex: 'actual_quanlity',
        key: 'actual_quanlity',
        align:'center',
    },
    {
        title: 'TG dự kiến xong',
        dataIndex: 'expected_endtime',
        key: 'expected_endtime',
        align:'center',
    },
    {
        title: 'Tỉ lệ hoàn thành',
        dataIndex: 'completed_rate',
        key: 'completed_rate',
        align:'center',
    },
    {
        title: 'Tỉ lệ lỗi',
        dataIndex: 'error_rate',
        key: 'error_rate',
        align:'center',
    },
    {
        title: 'Cycle Time',
        dataIndex: 'cycle_time',
        key: 'cycle_time',
        align:'center',
    },
    {
        title: 'Tình trạng',
        dataIndex: 'status',
        key: 'status',
        render:(value) => {
            if(value == 'equal') return  <Tag color="#87d068">Bằng thực tế</Tag>
            else if(value == 'less30') return <Tag color="#faad14">Chậm ít hơn 30'</Tag>
           else if(value == 'more30') return <Tag color="#cd201f">Chậm nhiều hơn 30'</Tag>
            else return <Tag color="#929292">Ko có K.Hoạch</Tag>
        },
        align:'center',
    },

];
const dataTable = [
    {
        equipment:'In',
        id_product:'5557-1131',
        plan_quanlity:'120000',
        plan_endtime:'2023-08-02 10:00:00',
        actual_quanlity:'96000',
        expected_endtime:'2023-08-01 10:00:00',
        completed_rate:'67%',
        error_rate:'2%',
        cycle_time:'0.72',
        status:'more30',
    },
    {
        equipment:'Gấp dán 2',
        id_product:'5557-1131',
        plan_quanlity:'120000',
        plan_endtime:'2023-08-02 10:00:00',
        actual_quanlity:'96000',
        expected_endtime:'2023-08-01 10:00:00',
        completed_rate:'67%',
        error_rate:'2%',
        cycle_time:'0.72',
        status:'equal',
    },
    {
        equipment:'Gấp dán 3',
        id_product:'5557-1131',
        plan_quanlity:'120000',
        plan_endtime:'2023-08-02 10:00:00',
        actual_quanlity:'96000',
        expected_endtime:'2023-08-01 10:00:00',
        completed_rate:'67%',
        error_rate:'2%',
        cycle_time:'0.72',
        status:'less30',
    },
    {
        equipment:'Chọn',
        id_product:'5557-1131',
        plan_quanlity:'120000',
        plan_endtime:'2023-08-02 10:00:00',
        actual_quanlity:'96000',
        expected_endtime:'2023-08-01 10:00:00',
        completed_rate:'67%',
        error_rate:'2%',
        cycle_time:'0.72',
        status:'more30',
    },
    
];
for(let i=0; i<3; i++){
    let data = {
        equipment:'In',
        id_product:'5557-1131',
        plan_quanlity:'120000',
        plan_endtime:'2023-08-02 10:00:00',
        actual_quanlity:'96000',
        expected_endtime:'2023-08-01 10:00:00',
        completed_rate:'67%',
        error_rate:'2%',
        cycle_time:'0.72',
        status:'no_plan',
    }
    dataTable.push(data);
}



const UI = () => {
    document.title = "Sản xuất ép nhựa";
    const {screen, tab} = useParams();
    const history  =useHistory();
    const [isFullCreen, setIsFullScreen] = useState(false);
    const [clock, setClock] = useState(new Date())
    useEffect(()=>{
        setInterval(() => tick(), 1000);
    }, [])
    const tick = () => {
        setClock(new Date());
    }
    const dataChart = [
        {
            "year": "In",
            "value": 3,
            "type": "Còn lại kế hoạch"
          },
          {
            "year": "Bế",
            "value": 4,
            "type": "Còn lại kế hoạch"
          },
          {
            "year": "Bóc",
            "value": 3.5,
            "type": "Còn lại kế hoạch"
          },
          {
            "year": "Phủ",
            "value": 5,
            "type": "Còn lại kế hoạch"
          },
          {
            "year": "Gấp dán 2",
            "value": 4.9,
            "type": "Còn lại kế hoạch"
          },
          {
            "year": "Gấp dán 3",
            "value": 6,
            "type": "Còn lại kế hoạch"
          },
          {
            "year": "Chọn",
            "value": 7,
            "type": "Còn lại kế hoạch"
          },
        {
            "year": "In",
            "value": 3,
            "type": "Thực tế"
          },
          {
            "year": "Bế",
            "value": 4,
            "type": "Thực tế"
          },
          {
            "year": "Bóc",
            "value": 3.5,
            "type": "Thực tế"
          },
          {
            "year": "Phủ",
            "value": 5,
            "type": "Thực tế"
          },
          {
            "year": "Gấp dán 2",
            "value": 4.9,
            "type": "Thực tế"
          },
          {
            "year": "Gấp dán 3",
            "value": 6,
            "type": "Thực tế"
          },
          {
            "year": "Chọn",
            "value": 7,
            "type": "Thực tế"
          },
    ]
    const config = {
        showTitle:true,
        title: {
            visible: false,
            text: 'Your Stats',
          },
        data: dataChart,
        isStack: true,
        xField: 'year',
        yField: 'value',
        seriesField: 'type',
        label: {
          style:{
            color:'black',
            fontWeight:'700'
          },
          position: 'middle',
          layout: [
            {
              type: 'interval-adjust-position',
            },
            {
              type: 'interval-hide-overlap',
            }, 
            {
              type: 'adjust-color',
            },
          ],
        },
        colorField: 'type', // or seriesField in some cases
        color: ['#bebebe','#6ab0ed',],
      };
    return (
            <React.Fragment>
                <ReactFullscreen>
                    {({ ref, onRequest, onExit }) => (
                    <Layout ref={ref} style={{ height: '100vh', backgroundColor: '#e3eaf0' }}>
                        <Row className='w-100' style={{padding:"15px"}}>
                            <Row className='w-100 mt-3'>
                                <Table
                                        bordered
                                        pagination={false}
                                        scroll={{x:'100%', y:'40vh'}}
                                        columns={colTable}
                                        dataSource={dataTable}
                                />
                            </Row>
                            <Row className='w-100 mt-3' style={{backgroundColor:'white', padding:'15px', borderRadius:'5px'}}>
                                <Column style={{width:'100%', height:'35vh'}} {...config} />
                            </Row>
                        </Row>
                    </Layout>
                    )}
                </ReactFullscreen>
                
            </React.Fragment>
    );
};

export default UI;