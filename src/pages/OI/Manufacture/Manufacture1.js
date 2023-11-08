import React, { useEffect, useState } from 'react';
import { CloseOutlined, PrinterOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Row, Col, Button, Table,Spin, Checkbox } from 'antd';
import DataDetail from '../../../components/DataDetail';
import '../style.scss';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import ScanButton from '../../../components/Button/ScanButton';
import SelectButton from '../../../components/Button/SelectButton';
import { getInfoPallet, getLine, getLineOverall, inTem, scanPallet } from '../../../api/oi/manufacture';
import { useReactToPrint } from 'react-to-print';
import Tem from '../../UI/Manufacture/Tem';
import { useRef } from 'react';
import { getListMachine } from '../../../api/oi/equipment';

const Manufacture1 = (props) => {
    document.title = "Sản xuất";
    const { line } = useParams();
    const history = useHistory();
    const [options, setOption] = useState([]);
    const [loading, setLoading] = useState(false);
    const [row1, setRow1] = useState([
        {
            title: 'KH ca',
            value: '10.000'
        },
        {
            title: 'SL T.Tế',
            value: '1.000'
        },
        {
            title: 'SL Tem vàng',
            value: '',
            bg: '#f7ac27'
        },
        {
            title: 'SL NG',
            value: '',
            bg: '#fb4b50'
        },
        {
            title: 'Tỷ lệ hoàn thành (%)',
            value: '',
        },
    ])
    const [row2, setRow2] = useState([
        {
            title: 'Mã Palet',
            value: ''
        },
        {
            title: 'Tên sản phẩm',
            value: ''
        },
        {
            title: 'UPH (Ấn định)',
            value: ''
        },
        {
            title: 'UPH (Thực tế)',
            value: ''
        },
        {
            title: 'SL đầu ra (KH)',
            value: ''
        },
        {
            title: 'SL đầu ra (TT)',
            value: ''
        },
        {
            title: 'SL đầu ra (TT OK)',
            value: ''
        },
    ]);
    const type = [0, 9, 10, 11, 12, 13, 14, 15, 21, 22];
    const [selectedLot, setSelectedLot] = useState();
    const [listCheck, setListCheck] = useState([]);
    useEffect(() => {
        (async () => {
            setLoading(true)
            const listMachine = await getListMachine();
            setOption(listMachine.data);
            // const lineList = await getLine({ type: 'sx' });
            // setOption(lineList.data);
            // const lineOverall = await getLineOverall({ type: type.indexOf(parseInt(line)), line_id: line })
            setRow1([
                {
                    title: 'KH ca',
                    value: '10.000',
                },
                {
                    title: 'Sản lượng',
                    value: '1000',
                },
                {
                    title: 'HT KH ca',
                    value: '10%',
                },
                {
                    title: 'Phế SX',
                    value: '10',
                    bg: '#fb4b50'
                },
                
            ])
            setRow2([
                {
                    title: 'Số lot',
                    value: 'xxxxxx.01'
                },
                {
                    title: 'KH ĐH',
                    value: '700'
                },
                {
                    title: 'Sản lượng',
                    value: '200'
                },
                {
                    title: 'HT ĐH',
                    value: '28%'
                },
                {
                    title: 'Phế SX',
                    value: '10'
                },
            ]);
            setLoading(false)
        })()
    }, [line])
    const [data, setData] = useState([
        {
            lot_id:'xxxxxxxx.01',
            dinh_muc:'100',
            so_luong:'-',
            sl_ok:'-',
            sl_ng:'-'
        },
        {
            lot_id:'xxxxxxxx.02',
            dinh_muc:'100',
            so_luong:'-',
            sl_ok:'-',
            sl_ng:'-'
        },
        {
            lot_id:'xxxxxxxx.03',
            dinh_muc:'100',
            so_luong:'-',
            sl_ok:'-',
            sl_ng:'-'
        },
        {
            lot_id:'xxxxxxxx.04',
            dinh_muc:'100',
            so_luong:'200',
            sl_ok:'100',
            sl_ng:'0'
        },
        {
            lot_id:'yyyyyyyyy.05',
            dinh_muc:'100',
            so_luong:'200',
            sl_ok:'100',
            sl_ng:'0'
        },
        {
            lot_id:'yyyyyyyyy.06',
            dinh_muc:'100',
            so_luong:'200',
            sl_ok:'100',
            sl_ng:'0'
        },
        {
            lot_id:'yyyyyyyyy.07',
            dinh_muc:'100',
            so_luong:'200',
            sl_ok:'100',
            sl_ng:'0'
        },
        {
            lot_id:'zzzzzzzzz.08',
            dinh_muc:'100',
            so_luong:'200',
            sl_ok:'100',
            sl_ng:'0'
        },
        {
            lot_id:'zzzzzzzzz.09',
            dinh_muc:'100',
            so_luong:'200',
            sl_ok:'100',
            sl_ng:'0'
        },
        {
            lot_id:'zzzzzzzzz.10',
            dinh_muc:'100',
            so_luong:'200',
            sl_ok:'100',
            sl_ng:'0'
        },
        {
            lot_id:'zzzzzzzzz.11',
            dinh_muc:'100',
            so_luong:'200',
            sl_ok:'100',
            sl_ng:'0'
        },
        {
            lot_id:'zzzzzzzzz.12',
            dinh_muc:'100',
            so_luong:'200',
            sl_ok:'100',
            sl_ng:'0'
        },
        {
            lot_id:'zzzzzzzzz.13',
            dinh_muc:'100',
            so_luong:'200',
            sl_ok:'100',
            sl_ng:'0'
        },
        {
            lot_id:'zzzzzzzzz.14',
            dinh_muc:'100',
            so_luong:'200',
            sl_ok:'100',
            sl_ng:'0'
        },
        {
            lot_id:'zzzzzzzzz.15',
            dinh_muc:'100',
            so_luong:'200',
            sl_ok:'100',
            sl_ng:'0'
        },
        {
            lot_id:'zzzzzzzzz.16',
            dinh_muc:'100',
            so_luong:'200',
            sl_ok:'100',
            sl_ng:'0'
        }
    ]);
    const onChangeLine = (value) => {
        history.push('/manufacture/' + value)
    }
    const onScan = async (result) => {
        var res = await scanPallet({ lot_id: result, line_id: line });
        if (res.success) {
            if (row2[0].value !== '') {
                setRow2([
                    {
                        title: 'Mã lot',
                        value: ''
                    },
                    {
                        title: 'Tên sản phẩm',
                        value: ''
                    },
                    {
                        title: 'UPH (Ấn định)',
                        value: ''
                    },
                    {
                        title: 'UPH (Thực tế)',
                        value: ''
                    },
                    {
                        title: 'SL đầu ra (KH)',
                        value: ''
                    },
                    {
                        title: 'SL đầu ra (TT)',
                        value: ''
                    },
                    {
                        title: 'SL đầu ra (TT OK)',
                        value: ''
                    },
                ]);
            }
            const infoPallet = await getInfoPallet({ line_id: line });
            if (infoPallet.success) {
                // setData(infoPallet.data);
            }
        }
    }

    const rowClassName = (record, index) => {
        if(index === 0){
            return 'table-row-green';
        }
        if(index === 1 || index === 2){
            return '';
        }
        return record.status === 0 ? 'table-row-green' : 'table-row-grey'
    }
    const onClickRow = (row) => {
        setSelectedLot(row)
    }
    useEffect(() => {
        if (selectedLot) {
            setRow2([
                {
                    title: 'Số Lot',
                    value: selectedLot.lot_id
                },
                {
                    title: 'KH ĐH',
                    value: selectedLot.ten_sp
                },
                {
                    title: 'Sản lượng',
                    value: selectedLot.uph_an_dinh
                },
                {
                    title: 'HT ĐH',
                    value: selectedLot.uph_thuc_te
                },
                {
                    title: 'Phế SX',
                    value: selectedLot.sl_dau_ra_kh
                },
            ]);
        }

        else {
            // setRow2([
            //     {
            //         title: 'Mã Palet',
            //         value: ''
            //     },
            //     {
            //         title: 'Tên sản phẩm',
            //         value: ''
            //     },
            //     {
            //         title: 'UPH (Ấn định)',
            //         value: ''
            //     },
            //     {
            //         title: 'UPH (Thực tế)',
            //         value: ''
            //     },
            //     {
            //         title: 'SL đầu ra (KH)',
            //         value: ''
            //     },
            //     {
            //         title: 'SL đầu ra (TT)',
            //         value: ''
            //     },
            //     {
            //         title: 'SL đầu ra (TT OK)',
            //         value: ''
            //     },
            // ]);
            setListCheck([])
        }
    }, [selectedLot])
    const columns = [
        {
            title: 'Tem tổng',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            width:'12%',
            render: (value, record, index) => <Checkbox></Checkbox>
        },
        {
            title: 'Số lot',
            dataIndex: 'lot_id',
            key: 'lot_id',
            align: 'center'
        },
        {
            title: 'Sl/Lot',
            dataIndex: 'dinh_muc',
            key: 'dinh_muc',
            align: 'center',
            width:'14%'
        },
        {
            title: 'Sản lượng',
            dataIndex: 'so_luong',
            key: 'so_luong',
            align: 'center',
            width:'14%'
        },
        {
            title: 'SL OK',
            dataIndex: 'sl_ok',
            key: 'sl_ok',
            align: 'center',
            width:'14%'
        },
        {
            title: 'Phế SX',
            dataIndex: 'sl_ng',
            key: 'sl_ng',
            align: 'center',
            width:'14%',
        }
    ];
    const componentRef1 = useRef();
    const handlePrint = async () => {
        console.log(selectedLot);
        if (selectedLot) {
            var res = await inTem({ lot_id: selectedLot.lot_id, line_id: line });
            if (res.success) {
                console.log(line);
                let list = [];
                if((Array.isArray(res.data))){
                    res.data.map(lot=>{
                        lot.lot_id.forEach((e, index) => {
                            list.push(
                                {
                                    ...selectedLot,
                                    lot_id: e,
                                    soluongtp: lot.so_luong[index],
                                    product_id: selectedLot.ma_hang,
                                    lsx: selectedLot.lo_sx,
                                    cd_thuc_hien: options.find(e => e.value === parseInt(line))?.label,
                                    cd_tiep_theo: line === '22' ? 'Bế' : options[options.findIndex(e=>e.value === parseInt(line))+1]?.label
                                }
                            )
                        })
                    })
                }else{
                    res.data.lot_id.forEach((e, index) => {
                        list.push(
                            {
                                ...selectedLot,
                                lot_id: e,
                                soluongtp: res.data.so_luong[index],
                                product_id: selectedLot.ma_hang,
                                lsx: selectedLot.lo_sx,
                                cd_thuc_hien: options.find(e => e.value === parseInt(line))?.label,
                                cd_tiep_theo: line === '22' ? 'Bế' : options[options.findIndex(e=>e.value === parseInt(line))+1]?.label
                            }
                        )
                    })
                }
                setListCheck(list);
            }
        }
    }

    const print = useReactToPrint({
        content: () => componentRef1.current
    });
    useEffect(() => {
        if (listCheck.length > 0) {
            print();
        }
    }, [listCheck])
    var interval;
    // useEffect(() => {
    //     interval = setInterval(async () => {
    //         const infoPallet = await getInfoPallet({ line_id: line });
    //         if (infoPallet.success) {
    //             // setData(infoPallet.data.map(e => {
    //             //     return { ...e }
    //             // }))
    //         }
    //     }, 10000);
    //     return () => clearInterval(interval);
    // }, [line]);
    return (
        <React.Fragment>
            <Spin spinning={loading}>
                <Row className='mt-3' gutter={[2, 12]}>
                    <Col span={5}>
                        <SelectButton options={options} label="Máy"/>
                    </Col>
                    <Col span={19}>
                        <DataDetail data={row1} />
                    </Col>
                    <Col span={16}>
                        <ScanButton onScan={onScan} />
                    </Col>
                    <Col span={5}>
                        <Button size='large' type='primary' style={{ height: '100%', width: '100%' }} onClick={handlePrint}>Đầu vào</Button>
                    </Col>
                    <Col span={3}>
                        <Button size='large' type='primary' style={{ height: '100%', width: '100%' }} onClick={handlePrint} icon={<PrinterOutlined/>}></Button>
                        <div className="report-history-invoice">
                            <Tem listCheck={listCheck} ref={componentRef1} />
                        </div>
                    </Col>
                    <Col span={24}>
                        <DataDetail data={row2} />
                    </Col>
                    
                    <Col span={24}>
                        <Table
                            scroll={{
                                x: 200,
                                y: 350,
                            }}
                            size='small'
                            rowClassName={rowClassName}
                            pagination={false}
                            bordered
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: (event) => onClickRow(record)
                                };
                            }}
                            columns={columns}
                            dataSource={data} />
                    </Col>
                </Row>
            </Spin>
        </React.Fragment>
    );
};

export default Manufacture1;