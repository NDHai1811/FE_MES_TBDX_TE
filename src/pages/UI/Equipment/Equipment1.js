import {DatePicker,Col,Row,Card,Table,Tag,Layout,Divider,Button,Form,Input,theme,Select,AutoComplete, Space, Spin} from 'antd';
import {Pie, Column} from '@ant-design/plots';
import React, { useState, useEffect } from "react";
import {getMachine, getErrorsMachine, getLines, getMachineOfLine, getCustomers, getProducts, getStaffs, getLoSanXuat, getWarehouses, getCaSanXuats, getMachineError } from '../../../api/ui/main';
import {exportMachineError } from '../../../api/ui/export';
import { baseURL } from '../../../config';
import dayjs from "dayjs";

const {Sider} = Layout;
const {RangePicker} = DatePicker;


const columnTable = [
    {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
        render: (value, record, index) => index + 1,
        align: 'center'
    },
    {
        title: 'Ngày',
        dataIndex: 'ngay_sx',
        key: 'ngay_sx',
        align: 'center'
    },
    {
        title: 'Ca',
        dataIndex: 'ca_sx',
        key: 'ca_sx',
        align: 'center'
    },
    {
        title: 'Xưởng',
        dataIndex: 'xuong_sx',
        key: 'xuong_sx',
        align: 'center'
    },
    {
        title: 'Công đoạn',
        dataIndex: 'cong_doan',
        key: 'cong_doan',
        align: 'center'
    },
    {
        title: 'Máy sản xuất',
        dataIndex: 'machine_name',
        key: 'machine_name',
        align: 'center'
    },
    {
        title: 'Mã máy',
        dataIndex: 'machine_id',
        key: 'machine_id',
        align: 'center'
    },
    {
        title: 'Lô sx',
        dataIndex: 'lo_sx',
        key: 'lo_sx',
        align: 'center',
        render: (value, record, index) => value != '' ? value : '-',
    },
    {
        title: 'Thùng/pallet',
        dataIndex: 'lot_id',
        key: 'lot_id',
        align: 'center',
        render: (value, record, index) => value != '' ? value : '-',
    },
    {
        title: 'Thời gian bắt đầu dừng',
        dataIndex: 'thoi_gian_bat_dau_dung',
        key: 'thoi_gian_bat_dau_dung',
        align: 'center',
        render: (value, record, index) => value != '' ? value : '-',
    },
    {
        title: 'Thời gian kết thúc dừng',
        dataIndex: 'thoi_gian_ket_thuc_dung',
        key: 'thoi_gian_ket_thuc_dung',
        align: 'center',
        render: (value, record, index) => value != '' ? value : '-',
    }, 
    {
        title: 'Thời gian dừng',
        dataIndex: 'thoi_gian_dung',
        key: 'thoi_gian_dung',
        align: 'center',
        render: (value, record, index) => value != '' ? value : '-',
    }, 
    {
        title: 'Mã lỗi',
        dataIndex: 'error_id',
        key: 'error_id',
        align: 'center',
        render: (value, record, index) => value != '' ? value : '-',
    }, {
        title: 'Tên lỗi',
        dataIndex: 'error_name',
        key: 'error_name',
        align: 'center',
        render: (value, record, index) => value != '' ? value : '-',
    }, {
        title: 'Nguyên nhân lỗi',
        dataIndex: 'nguyen_nhan',
        key: 'nguyen_nhan',
        align: 'center',
        render: (value, record, index) => value != '' ? value : '-',
    }, {
        title: 'Biện pháp khắc phục lỗi',
        dataIndex: 'bien_phap',
        key: 'bien_phap',
        align: 'center',
        render: (value, record, index) => value != '' ? value : '-',
    }, {
        title: 'Biện phép phòng ngừa lỗi',
        dataIndex: 'phong_ngua',
        key: 'phong_ngua',
        align: 'center',
        render: (value, record, index) => value != '' ? value : '-',
    }, 
    {
        title: 'Tình trạng',
        dataIndex: 'tinh_trang',
        key: 'tinh_trang',
        render: (record) => {
            return record == 1 ? <Tag style={{wordWrap:'break-word'}} color="#87d068">Đã hoàn thành</Tag> : <Tag color="#929292">Chưa xử lý</Tag>
        },
        align: 'center',  
    },
    {
        title: 'Người xử lý',
        dataIndex: 'nguoi_xl',
        key: 'nguoi_xl',
        align: 'center',
        render: (value, record, index) => value != '' ? value : '-',
    },
]

