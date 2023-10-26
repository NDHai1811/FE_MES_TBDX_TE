import {DatePicker,Col,Row,Card,Table,Tag,Layout,Divider,Button,Form,Input,theme,Select,AutoComplete, Spin, Space, Modal} from 'antd';
import {Pie} from '@ant-design/charts';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import React, { useState, useEffect } from "react";
import {getErrorsMachine, getLines, getMachineOfLine, getCustomers, getProducts, getStaffs, getLoSanXuat, getWarehouses, getCaSanXuats, getThongSoMay } from '../../../api/ui/main';
import { baseURL } from '../../../config';
import { exportThongSoMay } from '../../../api/ui/export';
import dayjs from "dayjs";

const {Sider} = Layout;
const {RangePicker} = DatePicker;

const col_detailTable = [
    {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
        render: (value, record, index) => index + 1,
        align: 'center',
        fixed: 'left'
    },
    {
        title: 'Ngày sản xuất',
        dataIndex: 'ngay_sx',
        key: 'ngay_sx',
        align: 'center',
        fixed: 'left'
    },
    {
        title: 'Tên máy',
        dataIndex: 'machine_name',
        key: 'machine_name',
        align: 'center',
        render: (value,record,index)=>record?.machine.name,
        fixed: 'left'
    },
    {
        title: 'Ca sản xuất',
        dataIndex: 'ca_sx',
        key: 'ca_sx',
        align: 'center',
        render: (value)=>parseInt(value) === 1 ? "Ca 1" : "Ca 2",
    },
            {
                title: 'Tốc độ',
                dataIndex: 'speed',
                key: 'speed',
                align: 'center',
                render: (value, record)=>{
                    return {
                        props:{
                            style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                        },
                        children: value?.value ? Math.round(String(value?.value).replace(',','')) : '-'
                    }
                }
            },
            {
                title: 'Độ ph',
                dataIndex: 'ph',
                key: 'ph',
                align: 'center',
                render: (value, record)=>{
                    return {
                        props:{
                            style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                        },
                        children: value?.value ? value?.value : '-'
                    }
                }
            },
            {
                title: 'Nhiệt độ nước',
                dataIndex: 'w_temp',
                key: 'w_temp',
                align: 'center',
                render: (value, record)=>{
                    return {
                        props:{
                            style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                        },
                        children: value?.value ? value?.value : '-'
                    }
                }
            },
            {
                title: 'Nhiệt độ môi trường',
                dataIndex: 't_ev',
                key: 't_ev',
                align: 'center',
                render: (value, record)=>{
                    return {
                        props:{
                            style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                        },
                        children: value?.value ? value?.value : '-'
                    }
                }
            },
            {
                title: 'Độ ẩm môi trường',
                dataIndex: 'e_hum',
                key: 'e_hum',
                align: 'center',
                render: (value, record)=>{
                    return {
                        props:{
                            style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                        },
                        children: value?.value ? value?.value : '-'
                    }
                }
            },
            {
                title: 'Công suất đèn UV1',
                dataIndex: 'uv1',
                key: 'uv1',
                align: 'center',
                render: (value, record)=>{
                    return {
                        props:{
                            style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                        },
                        children: value?.value ? value?.value : '-'
                    }
                }
            },
            {
                title: 'Công suất đèn UV2',
                dataIndex: 'uv2',
                key: 'uv2',
                align: 'center',
                render: (value, record)=>{
                    return {
                        props:{
                            style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                        },
                        children: value?.value ? value?.value : '-'
                    }
                }
            },
            {
                title: 'Công suất đèn UV3',
                dataIndex: 'uv3',
                key: 'uv3',
                align: 'center',
                render: (value, record)=>{
                    return {
                        props:{
                            style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                        },
                        children: value?.value ? value?.value : '-'
                    }
                }
            },

            {
                title: 'Áp lực bế',
                dataIndex: 'p_be',
                key: 'p_be',
                align: 'center',
                render: (value, record)=>{
                    return {
                        props:{
                            style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                        },
                        children: value?.value ? value?.value : '-'
                    }
                }
            },
            {
                title: 'Áp lực băng tải 1',
                dataIndex: 'p_conv1',
                key: 'p_conv1',
                align: 'center',
                render: (value, record)=>{
                    return {
                        props:{
                            style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                        },
                        children: value?.value ? value?.value : '-'
                    }
                }
            },
            {
                title: 'Áp lực băng tải 2',
                dataIndex: 'p_conv2',
                key: 'p_conv2',
                align: 'center',
                render: (value, record)=>{
                    return {
                        props:{
                            style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                        },
                        children: value?.value ? value?.value : '-'
                    }
                }
            },
            {
                title: 'Áp lực súng bắn keo',
                dataIndex: 'p_gun',
                key: 'p_gun',
                align: 'center',
                render: (value, record)=>{
                    return {
                        props:{
                            style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                        },
                        children: value?.value ? value?.value : '-'
                    }
                }
            },
            {
                title: 'Nhiệt độ thùng keo',
                dataIndex: 't_gun',
                key: 't_gun',
                align: 'center',
                render: (value, record)=>{
                    return {
                        props:{
                            style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                        },
                        children: value?.value ? value?.value.replace(',','') : '-'
                    }
                }
            },
]

