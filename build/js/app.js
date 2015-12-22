// Checks
var ua = navigator.userAgent.toLowerCase();
var hasAudioApi = Modernizr.webaudio;
var isAndroid = /android/i.test(ua);
var isIos = /iphone|ipad|ipod/i.test(ua);
var isSafari = (ua.indexOf('safari') > -1) && (ua.indexOf('chrome') == -1);
var isBad = (isAndroid || isIos || isSafari);
var audioElement = document.getElementById('player');
var videoElement = document.getElementById('lights');
var frequencyBank = {};
var audioFrame = 1;

// Santa elements
var snowstorm = $('#snowfield');
var santa = $('.santa');
var face = $('.face, .cap');
var eyes = $('.eyes');
var handLeft = $('.left-hand');
var handRight = $('.right-hand');
var stacheLeft = $('.mustache-left');
var stacheRight = $('.mustache-right');
var happyHolidays = $('.happy-holidays');
var from = $('.from');
var lights = $('#lights');
var iosLights = $('.ios-lights');
var playBtn = $('.droid-play');
var notInThisBrowser = $('.not-in-this-browser');
var reducedExperience = $('.reduced-experience');
var salsita = $('.salsita');
var credits = $('.credits');
var creditsLink = $('.credits-link');
var loading = $('.loading');

// Rand range
function rand(min, max, whole) {
  return void 0===whole||!1===whole?Math.random()*(max-min+1)+min:!isNaN(parseFloat(whole))&&0<=parseFloat(whole)&&20>=parseFloat(whole)?(Math.random()*(max-min+1)+min).toFixed(whole):Math.floor(Math.random()*(max-min+1))+min;
};

