(function () {
  var root = document.querySelector(".replikte-nora--thread");
  if (!root) return;

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
          void root.offsetWidth;
          root.classList.add("is-playing");
        } else {
          root.classList.remove("is-playing");
        }
      });
    },
    { threshold: 0.35, rootMargin: "0px 0px -8% 0px" }
  );

  observer.observe(root);
})();
