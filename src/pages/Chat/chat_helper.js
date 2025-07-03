import { message } from "antd";
import { downloadFileMsg } from "../../api/ui/chat";
import { DownloadOutlined, EyeOutlined, FileExcelOutlined, FileGifOutlined, FileImageOutlined, FileJpgOutlined, FileOutlined, FilePdfOutlined, FilePptOutlined, FileWordOutlined, FileZipOutlined, RotateLeftOutlined, RotateRightOutlined, SwapOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';

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
    for (let i = 0; i < name.length ?? 0; i++) {
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