const Equipment2 = (props) => {
    document.title = 'UI - Thông số máy'
    const [listMachines, setListMachines] = useState([]);
    const [listStaffs, setListStaffs] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState();

    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [params, setParams] = useState({
        machine_code: '',
        ca_sx: '',
        date: [dayjs(), dayjs()]
    });
    useEffect(()=>{
        (async () => {
            const res4 = await getStaffs();
            setListStaffs(res4.data.map(e=>{
                return {...e, label:e.name, value:e.id}
            }))
            const res5 = await getMachineOfLine();
            setListMachines(res5.data.map(e=>{
                return {...e, label:e.name, value:e.code}
            }));   
        })()
    }, [])

    async function btn_click(){
        setLoSX();
        setLoading(true)
        const res = await getThongSoMay(params);
        if(res.success){
            setData(res.data.map(e=>{
                let dataIf = e.data_if;
                Object.keys(dataIf ?? {}).forEach(function(key, index) {
                    dataIf[key] = {is_if: true, value: dataIf[key]};
                });
                let dataInput = e.data_input;
                Object.keys(dataInput ?? {}).forEach(function(key, index) {
                    dataInput[key] = {is_if: false, value: dataInput[key]};
                });
                return {...e, ...dataIf, ...dataInput}
            }))
        }
        setLoading(false);
    }

    useEffect(()=>{
        btn_click();
    }, [])
    const [loading, setLoading] = useState(false);

    const [exportLoading, setExportLoading] = useState(false);
    const exportFile = async () =>{
        setExportLoading(true);
        const res = await exportThongSoMay({...params, lo_sx: loSX});
        if(res.success){
            window.location.href = baseURL+res.data;
        }
        setExportLoading(false);
    }
    const [openDetail, setOpenDetail] = useState(false);
    const detailColumns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (value, record, index) => index + 1,
            align: 'center'
        },
        {
            title: 'Lô sx',
            dataIndex: 'lo_sx',
            key: 'lo_sx',
            align: 'center'
        },
        {
            title: 'Mã thùng/pallet',
            dataIndex: 'lot_id',
            key: 'lot_id',
            align: 'center'
        },
        
        {
            title: 'Mã máy',
            dataIndex: 'machine_code',
            key: 'machine_code',
            align: 'center'
        },
        {
            title: 'In',
            align: 'center',
            children: [
                {
                    title: 'Tốc độ',
                    dataIndex: 'speed',
                    key: 'speed',
                    align: 'center',
                    render: (value, record)=>{
                        return {
                            props:{
                                style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                            },
                            children: value?.value ? Math.round(value?.value) : '-'
                        }
                    }
                },
                {
                    title: 'Độ ph',
                    dataIndex: 'ph',
                    key: 'ph',
                    align: 'center',
                    render: (value, record)=>{
                        return {
                            props:{
                                style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                            },
                            children: value?.value ? value?.value : '-'
                        }
                    }
                },
                {
                    title: 'Nhiệt độ nước',
                    dataIndex: 'w_temp',
                    key: 'w_temp',
                    align: 'center',
                    render: (value, record)=>{
                        return {
                            props:{
                                style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                            },
                            children: value?.value ? value?.value : '-'
                        }
                    }
                },
                {
                    title: 'Nhiệt độ môi trường',
                    dataIndex: 't_ev',
                    key: 't_ev',
                    align: 'center',
                    render: (value, record)=>{
                        return {
                            props:{
                                style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                            },
                            children: value?.value ? value?.value : '-'
                        }
                    }
                },
                {
                    title: 'Độ ẩm môi trường',
                    dataIndex: 'e_hum',
                    key: 'e_hum',
                    align: 'center',
                    render: (value, record)=>{
                        return {
                            props:{
                                style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                            },
                            children: value?.value ? value?.value : '-'
                        }
                    }
                },
            ]
        },
        {
            title: 'Phủ',
            align: 'center',
            children: [
                {
                    title: 'Công suất đèn UV1',
                    dataIndex: 'uv1',
                    key: 'uv1',
                    align: 'center',
                    render: (value, record)=>{
                        return {
                            props:{
                                style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                            },
                            children: value?.value ? value?.value : '-'
                        }
                    }
                },
                {
                    title: 'Công suất đèn UV2',
                    dataIndex: 'uv2',
                    key: 'uv2',
                    align: 'center',
                    render: (value, record)=>{
                        return {
                            props:{
                                style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                            },
                            children: value?.value ? value?.value : '-'
                        }
                    }
                },
                {
                    title: 'Công suất đèn UV3',
                    dataIndex: 'uv3',
                    key: 'uv3',
                    align: 'center',
                    render: (value, record)=>{
                        return {
                            props:{
                                style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                            },
                            children: value?.value ? value?.value : '-'
                        }
                    }
                },
            ]
        },
        {
            title: 'Bế',
            align: 'center',
            children: [
                {
                    title: 'Áp lực bế',
                    dataIndex: 'p_be',
                    key: 'p_be',
                    align: 'center',
                    render: (value, record)=>{
                        return {
                            props:{
                                style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                            },
                            children: value?.value ? value?.value : '-'
                        }
                    }
                },
            ]
        },
        {
            title: 'Gấp dán',
            align: 'center',
            children: [
                {
                    title: 'Áp lực băng tải 1',
                    dataIndex: 'p_conv1',
                    key: 'p_conv1',
                    align: 'center',
                    render: (value, record)=>{
                        return {
                            props:{
                                style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                            },
                            children: value?.value ? value?.value : '-'
                        }
                    }
                },
                {
                    title: 'Áp lực băng tải 2',
                    dataIndex: 'p_conv2',
                    key: 'p_conv2',
                    align: 'center',
                    render: (value, record)=>{
                        return {
                            props:{
                                style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                            },
                            children: value?.value ? value?.value : '-'
                        }
                    }
                },
                {
                    title: 'Áp lực súng bắn keo',
                    dataIndex: 'p_gun',
                    key: 'p_gun',
                    align: 'center',
                    render: (value, record)=>{
                        return {
                            props:{
                                style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                            },
                            children: value?.value ? value?.value : '-'
                        }
                    }
                },
                {
                    title: 'Nhiệt độ thùng keo',
                    dataIndex: 't_gun',
                    key: 't_gun',
                    align: 'center',
                    render: (value, record)=>{
                        return {
                            props:{
                                style:{backgroundColor: value?.is_if ? '#ebebeb' : ''}
                            },
                            children: value?.value ? value?.value : '-'
                        }
                    }
                },
            ]
        }, 
    ]
    const [loSX, setLoSX] = useState();
    const onClickRow = async (record) =>{
        setLoSX(record.lo_sx)
    }
    useEffect(()=>{
        if(loSX){
            (async ()=>{
                const res = await getThongSoMay({...params, lo_sx: loSX});
                if(res.success){
                    setData(res.data.map(e=>{
                        let dataIf = e.data_if;
                        Object.keys(dataIf ?? {}).forEach(function(key, index) {
                            dataIf[key] = {is_if: true, value: dataIf[key]};
                        });
                        let dataInput = e.data_input;
                        Object.keys(dataInput ?? {}).forEach(function(key, index) {
                            dataInput[key] = {is_if: false, value: dataInput[key]};
                        });
                        return {...e, ...dataIf, ...dataInput}
                    }))
                }
            })()
        }
    }, [loSX])
    return <>
        <Row style={{padding: '8px', height:'100vh'}} gutter={[8, 8]}>
            <Col span={3}>
                <Card style={{ height: '100%' }} bodyStyle={{paddingInline:0}}>
                    <div className='mb-3'>
                            <Form style={{ margin: '0 15px' }} layout="vertical">
                                <Form.Item label="Máy" className='mb-3'>
                                    <Select
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
                                    {/* <RangePicker placeholder={["Bắt đầu", "Kết thúc"]} onChange={(value)=>setParams({...params, date: value})} value={params.date}/> */}
                                <Space direction='vertical' style={{width:'100%'}}>
                                    <DatePicker allowClear={false} placeholder='Bắt đầu' style={{width:'100%'}} onChange={(value)=>setParams({...params, date: [value, params.date[1]]})} value={params.date[0]}/>
                                    <DatePicker allowClear={false} placeholder='Kết thúc' style={{width:'100%'}} onChange={(value)=>setParams({...params, date: [params.date[0], value]})} value={params.date[1]}/>
                                </Space>
                            </Form>
                        </div>
                        <Divider>Điều kiện truy vấn</Divider>
                        <div className='mb-3'>
                        <Form style={{ margin: '0 15px' }} layout="vertical" onValuesChange={(value)=>setParams({...params, ...value})}> 
                            <Form.Item label="Ca" className='mb-3' name={"ca_sx"}>
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Chọn ca sản xuất"
                                    options={
                                        [{
                                            label: 'Ca 1',
                                            value: 1,
                                        },
                                        {
                                            label: 'Ca 2',
                                            value: 2,
                                        },]
                                    }
                                    />
                            </Form.Item>
                            <Form.Item label="Thời gian ghi nhận IF" className='mb-3' name={"date_if"}>
                                <DatePicker placeholder='Chọn thời gian ghi nhận IF' style={{width:'100%'}} />
                            </Form.Item>
                            <Form.Item label="Thời gian ghi nhận nhập" className='mb-3' name={"date_input"}>
                                <DatePicker placeholder='Chọn thời gian ghi nhận nhập' style={{width:'100%'}}/>
                            </Form.Item>
                            
                            <Form.Item label="Nhân viên" className='mb-3'>
                                <Select
                                    showSearch
                                    onChange={(value)=>{setSelectedStaff(value)}}
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
                <Card style={{height: '100%'}} title="Thông số máy" extra={<Button type='primary' onClick={exportFile} loading={exportLoading}>Xuất excel</Button>}>
                    <Spin spinning={loading}>
                        <Table size='small' bordered
                        pagination={false}
                        scroll={
                        {
                            x: '150vw',
                            y: '80vh'
                        }
                        }
                        // style={{height:'100%'}}
                        onRow={(record, rowIndex) => {
                            return {
                              onClick: (event) => {onClickRow(record)},
                            };
                        }}
                        columns={col_detailTable}
                        dataSource={data}/>
                    </Spin>
                </Card>
            </Col>
            <Modal title="Chi tiết thông số máy" open={openDetail} onCancel={()=>setOpenDetail(false)}>
                <Table size='small' bordered
                    pagination={false}
                    scroll={
                    {
                        x: '150vw',
                        y: '60vh'
                    }
                    }
                    // style={{height:'100%'}}
                    columns={col_detailTable}
                    dataSource={data}/>
            </Modal>
        </Row>
        
    </>
}

export default Equipment2;
