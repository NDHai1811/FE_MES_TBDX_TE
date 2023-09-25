import { useState, useEffect } from 'react';
import { DatePicker, Col, Row, Card, Table, Tag, Layout, Divider, Button, Form, Input, theme, Select, AutoComplete, Space, Spin, Dropdown, message } from 'antd';
import { Pie, Column } from '@ant-design/charts';
import { exportBMCardWarehouse, exportSummaryWarehouse, getHistoryWareHouse } from '../../../api';
import { exportWarehouse } from '../../../api/ui/export';
import { baseURL } from '../../../config';
import dayjs from "dayjs";
import { getCustomers, getDataFilterUI, getProducts } from '../../../api/ui/main';

const { Sider } = Layout;
const { RangePicker } = DatePicker;

const col_detailTable = [
    {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
        render: (value, record, index) => index + 1,
        align: 'center'
    },
    {
        title: 'Ngày',
        dataIndex: 'ngay',
        key: 'ngay',
        align: 'center'
    },
    {
        title: 'Mã khách hàng',
        dataIndex: 'ma_khach_hang',
        key: 'ma_khach_hang',
        align: 'center'
    },
    {
        title: 'Tên khách hàng',
        dataIndex: 'ten_khach_hang',
        key: 'ten_khach_hang',
        align: 'center'
    }, {
        title: 'Mã hàng',
        dataIndex: 'product_id',
        key: 'product_id',
        align: 'center'
    }, {
        title: 'Tên SP',
        dataIndex: 'ten_san_pham',
        key: 'name_product',
        align: 'center'
    }, {
        title: 'ĐVT',
        dataIndex: 'dvt',
        key: 'dvt',
        align: 'center'
    }, {
        title: 'Lô SX',
        dataIndex: 'lo_sx',
        key: 'lo_sx',
        align: 'center'
    }, {
        title: 'Kho',
        dataIndex: 'kho',
        key: 'kho',
        align: 'center'
    },
    {
        title: 'Mã thùng',
        dataIndex: 'lot_id',
        key: 'lot_id',
        align: 'center'
    },
    {
        title: 'Vị trí',
        dataIndex: 'vi_tri',
        key: 'vi_tri',
        align: 'center'
    },
    {
        title: 'Nhập kho',
        children: [
            {
                title: 'Ngày nhập',
                dataIndex: 'ngay_nhap',
                key: 'ngay_nhap',
                align: 'center'
            },
            {
                title: 'Số lượng',
                dataIndex: 'so_luong_nhap',
                key: 'so_luong_nhap',
                align: 'center'
            },
            {
                title: 'Người nhập',
                dataIndex: 'nguoi_nhap',
                key: 'nguoi_nhap',
                align: 'center'
            }
        ]
    },
    {
        title: 'Xuất kho',
        children: [
            {
                title: 'Ngày xuất',
                dataIndex: 'ngay_xuat',
                key: 'ngay_xuat',
                align: 'center'
            },
            {
                title: 'Số lượng',
                dataIndex: 'so_luong_xuat',
                key: 'so_luong_xuat',
                align: 'center'
            },
            {
                title: 'Người xuất',
                dataIndex: 'nguoi_xuat',
                key: 'nguoi_xuat',
                align: 'center'
            }
        ]
    },
    {
        title: 'Tồn kho',
        width: '10%',
        children: [
            {
                title: 'Số lượng',
                dataIndex: 'ton_kho',
                key: 'ton_kho',
                align: 'center'
            },
            {
                title: 'Số ngày tồn kho',
                dataIndex: 'so_ngay_ton',
                key: 'so_ngay_ton',
                align: 'center'
            },
        ]
    },
    {
        title: 'Ghi chú',
        dataIndex: 'note',
        key: 'note',
        align: 'center'
    },
]

