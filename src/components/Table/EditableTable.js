import { DatePicker, Form, Input, InputNumber, Select, Table, TimePicker } from "antd";
import React, { useContext, useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import "./style.css";
import Actions from "./Actions";
import dayjs from "dayjs";
const EditableTable = forwardRef((props, ref) => {
  const { onDelete = null, onChange = null, onSelect = null, onCreate = null, onUpdate = null, dataSource, setDataSource = null, addonAction = null } = props;
  var editableColumns = [];
  const [editingKey, setEditingKey] = useState();
  const [data, setData] = useState(dataSource);
  const [form] = Form.useForm();
  useEffect(() => {
    setData(dataSource)
  }, [dataSource])
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
        inputNode = <InputNumber {...inputProps} max={typeof inputProps?.max === 'function' ? inputProps?.max(record) : (inputProps?.max ?? false)}/>;
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
            value={record?.[dataIndex] && dayjs(record?.[dataIndex]) || null}
            options={options}
            // onSelect={(value) => onSelect(value, dataIndex, index)}
            // onChange={(value) => value.isValid() && onChange(value, dataIndex, index)}
            showSearch
          />
        );
        break;
      case "time":
        inputNode = (
          <TimePicker
            {...inputProps}
            value={record?.[dataIndex] && dayjs(record?.[dataIndex]) || null}
            options={options}
            format={'HH:mm'}
            needConfirm={false}
            // onSelect={(value) => onSelect(value, dataIndex, index)}
            // onChange={(value) => value.isValid() && onChange(value, dataIndex, index)}
            showSearch
          />
        );
        break;
      default:
        inputNode = <Input {...inputProps} />;
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
          setData(data.map((e, i) => {
            if (i === editingKey) {
              return { ...e, [dataIndex]: value }
            }
            return { ...e };
          }))
        },
        onSelect: onSelect ?? function (value, dataIndex, index) {
          setData(data.map((e, i) => {
            if (i === editingKey) {
              return { ...e, [dataIndex]: value }
            }
            return { ...e };
          }))
        },
      }),
    };
    if (col.children && (col.children ?? []).length > 0) {
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
    setData(data.map((e, i) => {
      if (i === editingKey) {
        return { ...e, ...row }
      }
      return e;
    }))
    if (isCreate) {
      // onCreate && onCreate({ ...record, ...row }, editingKey);
      if (onCreate) {
        var res = await onCreate({ ...record, ...row }, editingKey);
        if (typeof res === 'boolean') {
          if (res) {
            setDataSource(data)
          } else {
            setData(dataSource)
          }
        }
      }
    } else {
      if (onUpdate) {
        var res = await onUpdate({ ...record, ...row }, editingKey);
        console.log(res);
        if (typeof res === 'boolean') {
          if (res) {
            setDataSource(data);
            setData(data);
          } else {
            setData(dataSource)
          }
        }
      }
    }
    form?.resetFields();
    setEditingKey();
    setIsCreate(false);
  }

  const onCancel = () => {
    form.resetFields();
    setEditingKey();
    if (isCreate) {
      setData(data.slice(1));
    }
    setIsCreate(false);
  }

  const [isCreate, setIsCreate] = useState(false);
  useImperativeHandle(ref, () => ({
    create: (isCreate = true) => {
      setIsCreate(isCreate);
    }
  }));
  useEffect(() => {
    if (isCreate) {
      setData(prev => [{}, ...prev]);
      setEditingKey(0);
    } else {
      onCancel()
    }
  }, [isCreate]);

  useEffect(() => {
    const row = data.find((e, i) => i === editingKey);
    if (row) {
      form.setFieldsValue({ ...row });
    }
  }, [data]);

  return (
    <Form form={form} component={false} onFinish={(values) => handleSave(data.find((e, index) => index === editingKey), editingKey)}>
      <Table
        {...props}
        columns={editableColumns}
        dataSource={data.map((e, i) => ({ ...e, key: i }))}
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
