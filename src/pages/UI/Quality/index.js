import {Button, Card, Col, DatePicker, Divider, Form, Input, Layout, Radio, Row, Select, AutoComplete, Table, Tabs, Typography} from "antd";
import {Content} from "antd/es/layout/layout";
import React, { useState } from "react";
import { Pie, Column } from '@ant-design/plots';
const {Sider} = Layout;
const { RangePicker } = DatePicker;
const siderStyle = {
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#fff',
    width:'100%',
    height:'100%'
};
const dateOptions = [
    {
        label: 'Ngày',
        value: 1
    },
    {
        label: 'Tuần',
        value: 2
    },
    {
        label: 'Tháng',
        value: 3
    },
]
const columns2 = [
    {
        title: 'Tháng',
        dataIndex: 'month',
        key: 'month',
        align: 'center',
    },
    {
        title: 'Ngày',
        dataIndex: 'date',
        key: 'date',
        align: 'center',
    },
    {
        title: 'Ca',
        dataIndex: 'shift',
        key: 'shift',
        align: 'center',
    },
    {
        title: 'Công đoạn',
        dataIndex: 'line',
        key: 'line',
        align: 'center',
    },
    {
        title: 'Khách hàng',
        dataIndex: 'customer',
        key: 'customer',
        align: 'center',
    },
    {
        title: 'Mã hàng',
        dataIndex: 'id_product',
        key: 'id_product',
        align: 'center',
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'name_product',
        key: 'name_product',
        align: 'center',
    },
    {
        title: 'Số lượng SX',
        dataIndex: 'manufacture_quanlity',
        key: 'manufacture_quanlity',
        align: 'center',
    },
    {
        title: 'SL OK',
        dataIndex: 'ok_quanlity',
        key: 'ok_quanlity',
        align: 'center',
    },
    {
        title: 'Tỉ lệ NG',
        dataIndex: 'ng_rate',
        key: 'ng_rate',
        align: 'center',
    },
    {
        title: 'NG',
        dataIndex: 'ng_quanlity',
        key: 'ng_quanlity',
        align: 'center',
    },
    {
        title: 'Chấm đen, chấm trắng',
        dataIndex: 'error_white_black',
        key: 'error_white_black',
        align: 'center',
    },
    {
        title: 'Tổn thương (03)',
        dataIndex: 'error_ton_thuong_03',
        key: 'error_ton_thuong_03',
        align: 'center',
    },
    {
        title: 'Bẩn (04)',
        dataIndex: 'error_ban_04',
        key: 'error_ban_04',
        align: 'center',
    },
    {
        title: 'Xước (05)',
        dataIndex: 'error_xuoc_05',
        key: 'error_xuoc_05',
        align: 'center',
    },
    {
        title: 'Hằn (07)',
        dataIndex: 'error_han_07',
        key: 'error_han_07',
        align: 'center',
    },
    {
        title: 'Lệch màu (08)',
        dataIndex: 'error_color_08',
        key: 'error_color_08',
        align: 'center',
    },
];
const dataTable2 = [];
for(let i=0; i<10;i++){
    let data = {
        month:"Tháng 3",
        date:"01/03/2023",
        shift:'Ca 1',
        line:"Chọn",
        customer:"-",
        id_product:'-',
        name_product:'-',
        manufacture_quanlity:'-',
        ok_quanlity:'-',
        ng_rate:'-',
        ng_quanlity:'-',
        error_white_black:'-',
        error_ton_thuong_03:'-',
        error_ban_04:'-',
        error_xuoc_05:'-',
        error_han_07:'-',
        error_color_08:'-',
    };
    dataTable2.push(data);
}
const columns1 = [
    {
        title: 'Mã lỗi',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: 'Ngày sản xuất',
        dataIndex: 'date',
        key: 'date',
        align: 'center'
    },
    {
        title: 'Số lượng lỗi',
        dataIndex: 'defect_quanlity',
        key: 'defect_quanlity',
        align: 'center'
    },
    {
        title: 'Chấm đen',
        dataIndex: 'black_dot',
        key: 'black_dot',
        align: 'center'
    },
    {
        title: 'Tổn thương',
        dataIndex: 'bad',
        key: 'bad',
        align: 'center'
    },
    {
        title: 'Xước',
        dataIndex: 'scratch',
        key: 'scratch',
        align: 'center'
    },
    {
        title: 'Hằn',
        dataIndex: 'han',
        key: 'han',
        align: 'center'
    },
    {
        title: 'Bẩn',
        dataIndex: 'dirt',
        key: 'dirt',
        align: 'center'
    },
];
const dataTable1 = [
    {
        id:'A01',
        date:'01/01/2023',
        defect_quanlity:5,
        black_dot:1,
        bad:1,
        scratch:1,
        han: 1,
        dirt: 1
    },
    {
        id:'A02',
        date:'01/01/2023',
        defect_quanlity:5,
        black_dot:1,
        bad:1,
        scratch:1,
        han: 1,
        dirt: 1
    },
    {
        id:'A03',
        date:'01/01/2023',
        defect_quanlity:5,
        black_dot:1,
        bad:1,
        scratch:1,
        han: 1,
        dirt: 1
    },
]

