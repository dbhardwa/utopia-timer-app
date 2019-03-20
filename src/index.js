import "./scss/main.scss";
import Tone from "tone";

const app = {
  settings: {
    states: ['default', 'timer', 'countdown', 'reset'], // Cyclic nature.
    currentState: 3, // Want to initialize to state 0.

    startingTime: 30,
    countdownTime: 3,

    mainTimer: 0,
    countdownTimer: 0,
  },

  init: function() {
    this.bindEvents();
    this.updateState();
  },

  bindEvents: function() {
    const buttonHTML = document.getElementsByTagName('button')[0];

    buttonHTML.addEventListener('click', function() {
      // De-activates button click during countdown.
      if (this.settings.states[this.settings.currentState] !== 'countdown') {
          this.updateState();
      }
    }.bind(this));
  },

  updateState: function() {
    let states = this.settings.states;
    let currentState = this.settings.currentState;

    // Update state (cycle back if necessary).
    (states[currentState] === 'reset') ? currentState = 0 : currentState++;

    // Update state in settings.
    this.settings.currentState = currentState;

    this.render();
  },

  handleState: function() {
    const synth = new Tone.Synth().toMaster();
    const timerHTML = document.getElementById('timer');
    let time;

    switch (this.settings.states[this.settings.currentState]) {
      case 'timer':
        time = this.settings.startingTime;
        this.settings.mainTimer = setInterval(() => {
          time--;
          timerHTML.innerHTML = time;

          if (time === this.settings.countdownTime) this.updateState();
        }, 1000);
        break;

      case 'countdown':
        clearInterval(this.settings.mainTimer);

        time = this.settings.countdownTime;
        timerHTML.innerHTML = time;
        synth.triggerAttackRelease('C4', '8n');

        this.settings.countdownTimer = setInterval(() => {
          time--;
          timerHTML.innerHTML = time;

          if (time === 0) {
            synth.triggerAttackRelease('C5', '4n');
            clearInterval(this.settings.countdownTimer);
            this.updateState();
          } else
            synth.triggerAttackRelease('C4', '8n');
        }, 1000);
        break;
    }
  },

  render() {
    const bodyHTML = document.getElementsByTagName('body')[0];
    const timerHTML = document.getElementById('timer');
    const subheadHTML = document.getElementById('subhead');
    const buttonHTML = document.getElementsByTagName('button')[0];

    switch (this.settings.states[this.settings.currentState]) {
      case 'default':
        bodyHTML.className = 'primaryBackground';
        timerHTML.className = 'hidden'; // Hide timer on default screen.
        subheadHTML.className = 'secondaryColor';
        buttonHTML.innerHTML = 'START TIMER';
        break;

      case 'timer':
        bodyHTML.className = 'secondaryBackground';
        timerHTML.className = 'timerStateTimer';
        timerHTML.innerHTML = this.settings.startingTime;
        subheadHTML.className = 'primaryColor';
        buttonHTML.innerHTML = 'VOTE';
        this.handleState();
        break;

      case 'countdown':
        timerHTML.className = 'primaryColor';
        buttonHTML.className = 'buttonInset'
        this.handleState();
        break;

      case 'reset':
        bodyHTML.className = 'primaryBackground';
        timerHTML.innerHTML = 'VOTE';
        timerHTML.className = 'timerStateReset';
        buttonHTML.innerHTML = 'RESET';
        buttonHTML.className = '';
        break;
    }
  }
};

app.init();
