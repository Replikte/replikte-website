(function () {
  var BOOKING_URL =
    'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2C8T1V9tbQgsS-_SvRnevJIwAGW8nQY9QD0HrSkN1Dgo-JVHcKWUmrercQGXvLW7AlqnXiRY6A?gv=true';
  var DEFAULT_COLOR = '#3F51B5';
  var DEFAULT_LABEL = 'Book a Call';

  function initSlots() {
    if (!window.calendar || !calendar.schedulingButton) {
      return false;
    }
    document.querySelectorAll('.gcal-booking').forEach(function (el) {
      if (el.dataset.gcalLoaded === '1') return;
      calendar.schedulingButton.load({
        url: BOOKING_URL,
        color: el.dataset.color || DEFAULT_COLOR,
        label: el.dataset.label || DEFAULT_LABEL,
        target: el,
      });
      el.dataset.gcalLoaded = '1';
    });
    return true;
  }

  function fallbackLinks() {
    document.querySelectorAll('.gcal-booking').forEach(function (el) {
      if (el.querySelector('a[href]')) return;
      var a = document.createElement('a');
      a.href = BOOKING_URL;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = el.dataset.label || DEFAULT_LABEL;
      el.appendChild(a);
    });
  }

  function onReady() {
    if (!initSlots()) {
      fallbackLinks();
    }
  }

  window.addEventListener('load', onReady);
  window.REPLIKTE_BOOKING_URL = BOOKING_URL;
})();
