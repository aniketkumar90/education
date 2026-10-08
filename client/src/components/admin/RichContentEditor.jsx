import { useState, useRef, useEffect } from 'react';

const FORMAT_OPTIONS = [
  { label: 'Normal Text', tag: 'p', icon: '¶' },
  { label: 'Heading 1 (H1)', tag: 'h1', icon: 'H1' },
  { label: 'Heading 2 (H2)', tag: 'h2', icon: 'H2' },
  { label: 'Heading 3 (H3)', tag: 'h3', icon: 'H3' },
  { label: 'Heading 4 (H4)', tag: 'h4', icon: 'H4' },
  { label: 'Quote Block', tag: 'blockquote', icon: '❝' },
  { label: 'Code Block', tag: 'pre', icon: '‹/›' },
];

const FONT_SIZES = [
  { label: '12 pt', val: '2' },
  { label: '14 pt', val: '3' },
  { label: '16 pt', val: '4' },
  { label: '18 pt', val: '5' },
  { label: '24 pt', val: '6' },
  { label: '32 pt', val: '7' },
];

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', color: '#fef08a' },
  { name: 'Green', color: '#bbf7d0' },
  { name: 'Cyan', color: '#a5f3fc' },
  { name: 'Pink', color: '#fbcfe8' },
  { name: 'Orange', color: '#fed7aa' },
  { name: 'Clear', color: 'transparent' },
];

const TEXT_COLORS = [
  { name: 'Pure Black', color: '#000000' },
  { name: 'Default Dark', color: '#111827' },
  { name: 'Royal Blue', color: '#2563eb' },
  { name: 'Crimson Red', color: '#dc2626' },
  { name: 'Emerald Green', color: '#16a34a' },
  { name: 'Purple', color: '#9333ea' },
  { name: 'Amber Orange', color: '#d97706' },
];

