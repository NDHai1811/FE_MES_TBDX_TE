import React, { useEffect, useState } from 'react';
import { CloseOutlined, PrinterOutlined, QrcodeOutlined, UserOutlined } from '@ant-design/icons';
import { Row, Col, Table, Modal, Spin, Form, InputNumber, message } from 'antd';
import { withRouter } from "react-router-dom";
import '../style.scss';
import Checksheet2 from '../../../components/Popup/Checksheet2';
import ScanButton from '../../../components/Button/ScanButton';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import DataDetail from '../../../components/DataDetail';
import { getLine } from '../../../api/oi/manufacture';
import { getChecksheetList, getInfoPalletQC, getLoSXDetail, getQCOverall, scanError, scanPallet, updateSoLuongTemVang } from '../../../api/oi/quality';
import SelectButton from '../../../components/Button/SelectButton';
import { useRef } from 'react';
import { useProfile } from '../../../components/hooks/UserHooks';

const Quality = (props) => {
    document.title = "Kiểm tra chất lượng";
    const [messageApi, contextHolder] = message.useMessage();
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
    const [data, setData] = useState([
        {
            lot_id:'xxxxxxxx.01',
            san_luong:'100',
            sl_loi:'0',
            sl_ng:'0',
            result:'OK'
        },
        {
            lot_id:'xxxxxxxx.02',
            san_luong:'100',
            sl_loi:'0',
            sl_ng:'0',
            result:'OK'
        },
        {
            lot_id:'xxxxxxxx.03',
            san_luong:'100',
            sl_loi:'0',
            sl_ng:'0',
            result:'OK'
        },
        {
            lot_id:'xxxxxxxx.04',
            san_luong:'100',
            sl_loi:'0',
            sl_ng:'0',
            result:'OK'
        },
        {
            lot_id:'xxxxxxxx.05',
            san_luong:'100',
            sl_loi:'0',
            sl_ng:'0',
            result:'OK'
        },
        {
            lot_id:'xxxxxxxx.06',
            san_luong:'100',
            sl_loi:'0',
            sl_ng:'0',
            result:'OK'
        },
        {
            lot_id:'xxxxxxxx.07',
            san_luong:'100',
            sl_loi:'1',
            sl_ng:'100',
            result:'NG'
        },
        {
            lot_id:'xxxxxxxx.08',
            san_luong:'100',
            sl_loi:'1',
            sl_ng:'100',
            result:'NG'
        },
    ]);
    const { userProfile } = useProfile()
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
            width:'16%'
        },
    ];
    useEffect(()=>{
        setSelectedRow()
        if(line){
            (async ()=>{
                setLoading(true);
                // const lineList = await getLine({type: 'cl'});
                // setOptions(lineList.data);
                // const overall = await getQCOverall({line_id: line});
                // setRow1([
                //     {
                //         title: 'Kế hoạch',
                //         value: overall.data.ke_hoach,
                //     },
                //     {
                //         title: 'Mục tiêu',
                //         value: overall.data.muc_tieu,
                //     },
                //     {
                //         title: 'Kết quả',
                //         value: overall.data.ket_qua,
                //     },
                // ]);
                // const tableData = await getInfoPalletQC({type: 2, line_id: line});
                // if(tableData.success){
                //     setData(tableData.data)
                // }

                setRow2([
                    {
                        title: 'Mã Lot',
                        value: '',
                    },
                    {
                        title: 'Mã lô',
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
    // useEffect(()=>{
    //     if(selectedRow){
    //         (async ()=>{
    //             var res = await getChecksheetList({line_id: line, lot_id: selectedRow.lot_id});
    //             let checksheet = {...chitieu};
    //             Object.keys(res?.data?.chi_tieu).forEach(key => {
    //                 switch (key) {
    //                     case 'kich-thuoc':
    //                         checksheet.checksheet1.key = {key: key, title: res?.data?.chi_tieu[key] ? res?.data?.chi_tieu[key] : '1'};
    //                         checksheet.checksheet1.data = res.data.data[key]
    //                         break;
    //                     case 'dac-tinh':
    //                         checksheet.checksheet2.key = {key: key, title: res?.data?.chi_tieu[key] ? res?.data?.chi_tieu[key] : '2'};
    //                         checksheet.checksheet2.data = res.data.data[key]
    //                         break;
    //                     case 'ngoai-quan':
    //                         checksheet.checksheet3.key = {key: key, title: res?.data?.chi_tieu[key] ? res?.data?.chi_tieu[key] : '3'};
    //                         checksheet.checksheet3.data = res.data.data[key]
    //                         break;
    //                     default:
    //                         break;
    //                 }
    //             })
    //             setChiTieu(checksheet);
    //         })()
    //     }
    // }, [selectedRow])
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
                    title: 'Mã lot',
                    value: selectedRow?.lo_sx,
                },
                {
                    title: 'Mã lô',
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
                    title: 'Mã lot',
                    value: '',
                },
                {
                    title: 'Mã lô',
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
            title: 'Mã lot',
            value: '',
        },
        {
            title: 'Mã lô',
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
    const [listCheck, setListCheck] = useState([]);
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
                    <SelectButton value={options.length > 0 && parseInt(line)} options={options} label="Máy" onChange={onChangeLine} />
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

                <Row className='mt-3' style={{ justifyContent: 'space-between' }} gutter={6}>
                    <Col span={8} >
                        <Checksheet2 text="KT kích thước" checksheet={chitieu.checksheet1} changeVariable={count.current} lotId={selectedRow?.lot_id} />
                    </Col>
                    <Col span={9}>
                        <Checksheet2 text="KT ngoại quan" checksheet={chitieu.checksheet2} changeVariable={count.current} lotId={selectedRow?.lot_id} disabled={false}/>
                    </Col>
                    <Col span={7}>
                        <Checksheet2 text="Phán định" checksheet={chitieu.checksheet3} changeVariable={count.current} lotId={selectedRow?.lot_id} disabled={false}/>
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