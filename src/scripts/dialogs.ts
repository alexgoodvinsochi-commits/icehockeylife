// Native <dialog> sheets for coach bios (and anything else long). Each open dialog gets its own
// history entry, so the phone's Back button closes the sheet instead of leaving the page,
// and a link like /#trener-stulov opens the right bio directly.
// Dialogs marked data-sheet-nohistory (the menu) skip history so their anchor links just work.

let openId: string | null = null;

const usesHistory = (d: HTMLDialogElement) => !d.hasAttribute('data-sheet-nohistory');

function open(dialog: HTMLDialogElement, push = true) {
  if (dialog.open) return;
  dialog.showModal();
  document.documentElement.classList.add('has-dialog');
  if (!usesHistory(dialog)) return;
  openId = dialog.id;
  if (push) history.pushState({ dialog: dialog.id }, '', `#${dialog.id}`);
}

function closeFromUi(dialog: HTMLDialogElement) {
  if (usesHistory(dialog) && history.state?.dialog === dialog.id) history.back();
  else dialog.close();
}

export function initDialogs() {
  const dialogs = [...document.querySelectorAll<HTMLDialogElement>('dialog[data-sheet]')];
  if (!dialogs.length) return;

  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const opener = t.closest<HTMLElement>('[data-sheet-open]');
    if (opener) {
      const d = document.getElementById(opener.dataset.sheetOpen!) as HTMLDialogElement | null;
      if (d) {
        e.preventDefault();
        open(d);
      }
      return;
    }
    const closer = t.closest<HTMLElement>('[data-sheet-close]');
    if (closer) {
      const d = closer.closest('dialog') as HTMLDialogElement | null;
      if (d) closeFromUi(d);
    }
  });

  for (const d of dialogs) {
    // click on the backdrop (outside the sheet panel) closes it
    d.addEventListener('click', (e) => {
      if (e.target === d) closeFromUi(d);
    });
    d.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeFromUi(d);
    });
    d.addEventListener('close', () => {
      if (openId === d.id) openId = null;
      if (!document.querySelector('dialog[open]')) document.documentElement.classList.remove('has-dialog');
    });
  }

  window.addEventListener('popstate', () => {
    if (openId) {
      const d = document.getElementById(openId) as HTMLDialogElement | null;
      d?.close();
    }
    const id = history.state?.dialog;
    if (id) {
      const d = document.getElementById(id) as HTMLDialogElement | null;
      if (d) open(d, false);
    }
  });

  const hash = decodeURIComponent(location.hash.slice(1));
  const fromHash = hash && (document.getElementById(hash) as HTMLDialogElement | null);
  if (fromHash && fromHash.matches('dialog[data-sheet]:not([data-sheet-nohistory])')) {
    history.replaceState(null, '', location.pathname + location.search);
    open(fromHash);
  }
}
