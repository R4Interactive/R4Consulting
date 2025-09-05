// JS minimal & scopé à .lp pour éviter toute collision
(function () {
	const root = document.querySelector('.lp');
	if (!root) return;

	// Smooth scroll interne (seulement pour les ancres de la section)
	root.querySelectorAll('a[href^="#"]').forEach((a) => {
		a.addEventListener('click', (e) => {
			const target = root.querySelector(a.getAttribute('href'));
			if (!target) return;
			e.preventDefault();
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		});
	});

	// Révélation douce des éléments clés
	const revealEls = root.querySelectorAll(
		'.lp-card, .lp-feature, .lp-hero-copy, .lp-device'
	);
	if ('IntersectionObserver' in window) {
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.style.transition = '.45s ease';
						entry.target.style.opacity = '1';
						entry.target.style.transform = 'none';
						io.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.12 }
		);

		revealEls.forEach((el) => {
			el.style.opacity = '0';
			el.style.transform = 'translateY(12px)';
			io.observe(el);
		});
	}
})();
