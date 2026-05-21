// =============================================================
// GREAT SALT LAKE SITE — SCRIPT
// Small, dependency-free interactions:
//   1. Copy-letter button on the Take Action section
//   2. Reveal-on-scroll for bar chart fills (so the chart animates in)
// =============================================================

(function () {
  // -----------------------------------------------------------
  // 1. Copy-letter button
  // -----------------------------------------------------------
  const copyBtn = document.getElementById('copyLetterBtn');
  const letterBody = document.getElementById('letterBody');

  if (copyBtn && letterBody) {
    copyBtn.addEventListener('click', function () {
      const text = letterBody.textContent || '';
      const fallback = function () {
        const range = document.createRange();
        range.selectNodeContents(letterBody);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        try {
          document.execCommand('copy');
        } catch (_) {}
        sel.removeAllRanges();
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          () => flash(copyBtn, 'Copied!'),
          () => { fallback(); flash(copyBtn, 'Copied!'); }
        );
      } else {
        fallback();
        flash(copyBtn, 'Copied!');
      }
    });
  }

  function flash(btn, msg) {
    const original = btn.textContent;
    btn.textContent = msg;
    btn.disabled = true;
    setTimeout(function () {
      btn.textContent = original;
      btn.disabled = false;
    }, 1600);
  }

  // -----------------------------------------------------------
  // 2. Animate bar chart fills when scrolled into view.
  //    The CSS defines `width: 71%` etc. inline — but we reset
  //    them to 0 on load and restore on intersection so the
  //    animation actually plays.
  // -----------------------------------------------------------
  const fills = document.querySelectorAll('.bar-row__fill');
  if (fills.length && 'IntersectionObserver' in window) {
    // capture the intended widths and reset to 0
    fills.forEach(function (el) {
      el.dataset.targetWidth = el.style.width || '0';
      el.style.width = '0%';
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          // delay each bar slightly for a staggered effect
          const idx = Array.from(fills).indexOf(el);
          setTimeout(function () {
            el.style.width = el.dataset.targetWidth;
          }, idx * 120);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    fills.forEach(function (el) { observer.observe(el); });
  }
})();
