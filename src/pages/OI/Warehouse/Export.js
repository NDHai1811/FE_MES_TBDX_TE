import React, { useEffect, useState, useRef } from 'react';
import { QrcodeOutlined } from '@ant-design/icons';
import { Row, Col, Button, Table, Modal, Input, Form, InputNumber, message, Space } from 'antd';
import DataDetail from '../../../components/DataDetail';
import '../style.scss';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import SelectButton from '../../../components/Button/SelectButton';
import { exportWareHouse, getDetailLot, getInfoExportWareHouse, getListCustomerExport, getProposeExportWareHouse, gopThung, prepareGT, splitBarrel } from '../../../api';
import dayjs from "dayjs";
import { useProfile } from '../../../components/hooks/UserHooks';
import TemThung from './TemThung';
import { useReactToPrint } from "react-to-print";

const exportColumns = [
    {
        title: 'Số lot',
        dataIndex: 'product_id',
        key: 'product_id',
        align: 'center'
    },
    {
        title: 'Số MQL',
        dataIndex: 'ten_san_pham',
        key: 'ten_san_pham',
        align: 'center'
    },
    {
        title: 'Số lượng',
        dataIndex: 'lot_id',
        key: 'lot_id',
        align: 'center'
    },
    {
        title: 'Vị trí',
        dataIndex: 'ke_hoach_xuat',
        key: 'lot',
        align: 'center'
    },
    {
        title: 'Người nhập',
        dataIndex: 'thuc_te_xuat',
        key: 'thuc_te_xuat',
        align: 'center'
    },
];

