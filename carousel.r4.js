/* R4 — Carousel (scoped) : désactive les flèches en bout, pas de “trou”, swipe + clavier.
   Cible uniquement les conteneurs: .offers-carousel[data-r4-offers]  */
(function () {
	if (window.R4OffersCarouselLoaded) return;
	window.R4OffersCarouselLoaded = true;

	document.addEventListener('DOMContentLoaded', () => {
		document
			.querySelectorAll('.offers-carousel[data-r4-offers]')
			.forEach(setup);
	});

	function setup(root) {
		if (root.r4Carousel) return;

		const wrapper = root.querySelector('.offers-packs-wrapper');
		const track = root.querySelector('.offers-packs-cards');
		const prevBtn = root.querySelector('.offers-prev');
		const nextBtn = root.querySelector('.offers-next');
		if (!wrapper || !track || !prevBtn || !nextBtn) return;

		// Ne garder que les offres disponibles (si data-available="false" ou classe .is-unavailable → exclues)
		Array.from(track.querySelectorAll('.offer-card')).forEach((c) => {
			const v = (c.dataset.available || '').toLowerCase().trim();
			if (
				v === 'false' ||
				v === '0' ||
				v === 'no' ||
				v === 'non' ||
				c.classList.contains('is-unavailable')
			)
				c.remove();
		});

		const cards = Array.from(track.querySelectorAll('.offer-card'));
		if (!cards.length) {
			prevBtn.disabled = nextBtn.disabled = true;
			return;
		}

		let index = 0,
			touched = false;
		wrapper.style.overflowX = 'hidden';
		track.style.willChange = 'transform';
		root.setAttribute('tabindex', '0');

		const css = () => getComputedStyle(track);
		const contentWidth = () => {
			const first = cards[0],
				last = cards[cards.length - 1];
			return last.offsetLeft + last.offsetWidth - first.offsetLeft;
		};
		const hasPagination = () => contentWidth() - wrapper.clientWidth > 2;

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
			return Math.max(1, Math.floor((wrapper.clientWidth + 1) / step()));
		};

		const maxIndex = () =>
			hasPagination() ? Math.max(0, cards.length - visibleCount()) : 0;

		const apply = () => {
			const paged = hasPagination();
			const maxI = maxIndex();
			const maxScrollPx = Math.max(
				0,
				contentWidth() - wrapper.clientWidth
			);

			if (!paged || maxI === 0) {
				prevBtn.disabled = nextBtn.disabled = true;
				index = 0;
				track.style.transform = '';
			} else {
				index = Math.max(0, Math.min(index, maxI));
				const desired = step() * index;
				const x = Math.min(desired, maxScrollPx); // clamp dur → pas de “trou” vide
				track.style.transform = `translateX(${-x}px)`;
				prevBtn.disabled = index <= 0;
				nextBtn.disabled = index >= maxI;
			}

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

		// Flèches
		prevBtn.addEventListener('click', () => {
			if (!hasPagination()) return;
			touched = true;
			index = Math.max(0, index - visibleCount());
			apply();
		});
		nextBtn.addEventListener('click', () => {
			if (!hasPagination()) return;
			touched = true;
			index = Math.min(maxIndex(), index + visibleCount());
			apply();
		});

		// Clavier
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

		// Swipe (clampé)
		let drag = false,
			sx = 0,
			sy = 0,
			st = 0,
			cur = 0,
			axis = null,
			vx = 0,
			lx = 0,
			lt = 0;
		const xy = (e) =>
			e.touches && e.touches[0]
				? { x: e.touches[0].clientX, y: e.touches[0].clientY }
				: { x: e.clientX, y: e.clientY };
		const currentTranslate = () => -(step() * index);
		const clampT = (t) => Math.max(-(step() * maxIndex()), Math.min(0, t));

		const down = (e) => {
			if (!hasPagination()) return;
			if (e.button !== undefined && e.button !== 0) return;
			drag = true;
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
		const move = (e) => {
			if (!drag) return;
			const p = xy(e);
			const dx = p.x - sx;
			const dy = p.y - sy;
			if (!axis) {
				if (Math.abs(dx) > 8 || Math.abs(dy) > 8)
					axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
				else return;
			}
			if (axis === 'y') return;
			cur = clampT(st + dx);
			track.style.transform = `translateX(${cur}px)`;
			const now = performance.now(),
				dt = now - lt;
			if (dt > 0) vx = (p.x - lx) / dt;
			lx = p.x;
			lt = now;
			e.preventDefault();
		};
		const up = (e) => {
			if (!drag) return;
			drag = false;
			track.style.transition = '';
			const dx = cur - st,
				thr = step() * 0.25,
				inertia = vx * 180,
				total = dx + inertia,
				maxI = maxIndex();
			if (maxI === 0) {
				apply();
				root.releasePointerCapture?.(e.pointerId);
				return;
			}
			if (total < -thr)
				index = Math.min(
					maxI,
					index + Math.ceil(Math.abs(total) / step())
				);
			else if (total > thr)
				index = Math.max(
					0,
					index - Math.ceil(Math.abs(total) / step())
				);
			apply();
			root.releasePointerCapture?.(e.pointerId);
		};

		track.addEventListener('pointerdown', down, { passive: true });
		window.addEventListener('pointermove', move, { passive: false });
		window.addEventListener('pointerup', up, { passive: true });
		window.addEventListener('pointercancel', up, { passive: true });

		// Responsive
		const onResize = () => {
			index = Math.min(index, maxIndex());
			apply();
		};
		if ('ResizeObserver' in window)
			new ResizeObserver(onResize).observe(wrapper);
		else window.addEventListener('resize', onResize);

		// Init (centre “Confort” si présent, sinon start)
		const confort = cards.findIndex((c) =>
			/confort/i.test(
				c.getAttribute('aria-label') ||
					c.querySelector('.offer-title')?.textContent ||
					''
			)
		);
		if (confort >= 0) {
			const vis = visibleCount();
			index =
				vis <= 1
					? Math.min(maxIndex(), confort)
					: Math.min(
							maxIndex(),
							Math.max(0, confort - Math.floor(vis / 2))
					  );
		}
		apply();
		root.r4Carousel = {
			refresh: apply,
			goStart() {
				index = 0;
				apply();
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
