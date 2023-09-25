import React, { useEffect, useRef, useState } from 'react';
import { CloseOutlined, PrinterOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Layout, Row, Col, Divider, Button, Table, Modal, Select, Steps, Input, Radio, Form, TreeSelect, InputNumber, Spin, message } from 'antd';
import { withRouter, Link } from "react-router-dom";
import DataDetail from '../../../components/DataDetail';
import '../style.scss';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import ScanButton from '../../../components/Button/ScanButton';
import SelectButton from '../../../components/Button/SelectButton';
import { getInfoPallet, getLine, getLineOverall, getLineUser, getPallet, getTable, getTableChon, inTem, scanPallet, setAssignLineUser, setAssignTableUserWork } from '../../../api/oi/manufacture';
import Tem from '../../UI/Manufacture/Tem';
import { useReactToPrint } from 'react-to-print';
import dayjs from "dayjs";
import { getInfoChon } from '../../../api';

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
        title: 'Mã thùng',
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
        title: 'TG bắt đầu (KH)',
        dataIndex: 'thoi_gian_bat_dau_kh',
        key: 'thoi_gian_bat_dau_kh',
        align: 'center',
    },
    {
        title: 'TG kết thúc (KH)',
        dataIndex: 'thoi_gian_bat_dau_kh',
        key: 'thoi_gian_bat_dau_kh',
        align: 'center',
    },
    {
        title: 'TG bắt đầu (TT)',
        dataIndex: 'thoi_gian_bat_dau',
        key: 'thoi_gian_bat_dau',
        align: 'center',
        render: (value) => value && dayjs(value).format('HH:mm:ss')
    },
    {
        title: 'TG kết thúc (TT)',
        dataIndex: 'thoi_gian_ket_thuc',
        key: 'thoi_gian_ket_thuc',
        align: 'center',
        render: (value) => value && dayjs(value).format('HH:mm:ss')
    },
    {
        title: 'SL đầu vào (KH)',
        dataIndex: 'sl_dau_vao_kh',
        key: 'sl_dau_vao_kh',
        align: 'center'
    },
    {
        title: 'SL đầu ra (KH)',
        dataIndex: 'sl_dau_ra_kh',
        key: 'sl_dau_ra_kh',
        align: 'center'
    },
    {
        title: 'SL đầu vào (TT)',
        dataIndex: 'sl_dau_vao',
        key: 'sl_dau_vao',
        align: 'center'
    },
    {
        title: 'SL đầu ra (TT)',
        dataIndex: 'sl_dau_ra',
        key: 'sl_dau_ra',
        align: 'center',
    },
    {
        title: 'SL đầu ra (TT OK)',
        dataIndex: 'sl_dau_ra_ok',
        key: 'sl_dau_ra_ok',
        align: 'center',
    },
    {
        title: 'SL tem vàng',
        dataIndex: 'sl_tem_vang',
        key: 'sl_tem_vang',
        align: 'center',
        className: 'yellow'
    },
    {
        title: 'Số lượng NG',
        dataIndex: 'sl_tem_ng',
        key: 'sl_tem_ng',
        align: 'center',
        className: 'red'
    },
    {
        title: 'Tỉ lệ HT',
        dataIndex: 'ti_le_ht',
        key: 'ti_le_ht',
        align: 'center',
    },
];
const Manufacture3 = (props) => {
    document.title = "Sản xuất";
    const { line } = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [options, setOption] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [data, setData] = useState([]);
    const [remain, setRemain] = useState(0);
    const [oldQuantity, setOldQuantity] = useState(0);
    const [formAssign] = Form.useForm();
    const [formPrint] = Form.useForm();
    const [listCheck, setListCheck] = useState([]);
    const [openPrint, setOpenPrint] = useState(false);
    const [quantityOK, setQuantityOK] = useState(0);
    const [quantityTon, setQuantityTon] = useState(0);
    const componentRef1 = useRef();
    const handlePrint = async () => {
        if (selectedRow) {
            var res = await inTem({ lot_id: selectedRow.lot_id, line_id: line })
            if (res.success) {
                let list = [];
                if ((Array.isArray(res.data))) {
                    res.data.map(lot => {
                        lot.lot_id.forEach((e, index) => {
                            list.push(
                                {
                                    ...selectedRow,
                                    lot_id: e,
                                    soluongtp: lot.so_luong[index],
                                    product_id: selectedRow.ma_hang,
                                    lsx: selectedRow.lo_sx,
                                    cd_thuc_hien: options.find(e => e.value === parseInt(line))?.label,
                                    cd_tiep_theo: line === '22' ? 'Bế' : options[options.findIndex(e => e.value === parseInt(line)) + 1]?.label
                                }
                            )
                        })
                    })
                } else {
                    res.data.lot_id.forEach((e, index) => {
                        list.push(
                            {
                                ...selectedRow,
                                lot_id: e,
                                soluongtp: res.data.so_luong[index],
                                product_id: selectedRow.ma_hang,
                                lsx: selectedRow.lo_sx,
                                cd_thuc_hien: options.find(e => e.value === parseInt(line))?.label,
                                cd_tiep_theo: line === '22' ? 'Bế' : options[options.findIndex(e => e.value === parseInt(line)) + 1]?.label
                            }
                        )
                    })
                }
                setListCheck(list);
            }
        }
    }
    useEffect(() => {
        if (listCheck.length > 0) {
            print();
        }
    }, [listCheck])
    const print = useReactToPrint({
        content: () => componentRef1.current
    });
    const [selectedRow, setSelectedRow] = useState()
    useEffect(() => {
        (async () => {
            setLoading(true);
            const lineList = await getLine({ type: 'sx' });
            setOption(lineList.data);
            const pallet = await getPallet();
            if (pallet.success) {
                setSearchData(pallet.data.map(e => {
                    return { id: e.ma_pallet, name: e.ma_pallet }
                }))
            }
            const userData = await getLineUser();
            setUsers(userData.data.map(e => { return { ...e, label: e.name, value: e.id } }));
            const tableData = await getTable();
            setTable(tableData.data);
            const lineOverall = await getLineOverall({ type: 1, line_id: line })
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
            const infoPallet = await getInfoPallet({ type: 7 });
            if (infoPallet.success) {
                setData(infoPallet.data);
            }
            setLoading(false);

        })()
    }, [line])
    const onChangeLine = (value) => {
        history.push('/manufacture/' + value)
    }
    const onScan = async (result) => {
        var res = await scanPallet({ lot_id: result, line_id: line });
        if (res.success) {

            const infoPallet = await getInfoPallet({ type: 7 });
            if (infoPallet.success) {
                if (row2[0].value !== '') {
                    setSelectedRow();
                } else {
                    setSelectedRow((infoPallet.data ?? []).find(e => e.lot_id === result));
                }
                setData(infoPallet.data.map(e => {
                    return { ...e }
                }));
            }
        }
    }

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
            title: 'Mã thùng',
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
            value: '',
        },
        {
            title: 'SL đầu ra (TT OK)',
            value: '',
            onClick: () => {
                handleOpenAssign();
            }
        },
    ])

    const assignColumn = [
        {
            title: 'Vị trí',
            dataIndex: 'table_id',
            key: 'table_id',
            align: 'center',
            render: (value) => table.find(e => e?.value?.toString() === value?.toString())?.label,
        },
        {
            title: 'Công nhân',
            dataIndex: 'user_id',
            key: 'user_id',
            align: 'center',
            render: (value) => users.find(e => e?.value?.toString() === value?.toString())?.label,
        },
        {
            title: 'Số lượng đầu vào giao việc',
            dataIndex: 'sl_cong_viec',
            key: 'sl_cong_viec',
            align: 'center',
        },
    ]

    const resultColumn = [
        {
            title: 'Vị trí',
            dataIndex: 'table_id',
            key: 'table_id',
            align: 'center',
            render: (value) => table.find(e => e?.value?.toString() === value?.toString())?.label,
        },
        {
            title: 'Công nhân',
            dataIndex: 'user_id',
            key: 'userId',
            align: 'center',
            render: (value) => users.find(e => e?.value?.toString() === value?.toString())?.label,
        },
        {
            title: 'Số lượng đầu vào giao việc',
            dataIndex: 'sl_cong_viec',
            key: 'sl_cong_viec',
            align: 'center',
        },
        {
            title: 'Số lượng thực tế đầu vào chọn',
            dataIndex: 'so_luong_thuc_te',
            key: 'so_luong_thuc_te',
            align: 'center',
            render: (value, record, index) =>
                <InputNumber inputMode='numeric' min={0} defaultValue={value} disabled={record.so_luong_thuc_te_submited} onChange={(value) => {
                    setAssignData(prev => prev.map((e, i) => {
                        if (i === index) {
                            return { ...e, so_luong_thuc_te: value }
                        }
                        return e;
                    }))
                }} />
        },
        {
            title: 'Số lượng kiểm tra thực tế OK',
            dataIndex: 'so_luong_thuc_te_ok',
            key: 'so_luong_thuc_te_ok',
            align: 'center',
            render: (value, record, index) =>
                <InputNumber inputMode='numeric' min={0} defaultValue={value} disabled={record.so_luong_thuc_te_ok_submited} onChange={(value) => {
                    setAssignData(prev => prev.map((e, i) => {
                        if (i === index) {
                            return { ...e, so_luong_thuc_te_ok: value }
                        }
                        return e;
                    }))
                }} />
        },
    ]
    const [openAssign, setOpenAssign] = useState(false);
    const [openAssignTable, setOpenAssignTable] = useState(false);

    const [form] = Form.useForm();
    const [table, setTable] = useState([
        {
            label: 'Bàn 1',
            value: 1
        },
        {
            label: 'Bàn 2',
            value: 2
        },
        {
            label: 'Bàn 3',
            value: 3
        },
        {
            label: 'Bàn 4',
            value: 4
        },
    ]);
    const [users, setUsers] = useState([]);
    const [assignData, setAssignData] = useState([])
    const onClickRow = (row) => {
        if (row.status === 0) {
            setSelectedRow(row)
        }
    }
    useEffect(() => {
        if (selectedRow) {
            setRow2([
                {
                    title: 'Mã thùng',
                    value: selectedRow.lot_id,
                },
                {
                    title: 'Tên sản phẩm',
                    value: selectedRow.ten_sp,
                },
                {
                    title: 'UPH (Ấn định)',
                    value: selectedRow.uph_an_dinh,
                },
                {
                    title: 'UPH (Thực tế)',
                    value: selectedRow.uph_thuc_te,
                },
                {
                    title: 'SL đầu ra (KH)',
                    value: selectedRow.sl_dau_ra_kh,
                },
                {
                    title: 'SL đầu ra (TT)',
                    value: selectedRow.sl_dau_ra,
                },
                {
                    title: 'SL đầu ra (TT OK)',
                    value: selectedRow.sl_dau_ra_ok,
                    onClick: () => {
                        handleOpenAssign();
                    }
                },
            ]);
        } else {
            setRow2([
                {
                    title: 'Mã thùng',
                    value: '',
                },
                {
                    title: 'Tên sản phẩm',
                    value: '',
                },
                {
                    title: 'UPH (Ấn định)',
                    value: '',
                },
                {
                    title: 'UPH (Thực tế)',
                    value: '',
                },
                {
                    title: 'SL đầu ra (KH)',
                    value: '',
                },
                {
                    title: 'SL đầu ra (TT)',
                    value: '',
                },
                {
                    title: 'SL đầu ra (TT OK)',
                    value: '',
                    onClick: () => {
                        handleOpenAssign();
                    }
                },
            ]);
            setListCheck([])
        }
    }, [selectedRow])
    const rowClassName = (record, index) => {
        return record.status === 0 ? 'table-row-green' : 'table-row-grey'
    }
    const onAssign = async (values) => {
        var res = await setAssignLineUser({ users: values, table_id: values.table_id, line_id: line, lot_id: selectedRow.lot_id });
        if (res.success) {
            let dataTable = [];
            var res = await getTableChon({ lot_id: selectedRow.lot_id });
            // Object.keys(res.data.table ?? {}).map(key=> {
            //     (res.data.table[key] ?? []).map(val => {
            //         dataTable.push(
            //             {
            //                 table_id: key,
            //                 user_id: val.id,
            //                 sl_cong_viec: val.sl_cong_viec,
            //             }
            //         );
            //     })
            // })
            setAssignData(res.data.table);
        }
        formAssign.resetFields();
    }
    const onHandleSave = async () => {
        console.log(assignData);
        // const dataAssignWork = assignData.reduce((group, product) => {
        //     const { table_id } = product;
        //     group[table_id] = group[table_id] ?? [];
        //     group[table_id].push({ user_id: product?.user_id, so_luong_thuc_te: product?.so_luong_thuc_te, so_luong_thuc_te_ok: product?.so_luong_thuc_te_ok });
        //     return group;
        // }, {});
        // // console.log(dataAssignWork);
        // const table = Object.keys(dataAssignWork ?? {}).map(key => {
        //     console.log(dataAssignWork[key]);
        //     return {
        //         table_id: key,
        //         data: dataAssignWork[key],
        //     }
        // })
        const params = {
            lot_id: selectedRow?.lot_id,
            table: assignData
        }
        await setAssignTableUserWork(params);

        var res = await getTableChon({ lot_id: selectedRow.lot_id });
        let tableData = [];
        let wroking_user = [];
        setRemain(res.data.sl_con_lai);
        setOldQuantity(res.data.sl_le_ok);
        (res.data.table ?? []).map(e => {
            if (!e?.so_luong_thuc_te || !e?.so_luong_thuc_te_ok) {
                wroking_user.push(e.user_id);
            }
        })
        setAssignData(res.data.table);
        setUsers(prev => prev.map(e => {
            if (wroking_user.includes(e.value)) {
                return { ...e, disabled: true }
            } else {
                return { ...e, disabled: false }
            }
        }))
    }
    let interval;
    useEffect(() => {
        interval = setInterval(async () => {
            const lineOverall = await getLineOverall({ type: 1, line_id: line })
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
            const infoPallet = await getInfoPallet({ type: 7 });
            if (infoPallet.success) {
                setData(infoPallet.data.map(e => {
                    return { ...e }
                }))
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleOpenAssign = () => {
        if (selectedRow) {
            (async () => {
                var res = await getTableChon({ lot_id: selectedRow.lot_id });
                let tableData = [];
                let wroking_user = [];

                setRemain(res.data.sl_con_lai);
                setOldQuantity(res.data.sl_le_ok);
                (res.data.table ?? []).map(e => {
                    if (!e?.so_luong_thuc_te || !e?.so_luong_thuc_te_ok) {
                        wroking_user.push(e.user_id);
                    }
                })
                setAssignData(res.data.table);
                setUsers(prev => prev.map(e => {
                    if (wroking_user.includes(e.value)) {
                        return { ...e, disabled: true }
                    } else {
                        return { ...e, disabled: false }
                    }
                }))
                if (res.data.is_result === true) {
                    setOpenAssignTable(true);
                } else {
                    if(res.data.sl_con_lai > 0){
                        setOpenAssign(true);
                    }else{
                        message.error('Đã giao hết mời in tem');
                    }
                }
            })()
        }
    }
    useEffect(() => {
        formAssign.resetFields();
    }, [openAssign])

    useEffect(() => {
        if (selectedRow && data.some(e => e.lot_id === selectedRow.lot_id && e.status === 1)) {
            setSelectedRow();
        }
    }, [data]);
    const onFinishPrint = async (values) => {
        console.log(values.sl_in_tem,parseInt(quantityOK) + parseInt(quantityTon))
        if (values.sl_in_tem > parseInt(quantityOK) + parseInt(quantityTon)) {
            message.error('Số lượng in tem phải nhỏ hơn số lượng OK + số lượng tồn');
        } else {
            const res = await inTem({ lot_id: selectedRow.lot_id, line_id: line, sl_in_tem: values.sl_in_tem });
            if (res.success) {
                setOpenPrint(false);
                formPrint.resetFields();
                let list = [];
                if ((Array.isArray(res.data))) {
                    res.data.map(lot => {
                        lot.lot_id.forEach((e, index) => {
                            list.push(
                                {
                                    ...selectedRow,
                                    lot_id: e,
                                    soluongtp: lot.so_luong[index],
                                    product_id: selectedRow.ma_hang,
                                    lsx: selectedRow.lo_sx,
                                    cd_thuc_hien: options.find(e => e.value === parseInt(line))?.label,
                                    cd_tiep_theo: line === '22' ? 'Bế' : options[options.findIndex(e => e.value === parseInt(line)) + 1]?.label
                                }
                            )
                        })
                    })
                } else {
                    res.data.lot_id.forEach((e, index) => {
                        list.push(
                            {
                                ...selectedRow,
                                lot_id: e,
                                soluongtp: res.data.so_luong[index],
                                product_id: selectedRow.ma_hang,
                                lsx: selectedRow.lo_sx,
                                cd_thuc_hien: options.find(e => e.value === parseInt(line))?.label,
                                cd_tiep_theo: line === '22' ? 'Bế' : options[options.findIndex(e => e.value === parseInt(line)) + 1]?.label
                            }
                        )
                    })
                }
                setListCheck(list);
            }
        }
    }
    const openMdlPrint = async () => {
        if (selectedRow) {
            const res = await getInfoChon({ lot_id: selectedRow.lot_id });
            if (res.success) {
                setQuantityOK(res.data.sl_ok);
                setQuantityTon(res.data.sl_ton);
                setOpenPrint(true);
            }
        } else {
            message.info('Chưa chọn mã');
        }
    }
    return (
        <React.Fragment>
            <Spin spinning={loading}>
                <Row className='mt-3' gutter={[8, 12]}>
                    <Col span={4}>
                        <SelectButton value={options.length > 0 && parseInt(line)} options={options} label="Chọn công đoạn" onChange={onChangeLine} />
                    </Col>
                    <Col span={20}>
                        <DataDetail data={row1} />
                    </Col>
                    <Col span={24}>
                        <ScanButton onScan={onScan} searchData={searchData} placeholder={"Quét mã QR hoặc nhập mã thùng"} />
                    </Col>
                    <Col span={20}>
                        <DataDetail data={row2} />
                    </Col>
                    <Col span={4}>
                        <Button size='large' type='primary' style={{ height: '100%', width: '100%', whiteSpace: "normal" }} onClick={openMdlPrint}>Nhập số lượng in tem</Button>
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
                <Modal title="Giao việc" open={openAssign} width={600} onCancel={() => setOpenAssign(false)} onOk={() => setOpenAssign(false)}>
                    <Form
                        form={formAssign}
                        layout='horizontal'
                        onFinish={onAssign}
                        labelCol={{ span: 6 }}
                        labelAlign='left'
                        initialValues={{
                            table_id: '',
                            user_id: '',
                        }}>
                        <Form.Item name={"lot_id"} hidden>
                        </Form.Item>
                        <Form.Item name={"table_id"} label={'Chọn vị trí'}
                            rules={[{
                                required: true,
                                message: "Trường này là bắt buộc"
                            }]}>
                            <Select options={table} />
                        </Form.Item>
                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) => prevValues.table_id !== currentValues.table_id}
                        >
                            {({ getFieldValue }) =>
                                getFieldValue('table_id') !== '' ? (
                                    <Form.Item label={'Chọn nhân viên'} name={"user_id"}
                                        rules={[{
                                            required: true,
                                            message: "Trường này là bắt buộc"
                                        }]}>
                                        <Select options={users} optionFilterProp={'label'} showSearch />
                                    </Form.Item>
                                ) : null
                            }
                        </Form.Item>
                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) => prevValues.user_id !== currentValues.user_id}
                        >
                            {({ getFieldValue }) =>
                                getFieldValue('user_id') !== '' ? (

                                    <Form.Item label={'Số lượng giao việc'} name={"sl_cong_viec"}
                                        rules={[{
                                            required: true,
                                            message: "Trường này là bắt buộc"
                                        }]}>
                                        <InputNumber min={0} inputMode='numeric' style={{ width: '100%' }} />
                                    </Form.Item>

                                ) : null
                            }
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'right' }}>
                            <Button htmlType='submit' type='primary'>Thêm</Button>
                        </Form.Item>
                    </Form>
                    <h6><span className='float-left'>Số lượng còn: {remain}</span><span style={{ float: 'right' }}>Số lượng lẻ OK: {oldQuantity}</span></h6>
                    <Table
                        scroll={{
                            x: 200,
                            y: 350,
                        }}
                        pagination={false}
                        bordered
                        columns={assignColumn}
                        dataSource={assignData}
                        size='small'
                    />
                </Modal>
                <Modal title={"Ghi nhận kết quả"} open={openAssignTable} width={800} onCancel={() => setOpenAssignTable(false)} onOk={() => { setOpenAssignTable(false); onHandleSave() }} cancelText="Đóng">
                    <Table
                        scroll={{
                            x: 200,
                            y: 350,
                        }}
                        pagination={false}
                        bordered
                        columns={resultColumn}
                        dataSource={assignData}
                        size='small'
                    />
                </Modal>
                <Modal title={"Nhập số lượng in tem"} open={openPrint} width={600} onCancel={() => setOpenPrint(false)} footer={null}>
                    <Divider className='mb-3 mt-1' />
                    <p>Số lượng OK: {quantityOK}</p>
                    <p>Số lượng tồn: {quantityTon}</p>
                    <Form layout="vertical" onFinish={onFinishPrint} form={formPrint}>
                        <Form.Item label="" name="sl_in_tem">
                            <InputNumber placeholder='Nhập số lượng in tem' style={{ width: '100%' }} />
                        </Form.Item>
                        <Button htmlType="submit" type="primary">In tem</Button>
                    </Form>
                </Modal>
            </Spin>
        </React.Fragment>
    );
};

export default Manufacture3;