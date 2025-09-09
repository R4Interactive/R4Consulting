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

function r4Idle(fn) {
	if ('requestIdleCallback' in window)
		requestIdleCallback(fn, { timeout: 1500 });
	else setTimeout(fn, 0);
}


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
	// 2) SCROLL-REVEAL (reveal + direction + délais)
	// ----------------------------------------
	(function initReveal() {
		var els = document.querySelectorAll('.reveal');
		if (!els.length) return;

		// Fallback vieux navigateurs
		if (!('IntersectionObserver' in window)) {
			els.forEach(function (el) {
				el.classList.add('reveal-visible');
			});
			return;
		}

		// Applique le delay éventuel depuis data-reveal-delay (en ms)
		els.forEach(function (el) {
			var delay = parseInt(
				el.getAttribute('data-reveal-delay') || '0',
				10
			);
			if (delay > 0) el.style.transitionDelay = delay / 1000 + 's';
			// Durée personnalisable (optionnelle)
			var dur = el.getAttribute('data-reveal-dur');
			if (dur) el.style.setProperty('--r-dur', dur);
		});

		var io = new IntersectionObserver(
			function (entries, obs) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						entry.target.classList.add('reveal-visible');
						obs.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
		);

		els.forEach(function (el) {
			io.observe(el);
		});

		// Passe immédiate si déjà dans le viewport au chargement
		requestAnimationFrame(function () {
			els.forEach(function (el) {
				var r = el.getBoundingClientRect();
				if (r.top < window.innerHeight && r.bottom > 0) {
					el.classList.add('reveal-visible');
				}
			});
		});
	})();

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
			const offset = cards[index].offsetLeft;
			slider.style.transform = `translateX(-${offset}px)`;
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

	const form = document.getElementById('contactForm');
	if (form) {
		form.addEventListener('submit', async function (e) {
			e.preventDefault();

			// IDs des champs obligatoires
			const requiredIds = [
				'name',
				'email',
				'phone',
				'subject',
				'message',
			];
			// On cherche ceux qui sont vides
			const missing = requiredIds.filter((id) => {
				const el = form.querySelector(`#${id}`);
				return !el || el.value.trim() === '';
			});

			if (missing.length > 0) {
				// S’il en manque au moins un, on alerte et on met le focus sur le 1er
				const first = missing[0];
				const labels = {
					name: 'Nom',
					email: 'E-mail',
					phone: 'Téléphone',
					subject: 'Objet',
					message: 'Message',
				};

				alert(
					`Veuillez remplir le champ « ${labels[first] || first} ».`
				);
				form.querySelector(`#${first}`)?.focus();
				return;
			}

			//  contrôle du format du téléphone
			const phoneValue = form.querySelector('#phone').value.trim();
			const phonePattern = /^(\d{10}|\+ ?33\s?[0-9](?:\s?\d{2}){4})$/;
			if (!phonePattern.test(phoneValue)) {
				alert(
					'Le numéro de téléphone doit comporter 10 chiffres ou être au format "+ 33 1 23 45 67 89".'
				);
				form.querySelector('#phone').focus();
				return;
			}

			form.addEventListener('submit', async (e) => {
				e.preventDefault();

				// 1) Valide… si ok :
				const data = {
					name: form.name.value,
					email: form.email.value,
					phone: form.phone.value,
					subject: form.subject.value,
					message: form.message.value,
				};

				try {
					const resp = await fetch(
						'http://localhost:3000/api/contact',
						{
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(data),
						}
					);
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
		});
	}

	// Si vous voulez vraiment envoyer au serveur, décommentez :
	// form.submit();
});

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
if (heroInner && !heroInner.querySelector('.reveal')) {
	// Ancien fallback (seulement si aucun .reveal n'est présent dans le hero)
	setTimeout(() => heroInner.classList.add('hero-visible'), 100);
}

// ----------------------------------------------------
// 9) APPARITION ÉCHELONNÉE DES CARTES DE SERVICE
// ----------------------------------------------------
const serviceCardsList = Array.from(document.querySelectorAll('.service-card'));
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

// ------------------------------
// script-cookies.js

document.addEventListener('DOMContentLoaded', function () {
	const cookieBanner = document.getElementById('cookieBanner');
	const acceptAllBtn = document.getElementById('acceptAllCookies');
	const manageBtn = document.getElementById('manageCookies');
	const cookieModal = document.getElementById('cookieSettingsModal');
	const cancelModalBtn = document.getElementById('cancelCookieSettings');
	const saveSettingsBtn = document.getElementById('saveCookieSettings');
	const form = document.getElementById('cookieSettingsForm');

	const COOKIE_NAME = 'r4_cookie_consent';

	// Récupère l’objet de consentement (ou null s’il n’existe pas)
	function getStoredConsent() {
		try {
			return JSON.parse(localStorage.getItem(COOKIE_NAME));
		} catch {
			return null;
		}
	}

	// Enregistre l’objet de consentement en localStorage
	function storeConsent(consentObj) {
		localStorage.setItem(COOKIE_NAME, JSON.stringify(consentObj));
	}

	// Masque la bannière de cookie
	function hideBanner() {
		cookieBanner.style.display = 'none';
	}

	// Masque la fenêtre modale de réglages
	function hideModal() {
		cookieModal.classList.add('hidden');
	}

	// Charge ou active les scripts en fonction des catégories acceptées
	function applyConsent(consent) {
		// Les “necessary” sont toujours actifs, pas besoin d’appel de script
		if (consent.analytics) {
			loadGoogleAnalytics();
		}
		if (consent.functional) {
			// Exemple : loadFunctionalScript();
		}
		if (consent.marketing) {
			loadFacebookPixel();
			// loadTikTokPixel();
		}
	}

	// Exemple de lazy‐load de Google Analytics si analysés acceptés
	function loadGoogleAnalytics() {
		if (window.gaLoaded) return; // Ne charge qu’une fois
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

	// Exemple de chargement du pixel Facebook si marketing accepté
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

	// Vérifie si un consentement est déjà stocké
	const savedConsent = getStoredConsent();

	if (!savedConsent) {
		// Pas de consentement => on affiche la bannière
		cookieBanner.style.display = 'flex';
	} else {
		// Consentement déjà présent => on applique et on cache directement la bannière
		applyConsent(savedConsent);
		hideBanner();
	}

	// Lorsque l’utilisateur clique sur “Tout accepter”
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

	// Ouvre la modale de gestion fine
	manageBtn.addEventListener('click', () => {
		cookieModal.classList.remove('hidden');
	});

	// Ferme la modale sans enregistrer
	cancelModalBtn.addEventListener('click', () => {
		hideModal();
	});

	// Enregistre les choix depuis la modale
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
});

(function () {
	const track = document.querySelector('.approach-carousel-track');
	const prevBtn = document.querySelector('.prev-arrow');
	const nextBtn = document.querySelector('.next-arrow');
	if (!track || !prevBtn || !nextBtn) return;

	function getGapAndCardWidth() {
		const card = document.querySelector('.approach-card');
		if (!card) return { totalCardPlusGap: card.offsetWidth };
		const styleCard = window.getComputedStyle(card);
		// on récupère margin-right (gap en CSS Flex) pour être sûr
		const marginRight = parseInt(styleCard.marginRight, 10) || 0;
		return { totalCardPlusGap: card.offsetWidth + marginRight };
	}

	function scrollByOneCard(direction) {
		const { totalCardPlusGap } = getGapAndCardWidth();
		if (direction === 'next') {
			track.scrollBy({ left: totalCardPlusGap, behavior: 'smooth' });
		} else {
			track.scrollBy({ left: -totalCardPlusGap, behavior: 'smooth' });
		}
	}

	prevBtn.addEventListener('click', () => scrollByOneCard('prev'));
	nextBtn.addEventListener('click', () => scrollByOneCard('next'));
})();

// -----------------------------------------------
//  CARROUSEL “OFFRES & PACKS” – logique JavaScript
// -----------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
	// On récupère chaque carousel “Offres & Packs” (on a 3 sections : générale, SEO, SEA)
	const carousels = document.querySelectorAll(
		'.offres-packs-section .offers-carousel'
	);

	carousels.forEach((carousel) => {
		const wrapper = carousel.querySelector('.offers-packs-wrapper');
		const cardsContainer = carousel.querySelector('.offers-packs-cards');
		const cards = carousel.querySelectorAll('.offer-card');
		const prevBtn = carousel.querySelector('.offers-prev');
		const nextBtn = carousel.querySelector('.offers-next');
		let currentIndex = 0;

		function getVisibleCount() {
			const wrapperWidth = wrapper.offsetWidth;
			const style = getComputedStyle(cardsContainer);
			const gap = parseInt(style.gap) || 0;
			const cardWidth = cards[0].offsetWidth;
			return Math.floor((wrapperWidth + gap) / (cardWidth + gap));
		}

		function updateCarousel() {
			const visibleCount = getVisibleCount();
			const maxIndex = Math.max(0, cards.length - visibleCount);
			if (currentIndex < 0) currentIndex = 0;
			if (currentIndex > maxIndex) currentIndex = maxIndex;

			const style = getComputedStyle(cardsContainer);
			const gap = parseInt(style.gap) || 0;
			const shiftX = currentIndex * (cards[0].offsetWidth + gap);
			cardsContainer.style.transform = `translateX(-${shiftX}px)`;
		}

		prevBtn.addEventListener('click', function () {
			currentIndex--;
			updateCarousel();
		});
		nextBtn.addEventListener('click', function () {
			currentIndex++;
			updateCarousel();
		});
		window.addEventListener('resize', updateCarousel);

		// Initialisation
		updateCarousel();
	});
});

