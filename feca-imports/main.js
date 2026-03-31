/* ===== NAV: sticky scroll effect ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 60 ? '0 4px 32px rgba(0,0,0,.35)' : 'none';
});

/* ===== MOBILE MENU ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ===== SCROLL FADE-IN ===== */
const fadeEls = document.querySelectorAll(
  '.card, .cafe-card, .timeline-item, .reg-card, .finance-card, .phase, .stat, .trend-item'
);
fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

/* ===== CONTACT FORM (Formspree-ready / mailto fallback) ===== */
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('submit-btn');
  const success = document.getElementById('form-success');

  // Grab values
  const data = {
    name:    form.name.value,
    email:   form.email.value,
    role:    form.role.value,
    message: form.message.value,
  };

  btn.textContent = 'Sending…';
  btn.disabled = true;

  // Try Formspree if endpoint configured, else fallback
  const FORMSPREE_ID = ''; // ← paste your Formspree form ID here (free at formspree.io)

  if (FORMSPREE_ID) {
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        form.reset();
        success.classList.remove('hidden');
      } else {
        throw new Error('Formspree error');
      }
    } catch {
      mailtoFallback(data);
    }
  } else {
    // No Formspree ID — open mailto
    mailtoFallback(data);
    success.classList.remove('hidden');
  }

  btn.textContent = 'Send Message / Enviar';
  btn.disabled = false;
}

function mailtoFallback(data) {
  const subject = encodeURIComponent(`Féca Imports inquiry from ${data.name}`);
  const body = encodeURIComponent(
    `Name: ${data.name}\nEmail: ${data.email}\nRole: ${data.role}\n\n${data.message}`
  );
  window.location.href = `mailto:hola@fecaimports.com?subject=${subject}&body=${body}`;
}

/* ===== SMOOTH NAV ACTIVE STATES ===== */
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--gold)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
