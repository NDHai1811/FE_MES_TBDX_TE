import React, { useEffect, useState } from 'react';
import { CloseOutlined, PrinterOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Row, Col, Button, Table,Spin, Checkbox, Modal } from 'antd';
import DataDetail from '../../../components/DataDetail';
import '../style.scss';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import ScanButton from '../../../components/Button/ScanButton';
import SelectButton from '../../../components/Button/SelectButton';
import { checkMaterialPosition, getInfoPallet, getLineOverall, getLotByMachine, getManufactureOverall, inTem, scanPallet } from '../../../api/oi/manufacture';
import { useReactToPrint } from 'react-to-print';
import Tem from '../../UI/Manufacture/Tem';
import { useRef } from 'react';
import { getListMachine } from '../../../api';

const Manufacture1 = (props) => {
    document.title = "Sản xuất";
    const { machine_id } = useParams();
    const history = useHistory();
    const [options, setOption] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [selectedLot, setSelectedLot] = useState();
    const [listCheck, setListCheck] = useState([]);
    const overallColumns = [
        {
            title: 'KH ca',
            dataIndex: 'kh_ca',
            key: 'kh_ca',
            align: 'center',
            width: (100/4)+'%'
        },
        {
            title: 'Sản lượng',
            dataIndex: 'so_luong',
            key: 'so_luong',
            align: 'center',
            width: (100/4)+'%'
        },
        {
            title: 'HT KH ca',
            dataIndex: 'ht_kh_ca',
            key: 'ht_kh_ca',
            align: 'center',
            width: (100/4)+'%'
        },
        {
            title: 'Phế SX',
            dataIndex: 'phe_sx',
            key: 'phe_sx',
            align: 'center',
            width: (100/4)+'%'
        },
    ]
    const [overall, setOverall] = useState([{kh_ca: 0, so_luong: 0, ht_kh_ca: 0, phe_sx: 0}]);
    const producingColumns = [
        {
            title: 'Số Lot',
            dataIndex: 'lot_id',
            key: 'lot_id',
            align: 'center',
            width: '30%'
        },
        {
            title: 'KH ĐH',
            dataIndex: 'kh_dh',
            key: 'kh_dh',
            align: 'center',
        },
        {
            title: 'Sản lượng',
            dataIndex: 'so_luong',
            key: 'so_luong',
            align: 'center',
        },
        {
            title: 'HT ĐH',
            dataIndex: 'hd_dh',
            key: 'hd_dh',
            align: 'center',
        },
        {
            title: 'Phế SX',
            dataIndex: 'phe_sx',
            key: 'phe_sx',
            align: 'center',
        },
    ]
    useEffect(() => {
        if(machine_id){
            (async () => {
                setLoading(true)
                setOption(await getListMachine());
                setOverall(await getManufactureOverall({machine_id}));
                const listLot = await getLotByMachine({machine_id});
                console.log(listLot);
                setData(listLot.data);
                if(listLot.data.length > 0){
                    checkPosition(listLot.data[0])
                }
                setLoading(false)
            })()
        }
        
    }, [machine_id])

    const onChangeLine = (value) => {
        history.push('/manufacture/' + value)
    }
    const onScan = async (result) => {
        var res = await scanPallet({ lot_id: result, line_id: machine_id });
        if (res.success) {
            const infoPallet = await getInfoPallet({ line_id: machine_id });
            if (infoPallet.success) {
                // setData(infoPallet.data);
            }
        }
    }

    const rowClassName = (record, index) => {
        if(selectedLot?.lot_id === record.lot_id){
            return 'table-row-green';
        }
        if(record.status === 3){
            return 'table-row-pink';
        }  
        if(record.status === 4){
            return 'table-row-grey';
        }  
        return '';
    }
    const onClickRow = (row) => {
        if(row?.lot_id !== selectedLot?.lot_id){
            checkPosition(row)
        }
    }
    const [modal, contextHolder] = Modal.useModal();
    const config = {
        title: 'Đã xảy ra lỗi!',
    };
    const checkPosition = async (record) => {
        var res = await checkMaterialPosition({plan_id: record?.plan_id});
        if(res?.success){
            setSelectedLot(record);
        }else{
            modal.info(config);
        }
    }
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
            var res = await inTem({ lot_id: selectedLot.lot_id, line_id: machine_id });
            if (res.success) {
                console.log(machine_id);
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
                                    cd_thuc_hien: options.find(e => e.value === parseInt(machine_id))?.label,
                                    cd_tiep_theo: machine_id === '22' ? 'Bế' : options[options.findIndex(e=>e.value === parseInt(machine_id))+1]?.label
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
                                cd_thuc_hien: options.find(e => e.value === parseInt(machine_id))?.label,
                                cd_tiep_theo: machine_id === '22' ? 'Bế' : options[options.findIndex(e=>e.value === parseInt(machine_id))+1]?.label
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
    
    return (
        <React.Fragment>
            {contextHolder}
            <Spin spinning={loading}>
                <Row className='mt-3' gutter={[2, 12]}>
                    <Col span={5}>
                        <SelectButton options={options} label="Máy" value={machine_id} onChange={onChangeLine}/>
                    </Col>
                    <Col span={19}>
                        <Table
                            className='custom-table'
                            locale={{emptyText: 'Trống'}}
                            pagination={false}
                            bordered={true}
                            columns={overallColumns}
                            dataSource={overall}
                            size='small'
                        />
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
                        <Table
                            className='custom-table'
                            locale={{emptyText: 'Trống'}}
                            pagination={false}
                            bordered={true}
                            columns={producingColumns}
                            dataSource={selectedLot ? [selectedLot] : []}
                            size='small'
                        />
                    </Col>
                    
                    <Col span={24}>
                        <Table
                            // scroll={{
                            //     x: 200,
                            //     y: 350,
                            // }}
                            size='small'
                            rowClassName={rowClassName}
                            pagination={false}
                            bordered
                            onRow={(record, rowIndex) => {
                                return {
                                    onDoubleClick: (event) => onClickRow(record)
                                };
                            }}
                            className='selectable-table'
                            style={{cursor:'pointer'}}
                            columns={columns}
                            dataSource={data} />
                    </Col>
                </Row>
            </Spin>
        </React.Fragment>
    );
};

export default Manufacture1;