const Export = (props) => {
    document.title = "Kho";
    const { line } = useParams();
    const history = useHistory();
    const [customersData, setCustomersData] = useState([]);
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState({ plan_export: 0, actual_export: 0 });
    const { userProfile } = useProfile();
    const [listTem, setListTem] = useState([]);
    useEffect(() => {
        if (data.length > 0) {
            let sum = { plan_export: 0, actual_export: 0 };
            data.forEach(e => {
                sum.plan_export += e?.plan_export ?? 0;
                sum.actual_export += e?.actual_export ?? 0;
            })
            setSummary(sum)
        }
    }, data)

    const options = [
        {
            label: 'Nhập',
            value: 'nhap',
        },
        {
            label: 'Xuất',
            value: 'xuat',
        },
    ];
    const onChangeLine = (value) => {
        history.push('/warehouse/' + value)
    }
    const [customers, setCustomers] = useState([]);
    const [row1, setRow1] = useState([
        {
            title: 'Kế hoạch xuất',
            value: 1000,
        },
        {
            title: 'Số lượng',
            value: 1000,
        },
        {
            title: 'Tỷ lệ',
            value: 1000,
        }
    ])
    const [row2, setRow2] = useState([
        {
            title: 'Số lot',
            value: '',
        },
        {
            title: 'Số MQL',
            value: '',
        },
        {
            title: 'Số lượng',
            value: '',
        },
        {
            title: 'Vị trí',
            value: '',
        }
    ])
    const [openModal, setOpenModal] = useState(false);
    const [currentLot, setCurrentLot] = useState({});
    const [currentKhachHang, setCurrentKhachHang] = useState('');
    const [valueQR, setValueQR] = useState('');
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        values.lot_id = currentLot.lot_id;
        const res = await splitBarrel(values);
        setListTem(res);
        setOpenModal(false);
        setData(prev => prev.map(e => {
            if (e.lot_id === currentLot.lot_id) {
                e.so_luong = values.remain_quanlity;
            }
            return e;
        }));
        setCurrentLot({});
        setRow2([
            {
                title: 'Mã hàng',
                value: '',
            },
            {
                title: 'Tên SP',
                value: '',
            },
            {
                title: 'Mã thùng',
                value: '',
            },
            {
                title: 'Số lượng',
                value: '',
            },
            {
                title: 'Vị trí',
                value: '',
            }
        ]);
    }
    useEffect(() => {
        if (listTem.length > 0) {
            handlePrint();
            setListTem([])
        }
    }, [listTem.length])

    const onClickRow = (record) => {
        setData(prev => prev.map(e => {
            if (e.lot_id === record.lot_id && record.status !== 2) {
                return { ...e, status: 1 }
            }
            if (e.status === 2) {
                return e;
            }
            return { ...e, status: 0 };
        }));
    }
    const onChangeCustomer = async (value) => {
        setCurrentKhachHang(value);
        const res = await getProposeExportWareHouse({ khach_hang: value })
        setData(res);
    }
    const loadInfo = async () => {
        setRow1(await getInfoExportWareHouse());
    }
    const loadCustomer = async () => {
        setCustomersData(await getListCustomerExport());
    }
    useEffect(() => {
        (async () => {
            loadCustomer();
            loadInfo();
        })()
    }, [])
    const getLotCurrent = async (e) => {
        if(currentKhachHang){
            const current_lot = data.find((old_data) => old_data.lot_id === e.target.value);
            if (current_lot !== undefined) {
                if (current_lot.status === 2) {
                    message.error('Thùng hàng đã xuất');
                } else {
                    setCurrentLot(current_lot);
                    setRow2([
                        {
                            title: 'Mã hàng',
                            value: current_lot.product_id,
                            cell_color: '#fdfdb4',
                        },
                        {
                            title: 'Tên SP',
                            value: current_lot.ten_san_pham,
                            cell_color: '#fdfdb4',
                        },
                        {
                            title: 'Mã thùng',
                            value: current_lot.lot_id,
                            cell_color: '#fdfdb4',
                        },
                        {
                            title: 'Số lượng',
                            value: current_lot.so_luong,
                            cell_color: '#fdfdb4',
                        },
                        {
                            title: 'Vị trí',
                            value: current_lot.vi_tri,
                            cell_color: '#fdfdb4',
                        }
                    ]);
                    setValueQR('');
                }
            } else {
                message.error('Mã thùng không có trong danh sách gợi ý')
            }
        }else{
            const res = await getDetailLot({lot_id:e.target.value});
            setCurrentLot(res);
            setRow2([
                {
                    title: 'Mã hàng',
                    value: res.product_id,
                    cell_color: '#fdfdb4',
                },
                {
                    title: 'Tên SP',
                    value: res.ten_san_pham,
                    cell_color: '#fdfdb4',
                },
                {
                    title: 'Mã thùng',
                    value: res.lot_id,
                    cell_color: '#fdfdb4',
                },
                {
                    title: 'Số lượng',
                    value: res.so_luong,
                    cell_color: '#fdfdb4',
                },
                {
                    title: 'Vị trí',
                    value: res.vi_tri,
                    cell_color: '#fdfdb4',
                }
            ]);
            setValueQR('');
        }   
        
    }
    const saveLogWareHouse = async (e) => {
        if (e.target.value === currentLot.vi_tri) {
            const res = await exportWareHouse({ lot_id: currentLot.lot_id, cell_id: e.target.value, khach_hang: currentKhachHang });
            setCurrentLot({});
            const new_data = data.filter((old_data)=>{
                if (old_data.product_id === currentLot.product_id) {
                    old_data.thuc_te_xuat = old_data.thuc_te_xuat + currentLot.so_luong;
                }
                if (old_data.lot_id !== currentLot.lot_id) {
                    return old_data;
                }
            })
            setData(new_data);
            setRow2([
                {
                    title: 'Mã hàng',
                    value: '',
                },
                {
                    title: 'Tên SP',
                    value: '',
                },
                {
                    title: 'Mã thùng',
                    value: '',
                },
                {
                    title: 'Số lượng',
                    value: '',
                },
                {
                    title: 'Vị trí',
                    value: '',
                }
            ]);
            loadInfo();
            setValueQR('');
        } else {
            message.error('Không đúng vị trí đề xuất');
        }
    }
    const changeRemain = (value) => {
        form.setFieldValue('remain_quanlity', currentLot.so_luong - value);
    }
    const componentRef1 = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef1.current
    });
    const [openModalGT, setOpenModalGT] = useState(false);
    const [formGT] = Form.useForm();
    const selectedGT = Form.useWatch([], formGT);
    const onFinishGT = async (values) =>{
        if(values.sl_gop > values.sl_thung2){
            message.info('Số lượng gộp không được lớn hơn thùng gộp');
            return;
        }
        if(values.sl_gop <= 0){
            message.info('Số lượng gộp phải lớn hơn 0');
            return;
        }
        var res = await gopThung(values);
        if(res){
            setListTem(res);
        }
        formGT.resetFields();
    }
    const getDataThung = async () =>{
        var res = await prepareGT(formGT.getFieldsValue(true));
        if(res){
            formGT.setFieldsValue(res)
        }
    }
    useEffect(()=>{
        console.log(selectedGT);
    }, [selectedGT])
    return (
        <React.Fragment>
            <Row className='mt-3' gutter={[6, 6]}>
                <Col span={6}>
                    <SelectButton value={line} options={options} label="Chọn" onChange={onChangeLine} />
                </Col>
                <Col span={18}>
                    <DataDetail data={row1} />
                </Col>
                <Col span={24}>
                    <Input
                        size="large"
                        prefix={
                            <QrcodeOutlined
                                style={{ fontSize: '24px', marginRight: '10px' }}
                            />
                        }
                        placeholder={"Nhập mã QR hoặc nhập mã thùng"}
                        onPressEnter={Object.keys(currentLot).length ? saveLogWareHouse : getLotCurrent}
                        onChange={(e) => { setValueQR(e.target.value) }}
                        value={valueQR}
                        allowClear
                    />
                </Col>
                <Col span={8}>
                    <SelectButton options={customersData} onChange={onChangeCustomer} label="Khách hàng" />
                </Col>
                <Col span={16}>
                    <DataDetail data={row2} />
                </Col>
                <Col span={24}>
                    <Table
                        scroll={{
                            x: 200,
                            y: '100%',
                        }}
                        rowClassName={(record, index) => record.status === 1 ? 'table-row-yellow' : record.status === 2 ? 'table-row-grey' : ''}
                        pagination={false}
                        bordered
                        className='mb-4'
                        columns={exportColumns}
                        dataSource={data}
                        onRow={(record, index) => {
                            return {
                                onClick: () => onClickRow(record)
                            }
                        }}
                    />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Export;