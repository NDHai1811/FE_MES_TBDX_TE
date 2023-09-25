import React, { useState } from 'react';
import {DeleteOutlined,EditOutlined,UploadOutlined, PlusOutlined, FileExcelOutlined, PrinterOutlined } from '@ant-design/icons';
import {DatePicker,Col,Row,Card,Table,Tag,Layout,Divider,Button,Form,Input,theme,Select,AutoComplete} from 'antd';
import "../style.scss";

const {Sider} = Layout;
const { RangePicker } = DatePicker;

const columns1 = [
    {
        title: 'Số lượng đầu ra (kế hoạch)',
        dataIndex: 'sl_dau_ra_kh',
        key: 'sl_dau_ra_kh',
    },
    {
        title: 'Số lượng đầu ra OK (thực tế)',
        dataIndex: 'sl_dau_ra_tt_ok',
        key: 'sl_dau_ra_tt_ok',
    },
    {
        title: 'Chênh lệch thực tế - kế hoạch',
        dataIndex: 'chenh_lech',
        key: 'chenh_lech',
    },
    {
        title: 'Tỷ lệ hoàn thành',
        dataIndex: 'complete_rate',
        key: 'complete_rate',
    },
    {
        title: 'Số lượng tem vàng',
        dataIndex: 'tv',
        key: 'tv',
        className: 'yellow'
    },
    {
        title: 'Số lượng NG',
        dataIndex: 'ng',
        key: 'ng',
        className: 'red'
    },
];
const dataTable1 = [
    {
        sl_dau_ra_kh:'Linh kiện 1',
        sl_dau_ra_tt_ok:'1000',
        chenh_lech:'500',
        complete_rate:'50%',
        tv:'60%',
        ng:'60%',
    },
]

const columns2 = [
    {
        title: 'Lô SX',
        dataIndex: 'lo_sx',
        key: 'lo_sx',
        align: 'center',
    },
    {
        title: 'Mã thùng/pallet',
        dataIndex: 'id_thung',
        key: 'id_thung',
        align: 'center',
    },
    {
        title: 'Tên SP',
        dataIndex: 'ten_sp',
        key: 'ten_sp',
        align: 'center',
    },
    {
        title: 'Mã hàng',
        dataIndex: 'ma_hang',
        key: 'ma_hang',
        align: 'center',
    },
    {
        title: 'Công đoạn SX',
        dataIndex: 'cong_doan_sx',
        key: 'cong_doan_sx',
        align: 'center',
    },
    {
        title: 'Máy sản xuất',
        dataIndex: 'may_sx',
        key: 'may_sx',
        align: 'center',
    },
    {
        title: 'UPH (ấn định)',
        dataIndex: 'uph_an_dinh',
        key: 'uph_an_dinh',
        align: 'center',
    },
    {
        title: 'UPH (thực tế)',
        dataIndex: 'uph_thuc_te',
        key: 'uph_thuc_te',
        align: 'center',
    },
    {
        title: 'Đơn vị tính',
        dataIndex: 'unit',
        key: 'unit',
        align: 'center',
    },
    {
        title: 'Kế hoạch',
        children:[
            {
                title: 'Số lượng đầu vào',
                dataIndex: 'sl_dau_vao_kh',
                key: 'sl_dau_vao_kh',
                align: 'center',
            },
            {
                title: 'Số lượng đầu ra',
                dataIndex: 'sl_dau_ra_kh',
                key: 'sl_dau_ra_kh',
                align: 'center',
            },
        ]
    },
    {
        title: 'Thực tế',
        children:[
            {
                title: 'Số lượng đầu vào',
                dataIndex: 'sl_dau_vao_tt',
                key: 'sl_dau_vao_tt',
                align: 'center',
            },
            {
                title: 'Số lượng đầu ra',
                dataIndex: 'sl_dau_ra_tt',
                key: 'sl_dau_ra_tt',
                align: 'center',
            },
            {
                title: 'Số lượng đầu ra OK',
                dataIndex: 'sl_dau_ra_ok_tt',
                key: 'sl_dau_ra_ok_tt',
                align: 'center',
            },
            {
                title: 'Số lượng tem vàng',
                dataIndex: 'sl_tem_vang',
                key: 'sl_tem_vang',
                align: 'center',
                className: 'yellow'
            },
            {
                title: 'Số lượng NG',
                dataIndex: 'sl_ng',
                key: 'sl_ng',
                align: 'center',
                className: 'red'
            },
        ]
    },
    {
        title: 'Chênh lệch (TT-KH)',
        dataIndex: 'chenh_lech_tt_kh',
        key: 'chenh_lech_tt_kh',
        align: 'center',
    },
    {
        title: 'Tỉ lệ hoàn thành',
        dataIndex: 'ti_le_hoan_thanh',
        key: 'ti_le_hoan_thanh',
        align: 'center',
    },
];
const dataTable2 = [];
for(let i=0; i<20; i++){
    let data = {
        lo_sx:'Lô SX1',
        id_thung:'Thùng 1',
        ten_sp:'Sản phẩm 1',
        ma_hang:"SP1",
        cong_doan_sx:"In",
        may_sx:"Máy 1",
        uph_an_dinh:"1",
        uph_thuc_te:"1",
        unit:"Chiếc",
        sl_dau_vao_kh:"1",
        sl_dau_ra_kh:"1",
        sl_dau_vao_tt:'1',
        sl_dau_ra_tt:"1",
        sl_dau_ra_ok_tt:"1",
        sl_tem_vang:'1',
        sl_ng:"1",
        chenh_lech_tt_kh:"1",
        ti_le_hoan_thanh:"1",
    };
    dataTable2.push(data);
}