const ThanhPhamGiay = (props) => {
    document.title = "UI - Quản lý thành phẩm giấy";
    const [dataTable, setDataTable] = useState([]);
    const [params, setParams] = useState({date: [dayjs(), dayjs()]});
    const [listCustomers, setListCustomers] = useState([]);
    const [listIdProducts, setListIdProducts] = useState([]);
    const [listNameProducts, setListNameProducts] = useState([]);
    const [listLoSX, setListLoSX] = useState([]);
    useEffect(() => {
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
        })()
        btn_click();
    }, [])

    useEffect(()=>{
        (async ()=>{
            var res = await getDataFilterUI({khach_hang: params.khach_hang});
            if(res.success){
                setListNameProducts(res.data.product.map(e => {
                        return { ...e, label: e.name, value: e.id }
                }));
                setListLoSX(Object.values(res.data.lo_sx).map(e => {
                        return { label: e, value: e }
                }));
            }
        })()
    }, [params.khach_hang])

    const [exportLoading, setExportLoading] = useState(false);
    const exportFile = async () => {
        setExportLoading(true);
        const res = await exportWarehouse(params);
        if (res.success) {
            window.location.href = baseURL + res.data;
        }
        setExportLoading(false);
    }
    async function btn_click(){
        setLoading(true)
        const res = await getHistoryWareHouse(params);
        setDataTable(res);
        setLoading(false);
    }
    const [loading, setLoading] = useState(false);
    const [exportLoading1, setExportLoading1] = useState(false)
    const items = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" onClick={exportImportWarehouse}>
                Tổng hợp xuất nhập tồn
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" onClick={exportBMcard}>
                BM thẻ kho
                </a>
            ),
        },
    ];
    const [messageApi, contextHolder] = message.useMessage();
    async function exportImportWarehouse(){
        setExportLoading1(true);
        var res = await exportSummaryWarehouse(params);
        if (res.success) {
            window.location.href = baseURL + res.data;
        }
        setExportLoading1(false);
    }
    async function exportBMcard(){
        if(!params.ten_sp){
            messageApi.warning('Hãy chọn sản phẩm trước');
        }else{
            setExportLoading1(true);
            var res = await exportBMCardWarehouse(params);
            if (res.success) {
                window.location.href = baseURL + res.data;
            }
            setExportLoading1(false);
        }
    }
    return <>
        {contextHolder}
        <Row style={{ padding: '8px', height: '90vh' }} gutter={[8, 8]}>
            <Col span={3}>
                <Card style={{ height: '100%' }} bodyStyle={{paddingInline:0}}>
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
                        {/* <Form.Item label="Chức năng truy vấn" className='mb-3'>
                            <Select
                                defaultValue="1"
                                options={[{ value: '1', label: 'Nhập - Xuất - Tồn' },
                                { value: '2', label: 'Nhập' },
                                { value: '3', label: 'Xuất' },
                                { value: '3', label: 'Tồn' },
                                { value: '3', label: 'Tồn lâu' },
                                ]}
                            />
                        </Form.Item> */}
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
                        <Form.Item label="Lô Sản xuất" className='mb-3'>
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
                        </Form.Item>
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
                </Card>
            </Col>
            <Col span={21}>
                <Card style={{ height: '100%' }} title="Quản lý thành phẩm giấy" extra={
                    <Space>
                        <Dropdown menu={{ items }}>
                            <Button type='primary' loading={exportLoading1}>Xuất báo cáo</Button>
                        </Dropdown>
                        <Button type='primary' loading={exportLoading} onClick={exportFile}>Xuất excel</Button>
                    </Space>
                }>
                    <Spin spinning={loading}>
                    <Table size='small' bordered
                        pagination={false}
                        scroll={
                            {
                                x: '180vw',
                                y: '80vh'
                            }
                        }
                        columns={col_detailTable}
                        dataSource={dataTable} />
                    </Spin>
                </Card>
            </Col>
        </Row>
    </>
}

export default ThanhPhamGiay;