// fonction d'ecoute pour selection pack
document.addEventListener('DOMContentLoaded', function () {
	// On récupère tous les boutons “Je choisis ce pack”
	const offerButtons = document.querySelectorAll('.offer-cta');
	const contactSection = document.getElementById('contact');
	const subjectField = document.getElementById('contactSubject');
	const messageField = document.getElementById('message');

	offerButtons.forEach((btn) => {
		btn.addEventListener('click', function (e) {
			e.preventDefault();

			// 1) Récupérer le nom du pack depuis data-pack
			const chosenPack = this.getAttribute('data-pack') || '';

			// 2) Pré-remplir le champ caché “subject”
			if (subjectField) {
				subjectField.value = `Pack choisi : ${chosenPack}`;
			}

			// 3) Pré-remplir la textarea “message”
			if (messageField) {
				// Si vous voulez écraser complètement le message :
				messageField.value = `Bonjour,\n\nJe suis intéressé(e) par : ${chosenPack}.\n\nMerci de me recontacter.`;
				// Si vous préférez ajouter (au lieu d’écraser), on pourrait faire :
				// messageField.value = `Pack choisi : ${chosenPack}\n\n` + messageField.value;
			}

			// 4) Scroller vers la section #contact (lisse)
			if (contactSection) {
				contactSection.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
			}
		});
	});
});
// prise en charge d'une navigation directe (url)
(function prefillFromURL() {
	const params = new URLSearchParams(window.location.search);
	const packFromURL = params.get('pack');
	if (packFromURL) {
		// même logique que pour les boutons
		if (subjectField) subjectField.value = `Pack choisi : ${packFromURL}`;
		if (messageField) {
			messageField.value = `Bonjour,\n\nJe suis intéressé(e) par : ${packFromURL}.\n\nMerci de me recontacter.`;
		}
		// Scroll automatique si on a le hash #contact
		if (window.location.hash === '#contact' && contactSection) {
			contactSection.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}
	}
})();
document.addEventListener('DOMContentLoaded', function () {
	const track = document.querySelector('.jobs-carousel-track');
	const btnPrev = document.querySelector('.prev-arrow');
	const btnNext = document.querySelector('.next-arrow');

	// On déplace le scroll de la piste d’un “viewport” complet (largeur visible)
	btnPrev.addEventListener('click', () => {
		track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
	});
	btnNext.addEventListener('click', () => {
		track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
	});
});

