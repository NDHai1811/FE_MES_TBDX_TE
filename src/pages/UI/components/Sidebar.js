import { Button, Card, Checkbox, Col, DatePicker, Divider, Form, Input, Layout, Menu, Select } from "antd"
import logolight from "../../../assets/images/logo.png";
import VerticalButton from "../../../components/Button/VerticalButton";
import { PrinterOutlined, QrcodeOutlined } from "@ant-design/icons";
import { useState } from "react";
const { Sider } = Layout;
const { RangePicker } = DatePicker;
const options = [
    { label: 'Thiết bị số 1', value: 'Apple' },
    { label: 'Thiết bị số 2', value: 'Pear' },
    { label: 'Thiết bị số 3', value: 'Orange' },
];
const siderStyle = {
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#fff',
    width:'100%'
};
const UISidebar = (props)=>{
    const {setDataRequire} = props;
    const onChange = (checkedValues) => {
        console.log('checked = ', checkedValues);
    };
    const [options, setOptions] = useState([
        {
            label: 'Bảo ôn',
            value: 1,
        },
        {
            label: 'In',
            value: 2,
        },
        {
            label: 'Phủ',
            value: 3,
        },
        {
            label: 'Bế',
            value: 4,
        },
        {
            label: 'Bóc',
            value: 5,
        },
        {
            label: 'Gấp dán',
            value: 6,
        },
        {
            label: 'Chọn',
            value: 7,
        },
    ]);
    return (
        <Card style={siderStyle}>
            <Col span={24} style={{padding:13}}>
            <Form layout="vertical">
                <div className='mb-2'>
                    <h6>Chọn công đoạn/line</h6>
                    
                    <Form.Item name={'line'} noStyle>
                        <Select options={options} mode="multiple" style={{width:'100%'}}/>
                    </Form.Item>
                    <Divider style={{ margin: '10px 0' }} />
                </div>
                <div className='mb-2'>
                    <h6>Thời gian</h6>
                    
                    <Form.Item name={'date'} noStyle>
                        <RangePicker format="DD/MM/YYYY" />
                    </Form.Item>
                    <Divider style={{ margin: '10px 0' }} />
                </div>
                <div className='mb-2'>
                    <h6>Điều kiện</h6>
                    
                    <Form.Item label="Tên sản phẩm">
                        <Input placeholder="Nhập tên sản phẩm" />
                    </Form.Item>
                    <Form.Item label="Mã hàng">
                        <Input placeholder="Nhập mã hàng" />
                    </Form.Item>
                    <Form.Item label="Lô sản xuất">
                        <Input placeholder="Nhập lô sản xuất" />
                    </Form.Item>
                    <Form.Item label="Mã nguyên liệu">
                        <Input placeholder="Nhập mã nguyên liệu" />
                    </Form.Item>
                    <div style={{display:'flex', justifyContent:'center'}}>
                        <Button style={{margin:0}} type="primary">Truy vấn</Button>
                    </div>
                    <Divider style={{ margin: '10px 0' }} />
                </div>
            </Form>
            </Col>
        </Card>
    )
    
}
export default UISidebar;