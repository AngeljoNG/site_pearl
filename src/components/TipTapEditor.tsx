import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Trash2,
  MinusSquare,
  PlusSquare,
  RotateCcw,
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

// Custom Image extension with resizing
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: attributes => ({
          width: attributes.width,
          style: `width: ${attributes.width}px`,
        }),
      },
      height: {
        default: null,
        renderHTML: attributes => ({
          height: attributes.height,
          style: `height: ${attributes.height}px`,
        }),
      },
      originalWidth: {
        default: null,
      },
      originalHeight: {
        default: null,
      },
    };
  },
});

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow,
      TableHeader,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-nature-200 p-2',
        },
      }),
      ResizableImage.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full rounded cursor-pointer',
        },
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px]',
      },
      handlePaste: (view, event, slice) => {
        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;

        // Handle images
        const items = Array.from(clipboardData.items);
        const imageItem = items.find(item => item.type.startsWith('image/'));
        
        if (imageItem) {
          const file = imageItem.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result;
              if (typeof result === 'string') {
                const tempImg = document.createElement('img');
                tempImg.onload = () => {
                  view.dispatch(view.state.tr.replaceSelectionWith(
                    view.state.schema.nodes.image.create({
                      src: result,
                      width: tempImg.naturalWidth,
                      height: tempImg.naturalHeight,
                      originalWidth: tempImg.naturalWidth,
                      originalHeight: tempImg.naturalHeight,
                    })
                  ));
                };
                tempImg.src = result;
              }
            };
            reader.readAsDataURL(file);
            return true;
          }
        }

        return false;
      },
      handleClick: (view, pos, event) => {
        const node = view.state.doc.nodeAt(pos);
        if (node?.type.name === 'image') {
          const target = event.target as HTMLImageElement;
          if (!target.closest('.image-controls')) {
            const coords = view.coordsAtPos(pos);
            showImageControls(target, coords, pos, node.attrs);
          }
          return true;
        }
        return false;
      },
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL du lien', previousUrl);
    if (url === null) {
      return;
    }
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  };

  // Function to show image controls
  const showImageControls = (
    imageElement: HTMLImageElement,
    coords: { top: number; left: number },
    pos: number,
    attrs: any
  ) => {
    // Remove any existing controls
    const existingControls = document.querySelector('.image-controls');
    if (existingControls) {
      existingControls.remove();
    }

    // Create controls container
    const controls = document.createElement('div');
    controls.className = 'image-controls fixed bg-white shadow-lg rounded-lg p-2 z-50 flex gap-2';
    controls.style.top = `${coords.top - 40}px`;
    controls.style.left = `${coords.left}px`;

    // Add resize buttons
    const createButton = (icon: any, onClick: () => void, title: string) => {
      const button = document.createElement('button');
      button.className = 'p-1 hover:bg-gray-100 rounded';
      button.title = title;
      button.innerHTML = icon;
      button.onclick = (e) => {
        e.stopPropagation();
        onClick();
      };
      return button;
    };

    // Decrease size button
    controls.appendChild(
      createButton(
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line></svg>`,
        () => {
          const width = attrs.width || imageElement.naturalWidth;
          const height = attrs.height || imageElement.naturalHeight;
          const newWidth = Math.max(50, width * 0.9);
          const newHeight = Math.max(50, height * 0.9);
          
          editor.view.dispatch(editor.view.state.tr.setNodeMarkup(pos, undefined, {
            ...attrs,
            width: Math.round(newWidth),
            height: Math.round(newHeight),
          }));
        },
        'Réduire la taille'
      )
    );

    // Increase size button
    controls.appendChild(
      createButton(
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="8" x2="12" y2="16"></line></svg>`,
        () => {
          const width = attrs.width || imageElement.naturalWidth;
          const height = attrs.height || imageElement.naturalHeight;
          const newWidth = width * 1.1;
          const newHeight = height * 1.1;
          
          editor.view.dispatch(editor.view.state.tr.setNodeMarkup(pos, undefined, {
            ...attrs,
            width: Math.round(newWidth),
            height: Math.round(newHeight),
          }));
        },
        'Augmenter la taille'
      )
    );

    // Reset size button
    controls.appendChild(
      createButton(
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4v6h6"></path><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`,
        () => {
          editor.view.dispatch(editor.view.state.tr.setNodeMarkup(pos, undefined, {
            ...attrs,
            width: attrs.originalWidth,
            height: attrs.originalHeight,
          }));
        },
        'Taille originale'
      )
    );

    // Delete button
    controls.appendChild(
      createButton(
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
        () => {
          if (window.confirm('Voulez-vous supprimer cette image ?')) {
            editor.view.dispatch(editor.view.state.tr.delete(pos, pos + 1));
            controls.remove();
          }
        },
        'Supprimer l\'image'
      )
    );

    // Add controls to document
    document.body.appendChild(controls);

    // Remove controls when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (!controls.contains(e.target as Node) && !imageElement.contains(e.target as Node)) {
        controls.remove();
        document.removeEventListener('click', handleClickOutside);
      }
    };
    document.addEventListener('click', handleClickOutside);
  };

  return (
    <div className="border border-nature-200 rounded-lg overflow-hidden">
      <style>
        {`
          .ProseMirror {
            padding: 1rem;
          }
          .ProseMirror p {
            margin: 0.5em 0;
          }
          .ProseMirror h1 {
            font-size: 1.5em;
            margin: 0.5em 0;
          }
          .ProseMirror h2 {
            font-size: 1.25em;
            margin: 0.5em 0;
          }
          .ProseMirror h3 {
            font-size: 1.1em;
            margin: 0.5em 0;
          }
          .ProseMirror ul,
          .ProseMirror ol {
            margin: 0.5em 0;
            padding-left: 1.5em;
          }
          .ProseMirror li {
            margin: 0.2em 0;
          }
          .ProseMirror blockquote {
            border-left: 3px solid #ddd;
            margin: 0.5em 0;
            padding-left: 1em;
            font-style: italic;
          }
          .ProseMirror a {
            color: #4a90e2;
            text-decoration: underline;
          }
          .ProseMirror table {
            border-collapse: collapse;
            margin: 1em 0;
            width: 100%;
          }
          .ProseMirror th,
          .ProseMirror td {
            border: 1px solid #ddd;
            padding: 0.5em;
          }
          .ProseMirror th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .ProseMirror img {
            max-width: 100%;
            height: auto;
            display: inline-block;
            margin: 0.5em 0;
            cursor: pointer;
          }
          .ProseMirror img:hover {
            outline: 2px solid #4a6741;
          }
          .image-controls button:hover {
            background-color: #f3f4f6;
          }
          .image-controls button:active {
            background-color: #e5e7eb;
          }
        `}
      </style>
      <div className="bg-nature-50 p-2 border-b border-nature-200 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-nature-100 ${editor.isActive('bold') ? 'bg-nature-200' : ''}`}
          title="Gras"
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-nature-100 ${editor.isActive('italic') ? 'bg-nature-200' : ''}`}
          title="Italique"
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-nature-100 ${editor.isActive('underline') ? 'bg-nature-200' : ''}`}
          title="Souligné"
        >
          <UnderlineIcon className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded hover:bg-nature-100 ${editor.isActive('link') ? 'bg-nature-200' : ''}`}
          title="Lien"
        >
          <LinkIcon className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-nature-200 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-nature-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-nature-200' : ''}`}
          title="Aligner à gauche"
        >
          <AlignLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-nature-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-nature-200' : ''}`}
          title="Centrer"
        >
          <AlignCenter className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-nature-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-nature-200' : ''}`}
          title="Aligner à droite"
        >
          <AlignRight className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-nature-200 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-nature-100 ${editor.isActive('bulletList') ? 'bg-nature-200' : ''}`}
          title="Liste à puces"
        >
          <List className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-nature-100 ${editor.isActive('orderedList') ? 'bg-nature-200' : ''}`}
          title="Liste numérotée"
        >
          <ListOrdered className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-nature-200 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-nature-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-nature-200' : ''}`}
          title="Titre 1"
        >
          <Heading1 className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-nature-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-nature-200' : ''}`}
          title="Titre 2"
        >
          <Heading2 className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-nature-100 ${editor.isActive('heading', { level: 3 }) ? 'bg-nature-200' : ''}`}
          title="Titre 3"
        >
          <Heading3 className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-nature-100 ${editor.isActive('blockquote') ? 'bg-nature-200' : ''}`}
          title="Citation"
        >
          <Quote className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-nature-200 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-nature-100 disabled:opacity-50"
          title="Annuler"
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-nature-100 disabled:opacity-50"
          title="Rétablir"
        >
          <Redo className="w-5 h-5" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}