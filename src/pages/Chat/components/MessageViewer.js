import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Mention from '@tiptap/extension-mention'
import Link from '@tiptap/extension-link'
// import Image from '@tiptap/extension-image'

export default function MessageViewer({ contentJson }) {
    const editor = useEditor({
      content: contentJson,
      editable: false,
      extensions: [
        StarterKit,
        Mention.configure({
          HTMLAttributes: {
            class: 'mention',
          },
        }),
        Link.configure({
          HTMLAttributes: {
            class: 'link',
          },
        }),
      ],
    })
  
    return <EditorContent editor={editor} />
  }