function setupAnimation() {

  if (!isBad) {
    // Audio setup
    window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    window.audioSrc = audioCtx.createMediaElementSource(audioElement);
    window.analyser = audioCtx.createAnalyser();

    // Bind our analyser to the media element source
    audioSrc.connect(analyser);
    audioSrc.connect(audioCtx.destination);

    // Set amount of frequency bands
    window.frequencyData = new Uint8Array(128);
  }

  // States
  window.sceneStates = {
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

  // Timings
  window.sceneTimings = {
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
}

// Loop and update frequency data
function updateScene() {
  requestAnimationFrame(updateScene);

  var newFrequencyData = [];

  if (!isBad) {
    // Copy frequency data to frequencyData array
    analyser.getByteFrequencyData(frequencyData);
    newFrequencyData = frequencyData;
  } else {
    // Get it from preset bank
    newFrequencyData = frequencyBank[audioFrame];
  }

  // Save to bank
  //frequencyBank[audioFrame] = JSON.parse("[" + Array.apply([], frequencyData).join(",") + "]");
  //audioFrame = audioFrame + 1;

  // Snowstorm
  if (!sceneStates.snowIn) {
    snowstorm.velocity({ opacity: 1 }, { duration: 5000 });
    sceneStates.snowIn = true;
  }

  // Santa in
  if ((!sceneStates.santaIn) && (audioElement.currentTime > sceneTimings.santaIn)) {
    santa.velocity({ marginBottom: [ -20, [ 220, 20 ], -400 ] }, { duration: 1800, mobileHA: false });
    sceneStates.santaIn = true;
  }

  // Hand wave
  if ((!sceneStates.handWave) && (audioElement.currentTime > sceneTimings.handWave)) {
    handLeft.velocity({ rotateZ: [ '25deg', 'easeIn', 0 ]}, { duration: 600, loop: 3 });
    sceneStates.handWave = true;
  }

  // Left stache
  if (newFrequencyData[5] > 220) {
    stacheLeft.css({ transform: 'rotate(-15deg)' });

    // Left hand later
    if (audioElement.currentTime > sceneTimings.partyOn) {
      handRight.css({ transform: 'translateY(5px)' });
    }
  } else {
    stacheLeft.css({ transform: 'rotate(0)' });

    if (audioElement.currentTime > sceneTimings.partyOn) {
      handRight.css({ transform: 'translateY(0)' });
    }
  }

  // Right stache
  if (newFrequencyData[8] > 220) {
    stacheRight.css({ transform: 'rotate(15deg)' });
  } else {
    stacheRight.css({ transform: 'rotate(0)' });
  }

  // Rotate hand
  if ((audioElement.currentTime > sceneTimings.partyOn) && (newFrequencyData[63] > 170)) {
    handLeft.css({ transform: 'rotate(10deg)' });
  } else {
    handLeft.css({ transform: 'rotate(-5deg)' });
  }

  // Eyes wide
  if ((!sceneStates.eyesWide) && (audioElement.currentTime > sceneTimings.eyesWide)) {
    eyes.addClass('wide');
    sceneStates.eyesWide = true;
  }

  // Head bop
  if ((!sceneStates.headBop) && (audioElement.currentTime > sceneTimings.headBop)) {
    face.addClass('bop');
    sceneStates.headBop = true;
  }

  // Santa looks at
  if ((!sceneStates.santaStare) && (audioElement.currentTime > sceneTimings.santaStare)) {
    eyes.addClass('stare');
    sceneStates.santaStare = true;
  }

  // Santa dance
  if ((!sceneStates.santaDance) && (audioElement.currentTime > sceneTimings.partyOn)) {
    santa.addClass('dance');
    sceneStates.santaDance = true;
  }

  // Happy Holidays reveal
  if ((!sceneStates.textReveal) && (audioElement.currentTime > sceneTimings.textReveal)) {
    happyHolidays.velocity({ opacity: 1, translateY: [ 0, [ 200, 20 ], 20 ], rotateZ: [ 0, [ 200, 20 ], 5 ], scale: [ 1, [ 200, 20 ], 0.8 ] }, { duration: 1400 });
    sceneStates.textReveal = true;
  }

  // From reveal
  if ((!sceneStates.fromReveal) && (audioElement.currentTime > sceneTimings.fromReveal)) {
    from.velocity({ opacity: 1, scale: [ 1, [ 300, 20 ], 0.1 ] }, { duration: 1000 });
    sceneStates.fromReveal = true;
  }

  // Salsita reveal
  if ((!sceneStates.slsReveal) && (audioElement.currentTime > sceneTimings.santaIn)) {
    salsita.velocity({ opacity: 1, scale: [ 1, [ 300, 20 ], 0.1 ] }, { duration: 1000 });
    sceneStates.slsReveal = true;
  }

  // Text bounce
  if (audioElement.currentTime > sceneTimings.partyOnText) {
    // Rescale frequency to range
    var scale = (((newFrequencyData[63] - 0) * (1.4 - 0.8)) / (255 - 0)) + 0.8;
    happyHolidays.css({
      transform: 'scale(' + scale + ')',
      color: '#fff',
      opacity: Math.random() * (1 - 0.6) + 0.6,
      transformOrigin: '50%'
    });
  }

  // From bounce
  if (audioElement.currentTime > sceneTimings.partyOnText) {
    // Rescale frequency to range
    var scale = (((newFrequencyData[82] - 0) * (1.6 - 0.8)) / (255 - 0)) + 0.8;
    from.css({
      transform: 'scale(' + scale + ') rotate(' + rand(-3, 3) + 'deg)',
      transformOrigin: '50%'
    });
  }

  // Salsita bounce
  if (audioElement.currentTime > sceneTimings.partyOnText) {
    // Rescale frequency to range
    var scale = (((newFrequencyData[112] - 0) * (1.6 - 0.8)) / (255 - 0)) + 0.8;
    salsita.css({
      transform: 'scale(' + scale + ')',
      transformOrigin: '50%'
    });
  }

  // Lights
  if((!sceneStates.lights) && (audioElement.currentTime > sceneTimings.partyOn)) {
    if (!isIos) {
      lights.velocity({ opacity: 0.7 }, { mobileHA: false });
    } else {
      iosLights.velocity({ opacity: 0.7 }, { mobileHA: false });
    }
  }

  if (isBad) {
    if (frequencyBank[audioFrame + 1]) {
      audioFrame = audioFrame + 1;
    } else {
      console.log('resetting audioFrame');
      audioFrame = 1;
    }
  }
}


function runTheShow() {

  // Fade loader
  loading.removeClass('visible');

  playBtn.velocity({ opacity: 1 }, { duration: 1000, mobileHA: false });
  playBtn.on('click', function() {
    // FadeOut Play
    playBtn.velocity({ opacity: 0 }, { duration: 1000, mobileHA: false });
    playBtn.velocity({ opacity: 0 }, { duration: 1000, mobileHA: false });

    audioElement.play();

    // Safari video problems
    if (!isIos) {
      videoElement.play();
    } else {
      $(videoElement).remove();
    }

    // Credits link
    creditsLink.on('click', function(){
      credits.addClass('visible');
    })
    credits.on('click', function(){
      credits.removeClass('visible');
    })

    // Run the loop
    updateScene();
    $(this).off('click');

    console.log('running the show');

  });
}

// Startup
console.log('userAgent: ' + navigator.userAgent);

if (!hasAudioApi) {
  console.log('no audio api');
  notInThisBrowser.velocity({ left: [ '50%', '50%'], top: [ '50%', '50%'], translateX: [ '-50%', '-50%'], translateY: [ '-50%', '-50%'],  opacity: 1 }, { mobileHA: false });
} else {

  // Preload graphic
  loading.addClass('visible');

  // Load media (Hi iOS, you suck)
  audioElement.load();

  // Prepare anim
  setupAnimation();

  // Bind audio load
  $(audioElement).on('loadeddata', function(){
    // Safari fake bank workaround
    if (isBad) {
      $.getJSON( "js/frequencyBank.json", function( data ) {
        frequencyBank = data;
        console.log('loaded frequencyBank');
        console.log('audio ready');
        runTheShow();
      });
    } else {
      console.log('audio ready');
      runTheShow();
    }
  })
};
