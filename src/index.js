import "./scss/main.scss";
import Tone from "tone";

const synth = new Tone.Synth().toMaster()

const app = {
  settings: {
    states: ['default', 'timer', 'countdown'], // Possible states: 'default' --> 'timer' --> 'countdown' --> 'default'
    currentState: 0,

    startingTime: 30,
    time: 30,

    timer: 0,
    countdownTimer: 0,
  },

  init: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    const buttonHTML = document.getElementsByTagName('button')[0];

    buttonHTML.addEventListener('click', function () {
      if (this.settings.states[this.settings.currentState] !== 'countdown') {
          console.log('DONT DO SHIT');
          this.updateState();
      }
    }.bind(this));
  },

  updateState: function(muteState) {
    let states = this.settings.states;
    let currentState = this.settings.currentState;

    // Update state.
    (states[currentState] === 'countdown') ? currentState = 0 : currentState++;

    // Update state in settings.
    this.settings.currentState = currentState;

    // Debug...
    console.log(states[currentState]);

    this.handleClick();
  },

  handleClick: function() {
    let states = this.settings.states;
    let currentState = this.settings.currentState;

    const timerHTML = document.getElementById('timer');
    const bodyHTML = document.getElementsByTagName('body')[0];
    const subheadHTML = document.getElementById('subhead');
    const buttonHTML = document.getElementsByTagName('button')[0];

    switch (states[currentState]) {
      case 'default':
        bodyHTML.className = 'primaryBackground';
        subheadHTML.className = 'secondaryColor';
        timerHTML.className = 'hidden'; // Hide timer on default screen.
        buttonHTML.innerHTML = 'START TIMER';

        // Update time.
        this.settings.time = this.settings.startingTime;
        timerHTML.innerHTML = this.settings.time;

        break;

      case 'timer':
        bodyHTML.className = 'secondaryBackground';
        subheadHTML.className = 'primaryColor';
        timerHTML.className = '';
        buttonHTML.innerHTML = 'VOTE';

        this.settings.timer = setInterval(() => {
          this.settings.time--;
          timerHTML.innerHTML = this.settings.time;

          if (this.settings.time === 3) {
            this.updateState();
          };
        }, 1000);

        break;

      case 'countdown':
        clearInterval(this.settings.timer);

        this.settings.time = 3;
        timerHTML.innerHTML = this.settings.time;
        synth.triggerAttackRelease('C4', '8n');

        this.settings.countdownTimer = setInterval(() => {
          this.settings.time--;
          timerHTML.innerHTML = this.settings.time;

          if (this.settings.time === 0) {
            synth.triggerAttackRelease('C5', '4n');
            clearInterval(this.settings.countdownTimer);
            this.updateState();
          } else {
            synth.triggerAttackRelease('C4', '8n');
          }
        }, 1000);

        break;
    }

  }
};

app.init();
