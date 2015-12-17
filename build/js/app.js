// Audio setup
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var audioElement = document.getElementById('player');
var audioSrc = audioCtx.createMediaElementSource(audioElement);
var analyser = audioCtx.createAnalyser();

// Santa elements
var snowstorm = $('#snowfield')
var santa = $('.santa');
var face = $('.face, .cap');
var eyes = $('.eyes');
var handLeft = $('.left-hand');
var handRight = $('.right-hand');
var stacheLeft = $('.mustache-left');
var stacheRight = $('.mustache-right');
var happyHolidays = $('.happy-holidays');
var lights = $('#lights');

// Bind our analyser to the media element source
audioSrc.connect(analyser);
audioSrc.connect(audioCtx.destination);

// Set amount of frequency bands
var frequencyData = new Uint8Array(128);
var lastFrequencyData = [];

// States
var sceneStates = {
  snowIn: false,
  santaIn: false,
  handWave: false,
  headBop: false,
  santaStare: false,
  eyesWide: false,
  santaDance: false,
  textReveal: false,
  lights: false
}

// Timings
var sceneTimings = {
  santaIn: 5.575,
  handWave: 7,
  partyOn: 22.5,
  partyOnText: 22.7,
  headBop: 21.8,
  santaStare: 15,
  eyesWide: 19.5,
  textReveal: 2.7
}

// Continuously loop and update frequency data
function updateScene() {
  requestAnimationFrame(updateScene);

  // Copy frequency data to frequencyData array
  analyser.getByteFrequencyData(frequencyData);

  console.log(audioElement.currentTime);

  // Snowstorm
  if (!sceneStates.snowIn) {
    snowstorm.velocity({ opacity: 1 }, { duration: 5000 });
    sceneStates.snowIn = true;
  }

  // Santa in
  if ((!sceneStates.santaIn) && (audioElement.currentTime > sceneTimings.santaIn)) {
    santa.velocity({ bottom: [ -20, [ 220, 20 ], -400 ] }, { duration: 1800, mobileHA: false });
    sceneStates.santaIn = true;
  }

  // Hand wave
  if ((!sceneStates.handWave) && (audioElement.currentTime > sceneTimings.handWave)) {
    handLeft.velocity({ rotateZ: [ '25deg', 'easeIn', 0 ]}, { duration: 600, loop: 3 });
    sceneStates.handWave = true;
  }

  // Left stache
  if (frequencyData[5] > 220) {
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
  if (frequencyData[8] > 220) {
    stacheRight.css({ transform: 'rotate(15deg)' });
  } else {
    stacheRight.css({ transform: 'rotate(0)' });
  }

  // Rotate hand
  if ((audioElement.currentTime > sceneTimings.partyOn) && (frequencyData[63] > 170)) {
    handLeft.css({ transform: 'rotate(10deg)' });
  } else {
    handLeft.css({ transform: 'rotate(-5deg)' })
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

  // Text reveal
  if ((!sceneStates.textReveal) && (audioElement.currentTime > sceneTimings.textReveal)) {
    happyHolidays.velocity({ opacity: 1, translateY: [ 0, [ 200, 20 ], 30 ], rotateZ: [ 0, -5 ] }, { duration: 1000 });
    sceneStates.textReveal = true;
  }

  // Text bounce
  if (audioElement.currentTime > sceneTimings.partyOnText) {
    // Rescale frequency to range
    var scale = (((frequencyData[63] - 0) * (1.4 - 0.8)) / (255 - 0)) + 0.8;
    happyHolidays.css({
      transform: 'scale(' + scale + ')',
      color: '#fff',
      opacity: Math.random() * (1 - 0.6) + 0.6
    });
  }

  // Lights
  if((!sceneStates.lights) && (audioElement.currentTime > sceneTimings.partyOn)) {
    lights.velocity({ opacity: 0.7 }, { mobileHA: false });
  }

}



function runTheThing() {
  // Play audio
  audioElement.play();

  // Run the loop
  updateScene();
}
