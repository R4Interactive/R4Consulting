// script.blog.js

document.addEventListener('DOMContentLoaded', () => {
	// Sélectionne tous les éléments (liens, boutons…) qui doivent rediriger vers contact
	const ctaButtons = document.querySelectorAll('.js-contact-redirect');

	ctaButtons.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();

			// On récupère le chemin de la page actuelle (par ex. /blog/article1.html)
			const articleTitleEl = document.querySelector('.post-title');
			const articleTitle = articleTitleEl
				? articleTitleEl.textContent.trim()
				: 'Article';

			// On construit l'URL de redirection vers contact.html
			// avec un paramètre `from` qui contient la page d'origine
			const url = new URL(window.location.origin + '/contact.html');
			url.searchParams.set('from', articleTitle);
			window.location.href = url.toString();
		});
	});
});

document.addEventListener('DOMContentLoaded', () => {
	// 1) Gestion du thème sombre/clair
	const toggle = document.getElementById('themeToggle');
	const body = document.body;
	if (localStorage.getItem('r4-theme') === 'light') {
		body.classList.add('light-theme');
		toggle.textContent = '☀️';
	}
	toggle.addEventListener('click', () => {
		const isLight = body.classList.toggle('light-theme');
		toggle.textContent = isLight ? '☀️' : '🌙';
		localStorage.setItem('r4-theme', isLight ? 'light' : 'dark');
	});

	// 2) Soumission du formulaire avec validation
	const form = document.getElementById('contactForm');
	form.addEventListener('submit', (e) => {
		e.preventDefault();

		// Champs obligatoires
		const requiredIds = ['name', 'email', 'phone', 'subject', 'message'];
		const missing = requiredIds.filter((id) => {
			const el = form.querySelector('#' + id);
			return !el || el.value.trim() === '';
		});

		if (missing.length > 0) {
			// On alerte sur le premier champ manquant
			const labels = {
				name: 'Nom',
				email: 'E-mail',
				phone: 'Téléphone',
				subject: 'Objet',
				message: 'Message',
			};
			alert(`Veuillez remplir le champ « ${labels[missing[0]]} ».`);
			form.querySelector('#' + missing[0]).focus();
			return;
		}

		// Tout est valide : on affiche le message de succès
		alert(
			'Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.'
		);
		form.reset();
	});

	// 3) WhatsApp
	document.getElementById('whatsappBtn').addEventListener('click', (e) => {
		e.preventDefault();
		window.open('https://wa.me/33784298202', '_blank');
	});

	// 4) Calendly
	document.getElementById('calendlyBtn').addEventListener('click', () => {
		window.open('https://calendly.com/r4consulting/30min', '_blank');
	});

	// 5) Pré-remplissage du champ "origine" depuis l’URL (?from=…)
	const params = new URLSearchParams(window.location.search);
	const from = params.get('from');
	if (from) {
		const origineField = document.getElementById('origine');
		if (origineField) origineField.value = from;
	}
});
