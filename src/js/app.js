import {} from 'velocity-animate';
import {} from 'imports?$=jquery!./lib/snowstorm';
import Random from 'random-js';

import '../sass/main.sass';

const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());

const sceneSources = {
  audio: 'assets/audio/wham.mp3',
  video: 'assets/video/193832158.mp4',
  gif: 'assets/img/video.gif'
};

const visualElements = {
  snowstorm: $('#snowfield'),
  santa: $('.santa'),
  face: $('.face, .cap'),
  eyes: $('.eyes'),
  handLeft: $('.left-hand'),
  handRight: $('.right-hand'),
  stacheLeft: $('.mustache-left'),
  stacheRight: $('.mustache-right'),
  happyHolidays: $('.happy-holidays'),
  fromText: $('.from'),
  lights: $('#lights'),
  iosLights: $('.ios-lights'),
  playBtn: $('.droid-play'),
  notInThisBrowser: $('.not-in-this-browser'),
  reducedExperience: $('.reduced-experience'),
  salsita: $('.salsita'),
  credits: $('.credits'),
  creditsLink: $('.credits-link'),
  loading: $('.loading'),
  progressBar: $('.progress span')
};

const sceneTimings = {
  textReveal: 2.7,
  fromReveal: 5,
  santaIn: 5.575,
  handWave: 7,
  stacheStart: 9,
  santaStare: 15,
  eyesWide: 19.5,
  headBop: 21.8,
  partyOn: 22.5,
  partyOnText: 22.7
};

const rand = new Random();

const setupAnimation = (audioBuffer) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const audioSource = audioCtx.createBufferSource();
  audioSource.buffer = audioBuffer;
  audioSource.loop = true;

  // Audio setup
  const analyser = audioCtx.createAnalyser();

  // Bind our analyser to the audio source
  audioSource.connect(analyser);
  audioSource.connect(audioCtx.destination);

  // States
  const scenes = {
    snowIn: false,
    santaIn: false,
    slsReveal: false,
    handWave: false,
    headBop: false,
    santaStare: false,
    eyesWide: false,
    santaDance: false,
    textReveal: false,
    fromReveal: false,
    lights: false
  };

  return {
    audioSource, analyser, scenes,

    startAudio() {
      audioSource.start();
      this.startTime = audioCtx.currentTime;
    },

    get currentTime() {
      return audioCtx.currentTime - this.startTime;
    }
  };
};

// Loop and update frequency data
const updateScene = (animationState) => {
  requestAnimationFrame(() => updateScene(animationState));

  const frequencyData = new Uint8Array(128);
  animationState.analyser.getByteFrequencyData(frequencyData);

  // Snowstorm
  if (!animationState.scenes.snowIn) {
    visualElements.snowstorm.velocity({ opacity: 1 }, { duration: 5000 });
    animationState.scenes.snowIn = true;
  }

  // Santa in
  if ((!animationState.scenes.santaIn) && (animationState.currentTime > sceneTimings.santaIn)) {
    visualElements.santa.velocity({ marginBottom: [ -20, [ 220, 20 ], -400 ] }, { duration: 1800, mobileHA: false });
    animationState.scenes.santaIn = true;
  }

  // Hand wave
  if ((!animationState.scenes.handWave) && (animationState.currentTime > sceneTimings.handWave)) {
    visualElements.handLeft.velocity({ rotateZ: [ '25deg', 'easeIn', 0 ]}, { duration: 600, loop: 3 });
    animationState.scenes.handWave = true;
  }

  // Left stache
  if (frequencyData[5] > 220) {
    visualElements.stacheLeft.css({ transform: 'rotate(-15deg)' });

    // Left hand later
    if (animationState.currentTime > sceneTimings.partyOn) {
      visualElements.handRight.css({ transform: 'translateY(5px)' });
    }
  } else {
    visualElements.stacheLeft.css({ transform: 'rotate(0)' });

    if (animationState.currentTime > sceneTimings.partyOn) {
      visualElements.handRight.css({ transform: 'translateY(0)' });
    }
  }

  // Right stache
  if (frequencyData[8] > 220) {
    visualElements.stacheRight.css({ transform: 'rotate(15deg)' });
  } else {
    visualElements.stacheRight.css({ transform: 'rotate(0)' });
  }

  // Rotate hand
  if ((animationState.currentTime > sceneTimings.partyOn) && (frequencyData[63] > 170)) {
    visualElements.handLeft.css({ transform: 'rotate(10deg)' });
  } else {
    visualElements.handLeft.css({ transform: 'rotate(-5deg)' });
  }

  // Eyes wide
  if ((!animationState.scenes.eyesWide) && (animationState.currentTime > sceneTimings.eyesWide)) {
    visualElements.eyes.addClass('wide');
    animationState.scenes.eyesWide = true;
  }

  // Head bop
  if ((!animationState.scenes.headBop) && (animationState.currentTime > sceneTimings.headBop)) {
    visualElements.face.addClass('bop');
    animationState.scenes.headBop = true;
  }

  // Santa looks at
  if ((!animationState.scenes.santaStare) && (animationState.currentTime > sceneTimings.santaStare)) {
    visualElements.eyes.addClass('stare');
    animationState.scenes.santaStare = true;
  }

  // Santa dance
  if ((!animationState.scenes.santaDance) && (animationState.currentTime > sceneTimings.partyOn)) {
    visualElements.santa.addClass('dance');
    animationState.scenes.santaDance = true;
  }

  // Happy Holidays reveal
  if ((!animationState.scenes.textReveal) && (animationState.currentTime > sceneTimings.textReveal)) {
    visualElements.happyHolidays.velocity({ opacity: 1, translateY: [ 0, [ 200, 20 ], 20 ], rotateZ: [ 0, [ 200, 20 ], 5 ], scale: [ 1, [ 200, 20 ], 0.8 ] }, { duration: 1400 });
    animationState.scenes.textReveal = true;
  }

  // From reveal
  if ((!animationState.scenes.fromReveal) && (animationState.currentTime > sceneTimings.fromReveal)) {
    visualElements.fromText.velocity({ opacity: 1, scale: [ 1, [ 300, 20 ], 0.1 ] }, { duration: 1000 });
    animationState.scenes.fromReveal = true;
  }

  // Salsita reveal
  if ((!animationState.scenes.slsReveal) && (animationState.currentTime > sceneTimings.santaIn)) {
    visualElements.salsita.velocity({ opacity: 1, scale: [ 1, [ 300, 20 ], 0.1 ] }, { duration: 1000 });
    animationState.scenes.slsReveal = true;
  }

  // Text bounce
  if (animationState.currentTime > sceneTimings.partyOnText) {
    // Rescale frequency to range
    const scale = (((frequencyData[63] - 0) * (1.4 - 0.8)) / (255 - 0)) + 0.8;
    visualElements.happyHolidays.css({
      transform: 'scale(' + scale + ')',
      color: '#fff',
      opacity: Math.random() * (1 - 0.6) + 0.6,
      transformOrigin: '50%'
    });
  }

  // From bounce
  if (animationState.currentTime > sceneTimings.partyOnText) {
    // Rescale frequency to range
    const scale = (((frequencyData[82] - 0) * (1.6 - 0.8)) / (255 - 0)) + 0.8;
    visualElements.fromText.css({
      transform: 'scale(' + scale + ') rotate(' + rand.real(-3, 3) + 'deg)',
      transformOrigin: '50%'
    });
  }

  // Salsita bounce
  if (animationState.currentTime > sceneTimings.partyOnText) {
    // Rescale frequency to range
    const scale = (((frequencyData[112] - 0) * (1.6 - 0.8)) / (255 - 0)) + 0.8;
    visualElements.salsita.css({
      transform: 'scale(' + scale + ')',
      transformOrigin: '50%'
    });
  }

  // Lights
  if ((!animationState.scenes.lights) && (animationState.currentTime > sceneTimings.partyOn)) {
    if (!isIos) {
      visualElements.lights.velocity({ opacity: 0.7 }, { mobileHA: false });
    } else {
      visualElements.iosLights.velocity({ opacity: 0.7 }, { mobileHA: false });
    }
  }
};

