import { QrcodeOutlined } from "@ant-design/icons";
import { Button, Input, AutoComplete, Select } from "antd";
import { useEffect, useState } from "react";
  
const SelectButton = (props) =>{
    const {
        onChange = null,
        value,
        options,
        label = '',
        labelInValue=false
    } = props;
    return (
        <div style={{ borderRadius: '8px', textAlign: 'center', background: '#fff', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', height:'100%' }} className='d-flex flex-column'>
            <div style={{ background: '#0454a2', color: '#fff', padding: '8px 0px', borderRadius: '8px 8px 0px 8px', minHeight:40 }}>
                {label}
            </div>
            <div style={{ textAlign: 'center', height:'100%', display:'flex', alignItems:'center' }}>
                <Select allowClear={false} placeholder={label} style={{width:'100%'}} value={value} bordered={false} options={options} onChange={onChange} labelInValue={labelInValue}/>  
            </div>
        </div>
    )
}

export default SelectButton;