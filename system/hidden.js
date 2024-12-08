function hideErrors(fn) {
  return function () {
    try {
      return fn.apply(this, arguments);
    } catch (e) {
      return;
    }
  };
}

function hideLogs(fn) {
  return function () {
    let originalLog = console.log;
    console.log = function () { };
    let result = fn.apply(this, arguments);
    console.log = originalLog;
    return result;
  };
}

module.exports = {
  hideErrors,
  hideLogs
};