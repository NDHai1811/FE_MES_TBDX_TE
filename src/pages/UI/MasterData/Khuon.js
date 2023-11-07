import { DatePicker, Col, Row, Card, Table, Tag, Layout, Divider, Button, Form, Input, theme, Select, AutoComplete, Upload, message, Checkbox, Space, Modal, Spin, Popconfirm, InputNumber } from 'antd';
import { baseURL } from '../../../config';
import React, { useState, useRef, useEffect } from 'react';
import { createKhuon, deleteKhuon, exportKhuon, getKhuon, updateKhuon } from '../../../api';

const Khuon = () => {
    document.title = "Quản lý khuôn"; 
    const [listCheck, setListCheck] = useState([]);
    const [openMdl, setOpenMdl] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form] = Form.useForm();
    const [params, setParams] = useState({});
    const col_detailTable = [
        {
            title: 'Mã khuôn',
            dataIndex: 'id',
            key: 'id',
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
            title: 'Số Kg',
            dataIndex: 'so_kg',
            key: 'so_kg',
            align: 'center',
        },
        {
            title: 'Máy',
            dataIndex: 'machine',
            key: 'machine',
            align: 'center',
        },
        {
            title: 'Số lượng khuôn (bộ)',
            dataIndex: 'so_luong',
            key: 'so_luong',
            align: 'center',
        },
        {
            title: 'Số mảnh ghép',
            dataIndex: 'so_manh_ghep',
            key: 'so_manh_ghep',
            align: 'center',
        },
        {
            title: 'Ghi chú',
            key: 'ghi_chu',
            dataIndex: 'ghi_chu',
            align: 'center',
        },
    ]
    const formFields = [
        {
            title: 'Mã khuôn',
            key: 'id',
            required: true,
        },
        {
            title: 'Khách hàng',
            key: 'khach_hang',
            required: true,
        },
        {
            title: 'Dài',
            key: 'dai',
            isInputNumber: true
        },
        {
            title: 'Rộng',
            key: 'rong',
            isInputNumber: true
        },
        {
            title: 'Cao',
            key: 'cao',
            isInputNumber: true
        },
        {
            title: 'Số Kg',
            key: 'so_kg',
            isInputNumber: true
        },
        {
            title: 'Máy',
            key: 'machine',
        },
        {
            title: 'Số lượng khuôn (bộ)',
            key: 'so_luong',
            isInputNumber: true
        },
        {
            title: 'Số mảnh ghép',
            key: 'so_manh_ghep',
            isInputNumber: true
        },
        {
            title: 'Ghi chú',
            key: 'ghi_chu',
        },
    ]

    function btn_click() {
        loadListTable(params)
    }

    const [data, setData] = useState([]);
    const loadListTable = async (params) => {
        setLoading(true)
        const res = await getKhuon(params);
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
            const res = await updateKhuon(values);
            console.log(res);
            if(res){
                form.resetFields();
                setOpenMdl(false);
                loadListTable(params);
            }
        }else{
            const res = await createKhuon(values);
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
            const res = await deleteKhuon(listCheck);
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
        const res = await exportKhuon(params);
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
                            <Form.Item label="Mã" className='mb-3'>
                                <Input allowClear onChange={(e)=>setParams({...params, id: e.target.value})} placeholder='Nhập mã'/>
                            </Form.Item>
                            <Form.Item label="Tên" className='mb-3'>
                                <Input allowClear onChange={(e)=>setParams({...params, name: e.target.value})} placeholder='Nhập tên'/>
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
                    <Card style={{ height: '100%' }} title="Quản lý khuôn" extra={
                        <Space>
                            <Upload
                                showUploadList={false}
                                name='files'
                                action={baseURL + "/api/khuon/import"}
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
                            pagination={false}
                            scroll={
                                {
                                    x: '100%',
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
                                                    c.isInputNumber ? <Input disabled={c.disabled || (isEdit && c.key === 'id')}></Input> : <InputNumber inputMode='numeric' min={0}/>
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
                                            !e.isInputNumber ? <Input disabled={e.disabled || (isEdit && e.key === 'id')}></Input> : <InputNumber inputMode='numeric' min={0} style={{width: '100%'}} defaultValue={0}/>
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

export default Khuon;
