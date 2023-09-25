import React, { useEffect, useState } from 'react';
import { CloseOutlined, PrinterOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Layout, Row, Col, Divider, Button, Table, Modal, Select, Steps, Input, Radio, Spin } from 'antd';
import { withRouter, Link } from "react-router-dom";
import DataDetail from '../../../components/DataDetail';
import '../style.scss';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import ScanButton from '../../../components/Button/ScanButton';
import SelectButton from '../../../components/Button/SelectButton';
import EditableTable from '../../../components/Table/EditableTable';
import { getInfoPallet, getLine, getLineOverall, getPallet, inTem, scanPallet } from '../../../api/oi/manufacture';
import dayjs from 'dayjs';
import { useReactToPrint } from 'react-to-print';
import Tem from '../../UI/Manufacture/Tem';
import { useRef } from 'react';

const Manufacture2 = (props) => {
    document.title = "Sản xuất";
    const { line } = useParams();
    const history = useHistory();
    const [options, setOption] = useState([])
    const [searchData, setSearchData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [row1, setRow1] = useState([
        {
            title: 'SL KH ngày',
            value: ''
        },
        {
            title: 'SL T.Tế',
            value: ''
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
            const lineList = await getLine({ type: 'sx' });
            setOption(lineList.data);
            const pallet = await getPallet();
            if (pallet.success) {
                setSearchData(pallet.data.map(e => {
                    return { id: e.ma_pallet, name: e.ma_pallet }
                }))
            }
            const lineOverall = await getLineOverall({ type: type.indexOf(parseInt(line)), line_id: line })
            setRow1([
                {
                    title: 'SL KH ngày',
                    value: lineOverall.data.tong_sl_trong_ngay_kh
                },
                {
                    title: 'SL T.Tế',
                    value: lineOverall.data.tong_sl_thuc_te
                },
                {
                    title: 'SL Tem vàng',
                    value: lineOverall.data.tong_sl_tem_vang,
                    bg: '#f7ac27'
                },
                {
                    title: 'SL NG',
                    value: lineOverall.data.tong_sl_ng,
                    bg: '#fb4b50'
                },
                {
                    title: 'Tỷ lệ hoàn thành (%)',
                    value: `${(lineOverall.data.tong_sl_trong_ngay_kh ? parseInt((lineOverall.data.tong_sl_thuc_te / lineOverall.data.tong_sl_trong_ngay_kh) * 100) : 0)}%`,
                },
            ])
            setRow2([
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
            const infoPallet = await getInfoPallet({ type: type.indexOf(parseInt(line)) });
            if (infoPallet.success) {
                setData(infoPallet.data);
            }
            setLoading(false)
        })()
    }, [line])
    const [data, setData] = useState();
    const onChangeLine = (value) => {
        history.push('/manufacture/' + value)
    }
    const onScan = async (result) => {
        var res = await scanPallet({ lot_id: result, line_id: line });
        if (res.success) {
            if (row2[0].value !== '') {
                setRow2([
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
            }
            const infoPallet = await getInfoPallet({ type: type.indexOf(parseInt(line)) });
            if (infoPallet.success) {
                setData(infoPallet.data);
            }
        }
    }

    const rowClassName = (record, index) => {
        return record.status === 0 ? 'table-row-green' : 'table-row-grey'
    }
    const onClickRow = (row) => {
        // if (row.status === 0 || line !== '13') {
            setSelectedLot(row)
        // }
    }
    useEffect(() => {
        if (selectedLot) {
            setRow2([
                {
                    title: 'Mã Palet',
                    value: selectedLot.lot_id
                },
                {
                    title: 'Tên sản phẩm',
                    value: selectedLot.ten_sp
                },
                {
                    title: 'UPH (Ấn định)',
                    value: selectedLot.uph_an_dinh
                },
                {
                    title: 'UPH (Thực tế)',
                    value: selectedLot.uph_thuc_te
                },
                {
                    title: 'SL đầu ra (KH)',
                    value: selectedLot.sl_dau_ra_kh
                },
                {
                    title: 'SL đầu ra (TT)',
                    value: selectedLot.sl_dau_ra
                },
                {
                    title: 'SL đầu ra (TT OK)',
                    value: selectedLot.sl_dau_ra_ok
                },
            ]);
        }

        else {
            setRow2([
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
            setListCheck([])
        }
    }, [selectedLot])
    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            render: (value, record, index) => index + 1
        },
        {
            title: 'Lô sản xuất',
            dataIndex: 'lo_sx',
            key: 'lo_sx',
            align: 'center'
        },
        {
            title: 'Mã Pallet',
            dataIndex: 'lot_id',
            key: 'lot_id',
            align: 'center'
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'ten_sp',
            key: 'ten_sp',
            align: 'center'
        },
        {
            title: 'Mã hàng',
            dataIndex: 'ma_hang',
            key: 'ma_hang',
            align: 'center'
        },
        {
            title: 'Kế hoạch',
            key: 'ke_hoach',
            children: [
                {
                    title: 'TG bắt đầu',
                    dataIndex: 'thoi_gian_bat_dau_kh',
                    key: 'thoi_gian_bat_dau_kh',
                    align: 'center',
                },
                {
                    title: 'Số lượng đầu ra (pcs)',
                    dataIndex: 'sl_dau_ra_kh',
                    key: 'sl_dau_ra_kh',
                    align: 'center'
                },
            ]
        },
        {
            title: 'Thực tế',
            key: 'thuc_te',
            children: [
                {
                    title: 'Số lượng đầu vào (pcs)',
                    dataIndex: 'sl_dau_vao',
                    key: 'sl_dau_vao',
                    align: 'center',
                },
                {
                    title: 'Số lượng đầu ra (pcs)',
                    dataIndex: 'sl_dau_ra',
                    key: 'sl_dau_ra',
                    align: 'center'
                },
                {
                    title: 'Số lượng đầu ra OK (pcs)',
                    dataIndex: 'sl_dau_ra_ok',
                    key: 'sl_dau_ra_kh',
                    align: 'center'
                },
                {
                    title: 'Số lượng tem vàng (pcs)',
                    dataIndex: 'sl_tem_vang',
                    key: 'sl_tem_vang',
                    align: 'center',
                    className: 'yellow',
                },
                {
                    title: 'Số lượng NG (pcs)',
                    dataIndex: 'sl_tem_ng',
                    key: 'sl_tem_ng',
                    align: 'center',
                    className: 'red',
                },
            ]
        },
        {
            title: 'Tỉ lệ hoàn thành (%)',
            dataIndex: 'ti_le_ht',
            key: 'ti_le_ht',
            align: 'center',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'tinh_trang',
            key: 'tinh_trang',
            align: 'center',
        },
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
    useEffect(() => {
        interval = setInterval(async () => {
            const lineOverall = await getLineOverall({ type: type.indexOf(parseInt(line)), line_id: line })
            setRow1([
                {
                    title: 'SL KH ngày',
                    value: lineOverall.data.tong_sl_trong_ngay_kh
                },
                {
                    title: 'SL T.Tế',
                    value: lineOverall.data.tong_sl_thuc_te
                },
                {
                    title: 'SL Tem vàng',
                    value: lineOverall.data.tong_sl_tem_vang,
                    bg: '#f7ac27'
                },
                {
                    title: 'SL NG',
                    value: lineOverall.data.tong_sl_ng,
                    bg: '#fb4b50'
                },
                {
                    title: 'Tỷ lệ hoàn thành (%)',
                    value: `${(lineOverall.data.tong_sl_trong_ngay_kh ? parseInt((lineOverall.data.tong_sl_thuc_te / lineOverall.data.tong_sl_trong_ngay_kh) * 100) : 0)}%`,
                },
            ])
            const infoPallet = await getInfoPallet({ type: type.indexOf(parseInt(line)) });
            if (infoPallet.success) {
                setData(infoPallet.data.map(e => {
                    return { ...e }
                }))
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [line]);
    // useEffect(() => {
    //     if ((selectedLot && data.some(e => e.lot_id === selectedLot.lot_id && e.status === 1)) && line === '13') {
    //         setSelectedLot();
    //     }
    // }, [data])
    return (
        <React.Fragment>
            <Spin spinning={loading}>
                <Row className='mt-3' gutter={[12, 12]}>
                    <Col span={4}>
                        <SelectButton value={options.length > 0 && parseInt(line)} options={options} label="Chọn công đoạn" onChange={onChangeLine} />
                    </Col>
                    <Col span={20}>
                        <DataDetail data={row1} />
                    </Col>
                    <Col span={24}>
                        <ScanButton onScan={onScan} searchData={searchData} />
                    </Col>
                    <Col span={20}>
                        <DataDetail data={row2} />
                    </Col>
                    <Col span={4}>
                        <Button size='large' type='primary' style={{ height: '100%', width: '100%' }} onClick={handlePrint}>In tem</Button>
                        <div className="report-history-invoice">
                            <Tem listCheck={listCheck} ref={componentRef1} />
                        </div>
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

export default Manufacture2;