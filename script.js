/**
 * script.js
 *
 * Here we set up the JavaScript behavior for:
 * - Capturing the form submission (example: AJAX send or console.log)
 * - Opening WhatsApp link in a new tab
 * - Opening Calendly scheduling link in a new tab
 * - Adding simple animations: hover effects on service cards and
 *   scroll‐reveal for sections
 */

document.addEventListener('DOMContentLoaded', function () {
	// 1) WhatsApp Button Behavior
	const whatsappBtn = document.getElementById('whatsappBtn');
	if (whatsappBtn) {
		whatsappBtn.addEventListener('click', function (e) {
			e.preventDefault();
			// Replace this phone number with your actual WhatsApp link
			// Example:
			//   https://wa.me/<YOUR_COUNTRYCODE+NUMBER>?text=<ENCODED_MESSAGE>
			const whatsappLink =
				'https://wa.me/33784298202?text=Bonjour%20R4%20Consulting%20!%20Je%20souhaite%20prendre%20contact.';
			window.open(whatsappLink, '_blank');
		});
	}

	// 2) Calendly Button Behavior
	const calendlyBtn = document.getElementById('calendlyBtn');
	if (calendlyBtn) {
		calendlyBtn.addEventListener('click', function (e) {
			e.preventDefault();
			// Replace this URL with your actual Calendly scheduling page
			const calendlyLink =
				'https://calendly.com/votre-compte-r4-consulting';
			window.open(calendlyLink, '_blank');
		});
	}

	// 3) Contact Form Submission (example stub)
	const contactForm = document.getElementById('contactForm');
	if (contactForm) {
		contactForm.addEventListener('submit', function (e) {
			e.preventDefault();
			// Simple example: collect fields and log them.
			const formData = {
				name: e.target.name.value.trim(),
				email: e.target.email.value.trim(),
				phone: e.target.phone.value.trim(),
				message: e.target.message.value.trim(),
			};
			console.log('Formulaire R4 Consulting soumis :', formData);

			// TODO: Remplacez ce console.log par un appel AJAX ou autre mécanisme
			// pour envoyer ces infos à votre backend (PHP, Node.js, etc.)

			// You can show a “Merci” message or reset the form:
			alert('Merci ! Votre message a bien été envoyé.');
			e.target.reset();
		});
	}

	// 4) Hover Animation on Service Cards
	//    Scale up slightly on mouseenter, scale back on mouseleave
	const serviceCards = document.querySelectorAll('.service-card');
	serviceCards.forEach((card) => {
		card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
		card.addEventListener('mouseenter', () => {
			card.style.transform = 'scale(1.03)';
			card.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.6)';
		});
		card.addEventListener('mouseleave', () => {
			card.style.transform = 'scale(1)';
			card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
		});
	});

	// 5) Scroll‐Reveal Animation for Sections
	//    Elements with class "reveal" will fade/slide in when entering viewport
	const revealElements = document.querySelectorAll('.reveal');
	const revealObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('reveal-visible');
					revealObserver.unobserve(entry.target);
				}
			});
		},
		{
			root: null,
			rootMargin: '0px',
			threshold: 0.15,
		}
	);

	revealElements.forEach((el) => {
		// Start hidden
		el.classList.add('reveal-hidden');
		revealObserver.observe(el);
	});

	// 6) Smooth Scroll for Anchor Links (optional)
	//    Applies to any <a href="#sectionID">
	const anchorLinks = document.querySelectorAll('a[href^="#"]');
	anchorLinks.forEach((link) => {
		link.addEventListener('click', function (e) {
			const targetId = this.getAttribute('href').slice(1);
			const targetEl = document.getElementById(targetId);
			if (targetEl) {
				e.preventDefault();
				window.scrollTo({
					top: targetEl.offsetTop - 60, // adjust offset as needed for fixed nav
					behavior: 'smooth',
				});
			}
		});
	});
});

