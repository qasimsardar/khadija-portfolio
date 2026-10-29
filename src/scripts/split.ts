// SplitText with accessible output. Elements that may carry aria-label (links, buttons, headings) get SplitText's
// own labelling; on plain text elements, line/word splits stay readable as they are, while character splits are
// hidden from assistive tech behind a visually-hidden copy of the text (so screen readers don't spell it out).
import { SplitText } from 'gsap/SplitText';

const LABELABLE = /^(A|BUTTON|H[1-6])$/;

export function split(el: HTMLElement, vars: SplitText.Vars): SplitText {
  if (LABELABLE.test(el.tagName) || el.hasAttribute('role')) return SplitText.create(el, { aria: 'auto', ...vars });
  if (/chars/.test(vars.type)) {
    if (!el.previousElementSibling?.hasAttribute('data-sr-copy')) {
      const copy = document.createElement('span');
      copy.className = 'visually-hidden';
      copy.dataset.srCopy = '';
      copy.textContent = el.textContent;
      el.before(copy);
    }
    el.setAttribute('aria-hidden', 'true');
  }
  return SplitText.create(el, { aria: 'none', ...vars });
}
