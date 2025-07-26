"use client"

import { Button, Image, Image as PreviewImage, Upload } from "antd"
import { CloseCircleFilled, CloseOutlined, LoadingOutlined, PaperClipOutlined, PictureOutlined, SendOutlined } from "@ant-design/icons"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import StarterKit from '@tiptap/starter-kit'
import Mention from '@tiptap/extension-mention'
import Link from '@tiptap/extension-link'
import { SmilieReplacer } from './Mentions/SmilieReplacer'
import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
// import 'tippy.js/dist/tippy.css';
import { MentionList } from "./Mentions/MentionList"
import echo from "../../../helpers/echo"
import { useProfile } from "../../../components/hooks/UserHooks"

function ChatInput({ chat, onSendMessage, chatUsers = [], replyMessage = null, setReplyMessage = () => { }, pendingFiles = [], setPendingFiles, handleRemoveFile }) {
  const { userProfile } = useProfile();
  const [isSending, setIsSending] = useState(false);

  const [uploading, setUploading] = useState(false);
  const uploadProps = {
    showUploadList: false,
    beforeUpload: (file) => {
      const newFile = {
        uid: file.uid,
        name: file.name,
        status: 'done',      // để AntD hiển thị luôn
        originFileObj: file,
        url: URL.createObjectURL(file), // preview ảnh
      }
      setPendingFiles(prev=>[...prev, newFile]);
      return false;
    },
    multiple: true,
  }

  const mentionUsersRef = useRef([])
  useEffect(() => {
    mentionUsersRef.current = chatUsers
  }, [chatUsers])

  const MentionSuggestion = {
    items: ({ query }) => {
      return mentionUsersRef.current.map(e => ({ ...e, label: e.name }))
        .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
    },
    render: () => {
      let reactRenderer
      let popup
      return {
        onStart: props => {
          if (!props.clientRect) {
            return
          }
          reactRenderer = new ReactRenderer(MentionList, {
            props,
            editor: props.editor,
          })
          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: reactRenderer.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          })
        },
        onUpdate(props) {
          reactRenderer.updateProps(props)

          if (!props.clientRect) {
            return
          }

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          })
        },
        onKeyDown(props) {
          if (props.event.key === 'Escape') {
            popup[0].hide()

            return true
          }

          return reactRenderer.ref?.onKeyDown(props)
        },
        onExit() {
          if (popup?.length <= 0) return;
          popup[0].destroy()
          reactRenderer.destroy()
        },
      }
    },
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Tắt chức năng hard break mặc định (Shift+Enter) nếu không muốn
        // hardBreak: false, 
      }),
      Mention.configure({
        HTMLAttributes: { class: 'mention' },
        suggestion: MentionSuggestion,
      }),
      Link.configure({
        HTMLAttributes: { class: 'link' },
        openOnClick: true,
        linkOnPaste: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        isAllowedUri: (url, ctx) => ctx.defaultValidate(url) && !url.startsWith('./'),
        // shouldAutoLink: (url) => url.startsWith('https://'),
        onUpdate({ editor }) {
          const { state } = editor
          const { selection } = state

          // Nếu người dùng vừa gõ dấu cách
          const prevChar = selection.$from.nodeBefore?.text?.slice(-1)

          if (prevChar === ' ') {
            // Kiểm tra xem con trỏ đang ở trong liên kết không
            const marks = selection.$from.marks()
            const isInLink = marks.some(mark => mark.type.name === 'link')

            if (isInLink) {
              // Bỏ link để phần sau gõ ra là text thường
              editor.commands.unsetMark('link')
            }
          }
        },
      }),
      SmilieReplacer,
    ],
    editorProps: {
      handleKeyDown: (view, event) => {
        handleTyping()
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          handleSend();
          return true; // Ngăn không cho Tiptap xử lý tiếp
        }
        return false; // Để Tiptap xử lý (vd: Shift+Enter)
      },
      handlePaste: (view, event, slice) => {
        const items = event.clipboardData.items;
        const files = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.kind === 'file') {
            const file = item.getAsFile();
            if (file) {
              files.push({
                uid: `${Date.now()}-${i}`,
                name: file.name || `clipboard-file-${i}`,
                status: 'done',
                originFileObj: file,
                url: URL.createObjectURL(file),
              });
            }
          }
        }
        if (files.length > 0) {
          setPendingFiles((prev) => [...prev, ...files]);
          return true; // Ngăn Tiptap xử lý tiếp (chèn base64)
        }
        return false; // Để Tiptap xử lý mặc định (dán text)
      },
    },
    content: '',
  })

  function extractMentionIds(json) {
    if (!json || !json.content) return [];

    const ids = new Set();

    const walk = (nodes) => {
      nodes.forEach(node => {
        if (node.type === 'mention' && node.attrs?.id) {
          ids.add(node.attrs.id);
        } else if (node.content) {
          walk(node.content);
        }
      });
    };

    walk(json.content);
    return Array.from(ids);
  }

  const handleSend = async () => {
    if (!isSending) {
      const allLinks = new Set() // dùng Set để tránh trùng lặp
      editor.state.doc.descendants((node) => {
        if (node.marks) {
          node.marks.forEach((mark) => {
            if (mark.type.name === 'link' && mark.attrs?.href) {
              allLinks.add(mark.attrs.href)
            }
          })
        }
      })

      const json = editor.getJSON();
      const text = editor.getText();
      if (!text.trim() && pendingFiles.length === 0) {
        return;
      }
      const mentions = extractMentionIds(json);
      const links = Array.from(allLinks);

      const payload = {
        content_json: json,
        content_text: text,
        mentions: mentions,
        links: links,
        files: pendingFiles,
        reply_to_message_id: replyMessage?.id,
      };
      setPendingFiles([]);
      setIsSending(true);
      await onSendMessage(payload);
      setIsSending(false);
      setReplyMessage();
      editor.commands.clearContent();
      editor.commands.unsetLink();
    }
  };

  useEffect(() => {
    setPendingFiles([]);
    setIsSending(false);
    setReplyMessage();
    editor.commands.clearContent();
    editor.commands.unsetLink();
  }, [chat]);

  const typingTimeoutRef = useRef(null);

  const handleTyping = () => {
    // Gửi whisper "typing"
    echo.join(`presence-chat.${chat?.id}`)
      .whisper('typing', {
        user_id: userProfile.id,
        user_name: userProfile.name,
      });

    // Xoá trạng thái sau 3 giây nếu không gõ tiếp
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      echo.join(`presence-chat.${chat?.id}`)
        .whisper('typing', {
          user_id: null,
        });
    }, 3000);
  };

  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    const channel = echo.join(`presence-chat.${chat?.id}`);

    channel.listenForWhisper('typing', (payload) => {
      if (payload.user_id) {
        setTypingUser(payload.user_name);

        // 🔁 Xoá timeout cũ nếu có
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // ⏱ Thiết lập timeout mới
        typingTimeoutRef.current = setTimeout(() => {
          setTypingUser(null);
          typingTimeoutRef.current = null;
        }, 2000);
      } else {
        setTypingUser(null);
      }
    });

    return () => {
      channel.stopListeningForWhisper('typing');

      // Xoá timeout nếu có khi unmount
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chat?.id]);

  useEffect(() => {
    if (replyMessage) {
      console.log(replyMessage);
    }
  }, [replyMessage]);

  return (
    <div
      style={{
        padding: 12,
        borderTop: "1px solid #f0f0f0",
        backgroundColor: "white",
        position: 'relative'
      }}
    >
      {typingUser && (
        <div style={{ position: 'absolute', top: '-25px', left: '10px', height: 20 }}>
          💬 {typingUser} đang gõ...
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", width: '100%', flexDirection: 'column' }}>
        {replyMessage && (
          <div style={{
            width: '100%',
            background: '#e6f4ff',
            border: '1px solid #91d5ff',
            borderRadius: 6,
            padding: 8,
            position: 'relative'
          }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 13, color: '#1890ff', fontWeight: 500, marginBottom: 2 }}>
                Trả lời {replyMessage.sender?.name || ''}
              </div>
              <CloseOutlined onClick={() => setReplyMessage(null)} style={{ cursor: 'pointer' }} />
            </div>
            <div style={{
              color: '#00000087',
              fontSize: 14,
              marginBottom: 2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%' // hoặc giá trị phù hợp với giao diện của bạn
            }}>
              {replyMessage?.type === 'image' ? <><PictureOutlined />Hình ảnh</> : replyMessage?.type === 'file' ? <><PaperClipOutlined />{(replyMessage.attachments[0].file_name ?? '')}</> : replyMessage.content_text}
            </div>

          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 8, alignItems: 'end' }}>
          <Upload {...uploadProps} style={{ width: '10%' }}><Button size="large" icon={<PaperClipOutlined />} loading={uploading} tabIndex={-1} shape="circle" style={{ color: "#1677ff", flexShrink: 0 }} /></Upload>
          <div style={{ flex: 1, position: "relative", width: '80%' }}>
            <div style={{ marginBottom: pendingFiles.length > 0 ? 8 : 0, display: 'flex' }}>
              <PendingFilesPreview
                fileList={pendingFiles}
                onRemove={handleRemoveFile}
                chat={chat}
              />
            </div>
            <div className="custom-antd-textarea">
              <EditorContent editor={editor} />
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            loading={isSending}
            icon={<SendOutlined />}
            onClick={handleSend}
            shape="circle"
            style={{ flexShrink: 0 }}
          ></Button>
        </div>
      </div>
    </div>
  )
}

export default ChatInput

const PendingFilesPreview = ({ fileList, onRemove, chat }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  useEffect(()=>{
    setPreviewOpen(false);
    setPreviewImage('');
  }, [chat])
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const handlePreview = async (file) => {
    if (file.originFileObj.type && file.originFileObj.type.startsWith('image/')) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
    } else {
      return false;
    }
  };
  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        showUploadList={true}
        isImageUrl={(file)=>file.originFileObj.type && file.originFileObj.type.startsWith('image/') ? true : false}
        onRemove={onRemove}
        beforeUpload={() => false} // không cho upload mới
        openFileDialogOnClick={false} // không mở chọn file khi click
        onPreview={handlePreview}
      />
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};