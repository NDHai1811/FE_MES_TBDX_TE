import { Form, Modal, Row, Col, Button, Divider, Radio, Space, InputNumber } from 'antd';
import React, { useState } from 'react';
import './popupStyle.scss'
import ScanButton from '../Button/ScanButton';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useEffect } from 'react';
import { getChecksheetList, scanError, sendResultError } from '../../api/oi/quality';
const QuanLyLoi = (props) => {
    const {line} = useParams();
    const { text, selectedLot, onSubmit } = props;
    const closeModal = () => {
        setOpen(false);
    }
    const [errorsList, setErrorsList] = useState([]);
    useEffect(()=>{
        (async () => {
            var res = await scanError();
            if(res.success){
                setErrorsList(res.data)
            }
        })()
    }, [line]);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const onFinish = async (values) =>{
        if(selectedLot?.lot_id){
            Object.keys(values['ngoai-quan']).forEach(key => {
                if (values['ngoai-quan'][key] == null) {
                    delete values['ngoai-quan'][key];
                }
            });
            console.log(values);
            onSubmit(values);
            closeModal()
        }
    }
    useEffect(()=>{
        form.resetFields();
    }, [errorsList, line])
    return (
        <React.Fragment>
            <Button disabled={!selectedLot?.lot_id}  type={'default'} danger={selectedLot?.result===2} size='large' className='w-100 text-wrap h-100' onClick={selectedLot?.result===0 ? () => {setOpen(true)} : null}>
                {text}
            </Button>
            <Modal
                title="Bảng quản lý lỗi"
                open={open}
                onCancel={closeModal}
                okText={"Xác nhận"}
                okButtonProps={{
                    onClick: ()=>form.submit(),
                }}
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    initialValues={{
                    }}
                    colon={false}
                    // {...formItemLayout}
                >
                    <Form.List name={'ngoai-quan'}>
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
                </Form>
            </Modal>
        </React.Fragment>
    )
}

export default QuanLyLoi;