export default function RichContentEditor({ value, onChange }) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('Normal Text');
  const [selectedSize, setSelectedSize] = useState('14 pt');

  // Custom Dropdown Open States (Using custom dropdowns prevents selection loss)
  const [openFormatMenu, setOpenFormatMenu] = useState(false);
  const [openSizeMenu, setOpenSizeMenu] = useState(false);
  const [openHighlightMenu, setOpenHighlightMenu] = useState(false);
  const [openColorMenu, setOpenColorMenu] = useState(false);

  // Floating Toolbar State
  const [showFloating, setShowFloating] = useState(false);
  const [floatingPos, setFloatingPos] = useState({ top: 0, left: 0 });

  // Link Modal State (DoFollow/NoFollow & Same Tab/New Tab)
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkForm, setLinkForm] = useState({
    url: '',
    text: '',
    target: '_self', // '_self' or '_blank'
    relType: 'dofollow', // 'dofollow' or 'nofollow'
    isEditing: false,
  });

  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const textareaRef = useRef(null);
  const savedRangeRef = useRef(null);

  // Sync external value to contentEditable
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
      textareaRef.current.style.height = `${Math.max(500, textareaRef.current.scrollHeight)}px`;
    }
  }, [value, isHtmlMode]);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenFormatMenu(false);
        setOpenSizeMenu(false);
        setOpenHighlightMenu(false);
        setOpenColorMenu(false);
        setShowFloating(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Save selection whenever cursor moves or text is highlighted
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    }
  };

  // Restore saved selection before executing formatting
  const restoreSelection = () => {
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  // Check text selection for floating toolbar
  const handleSelection = () => {
    saveSelection();

    if (isHtmlMode) {
      setShowFloating(false);
      return;
    }

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) {
      setShowFloating(false);
      return;
    }

    const text = sel.toString().trim();
    if (!text) {
      setShowFloating(false);
      return;
    }

    const range = sel.getRangeAt(0);
    if (!editorRef.current || !editorRef.current.contains(range.commonAncestorContainer)) {
      setShowFloating(false);
      return;
    }

    const rect = range.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const top = rect.top - containerRect.top - 85;
    const left = rect.left - containerRect.left + rect.width / 2 - 200;

    setFloatingPos({
      top: Math.max(10, top),
      left: Math.max(12, Math.min(left, containerRect.width - 440)),
    });
    setShowFloating(true);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange({ target: { name: 'content', value: html } });
    }
  };

  const exec = (command, val = null) => {
    restoreSelection();
    document.execCommand(command, false, val);
    saveSelection();
    handleInput();
  };

  const applyFormatBlock = (opt) => {
    restoreSelection();
    setSelectedFormat(opt.label);
    setOpenFormatMenu(false);

    try {
      document.execCommand('formatBlock', false, opt.tag);
    } catch {
      document.execCommand('formatBlock', false, `<${opt.tag}>`);
    }

    saveSelection();
    handleInput();
  };

  const applyFontSize = (sizeOpt) => {
    restoreSelection();
    setSelectedSize(sizeOpt.label);
    setOpenSizeMenu(false);
    document.execCommand('fontSize', false, sizeOpt.val);
    saveSelection();
    handleInput();
  };

  const applyHighlight = (color) => {
    restoreSelection();
    setOpenHighlightMenu(false);
    try {
      document.execCommand('hiliteColor', false, color);
    } catch {
      document.execCommand('backColor', false, color);
    }
    saveSelection();
    handleInput();
  };

  const applyTextColor = (color) => {
    restoreSelection();
    setOpenColorMenu(false);
    document.execCommand('foreColor', false, color);
    saveSelection();
    handleInput();
  };

  // Open Custom Link Modal with Selection & Anchor Detection
  const openLinkModal = () => {
    saveSelection();
    const sel = window.getSelection();
    let initialText = '';
    let initialUrl = '';
    let initialTarget = '_self';
    let initialRel = 'dofollow';
    let isEditingExisting = false;

    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      initialText = range.toString().trim();

      // Check if cursor/selection is inside an existing <a> tag
      let node = range.commonAncestorContainer;
      while (node && node !== editorRef.current) {
        if (node.nodeName === 'A') {
          isEditingExisting = true;
          initialUrl = node.getAttribute('href') || '';
          initialText = node.textContent || '';
          initialTarget = node.getAttribute('target') === '_blank' ? '_blank' : '_self';
          const relAttr = (node.getAttribute('rel') || '').toLowerCase();
          initialRel = relAttr.includes('nofollow') ? 'nofollow' : 'dofollow';
          break;
        }
        node = node.parentNode;
      }
    }

    setLinkForm({
      url: initialUrl,
      text: initialText,
      target: initialTarget,
      relType: initialRel,
      isEditing: isEditingExisting,
    });
    setShowLinkModal(true);
  };

  // Smart URL handler for detecting internal vs external
  const handleUrlChange = (val) => {
    setLinkForm((prev) => {
      const next = { ...prev, url: val };
      if (!prev.isEditing) {
        const trimmed = val.trim().toLowerCase();
        const isInternal =
          trimmed.startsWith('/') ||
          trimmed.startsWith('#') ||
          trimmed.includes('dleducationconnect');

        if (isInternal) {
          next.target = '_self';
          next.relType = 'dofollow';
        } else if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
          next.target = '_blank';
        }
      }
      return next;
    });
  };

  // Save / Apply Link with attributes
  const handleSaveLink = (e) => {
    if (e) e.preventDefault();
    const { url, text, target, relType } = linkForm;
    if (!url.trim()) {
      alert('Please enter a link URL');
      return;
    }

    restoreSelection();
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) {
      setShowLinkModal(false);
      return;
    }

    const range = sel.getRangeAt(0);

    // Look for existing anchor
    let existingA = null;
    let node = range.commonAncestorContainer;
    while (node && node !== editorRef.current) {
      if (node.nodeName === 'A') {
        existingA = node;
        break;
      }
      node = node.parentNode;
    }

    const cleanUrl = url.trim();
    const displayText = text.trim() || cleanUrl;

    if (existingA) {
      existingA.setAttribute('href', cleanUrl);
      if (text.trim()) {
        existingA.textContent = displayText;
      }
      if (target === '_blank') {
        existingA.setAttribute('target', '_blank');
        existingA.setAttribute(
          'rel',
          relType === 'nofollow' ? 'nofollow noopener noreferrer' : 'noopener noreferrer'
        );
      } else {
        existingA.removeAttribute('target');
        if (relType === 'nofollow') {
          existingA.setAttribute('rel', 'nofollow');
        } else {
          existingA.removeAttribute('rel');
        }
      }
    } else {
      const a = document.createElement('a');
      a.setAttribute('href', cleanUrl);
      a.textContent = displayText;

      if (target === '_blank') {
        a.setAttribute('target', '_blank');
        a.setAttribute(
          'rel',
          relType === 'nofollow' ? 'nofollow noopener noreferrer' : 'noopener noreferrer'
        );
      } else {
        if (relType === 'nofollow') {
          a.setAttribute('rel', 'nofollow');
        }
      }

      range.deleteContents();
      range.insertNode(a);

      range.setStartAfter(a);
      range.setEndAfter(a);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    saveSelection();
    handleInput();
    setShowLinkModal(false);
  };

  // Remove existing link (Unlink)
  const handleRemoveLink = () => {
    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.rangeCount) {
      const range = sel.getRangeAt(0);
      let node = range.commonAncestorContainer;
      while (node && node !== editorRef.current) {
        if (node.nodeName === 'A') {
          const textNode = document.createTextNode(node.textContent);
          node.parentNode.replaceChild(textNode, node);
          break;
        }
        node = node.parentNode;
      }
    }
    saveSelection();
    handleInput();
    setShowLinkModal(false);
  };

  const addImage = () => {
    restoreSelection();
    const url = prompt('Enter Image URL (https://...):', 'https://');
    if (url) {
      exec('insertImage', url);
    }
  };

  // Reusable Toolbar Component rendered both as Top Bar and Floating Bar
  const renderToolbarControls = (isFloating = false) => (
    <div style={isFloating ? styles.floatingInner : styles.staticInner}>
      {/* Row 1: Paragraph / Headings dropdown, Font size, Scale, Highlight & Colors */}
      <div style={styles.toolRow}>
        {/* Format Dropdown (Normal text, H1, H2, H3, etc.) */}
        <div style={styles.dropdownWrap}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setOpenFormatMenu(!openFormatMenu);
              setOpenSizeMenu(false);
              setOpenHighlightMenu(false);
              setOpenColorMenu(false);
            }}
            style={styles.dropdownTrigger}
          >
            <span>{selectedFormat}</span>
            <span style={{ fontSize: 9, color: '#64748b' }}>▼</span>
          </button>

          {openFormatMenu && (
            <div style={styles.dropdownMenu}>
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt.tag}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyFormatBlock(opt)}
                  style={{
                    ...styles.dropdownItem,
                    fontWeight: opt.tag.startsWith('h') ? 700 : 500,
                  }}
                >
                  <span style={styles.itemIcon}>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Size Dropdown (14 pt, 16 pt, etc.) */}
        <div style={styles.dropdownWrap}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setOpenSizeMenu(!openSizeMenu);
              setOpenFormatMenu(false);
              setOpenHighlightMenu(false);
              setOpenColorMenu(false);
            }}
            style={{ ...styles.dropdownTrigger, minWidth: 70 }}
          >
            <span>{selectedSize}</span>
            <span style={{ fontSize: 9, color: '#64748b' }}>▼</span>
          </button>

          {openSizeMenu && (
            <div style={{ ...styles.dropdownMenu, minWidth: 100 }}>
              {FONT_SIZES.map((size) => (
                <button
                  key={size.val}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyFontSize(size)}
                  style={styles.dropdownItem}
                >
                  {size.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Size Scale A▲ / A▼ */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('increaseFontSize')}
          style={styles.toolIconBtn}
          title="Increase Font Size (A▲)"
        >
          A<sup>▲</sup>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('decreaseFontSize')}
          style={styles.toolIconBtn}
          title="Decrease Font Size (A▼)"
        >
          A<sup>▼</sup>
        </button>

        <span style={styles.vDivider} />

        {/* Highlight Color (Brush 🖍️) */}
        <div style={styles.dropdownWrap}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setOpenHighlightMenu(!openHighlightMenu);
              setOpenFormatMenu(false);
              setOpenSizeMenu(false);
              setOpenColorMenu(false);
            }}
            style={styles.toolIconBtn}
            title="Highlight Color (Marker)"
          >
            🖍️<span style={{ fontSize: 8 }}>▼</span>
          </button>

          {openHighlightMenu && (
            <div style={{ ...styles.dropdownMenu, padding: 8, minWidth: 120 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
                Highlight Color
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                {HIGHLIGHT_COLORS.map((h) => (
                  <button
                    key={h.name}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyHighlight(h.color)}
                    style={{
                      height: 22,
                      background: h.color === 'transparent' ? '#ffffff' : h.color,
                      border: '1.5px solid #cbd5e1',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#0f172a',
                    }}
                    title={h.name}
                  >
                    {h.color === 'transparent' ? '✕' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Text Color A▾ */}
        <div style={styles.dropdownWrap}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setOpenColorMenu(!openColorMenu);
              setOpenFormatMenu(false);
              setOpenSizeMenu(false);
              setOpenHighlightMenu(false);
            }}
            style={{ ...styles.toolIconBtn, fontWeight: 800, color: '#2563eb' }}
            title="Text Color"
          >
            <span style={{ borderBottom: '2.5px solid #2563eb', paddingBottom: 1 }}>A</span>
            <span style={{ fontSize: 8 }}>▼</span>
          </button>

          {openColorMenu && (
            <div style={{ ...styles.dropdownMenu, padding: 8, minWidth: 140 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
                Text Color
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyTextColor(c.color)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '4px 6px',
                      background: 'none',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 12,
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: c.color,
                        border: '1px solid #cbd5e1',
                      }}
                    />
                    <span style={{ color: c.color, fontWeight: 600 }}>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Blue / Red buttons matching user screenshot */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyTextColor('#2563eb')}
          style={{ ...styles.toolIconBtn, color: '#2563eb', fontWeight: 800 }}
          title="Quick Blue Text"
        >
          A<span style={{ color: '#2563eb', fontSize: 10 }}>●</span>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyTextColor('#dc2626')}
          style={{ ...styles.toolIconBtn, color: '#dc2626', fontWeight: 800 }}
          title="Quick Red Text"
        >
          A<span style={{ color: '#dc2626', fontSize: 10 }}>●</span>
        </button>
      </div>

      <div style={styles.divider} />

      {/* Row 2: B, I, U, S, Lists, Link, Clear Format, ALIGNMENT & JUSTIFY CONTENT */}
      <div style={styles.toolRow}>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('bold')}
          style={styles.toolBtn}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('italic')}
          style={styles.toolBtn}
          title="Italic (Ctrl+I)"
        >
          <em>/</em>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('underline')}
          style={styles.toolBtn}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('strikeThrough')}
          style={styles.toolBtn}
          title="Strikethrough"
        >
          <s>ab</s>
        </button>

        <span style={styles.vDivider} />

        {/* Lists */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('insertUnorderedList')}
          style={styles.toolBtn}
          title="Bullet List (•≡)"
        >
          •≡
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('insertOrderedList')}
          style={styles.toolBtn}
          title="Numbered List (1≡)"
        >
          1≡
        </button>

        {/* Link & Clear Format */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={openLinkModal}
          style={styles.toolBtn}
          title="Insert / Edit Link (🔗 DoFollow / NoFollow & Target)"
        >
          🔗
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('removeFormat')}
          style={styles.toolBtn}
          title="Clear Formatting (✕)"
        >
          ✕
        </button>

        <span style={styles.vDivider} />

        {/* ── TEXT ALIGNMENTS & JUSTIFY CONTENT ──────────────── */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('justifyLeft')}
          style={styles.toolBtn}
          title="Align Left (≡)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="15" y1="12" x2="3" y2="12"></line>
            <line x1="17" y1="18" x2="3" y2="18"></line>
          </svg>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('justifyCenter')}
          style={styles.toolBtn}
          title="Align Center (≣)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="6"></line>
            <line x1="21" y1="12" x2="3" y2="12"></line>
            <line x1="18" y1="18" x2="6" y2="18"></line>
          </svg>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('justifyRight')}
          style={styles.toolBtn}
          title="Align Right (≡)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="12" x2="9" y2="12"></line>
            <line x1="21" y1="18" x2="7" y2="18"></line>
          </svg>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('justifyFull')}
          style={{ ...styles.toolBtn, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
          title="Justify Content (Equal margins left & right)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="18" x2="3" y2="18"></line>
          </svg>
          <span style={{ fontSize: 10, fontWeight: 800, marginLeft: 3 }}>Justify</span>
        </button>

        <span style={styles.vDivider} />

        {/* Undo / Redo */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('undo')}
          style={styles.toolBtn}
          title="Undo (Ctrl+Z)"
        >
          ↶
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('redo')}
          style={styles.toolBtn}
          title="Redo (Ctrl+Y)"
        >
          ↷
        </button>

        {/* Insert Image & Horizontal Line */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={addImage}
          style={styles.toolBtn}
          title="Insert Image by URL"
        >
          🖼️
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('insertHorizontalRule')}
          style={styles.toolBtn}
          title="Insert Horizontal Divider Line"
        >
          ―
        </button>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} style={styles.container}>
      {/* 1. Header Bar: Title, Mode Indicator & Visual/HTML toggle */}
      <div className="editor-header-bar" style={styles.header}>
        <div style={styles.headerLeft}>
          <label style={styles.label}>Blog content</label>
          <span style={styles.badge}>
            {isHtmlMode ? 'HTML Source Mode' : 'Visual WYSIWYG Mode'}
          </span>
        </div>

        <div style={styles.headerRight}>
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

      {/* 2. Permanent Always-Visible Top Toolbar (MS Word Style matching user screenshot) */}
      {!isHtmlMode && (
        <div className="editor-permanent-toolbar" style={styles.permanentToolbar}>
          {renderToolbarControls(false)}
        </div>
      )}

      {/* 3. Floating Toolbar on Text Selection (Pop-up context bar) */}
      {showFloating && !isHtmlMode && (
        <div
          style={{
            ...styles.floatingToolbar,
            top: floatingPos.top,
            left: floatingPos.left,
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {renderToolbarControls(true)}
          <div style={styles.floatCaret} />
        </div>
      )}

      {/* 4. Editor Content Area */}
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
          onBlur={saveSelection}
          style={styles.editableArea}
          placeholder="Write your blog content here... Use the toolbar above or select text to format headings, colors, lists, and justify content!"
        />
      )}

      {/* 5. Custom Link Modal with DoFollow/NoFollow & Same/New Page Selection */}
      {showLinkModal && (
        <div
          style={styles.modalBackdrop}
          onClick={() => setShowLinkModal(false)}
        >
          <div
            style={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <div>
                <h4 style={styles.modalTitle}>
                  🔗 {linkForm.isEditing ? 'Edit Hyperlink' : 'Insert Hyperlink'}
                </h4>
                <p style={styles.modalSubtitle}>
                  Configure URL, destination window, and SEO crawl attributes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                style={styles.modalCloseBtn}
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveLink} style={styles.modalBody}>
              {/* URL Field */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Link URL <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={linkForm.url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="e.g., /blogs/bcom-distance-education or https://..."
                  required
                  autoFocus
                  style={styles.formInput}
                />
                {/* Smart detection helper */}
                {linkForm.url && (
                  <div style={styles.urlHintRow}>
                    {linkForm.url.startsWith('/') ||
                    linkForm.url.startsWith('#') ||
                    linkForm.url.toLowerCase().includes('dleducationconnect') ? (
                      <span style={styles.internalBadge}>
                        🏠 <strong>Internal Link</strong> (Same domain detected)
                      </span>
                    ) : (
                      <span style={styles.externalBadge}>
                        🌐 <strong>External Link</strong> (Third-party site detected)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Anchor Text */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Display Text (Anchor Text)
                </label>
                <input
                  type="text"
                  value={linkForm.text}
                  onChange={(e) =>
                    setLinkForm((prev) => ({ ...prev, text: e.target.value }))
                  }
                  placeholder="Selected text or link title..."
                  style={styles.formInput}
                />
              </div>

              {/* 1. Target Window (Open Mode) */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  🌐 Open In (Target Window):
                </label>
                <div style={styles.radioGrid}>
                  <label
                    style={{
                      ...styles.radioCard,
                      ...(linkForm.target === '_self' ? styles.radioCardActive : {}),
                    }}
                  >
                    <input
                      type="radio"
                      name="linkTarget"
                      checked={linkForm.target === '_self'}
                      onChange={() =>
                        setLinkForm((prev) => ({ ...prev, target: '_self' }))
                      }
                      style={styles.radioInput}
                    />
                    <div>
                      <div style={styles.radioHead}>
                        <span>📄 Same Page / Tab</span>
                        <span style={styles.tagPill}>target="_self"</span>
                      </div>
                      <div style={styles.radioDesc}>
                        Current window mein khulega (<strong>Internal links</strong> ke liye recommended).
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      ...styles.radioCard,
                      ...(linkForm.target === '_blank' ? styles.radioCardActive : {}),
                    }}
                  >
                    <input
                      type="radio"
                      name="linkTarget"
                      checked={linkForm.target === '_blank'}
                      onChange={() =>
                        setLinkForm((prev) => ({ ...prev, target: '_blank' }))
                      }
                      style={styles.radioInput}
                    />
                    <div>
                      <div style={styles.radioHead}>
                        <span>↗ New Tab / New Page</span>
                        <span style={styles.tagPill}>target="_blank"</span>
                      </div>
                      <div style={styles.radioDesc}>
                        Naye browser tab mein khulega (<strong>External references</strong> ke liye behtar).
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* 2. SEO Attribute: DoFollow vs NoFollow */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  🔍 Google SEO Attribute (Crawl Equity):
                </label>
                <div style={styles.radioGrid}>
                  <label
                    style={{
                      ...styles.radioCard,
                      ...(linkForm.relType === 'dofollow' ? styles.radioCardActive : {}),
                    }}
                  >
                    <input
                      type="radio"
                      name="linkRel"
                      checked={linkForm.relType === 'dofollow'}
                      onChange={() =>
                        setLinkForm((prev) => ({ ...prev, relType: 'dofollow' }))
                      }
                      style={styles.radioInput}
                    />
                    <div>
                      <div style={styles.radioHead}>
                        <span>⭐ DoFollow (Standard)</span>
                        <span style={styles.dofollowPill}>Pass Link Rank</span>
                      </div>
                      <div style={styles.radioDesc}>
                        Googlebot link ko crawl karega aur page rank transfer karega (Internal linking ke liye best).
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      ...styles.radioCard,
                      ...(linkForm.relType === 'nofollow' ? styles.radioCardActive : {}),
                    }}
                  >
                    <input
                      type="radio"
                      name="linkRel"
                      checked={linkForm.relType === 'nofollow'}
                      onChange={() =>
                        setLinkForm((prev) => ({ ...prev, relType: 'nofollow' }))
                      }
                      style={styles.radioInput}
                    />
                    <div>
                      <div style={styles.radioHead}>
                        <span>🛡️ NoFollow</span>
                        <span style={styles.nofollowPill}>rel="nofollow"</span>
                      </div>
                      <div style={styles.radioDesc}>
                        Search engines ko batata hai ki is link ko endorse na karein (Paid / external links).
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div style={styles.modalFooter}>
                {linkForm.isEditing ? (
                  <button
                    type="button"
                    onClick={handleRemoveLink}
                    style={styles.removeLinkBtn}
                    title="Remove this hyperlink"
                  >
                    🗑️ Remove Link
                  </button>
                ) : (
                  <span />
                )}

                <div style={styles.modalBtnRow}>
                  <button
                    type="button"
                    onClick={() => setShowLinkModal(false)}
                    style={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={styles.saveLinkBtn}
                  >
                    {linkForm.isEditing ? '✓ Update Link' : '✓ Insert Link'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
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
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    overflow: 'visible',
    background: '#ffffff',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 16px',
    background: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    gap: 8,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 13.5,
    fontWeight: 700,
    color: '#0f172a',
  },
  badge: {
    fontSize: 11,
    padding: '2px 8px',
    borderRadius: 12,
    background: '#e0e7ff',
    color: '#3730a3',
    fontWeight: 600,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  toggleModeBtn: {
    padding: '4px 12px',
    borderRadius: 6,
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    fontSize: 11.5,
    fontWeight: 700,
    cursor: 'pointer',
    color: '#1e293b',
    transition: 'all 0.15s ease',
  },

  // Permanent top toolbar
  permanentToolbar: {
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '8px 12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
  },
  staticInner: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  toolRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },

  // Dropdowns (Custom menus that prevent selection loss)
  dropdownWrap: {
    position: 'relative',
    display: 'inline-block',
  },
  dropdownTrigger: {
    height: 28,
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: 5,
    fontSize: 11.5,
    fontWeight: 600,
    color: '#334155',
    cursor: 'pointer',
    outline: 'none',
    transition: 'border 0.15s ease',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 3,
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: 6,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    zIndex: 9999,
    minWidth: 160,
    padding: '4px 0',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    padding: '6px 12px',
    background: 'none',
    border: 'none',
    fontSize: 12,
    color: '#1e293b',
    cursor: 'pointer',
    textAlign: 'left',
  },
  itemIcon: {
    fontSize: 11,
    fontWeight: 700,
    color: '#64748b',
    width: 20,
    textAlign: 'center',
  },

  // Buttons
  toolIconBtn: {
    height: 28,
    padding: '0 7px',
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#334155',
    gap: 3,
  },
  toolBtn: {
    height: 28,
    minWidth: 28,
    padding: '0 6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: 12,
    color: '#334155',
    transition: 'background 0.1s ease',
  },
  divider: {
    height: 1,
    background: '#f1f5f9',
    margin: '2px 0',
  },
  vDivider: {
    width: 1,
    height: 18,
    background: '#e2e8f0',
    margin: '0 3px',
  },

  // Floating Toolbar
  floatingToolbar: {
    position: 'absolute',
    zIndex: 999,
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    padding: '8px 10px',
    animation: 'fadeIn 0.15s ease',
  },
  floatingInner: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
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

  // Editable body
  editableArea: {
    minHeight: 520,
    padding: '20px 24px',
    outline: 'none',
    fontSize: 16,
    lineHeight: 1.8,
    color: '#111827',
    background: '#ffffff',
    cursor: 'text',
    boxSizing: 'border-box',
    overflowY: 'visible',
    borderRadius: '0 0 8px 8px',
  },
  htmlTextarea: {
    minHeight: 520,
    padding: '18px 24px',
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
    borderRadius: '0 0 8px 8px',
  },

  // Modal Styles
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(3px)',
    zIndex: 99999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 530,
    background: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    animation: 'fadeIn 0.15s ease',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '16px 20px',
    background: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748b',
    margin: '3px 0 0 0',
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    fontSize: 16,
    fontWeight: 700,
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: 4,
  },
  modalBody: {
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  formLabel: {
    fontSize: 12.5,
    fontWeight: 700,
    color: '#334155',
  },
  formInput: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 7,
    border: '1.5px solid #cbd5e1',
    fontSize: 13.5,
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s ease',
  },
  urlHintRow: {
    marginTop: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  internalBadge: {
    fontSize: 11,
    padding: '2px 8px',
    borderRadius: 4,
    background: '#ecfdf5',
    color: '#047857',
    border: '1px solid #a7f3d0',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  },
  externalBadge: {
    fontSize: 11,
    padding: '2px 8px',
    borderRadius: 4,
    background: '#eff6ff',
    color: '#1d4ed8',
    border: '1px solid #bfdbfe',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  },
  radioGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  radioCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    padding: '10px 12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    cursor: 'pointer',
    background: '#ffffff',
    transition: 'all 0.15s ease',
  },
  radioCardActive: {
    borderColor: '#2563eb',
    background: '#eff6ff',
    boxShadow: '0 0 0 1px #2563eb',
  },
  radioInput: {
    marginTop: 3,
    cursor: 'pointer',
  },
  radioHead: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12.5,
    fontWeight: 700,
    color: '#1e293b',
    flexWrap: 'wrap',
  },
  radioDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 3,
    lineHeight: 1.35,
  },
  tagPill: {
    fontSize: 9.5,
    fontFamily: 'monospace',
    background: '#f1f5f9',
    padding: '1px 5px',
    borderRadius: 3,
    color: '#475569',
  },
  dofollowPill: {
    fontSize: 9.5,
    fontWeight: 700,
    background: '#dcfce7',
    color: '#15803d',
    padding: '1px 6px',
    borderRadius: 3,
  },
  nofollowPill: {
    fontSize: 9.5,
    fontFamily: 'monospace',
    fontWeight: 700,
    background: '#fee2e2',
    color: '#b91c1c',
    padding: '1px 6px',
    borderRadius: 3,
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTop: '1px solid #f1f5f9',
  },
  removeLinkBtn: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    borderRadius: 6,
    padding: '7px 12px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  modalBtnRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    background: '#f8fafc',
    border: '1px solid #cbd5e1',
    color: '#475569',
    borderRadius: 6,
    padding: '7px 14px',
    fontSize: 12.5,
    fontWeight: 600,
    cursor: 'pointer',
  },
  saveLinkBtn: {
    background: '#2563eb',
    border: 'none',
    color: '#ffffff',
    borderRadius: 6,
    padding: '7px 16px',
    fontSize: 12.5,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.25)',
  },
};
