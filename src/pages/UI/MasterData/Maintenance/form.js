import { DatePicker, Col, Row, Card, Table, Tag, Layout, Divider, Button, Form, Input, theme, Select, AutoComplete, Upload, message, Checkbox, Space, Modal, Spin, Popconfirm, InputNumber } from 'antd';
import { baseURL } from '../../../../config';
import React, { useState, useRef, useEffect } from 'react';
import dayjs from "dayjs";
import { createMaintenance, deleteMaintenance, exportMaintenance, getListMachine, getMaintenance, getMaintenanceDetail, updateMaintenance } from '../../../../api';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useHistory, useParams } from 'react-router-dom';

const CreateMaintenance = () => {
    document.title = "Bảo trì bảo dưỡng"; 
    const history = useHistory(); 
    const {maintenanceId} = useParams();
    const [openMdl, setOpenMdl] = useState(false);
    const [form] = Form.useForm();
    const [machines, setMachines] = useState([]);

    useEffect(() => {
        (async () => {
            var res = await getListMachine();
            setMachines(res);
            if(maintenanceId){
                var res = await getMaintenanceDetail({id: maintenanceId});
                form.setFieldsValue(res);
                setMaintenanceDetailList(res.detail);
            }
        })()
    }, [])

    const onFinish = async (values) => {
        
        const params = {...values, detail: maintenanceDetailList, delete_detail: deleteDetail};
        var res = null;
        if(!values.id){
            res = await createMaintenance(params);
        }else{
            res = await updateMaintenance(params);
        }
        if(res){
            history.goBack()
        }
    }

    const maintenanceDetailTable = [
        {
            title: 'Tên công việc',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'start_date',
            key: 'start_date',
            align: 'center',
        },
        {
            title: 'Kiểu lặp',
            dataIndex: 'type_repeat',
            key: 'type_repeat',
            align: 'center',
            render: (value)=>{
                switch (value) {
                    case 1:
                        return 'Ngày'
                        break;
                    case 2:
                        return 'Tuần'
                        break;
                    case 3:
                        return 'Tháng'
                        break;
                    case 4:
                        return 'Năm'
                        break;
                    default:
                        return ''
                        break;
                }
            }
        },
        {
            title: 'Chu kỳ',
            dataIndex: 'period',
            key: 'period',
            align: 'center',
        },
        {
            title: 'Loại đánh giá',
            dataIndex: 'type_criteria',
            key: 'type_criteria',
            align: 'center',
            render: (value)=>{
                switch (value) {
                    case 1:
                        return 'OK/NG'
                        break;
                    case 2:
                        return 'Nhập giá trị'
                        break;
                    default:
                        return ''
                        break;
                }
            }
        },
        {
            title: 'Tác vụ',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (value, record, index)=>{
                return <Space wrap style={{justifyContent:'center'}}>
                    <Button size='small' icon={<EditOutlined/>} onClick={()=>updateCategory({...record, index})}>Sửa</Button>
                    <Button size='small' icon={<DeleteOutlined/>} danger onClick={()=>deleteCategory({...record, index})}>Xoá</Button>
                </Space>
            }
        }
    ]
    const [maintenanceDetailList, setMaintenanceDetailList] = useState([]);
    const addCategory = ()=>{
        setIsEditCatehory(false);
        setOpenMdl(true);
        formCategory.resetFields();
    }
    const updateCategory = (record)=>{
        setOpenMdl(true);
        formCategory.setFieldsValue({
            ...record, 
            start_date: dayjs(record.start_date),
        })
        setIsEditCatehory(true);
    }
    const [deleteDetail, setDeleteDetail] = useState([])
    const deleteCategory = (record)=>{
        if(record.id){
            setDeleteDetail([...deleteDetail, record.id])
        }
        setMaintenanceDetailList(prev=>prev.filter((e, index)=>index!==record.index));
    }
    const [isEditCategory, setIsEditCatehory] = useState(false);
    const [formCategory] = Form.useForm();
    const onFinishCategory = (values) =>{
        if(isEditCategory){
            setMaintenanceDetailList(prev=>prev.map((e, index)=>{
                if(index === values.index) {
                    return {...values, start_date: values.start_date.format('YYYY-MM-DD HH:mm:ss')};
                }
                return e;
            }));
            setOpenMdl(false);
        }else{
            setMaintenanceDetailList([...maintenanceDetailList, values])
        }
        formCategory.resetFields();
    }
    
    return <>
        <Row style={{ padding: '8px' }} gutter={[8, 8]}>
            <Card title={'Tạo kế hoạch bảo trì bảo dưỡng'}>
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}>
                    <Form.Item name="id" style={{ display: 'none' }}>
                    </Form.Item>
                    <Row gutter={[16, 16]} >
                        <Col span={12}>
                            <Form.Item name={'name'} className='mb-3' label={'Tên'} rules={[{required: true}]}>
                                <Input placeholder='Nhập tên kế hoạch bảo dưỡng'/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name={'machine_id'} className='mb-3' label={'Thiết bị'} rules={[{required: true}]}>
                                <Select options={machines} placeholder="Chọn thiết bị bảo dưỡng"></Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}><Divider style={{margin: 0}} orientation="left" orientationMargin="0">Hạng mục</Divider></Col>
                        <Col span={24}>
                            <Button type='primary' className='mb-3' style={{float: 'right'}} onClick={addCategory}>Thêm hạng mục</Button>
                            <Table size='small' bordered
                            className='mb-3'
                            pagination={false}
                            scroll={
                                {
                                    x: '100%',
                                    y: '80vh'
                                }
                            }
                            columns={maintenanceDetailTable}
                            dataSource={maintenanceDetailList} />
                        </Col>
                    </Row>
                    <Form.Item className='mb-0'>
                        <Button type="primary" htmlType='submit' style={{float: 'right'}}>Lưu lại</Button>
                    </Form.Item>
                </Form>
            </Card>
            <Modal title={'Hạng mục'} open={openMdl} onCancel={() => setOpenMdl(false)} footer={null} width={800}>
                <Form layout="vertical"
                    form={formCategory}
                    onFinish={onFinishCategory}>
                    <Form.Item name="index" style={{ display: 'none' }}>
                    </Form.Item>
                    <Form.Item name="id" style={{ display: 'none' }}>
                    </Form.Item>
                    <Row gutter={[8,8]}>
                        <Col span={12}>
                            <Form.Item name={'name'} className='mb-3' label={'Tên công việc'} rules={[{required: true}]}>
                                <Input placeholder='Nhập tên công việc'/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name={'start_date'} className='mb-3' label={'Ngày bắt đầu'} rules={[{required: true}]}>
                                <DatePicker style={{ width: '100%' }} placeholder='Chọn ngày bắt đầu' format={'YYYY-MM-DD HH:mm:ss'}/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={'type_repeat'} className='mb-3' label={'Kiểu lặp'} rules={[{required: true}]}>
                                <Select placeholder="Chọn kiểu lặp">
                                    <Select.Option value={1}>Ngày</Select.Option>
                                    <Select.Option value={2}>Tuần</Select.Option>
                                    <Select.Option value={3}>Tháng</Select.Option>
                                    <Select.Option value={4}>Năm</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={'period'} className='mb-3' label={'Chu kỳ lặp'} rules={[{required: true}]}>
                                <InputNumber style={{width: '100%'}} placeholder='Nhập chu kỳ lặp' inputMode='numeric'/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name={'type_criteria'} className='mb-3' label={'Tiêu chí đánh giá'} rules={[{required: true}]}>
                                <Select placeholder="Chọn kiểu đánh giá hạng mục">
                                    <Select.Option value={1}>OK/NG</Select.Option>
                                    <Select.Option value={2}>Nhập giá trị</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Space style={{float: 'right'}}>
                                <Button type='primary' htmlType='submit'>{!isEditCategory ? 'Thêm' : 'OK'}</Button>
                                <Button onClick={()=>setOpenMdl(false)}>Đóng</Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </Row>
    </>
}

export default CreateMaintenance;
