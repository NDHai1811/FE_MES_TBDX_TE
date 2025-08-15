import { message } from "antd";
import { downloadFileMsg } from "../../api/ui/chat";
import { DownloadOutlined, EyeOutlined, FileExcelOutlined, FileGifOutlined, FileImageOutlined, FileJpgOutlined, FileOutlined, FilePdfOutlined, FilePptOutlined, FileWordOutlined, FileZipOutlined, PaperClipOutlined, PictureOutlined, RotateLeftOutlined, RotateRightOutlined, SwapOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';

export const downloadFile = async (file) => {
    document.body.style.cursor = 'progress';
    try {
        const response = await downloadFileMsg(`/download/${file.file_path}`); // trả về blob
        console.log(response)
        if (!(response instanceof Blob)) {
            message.error('Không thể tải file');
            return;
        }
        const blob = new Blob([response]); // response.data là dữ liệu blob

        // Tạo URL tạm
        const url = window.URL.createObjectURL(blob);

        // Tạo thẻ <a> và kích hoạt tải
        const a = document.createElement('a');
        a.href = url;
        a.download = file.file_name;
        document.body.appendChild(a);
        a.click();

        // Dọn dẹp
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('File download error:', error);
        message.error('Tải file thất bại.');
    } finally {
        document.body.style.cursor = 'default';
    }
};

export const displayIconFileType = (fileType = '') => {
    const iconStyle = { fontSize: 26 }
    if (!fileType) {
        return null;
    }
    if (fileType.includes('officedocument.spreadsheetml.sheet') || fileType.includes('excel')) {
        return <FileExcelOutlined style={iconStyle} />;
    } else if (fileType.includes('msword')) {
        return <FileWordOutlined style={iconStyle} />;
    } else if (fileType.includes('pdf')) {
        return <FilePdfOutlined style={iconStyle} />;
    } else if (fileType.includes('png')) {
        return <FileImageOutlined style={iconStyle} />;
    } else if (fileType.includes('jpeg') || fileType.includes('jpg')) {
        return <FileJpgOutlined style={iconStyle} />;
    } else if (fileType.includes('gif')) {
        return <FileGifOutlined style={iconStyle} />;
    } else if (fileType.includes('officedocument.presentationml.presentation')) {
        return <FilePptOutlined style={iconStyle} />;
    } else if (fileType.includes('zip') || fileType.includes('rar')) {
        return <FileZipOutlined style={iconStyle} />;
    } else if (fileType.includes('rar')) {
        return <FileZipOutlined style={iconStyle} />;
    } else {
        return <FileOutlined style={iconStyle} />;
    }
}

export function fullNameToColor(name = '') {
    let hash = 0;
    for (let i = 0; i < name?.length ?? 0; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash); // hash = hash * 31 + char
    }

    const hue = Math.abs(hash) % 360; // Màu chính (0–359)
    const saturation = 60; // % Độ đậm màu (gợi ý 50–70%)
    const lightness = 65;  // % Độ sáng (gợi ý 60–80%)

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function removeVietnameseTones(str) {
    return str.normalize('NFD') // tách tổ hợp chữ + dấu
        .replace(/[\u0300-\u036f]/g, '') // loại bỏ dấu
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .toLowerCase();
}

export function filterUsersByName(users, keyword) {
    const keywordNormalized = removeVietnameseTones(keyword);
    return users.filter(user =>
        removeVietnameseTones(user.name).includes(keywordNormalized)
    );
}

export function getDescriptionMessage(message, chat, user ) {
    if (!message) return '';
    let prefix = '';
    if (message.sender_id == user.id) {
        prefix = 'Bạn: ';
    } else {
        if(message.reply_to && message.reply_to.sender_id == user.id){
            return message.sender?.name + ' đã trả lời bạn: ' + message.content_text
        } else if (message.sender && chat.type === 'group') {
            prefix = `${message.sender?.name || ''}: `;
        }
    }
    let content = '';
    if (message) {
        if(message.deleted_at){
            content = 'Tin nhắn đã bị thu hồi.';
        }else{
            if((message?.attachments ?? []).length > 0){
                const sentFile = message?.attachments[0];
                if (sentFile.type === 'image') {
                    content = <><PictureOutlined />Hình ảnh</>;
                } else if (sentFile.type === 'file') {
                    content = <><PaperClipOutlined />{(sentFile.file_name ?? '')}</>;
                } 
            } else {
                content = message.content_text ?? 'Đã gửi một tin nhắn';
            }
        }
    }
    return <span style={{fontWeight: (chat.unread_count && !message.deleted_at) ? 'bold' : 'normal'}}>{prefix} {content}</span>;
}

// Utility function để format thời gian dạng "from now"
export const formatTimeFromNow = (dateString) => {
    if (!dateString) return '';
    
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Vừa xong';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} phút trước`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} giờ trước`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} ngày trước`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4 || Math.floor(diffInDays / 30) < 1) {
        return `${diffInWeeks} tuần trước`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} tháng trước`;
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} năm trước`;
};