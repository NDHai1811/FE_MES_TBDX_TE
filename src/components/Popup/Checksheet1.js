import {
    Form,
    Modal,
    Row,
    Col,
    Button,
    Divider,
    Radio,
    Space,
    InputNumber,
    Input,
    message,
} from "antd";
import React, { useState } from "react";
import "./popupStyle.scss";
import { useEffect } from "react";
import { getChecksheetList, getIQCChecksheetList } from "../../api/oi/quality";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
const Checksheet1 = (props) => {
    const { text, selectedLot, onSubmit, machine_id = null, line_id = null, open, setOpen } = props;
    const closeModal = () => {
        setOpen(false);
        form.resetFields();
    };
    // const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [checksheet, setChecksheet] = useState([]);

    const onFinish = async (values) => {
        console.log(values);
        if (selectedLot?.lot_id) {
            Object.keys(values["tinh_nang"]).forEach((key) => {
                const isNullish = Object.values(values["tinh_nang"][key]).every((value) => {
                    if (!value) {
                        return true;
                    }
                    return false;
                });
                if (isNullish) {
                    delete values["tinh_nang"][key];
                }
            });
            console.log(values);
            closeModal();
            onSubmit(values);
        }
    };
    useEffect(() => {
        (async () => {
            if (machine_id) {
                var res = await getChecksheetList({ machine_id: machine_id, lo_sx: selectedLot?.lo_sx });
                setChecksheet(res.data);
            }else{
                var res = await getIQCChecksheetList({ line_id: line_id, lo_sx: selectedLot?.lo_sx, machine_id: selectedLot?.machine_id });
                setChecksheet(res.data);
            }
        })();
    }, [selectedLot]);
    useEffect(() => {
        form.resetFields();
    }, [checksheet]);
    const [messageApi, contextHolder] = message.useMessage();
    const onSubmitFail = ({ values, errorFields, outOfDate }) => {
        // console.log(values, errorFields, outOfDate);
        messageApi.error('Chưa hoàn thành chỉ tiêu kiểm tra')
    }
    return (
        <React.Fragment>
            {contextHolder}
            {/* <Button
                disabled={!selectedLot?.lot_id}
                danger={selectedLot?.phan_dinh === 2}
                size="large"
                className="w-100 text-wrap h-100"
                onClick={
                    !selectedLot?.phan_dinh
                        ? () => {
                            setOpen(true);
                        }
                        : null
                }
            >
                {text}
            </Button> */}
            <Modal
                title={"Kiểm tra"}
                open={open}
                onCancel={closeModal}
                footer={
                    (
                        <Space>
                            <Button onClick={() => {onSubmit({ tinh_nang: [] }); closeModal()}} type="primary">Duyệt</Button>
                            <Button onClick={() => form.submit()} type="primary">Lưu</Button>
                            <Button onClick={() => setOpen(false)}>Huỷ</Button>
                        </Space>
                    )
                }
                width={500}
            >
                <Form form={form} onFinish={onFinish} colon={false} onFinishFailed={onSubmitFail}>
                    <Form.List name={"tinh_nang"}>
                        {(fields, { add, remove }, { errors }) =>
                            (checksheet ?? []).map((e, index) => {
                                if (e.input) {
                                    return (
                                        <Row gutter={8} className={index === 0 ? "" : "mt-2"}>
                                            <Col
                                                span={12}
                                                style={{ paddingInline: 4 }}
                                                className="d-flex justify-content-center flex-wrap align-items-lg-center"
                                            >
                                                <div
                                                    className="d-flex justify-content-center align-content-center flex-grow-1 align-items-lg-center p-2"
                                                    style={{
                                                        backgroundColor: "#EBEBEB",
                                                        height: "100%",
                                                        flexWrap: "wrap",
                                                    }}
                                                >
                                                    {e.name}
                                                    {e?.tieu_chuan && ". (" + e?.tieu_chuan + ")"}
                                                </div>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item noStyle name={[e.id, "value"]} rules={[{required: true}]}>
                                                    <InputNumber
                                                        className=" text-center h-100 d-flex align-items-center justify-content-center"
                                                        inputMode="numeric"
                                                        placeholder="Nhập số"
                                                        min={0}
                                                        style={{ width: "100%" }}
                                                        onChange={(value) =>
                                                            form.setFieldValue(
                                                                ["tinh_nang", e.id, "result"],
                                                                parseFloat(value) >=
                                                                    parseFloat(e.min) &&
                                                                    value <=
                                                                    parseFloat(e.max)
                                                                    ? 1
                                                                    : 2
                                                            )
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    noStyle
                                                    shouldUpdate={(prevVal, curVal) => true}
                                                >
                                                    {({ getFieldValue }) => (
                                                        <Form.Item
                                                            name={[e.id, "result"]}
                                                            noStyle
                                                            className="w-100 h-100"
                                                            rules={[{required: true}]}
                                                        >
                                                            {!getFieldValue(["tinh_nang", e.id, "value"]) ? (
                                                                <Button className="w-100 text-center h-100 d-flex align-items-center justify-content-center">
                                                                    OK/NG
                                                                </Button>
                                                            ) : getFieldValue(["tinh_nang", e.id, "result"]) === 1 ? (
                                                                <Button
                                                                    className="w-100 text-center h-100 d-flex align-items-center justify-content-center"
                                                                    style={{
                                                                        backgroundColor: "#55c32a",
                                                                        color: "white",
                                                                    }}
                                                                >
                                                                    OK
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    className="w-100 text-center h-100 d-flex align-items-center justify-content-center"
                                                                    style={{
                                                                        backgroundColor: "#fb4b50",
                                                                        color: "white",
                                                                    }}
                                                                >
                                                                    NG
                                                                </Button>
                                                            )}
                                                        </Form.Item>
                                                    )}
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    );
                                } else {
                                    return (
                                        <Row gutter={8} className={index === 0 ? "" : "mt-2"}>
                                            <Col
                                                span={12}
                                                style={{ paddingInline: 4 }}
                                                className="d-flex justify-content-center flex-wrap align-items-lg-center"
                                            >
                                                <div
                                                    className="d-flex justify-content-center align-content-center flex-grow-1 align-items-lg-center p-2"
                                                    style={{
                                                        backgroundColor: "#EBEBEB",
                                                        height: "100%",
                                                        flexWrap: "wrap",
                                                    }}
                                                >
                                                    {e?.name}
                                                    {e?.tieu_chuan && ". (" + e?.tieu_chuan + ")"}
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item name={[e.id, "result"]} noStyle>
                                                    <Radio.Group
                                                        style={{
                                                            float: "right",
                                                            width: "100%",
                                                            height: "100%",
                                                        }}
                                                        className="d-flex"
                                                        optionType="button"
                                                        buttonStyle="solid"
                                                    >
                                                        <Radio.Button
                                                            value={1}
                                                            className={
                                                                "positive-radio text-center h-100 d-flex align-items-center justify-content-center"
                                                            }
                                                            style={{ flex: 1 }}
                                                        >
                                                            OK
                                                        </Radio.Button>
                                                        <Radio.Button
                                                            value={2}
                                                            className="negative-radio text-center h-100 d-flex align-items-center justify-content-center"
                                                            style={{ flex: 1 }}
                                                        >
                                                            NG
                                                        </Radio.Button>
                                                    </Radio.Group>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    );
                                }
                            })
                        }
                    </Form.List>
                    <Form.Item name={"result"} hidden>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </React.Fragment>
    );
};

export default Checksheet1;
