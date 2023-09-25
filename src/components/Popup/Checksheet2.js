import { Form, Modal, Row, Col, Button, Divider, Radio, Space, InputNumber, Input } from 'antd';
import React, { useState } from 'react';
import './popupStyle.scss'
import { useEffect } from 'react';
import { getChecksheetList, sendResultChecksheet } from '../../api/oi/quality';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
const Checksheet2 = (props) =>{
    const {line} = useParams();
    const {text, checksheet = [], lotId,  setOpenKV = null, changeVariable = null, disabled = false} = props;
    const closeModal = () =>{
        setOpen(false);
    }
    const [isSubmited, setIsSubmited] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const result = Form.useWatch('result', form);
    const onFinish = async (values) =>{
        // if(lotId){
            values.key = checksheet?.key?.key;
            values.lot_id = lotId;
            values.line_id = line;
            console.log(values);
            var res = await sendResultChecksheet(values);
            setIsSubmited(true)
            closeModal();
        // }else{
        //     console.log('kkhong co ma pallet');
        // }
        
    }
    const hanleClickOk = () =>{
        form.setFieldValue('result', 1);
        form.submit();
    } 
    const hanleClickNG = () =>{
        form.setFieldValue('result', 0);
        form.submit();
    }
    const hanleClickKV = () =>{
        closeModal();
        setOpenKV(true)
    }
    useEffect(()=>{
        form.resetFields();
        setIsSubmited(false);
    }, [checksheet, line, changeVariable])

    return (
        <React.Fragment>
            <Button disabled={!(checksheet.data ?? []).length > 0 || disabled} type={(isSubmited) ? "primary" : 'default'} danger={result===0} size='large' className='w-100 text-wrap h-100' onClick={() => !isSubmited && setOpen(true)}>
                {text}
            </Button>
            <Modal 
                title={"Kiểm tra "+(checksheet?.key?.title)}
                open={open}  
                onCancel={closeModal}
                footer={
                    <div className='justify-content-between d-flex'>
                        <strong>Kết luận</strong>
                        <Space>
                            <Button type='primary' style={{backgroundColor:'#55c32a'}} onClick={hanleClickOk}>Duyệt</Button>
                            {/* <Button type='primary' style={{backgroundColor:'#f7ac27'}} onClick={hanleClickKV}>Khoanh vùng</Button> */}
                            <Button type='primary' style={{backgroundColor:'#fb4b50'}} onClick={hanleClickNG}>NG</Button>
                        </Space>
                    </div>
                }
                width={700}
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    initialValues={{
                        data: (checksheet.data ?? []).map(e=>{return {id: e.id}})
                    }}
                    colon={false}
                    // {...formItemLayout}
                >
                    <Form.Item hidden name={'result'}></Form.Item>
                    <Form.List name={'data'}>
                        {(fields, { add, remove }, { errors }) => 
                        (checksheet.data ?? []).map((e, index)=>{
                            if((e.input)){
                                return (
                                    <Row gutter={8} className={index === 0 ? '' : 'mt-2'}>
                                        <Col span={12} style={{paddingInline:4}} className='d-flex justify-content-center flex-wrap align-items-lg-center'>
                                            <div className='d-flex justify-content-center align-content-center flex-grow-1 align-items-lg-center p-2' style={{backgroundColor:'#EBEBEB', height:'100%', flexWrap:'wrap'}}>
                                                {e.hang_muc}{e.note.trim() && ('. ('+e.note+')')}
                                            </div>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item noStyle name={[index, 'value']}>
                                                <InputNumber className=' text-center h-100 d-flex align-items-center justify-content-center' inputMode='numeric' placeholder='Nhập số' min={0} style={{width:'100%'}} onChange={(value)=>form.setFieldValue(['data', index, 'result'], (parseFloat(value) >= (parseFloat(e.tieu_chuan) - parseFloat(e. delta)) && value <= (parseFloat(e.tieu_chuan) + parseFloat(e. delta))) ? 1 : 0)}/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item name={[index, "id"]} hidden noStyle></Form.Item>
                                            <Form.Item noStyle shouldUpdate={(prevVal, curVal)=> prevVal.data[index]?.value !== curVal.data[index]?.value}>
                                            {({ getFieldValue }) =>
                                                <Form.Item name={[index, 'result']} noStyle className='w-100 h-100'>
                                                    {!getFieldValue(['data',index, "value"]) ? 
                                                    <Button className='w-100 text-center h-100 d-flex align-items-center justify-content-center'>OK/NG</Button>
                                                    :
                                                    getFieldValue(['data',index, "result"]) ? 
                                                    <Button className='w-100 text-center h-100 d-flex align-items-center justify-content-center' style={{backgroundColor:'#55c32a', color: 'white'}}>OK</Button>
                                                    : 
                                                    <Button className='w-100 text-center h-100 d-flex align-items-center justify-content-center' style={{backgroundColor:'#fb4b50', color: 'white'}}>NG</Button>}
                                                </Form.Item>
                                            }
                                                
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                )
                            }else{
                                return (
                                    <Row gutter={8} className={index === 0 ? '' : 'mt-2'}>
                                        <Col span={12} style={{paddingInline:4}} className='d-flex justify-content-center flex-wrap align-items-lg-center'>
                                            <div className='d-flex justify-content-center align-content-center flex-grow-1 align-items-lg-center p-2' style={{backgroundColor:'#EBEBEB', height:'100%', flexWrap:'wrap'}}>
                                                {e.hang_muc}{e.tieu_chuan.trim() && ('. ('+e.tieu_chuan+')')}
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item name={[index, "id"]} hidden noStyle></Form.Item>
                                            <Form.Item name={[index, 'result']} noStyle>
                                                <Radio.Group 
                                                    style={{float:'right', width:'100%', height:'100%'}}
                                                    className='d-flex'
                                                    optionType="button"
                                                    buttonStyle="solid"
                                                >
                                                    <Radio.Button value={1} className={'positive-radio text-center h-100 d-flex align-items-center justify-content-center'} style={{flex:1}}>OK</Radio.Button>
                                                    <Radio.Button value={0} className='negative-radio text-center h-100 d-flex align-items-center justify-content-center' style={{flex:1}}>NG</Radio.Button>
                                                </Radio.Group>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                )
                            }
                        })}
                    </Form.List>
                    <Divider></Divider>
                </Form>
            </Modal>
        </React.Fragment>
    )
}

export default Checksheet2;