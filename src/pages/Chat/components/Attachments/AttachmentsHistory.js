import React, { useEffect, useMemo, useState } from 'react';
import { Timeline, Row, Col, Image, Typography, Space, Button, message, Tabs, Segmented } from 'antd';
import dayjs from 'dayjs';
import { baseURL } from '../../../../config';
import { DownloadOutlined, EyeOutlined, FileExcelOutlined, FileGifOutlined, FileImageOutlined, FileJpgOutlined, FileOutlined, FilePdfOutlined, FilePptOutlined, FileWordOutlined, FileZipOutlined, RotateLeftOutlined, RotateRightOutlined, SwapOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { downloadFileMsg } from '../../../../api/ui/chat';
import { displayIconFileType, downloadFile } from '../../chat_helper';

const { Title, Text } = Typography;

export default function AttachmentsHistory({ type = '', mediaFiles }) {
    const images = mediaFiles?.image ?? [];
    const files = mediaFiles?.file ?? [];
    const links = mediaFiles?.link ?? [];
    const [selectedSegment, setSelectedSegment] = useState(type);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(()=>{
        setSelectedSegment(type)
    }, [type])

    useEffect(() => {
        switch (selectedSegment) {
            case 'image':
                setSelectedItems(images);
                break;
            case 'file':
                setSelectedItems(files);
                break;
            case 'link':
                setSelectedItems(links);
                break;
            default:
                setSelectedItems([]);
                break;
        }
    }, [selectedSegment]);

    const groups = useMemo(() => {
        const result = {};
        const newValues = [...selectedItems];
        newValues.sort((a, b) =>{
            if(!b?.created_at || !a?.created_at) return 0;
            return dayjs(b?.created_at).valueOf() - dayjs(a?.created_at).valueOf();
        }).forEach(msg => {
            const dateKey = new Date(msg.created_at).toDateString();
            if (!result[dateKey]) {
                result[dateKey] = [];
            }
            result[dateKey].push(msg);
        });

        return Object.entries(result).map(([date, items]) => {
            return {
                date,
                items,
            }
        });
    }, [selectedItems]);
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Segmented value={selectedSegment} block className="custom-equal-tabs" options={[
                { label: 'Ảnh', value: 'image' },
                { label: 'File', value: 'file' },
                { label: 'Link', value: 'link' },
            ]} onChange={setSelectedSegment} />
            <div style={{ padding: 16 }}>
                {groups.map(e => (
                    <div key={e.date} style={{ marginBottom: 32 }}>
                        {/* Tiêu đề ngày */}
                        <Title level={5} style={{ marginBottom: 16 }}>
                            {dayjs(e.date).format('DD [Tháng] M, YYYY')}
                        </Title>

                        {selectedSegment === 'image' && <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 2,
                            }}
                        >
                            <Image.PreviewGroup
                                preview={{
                                    toolbarRender: (
                                        _,
                                        {
                                            transform: { scale },
                                            actions: {
                                                onActive,
                                                onFlipY,
                                                onFlipX,
                                                onRotateLeft,
                                                onRotateRight,
                                                onZoomOut,
                                                onZoomIn,
                                                onReset,
                                            },
                                        },
                                    ) => (
                                        <Space size={12} className="toolbar-wrapper">
                                            {/* <LeftOutlined
                                          onClick={() => (onActive === null || onActive === void 0 ? void 0 : onActive(-1))}
                                        />
                                        <RightOutlined
                                          onClick={() => (onActive === null || onActive === void 0 ? void 0 : onActive(1))}
                                        /> */}
                                            {/* <DownloadOutlined onClick={onDownload} /> */}
                                            <SwapOutlined rotate={90} onClick={onFlipY} />
                                            <SwapOutlined onClick={onFlipX} />
                                            <RotateLeftOutlined onClick={onRotateLeft} />
                                            <RotateRightOutlined onClick={onRotateRight} />
                                            <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                                            <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                                            {/* <UndoOutlined onClick={onReset} /> */}
                                        </Space>
                                    ),
                                    // onChange: index => {
                                    //   setCurrent(index);
                                    // },
                                }}>
                                {(e?.items ?? []).map(img => (
                                    <div
                                        key={img.id}
                                        style={{
                                            width: '100%',
                                            aspectRatio: '1 / 1',      // ép ô vuông
                                            position: 'relative',
                                            overflow: 'hidden',
                                            borderRadius: 4,
                                        }}
                                    >
                                        <Image
                                            src={`${baseURL}/storage/${img.file_path}`}
                                            preview={{ mask: <EyeOutlined /> }}
                                            style={{
                                                width: '100%', height: '100%',
                                                objectFit: 'contain',
                                                border: '1px solid #00000020',
                                                borderRadius: 8
                                            }}
                                            wrapperStyle={{ display: 'flex', height: '100%' }}
                                        />
                                    </div>
                                ))}
                            </Image.PreviewGroup>
                        </div>}
                        {selectedSegment === 'file' && (e?.items ?? []).map(file => {
                            return <div
                                style={{
                                    // background: msg.isMine ? '#1890ff' : '#f0f0f0',
                                    // color: msg.isMine ? '#fff' : '#000',
                                    padding: '8px 12px',
                                    borderRadius: 8,
                                    marginBottom: 0,
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                {displayIconFileType(file?.file_type)}
                                <span
                                    style={{
                                        // color: msg.isMine ? '#ffffff' : '#1890ff',
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                        display: 'inline-block',
                                        maxWidth: '100%',           // hoặc giá trị phù hợp với giao diện của bạn
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        verticalAlign: 'middle'
                                    }}
                                    title={file?.file_name}
                                >
                                    {file?.file_name}
                                </span>
                                <Button type="default" icon={<DownloadOutlined style={{ fontSize: 18 }} />} size="small" style={{ marginLeft: 8 }} onClick={() => downloadFile(file)}></Button>
                            </div>
                        })}
                        {selectedSegment === 'link' && (e?.items ?? []).map(link => {
                            return <div style={{margin: '8px 0px'}}>
                                <div>
                                    <a href={link.file_path}>{link.file_path}</a>
                                </div>
                            </div>
                        })}
                    </div>
                ))}

                {/* footer tổng kết */}
                <Text type="secondary">
                    {selectedItems.length > 0 ? `Tổng cộng ${selectedItems.length} mục` : 'Không có mục nào'}
                </Text>
            </div>
        </div>
    );
}
