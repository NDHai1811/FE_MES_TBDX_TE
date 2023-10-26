import { DatePicker, Col, Row, Card, Table, Tag, Layout, Divider, Button, Form, Input, theme, Select, AutoComplete, Upload, message, Checkbox, Space, Modal, Spin, Popconfirm } from 'antd';
import { baseURL } from '../../../config';
import React, { useState, useRef, useEffect } from 'react';
import { createErrors, deleteErrors, exportErrors, getErrors, updateErrors } from '../../../api';

const Errors = () => {
    document.title = "Quản lý lỗi"; 
    const [listCheck, setListCheck] = useState([]);
    const [openMdl, setOpenMdl] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form] = Form.useForm();
    const [params, setParams] = useState({});
    const col_detailTable = [
        {
            title: 'Mã lỗi ',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            fixed: 'left'
        },
        {
            title: 'Nội dung',
            dataIndex: 'noi_dung',
            key: 'noi_dung',
            align: 'center',
        },
        {
            title: 'Công đoạn',
            dataIndex: 'line',
            key: 'line',
            align: 'center',
            render: (value, item, index) => value?.name,
        },
        {
            title: 'Nguyên nhân',
            dataIndex: 'nguyen_nhan',
            key: 'nguyen_nhan',
            align: 'center',
        },
        {
            title: 'Khắc phục',
            dataIndex: 'khac_phuc',
            key: 'khac_phuc',
            align: 'center',
        },
        {
            title: 'Phòng ngừa',
            dataIndex: 'phong_ngua',
            key: 'phong_ngua',
            align: 'center',
        },
    ]
    const formFields = [
        {
            title: 'Mã lỗi ',
            key: 'id',
            required: true
        },
        {
            title: 'Nội dung',
            key: 'noi_dung',
            required: true
        },
        {
            title: 'Công đoạn',
            key: 'line',
            required: true
        },
        {
            title: 'Nguyên nhân',
            key: 'nguyen_nhan',
            required: true
        },
        {
            title: 'Khắc phục',
            key: 'khac_phuc',
            required: true
        },
        {
            title: 'Phòng ngừa',
            key: 'phong_ngua',
            required: true
        },
    ]

    function btn_click() {
        loadListTable(params)
    }

    const [data, setData] = useState([]);
    const loadListTable = async (params) => {
        setLoading(true)
        const res = await getErrors(params);
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
            const res = await updateErrors(values);
            console.log(res);
            if(res){
                form.resetFields();
                setOpenMdl(false);
                loadListTable(params);
            }
        }else{
            const res = await createErrors(values);
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
            const res = await deleteErrors(listCheck);
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
            form.setFieldsValue({...result, line: result?.line?.name});
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
        const res = await exportErrors(params);
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
                        <Form style={{ margin: '0 15px' }} layout="vertical">
                            <Form.Item label="Mã" className='mb-3'>
                                <Input allowClear onChange={(e)=>setParams({...params, id: e.target.value})} placeholder='Nhập mã'/>
                            </Form.Item>
                            <Form.Item label="Tên" className='mb-3'>
                                <Input allowClear onChange={(e)=>setParams({...params, name: e.target.value})} placeholder='Nhập tên'/>
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
                        <Button type='primary'
                            style={{ width: '80%' }} onClick={btn_click}>
                            Tìm kiếm
                        </Button>
                    </div>
                    </Card>
                </Col>
                <Col span={21}>
                    <Card style={{ height: '100%' }} title="Quản lý thông số sản phẩm" extra={
                        <Space>
                            <Upload
                                showUploadList={false}
                                name='files'
                                action={baseURL + "/api/errors/import"}
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
                            pagination={{position: ['topRight', 'bottomRight']}}
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
                        if(e.key !== 'select' && e.key !== 'stt') return <Col span={!e.hidden ? 12 : 0}>
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
                    })}
                </Row>
                <Form.Item className='mb-0'>
                    <Button type="primary" htmlType='submit' >Lưu lại</Button>
                </Form.Item>
            </Form>
        </Modal>
    </>
}

export default Errors;
