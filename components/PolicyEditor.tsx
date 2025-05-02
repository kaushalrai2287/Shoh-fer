'use client';

import { useEffect, useState } from 'react';
import { Editor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// Utility function to debounce a function
function debounce(func: Function, delay: number) {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

type Props = {
  initialValue?: string; // Expect the string JSON format for initialValue
  onSave: (content: string) => void;
};

export default function PolicyEditor({ initialValue = '', onSave }: Props) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [isSaved, setIsSaved] = useState(false); // Track save status

  useEffect(() => {
    // Parse the initial value if it's in string JSON format
    const parsedContent =
      typeof initialValue === 'string' ? JSON.parse(initialValue) : { type: 'doc', content: [] };

    // Initialize the Tiptap editor
    const editorInstance = new Editor({
      extensions: [StarterKit],
      content: parsedContent,

      onUpdate: debounce(({ editor }: { editor: Editor }) => {
        setIsSaved(false); // Mark content as unsaved
      }, 1000),
    });

    setEditor(editorInstance);

    return () => {
      editorInstance.destroy();
    };
  }, [initialValue]);

  const handleSave = () => {
    if (editor) {
      const content = editor.getJSON();
      onSave(JSON.stringify(content)); // Save content as JSON string
      setIsSaved(true); // Mark as saved
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-4">
      <div
        style={{
          minHeight: '400px',
          backgroundColor: '#000',
          color: '#fff',
          border: '1px solid #444',
          borderRadius: '8px',
          padding: '10px',
          fontFamily: 'Arial, sans-serif',
          lineHeight: '1.6',
          overflowY: 'auto',
        }}
      >
        <EditorContent editor={editor} />
      </div>

      <div className="mt-4">
        <button
          onClick={handleSave}
          disabled={isSaved}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          {isSaved ? 'Policy Saved' : 'Save Policy'}
        </button>
      </div>
    </div>
  );
}
