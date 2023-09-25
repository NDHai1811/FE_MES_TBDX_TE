import {Modal, Button, Card, Col, DatePicker, Divider, Form, Input, Layout, Radio, Row, Select, AutoComplete, Table, Tabs, Typography, Space, Spin} from "antd";
import {Content} from "antd/es/layout/layout";
import React, { useState, useEffect } from "react";
import { Pie, Column ,Line} from '@ant-design/plots';
import DataDetail from "../../../components/DataDetail";
import {getErrors, getLines, getMachineOfLine, getCustomers, 
    getProducts, getStaffs, getLoSanXuat, getWarehouses, getCaSanXuats , getPQCHistory, getDataFilterUI, getDetailDataError
} from '../../../api/ui/main';
import dayjs from "dayjs";
import {exportPQC } from '../../../api/ui/export';
import { baseURL } from '../../../config';


const {Sider} = Layout;
const { RangePicker } = DatePicker;

const QualityPQC = (props) => {
    document.title = "UI - PQC";
    const [listLines, setListLines]  = useState([]);
    const [listMachines, setListMachines] = useState([]);
    const [listIdProducts, setListIdProducts] = useState([]);
    const [listLoSX, setListLoSX] = useState([]);
    const [listStaffs, setListStaffs] = useState([]);
    const [listCustomers, setListCustomers] = useState([]);
    const [listErrors, setListErrors] = useState([]);
    const [selectedLine, setSelectedLine] = useState();
    const [listNameProducts, setListNameProducts] = useState([]);
    const [params, setParams] = useState({date: [dayjs(), dayjs()]})
    useEffect(()=>{
        (async () => {
                const res1 = await getLines();
                    setListLines(res1.data.map(e=>{
                        return {...e, label:e.name, value:e.id}
                    }));
                // const res2 = await getProducts();
                //     setListIdProducts(res2.data.map(e=>{
                //         return {...e, label:e.id, value:e.id}
                //     }));
                // const res3 = await getLoSanXuat();
                //     setListLoSX(res3.data.map(e=>{
                //         return {...e, label:e, value:e}
                //     }));
                // const res4 = await getStaffs();
                //     setListStaffs(res4.data.map(e=>{
                //         return {...e, label:e.name, value:e.id}
                //     }))
                    
                const res5 = await getCustomers();
                    setListCustomers(res5.data.map(e=>{
                        return {...e, label:e.name, value:e.id}
                    }));
                // const res6 = await getErrors();
                //     setListErrors(res6.data.map(e=>{
                //         return {...e, label:e.noi_dung, value:e.id}
                //     }));
                    
        })()
        btn_click()
    }, [])

    useEffect(()=>{
        (async ()=>{
            var res = await getDataFilterUI({khach_hang: params.khach_hang});
            if(res.success){
                setListNameProducts(res.data.product.map(e => {
                    return { ...e, label: e.name, value: e.id }
                }));
                setListLoSX(Object.values(res.data.lo_sx).map(e => {
                    return { label: e, value: e }
                }));
            }
        })()
    }, [params.khach_hang])

    useEffect(()=>{
        if(listLines.length > 0) setSelectedLine(listLines[1].id);
    }, [listLines]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [data, setData] = useState();
    const [dataTable2, setDataTable2] = useState();
    const [dataLineChart, setDataLineChart] = useState([]);
    const [dataPieChart, setDataPieChart] = useState([]);
    const [dataPieChart_NG, setDataPieChart_NG] = useState([]);

    const configLineChart = {
        data:dataLineChart,
        height:200,
        xField: 'date',
        yField: 'value',
        seriesField: 'error',
        legend: {
            position: 'top',
        },
        smooth: true,
        animation: {
            appear: {
            animation: 'path-in',
            duration: 5000,
            },
        },
    };
    const configPieChart = {
        appendPadding: 10,
        height:200,
        data:dataPieChart,
        angleField: 'value',
        colorField: 'error',
        radius: 0.8,
        label: {
            type: 'outer',
            content: '{name} {percentage}',
        },
    };
    const configPieChart2 = {
        appendPadding: 10,
        height:200,
        data:dataPieChart_NG,
        angleField: 'value',
        colorField: 'error',
        radius: 0.8,
        legend: false,
        label: {
            type: 'outer',
            content: '{name} {percentage}',
        },
    };

    async function btnNG_click(record){
        const errors = record.errors;
        console.log(errors);
        if(!errors || errors.length <= 0) return;
        else{
            setDataPieChart_NG(Object.keys(errors).map((item, i) => {
                return{
                    error:errors[item].name,
                    value:errors[item].value,
                }
            }))
            setDataDetailError([...Object.keys(errors).map((item, i) => {
                return{
                    name:errors[item].name,
                    value:errors[item].value
                }
            })])
            showModal();
        }
    }
    
    const columns2 = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            render: (value, record, index) => index+1
        },
        {
            title: 'Ngày SX',
            dataIndex: 'ngay_sx',
            key: 'ngay_sx',
            align: 'center',
        },
        {
            title: 'Ca',
            dataIndex: 'ca_sx',
            key: 'ca_sx',
            align: 'center',
        },
        {
            title: 'Xưởng',
            dataIndex: 'xuong',
            key: 'xuong',
            align: 'center',
        },
        {
            title: 'Công đoạn',
            dataIndex: 'cong_doan',
            key: 'cong_doan',
            align: 'center',
        },
        {
            title: 'Máy sản xuất',
            dataIndex: 'machine',
            key: 'machine',
            align: 'center',
        },
        {
            title: 'Mã máy',
            dataIndex: 'machine_id',
            key: 'machine_id',
            align: 'center',
        },
        {
            title: 'Khách hàng',
            dataIndex: 'khach_hang',
            key: 'khach_hang',
            align: 'center',
        },
        {
            title: 'Mã hàng',
            dataIndex: 'product_id',
            key: 'product_id',
            align: 'center',
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'ten_san_pham',
            key: 'ten_san_pham',
            align: 'center',
        },
        {
            title: 'Lô SX',
            dataIndex: 'lo_sx',
            key: 'lo_sx',
            align: 'center',
        },
        {
            title: 'Mã thùng/pallet',
            dataIndex: 'lot_id',
            key: 'lot_id',
            align: 'center',
        },
        {
            title: 'Số lượng đầu ra thực tế',
            dataIndex: 'sl_dau_ra_hang_loat',
            key: 'sl_dau_ra_hang_loat',
            align: 'center',
        },
        {
            title: 'Số lượng đầu ra OK',
            dataIndex: 'sl_dau_ra_ok',
            key: 'sl_dau_ra_ok',
            align: 'center',
        },
        {
            title: 'Số lượng NG (SX tự KT)',
            dataIndex: 'sl_ng_sxkt',
            key: 'sl_ng_sxkt',
            align: 'center',
        },
        {
            title: 'Số lượng NG (PQC)',
            dataIndex: 'sl_ng_pqc',
            key: 'sl_ng_pqc',
            align: 'center',
        },
        {
            title: 'Số lượng NG',
            dataIndex: 'sl_ng',
            key: 'sl_ng',
            align: 'center',
            render: (value1, record, index)=>{
                value1 = parseInt(value1);
                //   let lot_id = record['lot_id'];
                return <>
                    <Button  style={{backgroundColor:'red', color:'white'}} 
                        onClick={()=>btnNG_click(record)}>
                        {value1}
                    </Button>
                    
                </>
            }
        },
        {
            title: 'Tỉ lệ NG',
            dataIndex: 'ti_le_ng',
            key: 'ti_le_ng',
            align: 'center',
        },
    ];

    function  btn_click(){
        (async () => {
            setLoading(true)
            const res1 = await getPQCHistory(params);
            setData(res1.data);
            setLoading(false);
        })()
    }

    useEffect(()=>{
        if(!data) return ;         
        setDataTable2(data.table);

        let res_lineChart = [];
        let res_pieChart = {};
        Object.keys(data.chart).forEach(function(key){
           Object.keys(data.chart[key]).forEach(function(key_c){
              let data_L = {
                date: key,
                error: key_c,
                value: data.chart[key][key_c],
              };
              res_lineChart.push(data_L);
              if(!res_pieChart[key_c]){
                res_pieChart[key_c] = data.chart[key][key_c];
              } 
              else res_pieChart[key_c] += data.chart[key][key_c];
           })
        })
        res_pieChart = Object.fromEntries(
            Object.entries(res_pieChart).sort(([,a],[,b]) => b-a)
        );
        let sorted_resPieChart = [];
        let sort_i = 0;
        for(let item in res_pieChart){
                sorted_resPieChart[item] = res_pieChart[item];
                sort_i++;
            if(sort_i>=5) break;
        }

        setDataLineChart(res_lineChart);
        setDataPieChart(Object.keys(sorted_resPieChart).map((item, i) => {
          return{
              error:item,
              value: sorted_resPieChart[item],
          }
        }
        ));

    }, [data]);
    const [exportLoading, setExportLoading] = useState(false);
    const exportFile = async () =>{
        setExportLoading(true);
        const res = await exportPQC(params);
        if(res.success){
            window.location.href = baseURL+res.data;
        }
        setExportLoading(false);
    }

    const [loading, setLoading] = useState(false);
    const columnDetailErrorDefault = [
        {
            title: 'Số lượng NG',
            dataIndex: 'sl_ng',
            key: 'sl_ng',
            align: 'center',
        },
    ]
    const [columnDetailError, setColumnDetailError] = useState([
        {
            title: 'Tên lỗi',
            key: 'name',
            dataIndex: 'name',
            align: 'center'
        },
        {
            title: 'Số lượng',
            key: 'value',
            dataIndex: 'value',
            align: 'center'
        }
    ]);
    const [dataDetailError, setDataDetailError] = useState([]);
    return (
        <React.Fragment>
            <Row style={{padding: '8px', height:'100vh'}} gutter={[8, 8]}>
                <Col span={3}>
                    <Card style={{ height: '100%' }} bodyStyle={{paddingInline:0}}>
                        <div className='mb-3'>
                        <Form style={{ margin: '0 15px' }} layout="vertical">
                            <Form.Item label="Công đoạn" className='mb-3'>
                                <Select
                                    allowClear
                                    onChange={(value)=>setParams({...params, line_id: value})}
                                    placeholder="Nhập công đoạn"
                                    options={listLines}
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
                                <Form.Item label="Khách hàng" className='mb-3'>
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder="Chọn khách hàng"
                                        onChange={(value)=>setParams({...params, khach_hang: value})}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={listCustomers}
                                        />
                                </Form.Item>
                                <Form.Item label="Tên sản phẩm" className='mb-3'>
                                    <Select
                                        allowClear
                                        showSearch
                                        onChange={(value)=>{
                                            setParams({...params, ten_sp: value})
                                        }}
                                        placeholder="Nhập tên sản phẩm"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={listNameProducts}
                                        />
                                </Form.Item>
                                <Form.Item label="Lô Sản xuất" className='mb-3'>
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder="Nhập lô sản xuất"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        onChange={(value)=>{
                                            setParams({...params, lo_sx: value})
                                        }}
                                        options={listLoSX}
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
                            <Card title="Biểu đồ xu hướng lỗi" style={{ height: '100%',padding: '0px'}} bodyStyle={{padding:12}}>
                                <Line {...configLineChart}/>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Biểu đồ tỉ lệ lỗi" style={{ height: '100%',padding: '0px'}} bodyStyle={{padding:12}}>
                                <Pie {...configPieChart}/>
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card title="Bảng chi tiết lỗi" style={{ height: '100%',padding: '0px'}} bodyStyle={{padding:12}} extra={<Button type='primary'loading={exportLoading} onClick={exportFile}>Xuất excel</Button>}>
                                <Spin spinning={loading}>
                                    <Table bordered columns={columns2} dataSource={dataTable2} pagination={false} scroll={
                                        {
                                            x: '120vw',
                                            y: '50vh'
                                        }
                                    } />
                                </Spin>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                
            </Row>
            
            <Modal  title="Chi tiết NG" open={isModalOpen} footer={null} onCancel={closeModal} width={600}>
                <Row gutter={8}>
                    <Col span={12}>
                        <Table bordered size="small" scroll={{x: '100%'}} columns={columnDetailError} dataSource={dataDetailError} pagination={false}></Table>
                    </Col>
                    <Col span={12}>
                        <Pie {...configPieChart2}></Pie>
                    </Col>
                </Row>
                
            </Modal>
        </React.Fragment>
    )
}

export default QualityPQC;
