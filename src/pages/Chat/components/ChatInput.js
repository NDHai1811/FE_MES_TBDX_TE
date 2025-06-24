"use client"

import { Input, Button, Image as PreviewImage, Upload, Mentions } from "antd"
import { AudioOutlined, CloseCircleFilled, LoadingOutlined, PaperClipOutlined, PictureOutlined, SendOutlined } from "@ant-design/icons"
import { useState } from "react"
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
import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
// import 'tippy.js/dist/tippy.css';
import { MentionList } from "./Mentions/MentionList"

function ChatInput({ onSendMessage, onSendFileMessage, chatUsers = [] }) {
  const [messageInput, setMessageInput] = useState("")
  const [isSending, setIsSending] = useState(false);
  const [mentionUsers, setMentionUsers] = useState([]);
  const handleSendMessage = async () => {
    if (!isSending && (messageInput.trim() || images.length)) {
      const mewssage = messageInput.trim();
      const imagesList = images;
      setMessageInput("");
      setImages([]);
      setPreviews([]);
      setIsSending(true);
      await onSendMessage(mewssage, imagesList, mentionUsers);
      setIsSending(false);
      setMentionUsers([]);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          setImages(prev => [...prev, file]);
          const url = URL.createObjectURL(file);
          setPreviews(prev => [...prev, url]);
        }
      }
    }
  };

  const handleRemove = (indexToRemove) => {
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

  const MentionSuggestion = {
    items: ({ query }) => {
      return chatUsers.map(e => ({ ...e, label: e.name }))
        .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
    },
    render: () => {
      let reactRenderer
      let popup

      return {
        onStart: props => {
          console.log(props)
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
      StarterKit,
      Mention.configure({
        HTMLAttributes: { class: 'mention' },
        suggestion: MentionSuggestion,
      }),
    ],
    content: '',
  })
  function extractTextFromTiptapJSON(json) {
    if (!json || !Array.isArray(json)) return '';

    const walk = (nodes) => {
      return nodes.map(node => {
        if (node.type === 'text') return node.text || '';
        if (node.type === 'mention') return '@' + (node.attrs?.label ?? '');
        if (node.content) return walk(node.content); // 👈 KHÔNG .join('')
        return '';
      }).join(''); // 👈 chỉ join kết quả từ map()
    };

    return walk(json.content);
  }

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
      const json = editor.getJSON();
      const text = extractTextFromTiptapJSON(json);
      const mentions = extractMentionIds(json);

      const payload = {
        content_json: json,
        content_text: text,
        mentions: mentions,
        images: images
      };
      setMessageInput("");
      setImages([]);
      setPreviews([]);
      setIsSending(true);
      await onSendMessage(payload);
      setIsSending(false);
      setMentionUsers([]);
      editor.commands.clearContent();
    }
  };

  return (
    <div
      style={{
        padding: "16px 20px",
        borderTop: "1px solid #f0f0f0",
        backgroundColor: "white",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Upload {...uploadProps}><Button type="text" icon={<PaperClipOutlined />} loading={uploading} tabIndex={-1} shape="circle" style={{ color: "#1677ff", flexShrink: 0 }} /></Upload>

        <div style={{ flex: 1, position: "relative" }}>
          {/* <Mentions
            style={{ width: '100%', borderRadius: 20 }}
            value={messageInput}
            onChange={(val) => setMessageInput(val)}
            onSelect={(option) => {
              setMentionUsers((prev) => [...prev, option.value]);
            }}
            autoSize={{ minRows: 1, maxRows: 6 }}
            onPressEnter={handleKeyPress}
            placeholder="Aa"
            onPaste={handlePaste}
            options={chatUsers.map(e=>({...e, value: e.id, label: e.name}))}
          /> */}
          <div className="custom-antd-textarea">
            <EditorContent editor={editor} />
          </div>
          {previews.length > 0 && <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
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
          icon={isSending ? <LoadingOutlined spin /> : <SendOutlined />}
          onClick={handleSend}
          shape="circle"
          style={{ flexShrink: 0 }}
        />
        {/* ) : (
          <Button type="text" icon={<AudioOutlined />} style={{ color: "#1677ff", flexShrink: 0 }} />
        )} */}
      </div>
    </div>
  )
}

export default ChatInput
