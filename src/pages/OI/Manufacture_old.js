import React, { useEffect, useState } from 'react';
import { CloseOutlined, PrinterOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Layout, Row, Col, Divider, Button, Table, Modal, Select, Steps, Input, Radio } from 'antd';
import logolight from "../../assets/images/logo.png";
import { withRouter, Link } from "react-router-dom";
import CardInfo from './components/CardInfo';
import CardInfo2 from './components/CardInfo2';
import ScanQR from './components/ScanQR';
import DataDetail from '../../components/DataDetail';
import DataDetail2 from '../../components/DataDetail2';
import VerticalButton from '../../components/Button/VerticalButton';
import './style.scss';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import ScanButton from '../../components/Button/ScanButton';
const { Header, Content } = Layout;
const columns_in_tem_nvl = [
    {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
        align: 'center'
    },
    {
        title: 'Mã SP',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: 'SL đơn hàng',
        dataIndex: 'order_quanlity',
        key: 'order_quanlity',
        align: 'center'
    },
    {
        title: 'TG yêu cầu hoàn thành',
        dataIndex: 'time_require_complete',
        key: 'time_require_complete',
        align: 'center'
    },
    {
        title: 'SL NVL Sản xuất',
        dataIndex: 'material_quanliry',
        key: 'material_quanliry',
        align: 'center'
    },
    {
        title: 'Loại giấy',
        dataIndex: 'paper_type',
        key: 'paper_type',
        align: 'center'
    },
    {
        title: 'Kích thước giấy',
        dataIndex: 'paper_size',
        key: 'paper_size',
        align: 'center'
    },
    {
        title: 'SL Tờ/Pallet',
        dataIndex: 'pallet_quanlity',
        key: 'pallet_quanlity',
        align: 'center'
    },
]
const columns_bao_on_1 = [
    {
        title: 'STT Pallet',
        dataIndex: 'stt_pallet',
        key: 'stt_pallet',
        align: 'center'
    },
    {
        title: 'Mã SP',
        dataIndex: 'idProduct',
        key: 'idProduct',
        align: 'center'
    },
    {
        title: 'SL Tờ/Pallet',
        dataIndex: 'quanlity_p',
        key: 'quanlity_p',
        align: 'center'
    },
    {
        title: 'TG Bắt đầu bảo ôn',
        dataIndex: 'start_time',
        key: 'start_time',
        align: 'center'
    },
    {
        title: 'Thời gian bảo ôn',
        dataIndex: 'time',
        key: 'time',
        align: 'center'
    },
]
const columns_bao_on_2 = [
    {
        title: 'STT',
        dataIndex: 'stt',
        key: 'stt',
        align: 'center'
    },
    {
        title: 'Mã SP',
        dataIndex: 'idProduct',
        key: 'idProduct',
        align: 'center'
    },
    {
        title: 'SL Đơn hàng',
        dataIndex: 'quanlity',
        key: 'quanlity',
        align: 'center'
    },
    {
        title: 'TG YC H.Thành',
        dataIndex: 'finish_time',
        key: 'finish_time',
        align: 'center'
    },
    {
        title: 'Loại giấy',
        dataIndex: 'paper_type',
        key: 'paper_type',
        align: 'center'
    },
    {
        title: 'KT giấy',
        dataIndex: 'paper_size',
        key: 'paper_size',
        align: 'center'
    },
    {
        title: 'Số màu',
        dataIndex: 'color',
        key: 'color',
        align: 'center'
    },
    {
        title: 'Số bát',
        dataIndex: 'bat',
        key: 'bat',
        align: 'center'
    },
    {
        title: 'TG BĐ Bảo ôn',
        dataIndex: 'start_time',
        key: 'start_time',
        align: 'center'
    },
    {
        title: 'TG Bảo ôn',
        dataIndex: 'time',
        key: 'time',
        align: 'center'
    },

]

