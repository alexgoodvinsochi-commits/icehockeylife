// VK Video facade: a poster button that swaps itself for the player iframe on click,
// so the heavy VK player is never loaded unless the parent actually wants to watch.

export function initVideoFacade(el: HTMLElement) {
  const btn = el.querySelector<HTMLButtonElement>('[data-video-play]');
  if (!btn) return;
  btn.addEventListener(
    'click',
    () => {
      const { oid, vid, title } = el.dataset;
      const iframe = document.createElement('iframe');
      iframe.src = `https://vkvideo.ru/video_ext.php?oid=${oid}&id=${vid}&hd=2&autoplay=1`;
      iframe.title = title ?? 'Видео';
      iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock';
      iframe.setAttribute('allowfullscreen', '');
      iframe.loading = 'eager';
      el.classList.add('is-playing');
      btn.replaceWith(iframe);
      iframe.focus();
    },
    { once: true },
  );
}