const SanLuong = (props) => {
    
    return (
        <React.Fragment>
            <Sider style={{backgroundColor:'white', height:'100vh', overflow:'auto', float:'left', paddingTop:'15px'}}>
                        <div className='mb-3'>
                        <Form style={{ margin: '0 15px' }} layout="vertical">
                        <Form.Item label="Công đoạn" className='mb-3'>
                              <Select
                              defaultValue="In"
                              options={[{ value: 'in', label: 'In' }, {value:'bao-on', label:'Bảo ôn'}]}
                              />
                        </Form.Item>
                        <Form.Item label="Máy" className='mb-3'>
                              <Select
                              defaultValue="Máy 1"
                              options={[{ value: '1', label: 'Máy 1' }, {value:'2', label:'Máy 2'}]}
                              />
                        </Form.Item>
                        </Form>
                        </div>
                        <Divider>Thời gian truy vấn</Divider>
                        <div className='mb-3'>
                        <Form style={{ margin: '0 15px' }} layout="vertical">
                              <RangePicker placeholder={["Bắt đầu", "Kết thúc"]}/>
                        </Form>
                        </div>
                        <Divider>Điều kiện truy vấn</Divider>
                        <div className='mb-3'>
                        <Form style={{ margin: '0 15px' }} layout="vertical"> 
                            <Form.Item label="Mã hàng" className='mb-3'>
                                <AutoComplete placeholder='Nhập mã hàng'></AutoComplete>
                            </Form.Item>
                            <Form.Item label="Tên sản phẩm" className='mb-3'>
                                <Input placeholder='Nhập tên sản phẩm'></Input>
                            </Form.Item>
                            <Form.Item label="Lô Sản xuất" className='mb-3'>
                                <Input placeholder='Nhập lô SX'></Input>
                            </Form.Item>
                            <Form.Item label="Nhân viên" className='mb-3'>
                                <Input placeholder='Nhập mã nhân viên'></Input>
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
                        style={
                              {width: '80%'}
                  }>Truy vấn</Button>
                  </div>
            </Sider>
            <Row style={{padding: '8px', height:'100vh'}} gutter={[8, 8]}>
                  <Col span={24}>
                  <Card style={{height: '100%'}} title="Báo cáo sản lượng" extra={
                        <Button style={{marginLeft:'15px'}} type="primary">
                              Xuất Excel
                        </Button>
                  }>
                        <Table className='mb-3' size='small' bordered
                              pagination={false}
                            //   scroll={
                            //   {
                            //         x: '100%',
                            //         y: '20vh'
                            //   }
                            //   }
                              columns={columns1}
                              dataSource={dataTable1}/>
                        <Table size='small' bordered
                              pagination={false}
                              scroll={
                              {
                                    x: '100%',
                                    y: '50vh'
                              }
                              }
                              columns={columns2}
                              dataSource={dataTable2}/>
                  </Card>
                  </Col>
            </Row>
        </React.Fragment>
    );
};

export default SanLuong;