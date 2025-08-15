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
import echo, { getEcho } from "../../../helpers/echo"
import { useProfile } from "../../../components/hooks/UserHooks"
import { useDispatch, useSelector } from "react-redux"
import { getFiles, sendMessage } from "../../../api/ui/chat"
import { addMessage, setChats, setFilesInActiveChat } from "../../../store/chat/chatSlice"

function ChatInput({ chatUsers = [], replyMessage = null, setReplyMessage = () => { }, pendingFiles = [], setPendingFiles, handleRemoveFile }) {
  const { userProfile } = useProfile();
  const echo = getEcho();
  const dispatch = useDispatch();
  const [isSending, setIsSending] = useState(false);
  const { chats, activeChat, activeChatId } = useSelector(state => state.chatSlice);

  const chatRef = useRef(null);
  useEffect(()=>{
    chatRef.current = activeChat
  }, [activeChat])

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
      setPendingFiles(prev => [...prev, newFile]);
      editor.commands.focus();
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
    editorProps: {
      handleKeyDown: (view, event) => {
        handleTyping();
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
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
          setReplyMessage();
          if (text.trim() || pendingFiles.length === 0) {
            handleSendMessage(payload);
          }
          editor.commands.clearContent();
          editor.commands.unsetLink();
          editor.commands.focus();
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
    extensions: [
      StarterKit.configure({
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
      setIsSending(false);
      setReplyMessage();
      editor.commands.clearContent();
      editor.commands.unsetLink();
      await handleSendMessage(payload);
      editor.commands.focus();
    }
  };

  const handleSendMessage = async (message) => {
    // Tạo form data để gửi
    const formData = new FormData();
    formData.append("chat_id", activeChat?.id);
    formData.append("content_json", JSON.stringify(message.content_json));
    formData.append("content_text", message.content_text);
    (message.mentions ?? []).forEach((user, idx) => {
      formData.append(`mentions[${idx}]`, user);
    });
    (message.links ?? []).forEach(link => {
      formData.append('links[]', link);
    });
    if (message?.reply_to_message_id) {
      formData.append('reply_to_message_id', message?.reply_to_message_id);
    }

    // Gửi text message trước
    if (message.content_text) {
      var res = await sendMessage(formData, activeChat?.id);
      if (res.success && res.data) {
        const msg = res.data;
        dispatch(addMessage({ ...msg, isMine: msg.sender_id == userProfile?.id }));
        dispatch(setChats(chats.map(e => e.id === msg.chat_id ? { ...e, last_message: msg } : e)));
        fetchFilesInChat(activeChatId);
      }
    }

    // Nhóm files liền kề theo loại
    const fileGroups = [];
    let currentGroup = [];
    let currentType = null;

    (message.files ?? []).forEach(file => {
      const isImage = file.originFileObj.type.startsWith('image/');

      if (currentType === null) {
        // Nhóm đầu tiên
        currentType = isImage ? 'image' : 'file';
        currentGroup = [file];
      } else if (currentType === 'image' && isImage) {
        // Tiếp tục nhóm ảnh
        currentGroup.push(file);
      } else if (currentType === 'file' && !isImage) {
        // Tiếp tục nhóm file
        currentGroup.push(file);
      } else {
        // Thay đổi loại, lưu nhóm cũ và tạo nhóm mới
        fileGroups.push({ type: currentType, files: currentGroup });
        currentType = isImage ? 'image' : 'file';
        currentGroup = [file];
      }
    });

    // Thêm nhóm cuối cùng
    if (currentGroup.length > 0) {
      fileGroups.push({ type: currentType, files: currentGroup });
    }

    // Gửi từng nhóm
    for (const group of fileGroups) {
      const formData = new FormData();
      formData.append("chat_id", activeChat?.id);

      group.files.forEach(file => {
        formData.append(`files[]`, file.originFileObj);
      });

      var res = await sendMessage(formData, activeChat?.id);
      if (res.success && res.data) {
        const msg = res.data;
        dispatch(addMessage({ ...msg, isMine: msg.sender_id == userProfile?.id }));
        dispatch(setChats(chats.map(e => e.id === msg.chat_id ? { ...e, last_message: msg } : e)));
        fetchFilesInChat(activeChatId);
      }
    }
  }

  useEffect(() => {
    setPendingFiles([]);
    setIsSending(false);
    setReplyMessage();
    editor.commands.clearContent();
    editor.commands.unsetLink();
    editor.commands.focus();
  }, [activeChat, editor]);

  const typingTimeoutRef = useRef(null);

  const handleTyping = () => {
    // Gửi whisper "typing"
    echo.join(`presence-chat.${activeChatId}`)
      .whisper('typing', {
        user_id: userProfile.id,
        user_name: userProfile.name,
      });

    // Xoá trạng thái sau 3 giây nếu không gõ tiếp
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      echo.join(`presence-chat.${activeChatId}`)
        .whisper('typing', {
          user_id: null,
        });
    }, 3000);
  };

  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    const channel = echo.join(`presence-chat.${activeChatId}`);

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
  }, [activeChatId]);

  const fetchFilesInChat = async (chat_id) => {
    console.log('prepare get files');
    if (!window.location.pathname.includes('ui/chat/' + chat_id)) return;
    const res = await getFiles({}, chat_id);
    if (res.success) {
      dispatch(setFilesInActiveChat(res.data))
    }
    console.log('got files');
  }

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
              {replyMessage?.attachments?.length > 0
                ? (
                  replyMessage.attachments[0].file_type?.includes('image/')
                    ? <><PictureOutlined /> Hình ảnh</>
                    : <><PaperClipOutlined />{replyMessage.attachments[0].file_name ?? ''}</>
                )
                : replyMessage?.content_text
              }
            </div>

          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 8, alignItems: 'end' }}>
          <Upload {...uploadProps} style={{ width: '10%' }}><Button size="large" icon={<PaperClipOutlined />} tabIndex={-1} shape="circle" style={{ color: "#1677ff", flexShrink: 0 }} /></Upload>
          <div style={{ flex: 1, position: "relative", width: '80%' }}>
            <div style={{ marginBottom: pendingFiles.length > 0 ? 8 : 0, display: 'flex' }}>
              <PendingFilesPreview
                fileList={pendingFiles}
                onRemove={handleRemoveFile}
                chat={activeChat}
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
  useEffect(() => {
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
        isImageUrl={(file) => file.originFileObj.type && file.originFileObj.type.startsWith('image/') ? true : false}
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