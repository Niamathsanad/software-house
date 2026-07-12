// Backend API base — change this if you deploy the backend somewhere else
const API_BASE = window.__API_BASE__ || 'http://localhost:4000';

// Scroll reveal
document.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));

  // Highlight active nav link based on current page
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navlinks a[data-page]').forEach(a => {
    if (a.dataset.page === path) a.classList.add('active');
  });

  // Mobile burger toggle
  const burger = document.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', () => {
      document.querySelector('.navlinks').classList.toggle('mobile-open');
    });
  }

  // Contact form wired to backend
  const form = document.getElementById('leadForm');
  if (form) {
    const msg = document.getElementById('formMsg');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.classList.remove('err');
      msg.textContent = '> sending...';

      const payload = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        details: document.getElementById('details').value.trim(),
        consent: document.getElementById('consent').checked
      };

      try {
        const res = await fetch(`${API_BASE}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          msg.textContent = '> message received — we\'ll reply within one business day.';
          form.reset();
        } else {
          msg.classList.add('err');
          msg.textContent = `> error: ${data.error || 'something went wrong'}`;
        }
      } catch (err) {
        msg.classList.add('err');
        msg.textContent = '> could not reach the server — is the backend running? (see README)';
      }
    });
  }
});