const data = [
    {
        index: '1',
        id: 'LSX001',
        order_quanlity: 'AC001',
        time_require_complete: '200',
        paper_type: '150'
    },
    {
        index: '2',
        id: 'LSX002',
        order_quanlity: 'AC002',
        time_require_complete: '300',
        paper_type: '250'
    },
    {
        index: '3',
        id: 'LSX003',
        order_quanlity: 'AC003',
        time_require_complete: '200',
        paper_type: '150'
    },
    {
        index: '4',
        id: 'LSX004',
        order_quanlity: 'AC004',
        time_require_complete: '200',
        paper_type: '150'
    },
    {
        index: '5',
        id: 'LSX005',
        order_quanlity: 'AC005',
        time_require_complete: '200',
        paper_type: '150'
    },
    {
        index: '6',
        id: 'LSX006',
        order_quanlity: 'AC006',
        time_require_complete: '200',
        paper_type: '150'
    },
    {
        index: '6',
        id: 'LSX006',
        order_quanlity: 'AC006',
        time_require_complete: '200',
        paper_type: '150'
    },
    {
        index: '6',
        id: 'LSX006',
        order_quanlity: 'AC006',
        time_require_complete: '200',
        paper_type: '150'
    }, {
        index: '1',
        id: 'LSX001',
        order_quanlity: 'AC001',
        time_require_complete: '200',
        paper_type: '150'
    },
    {
        index: '2',
        id: 'LSX002',
        order_quanlity: 'AC002',
        time_require_complete: '300',
        paper_type: '250'
    },
    {
        index: '3',
        id: 'LSX003',
        order_quanlity: 'AC003',
        time_require_complete: '200',
        paper_type: '150'
    },
    {
        index: '4',
        id: 'LSX004',
        order_quanlity: 'AC004',
        time_require_complete: '200',
        paper_type: '150'
    },
    {
        index: '5',
        id: 'LSX005',
        order_quanlity: 'AC005',
        time_require_complete: '200',
        paper_type: '150'
    },
    {
        index: '6',
        id: 'LSX006',
        order_quanlity: 'AC006',
        time_require_complete: '200',
        paper_type: '150'
    },
    {
        index: '6',
        id: 'LSX006',
        order_quanlity: 'AC006',
        time_require_complete: '200',
        paper_type: '150'
    },
    {
        index: '6',
        id: 'LSX006',
        order_quanlity: 'AC006',
        time_require_complete: '200',
        paper_type: '150'
    }
]
const columns1 = [
    {
        title: 'STT Pallet',
        dataIndex: 'index',
        key: 'index',
        align: 'center'
    },
    {
        title: 'Mã SP',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: 'SL Tờ/Pallet',
        dataIndex: 'quanlity',
        key: 'quanlity',
        align: 'center'
    },
    {
        title: 'TG bắt đầu bảo ôn',
        dataIndex: 'start_date',
        key: 'start_date',
        align: 'center'
    },
    {
        title: 'Thời gian bảo ôn',
        dataIndex: 'end_date',
        key: 'end_date',
        align: 'center'
    },
];
const columns2 = [
    {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
        align: 'center'
    },
    {
        title: 'Mã SP',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: 'SL đơn hàng',
        dataIndex: 'order_quanlity',
        key: 'order_quanlity',
        align: 'center'
    },
    {
        title: 'TG yêu cầu hoàn thành',
        dataIndex: 'time_require_complete',
        key: 'time_require_complete',
        align: 'center'
    },
    {
        title: 'Loại giấy',
        dataIndex: 'paper_type',
        key: 'paper_type',
        align: 'center'
    },
    {
        title: 'Kích thước giấy',
        dataIndex: 'paper_size',
        key: 'paper_size',
        align: 'center'
    },
    {
        title: 'Số bát',
        dataIndex: 'bowl_quanlity',
        key: 'bowl_quanlity',
        align: 'center'
    },
    {
        title: 'Số màu',
        dataIndex: 'color_code',
        key: 'color_code',
        align: 'center'
    },
    {
        title: 'Thời gian bắt đầu bảo ôn',
        dataIndex: 'color_code',
        key: 'color_code',
        align: 'center'
    },
    {
        title: 'Thời gian bảo ôn',
        dataIndex: 'color_code',
        key: 'color_code',
        align: 'center'
    },
];
const columns3 = [
    {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
        align: 'center'
    },
    {
        title: 'Lô sản xuất',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: 'Mã Pallet',
        dataIndex: 'order_quanlity',
        key: 'order_quanlity',
        align: 'center'
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'product_name',
        key: 'product_name',
        align: 'center'
    },
    {
        title: 'Mã hàng',
        dataIndex: 'product_code',
        key: 'product_code',
        align: 'center'
    },
    {
        title: 'TG bắt đầu (KH)',
        dataIndex: 'time_require_complete',
        key: 'time_require_complete',
        align: 'center'
    },
    {
        title: 'TG kết thúc (KH)',
        dataIndex: 'time_require_complete',
        key: 'time_require_complete',
        align: 'center'
    },
    {
        title: 'TG bắt đầu (TT)',
        dataIndex: 'time_require_complete',
        key: 'time_require_complete',
        align: 'center'
    },
    {
        title: 'TG kết thúc (TT)',
        dataIndex: 'time_require_complete',
        key: 'time_require_complete',
        align: 'center'
    },
    {
        title: 'SL đầu vào (KH)',
        dataIndex: 'paper_type',
        key: 'paper_type',
        align: 'center'
    },
    {
        title: 'SL đầu ra (KH)',
        dataIndex: 'bowl_quanlity',
        key: 'bowl_quanlity',
        align: 'center'
    },
    {
        title: 'SL đầu vào (TT)',
        dataIndex: 'color_code',
        key: 'color_code',
        align: 'center'
    },
    {
        title: 'SL đầu ra (TT)',
        dataIndex: 'color_code',
        key: 'color_code',
        align: 'center',

    },
    {
        title: 'SL đầu ra (TT OK)',
        dataIndex: 'color_code',
        key: 'color_code',
        align: 'center',
    },
    {
        title: 'SL tem vàng',
        dataIndex: 'color_code',
        key: 'color_code',
        align: 'center',
        className: 'yellow'
    },
    {
        title: 'Số lượng NG',
        dataIndex: 'quantity_NG',
        key: 'quantity_NG',
        align: 'center',
        className: 'red'
    },
    {
        title: 'Tỉ lệ H.Thành T.Tế',
        dataIndex: 'actual_completed_rate',
        key: 'actual_completed_rate',
        align: 'center',
    },
];


