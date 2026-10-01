import { useState, useRef, useEffect } from 'react';

export default function RichContentEditor({ value, onChange }) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });
  const [selectedFormat, setSelectedFormat] = useState('p');

  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const textareaRef = useRef(null);

  // Sync incoming value to contentEditable when not actively typing
  useEffect(() => {
    if (editorRef.current && !isHtmlMode) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, isHtmlMode]);

  // Auto-expand raw textarea if in HTML mode
  useEffect(() => {
    if (isHtmlMode && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(520, textareaRef.current.scrollHeight)}px`;
    }
  }, [value, isHtmlMode]);

  // Handle text selection for floating toolbar
  const handleSelection = () => {
    if (isHtmlMode) {
      setShowToolbar(false);
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      setShowToolbar(false);
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      setShowToolbar(false);
      return;
    }

    const range = selection.getRangeAt(0);
    if (!editorRef.current || !editorRef.current.contains(range.commonAncestorContainer)) {
      setShowToolbar(false);
      return;
    }

    const rect = range.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Position above selected text
    const top = rect.top - containerRect.top - 68;
    const left = rect.left - containerRect.left + (rect.width / 2) - 170;

    setToolbarPos({
      top: Math.max(8, top),
      left: Math.max(10, Math.min(left, containerRect.width - 360)),
    });
    setShowToolbar(true);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange({ target: { name: 'content', value: html } });
    }
  };

  const exec = (command, val = null) => {
    document.execCommand(command, false, val);
    handleInput();
  };

  const formatBlock = (tag) => {
    setSelectedFormat(tag);
    document.execCommand('formatBlock', false, tag);
    handleInput();
  };

  const setFontSize = (size) => {
    document.execCommand('fontSize', false, size);
    handleInput();
  };

  const addLink = () => {
    const url = prompt('Enter web link URL (https://...):', 'https://');
    if (url) {
      exec('createLink', url);
    }
  };

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Editor Header */}
      <div className="editor-header-bar" style={styles.header}>
        <div style={styles.headerLeft}>
          <label style={styles.label}>Blog content</label>
          <span style={styles.badge}>
            {isHtmlMode ? 'HTML Source Mode' : 'Visual WYSIWYG Mode'}
          </span>
        </div>

        <div style={styles.headerRight}>
          {/* Quick Static Toolbar */}
          {!isHtmlMode && (
            <div className="editor-static-toolbar" style={styles.staticToolbar}>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => formatBlock('<h2>')} style={styles.toolBtn}>H2</button>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => formatBlock('<h3>')} style={styles.toolBtn}>H3</button>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('bold')} style={styles.toolBtn}><strong>B</strong></button>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('italic')} style={styles.toolBtn}><em>I</em></button>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('underline')} style={styles.toolBtn}><u>U</u></button>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('insertUnorderedList')} style={styles.toolBtn}>• List</button>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('insertOrderedList')} style={styles.toolBtn}>1. List</button>
            </div>
          )}

          {/* Toggle between Visual & HTML source code */}
          <button
            type="button"
            onClick={() => setIsHtmlMode(!isHtmlMode)}
            style={styles.toggleModeBtn}
            title="Switch between Visual editor and HTML code"
          >
            {isHtmlMode ? '👁️ Visual Editor' : '‹/› HTML Code'}
          </button>
        </div>
      </div>

      {/* Floating Toolbar on Text Selection (MS Word / Medium style) */}
      {showToolbar && !isHtmlMode && (
        <div
          style={{
            ...styles.floatingToolbar,
            top: toolbarPos.top,
            left: toolbarPos.left,
          }}
          onMouseDown={(e) => e.preventDefault()} // Prevents selection loss when clicking toolbar
        >
          {/* Row 1: Font style / Heading dropdown, Font size, Colors */}
          <div style={styles.floatRow}>
            {/* Format Dropdown (Calibri / Style dropdown in Image 2) */}
            <select
              value={selectedFormat}
              onChange={(e) => formatBlock(e.target.value)}
              style={styles.floatSelect}
            >
              <option value="p">Normal Text</option>
              <option value="h2">Heading 2 (H2)</option>
              <option value="h3">Heading 3 (H3)</option>
              <option value="h4">Heading 4 (H4)</option>
              <option value="blockquote">Quote Block</option>
            </select>

            {/* Font Size */}
            <select
              onChange={(e) => setFontSize(e.target.value)}
              defaultValue="3"
              style={styles.floatSelectSize}
            >
              <option value="2">12 pt</option>
              <option value="3">14 pt</option>
              <option value="4">16 pt</option>
              <option value="5">18 pt</option>
              <option value="6">24 pt</option>
            </select>

            {/* Size Scale A^ / Av */}
            <button type="button" onClick={() => exec('increaseFontSize')} style={styles.iconBtn} title="Grow Font">A<sup>▲</sup></button>
            <button type="button" onClick={() => exec('decreaseFontSize')} style={styles.iconBtn} title="Shrink Font">A<sup>▼</sup></button>

            {/* Highlight Brush 🖌️ */}
            <button
              type="button"
              onClick={() => exec('hiliteColor', '#fef08a')}
              style={styles.iconBtn}
              title="Highlight Text"
            >
              🖌️
            </button>

            {/* Text Color A▾ */}
            <button
              type="button"
              onClick={() => exec('foreColor', '#2563eb')}
              style={{ ...styles.iconBtn, color: '#2563eb', fontWeight: 700 }}
              title="Blue Text"
            >
              A<span style={{ fontSize: 9 }}>▾</span>
            </button>

            <button
              type="button"
              onClick={() => exec('foreColor', '#dc2626')}
              style={{ ...styles.iconBtn, color: '#dc2626', fontWeight: 700 }}
              title="Red Text"
            >
              A<span style={{ fontSize: 9 }}>▾</span>
            </button>
          </div>

          <div style={styles.divider} />

          {/* Row 2: B, I, U, abc, Lists, Link */}
          <div style={styles.floatRow}>
            <button type="button" onClick={() => exec('bold')} style={styles.formatBtn} title="Bold">
              <strong>B</strong>
            </button>
            <button type="button" onClick={() => exec('italic')} style={styles.formatBtn} title="Italic">
              <em>I</em>
            </button>
            <button type="button" onClick={() => exec('underline')} style={styles.formatBtn} title="Underline">
              <u>U</u>
            </button>
            <button type="button" onClick={() => exec('strikeThrough')} style={styles.formatBtn} title="Strikethrough">
              <s>ab</s>
            </button>

            <span style={styles.vDivider} />

            <button type="button" onClick={() => exec('insertUnorderedList')} style={styles.formatBtn} title="Bullet List">
              •≡
            </button>
            <button type="button" onClick={() => exec('insertOrderedList')} style={styles.formatBtn} title="Numbered List">
              1≡
            </button>
            <button type="button" onClick={addLink} style={styles.formatBtn} title="Insert Link">
              🔗
            </button>
            <button type="button" onClick={() => exec('removeFormat')} style={styles.formatBtn} title="Clear Formatting">
              ✕
            </button>
          </div>

          {/* Pointer caret */}
          <div style={styles.floatCaret} />
        </div>
      )}

      {/* Editor Body */}
      {isHtmlMode ? (
        <textarea
          ref={textareaRef}
          value={value || ''}
          onChange={(e) => onChange(e)}
          name="content"
          placeholder="Type or paste raw HTML code here..."
          style={styles.htmlTextarea}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onMouseUp={handleSelection}
          onKeyUp={handleSelection}
          style={styles.editableArea}
          placeholder="Write your blog content here... Select any text to format it with headings, bold, colors, and lists!"
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 16px',
    background: '#f8fafc',
    borderBottom: '1px solid var(--border)',
    flexWrap: 'wrap',
    gap: 8,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  label: { fontSize: 13.5, fontWeight: 700, color: '#1e293b' },
  badge: {
    fontSize: 11,
    padding: '2px 8px',
    borderRadius: 12,
    background: '#e0e7ff',
    color: '#3730a3',
    fontWeight: 600,
  },
  headerRight: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  staticToolbar: { display: 'flex', gap: 4, alignItems: 'center' },
  toolBtn: {
    padding: '3px 7px',
    borderRadius: 4,
    border: '1px solid var(--border)',
    background: '#ffffff',
    fontSize: 11.5,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#334155',
  },
  toggleModeBtn: {
    padding: '4px 10px',
    borderRadius: 6,
    border: '1px solid var(--border)',
    background: '#f1f5f9',
    fontSize: 11.5,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#1e293b',
  },

  // Floating Toolbar matching Image 2
  floatingToolbar: {
    position: 'absolute',
    zIndex: 50,
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    padding: '6px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    animation: 'fadeIn 0.15s ease',
  },
  floatRow: { display: 'flex', alignItems: 'center', gap: 4 },
  floatSelect: {
    height: 26,
    padding: '0 6px',
    borderRadius: 4,
    border: '1px solid #cbd5e1',
    fontSize: 11.5,
    fontWeight: 500,
    background: '#ffffff',
    outline: 'none',
    cursor: 'pointer',
  },
  floatSelectSize: {
    height: 26,
    width: 60,
    padding: '0 4px',
    borderRadius: 4,
    border: '1px solid #cbd5e1',
    fontSize: 11.5,
    background: '#ffffff',
    outline: 'none',
    cursor: 'pointer',
  },
  iconBtn: {
    height: 26,
    padding: '0 6px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: 1, background: '#e2e8f0', margin: '2px 0' },
  vDivider: { width: 1, height: 16, background: '#cbd5e1', margin: '0 4px' },
  formatBtn: {
    width: 26,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 12,
    color: '#334155',
  },
  floatCaret: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid #ffffff',
  },

  // Editable area
  editableArea: {
    minHeight: 520,
    padding: '18px 20px',
    outline: 'none',
    fontSize: 14.5,
    lineHeight: 1.7,
    fontFamily: 'var(--font)',
    color: '#1e293b',
    background: '#ffffff',
    cursor: 'text',
    boxSizing: 'border-box',
    overflowY: 'visible',
  },
  htmlTextarea: {
    minHeight: 520,
    padding: '16px 20px',
    outline: 'none',
    border: 'none',
    fontSize: 13,
    lineHeight: 1.6,
    fontFamily: 'Consolas, Monaco, monospace',
    color: '#0f172a',
    background: '#f8fafc',
    boxSizing: 'border-box',
    resize: 'none',
    overflowY: 'hidden',
  },
};
