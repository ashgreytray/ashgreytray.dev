import { CONFIG } from './config.js';
import { initTheme, addThemeList } from './modules/theme.js';
import { initEffects, initEffectsToggle } from './modules/effects.js';
import { initPosts } from './modules/blog.js';
import { initPictureColl } from './modules/navigation.js';
import { initRouting } from './modules/routing.js';
import { initTooltips } from './modules/utils.js';

const musicBtn = document.getElementById('mute-toggle');
const music = document.getElementById('bg-music');

let started = false;

music.volume = 0.5;

musicBtn.addEventListener('click', async () => {
	try {
		if (!started) {
			await music.play(); // user gesture → allowed
			started = true;
			musicBtn.textContent = '[PAUSE]';
			return;
		}

		if (music.paused) {
			await music.play();
			musicBtn.textContent = '[PAUSE]';
		} else {
			music.pause();
			musicBtn.textContent = '[PLAY]';
		}
	} catch (err) {
		console.error('Audio playback blocked:', err);
	}
});


document.addEventListener('DOMContentLoaded', () => {
	addThemeList();
	initTheme();
	initEffects();
	initEffectsToggle();
	initPosts();
	initPictureColl();
	initRouting();
	initTooltips();

	// Close details-tags on default for mobile devices to reduce large amount of text on home-tab
	if (window.matchMedia('(max-width: 767px)').matches) {
		document.querySelectorAll('details').forEach((details) => {
			details.removeAttribute('open');
		});
	}

	// Special config cases
	if (CONFIG.crtEffect) {
		document.getElementById('canvas').classList.add('crt-effect');
	}
	if (!CONFIG.noiseEffect) {
		document.getElementById('noise-overlay').style.display = 'none';
	}
	if (!CONFIG.grungeOverlay) {
		document.getElementById('grunge-overlay').style.display = 'none';
	}
});
