import { DatePicker, Form, Input, InputNumber, Select, Table } from "antd";
import React, { useContext, useRef, useState, useEffect } from "react";
import "./style.css";
import Actions from "./Actions";
const EditableTable = (props) => {
  const { onDelete = null, onChange = null, onSelect = null, onSave = null, form = null, dataSource, setDataSource } = props;
  var editableColumns = [];
  const [editingKey, setEditingKey] = useState();
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
    ...restProps
  }) => {
    let inputNode;
    switch (inputType) {
      case "number":
        inputNode = <InputNumber />;
        break;
      case "select":
        inputNode = (
          <Select
            value={record?.[dataIndex]}
            options={options}
            optionFilterProp="label"
            onChange={(value) => onSelect(value, dataIndex, index)}
            showSearch
          />
        );
        break;
      case "date":
        inputNode = (
          <DatePicker
            value={record?.[dataIndex]}
            options={options}
            onSelect={(value) => onSelect(value, dataIndex, index)}
            onChange={(value) => value.isValid() && onChange(value, dataIndex, index)}
            showSearch
          />
        );
        break;
      default:
        inputNode = <Input />;
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
  editableColumns = [...props.columns, {
    title: "Tác vụ",
    dataIndex: "action",
    key: "action",
    align: "center",
    fixed: "right",
    width: 80,
    render: (_, record) => <Actions
      form={form}
      onSave={onSave}
      onDelete={onDelete}
      record={record}
      editingKey={editingKey}
      setEditingKey={setEditingKey}
      setDataSource={setDataSource}
    />
  }].map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record, rowIndex) => ({
        record,
        inputType: col.inputType,
        options: col.options ?? [],
        dataIndex: col.dataIndex,
        title: col.title,
        index: rowIndex,
        editing: record.key === editingKey,
        onChange: onChange ?? function (value, dataIndex, index) {
          setDataSource(prev => prev.map(e => {
            if (e.key === editingKey) {
              return { ...e, [dataIndex]: value }
            }
            return { ...e };
          }))
        },
        onSelect: onSelect ?? function (value, dataIndex, index) {
          setDataSource(prev => prev.map(e => {
            if (e.key === editingKey) {
              return { ...e, [dataIndex]: value }
            }
            return { ...e };
          }))
        },
      }),
    };
  });
  return (
    <Table
      {...props}
      columns={editableColumns}
      dataSource={dataSource}
      components={{
        body: {
          cell: EditableCell,
        },
      }}
    />
  );
};
export default EditableTable;
