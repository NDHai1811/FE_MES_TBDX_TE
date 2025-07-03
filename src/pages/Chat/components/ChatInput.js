"use client"

import { Button, Image as PreviewImage, Upload } from "antd"
import { CloseCircleFilled, LoadingOutlined, PaperClipOutlined, SendOutlined } from "@ant-design/icons"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import StarterKit from '@tiptap/starter-kit'
import Mention from '@tiptap/extension-mention'
// import Image from '@tiptap/extension-image'
// import TextStyle from '@tiptap/extension-text-style'
// import Color from '@tiptap/extension-color'
// import Highlight from '@tiptap/extension-highlight'
// import BulletList from '@tiptap/extension-bullet-list'
// import ListItem from '@tiptap/extension-list-item'
// import Strike from '@tiptap/extension-strike'
// import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Link from '@tiptap/extension-link'
import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
// import 'tippy.js/dist/tippy.css';
import { MentionList } from "./Mentions/MentionList"
import echo from "../../../helpers/echo"
import { useProfile } from "../../../components/hooks/UserHooks"

function ChatInput({ chat, onSendMessage, onSendFileMessage, chatUsers = [] }) {
  const { userProfile } = useProfile();
  const [isSending, setIsSending] = useState(false);

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleRemove = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const [uploading, setUploading] = useState(false);
  const uploadProps = {
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      setUploading(true);
      await onSendFileMessage(file);
      setUploading(false);
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
        let imagePasted = false;
        for (const item of items) {
          if (item.type.indexOf("image") !== -1) {
            const file = item.getAsFile();
            if (file) {
              setImages(prev => [...prev, file]);
              const url = URL.createObjectURL(file);
              setPreviews(prev => [...prev, url]);
              imagePasted = true;
            }
          }
        }
        if (imagePasted) {
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
      if (!text.trim() && images.length === 0) {
        return;
      }
      const mentions = extractMentionIds(json);
      const links = Array.from(allLinks);

      const payload = {
        content_json: json,
        content_text: text,
        mentions: mentions,
        images: images,
        links: links,
      };
      setImages([]);
      setPreviews([]);
      setIsSending(true);
      await onSendMessage(payload);
      setIsSending(false);
      editor.commands.clearContent();
      editor.commands.unsetLink();
    }
  };

  useEffect(() => {
    setImages([]);
    setPreviews([]);
    setIsSending(false);
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

  return (
    <div
      style={{
        padding: "16px 20px",
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
      <div style={{ display: "flex", alignItems: "center", gap: "8px", width: '100%' }}>
        <Upload {...uploadProps} style={{ width: '10%' }}><Button size="large" icon={<PaperClipOutlined />} loading={uploading} tabIndex={-1} shape="circle" style={{ color: "#1677ff", flexShrink: 0 }} /></Upload>

        <div style={{ flex: 1, position: "relative", width: '80%' }}>
          <div className="custom-antd-textarea">
            <EditorContent editor={editor} />
          </div>
          {previews.length > 0 && <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap", maxHeight: 400, overflowY: 'auto', paddingTop: 8 }}>
            {previews.map((src, idx) => (
              <div
                key={idx}
                style={{
                  position: "relative",
                  width: 100,
                  height: 100,
                }}
                className="image-wrapper"
              >
                <PreviewImage
                  src={src}
                  alt={`Pasted ${idx}`}
                  width={100}
                  height={100}
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: 8,
                    objectFit: "contain",
                  }}
                  preview={{ mask: "Nhấn để xem" }} // vẫn giữ chức năng preview
                />
                <CloseCircleFilled
                  onClick={() => handleRemove(idx)}
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    fontSize: 18,
                    color: "#ff0000cc",
                    background: "white",
                    borderRadius: "50%",
                    cursor: "pointer",
                    zIndex: 99
                  }}
                  className="remove-icon"
                />
              </div>
            ))}
          </div>}
        </div>
        {/* {messageInput.trim() ? ( */}
        <Button
          type="primary"
          size="large"
          icon={isSending ? <LoadingOutlined spin /> : <SendOutlined />}
          onClick={handleSend}
          shape="circle"
          style={{ flexShrink: 0 }}
        ></Button>
        {/* ) : (
          <Button type="text" icon={<AudioOutlined />} style={{ color: "#1677ff", flexShrink: 0 }} />
        )} */}
      </div>
    </div>
  )
}

export default ChatInput
