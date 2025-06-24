import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Mention from '@tiptap/extension-mention'
// import Image from '@tiptap/extension-image'

export default function MessageViewer({ contentJson }) {
    console.log(contentJson);
    
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
        // Image,
      ],
    })
  
    return <EditorContent editor={editor} />
  }