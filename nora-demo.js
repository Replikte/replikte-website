(function () {
  var root = document.querySelector(".replikte-nora--thread");
  if (!root) return;

  var thread = root.querySelector(".replikte-nora__thread");
  var rows = thread ? thread.querySelectorAll(".replikte-nora__row") : [];
  var rowDelays = [60, 180, 320, 460, 600, 760, 920];
  var scrollTimers = [];

  function clearScrollTimers() {
    scrollTimers.forEach(clearTimeout);
    scrollTimers = [];
  }

  function scrollRowIntoView(row) {
    if (!thread || !row) return;
    var padding = 12;
    var rowBottom = row.offsetTop + row.offsetHeight;
    var viewBottom = thread.scrollTop + thread.clientHeight;
    if (rowBottom > viewBottom - padding) {
      thread.scrollTop = rowBottom - thread.clientHeight + padding;
    }
  }

  function scheduleThreadScroll() {
    clearScrollTimers();
    rowDelays.forEach(function (delayMs, index) {
      var t = window.setTimeout(function () {
        if (!root.classList.contains("is-playing")) return;
        scrollRowIntoView(rows[index]);
      }, delayMs + 380);
      scrollTimers.push(t);
    });
  }

  function resetThreadScroll() {
    clearScrollTimers();
    if (thread) thread.scrollTop = 0;
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    root.classList.add("is-static");
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          root.classList.remove("is-playing");
          resetThreadScroll();
          void root.offsetWidth;
          root.classList.add("is-playing");
          scheduleThreadScroll();
        } else {
          root.classList.remove("is-playing");
          resetThreadScroll();
        }
      });
    },
    { threshold: 0.35, rootMargin: "0px 0px -8% 0px" }
  );

  observer.observe(root);
})();
