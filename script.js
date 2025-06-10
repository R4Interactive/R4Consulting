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
		{
			root: null,
			rootMargin: '0px',
			threshold: 0.15,
		}
	);

	// On marque d’abord toutes les cibles en "hidden" et on les observe
	revealElements.forEach((el) => {
		el.classList.add('reveal-hidden');
		revealObserver.observe(el);
	});

	// -- À la fin, on force une passe manuelle pour celles qui sont déjà visibles au chargement --
	revealElements.forEach((el) => {
		const rect = el.getBoundingClientRect();
		if (rect.top < window.innerHeight && rect.bottom > 0) {
			// si l’élément est (même partiellement) dans la fenêtre d’affichage,
			// on lui applique immédiatement la classe “visible”
			el.classList.add('reveal-visible');
			revealObserver.unobserve(el);
		}
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

			const data = {
				name: form.name.value,
				email: form.email.value,
				phone: form.phone.value,
				subject: form.subject.value,
				message: form.message.value,
			};

			try {
				const resp = await fetch('/api/contact', {
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
if (heroInner) {
	setTimeout(() => {
		heroInner.classList.add('hero-visible');
	}, 100);
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

document.addEventListener('DOMContentLoaded', () => {
	const btn = document.getElementById('hamburgerBtn');
	btn.addEventListener('click', () => {
		document.body.classList.toggle('nav-open');
	});
	// Fermer le menu si on clique sur un lien
	document.querySelectorAll('.main-nav a').forEach((link) => {
		link.addEventListener('click', () => {
			document.body.classList.remove('nav-open');
		});
	});
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
