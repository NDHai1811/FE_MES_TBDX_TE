import React, { useState, useRef } from 'react';
import { Button, Table, Card, Checkbox, Upload, message, Modal, Space, InputNumber, Form, Input, Row, Col, DatePicker } from 'antd';
import "../style.scss";
import { baseURL } from '../../../config';
import { deletePallet, getListLot, getListLsxUseMaterial, getListMaterialLog, storeMaterialLog, storePallet, updateMaterialLog, updateMaterialLogRecord } from '../../../api';
import { useEffect } from 'react';
import Tem from './Tem';
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
const siderStyle = {
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#fff',
    width: '100%'
};
const UIManufacture = (props) => {
    document.title = "UI - Quản lý giấy vào bảo ôn";
    const [dataUpload, setDataUpload] = useState([]);
    const [openMdlNhap, setOpenMdlNhap] = useState(false);
    const [openMdlEdit, setOpenMdlEdit] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [listPalletCheck, setListPalletCheck] = useState([]);
    const [listCheck, setListCheck] = useState([]);
    const [valueImport, setValueImport] = useState([]);
    const [valueImportLsx, setValueImportLsx] = useState([]);
    const [dataLsx, setDataLsx] = useState([]);
    const [titleMdlEdit, setTitleMdlEdit] = useState('Cập nhật');
    const [SLTT, setSLTT] = useState([]);
    const [form] = Form.useForm();
    const setValueInput = (id, value) => {
        const check = valueImport.find((old_value) => old_value.id === id);
        if (check) {
            const new_value = valueImport.map((old_value) => {
                if (old_value.id === id) {
                    old_value.sl_thuc_xuat = value;
                }
                return old_value;
            });
            setValueImport(new_value);
        } else {
            setValueImport([...valueImport, { id: id, sl_thuc_xuat: value }])
        }
    }
    const setValueInputLsx = (id, lo_sx, value) => {
        const check = valueImportLsx.find((old_value) => old_value.lo_sx === lo_sx);
        if (check) {
            const new_value = valueImportLsx.map((old_value) => {
                if (old_value.lo_sx === lo_sx) {
                    old_value.sl_pallet = value;
                    const arr = [];
                    for (var i = 0; i < value; i++) {
                        arr.push({ key: i, value: '' });
                    }
                    old_value.value_pallet = arr;
                }
                return old_value;
            });
            setValueImportLsx(new_value);
        } else {
            const arr = [];
            for (var i = 0; i < value; i++) {
                arr.push({ key: i, value: '' });
            }
            setValueImportLsx([...valueImportLsx, { id: id, lo_sx: lo_sx, sl_pallet: value, value_pallet: arr }])
        }
    }
    const setValueInputDetail = (lo_sx, key, value) => {
        const check = valueImportLsx.find((old_value) => old_value.lo_sx === lo_sx);
        if (check) {
            const new_value = valueImportLsx.map((old_value) => {
                if (old_value.lo_sx === lo_sx) {
                    old_value.value_pallet.map((old) => {
                        if (old.key === key) {
                            old.value = value;
                        }
                        return old;
                    })
                }
                return old_value;
            });
            setValueImportLsx(new_value);
        }
    }
    const openMdlChia = async (id, manvl, sl_thuc_te) => {
        setDataLsx(await getListLsxUseMaterial({ id: id, material_id: manvl, sl_thuc_te: sl_thuc_te }));
        setIsModalOpen(true);
    }
    const columnsLsx = [
        {
            title: 'Mã hàng',
            dataIndex: 'product_id',
            key: 'product_id',
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'ten_sp',
            key: 'ten_sp',
        },
        {
            title: 'Lô sản xuất',
            dataIndex: 'lo_sx',
            key: 'lo_sx',
        },
        {
            title: 'Số lượng kế hoạch',
            dataIndex: 'sl_ke_hoach',
            key: 'sl_ke_hoach',
        },
        {
            title: 'Số lượng pallet cần chia',
            dataIndex: 'sl_pallet',
            key: 'sl_pallet',
            render: (value, item, index) => <InputNumber min={1} onChange={(value) => { setValueInputLsx(item.id, item.lo_sx, value); setDataLsx(prev => prev.map(e => { if (e.lo_sx === item.lo_sx) { return { ...e, sl_pallet: value } } return e; })) }} value={value} disabled={item?.pallet?.length} />
        },
        {
            title: 'Số lượng trên từng Pallet',
            dataIndex: 'sl_pallet',
            key: 'sl_pallet',
            render: (value, item, index) => {
                const pallet = valueImportLsx.find((record) => record.id === item.id);
                if (item) {
                    const indents = [];
                    for (let key = 0; key < item.sl_pallet; key++) {
                        console.log(item?.pallet[key]?.so_luong);
                        indents.push(<div className='mb-2'><span>Pallet {key + 1}:</span><InputNumber min={1} onChange={(value) => { setValueInputDetail(item.lo_sx, key, value) }} disabled={item?.pallet?.length} defaultValue={item?.pallet[key]?.so_luong} /></div>);
                    }
                    return indents;
                }
            }
        },
    ]
    const columnsUpload = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (value, item, index) => index + 1,
        },
        {
            title: 'Mã nguyên vật liệu',
            dataIndex: 'material_id',
            key: 'material_id',
        },
        {
            title: 'Số lượng xuất thực tế',
            dataIndex: 'sl_xuat_thuc_te',
            key: 'sl_xuat_thuc_te',
            render: (value, item, index) => <InputNumber min={1} onChange={(value) => { setValueInput(item.id, value) }} value={valueImport.find((record) => record.id === item.id) ? valueImport.find((record) => record.id === item.id).sl_thuc_xuat : ''} />
        },
    ]
    const mergeValue = new Set();
    const mergeValue1 = new Set();
    const mergeValue2 = new Set();
    const mergeValue3 = new Set();
    const mergeValue4 = new Set();

    const mergeValue5 = new Set();
    const mergeValue6 = new Set();
    const mergeValue7 = new Set();
    const mergeValue8 = new Set();
    const mergeValue9 = new Set();
    useEffect(() => {
        mergeValue.clear();
        mergeValue1.clear();
        mergeValue2.clear();
        mergeValue3.clear();
        mergeValue4.clear();

        mergeValue5.clear();
        mergeValue6.clear();
        mergeValue7.clear();
        mergeValue8.clear();
        mergeValue9.clear();
    }, []);
    const columns = [
        {
            title: 'Checkbox',
            dataIndex: 'name1',
            key: 'name1',
            render: (value, item, index) => <Checkbox value={item.lot_id ? item.lot_id : item.id} onChange={onChangeChecbox}></Checkbox>
        },
        {
            title: 'Mã nguyên liệu',
            dataIndex: 'manvl',
            key: 'manvl',
            render: (value, item, index) => <a onClick={() => {
                if (item.sl_kho_xuat === item.sl_thuc_te && item.status === 0) {
                    openMdlChia(item.id, item.manvl, item.sl_thuc_te)
                }
                if (item.sl_kho_xuat > item.sl_thuc_te) {
                    message.error('Kho chưa xuất đủ số lượng');
                }
                if (item.status === 1) {
                    message.info('Nguyên vật liệu đã chia pallet');
                }
            }}>{value}</a>,
            onCell: (record, index) => {
                if (mergeValue.has(record.manvl)) {
                    return { rowSpan: 0 };
                } else {
                    const rowCount = dataTable.filter((data) => data.manvl === record.manvl).length;
                    mergeValue.add(record.manvl);
                    return { rowSpan: rowCount };
                }
                return {};
            },
        },
        {
            title: 'Quy cách nguyên liệu (mm)',
            dataIndex: 'quy_cach',
            key: 'quy_cach',
            onCell: (record, index) => {
                if (mergeValue1.has(record.manvl)) {
                    return { rowSpan: 0 };
                } else {
                    const rowCount = dataTable.filter((data) => data.manvl === record.manvl).length;
                    mergeValue1.add(record.manvl);
                    return { rowSpan: rowCount };
                }
                return {};
            },
        },
        {
            title: 'Số lượng nguyên liệu kho xuất (tờ)',
            dataIndex: 'sl_kho_xuat',
            key: 'sl_kho_xuat',
            onCell: (record, index) => {
                if (mergeValue2.has(record.manvl)) {
                    return { rowSpan: 0 };
                } else {
                    const rowCount = dataTable.filter((data) => data.manvl === record.manvl).length;
                    mergeValue2.add(record.manvl);
                    return { rowSpan: rowCount };
                }
                return {};
            },
        },
        {
            title: 'Số lượng nhận thực tế (tờ)',
            dataIndex: 'sl_thuc_te',
            key: 'sl_thuc_te',
            onHeaderCell: (column) => {
                return {
                    onClick: () => {
                        setOpenMdlNhap(true);
                    }
                };
            },
            onCell: (record, index) => {
                if (mergeValue3.has(record.manvl)) {
                    return { rowSpan: 0 };
                } else {
                    const rowCount = dataTable.filter((data) => data.manvl === record.manvl).length;
                    mergeValue3.add(record.manvl);
                    return { rowSpan: rowCount };
                }
                return {};
            },
        },
        {
            title: 'Số lượng thiếu so với số lượng kho xuất(tờ)',
            dataIndex: 'so_luong_thieu',
            key: 'so_luong_thieu',
            onCell: (record, index) => {
                if (mergeValue4.has(record.manvl)) {
                    return { rowSpan: 0 };
                } else {
                    const rowCount = dataTable.filter((data) => data.manvl === record.manvl).length;
                    mergeValue4.add(record.manvl);
                    return { rowSpan: rowCount };
                }
                return {};
            },
        },
        {
            title: 'Lô sản xuất',
            dataIndex: 'lsx',
            key: 'lsx',
            onCell: (record, index) => {
                if (mergeValue5.has(record.lsx)) {
                    return { rowSpan: 0 };
                } else {
                    const rowCount = dataTable.filter((data) => (data.lsx === record.lsx && data.manvl === record.manvl)).length;
                    mergeValue5.add(record.lsx);
                    return { rowSpan: rowCount };
                }
                return {};
            },
        },
        {
            title: 'Số lượng kế hoạch',
            dataIndex: 'so_luong_ke_hoach',
            key: 'so_luong_ke_hoach',
            onCell: (record, index) => {
                if (mergeValue6.has(record.lsx)) {
                    return { rowSpan: 0 };
                } else {
                    const rowCount = dataTable.filter((data) => (data.lsx === record.lsx && data.manvl === record.manvl)).length;
                    mergeValue6.add(record.lsx);
                    return { rowSpan: rowCount };
                }
                return {};
            },

        },
        {
            title: 'Mã hàng',
            dataIndex: 'product_id',
            key: 'product_id',
            onCell: (record, index) => {
                if (mergeValue7.has(record.lsx)) {
                    return { rowSpan: 0 };
                } else {
                    const rowCount = dataTable.filter((data) => (data.lsx === record.lsx && data.manvl === record.manvl)).length;
                    mergeValue7.add(record.lsx);
                    return { rowSpan: rowCount };
                }
                return {};
            },
        },

        {
            title: 'Tên sản phẩm',
            dataIndex: 'ten_sp',
            key: 'ten_sp',
            onCell: (record, index) => {
                if (mergeValue8.has(record.lsx)) {
                    return { rowSpan: 0 };
                } else {
                    const rowCount = dataTable.filter((data) => (data.lsx === record.lsx && data.manvl === record.manvl)).length;
                    mergeValue8.add(record.lsx);
                    return { rowSpan: rowCount };
                }
                return {};
            },
        },
        {
            title: 'Khách hàng',
            dataIndex: 'khach_hang',
            key: 'khach_hang',
            onCell: (record, index) => {
                if (mergeValue9.has(record.lsx)) {
                    return { rowSpan: 0 };
                } else {
                    const rowCount = dataTable.filter((data) => (data.lsx === record.lsx && data.manvl === record.manvl)).length;
                    mergeValue9.add(record.lsx);
                    return { rowSpan: rowCount };
                }
                return {};
            },
        },
        {
            title: 'Mã pallet',
            dataIndex: 'lot_id',
            key: 'lot_id',
        },
        {
            title: 'Số lượng tờ/pallet',
            dataIndex: 'soluongtp',
            key: 'soluongtp',
        }

    ];
    useEffect(() => {
        const new_data = dataTable.filter((datainput) => listPalletCheck.includes(datainput.lot_id));
        setListCheck(new_data);
    }, [listPalletCheck])
    const onChangeChecbox = (e) => {
        if (e.target.checked) {
            if (!listPalletCheck.includes(e.target.value)) {
                setListPalletCheck(oldArray => [...oldArray, e.target.value]);
            }
        } else {
            if (listPalletCheck.includes(e.target.value)) {
                setListPalletCheck(oldArray => oldArray.filter((datainput) => datainput !== e.target.value))
            }
        }
    }
    const loadListTable = async () => {
        const res = await getListLot();
        setDataTable(res.sort((a, b) => {
            if (a.manvl < b.manvl) {
                return -1;
            }
            if (a.manvl > b.manvl) {
                return 1;
            }
            return 0;
        }));
    }
    useEffect(() => {
        console.log(listPalletCheck);
    }, [listPalletCheck])
    useEffect(() => {
        (async () => {
            loadListTable();
        })()
    }, [])
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        (async () => {
            if (openMdlNhap) {
                setDataUpload(await getListMaterialLog());
            }
        })()
    }, [openMdlNhap])
    const saveUpdate = async () => {
        console.log(valueImport);
        if (valueImport.length) {
            const res = await updateMaterialLog({ log: valueImport })
            setValueInput();
            setOpenMdlNhap(false);
            setValueImport([]);
            loadListTable();
        } else {
            message.error('Không có dữ liệu');
        }
    }
    const creatPallet = async () => {
        if (valueImportLsx.length) {
            const res = await storePallet({ log: valueImportLsx })
            if (res.success) {
                setIsModalOpen(false);
                setValueImportLsx([]);
                loadListTable();
            }
        } else {
            message.error('Không có dữ liệu');
        }
    }
    const componentRef1 = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef1.current
    });
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Upload file thành công',
        });
    };

    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'Upload file lỗi',
        });
    };
    function isNumeric(value) {
        return /^-?\d+$/.test(value);
    }
    const deleteRecord = async () => {
        if (listPalletCheck.length > 0) {
            const res = await deletePallet(listPalletCheck);
            setListPalletCheck([]);
            loadListTable();
        } else {
            message.info('Chưa chọn bản ghi cần xóa')
        }
    }
    const onFinish = async (values) => {
        if (values.id) {
            const res = await updateMaterialLogRecord(values);
        } else {
            const res = await storeMaterialLog(values);
        }
        setOpenMdlEdit(false);
        loadListTable();
    }
    const onFinishSearch = async (values) => {
        values.start_date = dayjs(values.start_date).format('YYYY-MM-DD');
        values.end_date = dayjs(values.end_date).format('YYYY-MM-DD');
        const res = await getListLot(values);
        setDataTable(res);
    }
    const editRecord = async () => {
        setTitleMdlEdit('Cập nhật')
        if (listPalletCheck.length > 1) {
            message.info('Chỉ chọn 1 bản ghi để chỉnh sửa');
        } else if (listPalletCheck.length == 0) {
            message.info('Chưa chọn bản ghi cần chỉnh sửa')
        } else if (!isNumeric(listPalletCheck[0])) {
            message.info('Mã giấy đã chia pallet')
        } else {
            const result = dataTable.find((record) => record.id === listPalletCheck[0]);
            form.setFieldsValue({ id: listPalletCheck[0], material_id: result.manvl, sl_kho_xuat: result.sl_kho_xuat })
            setOpenMdlEdit(true);
        }
    }
    const insertRecord = async () => {
        form.resetFields();
        setTitleMdlEdit('Thêm mới')
        setOpenMdlEdit(true);
    }
    return (
        <React.Fragment>
            {contextHolder}
            <Card className='mt-3' title="Thống kê phân xưởng" extra={
                <Space>
                    <Upload
                        showUploadList={false}
                        name='file'
                        action={baseURL + "/api/upload-ke-hoach-xuat-kho-tong"}
                        headers={{
                            authorization: 'authorization-text',
                        }}
                        onChange={(info) => {
                            setLoading(true);
                            if (info.file.status === 'error') {
                                error();
                                console.log(false);
                                setLoading(false);
                            } else if (info.file.status === 'done') {
                                if (info.file.response.success === true) {
                                    loadListTable();
                                    success();
                                    setLoading(false);
                                } else {
                                    loadListTable();
                                    message.error(info.file.response.message);
                                    setLoading(false);
                                }
                            }
                        }}
                    >
                        <Button type="primary" loading={loading}>Upload excel</Button>
                    </Upload>
                    <Button type="primary" onClick={deleteRecord}>Delete</Button>
                    <Button type="primary" onClick={editRecord}>Edit</Button>
                    <Button type="primary" onClick={insertRecord}>Insert</Button>
                    <Button type="primary" onClick={handlePrint}>In tem nguyên liệu</Button>
                    <div className="report-history-invoice">
                        <Tem listCheck={listCheck} ref={componentRef1} />
                    </div>
                </Space>
            }>
                <Form style={{ margin: '0 15px' }}
                    layout="horizontal"
                    form={form}
                    onFinish={onFinishSearch}>
                    <Row gutter={[16,16]}>
                        <Col span={4}>
                            <Form.Item label="Bắt đầu" name="start_date">
                                <DatePicker allowClear={false} placeholder='Bắt đầu' style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="Kết thúc" name="end_date">
                                <DatePicker allowClear={false} placeholder='Kết thúc' style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item className='mb-0'>
                                <Button type="primary" htmlType='submit'>Truy vấn</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Table columns={columns} dataSource={dataTable} bordered pagination={false} />
            </Card>
            <Modal title="Chia pallet" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={800} destroyOnClose>
                <Table
                    pagination={false}
                    bordered={true}
                    columns={columnsLsx}
                    dataSource={dataLsx} />
                <div class="d-block text-end"><Button type="primary" onClick={creatPallet} className='mt-3 float-right'>Xác nhận</Button></div>
            </Modal>
            <Modal title="Thông tin số lượng xuất thực tế" open={openMdlNhap} onCancel={() => setOpenMdlNhap(false)} footer={null}>
                <Table
                    pagination={false}
                    bordered={true}
                    columns={columnsUpload}
                    dataSource={dataUpload} />
                <div class="d-block text-end"><Button onClick={saveUpdate} type="primary" className='mt-3 float-right'>Xác nhận</Button></div>
            </Modal>
            <Modal title={titleMdlEdit} open={openMdlEdit} onCancel={() => setOpenMdlEdit(false)} footer={null}>
                <Form style={{ margin: '0 15px' }}
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}>
                    <Form.Item name="id" className='mb-3 d-none'>
                        <Input></Input>
                    </Form.Item>
                    <Form.Item label="Mã giấy" name="material_id" className='mb-3' >
                        <Input placeholder='Nhập mã giấy'></Input>
                    </Form.Item>
                    <Form.Item label="Số lượng kho xuất" name="sl_kho_xuat" className='mb-3'>
                        <Input placeholder='Nhập số lượng kho xuất'></Input>
                    </Form.Item>
                    <Form.Item className='mb-0'>
                        <Button type="primary" htmlType='submit' >Lưu lại</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </React.Fragment>
    );
};

export default UIManufacture;