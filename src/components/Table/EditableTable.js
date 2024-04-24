import { DatePicker, Form, Input, InputNumber, Select, Table } from "antd";
import React, { useContext, useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import "./style.css";
import Actions from "./Actions";
const EditableTable = forwardRef((props, ref) => {
  const { onDelete = null, onChange = null, onSelect = null, onCreate = null, onUpdate = null, dataSource, setDataSource = null, addonAction = null } = props;
  var editableColumns = [];
  const [editingKey, setEditingKey] = useState();
  const [form] = Form.useForm();
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    onChange,
    onSelect,
    options,
    inputProps,
    ...restProps
  }) => {
    let inputNode;
    switch (inputType) {
      case "number":
        inputNode = <InputNumber {...inputProps}/>;
        break;
      case "select":
        inputNode = (
          <Select
            {...inputProps}
            value={record?.[dataIndex]}
            options={options}
            optionFilterProp="label"
            // onChange={(value) => onSelect(value, dataIndex, index)}
            showSearch
          />
        );
        break;
      case "date":
        inputNode = (
          <DatePicker
            {...inputProps}
            value={record?.[dataIndex]}
            options={options}
            // onSelect={(value) => onSelect(value, dataIndex, index)}
            // onChange={(value) => value.isValid() && onChange(value, dataIndex, index)}
            showSearch
          />
        );
        break;
      default:
        inputNode = <Input {...inputProps}/>;
        break;
    }
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const mapColumns = (col) => {
    if (!col.editable) {
      return col;
    }
    const newCol = {
      ...col,
      onCell: (record, rowIndex) => ({
        record,
        inputProps: col.inputProps,
        inputType: col.inputType,
        options: typeof col.options === 'function' ? col.options(record, rowIndex) : (col.options ?? []),
        dataIndex: col.dataIndex,
        title: col.title,
        index: rowIndex,
        editing: record.key === editingKey,
        onChange: onChange ?? function (value, dataIndex, index) {
          setDataSource(dataSource.map((e, i) => {
            if (i === editingKey) {
              return { ...e, [dataIndex]: value }
            }
            return { ...e };
          }))
        },
        onSelect: onSelect ?? function (value, dataIndex, index) {
          setDataSource(dataSource.map((e, i) => {
            if (i === editingKey) {
              return { ...e, [dataIndex]: value }
            }
            return { ...e };
          }))
        },
      }),
    };
    if(col.children && (col.children??[]).length > 0){
      newCol.children = col.children.map(mapColumns)
    }
    return newCol
  }
  editableColumns = [...props.columns, {
    title: "Tác vụ",
    dataIndex: "action",
    key: "action",
    align: "center",
    fixed: "right",
    width: 80,
    render: (_, record) => <Actions
      form={form}
      onDelete={onDelete}
      record={record}
      editingKey={editingKey}
      setEditingKey={setEditingKey}
      onCancel={onCancel}
      addonAction={addonAction}
    />
  }].map(mapColumns);

  const handleSave = async (record) => {
    const row = await form?.validateFields();
    console.log(row);
    setDataSource(dataSource.map((e, i) => {
      if (i === editingKey) {
        return { ...e, ...row }
      }
      return e;
    }))
    if (isCreate) {
      onCreate && onCreate({ ...record, ...row }, editingKey);
    } else {
      onUpdate && onUpdate({ ...record, ...row }, editingKey);
    }
    form?.resetFields();
    setEditingKey();
    setIsCreate(false);
  }

  const onCancel = () => {
    form.resetFields();
    setEditingKey();
    if (isCreate) {
      setDataSource(dataSource.slice(1));
    }
    setIsCreate(false);
  }

  const [isCreate, setIsCreate] = useState(false);
  useImperativeHandle(ref, () => ({
    create: (isCreate = true) => {
      console.log(isCreate);
      setIsCreate(isCreate);
    }
  }));
  useEffect(() => {
    if (isCreate) {
      setDataSource(prev => [{}, ...prev]);
      setEditingKey(0);
    }else{
      onCancel()
    }
  }, [isCreate]);

  useEffect(() => {
    const row = dataSource.find((e, i)=>i===editingKey);
    if(row){
      form.setFieldsValue({...row});
    }
  }, [dataSource]);
  
  return (
    <Form form={form} component={false} onFinish={(values) => handleSave(dataSource.find((e, index) => index === editingKey), editingKey)}>
      <Table
        {...props}
        columns={editableColumns}
        dataSource={dataSource.map((e, i)=>({...e, key: i}))}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
      />
    </Form>
  );
});
export default EditableTable;
