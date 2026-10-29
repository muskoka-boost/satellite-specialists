(() => {
  document.documentElement.classList.add('js');

  // Reveal photos + booster as they enter (content is visible without JS).
  const targets = document.querySelectorAll('.reveal, .booster');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    targets.forEach((t) => io.observe(t));
  } else {
    targets.forEach((t) => t.classList.add('in'));
  }

  // "Book" links preselect the service in the form.
  const form = document.getElementById('msg-form');
  document.querySelectorAll('[data-service]').forEach((a) => {
    a.addEventListener('click', () => {
      const want = a.dataset.service.toLowerCase();
      const opt = [...form.service.options].find((o) => o.text.toLowerCase().startsWith(want.split(' ')[0]) && o.text.toLowerCase().includes(want.split(' ').pop()));
      if (opt) form.service.value = opt.text;
    });
  });

  // Form writes a text message; nothing is sent to a server.
  const out = document.getElementById('form-out');
  const msg = document.getElementById('form-msg');
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const d = new FormData(form);
    const name = (d.get('name') || '').trim();
    const nameInput = form.elements.namedItem('name');
    if (!name) { nameInput.focus(); nameInput.setAttribute('aria-invalid', 'true'); return; }
    nameInput.removeAttribute('aria-invalid');
    const lines = [
      `Hi Satellite Specialists, this is ${name}.`,
      `I need: ${d.get('service')}.`,
      d.get('town') ? `Location: ${d.get('town').trim()}.` : '',
      d.get('details') ? d.get('details').trim() : ''
    ].filter(Boolean);
    const text = lines.join('\n');
    msg.value = text;
    out.hidden = false;
    const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (mobile) window.location.href = 'sms:+14372251540?body=' + encodeURIComponent(text);
  });
  document.getElementById('copy-msg').addEventListener('click', async (e) => {
    try { await navigator.clipboard.writeText(msg.value); e.target.textContent = 'Copied'; }
    catch { msg.select(); }
  });

  document.getElementById('yr').textContent = new Date().getFullYear();
})();
