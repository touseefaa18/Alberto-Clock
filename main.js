// Scroll-triggered animations — tou-anim classes
// Targets: All sections

// ── Active Nav Highlight ──────────────────────────────────────────────────────
(function () {
  "use strict";

  var tou_navLinks = document.querySelectorAll(".tou-nav-link, .tou-mobile-link");
  var tou_sections = [];

  /* Collect every section that a nav link points to */
  tou_navLinks.forEach(function (link) {
    var id = link.getAttribute("href").replace("#", "");
    var section = document.getElementById(id);
    if (section && tou_sections.indexOf(section) === -1) {
      tou_sections.push(section);
    }
  });

  function tou_setActive(id) {
    tou_navLinks.forEach(function (link) {
      var linkId = link.getAttribute("href").replace("#", "");
      if (linkId === id) {
        link.classList.add("tou-nav-active");
      } else {
        link.classList.remove("tou-nav-active");
      }
    });
  }

  /* Use IntersectionObserver — highlight whichever section is most visible */
  if ("IntersectionObserver" in window) {
    var tou_navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            tou_setActive(entry.target.id);
          }
        });
      },
      {
        root: null,
        /* Fire when the section crosses the top-third of the viewport */
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    tou_sections.forEach(function (sec) {
      tou_navObserver.observe(sec);
    });
  } else {
    /* Fallback for older browsers — highlight on scroll */
    window.addEventListener("scroll", function () {
      var scrollY = window.scrollY + window.innerHeight * 0.3;
      var current = tou_sections[0] ? tou_sections[0].id : "";
      tou_sections.forEach(function (sec) {
        if (sec.offsetTop <= scrollY) current = sec.id;
      });
      tou_setActive(current);
    });
  }
})();
// ─────────────────────────────────────────────────────────────────────────────

/* ===== MOBILE HAMBURGER MENU ===== */
(function () {
  "use strict";

  var hamburger = document.getElementById("touHamburger");
  var mobileMenu = document.getElementById("touMobileMenu");

  if (!hamburger || !mobileMenu) return;

  function setMenuState(open) {
    hamburger.classList.toggle("tou-hamburger--open", open);
    mobileMenu.classList.toggle("tou-mobile-menu--open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));
  }

  function toggleMenu() {
    var isOpen = hamburger.classList.contains("tou-hamburger--open");
    setMenuState(!isOpen);
  }

  function closeMenu() {
    setMenuState(false);
  }

  // Toggle dropdown and hamburger animation on button click
  hamburger.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleMenu();
  });

  // Automatically close menu when any mobile navigation link is clicked
  var mobileLinks = mobileMenu.querySelectorAll(".tou-mobile-link");
  mobileLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeMenu();
    });
  });

  // Close menu when clicking outside navbar / dropdown
  document.addEventListener("click", function (e) {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key press for keyboard accessibility
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && hamburger.classList.contains("tou-hamburger--open")) {
      closeMenu();
      hamburger.focus();
    }
  });

  // Close menu if window is resized past mobile breakpoint (900px)
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900 && hamburger.classList.contains("tou-hamburger--open")) {
      closeMenu();
    }
  });
})();
/* ───────────────────────────────────────────────────────────── */

/* ===== BACK TO TOP BUTTON ===== */
(function () {
  "use strict";
  var btn = document.getElementById("tou-back-to-top");
  if (!btn) return;

  /* Show after scrolling 300px */
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      btn.classList.add("tou-btt-visible");
    } else {
      btn.classList.remove("tou-btt-visible");
    }
  }, { passive: true });

  /* Scroll back to top on click */
  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

