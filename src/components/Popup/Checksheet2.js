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
} from "antd";
import React, { useState } from "react";
import "./popupStyle.scss";
import { useEffect } from "react";
import { getChecksheetList } from "../../api/oi/quality";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
const Checksheet2 = (props) => {
    const { line } = useParams();
    const { text, selectedLot, onSubmit, machine_id } = props;
    const closeModal = () => {
        setOpen(false);
    };
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [checksheet, setChecksheet] = useState([]);

    const onFinish = async (values) => {
        if (selectedLot?.lot_id) {
            Object.keys(values["data"]).forEach((key) => {
                const isNullish = Object.values(values["data"][key]).every((value) => {
                    if (!value) {
                        return true;
                    }
                    return false;
                });
                if (isNullish) {
                    delete values["data"][key];
                }
            });
            closeModal();
            onSubmit({ "kich-thuoc": values });
        }
    };
    useEffect(() => {
        (async () => {
            var res = await getChecksheetList({machine_id: machine_id});
            setChecksheet(res.data);
        })();
    }, [machine_id]);
    useEffect(() => {
        form.resetFields();
    }, [checksheet, line]);
    const hanleClickOk = () => {
        form.setFieldValue("result", 1);
        form.submit();
    };
    const hanleClickNG = () => {
        form.setFieldValue("result", 2);
        form.submit();
    };
    return (
        <React.Fragment>
            <Button
                disabled={!selectedLot?.lot_id}
                danger={selectedLot?.phan_dinh === 2}
                size="large"
                className="w-100 text-wrap h-100"
                onClick={
                    selectedLot?.phan_dinh === 0
                        ? () => {
                            setOpen(true);
                        }
                        : null
                }
            >
                {text}
            </Button>
            <Modal
                title={"Kiểm tra"}
                open={open}
                onCancel={closeModal}
                footer={
                    <div className="justify-content-between d-flex">
                        <strong>Kết luận</strong>
                        <Space>
                            <Button
                                type="primary"
                                style={{ backgroundColor: "#55c32a" }}
                                onClick={hanleClickOk}
                            >
                                Duyệt
                            </Button>
                            <Button
                                type="primary"
                                style={{ backgroundColor: "#fb4b50" }}
                                onClick={hanleClickNG}
                            >
                                NG
                            </Button>
                        </Space>
                    </div>
                }
                width={700}
            >
                <Form form={form} onFinish={onFinish} colon={false}>
                    <Form.List name={"data"}>
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
                                                    {e.hang_muc}
                                                    {e?.note?.trim() && ". (" + e?.note + ")"}
                                                </div>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item noStyle name={[e.key, "value"]}>
                                                    <InputNumber
                                                        className=" text-center h-100 d-flex align-items-center justify-content-center"
                                                        inputMode="numeric"
                                                        placeholder="Nhập số"
                                                        min={0}
                                                        style={{ width: "100%" }}
                                                        onChange={(value) =>
                                                            form.setFieldValue(
                                                                ["data", e.key, "result"],
                                                                parseFloat(value) >=
                                                                    parseFloat(e.tieu_chuan) -
                                                                    parseFloat(e.delta) &&
                                                                    value <=
                                                                    parseFloat(e.tieu_chuan) +
                                                                    parseFloat(e.delta)
                                                                    ? 1
                                                                    : 0
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
                                                            name={[e.key, "result"]}
                                                            noStyle
                                                            className="w-100 h-100"
                                                        >
                                                            {!getFieldValue(["data", e.key, "value"]) ? (
                                                                <Button className="w-100 text-center h-100 d-flex align-items-center justify-content-center">
                                                                    OK/NG
                                                                </Button>
                                                            ) : getFieldValue(["data", e.key, "result"]) ? (
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
                                                    {e.hang_muc}
                                                    {e.tieu_chuan.trim() && ". (" + e.tieu_chuan + ")"}
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    name={[e.key, "id"]}
                                                    hidden
                                                    noStyle
                                                ></Form.Item>
                                                <Form.Item name={[e.key, "result"]} noStyle>
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
                                                            value={0}
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
                    <Divider></Divider>
                    <Form.Item name={"result"} hidden>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </React.Fragment>
    );
};

export default Checksheet2;
