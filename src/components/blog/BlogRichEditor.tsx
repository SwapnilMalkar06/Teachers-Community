'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Bold, Italic, Underline, Image as ImageIcon, Type, AlignLeft, AlignCenter, AlignRight, Eye, ALargeSmall } from 'lucide-react';

interface BlogRichEditorProps {
  value: string;
  onChange: (htmlContent: string) => void;
  placeholder?: string;
}

export function compressImageFile(file: File, maxWidth = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        resolve('');
        return;
      }
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
    };
    reader.onerror = () => resolve('');
  });
}

export default function BlogRichEditor({ value, onChange, placeholder = 'Start writing your blog article here...' }: BlogRichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedFont, setSelectedFont] = useState<'Calibri' | 'Times New Roman'>('Calibri');
  const [selectedFontSize, setSelectedFontSize] = useState<string>('16px');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageWidth, setImageWidth] = useState<'100%' | '50%' | '30%'>('100%');
  const [imageAlign, setImageAlign] = useState<'center' | 'left' | 'right'>('center');
  const [isPreview, setIsPreview] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // Saved range for restoring selection when inserting image
  const savedRangeRef = useRef<Range | null>(null);

  // Sync value to innerHTML when value is updated externally (e.g. initial load/edit)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const saveCurrentSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const applyFont = (fontName: 'Calibri' | 'Times New Roman') => {
    setSelectedFont(fontName);
    const fontCss = fontName === 'Calibri' ? 'Calibri, sans-serif' : '"Times New Roman", Times, serif';
    
    if (editorRef.current) {
      editorRef.current.focus();
    }

    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontFamily = fontCss;
      try {
        range.surroundContents(span);
      } catch (e) {
        executeCommand('fontName', fontName);
      }
    } else {
      executeCommand('fontName', fontName);
    }
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const applyFontSize = (sizePx: string) => {
    setSelectedFontSize(sizePx);
    if (editorRef.current) {
      editorRef.current.focus();
    }

    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = sizePx;
      try {
        range.surroundContents(span);
      } catch (e) {
        const sizeMap: Record<string, string> = { '14px': '2', '16px': '3', '20px': '4', '24px': '5', '30px': '6' };
        executeCommand('fontSize', sizeMap[sizePx] || '3');
      }
    } else {
      const sizeMap: Record<string, string> = { '14px': '2', '16px': '3', '20px': '4', '24px': '5', '30px': '6' };
      executeCommand('fontSize', sizeMap[sizePx] || '3');
    }
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const openImageModal = () => {
    saveCurrentSelection();
    setShowImageModal(true);
  };

  const handleInsertImage = (e?: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!imageUrl.trim()) return;

    // Construct styled image HTML string according to alignment and fit width settings
    let containerStyle = 'margin: 1.25rem 0; clear: both; display: block;';
    let imgStyle = `max-width: ${imageWidth}; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); object-fit: contain;`;

    if (imageAlign === 'left') {
      containerStyle = 'float: left; margin: 0.5rem 1.25rem 1rem 0; max-width: 50%;';
      imgStyle = `width: 100%; max-width: ${imageWidth === '100%' ? '320px' : imageWidth}; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);`;
    } else if (imageAlign === 'right') {
      containerStyle = 'float: right; margin: 0.5rem 0 1rem 1.25rem; max-width: 50%;';
      imgStyle = `width: 100%; max-width: ${imageWidth === '100%' ? '320px' : imageWidth}; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);`;
    } else {
      containerStyle = 'margin: 1.25rem auto; text-align: center; clear: both; display: block;';
    }

    const figureHtml = `<figure style="${containerStyle}" class="blog-fitted-image align-${imageAlign}">
      <img src="${imageUrl}" alt="${imageAlt || 'Blog Image'}" style="${imgStyle}" class="rounded-xl shadow-sm inline-block" />
      ${imageAlt ? `<figcaption style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem; font-style: italic; text-align: center;">${imageAlt}</figcaption>` : ''}
    </figure><p style="clear: both; margin-top: 0.5rem;"></p>`;

    if (editorRef.current) {
      editorRef.current.focus();
      
      const selection = window.getSelection();
      if (selection && savedRangeRef.current) {
        selection.removeAllRanges();
        selection.addRange(savedRangeRef.current);
      }

      document.execCommand('insertHTML', false, figureHtml);
      onChange(editorRef.current.innerHTML);
    }

    setShowImageModal(false);
    setImageUrl('');
    setImageAlt('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1200, 0.85);
      setImageUrl(compressedDataUrl);
      if (!imageAlt) {
        setImageAlt(file.name.replace(/\.[^/.]+$/, ''));
      }
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setIsProcessingFile(false);
    }
  };

  return (
    <div className="border border-slate-700 rounded-2xl overflow-hidden bg-slate-900 shadow-lg flex flex-col">
      {/* Editor Toolbar */}
      <div className="bg-slate-800/90 border-b border-slate-700/80 p-2.5 flex flex-wrap items-center justify-between gap-2 text-slate-200">
        
        {/* Left Toolbar Group: Fonts, Sizes & Formatting */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Font Family Selection (Calibri & Times New Roman only) */}
          <div className="flex items-center space-x-1 bg-slate-950/80 border border-slate-700/80 rounded-xl p-1">
            <span className="text-[11px] font-bold text-slate-400 px-1.5 flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-sky-400" />
              Font:
            </span>
            <button
              type="button"
              onClick={() => applyFont('Calibri')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedFont === 'Calibri'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              style={{ fontFamily: 'Calibri, sans-serif' }}
            >
              Calibri
            </button>
            <button
              type="button"
              onClick={() => applyFont('Times New Roman')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedFont === 'Times New Roman'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              Times New Roman
            </button>
          </div>

          <div className="h-5 w-[1px] bg-slate-700/80 my-auto" />

          {/* Text Font Size Selector */}
          <div className="flex items-center space-x-1 bg-slate-950/80 border border-slate-700/80 rounded-xl p-1">
            <span className="text-[11px] font-bold text-slate-400 px-1.5 flex items-center gap-1">
              <ALargeSmall className="w-3.5 h-3.5 text-sky-400" />
              Size:
            </span>
            <select
              value={selectedFontSize}
              onChange={(e) => applyFontSize(e.target.value)}
              className="bg-slate-900 text-white text-xs font-semibold rounded-lg px-2 py-0.5 border border-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="14px">Small (14px)</option>
              <option value="16px">Normal (16px)</option>
              <option value="20px">Large (20px)</option>
              <option value="24px">Title (24px)</option>
              <option value="30px">Header (30px)</option>
            </select>
          </div>

          <div className="h-5 w-[1px] bg-slate-700/80 my-auto" />

          {/* Text Style Options (Bold, Italic, Underline) */}
          <div className="flex items-center space-x-1 bg-slate-950/80 border border-slate-700/80 rounded-xl p-1">
            <button
              type="button"
              onClick={() => executeCommand('bold')}
              title="Bold Text"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => executeCommand('italic')}
              title="Italic Text"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => executeCommand('underline')}
              title="Underline Text"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          <div className="h-5 w-[1px] bg-slate-700/80 my-auto" />

          {/* Insert & Fit Image Button */}
          <button
            type="button"
            onClick={openImageModal}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-600/20 text-sky-300 border border-sky-500/30 hover:bg-sky-600 hover:text-white text-xs font-bold transition-all shadow-sm"
          >
            <ImageIcon className="w-4 h-4 text-sky-400" />
            <span>Insert & Fit Image</span>
          </button>

        </div>

        {/* Right Toolbar Group: Preview Mode */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isPreview
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-slate-950 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isPreview ? 'Edit Mode' : 'Preview'}</span>
          </button>
        </div>

      </div>

      {/* Editor Body or Live Preview */}
      {isPreview ? (
        <div className="p-5 bg-white text-slate-900 min-h-[220px] max-h-[340px] overflow-y-auto font-sans leading-relaxed">
          <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3 font-mono flex items-center space-x-2">
            <Eye className="w-4 h-4 text-amber-600" />
            <span>Live Article Preview</span>
          </div>
          <div
            className="prose max-w-none font-medium"
            dangerouslySetInnerHTML={{ __html: value || '<p class="text-slate-400 italic">No content typed yet...</p>' }}
          />
        </div>
      ) : (
        <div className="p-3 bg-slate-950 min-h-[220px] flex flex-col">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={saveCurrentSelection}
            className="w-full flex-1 p-3.5 min-h-[200px] max-h-[320px] overflow-y-auto text-slate-100 focus:outline-none text-base leading-relaxed bg-slate-900/60 rounded-xl border border-slate-800/80 shadow-inner"
            style={{
              fontFamily: selectedFont === 'Calibri' ? 'Calibri, sans-serif' : '"Times New Roman", Times, serif',
            }}
          />
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>Active Font: <strong className="text-sky-400">{selectedFont}</strong> ({selectedFontSize})</span>
            <span>Select text to format font, size, bold, italic, underline, or insert fitted image.</span>
          </div>
        </div>
      )}

      {/* Image Insertion & Fitting Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-5 space-y-4 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-sky-400" />
                <span>Insert & Fit Image into Blog</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Local Laptop Image File Upload */}
              <div>
                <label className="block text-xs font-semibold text-sky-300 mb-1 flex items-center justify-between">
                  <span>📁 Upload Image from Laptop</span>
                  {isProcessingFile && <span className="text-amber-400 animate-pulse text-[10px]">Processing...</span>}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-sky-500/40 text-xs text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-sky-600 file:text-white hover:file:bg-sky-500 cursor-pointer"
                />
              </div>

              <div className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">- OR PASTE URL -</div>

              {/* Image URL Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image Web URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl.startsWith('data:image/') ? '[Local File Selected]' : imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Image Preview Box */}
              {imageUrl && (
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] font-bold text-emerald-400 mb-1">✓ Image Loaded</div>
                  <img src={imageUrl} alt="Preview" className="max-h-28 mx-auto rounded-lg object-contain shadow-md" />
                </div>
              )}

              {/* Caption / Alt text */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image Caption (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Diagram of Binary Search Tree Traversal"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Alignment Controls */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image Alignment & Text Wrapping</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setImageAlign('left')}
                    className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                      imageAlign === 'left'
                        ? 'bg-sky-600 text-white border-sky-400 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                    <span>Float Left</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageAlign('center')}
                    className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                      imageAlign === 'center'
                        ? 'bg-sky-600 text-white border-sky-400 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                    <span>Center Block</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageAlign('right')}
                    className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                      imageAlign === 'right'
                        ? 'bg-sky-600 text-white border-sky-400 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                    <span>Float Right</span>
                  </button>
                </div>
              </div>

              {/* Fit Width Controls */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image Size Fit</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setImageWidth('100%')}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      imageWidth === '100%'
                        ? 'bg-sky-600 text-white border-sky-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    Full (100%)
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageWidth('50%')}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      imageWidth === '50%'
                        ? 'bg-sky-600 text-white border-sky-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    Medium (50%)
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageWidth('30%')}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      imageWidth === '30%'
                        ? 'bg-sky-600 text-white border-sky-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    Small (30%)
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => handleInsertImage(e)}
                  disabled={!imageUrl.trim() || isProcessingFile}
                  className="px-5 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 shadow-md shadow-sky-900/30 disabled:opacity-50"
                >
                  Embed & Fit Image
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
