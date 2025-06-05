/**
 * script.js
 *
 * Comportements JavaScript pour :
 * 1) Bascule Thème sombre / Clair (localStorage)
 * 2) Scroll‐Reveal pour toutes les sections .reveal
 * 3) Slider “Ils témoignent” (1, 2 ou 3 cartes visibles selon largeur)
 * 4) Formulaire / WhatsApp / Calendly
 * 5) Hover animation sur .service-card
 * 6) Smooth Scroll + menu “active”
 * 7) Bouton “Retour en haut”
 * 8) Hero Fade‐In au chargement
 * 9) Apparition échelonnée des cartes de service
 */

document.addEventListener('DOMContentLoaded', function () {
	// ----------------------------------------
	// 1) BASCULE THÈME SOMBRE / CLAIR (localStorage)
	// ----------------------------------------
	const themeToggle = document.getElementById('themeToggle');
	const body = document.body;
	const storedTheme = localStorage.getItem('r4-theme');
	if (storedTheme === 'light') {
		body.classList.add('light-theme');
		if (themeToggle) themeToggle.textContent = '☀️';
	} else {
		body.classList.remove('light-theme');
		if (themeToggle) themeToggle.textContent = '🌙';
	}
	if (themeToggle) {
		themeToggle.addEventListener('click', function () {
			if (body.classList.contains('light-theme')) {
				body.classList.remove('light-theme');
				themeToggle.textContent = '🌙';
				localStorage.setItem('r4-theme', 'dark');
			} else {
				body.classList.add('light-theme');
				themeToggle.textContent = '☀️';
				localStorage.setItem('r4-theme', 'light');
			}
		});
	}

	// ----------------------------------------
	// 2) SCROLL‐REVEAL POUR LES SECTIONS .reveal
	// ----------------------------------------
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

	// ====================================================
	// 3) CAROUSEL “ILS TÉMOIGNENT” (1, 2 ou 3 cartes visibles)
	// ====================================================
	const slider = document.querySelector('.testimonials-slider');
	const cards = document.querySelectorAll('.testimonial-card');
	let currentIndex = 0;
	let testimonialInterval = null;

	function getVisibleCount() {
		const w = window.innerWidth;
		if (w >= 1200) return 3;
		if (w >= 768) return 2;
		return 1;
	}

	if (slider && cards.length > 0) {
		let visibleCount = getVisibleCount();

		// Affecte à chaque carte une largeur flex appropriée
		function updateCardWidths() {
			visibleCount = getVisibleCount();
			const widthPercent = 100 / visibleCount;
			cards.forEach((card) => {
				card.style.flex = `0 0 ${widthPercent}%`;
			});
		}

		// Affiche la carte d’index « index »
		function showTestimonial(index) {
			const widthPercent = 100 / visibleCount;
			const offset = -index * widthPercent;
			slider.style.transform = `translateX(${offset}%)`;
		}

		// Passe à la carte suivante (boucle)
		function nextTestimonial() {
			// on n’autorise pas d’index supérieur à (cards.length - visibleCount)
			const maxIndex = cards.length - visibleCount;
			if (currentIndex < maxIndex) {
				currentIndex++;
			} else {
				currentIndex = 0;
			}
			showTestimonial(currentIndex);
		}

		// Initialisation
		updateCardWidths();
		showTestimonial(currentIndex);
		testimonialInterval = setInterval(nextTestimonial, 5000);

		// Arrêt de l’intervalle au survol
		const testimonialsSection = document.getElementById('testimonials');
		if (testimonialsSection) {
			testimonialsSection.addEventListener('mouseenter', () => {
				clearInterval(testimonialInterval);
			});
			testimonialsSection.addEventListener('mouseleave', () => {
				testimonialInterval = setInterval(nextTestimonial, 5000);
			});
		}

		// Recalcule au resize : on reprend à l’index 0 pour que l’affichage ne sois jamais tronqué
		window.addEventListener('resize', () => {
			const prevCount = visibleCount;
			updateCardWidths();
			if (visibleCount !== prevCount) {
				currentIndex = 0;
			}
			showTestimonial(currentIndex);
		});
	}

	// ---------------------------------------
	// 4) FORMULAIRE – WHATSAPP – CALENDLY
	// ---------------------------------------
	const whatsappBtn = document.getElementById('whatsappBtn');
	if (whatsappBtn) {
		whatsappBtn.addEventListener('click', function (e) {
			e.preventDefault();
			const whatsappLink =
				'https://wa.me/33784298202?text=Bonjour%20R4%20Consulting%20!%20Je%20souhaite%20prendre%20contact.';
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
			console.log('Formulaire R4 Consulting soumis :', formData);
			alert('Merci ! Votre message a bien été envoyé.');
			e.target.reset();
		});
	}

	// -----------------------------------------
	// 5) HOVER ANIMATION SUR .service-card
	// -----------------------------------------
	document.querySelectorAll('.service-card').forEach((card) => {
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

	// ======================================================
	// 6) SMOOTH SCROLL POUR LES ANCRES + MENU “ACTIVE” AU SCROLL
	// ======================================================
	const anchorLinks2 = document.querySelectorAll('a[href^="#"]');
	anchorLinks2.forEach((link) => {
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

	const sections = document.querySelectorAll('section[id]');
	const navLinks = document.querySelectorAll('.main-nav a');
	const sectionObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				const id = entry.target.getAttribute('id');
				const navLink = document.querySelector(
					`.main-nav a[href="#${id}"]`
				);
				if (entry.isIntersecting && navLink) {
					navLinks.forEach((link) => link.classList.remove('active'));
					navLink.classList.add('active');
				}
			});
		},
		{ root: null, rootMargin: '0px 0px -50% 0px', threshold: 0 }
	);
	sections.forEach((section) => sectionObserver.observe(section));

	// ----------------------------------------
	// 7) BOUTON “RETOUR EN HAUT”
	// ----------------------------------------
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

	// ----------------------------------------
	// 8) HERO FADE‐IN AU CHARGEMENT
	// ----------------------------------------
	const heroInner = document.querySelector('.hero-inner');
	if (heroInner) {
		setTimeout(() => {
			heroInner.classList.add('hero-visible');
		}, 100);
	}

	// ----------------------------------------------------
	// 9) APPARITION ÉCHELONNÉE DES CARTES DE SERVICE
	// ----------------------------------------------------
	const serviceCardsList = Array.from(
		document.querySelectorAll('.service-card')
	);
	const cardObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const card = entry.target;
					const index = serviceCardsList.indexOf(card);
					const delay = 0.5 + index * 0.5; // 0.5s, 1s, 1.5s, …
					card.style.transition = `opacity 3s ease-out ${delay}s, transform 3s ease-out ${delay}s`;
					card.classList.add('visible');
					cardObserver.unobserve(card);
				}
			});
		},
		{ root: null, rootMargin: '0px', threshold: 0.2 }
	);
	serviceCardsList.forEach((card) => cardObserver.observe(card));
});

