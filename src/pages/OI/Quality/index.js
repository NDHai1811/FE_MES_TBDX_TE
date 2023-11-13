import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Modal, Spin, Form, InputNumber, message, Input, Space, Button, Radio } from 'antd';
import { withRouter } from "react-router-dom";
import '../style.scss';
import Checksheet2 from '../../../components/Popup/Checksheet2';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import SelectButton from '../../../components/Button/SelectButton';
import { useProfile } from '../../../components/hooks/UserHooks';
import { getListMachine } from '../../../api';
import QuanLyLoi from '../../../components/Popup/QuanLyLoi';
import { sendQCResult } from '../../../api/oi/quality';

const Quality = (props) => {
    document.title = "Kiểm tra chất lượng";
    const [messageApi, contextHolder] = message.useMessage();
    const { line } = useParams();
    const history = useHistory();
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState();
    const [data, setData] = useState([
        {
            lot_id:'xxxxxxxx.01',
            san_luong:'100',
            sl_loi:'0',
            sl_ng:'0',
            result:0
        },
        {
            lot_id:'xxxxxxxx.02',
            san_luong:'100',
            sl_loi:'0',
            sl_ng:'0',
            result:0
        },
        {
            lot_id:'xxxxxxxx.03',
            san_luong:'100',
            sl_loi:'0',
            sl_ng:'0',
            result:0
        },
        {
            lot_id:'xxxxxxxx.04',
            san_luong:'100',
            sl_loi:'0',
            sl_ng:'0',
            result:0
        },
        {
            lot_id:'xxxxxxxx.05',
            san_luong:'100',
            sl_loi:'0',
            sl_ng:'0',
            result:2
        },
        {
            lot_id:'xxxxxxxx.06',
            san_luong:'100',
            sl_loi:'0',
            sl_ng:'0',
            result:1
        },
        {
            lot_id:'xxxxxxxx.07',
            san_luong:'100',
            sl_loi:'1',
            sl_ng:'100',
            result:1
        },
        {
            lot_id:'xxxxxxxx.08',
            san_luong:'100',
            sl_loi:'1',
            sl_ng:'100',
            result:1
        },
    ]);
    const { userProfile } = useProfile()
    const overallColumns = [
        {
            title: 'Sản lượng',
            dataIndex: 'so_luong',
            key: 'so_luong',
            align: 'center',
            width: (100/3)+'%'
        },
        {
            title: 'SL lỗi',
            dataIndex: 'sl_ng',
            key: 'sl_ng',
            align: 'center',
            width: (100/3)+'%'
        },
        {
            title: 'SL phế',
            dataIndex: 'sl_ng',
            key: 'sl_ng',
            align: 'center',
            width: (100/3)+'%'
        },
    ]
    const checkingTable = [
        {
            title: 'Số Lot',
            dataIndex: 'lot_id',
            key: 'lot_id',
            align: 'center',
            width: '30%'
        },
        {
            title: 'SL Phế',
            dataIndex: 'sl_ng',
            key: 'sl_ng',
            align: 'center',
        },
        {
            title: 'SL lỗi N.Quan',
            dataIndex: 'sl_ngoai_quan',
            key: 'sl_ngoai_quan',
            align: 'center',
        },
        {
            title: 'SL lỗi K.Thước',
            dataIndex: 'sl_kich_thuoc',
            key: 'sl_kich_thuoc',
            align: 'center',
        },
        {
            title: 'Phán định',
            dataIndex: 'result',
            key: 'result',
            align: 'center',
            render: (value) => {
                switch (value) {
                    case 0:
                        return 'waiting'
                        break;
                    case 1:
                        return 'OK'
                        break;
                    case 2:
                        return 'NG'
                        break;
                    default:
                        return ''
                        break;
                }
            }
        },
    ]
    const columns = [
        {
            title: 'Số lot',
            dataIndex: 'lot_id',
            key: 'lot_id',
            align: 'center',
            width:'32%'
        },
        {
            title: 'Sản lượng',
            dataIndex: 'san_luong',
            key: 'san_luong',
            align: 'center',
            width:'18%'
        },
        {
            title: 'SL lỗi',
            dataIndex: 'sl_loi',
            key: 'sl_loi',
            align: 'center',
            width:'18%'
        },
        {
            title: 'SL phế',
            dataIndex: 'sl_ng',
            key: 'sl_ng',
            align: 'center',
            width:'16%'
        },
        {
            title: 'Phán định',
            dataIndex: 'result',
            key: 'result',
            align: 'center',
            width:'16%',
            render: (value) => {
                switch (value) {
                    case 0:
                        return 'waiting'
                        break;
                    case 1:
                        return 'OK'
                        break;
                    case 2:
                        return 'NG'
                        break;
                    default:
                        return ''
                        break;
                }
            }
        },
    ];
    const rowClassName = (record, index) => {
        if(record.lot_id === selectedRow?.lot_id){
            return 'table-row-green';
        }
        switch (record.result) {
            case 0:
                return ''
                break;
            case 1:
                return 'table-row-grey'
                break;
            case 2:
                return 'table-row-red'
                break;
            default:
                return ''
                break;
        }
    }
    const onClickRow = (event, record) => {
        // setSelectedRow(record);
    }
    const onDBClickRow = (event, record, index) => {
        if(record.result === 0){
            setSelectedRow(record);
            // setData(prev=>{
            //     const newData = [...prev];
            //     newData.splice(index, 1);
            //     newData.unshift(record)
            //     return newData;
            // })
        }
    }

    async function getData(){
        setLoading(true);
        var machines = await getListMachine(); //Lấy dữ liệu danh sách lot QC
        setData(data);
        if(data.length > 0 && data[0].result === 0){
            setSelectedRow(data[0]);
        }
        setLoading(false);
    }
    useEffect(()=>{
        (async ()=>{
            var machines = await getListMachine();
            setMachines(machines);
        })()
    }, [])
    useEffect(()=>{
        if(line){
            getData()
            const screen = JSON.parse(localStorage.getItem('screen'));
            localStorage.setItem('screen', JSON.stringify({...screen, quality: line ? line : ''}))
        }else{
            history.push('/quality/S01')
        }
    }, [line])
    const onChangeLine = (value) => {
        history.push('/quality/' + value)
    }
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const onSubmitSLP = async (values) =>{
        if(selectedRow?.lot_id){
            onSubmitResult(values);
        }
        setOpenModal1(false)
        form1.resetFields();
    }
    const onSubmitPhanDinh = async (values) =>{
        if(selectedRow?.lot_id){
            onSubmitResult(values);
        }
        setOpenModal2(false)
        form2.resetFields();
    }
    const qcPermission = ['pqc', 'oqc', '*'].filter(value => (userProfile?.permission??[]).includes(value));
    const [openModal1, setOpenModal1] = useState(false);
    const [openModal2, setOpenModal2] = useState(false);

    const onSubmitResult = async (values) => {
        var res = await sendQCResult({machine_id: line, lot_id: selectedRow?.lot_id, data:values});
        getData()
    }
    return (
        <React.Fragment>
            {contextHolder}
            <Spin spinning={loading}>
                <Row gutter={[2, 12]} className='mt-3'>
                    <Col span={6}>
                    <SelectButton value={machines.length > 0 && machines.some(e=>e.value === line) && line} options={machines} label="Vị trí" onChange={onChangeLine} />
                    </Col>
                    <Col span={18}>
                        <Table
                            rowClassName={(record, index) => 'table-row-light'}
                            locale={{emptyText: 'Trống'}}
                            pagination={false}
                            bordered={true}
                            columns={overallColumns}
                            dataSource={[]}
                            size='small'
                            style={{borderRadius: 12}}
                        />
                    </Col>
                </Row>

                <Row className='mt-3' style={{ justifyContent: 'space-between' }}>
                    <Col span={24}>
                        <Table
                            rowClassName={(record, index) => 'table-row-light'}
                            locale={{emptyText: 'Trống'}}
                            pagination={false}
                            bordered={true}
                            columns={checkingTable}
                            dataSource={selectedRow ? [selectedRow] : []}
                            size='small'
                        />
                    </Col>
                </Row>

                <Row className='mt-3' style={{ justifyContent: 'space-between' }} gutter={6}>
                    <Col span={6} >
                        <Button disabled={!selectedRow?.lot_id} type={'default'} danger={selectedRow?.result===2} size='large' className='w-100 text-wrap h-100' onClick={selectedRow?.result===0 ?() => { setOpenModal1(true); form1.resetFields()} : null}>KT số lượng phế</Button>
                    </Col>
                    <Col span={6} >
                        <QuanLyLoi text="KT ngoại quan" selectedLot={selectedRow} onSubmit={onSubmitResult}/>
                    </Col>
                    <Col span={6}>
                        <Checksheet2 text="KT kích thước" selectedLot={selectedRow} onSubmit={onSubmitResult}/>
                    </Col>
                    <Col span={6}>
                        <Button disabled={!selectedRow?.lot_id} type={'default'} danger={selectedRow?.result===2} size='large' className='w-100 text-wrap h-100' onClick={selectedRow?.result===0 ? () =>{ setOpenModal2(true); form2.resetFields()} : null}>Phán định</Button>
                    </Col>
                </Row>

                <Table
                    rowClassName={rowClassName}
                    // scroll={{ y: '50vh' }}
                    pagination={false}
                    bordered={true}
                    className='mt-3 mb-3'
                    columns={columns}
                    dataSource={data}
                    size='small'
                    onRow={(record, index) => {
                        return {
                            onClick: (event) => {onClickRow(event, record)}, // click row
                            onDoubleClick: (event) => {onDBClickRow(event, record, index)}, // double click row
                        };
                    }}
                    components={{
                        rowHoverBg: '#000000'
                    }}
                />
                <Modal title="Số lượng phế" open={openModal1} onCancel={()=>setOpenModal1(false)}
                okText={"Xác nhận"}
                okButtonProps={{
                    onClick: ()=>form1.submit(),
                }}>
                    <Form
                    form={form1}
                    initialValues={{
                        sl_ng: 0
                    }}
                    onFinish={onSubmitSLP}>
                        <Form.Item name={'sl_ng'}>
                            <InputNumber style={{width:'100%'}} inputMode='numeric'/>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title="Phán định" open={openModal2} onCancel={()=>setOpenModal2(false)}
                okText={"Xác nhận"}
                okButtonProps={{
                    onClick: ()=>form1.submit(),
                }}>
                    <Form
                    form={form2}
                    initialValues={{
                        result: 0
                    }}
                    onFinish={onSubmitPhanDinh}>
                        <Form.Item name={'phan-dinh'}>
                            <Radio.Group size='large'
                            style={{float:'right', width:'100%', height:'100%'}}
                            className='d-flex'
                            optionType="button"
                            buttonStyle="solid">
                                <Radio.Button value={1} className={'positive-radio text-center h-100 d-flex align-items-center justify-content-center'} style={{flex:1}}>OK</Radio.Button>
                                <Radio.Button value={2} className='negative-radio text-center h-100 d-flex align-items-center justify-content-center' style={{flex:1}}>NG</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Modal>
            </Spin>
        </React.Fragment>
    );
};

export default withRouter(Quality);