import {
    Col,
    Row,
    Card,
    Table,
    Divider,
    Button,
    Form,
    Input,
    Upload,
    message,
    Space,
    Spin,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useEffect, useRef } from "react";
import { getTems } from "../../../api/ui/manufacture";
import "../style.scss";
import { useReactToPrint } from "react-to-print";
import TemIn from "../../OI/Manufacture/TemIn";

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    initialValue={record?.[dataIndex]}
                >
                    <Input />
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const TaoTem = () => {
    document.title = "Tạo tem sản xuất";
    const [listCheck, setListCheck] = useState([]);
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [loadingExport, setLoadingExport] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingKey, setEditingKey] = useState("");
    const componentRef1 = useRef();
    const col_detailTable = [
        {
            title: "Lô sản xuất",
            dataIndex: "lo_sx",
            key: "lo_sx",
            align: "center",
            fixed: "left",
        },
        {
            title: "Khách hàng",
            dataIndex: "khach_hang",
            key: "khach_hang",
            align: "center",
        },
        {
            title: "Đơn hàng TBDX",
            dataIndex: "mdh",
            key: "mdh",
            align: "center",
        },
        {
            title: "Đơn hàng khách hàng",
            dataIndex: "order",
            key: "order",
            align: "center",
        },
        {
            title: "Đơn hàng khách hàng",
            dataIndex: "order",
            key: "order",
            align: "center",
        },
        {
            title: "MQL",
            dataIndex: "mql",
            key: "mql",
            align: "center",
        },
        {
            title: "Số lượng",
            dataIndex: "so_luong",
            key: "so_luong",
            align: "center",
        },
        {
            title: "GMO",
            dataIndex: "gmo",
            key: "gmo",
            align: "center",
        },
        {
            title: "PO",
            dataIndex: "po",
            key: "po",
            align: "center",
        },
        {
            title: "STYLE",
            dataIndex: "style",
            key: "style",
            align: "center",
        },
        {
            title: "STYLE NO",
            dataIndex: "style",
            key: "style",
            align: "center",
        },
        {
            title: "COLOR",
            dataIndex: "color",
            key: "color",
            align: "center",
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
            align: "center",
        },
        {
            title: "Máy in",
            dataIndex: "machine_id",
            key: "machine_id",
            align: "center",
        },
        {
            title: "Nhân viên sản xuất",
            dataIndex: "nhan_vien_sx",
            key: "nhan_vien_sx",
            align: "center",
        },
    ];


    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        (async () => {
            loadListTable();
        })();
    }, []);

    const loadListTable = async () => {
        setLoading(true);
        const res = await getTems();
        setData(res.map(e => ({ ...e, key: e.id })));
        setLoading(false);
    };


    const success = () => {
        messageApi.open({
            type: "success",
            content: "Upload file thành công",
        });
    };

    const error = () => {
        messageApi.open({
            type: "error",
            content: "Upload file lỗi",
        });
    };
    const options = (dataIndex) => {
        var record = data.find(e => e.id === editingKey);
        let filteredOptions = [];
        return filteredOptions;
    }
    const print = useReactToPrint({
        content: () => componentRef1.current,
    });

    const handlePrint = async () => {
        print();
    };
    const onChange = (value, dataIndex) => {
        const items = data.map((val) => {
            if (val.key === editingKey) {
                val[dataIndex] = value;
            }
            return { ...val };
        });
        value.isValid() && setData(items);
    };
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(selectedRows, selectedRowKeys);
            setListCheck(selectedRows);
        },
    };
    const mergedColumns = col_detailTable.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: "text",
                dataIndex: col.dataIndex,
                title: col.title,
                onChange,
                options: options(col.dataIndex)
            })
        };
    });

    return (
        <>
            {contextHolder}
            <Row style={{ padding: "8px", height: "90vh" }} gutter={[8, 8]}>
                <Col span={24}>
                    <Card
                        style={{ height: "100%" }}
                        title="Quản lý tạo tem"
                        extra={
                            <Space>
                                <Button
                                    size="medium"
                                    type="primary"
                                    style={{ width: "100%" }}
                                    onClick={handlePrint}
                                >
                                    In tem
                                </Button>
                                <div className="report-history-invoice">
                                    <TemIn listCheck={listCheck} ref={componentRef1} />
                                </div>
                                <Upload
                                    showUploadList={false}
                                    name="files"
                                    action={baseURL + "/api/upload-tem"}
                                    headers={{
                                        authorization: "authorization-text",
                                    }}
                                    onChange={(info) => {
                                        setLoadingExport(true);
                                        if (info.file.status === "error") {
                                            setLoadingExport(false);
                                            error();
                                        } else if (info.file.status === "done") {
                                            if (info.file.response.success === true) {
                                                // loadListTable(params);
                                                success();
                                                setLoadingExport(false);
                                            } else {
                                                // loadListTable(params);
                                                message.error(info.file.response.message);
                                                setLoadingExport(false);
                                            }
                                        }
                                    }}
                                >
                                    <Button
                                        style={{ marginLeft: "15px" }}
                                        type="primary"
                                        loading={loadingExport}
                                    >
                                        Upload Excel
                                    </Button>
                                </Upload>
                            </Space>
                        }
                    >
                        <Spin spinning={loading}>
                            <Form form={form} component={false}>
                                <Table
                                    pagination={false}
                                    size="small"
                                    bordered
                                    scroll={{
                                        y: "70vh",
                                        x: "120vw"
                                    }}
                                    components={{
                                        body: {
                                            cell: EditableCell,
                                        },
                                    }}
                                    rowClassName="editable-row"
                                    columns={mergedColumns}
                                    dataSource={data}
                                    rowSelection={rowSelection}
                                />
                            </Form>
                        </Spin>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default TaoTem;
