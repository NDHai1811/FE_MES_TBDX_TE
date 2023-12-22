import { DatePicker, Col, Row, Card, Table, Tag, Layout, Divider, Button, Form, Input, theme, Select, AutoComplete, Upload, message, Checkbox, Space, Modal, Spin, Popconfirm } from 'antd';
import { baseURL } from '../../../config';
import React, { useState, useRef, useEffect } from 'react';
import { createOrder, deleteOrders, exportOrders, getOrders, updateOrder } from '../../../api';

const Orders = () => {
    document.title = "Quản lý đơn hàng"; 
    const [listCheck, setListCheck] = useState([]);
    const [openMdl, setOpenMdl] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form] = Form.useForm();
    const [params, setParams] = useState({});
    const col_detailTable = [
        {
            title: 'Ngày đặt hàng',
            dataIndex: 'ngay_dat_hang',
            key: 'ngay_dat_hang',
            align: 'center',
            fixed: 'left'
        },
        {
            title: 'Khách hàng',
            dataIndex: 'khach_hang',
            key: 'khach_hang',
            align: 'center',
        },
        {
            title: 'Người đặt hàng',
            dataIndex: 'nguoi_dat_hang',
            key: 'nguoi_dat_hang',
            align: 'center',
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: 'mdh',
            key: 'mdh',
            align: 'center',
        },
        {
            title: 'Đơn hàng',
            dataIndex: 'order',
            key: 'order',
            align: 'center',
        },
        {
            title: 'Mã quản lý',
            dataIndex: 'mql',
            key: 'mql',
            align: 'center',
        },
        {
            title: 'Dài',
            dataIndex: 'dai',
            key: 'dai',
            align: 'center',
        },
        {
            title: 'Rộng',
            dataIndex: 'rong',
            key: 'rong',
            align: 'center',
        },
        {
            title: 'Cao',
            dataIndex: 'cao',
            key: 'cao',
            align: 'center',
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: 'mdh',
            key: 'mdh',
            align: 'center',
        },
        {
            title: 'Số lượng',
            dataIndex: 'sl',
            key: 'sl',
            align: 'center',
        },
        {
            title: 'Số lượng giao',
            dataIndex: 'slg',
            key: 'slg',
            align: 'center',
        },
        {
            title: 'Số lượng thực',
            dataIndex: 'slt',
            key: 'slt',
            align: 'center',
        },
        {
            title: 'TMO',
            dataIndex: 'tmo',
            key: 'tmo',
            align: 'center',
        },
        {
            title: 'PO',
            dataIndex: 'po',
            key: 'po',
            align: 'center',
        },
        {
            title: 'Style',
            dataIndex: 'style',
            key: 'style',
            align: 'center',
        },
        {
            title: 'Style no',
            dataIndex: 'style_no',
            key: 'style_no',
            align: 'center',
        },
        {
            title: 'Màu',
            dataIndex: 'color',
            key: 'color',
            align: 'center',
        },
        {
            title: 'Item',
            dataIndex: 'item',
            key: 'item',
            align: 'center',
        },
        {
            title: 'RM',
            dataIndex: 'rm',
            key: 'rm',
            align: 'center',
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            align: 'center',
        },
        {
            title: 'Ghi chú 1',
            dataIndex: 'note_1',
            key: 'note_1',
            align: 'center',
        },
        {
            title: 'Hạn giao',
            dataIndex: 'han_giao',
            key: 'han_giao',
            align: 'center',
        },
        {
            title: 'Ghi chú 2',
            dataIndex: 'note_2',
            key: 'note_2',
            align: 'center',
        }
    ]
    const formFields = [
        {
            title: 'Ngày đặt hàng',
            dataIndex: 'ngay_dh',
            key: 'ngay_dh',
            align: 'center',
            fixed: 'left'
        },
        {
            title: 'Khách hàng',
            dataIndex: 'khach_hang',
            key: 'khach_hang',
            align: 'center',
        },
        {
            title: 'Người đặt hàng',
            dataIndex: 'nguoi_dh',
            key: 'nguoi_dh',
            align: 'center',
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: 'mdh',
            key: 'mdh',
            align: 'center',
        },
        {
            title: 'Đơn hàng',
            dataIndex: 'order',
            key: 'order',
            align: 'center',
        },
        {
            title: 'Mã quản lý',
            dataIndex: 'mql',
            key: 'mql',
            align: 'center',
        },
        {
            title: 'Dài',
            dataIndex: 'l',
            key: 'l',
            align: 'center',
        },
        {
            title: 'Rộng',
            dataIndex: 'w',
            key: 'w',
            align: 'center',
        },
        {
            title: 'Cao',
            dataIndex: 'h',
            key: 'h',
            align: 'center',
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: 'mdh',
            key: 'mdh',
            align: 'center',
        },
        {
            title: 'Số lượng',
            dataIndex: 'sl',
            key: 'sl',
            align: 'center',
        },
        {
            title: 'Số lượng giao',
            dataIndex: 'slg',
            key: 'slg',
            align: 'center',
        },
        {
            title: 'Số lượng thực',
            dataIndex: 'slt',
            key: 'slt',
            align: 'center',
        },
        {
            title: 'TMO',
            dataIndex: 'tmo',
            key: 'tmo',
            align: 'center',
        },
        {
            title: 'PO',
            dataIndex: 'po',
            key: 'po',
            align: 'center',
        },
        {
            title: 'Style',
            dataIndex: 'style',
            key: 'style',
            align: 'center',
        },
        {
            title: 'Style no',
            dataIndex: 'style_no',
            key: 'style_no',
            align: 'center',
        },
        {
            title: 'Màu',
            dataIndex: 'color',
            key: 'color',
            align: 'center',
        },
        {
            title: 'Item',
            dataIndex: 'item',
            key: 'item',
            align: 'center',
        },
        {
            title: 'RM',
            dataIndex: 'rm',
            key: 'rm',
            align: 'center',
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            align: 'center',
        },
        {
            title: 'Dot',
            dataIndex: 'dot',
            key: 'dot',
            align: 'center',
        },
        {
            title: 'Fac',
            dataIndex: 'fac',
            key: 'fac',
            align: 'center',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'ghi_chu',
            key: 'ghi_chu',
            align: 'center',
        },
        {
            title: 'Hạn giao',
            dataIndex: 'han_giao',
            key: 'han_giao',
            align: 'center',
        },
        {
            title: 'Ngày giao',
            dataIndex: 'ngay_giao',
            key: 'ngay_giao',
            align: 'center',
        },
        {
            title: 'Ghi chú 2',
            dataIndex: 'ghi_chu_2',
            key: 'ghi_chu_2',
            align: 'center',
        },
        {
            title: 'Xe giao',
            dataIndex: 'xe_giao',
            key: 'xe_giao',
            align: 'center',
        },
        {
            title: 'Xuất hàng',
            dataIndex: 'xuat_hang',
            key: 'xuat_hang',
            align: 'center',
        },
    ]

    function btn_click() {
        loadListTable(params)
    }

    const [data, setData] = useState([]);
    const loadListTable = async (params) => {
        setLoading(true)
        const res = await getOrders(params);
        setData(res.map(e=>{
            return {...e, key: e.id}
        }));
        setLoading(false);
    }
    useEffect(() => {
        (async () => {
            loadListTable(params);
        })()
    }, [])

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

    const onFinish = async (values) => {
        console.log(values);
        if(isEdit){
            const res = await updateOrder(values);
            console.log(res);
            if(res){
                form.resetFields();
                setOpenMdl(false);
                loadListTable(params);
            }
        }else{
            const res = await createOrder(values);
            console.log(res);
            if(res){
                form.resetFields();
                setOpenMdl(false);
                loadListTable(params);
            }
        }
    }

    const deleteRecord = async () => {
        if (listCheck.length > 0) {
            const res = await deleteOrders(listCheck);
            setListCheck([]);
            loadListTable(params);
        } else {
            message.info('Chưa chọn bản ghi cần xóa')
        }
    }
    const editRecord = () => {
        setIsEdit(true)
        if (listCheck.length !== 1) {
            message.info('Chọn 1 bản ghi để chỉnh sửa');
        } else {
            const result = data.find((record) => record.id === listCheck[0]);
            form.setFieldsValue({...result});
            setOpenMdl(true);
        }
    }
    const insertRecord = () => {
        setIsEdit(false)
        form.resetFields();
        setOpenMdl(true);
    }
    const [loadingExport, setLoadingExport] = useState(false);
    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const exportFile = async () =>{
        setExportLoading(true);
        const res = await exportOrders(params);
        if(res.success){
            window.location.href = baseURL+res.data;
        }
        setExportLoading(false);
    }
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setListCheck(selectedRowKeys)
        },
    };
    return <>
        {contextHolder}
        <Row style={{ padding: '8px', height: '90vh' }} gutter={[8, 8]}>
                <Col span={3}>
                    <Card style={{ height: '100%' }} bodyStyle={{padding:0}}>
                    <Divider>Tìm kiếm</Divider>
                    <div className='mb-3'>
                        <Form style={{ margin: '0 15px' }} layout="vertical" onFinish={btn_click}>
                            <Form.Item label="Mã lỗi" className='mb-3'>
                                <Input allowClear onChange={(e)=>setParams({...params, id: e.target.value})} placeholder='Nhập mã'/>
                            </Form.Item>
                            <Form.Item label="Code" className='mb-3'>
                                <Input allowClear onChange={(e)=>setParams({...params, code: e.target.value})} placeholder='Nhập tên'/>
                            </Form.Item>
                            <Form.Item style={{textAlign:'center'}}>
                                <Button type='primary' htmlType='submit'
                                    style={{ width: '80%' }}>
                                    Tìm kiếm
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                    </Card>
                </Col>
                <Col span={21}>
                    <Card style={{ height: '100%' }} title="Quản lý đơn hàng" extra={
                        <Space>
                            <Upload
                                showUploadList={false}
                                name='files'
                                action={baseURL + "/api/orders/import"}
                                headers={{
                                    authorization: 'authorization-text',
                                }}
                                onChange={(info) => {
                                    setLoadingExport(true);
                                    if (info.file.status === 'error') {
                                            setLoadingExport(false);
                                            error()
                                    } else if (info.file.status === 'done') {
                                            if (info.file.response.success === true) {
                                                loadListTable(params);
                                                success();
                                                setLoadingExport(false);
                                            } else {
                                                loadListTable(params);
                                                message.error(info.file.response.message);
                                                setLoadingExport(false);
                                            }
                                    }
                                }}
                            >
                                <Button style={{ marginLeft: '15px' }} type="primary" loading={loadingExport}>
                                    Upload Excel
                                </Button>
                            </Upload>
                            <Button type="primary" onClick={exportFile} loading={exportLoading}>Export Excel</Button>
                            <Button type="primary" onClick={editRecord} disabled={listCheck.length <= 0}>Edit</Button>
                            <Button type="primary" onClick={insertRecord}>Insert</Button>
                            <Popconfirm
                                title="Xoá bản ghi"
                                description={"Bạn có chắc xoá "+listCheck.length+" bản ghi đã chọn?"}
                                onConfirm={deleteRecord}
                                okText="Có"
                                cancelText="Không"
                                placement="bottomRight"
                            >
                                <Button type="primary" disabled={listCheck.length <= 0}>Delete</Button>
                            </Popconfirm>
                            
                        </Space>
                    }>
                        <Spin spinning={loading}>
                        <Table size='small' bordered
                            pagination={{position: ['bottomRight']}}
                            scroll={
                                {
                                    x: '130vw',
                                    y: '80vh'
                                }
                            }
                            columns={col_detailTable}
                            dataSource={data} 
                            rowSelection={rowSelection}/>
                        </Spin>
                    </Card>
                </Col>
        </Row>
        <Modal title={isEdit ? 'Cập nhật' : 'Thêm mới'} open={openMdl} onCancel={() => setOpenMdl(false)} footer={null} width={800}>
            <Form style={{ margin: '0 15px' }}
                layout="vertical"
                form={form}
                onFinish={onFinish}>
                <Row gutter={[16, 16]}>
                    {formFields.map(e=>{
                        if(e.key !== 'select' && e.key !== 'stt'){
                            if(e?.children?.length > 0){
                                return e.children.map((c, index)=>{
                                    return <Col span={!c.hidden ? 12 / e.children.length : 0}>
                                            <Form.Item name={[e.key, c.key]} className='mb-3' label={e.title + " - " + c.title} hidden={c.hidden} rules={[{required: c.required}]}>
                                                {!c.isTrueFalse ?
                                                    <Input disabled={c.disabled || (isEdit && c.key === 'id')}></Input>
                                                    :
                                                    <Select>
                                                        <Select.Option value={1}>Có</Select.Option>
                                                        <Select.Option value={0}>Không</Select.Option>
                                                    </Select>
                                                }
                                            </Form.Item>
                                        </Col>
                                    }
                                )
                            }else{
                                return <Col span={!e.hidden ? 12 : 0}>
                                    <Form.Item name={e.key} className='mb-3' label={e.title} hidden={e.hidden} rules={[{required: e.required}]}>
                                        {!e.isTrueFalse ?
                                            <Input disabled={e.disabled || (isEdit && e.key === 'id')}></Input>
                                            :
                                            <Select>
                                                <Select.Option value={1}>Có</Select.Option>
                                                <Select.Option value={0}>Không</Select.Option>
                                            </Select>
                                        }
                                    </Form.Item>
                                </Col>
                            }
                        }
                        
                    })}
                </Row>
                <Form.Item className='mb-0'>
                    <Button type="primary" htmlType='submit' >Lưu lại</Button>
                </Form.Item>
            </Form>
        </Modal>
    </>
}

export default Orders;
