import { createElement, ReactNode } from 'react';

export interface RichTextSegment {
  text: string;
  color?: string;
  bg?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

/**
 * Parse a rich text string into segments.
 * Supports: [color=#hex], [bg=#hex], [bold], [italic], [underline]
 * Input: "Halo [bold][color=#FF0000]dunia[/color][/bold] ini"
 * Output: [{text: "Halo "}, {text: "dunia", bold: true, color: "#FF0000"}, {text: " ini"}]
 */
export function parseRichText(input: string): RichTextSegment[] {
  if (!input) return [];
  const segments: RichTextSegment[] = [];
  // Flatten nested tags to a single pass using a stack
  const regex = /\[(color|bg|bold|italic|underline)(?:=([^\]]+))?\]|\[\/(color|bg|bold|italic|underline)\]/g;
  let lastIndex = 0;
  let match;

  // Stack of active formats
  let activeColor = '';
  let activeBg = '';
  let activeBold = false;
  let activeItalic = false;
  let activeUnderline = false;

  while ((match = regex.exec(input)) !== null) {
    // Text before the tag
    if (match.index > lastIndex) {
      const text = input.slice(lastIndex, match.index);
      if (text) {
        segments.push({
          text,
          color: activeColor || undefined,
          bg: activeBg || undefined,
          bold: activeBold || undefined,
          italic: activeItalic || undefined,
          underline: activeUnderline || undefined,
        });
      }
    }

    const fullTag = match[0];
    const tagType = match[1] || match[3]; // opening or closing
    const value = match[2]; // for color=xxx or bg=xxx

    if (fullTag.startsWith('[/')) {
      // Closing tag — pop the format
      if (tagType === 'color') activeColor = '';
      if (tagType === 'bg') activeBg = '';
      if (tagType === 'bold') activeBold = false;
      if (tagType === 'italic') activeItalic = false;
      if (tagType === 'underline') activeUnderline = false;
    } else {
      // Opening tag — push the format
      if (tagType === 'color') activeColor = value || '';
      if (tagType === 'bg') activeBg = value || '';
      if (tagType === 'bold') activeBold = true;
      if (tagType === 'italic') activeItalic = true;
      if (tagType === 'underline') activeUnderline = true;
    }

    lastIndex = regex.lastIndex;
  }

  // Remaining text after last tag
  if (lastIndex < input.length) {
    const text = input.slice(lastIndex);
    if (text) {
      segments.push({
        text,
        color: activeColor || undefined,
        bg: activeBg || undefined,
        bold: activeBold || undefined,
        italic: activeItalic || undefined,
        underline: activeUnderline || undefined,
      });
    }
  }

  if (segments.length === 0 && input) {
    segments.push({ text: input });
  }

  return segments;
}

/**
 * Convert rich text string to React elements (spans)
 * Pass baseStyle untuk styling dasar (fontSize, lineHeight, dll)
 */
export function renderRichText(
  input: string,
  baseStyle?: React.CSSProperties,
  keyPrefix?: string,
): ReactNode[] {
  const segments = parseRichText(input);
  return segments.map((seg, i) => {
    const style: React.CSSProperties = { ...baseStyle };
    if (seg.color) style.color = seg.color;
    if (seg.bg) style.backgroundColor = seg.bg;
    if (seg.bold) style.fontWeight = 'bold';
    if (seg.italic) style.fontStyle = 'italic';
    if (seg.underline) style.textDecoration = 'underline';

    return createElement(
      'span',
      {
        key: `${keyPrefix || 'rt'}-${i}`,
        style,
      },
      seg.text,
    );
  });
}

/**
 * Check if text contains any formatting markup
 */
export function hasFormattingMarkup(input: string): boolean {
  return /\[(color|bg|bold|italic|underline)[=\]]/i.test(input);
}

/**
 * Extract plain text (strip ALL markup tags)
 * "[bold][color=#FF0000]halo[/color][/bold]" → "halo"
 */
export function stripColorTags(input: string): string {
  return input
    .replace(/\[color=[^\]]+\]/gi, '')
    .replace(/\[\/color\]/gi, '')
    .replace(/\[bg=[^\]]+\]/gi, '')
    .replace(/\[\/bg\]/gi, '')
    .replace(/\[bold\]/gi, '')
    .replace(/\[\/bold\]/gi, '')
    .replace(/\[italic\]/gi, '')
    .replace(/\[\/italic\]/gi, '')
    .replace(/\[underline\]/gi, '')
    .replace(/\[\/underline\]/gi, '');
}