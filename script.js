AOS.init({
  duration: 900,
  easing: "ease-out",
  once: true,
  offset: 90
});

const playBtn = document.getElementById("playBtn");
const music = document.getElementById("bgMusic");
const volumeControl = document.getElementById("volumeControl");

// ---- volume settings ----
const MAX_VOL = 0.03;          // hard cap so it never gets too loud
const DEFAULT_SLIDER = 1;   // slider position on load (0..1)
let isPlaying = false;

// Map slider -> perceived loudness (smoother low end)
function setVolumeFromSlider() {
  const v = Number(volumeControl.value); // 0..1
  // curve + cap
  music.volume = Math.min(MAX_VOL, v * v * MAX_VOL / (DEFAULT_SLIDER * DEFAULT_SLIDER));
}

// init slider + volume
volumeControl.value = DEFAULT_SLIDER;
setVolumeFromSlider();

// ---- play/pause button ----
function updateButton() {
  playBtn.textContent = isPlaying ? "❚❚ pause" : "▶︎ play";
  playBtn.setAttribute("aria-label", isPlaying ? "Pause background music" : "Play background music");
}

playBtn.addEventListener("click", async () => {
  try {
    if (!isPlaying) {
      await music.play();
      isPlaying = true;
    } else {
      music.pause();
      isPlaying = false;
    }
    updateButton();
  } catch (err) {
    // autoplay/user gesture issues often land here
    console.warn("Playback blocked until user interacts:", err);
  }
});

// ---- slider changes ----
volumeControl.addEventListener("input", () => {
  setVolumeFromSlider();
});

