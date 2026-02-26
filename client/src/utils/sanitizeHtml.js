/**
 * Allow only safe tags for diary HTML. Removes script, iframe, form, etc.
 */
const ALLOWED_TAGS = ['p', 'br', 'b', 'i', 'strong', 'em', 'span', 'ul', 'ol', 'li'];

export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  const removeBad = (node) => {
    const toRemove = [];
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName.toLowerCase();
        if (ALLOWED_TAGS.includes(tag)) {
          removeBad(child);
        } else {
          toRemove.push(child);
        }
      }
    });
    toRemove.forEach((n) => n.remove());
  };
  removeBad(div);
  return div.innerHTML;
}

export function isHtml(text) {
  return typeof text === 'string' && /<[a-z][\s\S]*>/i.test(text);
}
