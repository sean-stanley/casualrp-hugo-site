/* global AUDIO_URL */
import $ from 'jquery';

// var SRC = "http://media.blubrry.com/casualrp/podcast.casualrp.com/public/Chapter%202%20Ep.%204%20_%20Leilas-Betrothal.mp3";
$(document).ready(() => {
  const audio = new Audio();
  audio.src = AUDIO_URL;
  audio.play();
});
