import {
    DatePicker,
    Col,
    Row,
    Card,
    Table,
    Tag,
    Layout,
    Divider,
    Button,
    Form,
    Input,
    theme,
    Select,
    AutoComplete,
    Upload,
    message,
    Checkbox,
    Space,
    Modal,
    Spin,
    Popconfirm,
} from "antd";
import { baseURL } from "../../../config";
import React, { useState, useRef, useEffect } from "react";
import {
    exportMachines,
    getMachines,
    updateMachine,
    createMachine,
    deleteMachines,
    getShiftAssignment,
    getLine,
    getUsers,
    createShiftAssignment,
    updateShiftAssignment,
    deleteShiftAssignment,
    getShifts,
} from "../../../api";
import { useProfile } from "../../../components/hooks/UserHooks";
import EditableTable from "../../../components/Table/EditableTable";
import { getUserList } from "../../../store/actions";
import { render } from "@testing-library/react";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

const ShiftAssignment = () => {
    document.title = "Phân ca theo tài khoản";
    const [listCheck, setListCheck] = useState([]);
    const [openMdl, setOpenMdl] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form] = Form.useForm();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPage, setTotalPage] = useState(1);
    const [params, setParams] = useState({});
    const [machineList, setMachineList] = useState([]);
    const [shiftList, setShiftList] = useState([]);
    const [userList, setUserList] = useState([]);
    const tableRef = useRef();
    const col_detailTable = [
        {
            title: "Mã nhân viên",
            dataIndex: "username",
            key: "username",
            align: "center",
            width: 150
            // render: (value)=>userList.find(e=>e.id === value)?.username,
        },
        {
            title: "Tên nhân viên",
            dataIndex: "user_id",
            key: "user_id",
            align: "center",
            render: (_, record) => userList.find(e => e.id === _)?.name,
            editable: true,
            inputType: 'select',
            options: userList,
            require: true,
        },
        {
            title: "Ca",
            dataIndex: "shift_id",
            key: "shift_id",
            align: "center",
            render: (_, record) => shiftList.find(e => e.id === _)?.name,
            editable: true,
            inputType: 'select',
            options: shiftList,
            require: true,
        },
    ];

    const onSelect = (value, dataIndex, index) => {
        setData(prev => prev.map((e, i) => {
            if (i === index) {
                if (dataIndex === 'line_id') {
                    return { ...e, line_id: value, machine_id: null }
                }
                return { ...e, [dataIndex]: value }
            }
            return e;
        }))
    }
    function btn_click(page = 1, pageSize = 20) {
        setPage(page);
        setPageSize(pageSize);
        loadListTable({ ...params, page: page, pageSize: pageSize })
    }

    const [data, setData] = useState([]);
    const loadListTable = async (params) => {
        setLoading(true);
        const res = await getShiftAssignment(params);
        setData(
            res.data.map((e) => {
                return { ...e, key: e.id };
            })
        );
        setTotalPage(res.totalPage)
        setLoading(false);
    };
    useEffect(() => {
        btn_click(page, pageSize);
    }, [page, pageSize]);

    useEffect(() => {
        (async () => {
            var users = await getUsers();
            setUserList(users.map(e => ({ ...e, value: e.id, label: e.name })));
            var shifts = await getShifts();
            setShiftList(shifts.map(e => ({ ...e, value: e.id, label: e.name })));
        })()
    }, []);


    const onFinish = async (values) => {
        console.log(values);
        if (isEdit) {
            const res = await updateMachine(values);
            if (res) {
                form.resetFields();
                setOpenMdl(false);
                loadListTable(params);
            }
        } else {
            const res = await createMachine(values);
            if (res) {
                form.resetFields();
                setOpenMdl(false);
                loadListTable(params);
            }
        }
    };

    const deleteRecord = async () => {
        if (listCheck.length > 0) {
            const res = await deleteMachines(listCheck);
            setListCheck([]);
            loadListTable(params);
        } else {
            message.info("Chưa chọn bản ghi cần xóa");
        }
    };
    const onCreate = async (record, index) => {
        var res = await createShiftAssignment(record);
        await loadListTable(params);
    }
    const onUpdate = async (record, index) => {
        var res = await updateShiftAssignment(record);
        await loadListTable(params);
    }
    const onDelete = async (record) => {
        var res = await deleteShiftAssignment([record.id]);
        await loadListTable(params);
    }
    const clickToCreate = () => {
        tableRef.current.create();
    }
    const [loading, setLoading] = useState(false);
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setListCheck(selectedRowKeys);
        },
    };
    return (
        <>
            <Row style={{ padding: "8px", marginRight: 0 }} gutter={[8, 8]}>
                <Col span={4}>
                    <div className="slide-bar">
                        <Card style={{ height: "100%" }} bodyStyle={{ padding: 0 }} className="custom-card" actions={[
                            <Button
                                type="primary"
                                onClick={() => btn_click()}
                                style={{ width: "80%" }}
                            >
                                Tìm kiếm
                            </Button>
                        ]}>
                            <Divider>Tìm kiếm</Divider>
                            <div className="mb-3">
                                <Form
                                    style={{ margin: "0 15px" }}
                                    layout="vertical"
                                    onFinish={() => btn_click()}
                                >
                                    <Form.Item label="Mã nhân viên" className="mb-3">
                                        <Input
                                            allowClear
                                            onChange={(e) =>
                                                setParams({ ...params, username: e.target.value })
                                            }
                                            placeholder="Nhập mã nhân viên"
                                        />
                                    </Form.Item>
                                    <Form.Item label="Tên nhân viên" className="mb-3">
                                        <Input
                                            allowClear
                                            onChange={(e) =>
                                                setParams({ ...params, name: e.target.value })
                                            }
                                            placeholder="Nhập tên nhân viên"
                                        />
                                    </Form.Item>
                                    <Form.Item label="Ca làm việc" className="mb-3">
                                        <Select
                                            placeholder={"Chọn ca"}
                                            options={shiftList}
                                            onChange={(value) =>
                                                setParams({ ...params, shift_id: value })
                                            }
                                            allowClear
                                        />
                                    </Form.Item>
                                    <Button hidden htmlType="submit"></Button>
                                </Form>
                            </div>
                        </Card>
                    </div>
                </Col>
                <Col span={20}>
                    <Card
                        style={{ height: "100%" }}
                        bodyStyle={{ paddingBottom: 0 }}
                        className="custom-card scroll"
                        title="Phân ca theo tài khoản"
                        extra={
                            <Space>
                                <Button type="primary" onClick={clickToCreate}>Thêm</Button>
                            </Space>
                        }
                    >
                        <EditableTable
                            ref={tableRef}
                            size="small"
                            bordered
                            loading={loading}
                            columns={col_detailTable}
                            dataSource={data}
                            // rowSelection={rowSelection}
                            setDataSource={setData}
                            pagination={{
                                current: page,
                                size: "small",
                                total: totalPage,
                                pageSize: pageSize,
                                showSizeChanger: true,
                                onChange: (page, pageSize) => {
                                    setPage(page);
                                    setPageSize(pageSize);
                                    // loadListTable({ ...params, page: page, pageSize: pageSize });
                                },
                            }}
                            onSelect={onSelect}
                            onCreate={onCreate}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default withRouter(ShiftAssignment);