//SCRIPT pour préremplir “Poste souhaité”
document.addEventListener('DOMContentLoaded', function () {
	// On récupère tous les boutons “Postuler”
	const applyButtons = document.querySelectorAll('.apply-btn');

	applyButtons.forEach((btn) => {
		btn.addEventListener('click', function (e) {
			// Empêche le saut instantané, on gérera le scroll manuellement
			e.preventDefault();

			// On trouve la carte parente .job-card
			const card = btn.closest('.job-card');
			const jobTitle = card.querySelector('.job-title').innerText.trim();

			// On remplit le champ “position” avec le titre de l’offre
			const positionField = document.getElementById('position');
			positionField.value = jobTitle;

			// On scroll vers la section contact
			const contactSection = document.getElementById('contact');
			contactSection.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});

			// On attend un peu puis on met le focus sur le champ “position”
			setTimeout(() => positionField.focus(), 500);
		});
	});
});
// CTA des fiches service immo
document.addEventListener('DOMContentLoaded', function () {
	// 1) On récupère toutes les balises CTA dans les fiches immobilier
	const ctaButtons = document.querySelectorAll('.cta-immobilier');

	// 2) Pour chacune, on installe un listener sur le clic
	ctaButtons.forEach(function (btn) {
		btn.addEventListener('click', function (e) {
			// Empêcher le saut immédiat si besoin (on gère le scroll manuellement)
			e.preventDefault();

			// Récupérer la valeur de "data-subject"
			const sujet = btn.getAttribute('data-subject') || '';

			// Mettre à jour le champ #subject du formulaire
			const subjectInput = document.querySelector('#subject');
			if (subjectInput) {
				subjectInput.value = sujet;
			}

			// Faire défiler jusqu'à la section de contact en douceur
			const contactSection = document.querySelector('#contact');
			if (contactSection) {
				contactSection.scrollIntoView({ behavior: 'smooth' });
			}

			// Mettre à jour l’URL (facultatif) pour ajouter le hash #contact
			// window.location.hash = '#contact';
		});
	});
});

