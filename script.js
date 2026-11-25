(() => {
 'use strict';
 /* Contact enquiries open in the visitor's email application. */
 const SITE_CONFIG = Object.freeze({ contactEmail: 'contact@op2mum.com' });
 const form = document.getElementById('contact-form');
 const button = document.getElementById('contact-button');
 const note = document.getElementById('contact-note');
 const result = document.getElementById('contact-result');
 const resultText = document.getElementById('result-text');
 const draft = document.getElementById('message-draft');
 const copyButton = document.getElementById('copy-message');
 const copyStatus = document.getElementById('copy-status');
 const hasContactEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(SITE_CONFIG.contactEmail);
 if (hasContactEmail) {
  button.querySelector('.button-label').textContent = 'Open email draft';
  note.textContent = 'Opens your email app. Please do not include confidential information in your first message.';
 }
 form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const name = form.elements.namedItem('name').value.trim();
  const email = form.elements.namedItem('email').value.trim();
  const message = form.elements.namedItem('message').value.trim();
  if (!name || !message) {
   const field = !name ? form.elements.namedItem('name') : form.elements.namedItem('message');
   field.setCustomValidity('Please enter a non-empty value.');
   field.reportValidity();
   field.addEventListener('input', () => field.setCustomValidity(''), {once:true});
   return;
  }
  draft.value = `Hello OP2MUM,\n\n${message}\n\nName: ${name}\nEmail: ${email}`;
  copyStatus.textContent = '';
  result.hidden = false;
  if (hasContactEmail) {
   resultText.textContent = 'An email draft is being opened. Nothing is sent until you send it in your email app. You can also copy your message below.';
   window.location.href = `mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent('OP2MUM | New opportunity')}&body=${encodeURIComponent(draft.value)}`;
  } else {
   resultText.textContent = 'Your message is ready to copy. Email it to contact@op2mum.com.';
  }
  result.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',block:'nearest'});
  copyButton.focus({preventScroll:true});
 });
 copyButton.addEventListener('click', async () => {
  try {
   if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard not available');
   await navigator.clipboard.writeText(draft.value);
   copyStatus.textContent = 'Copied. Nothing has been sent.';
  } catch (_) {
   draft.focus(); draft.select();
   let copied = false;
   try { copied = document.execCommand('copy'); } catch (_) {}
   copyStatus.textContent = copied ? 'Copied. Nothing has been sent.' : 'Message selected. Use your device’s Copy command.';
  }
 });
 document.getElementById('contact-fields').disabled = false;
})();