const runTheShow = (animationState) => {
  // Fade loader
  visualElements.loading.removeClass('visible');

  visualElements.playBtn.velocity({ opacity: 1 }, { duration: 1000, mobileHA: false });
  visualElements.playBtn.on('click', () => {
    console.log('Happy holidays from the whole Salsita team!');

    // FadeOut Play
    visualElements.playBtn.velocity({ opacity: 0 }, { duration: 1000, mobileHA: false });
    visualElements.playBtn.velocity({ opacity: 0 }, { duration: 1000, mobileHA: false });

    animationState.startAudio();

    const videoElement = $('#video-lights').get(0);

    // Safari video problems
    if (!isIos) {
      videoElement.play();
    } else {
      $(videoElement).remove();
    }

    // Run the loop
    updateScene(animationState);
    $(this).off('click');
  });
};

// All assets have been preloaded
const handleComplete = (queue) => {
  if (isIos) {
    // Set the animated GIF as the background image as a fallback since we can't use video on iOS
    const urlCreator = window.URL || window.webkitURL;
    const backgroundSrc = urlCreator.createObjectURL(queue.getResult(sceneSources.gif, true));
    visualElements.iosLights.css('background-image', 'url(' + backgroundSrc + ')');
  } else {
    const videoElement = queue.getResult(sceneSources.video);
    videoElement.setAttribute('id', 'video-lights');
    videoElement.setAttribute('width', '100%');
    videoElement.setAttribute('height', '100%');
    videoElement.setAttribute('loop', 'loop');
    visualElements.lights.append(videoElement);
  }

  // Prepare anim
  const animationState = setupAnimation(queue.getResult(sceneSources.audio));

  // Credits link
  visualElements.creditsLink.on('click', () => visualElements.credits.addClass('visible'));
  visualElements.credits.on('click', () => visualElements.credits.removeClass('visible'));

  runTheShow(animationState);
};

const loadAssets = () => {
  const queue = new createjs.LoadQueue(true);
  queue.on('progress', (e) => {
    visualElements.progressBar.css({
      width: e.loaded * 100 + '%'
    });
  });
  queue.on('complete', () => handleComplete(queue));
  if (isIos) {
    queue.loadFile(sceneSources.gif);
  } else {
    queue.loadFile(sceneSources.video);
  }
  queue.loadFile(sceneSources.gif);
  queue.installPlugin(createjs.Sound);
  queue.loadFile(sceneSources.audio);
  queue.load();
};

// Startup
if (!Modernizr.webaudio) {
  visualElements.notInThisBrowser.velocity({ left: [ '50%', '50%'], top: [ '50%', '50%'], translateX: [ '-50%', '-50%'], translateY: [ '-50%', '-50%'], opacity: 1 }, { mobileHA: false });
} else {
  // Preload graphic
  visualElements.loading.addClass('visible');

  // Preload large assets
  loadAssets();
}
