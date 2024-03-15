import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";

const Actions = (props) => {
    const { record = null, onSave = null, form = null, onDelete = null, setEditingKey = null, editingKey = null, dataSource = [], setDataSource = null } = props;
    const onEdit = () => {
        form?.setFieldsValue(record);
        setEditingKey(record.key);
    }
    const onCancel = () => {
        form?.resetFields();
        setEditingKey();
    }
    const handleSave = async (record) => {
        const row = await form?.validateFields();
        setDataSource(prev=>[...prev].map(e=>{
            if(e.key === editingKey){
                return {...e, ...row}
            }
            return e;
        }))
        onSave && onSave({...record, ...row});
        form?.resetFields();
        setEditingKey();
    }
    return record.key === editingKey ? (
        <div className="flex-wrap d-flex justify-content-evenly">
            <a
                href="javascript:void(0)"
                onClick={() => handleSave(record)}
            >
                Lưu
            </a>
            <a onClick={() => onCancel()}>Hủy</a>
        </div>
    ) : (
        <div className="flex-wrap d-flex justify-content-evenly">
            <EditOutlined
                style={{ color: "#1677ff", fontSize: 18 }}
                disabled={!editingKey}
                onClick={() => onEdit()}
            />
            {onDelete && <DeleteOutlined
                style={{ color: "red", fontSize: 18 }}
                disabled={!editingKey}
                onClick={() => onDelete(record)}
            />}
        </div>
    );
}
export default Actions;