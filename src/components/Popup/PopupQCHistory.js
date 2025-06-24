import {
    Form,
    Modal,
    Row,
    Col,
    Button,
    Select,
    Space,
    InputNumber,
    Input,
    message,
    Tooltip,
    Radio,
    Table,
} from "antd";
import React, { useState } from "react";
import "./popupStyle.scss";
import { useEffect } from "react";
import { getChecksheetList, getIQCChecksheetList } from "../../api/oi/quality";
import { EyeOutlined } from "@ant-design/icons";
import { getQCDetailHistory } from "../../api/ui/quality";
const PopupQCHistory = (props) => {
    const {
        infoId,
    } = props;
    const closeModal = () => {
        setIsOpen(false);
    };

    const [isOpen, setIsOpen] = useState(false);
    const onOpen = () => {
        fetchQCHistory();
    }
    const [qcDetailHistory, setQCDetailHistory] = useState();

    const fetchQCHistory = async () => {
        var res = await getQCDetailHistory({ info_id: infoId });
        if (res.success) {
            setIsOpen(true);
            setQCDetailHistory(res.data);
        } else {
            setQCDetailHistory(res.data);
        }

    }

    useEffect(() => {
        console.log(qcDetailHistory);
    }, [qcDetailHistory]);

    const columns = [
        {
            title: "Mã lỗi",
            dataIndex: "id",
            align: "center",
            width: 20
        },
        {
            title: "Tên lỗi",
            dataIndex: "name",
            align: "center",
            width: 60
        },
        {
            title: "Giá trị",
            dataIndex: "value",
            align: "center",
            width: 20,
            render: (value, record) => record?.input_type === 'radio' ? (record.result === 1 ? 'OK' : 'NG') : (value ?? null)
        },
    ]
    return (
        <React.Fragment>
            <EyeOutlined className="edit-btn" onClick={() => onOpen()} />
            <Modal
                title={"Lịch sử kiểm tra"}
                open={isOpen}
                onCancel={closeModal}
                centered
                styles={{ body: { maxHeight: 500, overflowX: 'hidden', overflowY: 'auto', paddingRight: 8 } }}
                width={500}
                style={{ top: 8 }}
            >
                <Row gutter={[8, 8]}>
                    {qcDetailHistory?.info?.tinh_nang ? <>
                        <Col span={24}>
                            Kiểm tra tính năng:
                        </Col>
                        <Col span={24}>
                            {
                                (qcDetailHistory?.info?.tinh_nang &&
                                    <Table size="small" bordered dataSource={qcDetailHistory?.info?.tinh_nang ?? []} columns={columns} pagination={false} locale={{emptyText: 'Trống'}}/>
                                )
                            }
                        </Col>
                    </> : null}
                    {qcDetailHistory?.info?.ngoai_quan ? <>
                        <Col span={24}>
                            Kiểm tra ngoại quan:
                        </Col>
                        <Col span={24}>
                            {
                                (qcDetailHistory?.info?.ngoai_quan &&
                                    <Table size="small" bordered dataSource={qcDetailHistory?.info?.ngoai_quan ?? []} columns={columns} pagination={false} locale={{emptyText: 'Trống'}}/>
                                )
                            }
                        </Col>
                    </> : null}
                    {qcDetailHistory?.info?.sl_ng_qc ? <Col span={24}>Số phế: <strong>{qcDetailHistory?.info?.sl_ng_qc}</strong></Col> : null}
                    {qcDetailHistory?.info?.phan_dinh ? <Col span={24}>Phán định: <strong>{qcDetailHistory?.info?.phan_dinh === 1 ? 'OK' : 'NG'}</strong></Col> : null}

                </Row>
            </Modal>
        </React.Fragment>
    );
};

export default PopupQCHistory;
