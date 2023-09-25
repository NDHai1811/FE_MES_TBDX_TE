import React, { useState, useRef, useEffect } from 'react';
import { Layout, Divider, Button, Table, Menu, Card, Checkbox, DatePicker, Form, Input, Upload, message, Select, AutoComplete, Row, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/plots';
import "../style.scss";
import { baseURL } from '../../../config';
import { deleteWareHouseExport, getListLot, getListWarehouseExportPlan, store, testUpdateTable } from '../../../api';
import UISidebar from '../components/Sidebar';
import { useHistory, useParams, withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import EditableTable from '../../../components/Table/EditableTable';
import dayjs from "dayjs";
import { getCustomers, getDataFilterUI, getProducts } from '../../../api/ui/main';
const { RangePicker } = DatePicker;

const { Sider } = Layout;
const WarehouseExportPlan = (props) => {
    document.title = "UI - Kế hoạch xuất kho";
    const [data, setData] = useState([]);
    const [listCheck, setListCheck] = useState([]);
    const [listCustomers, setListCustomers] = useState([]);
    const [listIdProducts, setListIdProducts] = useState([]);
    const [listNameProducts, setListNameProducts] = useState([]);
    const [params, setParams] = useState({date: [dayjs(),dayjs()]});
    const onChangeChecbox = (e) => {
        if (e.target.checked) {
            if (!listCheck.includes(e.target.value)) {
                setListCheck(oldArray => [...oldArray, e.target.value]);
            }
        } else {
            if (listCheck.includes(e.target.value)) {
                setListCheck(oldArray => oldArray.filter((datainput) => datainput !== e.target.value))
            }
        }
    }

    useEffect(()=>{
        (async ()=>{
            var res = await getDataFilterUI({khach_hang: params.khach_hang});
            if(res.success){
                setListNameProducts(res.data.product.map(e => {
                        return { ...e, label: e.name, value: e.id }
                }));
                // setListLoSX(Object.values(res.data.lo_sx).map(e => {
                //         return { label: e, value: e }
                // }));
            }
        })()
    }, [params.khach_hang])

    const deleteRecord = async () => {
        if (listCheck.length > 0) {
            const res = await deleteWareHouseExport(listCheck);
            setListCheck([]);
            loadListTable();
        } else {
            message.info('Chưa chọn bản ghi cần xóa')
        }
    }
    
    const columns = [
        {
            title: 'Chọn',
            dataIndex: 'name1',
            key: 'name1',
            align: 'center',
            render: (value, item, index) => <Checkbox value={item.id} onChange={onChangeChecbox} checked={listCheck.includes(item.id) ? true : false} ></Checkbox>
        },
        {
            title: 'Khách hàng',
            dataIndex: 'khach_hang',
            key: 'khach_hang',
            align: 'center',
            editable: true
        },
        {
            title: 'Ngày xuất hàng',
            dataIndex: 'ngay_xuat_hang',
            key: 'ngay_xuat_hang',
            align: 'center',
            // editable: true,
        },
        {
            title: 'Số lượng nợ đơn hàng',
            align: 'center',
            children: [{
                title: 'Mã hàng',
                dataIndex: 'product_id',
                key: 'product_id',
                align: 'center',
            }, {
                title: 'Tên sản phẩm',
                dataIndex: 'ten_san_pham',
                key: 'ten_san_pham',
                align: 'center',
            }, {
                title: 'PO pending',
                dataIndex: 'po_pending',
                key: 'po_pendding',
                align: 'center',
            }, {
                title: 'SL yêu cầu giao',
                dataIndex: 'sl_yeu_cau_giao',
                key: 'sl_yeu_cau_giao',
                align: 'center',
            }],
            key: 'abc'
        },
        {
            title: 'ĐVT',
            dataIndex: 'dvt',
            key: 'dvt',
            align: 'center',
        },
        {
            title: 'Tổng kg',
            dataIndex: 'tong_kg',
            key: 'tong_kg',
            align: 'center',
        },
        {
            title: 'Quy cách đóng thùng/bó',
            dataIndex: 'quy_cach',
            key: 'quy_cach',
            align: 'center',
        },
        {
            title: 'SL thùng chẵn',
            dataIndex: 'sl_thung_chan',
            key: 'sl_thung_chan',
            align: 'center',
        },
        {
            title: 'Số lượng hàng lẻ',
            dataIndex: 'sl_hang_le',
            key: 'sl_hang_le',
            align: 'center',
        },
        {
            title: 'Tồn kho',
            dataIndex: 'ton_kho',
            key: 'ton_kho',
            align: 'center',
        },
        {
            title: 'Xác nhận SX',
            dataIndex: 'xac_nhan_sx',
            key: 'xac_nhan_sx',
            align: 'center',
        },
        {
            title: 'SL thực xuất',
            dataIndex: 'sl_thuc_xuat',
            key: 'sl_thuc_xuat',
            align: 'center',
        },
        // {
        //     title: 'SL chênh lệch',
        //     dataIndex: 'sl_chenh_lech',
        //     key: 'sl_chenh_lech',
        // },
        {
            title: 'Cửa xuất hàng',
            dataIndex: 'cua_xuat_hang',
            key: 'cua_xuat_hang',
            align: 'center',
            // editable: true,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'dia_chi',
            key: 'dia_chi',
            align: 'center',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'ghi_chu',
            key: 'ghi_chu',
            align: 'center',
        },
    ];
    const mergedKey = 'khach_hang';
    const mergeColumn = ['khach_hang', 'cua_xuat_hang', 'dia_chi', 'ghi_chu'];
    const mergeValue = mergeColumn.map(e=>{return {key: e, set: new Set()}});
    useEffect(()=>{
        mergeValue.map(e=>{return {key: e, set: new Set()}});
        (async ()=>{
            var res1 = await getCustomers();
            setListCustomers(res1.data.map(e => {
                return { ...e, label: e.name, value: e.id }
            }));
            // var res2 = await getProducts();
            // setListIdProducts(res2.data.map(e => {
            //     return { ...e, label: e.id, value: e.id }
            // }));
            // setListNameProducts(res2.data.map(e => {
            //     return { ...e, label: e.name, value: e.id }
            // }));
        })();
    }, [])
    useEffect(()=>{
        console.log(listCheck);
    }, [listCheck])
    const isEditing = (col, record) => {
        return (col.editable === true && listCheck.includes(record.id));
    };
    const customColumns = columns.map(e=>{
        if(mergeColumn.includes(e.dataIndex)){
            return {
                ...e,
                onCell: (record) => {
                    const props = {
                        record,
                        ...e,
                        editable: isEditing(e, record),
                        handleSave,
                    }
                    const set = mergeValue.find(s=>s.key === e.dataIndex)?.set;
                    if (set?.has(record[mergedKey])) {
                        return { rowSpan: 0, ...props };
                    } else {
                        const rowCount = data.filter((data) => data[mergedKey] === record[mergedKey]).length;
                        set?.add(record[mergedKey]);
                        return { rowSpan: rowCount, ...props };
                    }
                },
            }
        }else{
            return {
                ...e,
                onCell: (record) => {
                    const props = {
                        record,
                        ...e,
                        editable: isEditing(e, record),
                        handleSave,
                    }
                    return props;
                },
            }
        }
    })
    const handleSave = async (row) =>{
        // var res = await testUpdateTable(row);
        // console.log(res);
        setData(prev=>prev.map(e=>{
            if(e.id === row.id){
                return row;
            }else{
                return e;
            }
        }))
    }
    const loadListTable = async () => {
        const res = await getListWarehouseExportPlan(params);
        setData(res);
    }
    useEffect(() => {
        (async () => {
            loadListTable();
        })()
    }, [])
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

    const btn_click = () =>{
        loadListTable()
    }
    return (
        <React.Fragment>
            {contextHolder}
            <Sider style={{ backgroundColor: 'white', height: '100vh', overflow: 'auto', float: 'left', paddingTop: '15px' }}>
                <Divider>Thời gian truy vấn</Divider>
                <div className='mb-3'>
                    <Form style={{ margin: '0 15px' }} layout="vertical">
                        {/* <RangePicker placeholder={["Bắt đầu", "Kết thúc"]} /> */}
                        <Space direction='vertical' style={{width:'100%'}}>
                            <DatePicker allowClear={false} placeholder='Bắt đầu' style={{width:'100%'}} onChange={(value)=>setParams({...params, date: [value, params.date[1]]})} value={params.date[0]}/>
                            <DatePicker allowClear={false} placeholder='Kết thúc' style={{width:'100%'}} onChange={(value)=>setParams({...params, date: [params.date[0], value]})} value={params.date[1]}/>
                        </Space>
                    </Form>
                </div>
                <Divider>Điều kiện truy vấn</Divider>
                <div className='mb-3'>
                    <Form style={{ margin: '0 15px' }} layout="vertical">
                        <Form.Item label="Khách hàng" className='mb-3'>
                            <Select
                                allowClear
                                showSearch
                                placeholder="Chọn khách hàng"
                                onChange={(value)=>setParams({...params, khach_hang: value})}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={listCustomers}
                                />
                        </Form.Item>
                        <Form.Item label="Tên sản phẩm" className='mb-3'>
                            <Select
                                allowClear
                                showSearch
                                onChange={(value)=>{
                                    setParams({...params, ten_sp: value})
                                }}
                                placeholder="Nhập tên sản phẩm"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={listNameProducts}
                                />
                        </Form.Item>
                        {/* <Form.Item label="Lô Sản xuất" className='mb-3'>
                            <Select
                                allowClear
                                showSearch
                                placeholder="Nhập lô sản xuất"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={(value)=>{
                                    setParams({...params, lo_sx: value})
                                }}
                                options={listLoSX}
                                />
                        </Form.Item> */}
                    </Form>
                </div>
                <div style={
                    {
                        padding: '10px',
                        textAlign: 'center'
                    }
                }
                    layout="vertical">
                    <Button type='primary' onClick={btn_click}
                        style={
                            { width: '80%' }
                        }>Truy vấn</Button>
                </div>
            </Sider>
            <Row style={{ padding: '8px', height: '100vh' }} gutter={[8, 8]}>
                <Card title="UI kế hoạch xuất kho" extra={
                    <Space>
                        <Upload
                            showUploadList={false}
                            name='file'
                            action={baseURL + "/api/upload-ke-hoach-xuat-kho"}
                            headers={{
                                authorization: 'authorization-text',
                            }}
                            onChange={(info) => {
                                setLoading(true);
                                if (info.file.status === 'error') {
                                    error();
                                    setLoading(false)
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
                        <Button type="primary">Edit</Button>
                        <Button type="primary">Insert</Button>
                    </Space>
                }
                style={{width:'100%'}}
                >
                    <EditableTable
                    bordered
                    columns={customColumns}
                    dataSource={data}
                    scroll={
                        {
                            x: '200vw',
                            y: '55vh',
                        }
                    }
                    pagination={false}
                    size='small'
                    setDataSource={setData}
                    onEditEnd={()=>null}/>
                    {/* <Table bordered columns={columns} dataSource={data} pagination={false} size='small'
                        scroll={
                            {
                                x: '150vw',
                                y: '55vh',
                            }
                        } /> */}
                </Card>
            </Row>
        </React.Fragment>
    );
};

export default WarehouseExportPlan;