import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CloseOutlined, ExclamationCircleOutlined, PrinterOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Layout, Row, Col, Divider, Button, Table, Modal, Select, Steps, Input, Radio, Form, InputNumber, Spin } from 'antd';
import '../style.scss';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import ScanButton from '../../../components/Button/ScanButton';
import SelectButton from '../../../components/Button/SelectButton';
import EditableTable from '../../../components/Table/EditableTable';
import { getInfoPallet, getLine, getPallet, inTem, scanPallet, updatePallet } from '../../../api/oi/manufacture';
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration)
function MyComponent(props) {
    const {record} = props;
    const [time, setTime] = useState(
        record.thoi_gian_bat_dau ?
        record.thoi_gian_xuat_kho_u 
        ? 
        dayjs(record.thoi_gian_xuat_kho_u).diff(dayjs(record.thoi_gian_bat_dau))
        : 
        dayjs().diff(dayjs(record.thoi_gian_bat_dau), 'ms')
        : 0
    );
    var interval;
    useEffect(() => {
        if((record.thoi_gian_bat_dau) && !(record.thoi_gian_xuat_kho_u)){
            interval = setInterval(() => {
                setTime(dayjs().diff(dayjs(record.thoi_gian_bat_dau), 'ms'));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [record.thoi_gian_xuat_kho_u, record.thoi_gian_bat_dau]);
    const totalSeconds = Math.floor(time / 1000)
    const totalMinutes = Math.floor(totalSeconds / 60)
    const totalHours = Math.floor(totalMinutes / 60)
    // return dayjs.duration(time).format('HH:mm:ss')
    return `${("0" + totalHours).slice(-2)}:${("0" + (totalMinutes % 60)).slice(-2)}:${("0" + (totalSeconds % 60)).slice(-2)}`;
}
const columns1 = [
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
        title: 'Mã hàng',
        dataIndex: 'ma_hang',
        key: 'ma_hang',
        align: 'center'
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'ten_sp',
        key: 'ten_sp',
        align: 'center'
    },
    {
        title: 'Số lượng kế hoạch',
        dataIndex: 'sl_ke_hoach',
        key: 'sl_ke_hoach',
        align: 'center'
    },
    {
        title: 'Số lượng/pallet',
        dataIndex: 'dinh_muc',
        key: 'dinh_muc',
        align: 'center'
    },
    {
        title: 'Độ ẩm giấy',
        dataIndex: 'do_am_giay',
        key: 'do_am_giay',
        align: 'center'
    },
    {
        title: 'Thời gian ủ',
        dataIndex: 'thoi_gian_u',
        key: 'thoi_gian_u',
        align: 'center',
        render: (value, record)=> (!value && record) ? <MyComponent record={record}/> : value
    },
];

const Manufacture4 = (props) => {
    document.title = "Sản xuất";
    const [modal, contextHolder] = Modal.useModal();
    const {line} = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isScan, setIsScan] = useState(0);
    const [data, setData] = useState([]);
    const [options, setOption] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [selectedLot, setSelectedLot] = useState();
    useEffect(()=>{
        (async ()=>{
            setLoading(true)
            const lineList = await getLine({type: 'sx'});
            setOption(lineList.success ? lineList.data : [])
            const pallet = await getPallet();
            if(pallet.success){
                setSearchData(pallet.data.map(e=>{
                    return {id: e.ma_pallet, name: e.ma_pallet}
                }))
            }
            const infoPallet = await getInfoPallet({type: 8});
            if(infoPallet.success){
                setData(infoPallet.data.map(e=>{
                    return {...e}
                }))
            }
            setLoading(false)
        })()
    }, [])
    
    useEffect(() => {
        if (isScan === 1) {
            setIsModalOpen(true);
        } else if (isScan === 2) {
            setIsModalOpen(false);
        }
    }, [isScan])
    const onChangeLine = (value) =>{
        history.push('/manufacture/'+value)
    }
    const onScan = async (result) =>{
        if(passedProduct.length > 0){
            var res = await inTem({lot_id: result, line_id: line})
            if(res.success) setPassedProduct([]);
        }else{
            var res = await scanPallet({lot_id: result, line_id: line})
        }
        const infoPallet = await getInfoPallet({type: 8});
        if(infoPallet.success){
            setData(infoPallet.data)
        }
    }
    
    const [passedProduct, setPassedProduct] = useState([]);

    const rowClassName = (record, index) => {
        var status = '';
        if(dayjs().diff(dayjs(record?.thoi_gian_bat_dau), 'h') >= record?.thoi_gian_u_tieu_chuan && record.do_am_giay){
            status = 'table-row-green';
        }
        if(record?.thoi_gian_xuat_kho_u){
            status = 'table-row-grey';
        }
        return 'editable-row ' + status
    }

    const updateData = async(params) => {
        
        var res = await updatePallet(params);
        if(res.success){
            const infoPallet = await getInfoPallet({type: 8});
            if(infoPallet.success){
                setData(infoPallet.data)
            }
        }
    }
  
    const mergeValue = new Set();
    useEffect(() => {
        mergeValue.clear();
    }, []);
    const columns2 = [
        {
            title: 'Lô sản xuất',
            dataIndex: 'lo_sx',
            key: 'lo_sx',
            align: 'center',
        },
        {
            title: 'Mã pallet',
            dataIndex: 'lot_id',
            key: 'lot_id',
            align: 'center'
        },
        {
            title: 'Mã hàng',
            dataIndex: 'ma_hang',
            key: 'ma_hang',
            align: 'center'
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'ten_sp',
            key: 'ten_sp',
            align: 'center'
        },
        {
            title: 'Số lượng/pallet',
            dataIndex: 'dinh_muc',
            key: 'dinh_muc',
            align: 'center'
        },
        {
            title: 'Số lượng kế hoạch',
            dataIndex: 'sl_ke_hoach',
            key: 'sl_ke_hoach',
            align: 'center'
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'thoi_gian_bat_dau',
            key: 'thoi_gian_bat_dau',
            align: 'center',
            render: (value)=>value ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : ''
        },
        {
            title: 'Thời gian ủ',
            dataIndex: 'thoi_gian_u',
            key: 'thoi_gian_u',
            align: 'center',
            render: (value, record)=>(!value && record) ? <MyComponent record={record} setData={setData}/> : value
            
        },
        {
            title: 'Nhiệt độ phòng',
            dataIndex: 'nhiet_do_phong',
            key: 'nhiet_do_phong',
            align: 'center'
        },
        {
            title: 'Độ ẩm phòng',
            dataIndex: 'do_am_phong',
            key: 'do_am_phong',
            align: 'center'
        },
        {
            title: 'Độ ẩm giấy',
            dataIndex: 'do_am_giay',
            key: 'do_am_giay',
            align: 'center',
            render:(value, record)=> !value && !record.thoi_gian_xuat_kho_u && (selectedLot?.lot_id === record?.lot_id) ? 
            <Input
            inputMode='numeric'
            // bordered={false}
            onPressEnter={(event)=>{
                if(!isNaN(event.target.value)){
                    updateData({do_am_giay: event.target.value, lot_id: record.lot_id, line_id: line})
                }
            }}
            onBlur={(event)=>{
                if(!isNaN(event.target.value)){
                    updateData({do_am_giay: event.target.value, lot_id: record.lot_id, line_id: line})
                }
            }}
            style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width:'100%'}}
            /> 
            : 
            value
        },
        {
            title: 'Thời gian xuất kho ủ',
            dataIndex: 'thoi_gian_xuat_kho_u',
            key: 'thoi_gian_xuat_kho_u',
            align: 'center',
            render: (value)=>value ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : ''
        },
        {
            title: 'Số lượng đã xuất',
            dataIndex: 'sl_da_xuat',
            key: 'sl_da_xuat',
            align: 'center',
            editable: true,
        },
        {
            title: 'Số lượng còn lại',
            dataIndex: 'sl_con_lai',
            key: 'sl_con_lai',
            align: 'center',
            editable: true,
        },
    ];
    const onClickRow = (row) => {
        if(dayjs().diff(dayjs(row?.thoi_gian_bat_dau), 'h') >= row?.thoi_gian_u_tieu_chuan && !row?.thoi_gian_xuat_kho_u){
            setSelectedLot(row);
        }
    }

    useEffect(()=>{
        selectedLot && selectedLot?.do_am_giay && setPassedProduct([selectedLot])
    }, [selectedLot])
    return (
            <React.Fragment>
                <Spin spinning={loading}>
                    {contextHolder}
                    <Row className='mt-3' gutter={[12, 12]}>
                        <Col span={4}>
                            <SelectButton value={options.length > 0 && parseInt(line)} options={options} label="Chọn công đoạn" onChange={onChangeLine} />
                        </Col>
                        <Col span={20}>
                            <ScanButton onScan={onScan} searchData={searchData} height={76}/>
                        </Col>
                        <Col span={24}>
                            <Table
                            scroll={{
                                x: 200,
                                y: 350,
                            }}
                            rowClassName={rowClassName}
                            pagination={false}
                            bordered
                            columns={columns1}
                            dataSource={passedProduct} />
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
                            columns={columns2}
                            dataSource={data} />
                        </Col>
                    </Row>
                </Spin>
            </React.Fragment>
    );
};

export default Manufacture4;