/* === Burger accessible (ARIA) === */
document.addEventListener('DOMContentLoaded', () => {
	const btn = document.getElementById('hamburgerBtn');
	const nav =
		document.getElementById('site-nav') ||
		document.querySelector('.main-nav');
	if (!btn || !nav) return;

	// Lier le bouton au nav si besoin
	if (!btn.hasAttribute('aria-controls')) {
		if (!nav.id) nav.id = 'site-nav';
		btn.setAttribute('aria-controls', nav.id);
	}
	btn.setAttribute('aria-expanded', 'false');

	const openMenu = () => {
		document.body.classList.add('nav-open');
		btn.setAttribute('aria-expanded', 'true');
		nav.querySelector('a')?.focus();
	};
	const closeMenu = () => {
		document.body.classList.remove('nav-open');
		btn.setAttribute('aria-expanded', 'false');
		btn.focus();
	};

	btn.addEventListener('click', () => {
		const open = document.body.classList.contains('nav-open');
		open ? closeMenu() : openMenu();
	});

	// Fermer au clavier (Échap)
	document.addEventListener('keydown', (e) => {
		if (
			e.key === 'Escape' &&
			document.body.classList.contains('nav-open')
		) {
			closeMenu();
		}
	});

	// Fermer quand on clique un lien
	nav.querySelectorAll('a').forEach((a) =>
		a.addEventListener('click', closeMenu)
	);
});

document.querySelectorAll('.mini-accordion').forEach((detail) => {
	const summary = detail.querySelector('summary');
	const list = detail.querySelector('ul');

	summary.addEventListener('click', (e) => {
		e.preventDefault();
		const isOpen = detail.hasAttribute('open');

		if (!isOpen) {
			// ouvrir
			detail.setAttribute('open', '');
			list.style.maxHeight = list.scrollHeight + 'px';
		} else {
			// fermer
			list.style.maxHeight = list.scrollHeight + 'px';
			requestAnimationFrame(() => (list.style.maxHeight = '0'));
			list.addEventListener('transitionend', function _hide() {
				detail.removeAttribute('open');
				list.removeEventListener('transitionend', _hide);
			});
		}
	});
});
// === Offres & Packs — Carousel controls ===
document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.offers-carousel').forEach(setupOffersCarousel);
});

