import { Button, Col, Input, Modal, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { ArrowDownOutlined, ArrowUpOutlined, SearchOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";
const OISearchBox = (props) => {
    const { data = [], setSearchedTarget, searchedTarget, setSearchedList, searchedList = [] } = props;
    const [filter, setFilter] = useState({ mdh: "" });
    const [openSearchModal, setOpenSearchModal] = useState(false);
    const [searching, setSearching] = useState(false);
    const onSearchingUp = () => {
        const targetIndex = searchedList.indexOf(searchedTarget);
        if (targetIndex > 0) {
            setSearchedTarget(searchedList[targetIndex - 1]);
        } else {
            setSearchedTarget(searchedList[0]);
        }
    }
    const onSearchingDown = () => {
        const targetIndex = searchedList.indexOf(searchedTarget);
        if (targetIndex < searchedList.length - 2) {
            setSearchedTarget(searchedList[targetIndex + 1]);
        } else {
            setSearchedTarget(searchedList[searchedList.length - 1]);
        }
    }
    useEffect(() => {
        setSearching(true);
        delayedSearch(filter);
    }, [filter]);

    useEffect(() => {
        if (openSearchModal) {
            delayedSearch(filter);
        } else {
            setSearchedList([]);
            setSearchedTarget(null);
        }
    }, [openSearchModal]);

    const delayedSearch = useCallback(debounce((filter) => {
        const result = data.filter(record => {
            for (var key in filter) {
                if (!filter[key]) return false;
                if (record[key] === undefined || (record[key] ?? "").toString().indexOf(filter[key]) === -1) return false;
            }
            return true;
        });
        if (searchedTarget) {
            result.findIndex((e, i) => i)
        }
        const targetIndex = result.indexOf(searchedTarget);
        if (targetIndex > 0) {
            setSearchedTarget(result[targetIndex - 1]);
        } else {
            setSearchedTarget(result[0]);
        }
        setSearchedList(result);
        setSearching(false);
    }, 1000), [data]);

    const resultAsText = () => {
        const targetIndex = searchedList.indexOf(searchedTarget);
        const total = searchedList.length;
        return `${(targetIndex + 1) ?? 0} trên ${total} đã tìm thấy`;
    }
    return (
        <React.Fragment>
            <Button
                size="medium"
                type="primary"
                style={{ width: "100%", height: '100%', textWrap: 'wrap' }}
                onClick={() => setOpenSearchModal(!openSearchModal)}
                icon={<SearchOutlined />}
            >{"Tìm kiếm"}</Button>
            <Modal title="Tìm kiếm" open={openSearchModal} onCancel={() => setOpenSearchModal(false)}
                footer={null}
                mask={false}
                wrapClassName={"disable-overlay"}
                maskClosable={false}
                getContainer={false}
            >
                <Row gutter={[8, 8]} style={{ display: 'flex', alignItems: 'center' }}>
                    <Col span={12}>
                        <Input.Search loading={searching} addonBefore={"MĐH"} style={{ width: '100%' }} value={filter.mdh} allowClear onChange={(e) => setFilter({ ...filter, mdh: e.target.value })} />
                    </Col>
                    <Col span={2}>
                        <Button icon={<ArrowUpOutlined />} type="primary" onClick={onSearchingUp} title="Tìm lên trên" />
                    </Col>
                    <Col span={2}>
                        <Button icon={<ArrowDownOutlined />} type="primary" onClick={onSearchingDown} title="Tìm xuống dưới" />
                    </Col>
                    <Col span={8}>
                        {resultAsText()}
                    </Col>
                </Row>
            </Modal>
        </React.Fragment>
    );
};

export default OISearchBox;
