import {DatePicker,Col,Row,Card,Table,Tag,Layout,Divider,Button,Form,Input,theme,Select,AutoComplete} from 'antd';
import {Pie} from '@ant-design/charts';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import dayjs from "dayjs";
import { useState } from 'react';

const {Sider} = Layout;
const {RangePicker} = DatePicker;

const col_summaryTable = [
    {
        title: 'Mã lỗi',
        dataIndex: 'id_error',
        key: 'id_error',
        align: 'center'
    }, {
        title: 'Tên lỗi',
        dataIndex: 'name_error',
        key: 'name_error',
        align: 'center'
    }, {
        title: 'Tổng số lỗi',
        dataIndex: 'sum_error',
        key: 'sum_error',
        align: 'center'
    }
];
const data_summaryTable = [
    {
        id_error: 'ML01',
        name_error: 'Lỗi cảm biến an toàn',
        sum_error: '5'
    },
    {
        id_error: 'ML02',
        name_error: 'Hỏng Sensor',
        sum_error: '6'
    },
    {
        id_error: 'ML03',
        name_error: 'Sensor không nhận',
        sum_error: '7'
    },
    {
        id_error: 'ML01',
        name_error: 'Lỗi cảm biến an toàn',
        sum_error: '5'
    }, {
        id_error: 'ML02',
        name_error: 'Hỏng Sensor',
        sum_error: '6'
    }, {
        id_error: 'ML03',
        name_error: 'Sensor không nhận',
        sum_error: '7'
    },
];
const col_detailTable = [
    {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
        render: (value, record, index) => index + 1,
        align: 'center'
    },
    {
        title: 'Ngày',
        dataIndex: 'date',
        key: 'date',
        align: 'center'
    },
    {
        title: 'Thời gian dừng',
        dataIndex: 'stop_time',
        key: 'stop_time',
        align: 'center'
    },
    {
        title: 'Thời gian chạy',
        dataIndex: 'run_time',
        key: 'run_time',
        align: 'center'
    }, {
        title: 'Mã lỗi',
        dataIndex: 'id_error',
        key: 'id_error',
        align: 'center'
    }, {
        title: 'Tên lỗi',
        dataIndex: 'name_error',
        key: 'name_error',
        align: 'center'
    }, {
        title: 'Nguyên nhân lỗi',
        dataIndex: 'cause_error',
        key: 'cause_error',
        align: 'center'
    }, {
        title: 'Biện pháp khắc phục lỗi',
        dataIndex: 'fix_error',
        key: 'fix_error',
        align: 'center'
    }, {
        title: 'Biện phép phòng ngừa lỗi',
        dataIndex: 'prevent_error',
        key: 'prevent_error',
        align: 'center'
    }, {
        title: 'Tình trạng',
        dataIndex: 'status_error',
        key: 'status_error',
        render: (record) => {
            console.log(record);
            return record == 1 ? <Tag color="#87d068">Đã hoàn thành</Tag> : <Tag color="#929292">Chưa xử lý</Tag>
        },
        align: 'center'
    }
]
const data_detailTable = [
    {
        date: '01/08/2023',
        stop_time: '8:00',
        run_time: '9:00',
        id_error: '1',
        cause_error: 'Nguyên nhân lỗi',
        fix_error: 'Sửa chữa lỗi',
        prevent_error: 'Ngăn ngừa lỗi',
        status_error: 1
    },
    {
        date: '01/08/2023',
        stop_time: '8:00',
        run_time: '9:00',
        id_error: '1',
        cause_error: 'Nguyên nhân lỗi',
        fix_error: 'Sửu chữa lỗi',
        prevent_error: 'Ngăn ngừa lỗi',
        status_error: 0
    },
    {
        date: '01/08/2023',
        stop_time: '8:00',
        run_time: '9:00',
        id_error: '1',
        cause_error: 'Nguyên nhân lỗi',
        fix_error: 'Sửa chữa lỗi',
        prevent_error: 'Ngăn ngừa lỗi',
        status_error: 1
    },
    {
        date: '01/08/2023',
        stop_time: '8:00',
        run_time: '9:00',
        id_error: '1',
        cause_error: 'Nguyên nhân lỗi',
        fix_error: 'Sửu chữa lỗi',
        prevent_error: 'Ngăn ngừa lỗi',
        status_error: 0
    }, {
        date: '01/08/2023',
        stop_time: '8:00',
        run_time: '9:00',
        id_error: '1',
        cause_error: 'Nguyên nhân lỗi',
        fix_error: 'Sửa chữa lỗi',
        prevent_error: 'Ngăn ngừa lỗi',
        status_error: 1
    }, {
        date: '01/08/2023',
        stop_time: '8:00',
        run_time: '9:00',
        id_error: '1',
        cause_error: 'Nguyên nhân lỗi',
        fix_error: 'Sửu chữa lỗi',
        prevent_error: 'Ngăn ngừa lỗi',
        status_error: 0
    }
]
var dataPieChart = [
    {
        type: 'Lỗi 02',
        value: 10
    },
    {
        type: 'Lỗi 01',
        value: 20
    },
    {
        type: 'Lỗi 03',
        value: 15
    },
    {
        type: 'Lỗi 04',
        value: 25
    }, {
        type: 'Lỗi 05',
        value: 15
    }, {
        type: 'Các lỗi khác',
        value: 15
    },
];
var config = {
    height: 195,
    appendPadding: 10,
    data: dataPieChart,
    angleField: 'value',
    colorField: 'type',
    label: {
        type: 'inner',
        content: function content(_ref) {
            return ''.concat(_ref.value, '%');
        },
        style: {
            fontSize: 12,
            textAlign: 'center'
        }
    },
    interactions: [
        {
            type: 'element-active'
        }
    ]
};

