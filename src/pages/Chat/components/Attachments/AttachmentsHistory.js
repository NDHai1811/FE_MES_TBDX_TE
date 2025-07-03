import React, { useMemo, useState } from 'react';
import { Timeline, Row, Col, Image, Typography, Space, Button, message } from 'antd';
import dayjs from 'dayjs';
import { baseURL } from '../../../../config';
import { DownloadOutlined, EyeOutlined, FileExcelOutlined, FileGifOutlined, FileImageOutlined, FileJpgOutlined, FileOutlined, FilePdfOutlined, FilePptOutlined, FileWordOutlined, FileZipOutlined, RotateLeftOutlined, RotateRightOutlined, SwapOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { downloadFileMsg } from '../../../../api/ui/chat';
import { displayIconFileType, downloadFile } from '../../chat_helper';

const { Title, Text } = Typography;

export default function AttachmentsHistory({ items = [], type = '', isShow = false }) {


    const groups = useMemo(() => {
        return items.reduce((acc, att) => {
            const day = dayjs(att.created_at).format('YYYY-MM-DD');
            if (!acc[day]) acc[day] = [];
            acc[day].push(att);
            return acc;
        }, {});
    }, [items]);

    // 2. Sort ngày mới xuống trên
    const dates = Object.keys(groups).sort((a, b) =>
        dayjs(b).valueOf() - dayjs(a).valueOf()
    );
    return (
        <div style={{ padding: 16 }}>
            {dates.map(date => (
                <div key={date} style={{ marginBottom: 32 }}>
                    {/* Tiêu đề ngày */}
                    <Title level={5} style={{ marginBottom: 16 }}>
                        {dayjs(date).format('DD [Tháng] M, YYYY')}
                    </Title>

                    {type === 'image' && <div
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
                            {(groups[date] ?? []).map(img => (
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
                    {type === 'file' && (groups[date] ?? []).map(file => {
                        return <div
                            style={{
                                padding: '8px',
                                borderRadius: 8,
                                marginBottom: 0,
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}
                        >
                            <div>
                                {displayIconFileType(file?.file_type)}
                                <span
                                    style={{
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {file?.file_name}
                                </span>
                            </div>
                            <Button type="default" icon={<DownloadOutlined style={{ fontSize: 18 }} />} size="small" style={{ marginLeft: 8 }} onClick={() => downloadFile(file)}></Button>
                        </div>
                    })}
                    {type === 'link' && (groups[date] ?? []).map(link => {
                        return <div>
                            <div>
                                <a href={link.file_path}>{link.file_path}</a>
                            </div>
                        </div>
                    })}
                </div>
            ))}

            {/* footer tổng kết */}
            <Text type="secondary">
                {items.length} mục trong năm {dayjs().year()}
            </Text>
        </div>
    );
}
