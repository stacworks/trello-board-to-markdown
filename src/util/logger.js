const colors = require('colors/safe');

function log(color, message) {
  console.log(colors[color](message));
}

export default {

  info(message) {
    log('white', message);
  },

  warn(message) {
    log('yellow', message);
  },

  error(message) {
    log('red', message);
  },

  success(message) {
    log('green', message);
  }

};
