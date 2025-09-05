// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navmenu = document.getElementById('navmenu');
if (navToggle && navmenu) {
	navToggle.addEventListener('click', () => {
		const expanded = navToggle.getAttribute('aria-expanded') === 'true';
		navToggle.setAttribute('aria-expanded', String(!expanded));
		navmenu.style.display = expanded ? 'none' : 'flex';
	});
}

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((a) => {
	a.addEventListener('click', (e) => {
		const target = document.querySelector(a.getAttribute('href'));
		if (!target) return;
		e.preventDefault();
		target.scrollIntoView({ behavior: 'smooth', block: 'start' });
	});
});

// Minimal in-view reveal
const observer =
	'IntersectionObserver' in window
		? new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							entry.target.classList.add('reveal');
							observer.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.12 }
		  )
		: null;

document
	.querySelectorAll('.card, .feature, .hero-copy, .device')
	.forEach((el) => {
		if (observer) observer.observe(el);
	});

// Progressive enhancement: add .reveal style
const style = document.createElement('style');
style.textContent = `
  .card, .feature, .hero-copy, .device { opacity: 0; transform: translateY(12px); transition: .5s ease; }
  .reveal { opacity: 1 !important; transform: none !important; }
`;
document.head.appendChild(style);
