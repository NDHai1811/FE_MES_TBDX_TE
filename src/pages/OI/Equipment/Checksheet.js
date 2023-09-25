import { Button, Form, Space, Table, Input, Checkbox, message, InputNumber} from "antd"
import {CheckOutlined} from '@ant-design/icons';
import { useEffect } from "react";
import { useState } from "react";
import dayjs from "dayjs";
import {getCheckSheetOfMachine, updateCheckSheetLog} from '../../../api/oi/equipment';

const CheckSheet = (props) =>{
    const machine = props?.machine;

    const [messageApi, contextHolder] = message.useMessage();
      const successSave = () => {
        messageApi.open({
          type: 'success',
          content: 'Hoàn thành kiểm tra check sheet!',
        });
      };
    
      const errorInput = () => {
        messageApi.open({
          type: 'error',
          content: 'Bạn chưa kiểm tra hết danh sách hoặc dữ liệu nhập vào chưa đúng dịnh dạng',
        });
      };

    const [checkSheetWork, setCheckSheetWork] = useState([]);    
    const [dataTable, setDataTable] = useState([]);
    useEffect(()=>{
        (async ()=>{
            const res = await getCheckSheetOfMachine({machine_id:machine?.value});
            setCheckSheetWork(res.success == true ? res.data : []);
        })()
    }, [machine])

    useEffect(()=>{
        const list = [];
        if(checkSheetWork.data != undefined)
            for(let i=0; i<checkSheetWork.data.length; i++){
                let d = {
                    id:checkSheetWork.data[i].id,
                    hm_id : checkSheetWork.data[i].checksheet.id,
                    hm: checkSheetWork.data[i].checksheet.hang_muc,
                    nd: checkSheetWork.data[i].cong_viec,
                    type: checkSheetWork.data[i].type,
                    time: checkSheetWork.is_checked == true ? dayjs(checkSheetWork.data[i]?.date_time).format('HH:mm:ss') : '',
                    date: checkSheetWork.is_checked == true ? dayjs(checkSheetWork.data[i]?.date_time).format('DD/MM/YYYY') : '',
                    value: checkSheetWork.data[i]?.value,
                }
                list.push(d);
            }
        
        setDataTable(list.sort((a, b) => {
            return a.hm_id - b.hm_id;
        }));
    }, [checkSheetWork]);

    const mergeValue = new Set();
    useEffect(() => {
        mergeValue.clear();
    },[]);
    const columns = [
        {
            title: 'STT',
            dataIndex: 'no',
            key: 'no',
            align: 'center',
            render: (value, item, index) => index + 1
        },
        {
            title: 'Hạng mục công việc',
            dataIndex: 'hm',
            key: 'hm',
            align: 'center',
            onCell: (record, index) => {
                if (mergeValue.has(record.hm_id)) {
                  return { rowSpan: 0 };
                }else{
                  const rowCount = dataTable.filter((data) => data.hm_id === record.hm_id).length;
                  mergeValue.add(record.hm_id);
                  return { rowSpan: rowCount };
                }
                 return {};
               },
        },
        {
            title: 'Nội dung công việc',
            dataIndex: 'nd',
            key: 'nd',
            align: 'center',
        },
        {
            title: 'Thời gian thực hiện',
            dataIndex: 'time',
            key: 'time',
            align: 'center',
        },
        {
            title: 'Ngày thực hiện',
            dataIndex: 'date',
            key: 'date',
            align: 'center',
        },
        {
            title: 'Xác nhận',
            dataIndex: 'result',
            key: 'result',
            align: 'center',
            render: (value, record, index) =>
                {
                    return record.type == 1 ? (
                        <Input inputMode="numeric" value={record?.value} disabled={checkSheetWork.is_checked == true ? true : false} id={'input'+record.id} className="textInput" placeholder="Nhập thông số đo" type='text' />
                    ) : 
                    (
                        checkSheetWork.is_checked == true ? <CheckOutlined style={{color:'green'}} /> :
                        <Checkbox defaultChecked={false} name={'checkbox'+record.id} onChange={(e) => onChangeCheckbox(e.target.checked)} className="checkboxInput"></Checkbox>
                    )
                }
        },
    ]

    const [countChecked, setCountChecked] = useState(0);

    const onChangeCheckbox = (value) => {
        value == true ? setCountChecked(countChecked + 1) : setCountChecked(countChecked - 1);
    }
    const save = () => {
        let full  = document.getElementsByClassName('checkboxInput').length;
        let allChecked = full == countChecked ? true : false;

        let input = document.getElementsByClassName('textInput');
        let checkInput = true;
        for(let i = 0; i<input.length; i++){
            console.log(isNaN(input[i].value));
            if(input[i].value == "" || isNaN(input[i].value)) checkInput = false;
        }
        if(allChecked == true && checkInput== true) {
            (async ()=>{
                let data = [];
                for(let i=0; i<dataTable.length; i++){
                if(dataTable[i].type == 1){
                    let res = {
                        id: dataTable[i].id,
                        value: document.getElementById('input'+dataTable[i].id)?.value ,
                    }
                    data.push(res);
                }
                }
                const result = await updateCheckSheetLog({data: data, machine_id:machine?.value});
                if(result.success == true) {
                    
                    (async ()=>{
                        successSave();
                        const res = await getCheckSheetOfMachine({machine_id:machine?.value});
                        setCheckSheetWork(res.success == true ? res.data : []);
                        window.location.reload();
                    })()

                };
            })()
        }
        else errorInput(); 
    }



    return (
            machine ? <Space direction="vertical">
            {contextHolder}
            <Form>
            {machine &&
                 <Table
                 scroll={{
                     x: 200,
                     y: 350,
                 }}
                 pagination={false}
                 bordered
                 className='mb-4'
                 columns={columns}
                 dataSource={dataTable} />
               }
            </Form>
            <Button hidden={checkSheetWork.is_checked == true ?  true : false} onClick={() => save()} type="primary" size="large" style={{float:'right', marginRight:'100px'}}>Lưu</Button>
            </Space>
            :
            <>Công đoạn không có máy!</>
        
    )
}
export default CheckSheet;