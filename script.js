// ============================================================
// Nichi Electric — site interactivity
// ============================================================

// ---- Mobile nav toggle ----
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---- Cursor-follow glow (desktop only, respects reduced motion) ----
const glowLayer = document.querySelector('.glow-layer');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (glowLayer && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (e) => {
    glowLayer.style.setProperty('--mx', e.clientX + 'px');
    glowLayer.style.setProperty('--my', e.clientY + 'px');
  });
}

// ---- Signature interaction: the "transforms" switch dims the whole page ----
const switchWord = document.getElementById('switchWord');
if (switchWord) {
  const toggleLights = () => {
    const isOff = document.body.classList.toggle('lights-off');
    switchWord.setAttribute('aria-pressed', String(!isOff));
  };
  switchWord.addEventListener('click', toggleLights);
  switchWord.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleLights();
    }
  });
}

// ---- Enquiry form: submit via fetch so it auto-sends without opening a mail app ----
const form = document.getElementById('enquiryForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.btn-submit');
    const btnLabel = submitBtn.querySelector('.btn-label');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    // Guard: if the Formspree ID hasn't been set up yet, don't silently fail.
    if (form.action.includes('YOUR_FORM_ID')) {
      alert(
        'The enquiry form isn\'t connected to an email endpoint yet.\n\n' +
        'To finish setup: create a free form at formspree.io, verify ebshome@yahoo.com ' +
        'as the recipient, then replace YOUR_FORM_ID in index.html with your real form ID.'
      );
      return;
    }

    submitBtn.disabled = true;
    btnLabel.hidden = true;
    btnLoading.hidden = false;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.hidden = true;
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      alert('Something went wrong sending your enquiry. Please try again, or email us directly at ebshome@yahoo.com.');
      submitBtn.disabled = false;
      btnLabel.hidden = false;
      btnLoading.hidden = true;
    }
  });
}