// ------------------------------
// script.js (extrait RGPD cookies)
// ------------------------------
document.addEventListener('DOMContentLoaded', function () {
	const cookieBanner = document.getElementById('cookieBanner');
	const acceptAllBtn = document.getElementById('acceptAllCookies');
	const manageBtn = document.getElementById('manageCookies');
	const cookieModal = document.getElementById('cookieSettingsModal');
	const cancelModalBtn = document.getElementById('cancelCookieSettings');
	const saveSettingsBtn = document.getElementById('saveCookieSettings');
	const form = document.getElementById('cookieSettingsForm');

	const COOKIE_NAME = 'r4_cookie_consent';

	// Récupère la configuration stockée (string JSON) ou null
	function getStoredConsent() {
		try {
			return JSON.parse(localStorage.getItem(COOKIE_NAME));
		} catch {
			return null;
		}
	}

	// Enregistre l’objet de consentement dans localStorage
	function storeConsent(consentObj) {
		localStorage.setItem(COOKIE_NAME, JSON.stringify(consentObj));
	}

	// Vérifie si l’utilisateur a déjà consenti (et retourne l’objet), sinon null
	const savedConsent = getStoredConsent();

	if (!savedConsent) {
		// Aucune préférence enregistrée => on affiche le bandeau
		cookieBanner.style.display = 'flex';
	} else {
		// Si on a déjà un choix, charger les cookies/script autorisés
		applyConsent(savedConsent);
	}

	// Événement “Tout accepter” : on coche toutes les catégories
	acceptAllBtn.addEventListener('click', () => {
		const consent = {
			necessary: true,
			analytics: true,
			functional: true,
			marketing: true,
		};
		storeConsent(consent);
		applyConsent(consent);
		hideBanner();
	});

	// Ouvre la modale pour gérer les catégories
	manageBtn.addEventListener('click', () => {
		cookieModal.classList.remove('hidden');
	});

	// Ferme la modale sans rien changer
	cancelModalBtn.addEventListener('click', () => {
		cookieModal.classList.add('hidden');
	});

	// Enregistre les choix de l’utilisateur depuis la modale
	saveSettingsBtn.addEventListener('click', () => {
		const formData = new FormData(form);
		const consent = {
			necessary: true,
			analytics: formData.has('analytics'),
			functional: formData.has('functional'),
			marketing: formData.has('marketing'),
		};
		storeConsent(consent);
		applyConsent(consent);
		hideModal();
		hideBanner();
	});

	function hideBanner() {
		cookieBanner.style.display = 'none';
	}
	function hideModal() {
		cookieModal.classList.add('hidden');
	}

	// À l’issue du consentement : charger ou déclencher les scripts selon les catégories
	function applyConsent(consent) {
		// 1) Toujours présent : Cookies nécessaires (session PHP, panier, etc.) sont déjà actifs, pas besoin de script.
		// 2) Si analytics = true, charger Google Analytics (ou un autre)
		if (consent.analytics) {
			loadGoogleAnalytics();
		}
		// 3) Si functional = true, vous pouvez charger un script d’amélioration UX
		if (consent.functional) {
			// Exemple : mémorisation langue ou autre
			// loadFunctionalScript();
		}
		// 4) Si marketing = true, charger pixel Facebook, pixel LinkedIn, etc.
		if (consent.marketing) {
			// Exemple : loadFacebookPixel();
			// loadTikTokPixel();
		}
	}

	// Exemple : fonction lazy-load GA si analytics accepté
	function loadGoogleAnalytics() {
		if (window.gaLoaded) return; // évite double-chargement
		// Exemple simplifié pour GA4
		const scriptGA = document.createElement('script');
		scriptGA.src =
			'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
		scriptGA.async = true;
		document.head.appendChild(scriptGA);

		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		window.gtag = gtag;
		gtag('js', new Date());
		gtag('config', 'G-XXXXXXXXXX');
		window.gaLoaded = true;
	}

	// Exemple de chargement pixel Facebook
	function loadFacebookPixel() {
		if (window.fbq) return;
		!(function (f, b, e, v, n, t, s) {
			if (f.fbq) return;
			n = f.fbq = function () {
				n.callMethod
					? n.callMethod.apply(n, arguments)
					: n.queue.push(arguments);
			};
			if (!f._fbq) f._fbq = n;
			n.push = n;
			n.loaded = !0;
			n.version = '2.0';
			n.queue = [];
			t = b.createElement(e);
			t.async = !0;
			t.src = v;
			s = b.getElementsByTagName(e)[0];
			s.parentNode.insertBefore(t, s);
		})(
			window,
			document,
			'script',
			'https://connect.facebook.net/en_US/fbevents.js'
		);
		fbq('init', 'VOTRE_PIXEL_ID');
		fbq('track', 'PageView');
	}
});
