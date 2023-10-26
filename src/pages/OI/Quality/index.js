import React, { useEffect, useState } from 'react';
import { CloseOutlined, PrinterOutlined, QrcodeOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Row, Col, Divider, Button, Table, Modal, Select, Steps, Input, Space, Spin, Form, InputNumber, message } from 'antd';
import { withRouter, Link } from "react-router-dom";
import '../style.scss';
import Checksheet1 from '../../../components/Popup/Checksheet1';
import Checksheet2 from '../../../components/Popup/Checksheet2';
import Checksheet3 from '../../../components/Popup/Checksheet3';
import ScanButton from '../../../components/Button/ScanButton';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import DataDetail from '../../../components/DataDetail';
import { getInfoPallet, getLine } from '../../../api/oi/manufacture';
import { getChecksheetList, getInfoPalletQC, getLoSXDetail, getQCOverall, inTemVang, scanError, scanPallet, updateSoLuongTemVang } from '../../../api/oi/quality';
import QuanLyLoi from '../../../components/Popup/QuanLyLoi';
import SelectButton from '../../../components/Button/SelectButton';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import TemVang from './TemVang';
import { useProfile } from '../../../components/hooks/UserHooks';
const columns = [
    {
        title: 'Ngày sản xuất',
        dataIndex: 'ngay_sx',
        key: 'ngay_sx',
        align: 'center'
    },
    {
        title: 'Pallet',
        dataIndex: 'lot_id',
        key: 'lot_id',
        align: 'center'
    },
    {
        title: 'Mã SP',
        dataIndex: 'ma_hang',
        key: 'ma_hang',
        align: 'center',
    },
    {
        title: 'Tên SP',
        dataIndex: 'ten_sp',
        key: 'ten_sp',
        align: 'center',
    },
    {
        title: 'Lô sản xuất',
        dataIndex: 'lo_sx',
        key: 'lo_sx',
        align: 'center'
    },
    {
        title: 'Lượng Sản xuất',
        dataIndex: 'luong_sx',
        key: 'luong_sx',
        align: 'center'
    },
    {
        title: 'Số lượng OK',
        dataIndex: 'sl_ok',
        key: 'sl_ok',
        align: 'center'
    },
    {
        title: 'Tỉ lệ OK',
        dataIndex: 'ti_le_ok',
        key: 'ti_le_ok',
        align: 'center',
        render: (value, record)=>record.sl_dau_ra && `${(record.sl_dau_ra ? (record.sl_ok/record.sl_dau_ra) : 0).toFixed(2)*100}%`,
    },
    {
        className: 'yellow',
        title: 'SL tem vàng',
        dataIndex: 'sl_tem_vang',
        key: 'sl_tem_vang',
        align: 'center',
    },
    {
        title: 'SL NG',
        dataIndex: 'sl_ng',
        key: 'sl_ng',
        align: 'center',
        className: 'red'
    },
];
const Quality = (props) => {
    const [messageApi, contextHolder] = message.useMessage();
    document.title = "Kiểm tra chất lượng";
    const { line } = useParams();
    const history = useHistory();
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chitieu, setChiTieu] = useState({
        checksheet1: [],
        checksheet2: [],
        checksheet3: [],
    });
    const [selectedRow, setSelectedRow] = useState();
    const [data, setData] = useState([]);
    const { userProfile } = useProfile()
    useEffect(()=>{
        setSelectedRow()
        if(line){
            (async ()=>{
                setLoading(true);
                const lineList = await getLine({type: 'cl'});
                setOptions(lineList.data);
                const overall = await getQCOverall({line_id: line});
                setRow1([
                    {
                        title: 'Kế hoạch',
                        value: overall.data.ke_hoach,
                    },
                    {
                        title: 'Mục tiêu',
                        value: overall.data.muc_tieu,
                    },
                    {
                        title: 'Kết quả',
                        value: overall.data.ket_qua,
                    },
                ]);
                const tableData = await getInfoPalletQC({type: 2, line_id: line});
                if(tableData.success){
                    setData(tableData.data)
                }
                setRow2([
                    {
                        title: 'Lô SX',
                        value: '',
                    },
                    {
                        title: 'Mã SP đang sản xuất',
                        value: '',
                    },
                    {
                        title: 'SL KH',
                        value: '',
                    },
                    {
                        title: 'SL T.tế',
                        value: '',
                    },
                    {
                        title: 'Tỷ lệ HT',
                        value: '',
                    },
                ]);
                const errors = await scanError();
                setErrorList(errors.data.map(e=>{
                    return {...e, key: e.id};
                }));
                setLoading(false);
            })();
            const screen = JSON.parse(localStorage.getItem('screen'));
            localStorage.setItem('screen', JSON.stringify({...screen, quality: line ? line : ''}))
        }else{
            history.push('/quality/10')
        }
        setKvValue();
        setChiTieu({
            checksheet1: [],
            checksheet2: [],
            checksheet3: [],
        })
        setSelectedRowKeys([])
    }, [line])
    useEffect(()=>{
        if(selectedRow){
            (async ()=>{
                var res = await getChecksheetList({line_id: line, lot_id: selectedRow.lot_id});
                let checksheet = {...chitieu};
                Object.keys(res?.data?.chi_tieu).forEach(key => {
                    switch (key) {
                        case 'kich-thuoc':
                            checksheet.checksheet1.key = {key: key, title: res?.data?.chi_tieu[key] ? res?.data?.chi_tieu[key] : '1'};
                            checksheet.checksheet1.data = res.data.data[key]
                            break;
                        case 'dac-tinh':
                            checksheet.checksheet2.key = {key: key, title: res?.data?.chi_tieu[key] ? res?.data?.chi_tieu[key] : '2'};
                            checksheet.checksheet2.data = res.data.data[key]
                            break;
                        case 'ngoai-quan':
                            checksheet.checksheet3.key = {key: key, title: res?.data?.chi_tieu[key] ? res?.data?.chi_tieu[key] : '3'};
                            checksheet.checksheet3.data = res.data.data[key]
                            break;
                        default:
                            break;
                    }
                })
                setChiTieu(checksheet);
            })()
        }
    }, [selectedRow])
    const onChangeLine = (value) => {
        history.push('/quality/' + value)
    }
    const onScan = async (result) => {
        count.current += 1;
        var res = await scanPallet({lot_id: result, line_id: line});
        if(res.success){
            const tableData = await getInfoPalletQC({type: 2, line_id: line});
            if(tableData.success){
                setData(tableData.data)
            }
            const losx = await getLoSXDetail({lot_id: result, line_id: line});
            if(losx.success){
                setSelectedRow(losx.data)
            }
        }
    }
    useEffect(()=>{
        if(selectedRow){
            setRow2([
                {
                    title: 'Lô SX',
                    value: selectedRow?.lo_sx,
                },
                {
                    title: 'Mã SP đang sản xuất',
                    value: selectedRow?.ma_hang,
                },
                {
                    title: 'SL KH',
                    value: selectedRow?.sl_ke_hoach,
                },
                {
                    title: 'SL T.tế',
                    value: selectedRow?.sl_thuc_te,
                },
                {
                    title: 'Tỷ lệ HT',
                    value:  `${selectedRow?.sl_ke_hoach ? parseInt((selectedRow?.sl_thuc_te/selectedRow?.sl_ke_hoach)*100) : 0}%`,
                },
            ]);
            setListCheck([{...selectedRow, 
                soluongtp: selectedRow.sl_thuc_te, 
                product_id: selectedRow.ma_hang, 
                lsx: selectedRow.lo_sx, 
                cd_thuc_hien: options.find(e=>e.value === parseInt(line))?.label,
                cd_tiep_theo: options[options.findIndex(e=>e.value === parseInt(line))+1]?.label,
            }])
        }else{
            setRow2([
                {
                    title: 'Lô SX',
                    value: '',
                },
                {
                    title: 'Mã SP đang sản xuất',
                    value: '',
                },
                {
                    title: 'SL KH',
                    value: '',
                },
                {
                    title: 'SL T.tế',
                    value: '',
                },
                {
                    title: 'Tỷ lệ HT',
                    value: '',
                },
            ]);
            setListCheck([])
        }
        setSelectedRowKeys([])
    }, [selectedRow])
    const [row1, setRow1] = useState([
        {
            title: 'Kế hoạch',
            value: '',
        },
        {
            title: 'Mục tiêu',
            value: '',
        },
        {
            title: 'Kết quả',
            value: '',
        },
    ]);
    const [row2, setRow2] = useState([
        {
            title: 'Lô SX',
            value: '',
        },
        {
            title: 'Mã SP đang sản xuất',
            value: '',
        },
        {
            title: 'SL KH',
            value: '',
        },
        {
            title: 'SL T.tế',
            value: '',
        },
        {
            title: 'Tỷ lệ HT',
            value: '',
        },
    ]);
    const [openKV, setOpenKV] = useState(false);
    const [kvValue, setKvValue] = useState();
    const [form] = Form.useForm();
    const onFinish = async (values) =>{
        if(selectedRow && values.sl_tem_vang >= 0){
            if(selectedRowKeys.length){
                values.errors = selectedRowKeys;
                setLoadingSubmitKV(true);
                var res = await updateSoLuongTemVang({lot_id: selectedRow.lot_id, line_id: line, ...values})
                setLoadingSubmitKV(false);
                setOpenKV(false)
                const tableData = await getInfoPalletQC({type: 2, line_id: line});
                if(tableData.success){
                    setData(tableData.data)
                }
                form.resetFields();
                const overall = await getQCOverall({line_id: line});
                setRow1([
                    {
                        title: 'Kế hoạch',
                        value: overall.data.ke_hoach,
                    },
                    {
                        title: 'Mục tiêu',
                        value: overall.data.muc_tieu,
                    },
                    {
                        title: 'Kết quả',
                        value: overall.data.ket_qua,
                    },
                ]);
            }
            else{
                messageApi.info('Chọn ít nhất 1 lỗi');
            }
            
        }
        setSelectedRowKeys([]);
    }
    const count = useRef(0);
    const handlePrint = async () =>{
        if(selectedRow){
            var res = await inTemVang({lot_id: selectedRow.lot_id, line_id: line, sl_tem_vang: kvValue})
            if(res.success){
                let list = [];
                if((Array.isArray(res.data))){
                    res.data.map(lot=>{
                        lot.new_id.forEach((e, index) => {
                            list.push(
                                {
                                    ...res.data,
                                    lot_id: e,
                                    soluongtp: lot.new_sl[index],
                                    product_id: res.data.ma_hang,
                                    lsx: res.data.lo_sx,
                                    cd_thuc_hien: options.find(e => e.value === parseInt(line))?.label,
                                    cd_tiep_theo: line === '22' ? 'Bế' : options[options.findIndex(e=>e.value === parseInt(line))+1]?.label
                                }
                            )
                        })
                    })
                }else{
                    res.data.new_id.forEach((e, index) => {
                        list.push(
                            {
                                ...res.data,
                                lot_id: e,
                                soluongtp: res.data.new_sl[index],
                                product_id: res.data.ma_hang,
                                lsx: res.data.lo_sx,
                                cd_thuc_hien: options.find(e => e.value === parseInt(line))?.label,
                                cd_tiep_theo: line === '22' ? 'Bế' : options[options.findIndex(e=>e.value === parseInt(line))+1]?.label
                            }
                        )
                    })
                }
                setListCheck(list)
                
                const tableData = await getInfoPalletQC({type: 2, line_id: line});
                if(tableData.success){
                    setData(tableData.data)
                }
                print();
            }
        }
    }
    const [listCheck, setListCheck] = useState([]);
    const componentRef1 = useRef();
    const print = useReactToPrint({
        content: () => componentRef1.current
    });

    const onSubmit = async () =>{
        form.resetFields();
        setKvValue('');
        setOpenKV(false)
        const overall = await getQCOverall({line_id: line});
        setRow1([
            {
                title: 'Kế hoạch',
                value: overall.data.ke_hoach,
            },
            {
                title: 'Mục tiêu',
                value: overall.data.muc_tieu,
            },
            {
                title: 'Kết quả',
                value: overall.data.ket_qua,
            },
        ]);
        const tableData = await getInfoPalletQC({type: 2, line_id: line});
        if(tableData.success){
            setData(tableData.data)
        }
    }
    const [errorList, setErrorList] = useState([]);
    const errorColumn = [
        {
            title: 'Mã lỗi',
            key: 'id',
            dataIndex: 'id',
            align: 'center'
        },
        {
            title: 'Nội dung',
            key: 'noi_dung',
            dataIndex: 'noi_dung',
            align: 'center'
        },
    ];
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    
    const qcPermission = ['pqc', 'oqc', '*'].filter(value => (userProfile?.permission??[]).includes(value));
    const [loadingSubmitKV, setLoadingSubmitKV] = useState(false)
    return (
        <React.Fragment>
            {contextHolder}
            <Spin spinning={loading}>
                <Row gutter={12} className='mt-3'>
                    <Col span={6}>
                    <SelectButton value={options.length > 0 && parseInt(line)} options={options} label="Chọn công đoạn" onChange={onChangeLine} />
                    </Col>
                    <Col span={18}>
                        <DataDetail data={row1} />
                    </Col>
                </Row>

                <Row className='mt-3'>
                    <ScanButton onScan={onScan} searchData={[]}/>
                </Row>

                <Row className='mt-3' style={{ justifyContent: 'space-between' }}>
                    <Col span={24}>
                        <DataDetail data={row2} />
                    </Col>
                </Row>

                <Row className='mt-3' style={{ justifyContent: 'space-between' }} gutter={12}>
                    <Col span={4} >
                        <Checksheet2 text="Chỉ tiêu KT1" checksheet={chitieu.checksheet1} changeVariable={count.current} lotId={selectedRow?.lot_id} disabled={!qcPermission.length}/>
                    </Col>
                    <Col span={4}>
                        <Checksheet2 text="Chỉ tiêu KT2" checksheet={chitieu.checksheet2} changeVariable={count.current} lotId={selectedRow?.lot_id} disabled={!qcPermission.length}/>
                    </Col>
                    <Col span={4}>
                        <Checksheet2 text="Chỉ tiêu KT3" checksheet={chitieu.checksheet3} changeVariable={count.current} lotId={selectedRow?.lot_id} disabled={!qcPermission.length}/>
                    </Col>
                    <Col span={4}>
                        <QuanLyLoi text="Quản lý lỗi" lotId={selectedRow?.lot_id} onSubmit={onSubmit}/>
                    </Col>
                    <Col span={4}>
                        <Button className='w-100 text-wrap h-100' style={(selectedRow && qcPermission.length) && selectedRow && { backgroundColor: '#f7ac27', color: '#ffffff' }} disabled={!selectedRow || !qcPermission.length} size='large' onClick={()=>setOpenKV(true)}>
                            Khoanh vùng
                        </Button>
                    </Col>
                    <Col span={4}>
                        <Button className='w-100 text-wrap h-100' style={qcPermission.length && { backgroundColor: '#f7ac27', color: '#ffffff' }} size='large' onClick={handlePrint} disabled={!qcPermission.length}>
                            In tem vàng
                        </Button>
                        <div className="report-history-invoice">
                            <TemVang listCheck={listCheck} ref={componentRef1} />
                        </div>
                    </Col>
                </Row>

                <Table
                    rowClassName={(record, index) => 'table-row-light'}
                    scroll={{ y: '50vh' }}
                    pagination={false}
                    bordered={true}
                    className='mt-3 mb-3'
                    columns={columns}
                    dataSource={data}
                    size='small'
                />
                <Modal title="Khoanh vùng" open={openKV} onCancel={()=>setOpenKV(false)} onOk={()=>form.submit()} okButtonProps={{
                    loading: loadingSubmitKV
                }}>
                    <Form
                    form={form}
                    onFinish={onFinish}>
                        <Table
                            columns={errorColumn}
                            dataSource={errorList}
                            pagination={false}
                            scroll={{x:'100%', y:300}}
                            size="small" rowSelection={rowSelection}
                        />
                        <Form.Item name="sl_tem_vang" label="Nhập số lượng khoanh vùng" className='mt-3'><InputNumber style={{width:'100%'}}/></Form.Item>
                    </Form>
                </Modal>
            </Spin>
        </React.Fragment>
    );
};

export default withRouter(Quality);