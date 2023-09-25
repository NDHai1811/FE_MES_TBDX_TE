import { Form, Modal, Row, Col, Button, Divider, Radio, Space, InputNumber } from 'antd';
import React, { useState } from 'react';
import './popupStyle.scss'
import ScanButton from '../Button/ScanButton';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useEffect } from 'react';
import { getChecksheetList, scanError, sendResultError } from '../../api/oi/quality';
const QuanLyLoi = (props) => {
    const {line} = useParams();
    const { text, lotId, onSubmit } = props;
    const closeModal = () => {
        setOpen(false);
    }
    const [errorsList, setErrorsList] = useState([]);
    const onScan = async (result) => {
        var res = await scanError({line_id: line, error_id: result});
        if(res.success){
            if(errorsList.every(e=>e?.id?.toLowerCase() !== result?.toLowerCase())){
                console.log(res.data);
                const data = res.data;
                setErrorsList([...errorsList, data])
            }
            
        }
    }
    const [open, setOpen] = useState(false);
    const [isSubmited, setIsSubmited] = useState(false);
    const [form] = Form.useForm();
    const result = Form.useWatch('result', form);
    const onFinish = async (values) =>{
        if(lotId && values){
            values.lot_id = lotId;
            values.line_id = line;
            console.log(values);
            var res = await sendResultError(values);
            setIsSubmited(true)
            closeModal();
            onSubmit();
        }else{
            console.log('khong co pallet');
        }
    }
    useEffect(()=>{
        form.resetFields();
        setErrorsList([])
        setIsSubmited(false);
    }, [line, open])
    return (
        <React.Fragment>
            <Button disabled={!lotId}  type={'default'} danger={result===0} size='large' className='w-100 text-wrap h-100' onClick={() =>{ setOpen(true); form.resetFields()}}>
                {text}
            </Button>
            <Modal
                title="Bảng quản lý lỗi"
                open={open}
                onCancel={closeModal}
                footer={null}
            >
                <ScanButton placeholder={'Nhập mã lỗi hoặc quét mã QR'} onScan={onScan} />
                <Form
                    form={form}
                    onFinish={onFinish}
                    initialValues={{
                    }}
                    colon={false}
                    // {...formItemLayout}
                >
                    <Form.List name={'data'}>
                    {(fields, { add, remove }, { errors }) => 
                    errorsList.map((e, index) => {
                        return (
                            <Row gutter={8} className={'mt-2'}>
                                <Col span={12} style={{ paddingInline: 4 }} className='d-flex justify-content-center flex-wrap align-items-lg-center'>
                                    <div className='d-flex justify-content-center align-content-center flex-grow-1 align-items-lg-center' style={{ backgroundColor: '#EBEBEB', height: '100%' }}>
                                        {e.noi_dung}
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name={e.id} noStyle>
                                        <InputNumber inputMode='numeric' placeholder='Nhập số lượng' min={0} style={{ width: '100%' }} required/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        )
                    })}
                    </Form.List>
                    <Row>
                        <Col span={24} className='mt-3'>
                        <Form.Item noStyle>
                            <Button type='primary' style={{ width: '100%' }} htmlType='submit'>Lưu dữ liệu</Button>
                        </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </React.Fragment>
    )
}

export default QuanLyLoi;