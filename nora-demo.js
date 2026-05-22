(function () {
  var root = document.querySelector(".replikte-nora--thread");
  if (!root) return;

  var thread = root.querySelector(".replikte-nora__thread");
  var stepRows = thread ? thread.querySelectorAll(".replikte-nora__row[data-step]") : [];
  var typingRows = thread ? thread.querySelectorAll(".replikte-nora__row--typing") : [];
  var timers = [];
  var playToken = 0;

  function byStep(n) {
    return thread.querySelector('.replikte-nora__row[data-step="' + n + '"]');
  }

  function typingFor(n) {
    return thread.querySelector('.replikte-nora__row--typing[data-typing-for="' + n + '"]');
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function later(ms, fn) {
    var id = window.setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function scrollRowIntoView(row) {
    if (!thread || !row) return;
    var padding = 12;
    var rowBottom = row.offsetTop + row.offsetHeight;
    var viewBottom = thread.scrollTop + thread.clientHeight;
    if (rowBottom > viewBottom - padding) {
      thread.scrollTo({ top: rowBottom - thread.clientHeight + padding, behavior: "smooth" });
    }
  }

  function showRow(row) {
    if (!row) return;
    row.hidden = false;
    row.classList.add("is-visible");
    requestAnimationFrame(function () {
      scrollRowIntoView(row);
    });
  }

  function hideRow(row) {
    if (!row) return;
    row.classList.remove("is-visible");
    row.hidden = true;
  }

  function showTyping(row) {
    if (!row) return;
    row.hidden = false;
    row.classList.add("is-visible");
    scrollRowIntoView(row);
  }

  function hideTyping(row) {
    if (!row) return;
    row.classList.remove("is-visible");
    row.hidden = true;
  }

  function resetDemo() {
    clearTimers();
    playToken += 1;
    stepRows.forEach(function (row) {
      row.classList.remove("is-visible");
      row.hidden = true;
    });
    typingRows.forEach(function (row) {
      row.classList.remove("is-visible");
      row.hidden = true;
    });
    if (thread) thread.scrollTop = 0;
  }

  function runTimeline(token) {
    function alive() {
      return token === playToken && root.classList.contains("is-playing");
    }

    function schedule(ms, fn) {
      later(ms, function () {
        if (alive()) fn();
      });
    }

    // t=0 — thread opens (header only briefly)
    schedule(600, function () {
      showRow(byStep(1));
    });

    schedule(2200, function () {
      showTyping(typingFor(2));
    });

    schedule(3400, function () {
      hideTyping(typingFor(2));
      showRow(byStep(2));
    });

    schedule(5200, function () {
      showRow(byStep(3));
    });

    schedule(6600, function () {
      showRow(byStep(4));
    });

    schedule(8000, function () {
      showRow(byStep(5));
    });

    schedule(9400, function () {
      showTyping(typingFor(6));
    });

    schedule(10600, function () {
      hideTyping(typingFor(6));
      showRow(byStep(6));
    });

    schedule(11800, function () {
      showTyping(typingFor(7));
    });

    schedule(14800, function () {
      hideTyping(typingFor(7));
      showRow(byStep(7));
    });

    schedule(16800, function () {
      showTyping(typingFor(8));
    });

    schedule(18000, function () {
      hideTyping(typingFor(8));
      showRow(byStep(8));
    });

    schedule(19800, function () {
      showTyping(typingFor(9));
    });

    schedule(21000, function () {
      hideTyping(typingFor(9));
      showRow(byStep(9));
    });
  }

  function startPlayback() {
    resetDemo();
    root.classList.add("is-playing");
    var token = playToken;
    runTimeline(token);
  }

  function stopPlayback() {
    resetDemo();
    root.classList.remove("is-playing");
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    root.classList.add("is-static");
    stepRows.forEach(function (row) {
      row.hidden = false;
      row.classList.add("is-visible");
    });
    typingRows.forEach(function (row) {
      row.hidden = true;
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          startPlayback();
        } else {
          stopPlayback();
        }
      });
    },
    { threshold: 0.35, rootMargin: "0px 0px -8% 0px" }
  );

  observer.observe(root);
})();