function setupOffersCarousel(root) {
	const wrapper = root.querySelector('.offers-packs-wrapper');
	const track = root.querySelector('.offers-packs-cards');
	const cards = track
		? Array.from(track.querySelectorAll('.offer-card'))
		: [];
	const prevBtn = root.querySelector('.offers-prev');
	const nextBtn = root.querySelector('.offers-next');

	if (!wrapper || !track || cards.length <= 1 || !prevBtn || !nextBtn) return;

	let index = 0;
	root.setAttribute('tabindex', '0'); // clavier: ←/→

	const step = () => {
		// largeur d’un "pas" = distance entre 2 cartes (gap inclus)
		if (cards.length > 1) return cards[1].offsetLeft - cards[0].offsetLeft;
		return wrapper.clientWidth;
	};

	const visibleCount = () => {
		const s = step();
		return s > 0
			? Math.max(1, Math.floor((wrapper.clientWidth + 1) / s))
			: 1;
	};

	const maxIndex = () => Math.max(0, cards.length - visibleCount());

	const apply = () => {
		const x = step() * index;
		track.style.transform = `translateX(${-x}px)`;

		// état des flèches
		prevBtn.disabled = index <= 0;
		nextBtn.disabled = index >= maxIndex();

		// accessibilité (on masque ce qui sort du viewport)
		const vis = visibleCount();
		cards.forEach((card, i) => {
			const isVisible = i >= index && i < index + vis;
			card.setAttribute('aria-hidden', String(!isVisible));
			if (isVisible && i === index)
				card.setAttribute('aria-current', 'true');
			else card.removeAttribute('aria-current');
		});
	};

	// Actions boutons
	prevBtn.addEventListener('click', () => {
		index = Math.max(0, index - visibleCount());
		apply();
	});

	nextBtn.addEventListener('click', () => {
		index = Math.min(maxIndex(), index + visibleCount());
		apply();
	});

	// Clavier (← / →)
	root.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prevBtn.click();
		}
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			nextBtn.click();
		}
	});

	// Responsive
	const ro = new ResizeObserver(() => {
		index = Math.min(index, maxIndex());
		apply();
	});
	ro.observe(wrapper);

	apply();
}
/* ===== R4 — Offers & Packs Carousel (scoped v7: geom detection + both-way loop) ===== */
(() => {
	if (window.R4OffersCarouselModuleLoaded) return;
	window.R4OffersCarouselModuleLoaded = true;

	// API publique (init/reset ciblés)
	window.initOffersCarousel = function (target) {
		const nodes =
			typeof target === 'string'
				? document.querySelectorAll(target)
				: target instanceof Element
				? [target]
				: target;
		nodes && nodes.forEach((el) => setupCarousel(el));
	};
	window.resetOffersCarousel = function (
		target = '.offers-carousel[data-r4-offers]'
	) {
		const nodes =
			typeof target === 'string'
				? document.querySelectorAll(target)
				: target instanceof Element
				? [target]
				: target;
		nodes && nodes.forEach((el) => el.r4Carousel?.goStart());
	};

	document.addEventListener('DOMContentLoaded', () => {
		document
			.querySelectorAll('.offers-carousel[data-r4-offers]')
			.forEach(setupCarousel);
	});

	function setupCarousel(root) {
		if (!root || root.r4Carousel) return;

		const wrapper = root.querySelector('.offers-packs-wrapper');
		const track = root.querySelector('.offers-packs-cards');
		const prevBtn = root.querySelector('.offers-prev');
		const nextBtn = root.querySelector('.offers-next');
		if (!wrapper || !track || !prevBtn || !nextBtn) return;

		// 1) Filtrer indisponibles
		const all = Array.from(track.querySelectorAll('.offer-card'));
		const unavailable = (el) => {
			const v = (el.dataset.available || '').toLowerCase().trim();
			return (
				v === 'false' ||
				v === '0' ||
				v === 'no' ||
				v === 'non' ||
				el.classList.contains('is-unavailable')
			);
		};
		all.forEach((c) => {
			if (unavailable(c)) c.remove();
		});

		const cards = Array.from(track.querySelectorAll('.offer-card'));
		if (!cards.length) {
			prevBtn.disabled = nextBtn.disabled = true;
			return;
		}

		wrapper.style.overflowX = 'hidden';
		track.style.willChange = 'transform';

		let index = 0;
		let touched = false;

		// --- Géométrie robuste ---
		const css = () => getComputedStyle(track);
		const contentWidth = () => {
			const first = cards[0];
			const last = cards[cards.length - 1];
			const left0 = first.offsetLeft;
			return last.offsetLeft + last.offsetWidth - left0;
		};
		const hasPagination = () => contentWidth() - wrapper.clientWidth > 2;

		// pas moyen fiable entre 2 cartes (moyenne)
		const step = () => {
			let diffs = [];
			for (let i = 1; i < Math.min(cards.length, 6); i++) {
				const d = cards[i].offsetLeft - cards[i - 1].offsetLeft;
				if (d > 0) diffs.push(d);
			}
			if (!diffs.length) {
				const w = cards[0].getBoundingClientRect().width;
				const gap = parseFloat(css().gap || css().columnGap || 0) || 0;
				return Math.max(1, Math.round(w + gap));
			}
			return Math.max(
				1,
				Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length)
			);
		};

		const visibleCount = () => {
			if (!hasPagination()) return cards.length;
			const s = step();
			return Math.max(1, Math.floor((wrapper.clientWidth + 1) / s));
		};

		const maxIndex = () =>
			hasPagination() ? Math.max(0, cards.length - visibleCount()) : 0;

		const updateUI = () => {
			const paged = hasPagination();
			const maxI = maxIndex();

			// calcule le défilement max en pixels (largeur contenu - viewport)
			const maxScrollPx = Math.max(
				0,
				contentWidth() - wrapper.clientWidth
			);

			if (!paged || maxI === 0) {
				// pas de pagination -> aucun décalage, flèches off, index 0
				prevBtn.disabled = true;
				nextBtn.disabled = true;
				track.style.transform = '';
				index = 0;
			} else {
				// clamp l’index ET la translation pour éviter tout “trou” en bout
				index = Math.max(0, Math.min(index, maxI));
				const stepPx = step();
				const desired = stepPx * index;
				const x = Math.min(desired, maxScrollPx); // <= clé : ne jamais aller plus loin que le contenu
				track.style.transform = `translateX(${-x}px)`;

				// boucles actives -> on laisse les flèches actives
				prevBtn.disabled = false;
				nextBtn.disabled = false;
			}

			// A11y
			const vis = visibleCount();
			cards.forEach((card, i) => {
				const isVisible = !hasPagination()
					? true
					: i >= index && i < index + vis;
				card.setAttribute('aria-hidden', String(!isVisible));
				if (isVisible && i === index)
					card.setAttribute('aria-current', 'true');
				else card.removeAttribute('aria-current');
			});
		};

		const centerOn = (targetIdx) => {
			if (!hasPagination()) {
				updateUI();
				return;
			}
			const vis = visibleCount();
			index =
				vis <= 1
					? Math.min(maxIndex(), Math.max(0, targetIdx))
					: Math.min(
							maxIndex(),
							Math.max(0, targetIdx - Math.floor(vis / 2))
					  );
			updateUI();
		};

		// Auto-centre “Confort” si présent
		const confortIdx = cards.findIndex(
			(c) =>
				(c.getAttribute('aria-label') || '')
					.toLowerCase()
					.includes('confort') ||
				/confort/i.test(
					c.querySelector('.offer-title')?.textContent || ''
				)
		);
		const defaultIdx =
			confortIdx >= 0 ? confortIdx : Math.floor(cards.length / 2);
		requestAnimationFrame(() => centerOn(defaultIdx));

		// --- Flèches (loop aux 2 bouts) ---
		prevBtn.addEventListener('click', () => {
			if (!hasPagination()) return;
			touched = true;
			const maxI = maxIndex();
			if (maxI === 0) return;
			index = index <= 0 ? maxI : Math.max(0, index - visibleCount());
			updateUI();
		});

		nextBtn.addEventListener('click', () => {
			if (!hasPagination()) return;
			touched = true;
			const maxI = maxIndex();
			if (maxI === 0) return;
			index = index >= maxI ? 0 : Math.min(maxI, index + visibleCount());
			updateUI();
		});

		// --- Clavier
		root.setAttribute('tabindex', '0');
		root.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				prevBtn.click();
			}
			if (e.key === 'ArrowRight') {
				e.preventDefault();
				nextBtn.click();
			}
		});

		// --- Swipe (hard clamp + loop)
		let isDrag = false,
			sx = 0,
			sy = 0,
			st = 0,
			cur = 0,
			axis = null,
			vx = 0,
			lx = 0,
			lt = 0;

		const clampTranslate = (t) => {
			const minT = -(step() * maxIndex());
			const maxT = 0;
			return Math.max(minT, Math.min(maxT, t));
		};
		const xy = (e) =>
			e.touches && e.touches[0]
				? { x: e.touches[0].clientX, y: e.touches[0].clientY }
				: { x: e.clientX, y: e.clientY };
		const currentTranslate = () => -(step() * index);

		const onDown = (e) => {
			if (!hasPagination()) return;
			if (e.button !== undefined && e.button !== 0) return;
			isDrag = true;
			touched = true;
			axis = null;
			const p = xy(e);
			sx = p.x;
			sy = p.y;
			st = currentTranslate();
			cur = st;
			lx = p.x;
			lt = performance.now();
			vx = 0;
			track.style.transition = 'none';
			root.setPointerCapture?.(e.pointerId);
		};
		const onMove = (e) => {
			if (!isDrag) return;
			const p = xy(e);
			const dx = p.x - sx;
			const dy = p.y - sy;
			if (!axis) {
				if (Math.abs(dx) > 8 || Math.abs(dy) > 8)
					axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
				else return;
			}
			if (axis === 'y') return;

			cur = clampTranslate(st + dx);
			track.style.transform = `translateX(${cur}px)`;

			const now = performance.now();
			const dt = now - lt;
			if (dt > 0) vx = (p.x - lx) / dt;
			lx = p.x;
			lt = now;
			e.preventDefault();
		};
		const onUp = (e) => {
			if (!isDrag) return;
			isDrag = false;
			track.style.transition = '';
			const dx = cur - st;
			const thr = step() * 0.25;
			const inertia = vx * 180;
			const total = dx + inertia;
			const maxI = maxIndex();
			if (maxI === 0) {
				updateUI();
				root.releasePointerCapture?.(e.pointerId);
				return;
			}

			if (total < -thr) {
				// →
				index =
					index >= maxI
						? 0
						: Math.min(
								maxI,
								index + Math.ceil(Math.abs(total) / step())
						  );
			} else if (total > thr) {
				// ←
				index =
					index <= 0
						? maxI
						: Math.max(
								0,
								index - Math.ceil(Math.abs(total) / step())
						  );
			}
			updateUI();
			root.releasePointerCapture?.(e.pointerId);
		};

		track.addEventListener('pointerdown', onDown, { passive: true });
		window.addEventListener('pointermove', onMove, { passive: false });
		window.addEventListener('pointerup', onUp, { passive: true });
		window.addEventListener('pointercancel', onUp, { passive: true });
		window.addEventListener(
			'pointerleave',
			(e) => {
				if (isDrag) onUp(e);
			},
			{ passive: true }
		);

		// --- Responsive : recalcule avec la géométrie
		const onResize = () => {
			index = Math.min(index, maxIndex());
			if (!touched) centerOn(defaultIdx);
			else updateUI();
		};
		if ('ResizeObserver' in window)
			new ResizeObserver(onResize).observe(wrapper);
		else window.addEventListener('resize', onResize);

		// API
		root.r4Carousel = {
			goTo(i) {
				index = Math.max(0, Math.min(i | 0, maxIndex()));
				updateUI();
			},
			goStart() {
				index = 0;
				updateUI();
			},
			goEnd() {
				index = maxIndex();
				updateUI();
			},
			next() {
				const m = maxIndex();
				if (m === 0) return;
				index = index >= m ? 0 : Math.min(m, index + visibleCount());
				updateUI();
			},
			prev() {
				const m = maxIndex();
				if (m === 0) return;
				index = index <= 0 ? m : Math.max(0, index - visibleCount());
				updateUI();
			},
			refresh() {
				updateUI();
			},
			get current() {
				return index;
			},
			get max() {
				return maxIndex();
			},
		};
	}
})();
// Init du carrousel LocPilot uniquement quand la section "offres" entre en vue
(() => {
	const target = document.querySelector('#offres-lp');
	if (!target || !window.initOffersCarousel) return;

	if ('IntersectionObserver' in window) {
		const io = new IntersectionObserver(
			(entries, obs) => {
				if (entries[0].isIntersecting) {
					window.initOffersCarousel(
						'.offers-carousel[data-r4-offers]'
					);
					obs.disconnect();
				}
			},
			{ rootMargin: '200px' }
		);
		io.observe(target);
	} else {
		window.addEventListener(
			'load',
			() => window.initOffersCarousel('.offers-carousel[data-r4-offers]'),
			{ once: true }
		);
	}
})();
/* === Skip-link : focus sur <main> après saut === */
document.addEventListener('DOMContentLoaded', () => {
	const main = document.getElementById('main-content');
	if (main && !main.hasAttribute('tabindex')) {
		main.setAttribute('tabindex', '-1');
	}
});
/* === Carrousels Offres : refléter disabled -> aria-disabled === */
document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.offers-carousel').forEach((root) => {
		const prev = root.querySelector('.offers-prev');
		const next = root.querySelector('.offers-next');

		const sync = (btn) =>
			btn &&
			btn.setAttribute('aria-disabled', btn.disabled ? 'true' : 'false');

		const mo = new MutationObserver(() => {
			sync(prev);
			sync(next);
		});
		[prev, next].forEach(
			(b) =>
				b &&
				mo.observe(b, {
					attributes: true,
					attributeFilter: ['disabled'],
				})
		);

		sync(prev);
		sync(next);
	});
});