(function () {
  "use strict";

  /* Elements to animate — all sections */
  var tou_selectors = [
    ".Arrivals-section .tou-anim-fade-up",
    ".Arrivals-section .tou-anim-fade-left",
    ".Arrivals-section .tou-anim-scale-in",
    ".tou-tech-section .tou-anim-fade-up",
    ".tou-tech-section .tou-anim-fade-left",
    ".tou-tech-section .tou-anim-scale-in",
    ".gallery-section .tou-anim-fade-up",
    ".gallery-section .tou-anim-fade-left",
    ".gallery-section .tou-anim-scale-in",
    ".tou-about-section .tou-anim-fade-up",
    ".tou-about-section .tou-anim-fade-left",
    ".tou-about-section .tou-anim-scale-in",
    ".contact-section .tou-anim-fade-up",
    ".contact-section .tou-anim-fade-left",
    ".tou-footer .tou-anim-fade-up",
  ];

  var tou_elements = document.querySelectorAll(tou_selectors.join(","));

  /* If browser doesn't support IntersectionObserver, show everything */
  if (!("IntersectionObserver" in window)) {
    tou_elements.forEach(function (el) {
      el.classList.add("tou-anim-visible");
    });
    return;
  }

  var tou_observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("tou-anim-visible");
          tou_observer.unobserve(entry.target); /* animate once */
        }
      });
    },
    {
      threshold: 0.15 /* trigger when 15% of element is visible */,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  tou_elements.forEach(function (el) {
    tou_observer.observe(el);
  });
})();