const Manufacture = (props) => {
    document.title = "Sản xuất";
    const { line } = useParams();
    const history = useHistory();
    const [resultQR, setResultQr] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isScan, setIsScan] = useState(0);
    useEffect(() => {
        if (isScan === 1) {
            setIsModalOpen(true);
        } else if (isScan === 2) {
            setIsModalOpen(false);
        }
    }, [isScan])
    const options = [
        {
            label: 'Bảo ôn',
            value: 'bao-on',
        },
        {
            label: 'In',
            value: 'in',
        },
        {
            label: 'Phủ',
            value: 'phu',
        },
        {
            label: 'Bế',
            value: 'be',
        },
        {
            label: 'Bóc',
            value: 'boc',
        },
        {
            label: 'Gấp dán',
            value: 'gap-dan',
        },
        {
            label: 'Chọn',
            value: 'chon',
        },
        {
            label: 'Kho thành phẩm',
            value: 'kho',
        },
    ];
    
    const [state, setState] = useState(1);
    const onChangeLine = (value) => {
        history.push('/manufacture/' + value)
    }
    useEffect(()=>{
        if(line == undefined){onChangeLine('in')}
    }, [line])
    const onPressScan = () => {
        setIsScan(1);
    }
    const handleCloseMdl = () => {
        setIsScan(2);
    }
    const searchData = [
        { id: 'a', name: 'a' },
        { id: 'hhg', name: 'hhg' },
        { id: 'ggez', name: 'ggez' },
        { id: 'ccc', name: 'ccc' },
        { id: 'luv', name: 'luv' },
        { id: 'jjj', name: 'jjj' },
        { id: 'jk', name: 'jk' },
        { id: 'nani', name: 'nani' },
        { id: 'sup', name: 'sup' },
        { id: 'ok', name: 'ok' },
    ]
    const row1 = [
        {
            title: 'SL KH ngày',
            value: 1000
        },
        {
            title: 'SL T.Tế (OK)',
            value: 1000
        },
        {
            title: 'SL Tem vàng',
            value: 1000,
            bg: '#f7ac27'
        },
        {
            title: 'SL NG',
            value: 1000,
            bg: '#fb4b50'
        },
        {
            title: 'Tỉ lệ hoàn thành (%)',
            value: 1000
        },
    ]
    const row2 = [
        {
            title: 'Mã Pallet',
            value: 1000
        },
        {
            title: 'Tên sản phẩm',
            value: 1000
        },
        {
            title: 'UPH (ấn định)',
            value: 1000
        },
        {
            title: 'UPH (thực tế)',
            value: 1000
        },
        {
            title: 'SL đầu ra (K.hoạch)',
            value: 1000
        },
        {
            title: 'SL đầu ra (T.tế)',
            value: 1000
        },
        {
            title: 'SL đầu ra (T.tế OK)',
            value: 1000
        },
    ]
    return (
        <React.Fragment>
            <Row gutter={4} className='mt-3' style={{ justifyContent: 'space-between' }}>
                {line === 'bao-on' ?
                    <>
                        <Col span={5}>
                            <div style={{ borderRadius: '8px', textAlign: 'center', background: '#fff', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', height: '100%' }} className='d-flex flex-column'>
                                <div style={{ background: '#2462a3', color: '#fff', padding: '8px 0px', borderRadius: '8px 8px 0px 8px', minHeight: 40 }}>
                                    Công đoạn
                                </div>
                                <div style={{ textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center' }}>
                                    <Select placeholder="Chọn công đoạn" style={{ width: '100%' }} value={line} bordered={false} options={options} onChange={onChangeLine} />
                                </div>
                            </div>
                        </Col>
                        <Col span={19}>
                            <ScanButton onPressScan={onPressScan} searchData={searchData} height={60} />
                        </Col>
                    </>
                    :
                    <>
                        <Col span={4}>
                            <div style={{ borderRadius: '8px', textAlign: 'center', background: '#fff', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', height: '100%' }} className='d-flex flex-column'>
                                <div style={{ background: '#2462a3', color: '#fff', padding: '8px 0px', borderRadius: '8px 8px 0px 8px', minHeight: 40 }}>
                                    Công đoạn
                                </div>
                                <div style={{ textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center' }}>
                                    <Select placeholder="Chọn công đoạn" style={{ width: '100%' }} value={line} bordered={false} options={options} onChange={onChangeLine} />
                                </div>
                            </div>
                        </Col>
                        <Col span={20}>
                            <DataDetail data={row1} />
                        </Col>
                        <Col span={24} className='mt-3'>
                            {line !== 'in-tem-nvl' && <ScanButton onPressScan={onPressScan} searchData={searchData} />}
                        </Col>
                    </>
                }
            </Row>
            {(line === 'in' || line === 'phu') ?
                <Row className='mt-3' gutter={8}>
                    <Col span={20}>
                        <DataDetail data={row2} />
                    </Col>
                    <Col span={4}>
                        <Button type='primary' className='w-100 h-100' size="large">In tem</Button>
                    </Col>
                </Row>

                :
                null
            }
            {line === 'bao-on' &&
                <>
                    <Row className='mt-3'>
                        <Col span={24}>
                            <Table
                                scroll={{
                                    x: 200,
                                    y: 350,
                                }}
                                rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
                                pagination={false}
                                bordered
                                columns={columns1}
                                dataSource={data} />
                        </Col>
                    </Row>
                    <Row className='mt-3'>
                        <Col span={24}>
                            <Table
                                scroll={{
                                    x: 200,
                                    y: 350,
                                }}
                                rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
                                pagination={false}
                                bordered
                                columns={columns2}
                                dataSource={data} />
                        </Col>
                    </Row>
                </>
            }
            {(line === 'in' || line === 'phu') &&
                <Row className='mt-3'>
                    <Col span={24}>
                        <Table
                            scroll={{
                                x: 200,
                                y: 350,
                            }}
                            rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
                            pagination={false}
                            bordered
                            columns={columns3}
                            dataSource={data} />
                    </Col>
                </Row>
            }
            <Modal title="Quét mã QR" open={isModalOpen} onCancel={handleCloseMdl} footer={null}>
                <ScanQR isScan={isScan} onResult={(res) => { setResultQr(res); setIsScan(2) }} />
            </Modal>
        </React.Fragment>
    );
};

export default withRouter(Manufacture);