(function () {
  var template = document.getElementById("nora-demo-cabinet");
  if (template) {
    document.querySelectorAll('.js-nora-demo-mount[data-demo-id="cabinet"]').forEach(function (mount) {
      mount.appendChild(template.content.cloneNode(true));
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var COMPOSER_PLACEHOLDER = "Message";

  function initThreadDemo(root) {
    var thread = root.querySelector(".replikte-nora__thread");
    var composer = root.querySelector(".replikte-nora__composer-field");
    var stepRows = thread ? thread.querySelectorAll(".replikte-nora__row[data-step]") : [];
    var typingRows = thread ? thread.querySelectorAll(".replikte-nora__row--typing") : [];
    var timers = [];
    var playToken = 0;

    cacheTypewriterRows(root);

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

    function alive() {
      return root.classList.contains("is-playing");
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

    function resetTypewriterRow(row) {
      if (!row || !row.hasAttribute("data-typewriter")) return;
      var bubble = row.querySelector(".replikte-nora__bubble");
      if (!bubble) return;
      bubble.querySelectorAll("p[data-tw-plain]").forEach(function (p) {
        p.textContent = "";
        p.classList.remove("is-typewriting");
      });
      var time = bubble.querySelector(".replikte-nora__time");
      if (time) time.hidden = true;
    }

    function resetDemo() {
      clearTimers();
      playToken += 1;
      stepRows.forEach(function (row) {
        row.classList.remove("is-visible");
        row.hidden = true;
        resetTypewriterRow(row);
      });
      typingRows.forEach(function (row) {
        row.classList.remove("is-visible");
        row.hidden = true;
      });
      if (composer) {
        composer.textContent = COMPOSER_PLACEHOLDER;
        composer.classList.remove("is-typing");
      }
      if (thread) thread.scrollTop = 0;
    }

    function typeText(plain, charMs, onChar, onDone) {
      var i = 0;
      function tick() {
        if (!alive()) return;
        if (i < plain.length) {
          var slice = plain.slice(0, i + 1);
          onChar(slice);
          i += 1;
          later(charMs, tick);
        } else if (onDone) {
          onDone();
        }
      }
      tick();
    }

    function showOutgoingTypewriter(row, done) {
      if (!row) {
        if (done) done();
        return;
      }

      var bubble = row.querySelector(".replikte-nora__bubble");
      var paragraphs = bubble ? bubble.querySelectorAll("p[data-tw-plain]") : [];
      var time = bubble ? bubble.querySelector(".replikte-nora__time") : null;

      if (!paragraphs.length) {
        showRow(row);
        if (done) later(0, done);
        return;
      }

      row.hidden = false;
      row.classList.add("is-visible");
      if (time) time.hidden = true;
      scrollRowIntoView(row);

      var index = 0;
      var charMs = row.getAttribute("data-step") === "5" ? 20 : 28;

      function finishParagraph(p) {
        p.classList.remove("is-typewriting");
        if (p.dataset.twHtml) {
          p.innerHTML = p.dataset.twHtml;
        }
      }

      function typeNextParagraph() {
        if (!alive()) return;
        if (index >= paragraphs.length) {
          if (time) time.hidden = false;
          if (composer) {
            composer.textContent = COMPOSER_PLACEHOLDER;
            composer.classList.remove("is-typing");
          }
          scrollRowIntoView(row);
          if (done) done();
          return;
        }

        var p = paragraphs[index];
        var plain = p.dataset.twPlain || "";
        p.textContent = "";
        p.classList.add("is-typewriting");
        if (composer) composer.classList.add("is-typing");

        typeText(
          plain,
          charMs,
          function (slice) {
            p.textContent = slice;
            if (composer) composer.textContent = slice;
            scrollRowIntoView(row);
          },
          function () {
            finishParagraph(p);
            index += 1;
            later(index < paragraphs.length ? 280 : 120, typeNextParagraph);
          }
        );
      }

      typeNextParagraph();
    }

    function revealRow(row, done) {
      if (row && row.hasAttribute("data-typewriter")) {
        showOutgoingTypewriter(row, done);
      } else {
        showRow(row);
        if (done) done();
      }
    }

    function runTimeline() {
      var token = playToken;

      function schedule(ms, fn) {
        later(ms, function () {
          if (token !== playToken || !alive()) return;
          fn();
        });
      }

      schedule(500, function () {
        revealRow(byStep(1), function () {
          schedule(350, function () {
            showTyping(typingFor(2));
            schedule(1100, function () {
              hideTyping(typingFor(2));
              showRow(byStep(2));
              schedule(1500, function () {
                showRow(byStep(3));
                schedule(1200, function () {
                  showRow(byStep(4));
                  schedule(900, function () {
                    revealRow(byStep(5), function () {
                      schedule(400, function () {
                        showTyping(typingFor(6));
                        schedule(1100, function () {
                          hideTyping(typingFor(6));
                          showRow(byStep(6));
                          schedule(900, function () {
                            showTyping(typingFor(7));
                            schedule(2800, function () {
                              hideTyping(typingFor(7));
                              showRow(byStep(7));
                              schedule(1600, function () {
                                showTyping(typingFor(8));
                                schedule(900, function () {
                                  hideTyping(typingFor(8));
                                  showRow(byStep(8));
                                  schedule(1400, function () {
                                    showTyping(typingFor(9));
                                    schedule(900, function () {
                                      hideTyping(typingFor(9));
                                      showRow(byStep(9));
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    }

    function startPlayback() {
      resetDemo();
      root.classList.add("is-playing");
      runTimeline();
    }

    function stopPlayback() {
      resetDemo();
      root.classList.remove("is-playing");
    }

    if (reduceMotion) {
      root.classList.add("is-static");
      stepRows.forEach(function (row) {
        restoreTypewriterRow(row);
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
      { threshold: 0.25, rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(root);
  }

  function cacheTypewriterRows(root) {
    root.querySelectorAll(".replikte-nora__row[data-typewriter]").forEach(function (row) {
      row.querySelectorAll(".replikte-nora__bubble p").forEach(function (p) {
        if (!p.dataset.twCached) {
          p.dataset.twPlain = p.textContent;
          p.dataset.twHtml = p.innerHTML;
          p.dataset.twCached = "1";
        }
      });
    });
  }

  function restoreTypewriterRow(row) {
    if (!row || !row.hasAttribute("data-typewriter")) return;
    row.querySelectorAll("p[data-tw-plain]").forEach(function (p) {
      if (p.dataset.twHtml) p.innerHTML = p.dataset.twHtml;
      p.classList.remove("is-typewriting");
    });
    var time = row.querySelector(".replikte-nora__time");
    if (time) time.hidden = false;
  }

  document.querySelectorAll(".replikte-nora--thread").forEach(initThreadDemo);
})();