/**
 * script.js
 *
 * Comportements JavaScript mis à jour pour :
 * - Capturer le formulaire
 * - Ouvrir WhatsApp/Calendly
 * - Hover animations sur cartes (rotation)
 * - Scroll‐reveal pour sections
 * - Smooth scroll pour ancres
 * - Hero fade‐in au chargement
 * - Menu “active” selon le scroll
 * - Bouton “Retour en haut”
 * - Apparition TRÈS lente et échelonnée des cartes de service
 */

document.addEventListener('DOMContentLoaded', function () {
	// 1) Hero Fade‐In à l’arrivée
	const heroInner = document.querySelector('.hero-inner');
	if (heroInner) {
		setTimeout(() => {
			heroInner.classList.add('hero-visible');
		}, 100);
	}

	// 2) WhatsApp Button Behavior
	const whatsappBtn = document.getElementById('whatsappBtn');
	if (whatsappBtn) {
		whatsappBtn.addEventListener('click', function (e) {
			e.preventDefault();
			const whatsappLink =
				'https://wa.me/33123456789?text=Bonjour%20R4%20Consulting%20!%20Je%20souhaite%20prendre%20contact.';
			window.open(whatsappLink, '_blank');
		});
	}

	// 3) Calendly Button Behavior
	const calendlyBtn = document.getElementById('calendlyBtn');
	if (calendlyBtn) {
		calendlyBtn.addEventListener('click', function (e) {
			e.preventDefault();
			const calendlyLink =
				'https://calendly.com/votre-compte-r4-consulting';
			window.open(calendlyLink, '_blank');
		});
	}

	// 4) Contact Form Submission
	const contactForm = document.getElementById('contactForm');
	if (contactForm) {
		contactForm.addEventListener('submit', function (e) {
			e.preventDefault();
			const formData = {
				name: e.target.name.value.trim(),
				email: e.target.email.value.trim(),
				phone: e.target.phone.value.trim(),
				message: e.target.message.value.trim(),
			};
			console.log('Formulaire R4 Consulting soumis :', formData);
			alert('Merci ! Votre message a bien été envoyé.');
			e.target.reset();
		});
	}

	// 5) Scroll‐Reveal pour .reveal (inchangé)
	const revealElements = document.querySelectorAll('.reveal');
	const revealObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('reveal-visible');
					revealObserver.unobserve(entry.target);
				}
			});
		},
		{ root: null, rootMargin: '0px', threshold: 0.15 }
	);
	revealElements.forEach((el) => {
		el.classList.add('reveal-hidden');
		revealObserver.observe(el);
	});

	// 6) Apparition échelonnée (staggered) DES CARTES DE SERVICE
	const serviceCards = Array.from(document.querySelectorAll('.service-card'));
	const cardObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const card = entry.target;
					// Déterminer l’index de cette carte dans la liste
					const index = serviceCards.indexOf(card);
					// Calculer un délai échelonné : par ex. 0.5s * index
					const delay = 0.5 + index * 0.5; // Commence à 0.5s, puis 1.0s, 1.5s, ...
					// Appliquer en ligne le délai de transition (override du CSS)
					card.style.transition = `opacity 3s ease-out ${delay}s, transform 3s ease-out ${delay}s`;
					// Ajouter la classe visible pour démarrer l’animation
					card.classList.add('visible');
					cardObserver.unobserve(card);
				}
			});
		},
		{ root: null, rootMargin: '0px', threshold: 0.2 }
	);
	serviceCards.forEach((card) => {
		cardObserver.observe(card);
	});

	// 7) Smooth Scroll pour les ancres
	const anchorLinks = document.querySelectorAll('a[href^="#"]');
	anchorLinks.forEach((link) => {
		link.addEventListener('click', function (e) {
			const targetId = this.getAttribute('href').slice(1);
			const targetEl = document.getElementById(targetId);
			if (targetEl) {
				e.preventDefault();
				window.scrollTo({
					top: targetEl.offsetTop - 60,
					behavior: 'smooth',
				});
			}
		});
	});

	// 8) Mise à jour “active” du menu suivant le scroll
	const sections = document.querySelectorAll('section[id]');
	const navLinks = document.querySelectorAll('.main-nav a');
	const sectionObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				const id = entry.target.getAttribute('id');
				const navLink = document.querySelector(
					`.main-nav a[href="#${id}"]`
				);
				if (entry.isIntersecting) {
					navLinks.forEach((link) => link.classList.remove('active'));
					if (navLink) navLink.classList.add('active');
				}
			});
		},
		{ root: null, rootMargin: '0px 0px -50% 0px', threshold: 0 }
	);
	sections.forEach((section) => {
		sectionObserver.observe(section);
	});

	// 9) Bouton “Retour en haut”
	const backToTop = document.createElement('button');
	backToTop.id = 'backToTop';
	backToTop.innerHTML = '&#8679;'; // flèche vers le haut
	document.body.appendChild(backToTop);

	backToTop.addEventListener('click', () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});

	window.addEventListener('scroll', () => {
		if (window.scrollY > 400) {
			backToTop.classList.add('visible');
		} else {
			backToTop.classList.remove('visible');
		}
	});
});

