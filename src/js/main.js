import { CONFIG } from './config.js';
import { initTheme, addThemeList } from './modules/theme.js';
import { initEffects, initEffectsToggle } from './modules/effects.js';
import { initPosts } from './modules/blog.js';
import { initPictureColl } from './modules/navigation.js';
import { initRouting } from './modules/routing.js';
import { initTooltips } from './modules/utils.js';

const music = document.getElementById('bg-music');
music.volume = 0.5;

let musicStarted = false;

// target the tab explicitly
const musicTab = document.getElementById('blog-tab');

musicTab.addEventListener('click', async () => {
	try {
		// first interaction → start playback
		if (!musicStarted) {
			await music.play();
			musicStarted = true;
			return;
		}

		// afterwards, toggle play/pause
		if (music.paused) {
			await music.play();
		} else {
			music.pause();
		}
	} catch (err) {
		console.error('Music playback failed:', err);
	}
});

const art = document.getElementById('art');
const trackName = document.getElementById('trackName');
const artistName = document.getElementById('artistName');
const albumName = document.getElementById('albumName');
const eq = document.getElementById('eq');

art.src = track.image[large][t];
trackName.innerText = track.name;
artistName.innerText = track.artist[t];
albumName.innerText = track.album[t];

loading.classList.add('hidden');

// now playing indicator
if (track['@attr'] && track['@attr'].nowplaying) {
    playTitle.innerText = 'Now Playing';
    eq.style.display = 'flex';
} else {
    playTitle.innerText = 'Last Played';
    eq.style.display = 'none';
}


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