const dataColChart = [
    {
        value: '70',
        type: 'Máy 1',
    },
    {
        value: '50',
        type: 'Máy 2',
    },
    
    {
        value: '80',
        type: 'Máy 3',
    },
    {
        value: '60',
        type: 'Máy 4',
    },
    {
        value: '100',
        type: 'Máy 5',
    },
]
var configBarChart = {
height:230,
data:dataColChart,
xField: 'type',
yField: 'value',
label: {
  position: 'middle',
  style: {
    fill: '#FFFFFF',
    opacity: 0.6,
  },
},
xAxis: {
  label: {
    autoHide: true,
    autoRotate: false,
  },
},
meta: {
  type: {
    alias: 'Máy',
  },
  value: {
    alias: 'Hiệu suất',
  },
},
};
const Quality = (props) => {
    const [data, setData] = useState([
        {
          type: 'Sản lượng',
          value: 21,
        },
        {
          type: 'Còn lại (Sản lượng - Mục tiêu)',
          value: 79,
        },
    ]);
    const config = {
        height:230,
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.9,
        label: {
            type: 'inner',
            offset: '-30%',
            content: ({ percent }) => `${(percent * 100).toFixed(0)}0`,
            style: {
                fontSize: 14,
                textAlign: 'center',
            },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
        legend: {   
            position: 'bottom',
            flipPage: true,
            maxHeightRatio: 1,
            maxItemWidth: 500,
            layout: 'vertical',
        }
    };
    const [options, setOptions] = useState([
        {
            label: 'Bảo ôn',
            value: 1,
        },
        {
            label: 'In',
            value: 2,
        },
        {
            label: 'Phủ',
            value: 3,
        },
        {
            label: 'Bế',
            value: 4,
        },
        {
            label: 'Bóc',
            value: 5,
        },
        {
            label: 'Gấp dán',
            value: 6,
        },
        {
            label: 'Chọn',
            value: 7,
        },
    ]);
    
    const onChangeTypeDate = (value) =>{
        console.log(value);
    }
    return (
        <React.Fragment>
            <Sider style={{backgroundColor:'white', height:'100vh', overflow:'auto', float:'left', paddingTop:'15px'}}>
                        <div className='mb-3'>
                        <Form style={{ margin: '0 15px' }} layout="vertical">
                        <Form.Item label="Công đoạn" className='mb-3'>
                              <Select
                              defaultValue="In"
                              options={[{ value: 'in', label: 'In' }, {value:'bao-on', label:'Bảo ôn'}]}
                              />
                        </Form.Item>
                        <Form.Item label="Máy" className='mb-3'>
                              <Select
                              defaultValue="Máy 1"
                              options={[{ value: '1', label: 'Máy 1' }, {value:'2', label:'Máy 2'}]}
                              />
                        </Form.Item>
                        </Form>
                        </div>
                        <Divider>Thời gian truy vấn</Divider>
                        <div className='mb-3'>
                        <Form style={{ margin: '0 15px' }} layout="vertical">
                              <RangePicker placeholder={["Bắt đầu", "Kết thúc"]}/>
                        </Form>
                        </div>
                        <Divider>Điều kiện truy vấn</Divider>
                        <div className='mb-3'>
                        <Form style={{ margin: '0 15px' }} layout="vertical">
                                <Form.Item label="Loại lỗi" className='mb-3'>
                                    <Select
                                    defaultValue="1"
                                    options={[{ value: '1', label: 'Lỗi worst' }, {value:'2', label:'Loại lỗi'}]}
                                    />
                                </Form.Item>
                              <Form.Item label="Mã lỗi" className='mb-3'>
                              <AutoComplete placeholder='Nhập mã lỗi'></AutoComplete>
                            </Form.Item>
                            <Form.Item label="Tên lỗi" className='mb-3'>
                                <AutoComplete placeholder='Nhập tên lỗi'></AutoComplete>
                            </Form.Item>
                            <Form.Item label="Nguyên nhân lỗi" className='mb-3'>
                                <Input placeholder='Nhập nguyên nhân lỗi'></Input>
                            </Form.Item>
                         </Form>
                  </div>

                  <div style={
                        {
                              padding: '10px',
                              textAlign: 'center'
                        }
                  }
                  layout="vertical">
                  <Button type='primary'
                        style={
                              {width: '80%'}
                  }>Truy vấn</Button>
                  </div>
            </Sider>
            <Row style={{padding: '8px', height:'100vh'}} gutter={[8, 8]}>
                                <Col span={10}>
                                    <Card title={<h6>Bảng tóm tắt</h6>} style={{ height: '100%',padding: '0px'}} bodyStyle={{padding:12}} extra={<Button type='primary'>Xuất excel</Button>}>
                                        <Table bordered pagination={false} columns={columns1} dataSource={dataTable1} size="small" style={{height:'100%'}}
                                        summary={(pageData) => {
                                            let
                                            defect_quanlity=0,
                                            black_dot=0,
                                            bad=0,
                                            scratch=0,
                                            han=0,
                                            dirt=0
                                            pageData.forEach((e) => {
                                                defect_quanlity += e.defect_quanlity;
                                                black_dot += e.black_dot;
                                                bad += e.bad;
                                                scratch += e.scratch;
                                                han += e.han;
                                                dirt += e.dirt;
                                            });
                                            return (
                                                <>
                                                <Table.Summary.Row>
                                                    <Table.Summary.Cell className="text-center">Sum</Table.Summary.Cell>
                                                    <Table.Summary.Cell className="text-center"></Table.Summary.Cell>
                                                    <Table.Summary.Cell className="text-center">{defect_quanlity}</Table.Summary.Cell>
                                                    <Table.Summary.Cell className="text-center">{black_dot}</Table.Summary.Cell>
                                                    <Table.Summary.Cell className="text-center">{bad}</Table.Summary.Cell>
                                                    <Table.Summary.Cell className="text-center">{scratch}</Table.Summary.Cell>
                                                    <Table.Summary.Cell className="text-center">{han}</Table.Summary.Cell>
                                                    <Table.Summary.Cell className="text-center">{dirt}</Table.Summary.Cell>
                                                </Table.Summary.Row>
                                                <Table.Summary.Row>
                                                    <Table.Summary.Cell className="text-center">Tỷ lệ</Table.Summary.Cell>
                                                    <Table.Summary.Cell className="text-center"></Table.Summary.Cell>
                                                    <Table.Summary.Cell className="text-center">{'100%'}</Table.Summary.Cell>
                                                    <Table.Summary.Cell className="text-center">{`${100 / (defect_quanlity / black_dot)}%`}</Table.Summary.Cell>
                                                    <Table.Summary.Cell className="text-center">{`${100 / (defect_quanlity / bad)}%`}</Table.Summary.Cell>
                                                    <Table.Summary.Cell className="text-center">{`${100 / (defect_quanlity / scratch)}%`}</Table.Summary.Cell>
                                                    <Table.Summary.Cell className="text-center">{`${100 / (defect_quanlity / han)}%`}</Table.Summary.Cell>
                                                    <Table.Summary.Cell className="text-center">{`${100 / (defect_quanlity / dirt)}%`}</Table.Summary.Cell>
                                                </Table.Summary.Row>
                                                </>
                                            );
                                        }}/>
                                    </Card>
                                </Col>
                                <Col span={7}>
                                    <Card title="Biểu đồ tỉ lệ lỗi" style={{ height: '100%',padding: '0px'}} bodyStyle={{padding:12}}>
                                        <Pie {...config}/>
                                    </Card>
                                </Col>
                                <Col span={7}>
                                    <Card title="Biểu đồ lỗi theo ngày" style={{ height: '100%',padding: '0px'}} bodyStyle={{padding:12}}>
                                        <Column {...configBarChart}/>
                                    </Card>
                                </Col>
                                <Col span={24}>
                                    <Card title="Chi tiết lỗi" style={{ height: '100%',padding: '0px'}} bodyStyle={{padding:12}} extra={<Button type='primary'>Xuất excel</Button>}>
                                        <Table bordered columns={columns2} dataSource={dataTable2} pagination={false} scroll={
                                        {
                                            x: '100%',
                                            y: '150px'
                                        }
                                    } />
                                    </Card>
                                </Col>
            </Row>
        </React.Fragment>
    )
}

export default Quality;
