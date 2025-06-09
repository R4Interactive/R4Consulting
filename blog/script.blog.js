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

	// 2) Soumission du formulaire avec validation et envoi
	const form = document.getElementById('contactForm');
	form.addEventListener('submit', async (e) => {
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

		//  contrôle du format du numéro de téléphone
		const phoneValue = form.querySelector('#phone').value.trim();
		const phonePattern = /^(\d{10}|\+ ?33\s?[0-9](?:\s?\d{2}){4})$/;
		if (!phonePattern.test(phoneValue)) {
			alert(
				'Le numéro de téléphone doit comporter 10 chiffres ou être au format "+ 33 1 23 45 67 89".'
			);
			form.querySelector('#phone').focus();
			return;
		}

		const data = {
			name: form.name.value,
			email: form.email.value,
			phone: form.phone.value,
			subject: form.subject.value,
			message: form.message.value,
		};

		try {
			const resp = await fetch('http://localhost:3000/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});
			const json = await resp.json();
			if (json.success) {
				alert('Merci ! Votre message a bien été envoyé.');
				form.reset();
			} else {
				alert(json.error || 'Erreur serveur');
			}
		} catch (err) {
			console.error(err);
			alert('Erreur réseau, réessayez plus tard.');
		}
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
document.addEventListener('DOMContentLoaded', () => {
	const btn = document.getElementById('hamburgerBtn');
	btn.addEventListener('click', () => {
		document.body.classList.toggle('nav-open');
	});

	// Fermer le menu quand on clique sur un lien
	document.querySelectorAll('.main-nav a').forEach((link) => {
		link.addEventListener('click', () => {
			document.body.classList.remove('nav-open');
		});
	});
});