// script.js

document.addEventListener('DOMContentLoaded', function () {
	// Récupère le bouton
	const themeToggle = document.getElementById('themeToggle');
	const body = document.body;

	// 1) Vérifier dans localStorage si un choix est déjà enregistré
	const storedTheme = localStorage.getItem('r4-theme');
	if (storedTheme === 'light') {
		body.classList.add('light-theme');
		themeToggle.textContent = '☀️'; // icône soleil si mode clair actif
	} else {
		// Si pas de choix ou “dark”, on reste en sombre
		body.classList.remove('light-theme');
		themeToggle.textContent = '🌙'; // icône lune si mode sombre actif
	}

	// 2) Au clic, on bascule la classe sur <body> et on stocke le choix
	themeToggle.addEventListener('click', function () {
		if (body.classList.contains('light-theme')) {
			// On passe en mode sombre
			body.classList.remove('light-theme');
			themeToggle.textContent = '🌙';
			localStorage.setItem('r4-theme', 'dark');
		} else {
			// On passe en mode clair
			body.classList.add('light-theme');
			themeToggle.textContent = '☀️';
			localStorage.setItem('r4-theme', 'light');
		}
	});

	// … votre code existant (par ex. l’init des reveals / formulaires, etc.) …
	// Exemple pour la partie “Scroll‐Reveal” déjà en place :
	const revealElements = document.querySelectorAll('.reveal');
	const revealObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('reveal-visible');
					revealObserver.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.15 }
	);

	revealElements.forEach((el) => {
		el.classList.add('reveal-hidden');
		revealObserver.observe(el);
	});

	// Exemple de form handling déjà précédemment fourni :
	const whatsappBtn = document.getElementById('whatsappBtn');
	if (whatsappBtn) {
		whatsappBtn.addEventListener('click', function (e) {
			e.preventDefault();
			const whatsappLink =
				'https://wa.me/33123456789?text=Bonjour%20R4%20Consulting%20!%20Je%20souhaite%20prendre%20contact.';
			window.open(whatsappLink, '_blank');
		});
	}

	const calendlyBtn = document.getElementById('calendlyBtn');
	if (calendlyBtn) {
		calendlyBtn.addEventListener('click', function (e) {
			e.preventDefault();
			const calendlyLink =
				'https://calendly.com/votre-compte-r4-consulting';
			window.open(calendlyLink, '_blank');
		});
	}

	const contactForm = document.getElementById('contactForm');
	if (contactForm) {
		contactForm.addEventListener('submit', function (e) {
			e.preventDefault();
			const formData = {
				name: e.target.name.value.trim(),
				email: e.target.email.value.trim(),
				phone: e.target.phone.value.trim(),
				message: e.target.message.value.trim(),
			};
			console.log('Formulaire soumis :', formData);
			alert('Merci ! Votre message a bien été envoyé.');
			e.target.reset();
		});
	}
});