const [exportLoading, setExportLoading] = useState(false);
const exportFile = async () =>{
    // setExportLoading(true);
    // const res = await exportProduceHistory({line_id:selectedLine});
    // if(res.success){
    //     window.location.href = baseURL+res.data;
    // }
    // setExportLoading(false);
}
const Equipment = (props) => {
      const child = useParams();
      console.log(child);
      return <>
            <Sider style={{backgroundColor:'white', minHeight:'100vh', float:'left', paddingTop:'15px'}}>
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
                        <RangePicker defaultPickerValue={[dayjs(), dayjs()]} placeholder={["Bắt đầu", "Kết thúc"]}/>
                  </Form>
                  </div>
                  <Divider>Điều kiện truy vấn</Divider>
                  <div className='mb-3'>
                  <Form style={{ margin: '0 15px' }} layout="vertical">
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
        <Row style={{padding: '8px'}} gutter={[8, 8]}>
            <Col span={14}>
                <Card title="Thống kê tổng số lỗi" style={{height: '100%'}}>
                    <Table size='small' bordered
                        pagination={false}
                        scroll={
                            {
                                x: '100%',
                                y: '150px'
                            }
                        }
                        columns={col_summaryTable}
                        dataSource={data_summaryTable}/>
                </Card>
            </Col>
            <Col span={10}>
                <Card title="Biểu đồ phát sinh lỗi"
                    style={
                        {
                            height: '100%',
                            padding: '0px'
                        }
                }>
                    <Pie {...config}/>
                </Card>
            </Col>
            <Col span={24}>
                <Card style={{height: '100%'}} title="Thống kê chi tiết lỗi" extra={<Button type='primary' onClick={exportFile} loading={exportLoading}>Excel</Button>}>
                    <Table size='small' bordered
                        pagination={false}
                        scroll={
                            {
                                x: '100%',
                                y: '150px'
                            }
                        }
                        columns={col_detailTable}
                        dataSource={data_detailTable}/>
                </Card>
            </Col>
        </Row>
    </>
}

export default Equipment;
