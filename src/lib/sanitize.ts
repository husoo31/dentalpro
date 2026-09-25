import DOMPurify from "isomorphic-dompurify";

// Allowlist for CMS rich-text fields (Treatment.full_description, Post.content) that are
// rendered with dangerouslySetInnerHTML on public pages. Covers the formatting a WYSIWYG
// editor for this content would realistically produce; anything else (script, iframe, on*
// handlers, style, javascript:/data: URLs) is stripped rather than escaped, so the visible
// content survives but nothing executable does.
const ALLOWED_TAGS = [
  "p", "br", "strong", "b", "em", "i", "u", "s",
  "ul", "ol", "li",
  "h2", "h3", "h4",
  "blockquote", "a", "span", "img",
];
const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "title"];

export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}
