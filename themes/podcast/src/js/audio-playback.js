/* global AUDIO_URL, VIZ_BARS_COLOR */
import $ from 'jquery';
import getUrlParameter from './getUrlParameter';
import secondsTohhmmss from './convertSecondsTohhmmss';

const DEFAULT_COLOUR = 'ff002a';

$(document).ready(() => {
  /* FUNCTIONS
    ================================================== */

  // Are we on iOS?
  const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

  // Begin audio
  const audio = new Audio();
  audio.src = AUDIO_URL;
  audio.crossOrigin = 'anonymous';
  audio.autoplay = getUrlParameter('auto_play') === true;

  // Animation
  const vizbarsColor = VIZ_BARS_COLOR || DEFAULT_COLOUR;


  if (!iOS) {
    const context = new AudioContext();
    const src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();

    const canvas = document.getElementById('aa-analyser-bars');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 512;

    var bufferLength = analyser.frequencyBinCount;

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    const barWidthMultiplier = window.innerWidth < 768 ? 4 : 1.5;

    var barWidth = (WIDTH / bufferLength) * barWidthMultiplier;
    var barHeight;
    var x = 0;
  }

  function renderFrame() {
    requestAnimationFrame(renderFrame);
    x = 0;

    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] / 0.5;

      ctx.fillStyle = vizbarsColor;

      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  }

  // audio playing
  audio.addEventListener('playing', () => {
    renderFrame();
    $('.aa-audio-play-btn .material-icons').text('pause');

    $('.aa-audio-play-btn .fa').addClass('fa-pause');
    $('.aa-play-icon-mobile .fa').addClass('fa-pause');
    $('#aa-pod-header-bars').addClass('aa-canvas-bars-toggle');
  });

  // Play/Pause
  $('.aa-audio-play-btn').on('click', () => {
    if (audio.paused === false) {
      audio.pause();
      $('.aa-audio-play-btn .material-icons').text('play_arrow');
    } else {
      audio.play();
      renderFrame();
      $('.aa-audio-play-btn .material-icons').text('pause');
    }
  });

  // audio end
  audio.addEventListener('ended', () => {
    $('.aa-audio-play-btn .material-icons').text('play_arrow');
    const seekbar = document.getElementById('aa-track-seek-slider');
    seekbar.value = 0;
  });

  // Duration
  audio.addEventListener('loadedmetadata', () => {
    $('#aa-track-duration').text(secondsTohhmmss(audio.duration));
  });

  // Countdown
  audio.addEventListener('timeupdate', () => {
    let timeleft = document.getElementById('aa-play-timeleft'),
      duration = parseInt(audio.duration),
      currentTime = parseInt(audio.currentTime),
      timeLeft = duration - currentTime,
      s,
      m,
      h;


    s = timeLeft % 60;
    m = Math.floor(timeLeft / 60) % 60;
    h = Math.floor(timeLeft / 3600);

    s = s < 10 ? `0${s}` : s;
    m = m < 10 ? `0${m}` : m;
    h = h < 10 ? `0${h}` : h;

    timeleft.innerHTML = `${h}:${m}:${s}`;
  }, false);

  // Volume
  const volume = document.getElementById('aa-vol-adjust');
  volume.addEventListener('mousemove', setVolume);

  function setVolume() {
    audio.volume = volume.value / 100;
  }

  // Seek bar
  const seekbar = document.getElementById('aa-track-seek-slider');


  function seekAudio() {
    audio.currentTime = seekbar.value;
  }

  function updateUI() {
    seekbar.value = Math.round(audio.currentTime);
    seekbar.max = Math.round(audio.duration);
  }

  seekbar.onchange = seekAudio;
  audio.ontimeupdate = updateUI;
  audio.addEventListener('timeupdate', updateUI);


  /* MOBILE
      ================================================== */
  // Play/Pause
  if (iOS) {
    const button = document.getElementById('aa-toggle-play-ios');
    const startPlay = () => {
      if (audio.paused === false) {
        audio.pause();
        $('.aa-toggle-play-ios .material-icons').text('pause');
      } else {
        audio.play();
        $('.aa-toggle-play-ios .material-icons').text('play_arrow');
        $('#aa-pod-header-bars').removeClass('aa-canvas-bars-toggle');
      }
    };
    button.addEventListener('click', startPlay, false);
  } else {
    $('.aa-play-icon-mobile').on('click', () => {
      if (audio.paused === false) {
        audio.pause();
        console.log($('.aa-play-icon-mobile .material-icons').text());
        $('.aa-play-icon-mobile .material-icons').text('pause');
        $('#aa-pod-header-bars').removeClass('aa-canvas-bars-toggle');
      } else {
        audio.play();
        renderFrame();
        console.log($('.aa-play-icon-mobile .material-icons').text());
        $('.aa-play-icon-mobile .material-icons').text('play_arrow');
        $('#aa-pod-header-bars').addClass('aa-canvas-bars-toggle');
      }
    });
  }
});// Doc ready
