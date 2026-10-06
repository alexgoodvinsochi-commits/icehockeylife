// Photo viewer for the gallery: one <dialog>, arrows / swipe / keyboard, images loaded on demand.
// Markup: <a data-lightbox href="full.jpg" data-srcset="…" data-sizes="…"><img alt="…"></a>
// and a <dialog data-lightbox-dialog> with [data-lb-img], [data-lb-caption], [data-lb-prev], [data-lb-next],
// [data-lb-close], [data-lb-count].

export function initLightbox() {
  const dialog = document.querySelector<HTMLDialogElement>('dialog[data-lightbox-dialog]');
  const links = [...document.querySelectorAll<HTMLAnchorElement>('a[data-lightbox]')];
  if (!dialog || !links.length) return;

  const img = dialog.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const caption = dialog.querySelector<HTMLElement>('[data-lb-caption]');
  const count = dialog.querySelector<HTMLElement>('[data-lb-count]');
  let i = 0;

  const show = (n: number) => {
    i = (n + links.length) % links.length;
    const a = links[i];
    const thumb = a.querySelector('img');
    img.removeAttribute('srcset');
    img.src = a.href;
    if (a.dataset.srcset) img.srcset = a.dataset.srcset;
    img.sizes = a.dataset.sizes ?? '100vw';
    img.alt = thumb?.alt ?? '';
    // the caption names the part of the programme when it is known; the alt text stays for screen readers
    if (caption) caption.textContent = a.dataset.caption ?? '';
    if (count) count.textContent = `${i + 1} / ${links.length}`;
    // warm up the neighbours
    for (const k of [i + 1, i - 1]) {
      const nb = links[(k + links.length) % links.length];
      const pre = new Image();
      if (nb.dataset.srcset) pre.srcset = nb.dataset.srcset;
      pre.sizes = nb.dataset.sizes ?? '100vw';
      pre.src = nb.href;
    }
  };

  links.forEach((a, n) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      show(n);
      dialog.showModal();
      document.documentElement.classList.add('has-dialog');
    }),
  );

  const close = () => dialog.close();
  dialog.addEventListener('close', () => document.documentElement.classList.remove('has-dialog'));
  dialog.querySelector('[data-lb-prev]')?.addEventListener('click', () => show(i - 1));
  dialog.querySelector('[data-lb-next]')?.addEventListener('click', () => show(i + 1));
  dialog.querySelector('[data-lb-close]')?.addEventListener('click', close);
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(i + 1);
    if (e.key === 'ArrowLeft') show(i - 1);
  });

  let x0: number | null = null;
  dialog.addEventListener('pointerdown', (e) => (x0 = e.clientX), { passive: true });
  dialog.addEventListener('pointercancel', () => (x0 = null), { passive: true });
  dialog.addEventListener(
    'pointerup',
    (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50) show(dx < 0 ? i + 1 : i - 1);
    },
    { passive: true },
  );
}