/* ===================== GALLERY LIGHTBOX ===================== */
(function () {
  "use strict";

  var lightbox  = document.getElementById("tou-lightbox");
  var lbImg     = document.getElementById("tou-lb-img");
  var lbCaption = document.getElementById("tou-lb-caption");
  var lbClose   = document.getElementById("tou-lb-close");
  var lbPrev    = document.getElementById("tou-lb-prev");
  var lbNext    = document.getElementById("tou-lb-next");
  var lbCounter = document.getElementById("tou-lb-counter");
  var lbZoom    = document.getElementById("tou-lb-zoom");
  var lbFs      = document.getElementById("tou-lb-fs");
  var lbThumbs  = document.getElementById("tou-lb-thumbs");

  if (!lightbox || !lbImg) return; /* safety guard */

  /* Collect all gallery items that have lightbox data */
  var items = Array.from(
    document.querySelectorAll(".gallery-item[data-lb-src]")
  );
  if (items.length === 0) return;

  var currentIndex = 0;
  var lastFocusedElement = null;

  /* ---- Build Bottom Thumbnail Strip dynamically ---- */
  var thumbButtons = [];
  if (lbThumbs) {
    lbThumbs.innerHTML = "";
    items.forEach(function (item, idx) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tou-lb-thumb";
      btn.setAttribute("aria-label", "View " + (item.dataset.lbCaption || ("image " + (idx + 1))));
      var tImg = document.createElement("img");
      tImg.src = item.dataset.lbSrc;
      tImg.alt = item.dataset.lbCaption || "";
      btn.appendChild(tImg);
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        openLightbox(idx);
      });
      lbThumbs.appendChild(btn);
      thumbButtons.push(btn);
    });
  }

  /* ---- Update active thumbnail highlight ---- */
  function updateThumbs(index) {
    thumbButtons.forEach(function (btn, idx) {
      if (idx === index) {
        btn.classList.add("tou-lb-thumb-active");
        btn.setAttribute("aria-current", "true");
        btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      } else {
        btn.classList.remove("tou-lb-thumb-active");
        btn.removeAttribute("aria-current");
      }
    });
  }

  /* ---- Reset Zoom ---- */
  function resetZoom() {
    lbImg.classList.remove("tou-zoomed");
    if (lbZoom) {
      lbZoom.setAttribute("aria-pressed", "false");
      lbZoom.title = "Toggle Zoom (Z)";
    }
  }

  /* ---- Toggle Zoom ---- */
  function toggleZoom() {
    var isZoomed = lbImg.classList.toggle("tou-zoomed");
    if (lbZoom) {
      lbZoom.setAttribute("aria-pressed", String(isZoomed));
      lbZoom.title = isZoomed ? "Zoom Out (Z)" : "Zoom In (Z)";
    }
  }

  /* ---- Toggle Native Browser Fullscreen Mode ---- */
  function toggleFullscreen() {
    var fsElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fsElement) {
      if (lightbox.requestFullscreen) {
        lightbox.requestFullscreen().catch(function () {});
      } else if (lightbox.webkitRequestFullscreen) {
        lightbox.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(function () {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  /* Sync Fullscreen Button icon state */
  function onFullscreenChange() {
    var isFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
    if (!lbFs) return;
    lbFs.setAttribute("aria-pressed", String(isFs));
    lbFs.title = isFs ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)";
    lbFs.innerHTML = isFs
      ? '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>'
      : '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
  }
  document.addEventListener("fullscreenchange", onFullscreenChange);
  document.addEventListener("webkitfullscreenchange", onFullscreenChange);

  /* ---- Open Lightbox ---- */
  function openLightbox(index) {
    if (index < 0 || index >= items.length) return;
    if (!lightbox.classList.contains("tou-lightbox-open")) {
      lastFocusedElement = document.activeElement;
    }

    currentIndex = index;
    var item = items[currentIndex];

    resetZoom();

    // Subtle crossfade animation
    lbImg.classList.add("tou-lb-fade");
    setTimeout(function () {
      lbImg.src = item.dataset.lbSrc;
      lbImg.alt = item.dataset.lbCaption || "Luxury watch";
      if (lbCaption) {
        lbCaption.textContent = item.dataset.lbCaption || "";
      }
      if (lbCounter) {
        lbCounter.textContent = (currentIndex + 1) + " / " + items.length;
      }
      lbImg.classList.remove("tou-lb-fade");
    }, 120);

    updateThumbs(currentIndex);

    lightbox.classList.add("tou-lightbox-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; /* prevent background page scroll */

    if (lbClose) lbClose.focus();
  }

  /* ---- Close Lightbox ---- */
  function closeLightbox() {
    var fsElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (fsElement && document.exitFullscreen) {
      document.exitFullscreen().catch(function () {});
    }

    resetZoom();
    lightbox.classList.remove("tou-lightbox-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // Clear src after fade out
    setTimeout(function () {
      if (!lightbox.classList.contains("tou-lightbox-open")) {
        lbImg.src = "";
      }
    }, 200);

    // Restore focus
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  /* ---- Navigate ---- */
  function showPrev() {
    openLightbox((currentIndex - 1 + items.length) % items.length);
  }
  function showNext() {
    openLightbox((currentIndex + 1) % items.length);
  }

  /* ---- Click & Keyboard on Gallery Items ---- */
  items.forEach(function (item, idx) {
    item.addEventListener("click", function () {
      openLightbox(idx);
    });

    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  /* ---- Controls & Action Buttons ---- */
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lbPrev) {
    lbPrev.addEventListener("click", function (e) {
      e.stopPropagation();
      showPrev();
    });
  }
  if (lbNext) {
    lbNext.addEventListener("click", function (e) {
      e.stopPropagation();
      showNext();
    });
  }
  if (lbZoom) {
    lbZoom.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleZoom();
    });
  }
  if (lbFs) {
    lbFs.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleFullscreen();
    });
  }

  /* Click image directly to toggle zoom */
  lbImg.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleZoom();
  });

  /* ---- Click backdrop to close ---- */
  lightbox.addEventListener("click", function (e) {
    // If clicking outside inner stage and action buttons
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  /* ---- Keyboard shortcuts ---- */
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("tou-lightbox-open")) return;

    if (e.key === "Escape") {
      e.preventDefault();
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      showPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      showNext();
    } else if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      toggleFullscreen();
    } else if (e.key === "z" || e.key === "Z") {
      e.preventDefault();
      toggleZoom();
    }
  });

  /* ---- Touch / Swipe support ---- */
  var touchStartX = 0;
  var touchStartY = 0;

  lightbox.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    },
    { passive: true }
  );

  lightbox.addEventListener(
    "touchend",
    function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      var dy = e.changedTouches[0].clientY - touchStartY;

      // Only handle horizontal swipes if horizontal movement > vertical movement
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
        if (dx < 0) {
          showNext();
        } else {
          showPrev();
        }
      }
    },
    { passive: true }
  );
})();
/* ============================================================ */
