import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";

const Actions = (props) => {
    const { record = null, form = null, onDelete = null, setEditingKey = null, editingKey = null, onCancel = null} = props;
    const onEdit = () => {
        form?.setFieldsValue(record);
        setEditingKey(record.key);
    }
    
    return record.key === editingKey ? (
        <div className="flex-wrap d-flex justify-content-evenly">
            <a
                style={{color: '#1677ff'}}
                onClick={() => form?.submit()}
            >
                Lưu
            </a>
            <a onClick={onCancel}>Hủy</a>
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