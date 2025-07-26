import { useState, useEffect, useRef } from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const ChatWithDragDrop = ({ children, onFilesDropped }) => {
  const [dragActive, setDragActive] = useState(false);
  const wrapperRef = useRef(null);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFiles = (files) => {
    // Gọi callback để parent xử lý, không upload ở đây
    if (onFilesDropped) {
      onFilesDropped(Array.from(files));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!dragActive) setDragActive(true);
  };

  const handleDragLeave = (e) => {
    if (
      !wrapperRef.current ||
      (e.relatedTarget && !wrapperRef.current.contains(e.relatedTarget))
    ) {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    console.log('Dropped files', e.dataTransfer.files);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const uploadProps = {
    openFileDialogOnClick: false, // không mở chọn file khi click
    beforeUpload: (file) => {
      console.log(file);
      setFileList([...fileList, file]);
      return false;
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    showUploadList: false,
    multiple: true,
    customRequest: ({ file, onSuccess }) => onSuccess(), // required by Antd but not used
    onDrop: handleDrop,
  };

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'relative', height: '100%', display:'contents' }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Nội dung chat */}
      {children}

      {/* Overlay kéo & thả */}
      {dragActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 999999999,
            background: 'rgba(255,255,255,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto',
          }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <Dragger {...uploadProps} style={{ width: 400, padding: 30 }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Thả file vào đây để gửi</p>
          </Dragger>
        </div>
      )}
    </div>
  );
};

export default ChatWithDragDrop;