const Equipment1 = (props) => {
    document.title = 'UI - Thống kê lỗi'
    const [listLines, setListLines]  = useState([]);
    const [listMachines, setListMachines] = useState([]);
    const [listIdProducts, setListIdProducts] = useState([]);
    const [listLoSX, setListLoSX] = useState([]);
    const [listStaffs, setListStaffs] = useState([]);
    const [listCustomers, setListCustomers] = useState([]);
    const [listErrorsMachine, setListErrorsMachine] = useState([]);
    const [selectedLine, setSelectedLine] = useState();
    const [selectedIdProduct, setSelectedIdProduct] = useState();
    const [selectedCustomer, setSelectedCustomer] = useState();
    const [selectedStaff, setSelectedStaff] = useState();
    const [selectedError, setSelectedError] = useState();
    const [data, setData] = useState();
    const [dataTable, setDataTable] = useState();
    const [dataPieChart, setDataPieChart] = useState([]);
    const [dataColChart, setDataColChart] = useState([]);
    const [params, setParams] = useState({
        machine_code: '',
        date: [dayjs(), dayjs()]
    });
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        (async () => {
            setLoading(true)
            const res2 = await getProducts();
                setListIdProducts(res2.data.map(e=>{
                    return {...e, label:e.id, value:e.id}
                }));
            const res3 = await getLoSanXuat();
                setListLoSX(res3.data.map(e=>{
                    return {...e, label:e, value:e}
                }));
            const res4 = await getStaffs();
                setListStaffs(res4.data.map(e=>{
                    return {...e, label:e.name, value:e.id}
                }))
                
            const res5 = await getCustomers();
                setListCustomers(res5.data.map(e=>{
                    return {...e, label:e.name, value:e.id}
                }));
            const res6 = await getErrorsMachine();
                setListErrorsMachine(res6.data.map(e=>{
                    return {...e, label:e.noi_dung, value:e.id}
                }));
            const res7 = await getMachineOfLine()
                setListMachines(res7.data.map(e=>{
                    return {...e, label:e.name, value:e.code}
                }));
            setLoading(false)
        })()
        btn_click()
    }, [])

    function  btn_click(){
        (async()=>{
            setLoading(true);
            const res = await getMachineError(params)
            setData(res.data);
            setLoading(false);
        })()
    }
    useEffect(()=>{
        if(!data) return;
        console.log(data);
        setDataTable(data.table);

        setDataPieChart(Object.keys(data.chart_err).map((item, i) => {
            return{
                id: data.chart_err[item]['id'],
                error: data.chart_err[item]['id'] + " " + data.chart_err[item]['name'],
                value: parseInt(data.chart_err[item]['value']),
            }
        }));
    
        setDataColChart(Object.keys(data.perfomance).map((item, i) => {
            console.log(data.perfomance[item]);
            return {
                type: data.perfomance[item]['machine_name'],
                value: data.perfomance[item]['thoi_gian_thuc_te'] == 0 ? 0 : parseInt((data.perfomance[item]['thoi_gian_thuc_te']/data.perfomance[item]['thoi_gian_kh'])*100),
            }
        }));

    }, [data]);

    useEffect(()=>{
        console.log(dataColChart);
    }, [dataColChart]);

    const configPieChart = {
        appendPadding: 10,
        // height:200,
        data:dataPieChart,
        angleField: 'value',
        colorField: 'error',
        radius: 0.8,
        label: {
          type: 'outer',
          content: ({id, percent }) => `${id}`+' '+`${(percent * 100).toFixed(0)}%`,
        },
    };

    var configColChart = {
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

    const [exportLoading, setExportLoading] = useState(false);
    const exportFile = async () =>{
        setExportLoading(true);
        const res = await exportMachineError(params);
        if(res.success){
            window.location.href = baseURL+res.data;
        }
        setExportLoading(false);
    }

      return <>
        <Row style={{padding: '8px'}} gutter={[8, 8]}>
            <Col span={3}>
                <Card style={{ height: '100%' }} bodyStyle={{paddingInline:0}}>
                    <div className='mb-3'>
                        <Form style={{ margin: '0 15px' }} layout="vertical">
                            <Form.Item label="Máy" className='mb-3'>
                                <Select
                                    allowClear
                                    placeholder="Nhập máy"
                                    options={listMachines}
                                    onChange={(value)=>setParams({...params, machine_code: value})}
                                />
                            </Form.Item>
                        </Form>
                    </div>
                    <Divider>Thời gian truy vấn</Divider>
                    <div className='mb-3'>
                        <Form style={{ margin: '0 15px' }} layout="vertical">
                            {/* <RangePicker placeholder={["Bắt đầu", "Kết thúc"]}/> */}
                            <Space direction='vertical' style={{width:'100%'}}>
                                <DatePicker allowClear={false} placeholder='Bắt đầu' style={{width:'100%'}} onChange={(value)=>setParams({...params, date: [value, params.date[1]]})} value={params.date[0]}/>
                                <DatePicker allowClear={false} placeholder='Kết thúc' style={{width:'100%'}} onChange={(value)=>setParams({...params, date: [params.date[0], value]})} value={params.date[1]}/>
                            </Space>
                        </Form>
                    </div>
                    <Divider>Điều kiện truy vấn</Divider>
                    <div className='mb-3'>
                    <Form style={{ margin: '0 15px' }} layout="vertical"> 
                        <Form.Item label="Lô Sản xuất" className='mb-3'>
                            <Select
                                allowClear
                                showSearch
                                placeholder="Nhập lô sản xuất"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={(value)=>setParams({...params, lo_sx: value})}
                                options={listLoSX}
                                />
                        </Form.Item>
                        <Form.Item label="Tên lỗi" className='mb-3'>
                            <Select
                                showSearch
                                // onChange={(value)=>{
                                //     setSelectedError(value);
                                // }}
                                allowClear
                                placeholder="Chọn lỗi"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={(value)=>setParams({...params, machine_error: value})}
                                options={listErrorsMachine}
                            />
                        </Form.Item>
                        
                        <Form.Item label="Nhân viên" className='mb-3'>
                            <Select
                                showSearch
                                allowClear
                                onChange={(value)=>setParams({...params, user_id: value})}
                                placeholder="Chọn nhân viên"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={listStaffs}
                                />
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
                            style={{width: '80%'}} onClick={btn_click}>
                        Truy vấn
                        </Button>
                    </div>
                </Card>
            </Col>
            <Col span={21}>
                <Row gutter={[8, 8]}>
                    <Col span={12}>
                        <Card title="Tần suất phát sinh lỗi"
                        bodyStyle={{height:'90%'}}
                            style={
                                {
                                    height: 300,
                                    padding: '0px'
                                }
                        }>
                            {!loading && <Pie {...configPieChart}/>}
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Hiệu suất máy"
                            bodyStyle={{height:'90%'}}
                            style={
                                {
                                    height: 300,
                                    padding: '0px'
                                }
                        }>
                            <Column {...configColChart}/>
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card style={{height: '100%'}} title="Thống kê chi tiết lỗi" extra={<Button loading={exportLoading} onClick={exportFile} type='primary'>Xuất excel</Button>}>
                            <Spin spinning={loading}>
                            <Table size='small' bordered
                                pagination={false}
                                scroll={
                                    {
                                        x: '150vw',
                                        y: '50vh'
                                    }
                                }
                                columns={columnTable}
                                dataSource={dataTable}/>
                            </Spin>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    </>
}

export default Equipment1;