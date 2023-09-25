import { Form, Input, Table } from "antd";
import React, { useContext, useRef, useState, useEffect } from "react";
import "./style.css";
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
            <tr {...props} />
        </EditableContext.Provider>
        </Form>
    );
};
const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);
    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };
    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({
            ...record,
            ...values,
            });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item style={{margin: 0}} name={dataIndex} rules={[{required: true, message: `${title} không được để trống.`}]}
            >
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
            className="editable-cell-value-wrap"
            style={{
                paddingRight: 24,
            }}
            onClick={toggleEdit}
            >
            {children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};
const EditableTable = (props) => {
    const {dataSource, setDataSource} = props;
    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        console.log(newData);
        setDataSource(newData);
    };
    return (
        <Table
        {...props}
        rowClassName="editable-row"
        columns={props.columns}
        components={{
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        }}
        />
    )
}
export default EditableTable;