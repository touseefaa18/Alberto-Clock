/**
 * Alberto Clocks — Main JavaScript */

(function ($) {
  "use strict";

  var albertoWatches = [];

  /* ===== 1. PRELOADER ===== */
  $(window).on("load", function () {
    setTimeout(function () {
      $("#acPreloader").addClass("ac-hidden");
      $("body").css("overflow", "");
      // Trigger hero line animations
      $(".ac-hero-heading-line").each(function (i) {
        var $el = $(this);
        setTimeout(function () {
          $el.addClass("ac-line-visible");
        }, i * 180);
      });
      // Start hero video transition
      $(".ac-hero-video").addClass("ac-loaded");
    }, 1200);
  });

  /* Prevent scroll during preloader */
  $("body").css("overflow", "hidden");

  /* ===== 2. CUSTOM CURSOR ===== */
  (function () {
    var $cursor = $("#acCursor");
    var $cursorDot = $("#acCursorDot");
    var mouseX = 0,
      mouseY = 0;
    var cursorX = 0,
      cursorY = 0;
    var dotX = 0,
      dotY = 0;

    if (window.matchMedia("(pointer: fine)").matches) {
      $(document).on("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        dotX += (mouseX - dotX) * 0.6;
        dotY += (mouseY - dotY) * 0.6;

        $cursor.css(
          "transform",
          "translate(" +
            cursorX +
            "px, " +
            cursorY +
            "px) translate(-50%, -50%)",
        );
        $cursorDot.css(
          "transform",
          "translate(" + dotX + "px, " + dotY + "px) translate(-50%, -50%)",
        );
        requestAnimationFrame(animateCursor);
      }
      animateCursor();

      /* Hover effects */
      $(document).on(
        "mouseenter",
        "a, button, .ac-watch-card, .ac-gallery-item, .ac-tech-card, .ac-founder-card, .ac-value-card",
        function () {
          $cursor.addClass("ac-cursor-hover");
        },
      );
      $(document).on(
        "mouseleave",
        "a, button, .ac-watch-card, .ac-gallery-item, .ac-tech-card, .ac-founder-card, .ac-value-card",
        function () {
          $cursor.removeClass("ac-cursor-hover");
        },
      );
    }
  })();

  /* ===== 3. HEADER SCROLL BEHAVIOR ===== */
  (function () {
    var $header = $("#acHeader");
    var lastScroll = 0;

    $(window).on("scroll", function () {
      var scrollY = $(this).scrollTop();

      /* Sticky glass effect */
      if (scrollY > 60) {
        $header.addClass("ac-scrolled");
      } else {
        $header.removeClass("ac-scrolled");
      }

      lastScroll = scrollY;
    });
  })();

  /* ===== 4. HAMBURGER / MOBILE MENU ===== */
  (function () {
    var $hamburger = $("#acHamburger");
    var $mobileMenu = $("#acMobileMenu");

    function setMenuState(open) {
      $hamburger.toggleClass("ac-open", open);
      $mobileMenu.toggleClass("ac-open", open);
      $hamburger.attr("aria-expanded", String(open));
      $mobileMenu.attr("aria-hidden", String(!open));
    }

    $hamburger.on("click", function (e) {
      e.stopPropagation();
      setMenuState(!$hamburger.hasClass("ac-open"));
    });

    $mobileMenu.find(".ac-mobile-link").on("click", function () {
      setMenuState(false);
    });

    $(document).on("click", function (e) {
      if (!$(e.target).closest("#acHamburger, #acMobileMenu").length) {
        setMenuState(false);
      }
    });

    $(document).on("keydown", function (e) {
      if (e.key === "Escape" && $hamburger.hasClass("ac-open")) {
        setMenuState(false);
        $hamburger.trigger("focus");
      }
    });

    $(window).on("resize", function () {
      if ($(window).width() > 900 && $hamburger.hasClass("ac-open")) {
        setMenuState(false);
      }
    });
  })();

  /* ===== 5. ACTIVE NAV HIGHLIGHT (INTERSECTION OBSERVER) ===== */
  (function () {
    var $navLinks = $(".ac-nav-link, .ac-mobile-link");
    var sections = [];

    $navLinks.each(function () {
      var id = $(this).attr("href").replace("#", "");
      var sec = document.getElementById(id);
      if (sec && sections.indexOf(sec) === -1) sections.push(sec);
    });

    function setActive(id) {
      $navLinks.each(function () {
        var href = $(this).attr("href") || "";

        var isActive = href === "#" + id;

        $(this).toggleClass("ac-active", isActive);

        // Identify the current navigation destination.
        if (isActive) {
          $(this).attr("aria-current", "location");
        } else {
          $(this).removeAttr("aria-current");
        }
      });
    }

    /* UPDATE ACTIVE MENU IMMEDIATELY AFTER CLICK */

    $navLinks.on("click.acActiveNav", function () {
      var href = $(this).attr("href");

      // Ignore invalid or external navigation links.
      if (!href || href === "#" || href.charAt(0) !== "#") {
        return;
      }

      var targetId = href.substring(1);

      // Confirm the destination exists.
      if (!document.getElementById(targetId)) {
        console.warn("Navigation destination not found:", targetId);
        return;
      }

      // Highlight the matching desktop and mobile links.
      setActive(targetId);
    });

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) setActive(e.target.id);
          });
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
      );

      sections.forEach(function (sec) {
        observer.observe(sec);
      });
    } else {
      $(window).on("scroll", function () {
        var scrollY = $(this).scrollTop() + $(this).height() * 0.3;
        var current = sections.length ? sections[0].id : "";
        sections.forEach(function (sec) {
          if (sec.offsetTop <= scrollY) current = sec.id;
        });
        setActive(current);
      });
    }
  })();

  /* ===== 6. SCROLL-REVEAL ANIMATIONS ===== */
  (function () {
    var selectors = ".ac-reveal-up, .ac-reveal-left, .ac-reveal-scale";
    var $elements = $(selectors);

    if (!("IntersectionObserver" in window)) {
      $elements.addClass("ac-revealed");
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = $(entry.target).data("delay") || 0;
            setTimeout(function () {
              $(entry.target).addClass("ac-revealed");
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    $elements.each(function () {
      observer.observe(this);
    });
  })();

  /* ===== 7. HERO PARTICLE CANVAS ===== */
  (function () {
    var canvas = document.getElementById("acParticles");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var particles = [];
    var W, H;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    $(window).on("resize", resize);

    function Particle() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -Math.random() * 0.4 - 0.1;
      this.alpha = Math.random() * 0.4 + 0.1;
    }
    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -5) {
        this.y = H + 5;
        this.x = Math.random() * W;
      }
    };

    for (var i = 0; i < 80; i++) particles.push(new Particle());

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(function (p) {
        p.update();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(201,168,108," + p.alpha + ")";
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  })();

  /* ===== 8. ANIMATED COUNTERS ===== */
  (function () {
    var counted = false;
    var $stats = $(".ac-stat-num[data-count]");

    function runCounters() {
      if (counted) return;
      $stats.each(function () {
        var $el = $(this);
        var target = parseInt($el.data("count"), 10);
        $({ n: 0 }).animate(
          { n: target },
          {
            duration: 2000,
            easing: "swing",
            step: function () {
              $el.text(Math.floor(this.n));
            },
            complete: function () {
              $el.text(target);
            },
          },
        );
      });
      counted = true;
    }

    if ("IntersectionObserver" in window) {
      var $aboutSection = $("#about");
      if ($aboutSection.length) {
        var observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) {
                runCounters();
                observer.disconnect();
              }
            });
          },
          { threshold: 0.3 },
        );
        observer.observe($aboutSection[0]);
      }
    } else {
      runCounters();
    }
  })();

  /* ===== 9. TESTIMONIALS SLIDER ===== */
  (function () {
    var $track = $("#acTestimonialsTrack");
    var $cards = $track.find(".ac-testimonial-card");
    var $dotsWrap = $("#acTestDots");
    var $prev = $("#acTestPrev");
    var $next = $("#acTestNext");
    var total = $cards.length;
    var current = 0;
    var autoTimer;

    if (total === 0) return;

    /* Build dots */
    for (var i = 0; i < total; i++) {
      var $dot = $(
        '<button class="ac-test-dot" aria-label="Go to testimonial ' +
          (i + 1) +
          '" role="listitem"></button>',
      );
      $dotsWrap.append($dot);
    }
    var $dots = $dotsWrap.find(".ac-test-dot");

    function goTo(index) {
      current = (index + total) % total;
      $track.css("transform", "translateX(-" + current * 100 + "%)");
      $dots.removeClass("ac-active").eq(current).addClass("ac-active");
      resetAuto();
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(function () {
        goTo(current + 1);
      }, 5500);
    }

    $prev.on("click", function () {
      goTo(current - 1);
    });
    $next.on("click", function () {
      goTo(current + 1);
    });
    $dots.each(function (i) {
      $(this).on("click", function () {
        goTo(i);
      });
    });

    /* Touch swipe */
    var touchStartX = 0;
    $track[0].addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.changedTouches[0].clientX;
      },
      { passive: true },
    );
    $track[0].addEventListener(
      "touchend",
      function (e) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
      },
      { passive: true },
    );

    goTo(0);
  })();

  /* ===== 10. GALLERY LIGHTBOX ===== */
  (function () {
    var $lb = $("#acLightbox");
    var $lbImg = $("#acLbImg");
    var $lbCaption = $("#acLbCaption");
    var $lbClose = $("#acLbClose");
    var $lbPrev = $("#acLbPrev");
    var $lbNext = $("#acLbNext");
    var $lbCounter = $("#acLbCounter");
    var $lbZoom = $("#acLbZoom");
    var $lbFs = $("#acLbFs");
    var $lbThumbs = $("#acLbThumbs");

    if (!$lb.length) return;

    var items = $(".ac-gallery-item[data-lb-src]").toArray();
    if (!items.length) return;

    var currentIndex = 0;
    var lastFocused = null;
    var $thumbBtns = [];

    /* Build thumbnails */
    items.forEach(function (item, idx) {
      var $item = $(item);
      var $btn = $(
        '<button class="ac-lb-thumb" role="listitem" aria-label="View ' +
          ($item.data("lb-caption") || "image " + (idx + 1)) +
          '"></button>',
      );
      var $img = $('<img loading="lazy" />')
        .attr("src", $item.data("lb-src"))
        .attr("alt", $item.data("lb-caption") || "");
      $btn.append($img);
      $btn.on("click", function (e) {
        e.stopPropagation();
        openLb(idx);
      });
      $lbThumbs.append($btn);
      $thumbBtns.push($btn);
    });

    function updateThumbs(i) {
      $thumbBtns.forEach(function ($b, idx) {
        $b.toggleClass("ac-active", idx === i);
        $b.attr("aria-current", idx === i ? "true" : false);
        if (idx === i)
          $b[0].scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
      });
    }

    function resetZoom() {
      $lbImg.removeClass("ac-zoomed");
      $lbZoom.attr("aria-pressed", "false").attr("title", "Toggle Zoom (Z)");
    }
    function toggleZoom() {
      var zoomed = $lbImg.toggleClass("ac-zoomed").hasClass("ac-zoomed");
      $lbZoom
        .attr("aria-pressed", String(zoomed))
        .attr("title", zoomed ? "Zoom Out (Z)" : "Zoom In (Z)");
    }
    function toggleFs() {
      var fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      if (!fsEl) {
        (
          $lb[0].requestFullscreen ||
          $lb[0].webkitRequestFullscreen ||
          $.noop
        ).call($lb[0]);
      } else {
        (
          document.exitFullscreen ||
          document.webkitExitFullscreen ||
          $.noop
        ).call(document);
      }
    }
    function onFsChange() {
      var isFs = !!(
        document.fullscreenElement || document.webkitFullscreenElement
      );
      $lbFs
        .attr("aria-pressed", String(isFs))
        .attr("title", isFs ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)");
    }
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);

    function openLb(idx) {
      if (idx < 0 || idx >= items.length) return;
      if (!$lb.hasClass("ac-open")) lastFocused = document.activeElement;
      currentIndex = idx;
      var $item = $(items[idx]);
      resetZoom();
      $lbImg.addClass("ac-fade");
      setTimeout(function () {
        $lbImg
          .attr("src", $item.data("lb-src"))
          .attr("alt", $item.data("lb-caption") || "Luxury watch");
        $lbCaption.text($item.data("lb-caption") || "");
        $lbCounter.text(idx + 1 + " / " + items.length);
        $lbImg.removeClass("ac-fade");
      }, 130);
      updateThumbs(idx);
      $lb.addClass("ac-open").attr("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      $lbClose.trigger("focus");
    }

    function closeLb() {
      var fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      if (fsEl && document.exitFullscreen)
        document.exitFullscreen().catch($.noop);
      resetZoom();
      $lb.removeClass("ac-open").attr("aria-hidden", "true");
      document.body.style.overflow = "";
      setTimeout(function () {
        if (!$lb.hasClass("ac-open")) $lbImg.attr("src", "");
      }, 250);
      if (lastFocused && typeof lastFocused.focus === "function")
        lastFocused.focus();
    }

    /* Gallery item click */
    $(items).each(function (idx) {
      $(this).on("click", function () {
        openLb(idx);
      });
      $(this).on("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLb(idx);
        }
      });
    });

    /* Controls */
    $lbClose.on("click", closeLb);
    $lbPrev.on("click", function (e) {
      e.stopPropagation();
      openLb((currentIndex - 1 + items.length) % items.length);
    });
    $lbNext.on("click", function (e) {
      e.stopPropagation();
      openLb((currentIndex + 1) % items.length);
    });
    $lbZoom.on("click", function (e) {
      e.stopPropagation();
      toggleZoom();
    });
    $lbFs.on("click", function (e) {
      e.stopPropagation();
      toggleFs();
    });
    $lbImg.on("click", function (e) {
      e.stopPropagation();
      toggleZoom();
    });

    $lb.on("click", function (e) {
      if ($(e.target).is($lb)) closeLb();
    });

    /* Keyboard */
    $(document).on("keydown", function (e) {
      if (!$lb.hasClass("ac-open")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeLb();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        openLb((currentIndex - 1 + items.length) % items.length);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        openLb((currentIndex + 1) % items.length);
      }
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFs();
      }
      if (e.key === "z" || e.key === "Z") {
        e.preventDefault();
        toggleZoom();
      }
    });

    /* Touch swipe */
    var touchX = 0,
      touchY = 0;
    $lb[0].addEventListener(
      "touchstart",
      function (e) {
        touchX = e.changedTouches[0].clientX;
        touchY = e.changedTouches[0].clientY;
      },
      { passive: true },
    );
    $lb[0].addEventListener(
      "touchend",
      function (e) {
        var dx = e.changedTouches[0].clientX - touchX;
        var dy = e.changedTouches[0].clientY - touchY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
          openLb(
            dx < 0
              ? (currentIndex + 1) % items.length
              : (currentIndex - 1 + items.length) % items.length,
          );
        }
      },
      { passive: true },
    );
  })();

  /* ===== 11. CONTACT FORM ===== */
  (function () {
    $("#acContactForm").on("submit", function (e) {
      e.preventDefault();
      var $btn = $(this).find("[type=submit]");
      var $span = $btn.find("span");
      $span.text("Sending...");
      $btn.prop("disabled", true).css("opacity", "0.7");

      setTimeout(function () {
        $span.text("Request Sent ✓");
        $btn.css({
          opacity: "1",
          background: "linear-gradient(135deg, #2d6a4f, #40916c)",
          color: "#d8f3dc",
        });
        setTimeout(function () {
          $span.text("Request Consultation");
          $btn.prop("disabled", false).css({ background: "", color: "" });
          $("#acContactForm")[0].reset();
        }, 3500);
      }, 1200);
    });
  })();

  /* ===== 12. SMOOTH SCROLL FOR ANCHOR LINKS ===== */
  (function () {
    $(document).on("click", 'a[href^="#"]', function (e) {
      var target = $(this).attr("href");
      if (target === "#" || !$(target).length) return;
      e.preventDefault();
      var offset = $("#acHeader").outerHeight() || 80;
      $("html, body").animate(
        {
          scrollTop: $(target).offset().top - offset,
        },
        800,
        "swing",
      );
    });
  })();

  /* ===== 13. PARALLAX HERO VIDEO ===== */
  (function () {
    var $video = $(".ac-hero-video");
    if (
      !$video.length ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    $(window).on("scroll", function () {
      var scrollY = $(this).scrollTop();
      var pct = scrollY / $(window).height();
      $video.css("transform", "scale(1) translateY(" + pct * 20 + "%)");
    });
  })();

  /* ===== 14. NAVBAR GLASS PROGRESS BAR ===== */
  /* REMOVED — golden reading progress bar */

  /* ===== 15. HOVER TILT EFFECT ON CARDS ===== */
  (function () {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    $(document).on(
      "mousemove",
      ".ac-watch-card, .ac-tech-card, .ac-founder-card, .ac-value-card",
      function (e) {
        var $card = $(this);
        var rect = this.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) / (rect.width / 2);
        var dy = (e.clientY - cy) / (rect.height / 2);
        var rotateX = dy * -6;
        var rotateY = dx * 6;
        $card.css(
          "transform",
          "translateY(-8px) perspective(800px) rotateX(" +
            rotateX +
            "deg) rotateY(" +
            rotateY +
            "deg)",
        );
      },
    );
    $(document).on(
      "mouseleave",
      ".ac-watch-card, .ac-tech-card, .ac-founder-card, .ac-value-card",
      function () {
        $(this).css("transform", "");
      },
    );
  })();

  (function () {
    "use strict";

    const $productGrid = $("#acProductGrid");
    const $categoryFilters = $("#acCategoryFilters");
    const $catalogueStatus = $("#acCatalogueStatus");
    const $productModal = $("#acProductModal");

    let activeCategory = "all";
    let activeSort = "featured";
    let lastModalTrigger = null;
    let previousBodyOverflow = "";

    if (!$productGrid.length) {
      console.error("Product grid #acProductGrid was not found.");
      return;
    }

    /* =========================================
       SHARED PRODUCT HELPERS
       ========================================= */

    function formatWatchPrice(watch) {
      const price = Number(watch.price);
      const currency = watch.currency || "USD";

      try {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
          maximumFractionDigits: 0,
        }).format(price);
      } catch (error) {
        return currency + " " + price.toLocaleString("en-US");
      }
    }

    function getWatchBadge(category) {
      const badges = {
        Classic: { text: "New", className: "ac-badge-new" },
        Vintage: { text: "Heritage", className: "ac-badge-trending" },
        Luxury: { text: "Exclusive", className: "ac-badge-exclusive" },
      };

      return (
        badges[category] || {
          text: "Featured",
          className: "ac-badge-new",
        }
      );
    }

    /* =========================================
       CREATE A PRODUCT CARD FROM JSON
       ========================================= */

    function createWatchCard(watch, index) {
      const $column = $("<div>", {
        class: "col-12 col-sm-6 col-xl-3",
      });

      const $card = $("<article>", {
        class: "ac-watch-card ac-reveal-up",
        "data-delay": index * 100,
      });

      $card.attr("itemscope", "");
      $card.attr("itemtype", "https://schema.org/Product");

      const $image = $("<div>", {
        class: "ac-watch-card-img",
        role: "img",
        "aria-label": watch.name + " luxury watch",
      });

      const imageURL = new URL(watch.image, document.baseURI);
      $image.css("background-image", 'url("' + imageURL.href + '")');

      const badge = getWatchBadge(watch.category);
      const $badge = $("<span>", {
        class: "ac-watch-badge " + badge.className,
      }).text(badge.text);
      $image.append($badge);

      const $overlay = $("<div>", {
        class: "ac-watch-card-hover-overlay",
      });

      const $quickView = $("<button>", {
        class: "ac-quick-view-btn",
        type: "button",
        "aria-label": "Quick view " + watch.name,
      })
        .attr("data-product-id", watch.id)
        .text("Quick View");

      $overlay.append($quickView);
      $image.append($overlay);

      const $body = $("<div>", {
        class: "ac-watch-card-body",
      });

      const $collection = $("<p>", {
        class: "ac-watch-collection",
        itemprop: "brand",
      }).text(
        (watch.brand || "Alberto") + " · " + (watch.collection || "Collection"),
      );

      const $name = $("<h3>", {
        class: "ac-watch-name",
        itemprop: "name",
      }).text(watch.name);

      const $description = $("<p>", {
        class: "ac-watch-desc",
        itemprop: "description",
      }).text(watch.description || "");

      const $footer = $("<div>", {
        class: "ac-watch-footer",
      });

      const $price = $("<span>", {
        class: "ac-watch-price",
        itemprop: "price",
      })
        .attr("content", watch.price)
        .text(formatWatchPrice(watch));

      const $explore = $("<button>", {
        class: "ac-btn-card",
        type: "button",
        "aria-label": "Explore " + watch.name,
      })
        .attr("data-product-id", watch.id)
        .text("Explore More");

      $footer.append($price, $explore);
      $body.append($collection, $name, $description, $footer);
      $card.append($image, $body);
      $column.append($card);

      return $column;
    }

    /* =========================================
       RENDER PRODUCT CARDS
       ========================================= */

    function renderWatchCards(watches) {
      $productGrid.empty();

      if (!watches.length) {
        $productGrid.append(
          $("<div>", { class: "col-12 text-center" }).text(
            "No watches are currently available.",
          ),
        );
        return;
      }

      watches.forEach(function (watch, index) {
        if (
          !watch.id ||
          !watch.name ||
          !watch.image ||
          !Number.isFinite(Number(watch.price))
        ) {
          console.warn("Invalid watch record:", watch);
          return;
        }

        const $card = createWatchCard(watch, index);
        $productGrid.append($card);

        window.setTimeout(
          function () {
            $card.find(".ac-watch-card").addClass("ac-revealed");
          },
          50 + index * 100,
        );
      });
    }

    /* =========================================
       CATEGORY FILTERING AND SORTING
       ========================================= */

    function getFilteredWatches() {
      return albertoWatches.filter(function (watch) {
        const watchCategory = String(watch.category || "").toLowerCase();
        return activeCategory === "all" || watchCategory === activeCategory;
      });
    }

    function getSortedWatches(watches) {
      const sorted = watches.slice();

      switch (activeSort) {
        case "price-low":
          sorted.sort(function (a, b) {
            return Number(a.price) - Number(b.price);
          });
          break;

        case "price-high":
          sorted.sort(function (a, b) {
            return Number(b.price) - Number(a.price);
          });
          break;

        case "name-az":
          sorted.sort(function (a, b) {
            return a.name.localeCompare(b.name, undefined, {
              sensitivity: "base",
            });
          });
          break;

        case "name-za":
          sorted.sort(function (a, b) {
            return b.name.localeCompare(a.name, undefined, {
              sensitivity: "base",
            });
          });
          break;

        case "featured":
        default:
          // Keep the original JSON order.
          break;
      }

      return sorted;
    }

    function renderCatalogue() {
      const filtered = getFilteredWatches();
      const finalProducts = getSortedWatches(filtered);

      renderWatchCards(finalProducts);

      if ($catalogueStatus.length) {
        const categoryName =
          activeCategory === "all"
            ? "All collections"
            : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);

        $catalogueStatus.text(
          "Showing " +
            finalProducts.length +
            " of " +
            albertoWatches.length +
            " watches · " +
            categoryName,
        );
      }
    }

    /* =========================================
       DYNAMIC COMPLETE PRICE LIST
       ========================================= */

    function renderPriceList() {
      const $tableBody = $("#acPriceTableBody");
      if (!$tableBody.length) return;

      $tableBody.empty();

      if (!albertoWatches.length) {
        $("<tr>")
          .append(
            $("<td>", {
              colspan: 6,
              class: "ac-price-table-empty",
            }).text("No watch prices available."),
          )
          .appendTo($tableBody);

        $("#acPriceCount").text("0 Watches");
        return;
      }

      albertoWatches.forEach(function (watch) {
        const $row = $("<tr>");

        $("<td>", { class: "ac-price-watch-name" })
          .text(watch.name)
          .appendTo($row);

        $("<td>", { class: "ac-price-watch-reference" })
          .text(watch.reference || watch.model || "N/A")
          .appendTo($row);

        $("<td>")
          .text(watch.collection || "Alberto Collection")
          .appendTo($row);

        $("<td>", { class: "ac-price-watch-category" })
          .text(watch.category || "Classic")
          .appendTo($row);

        $("<td>", { class: "ac-price-watch-value" })
          .text(formatWatchPrice(watch))
          .appendTo($row);

        const $viewButton = $("<button>", {
          type: "button",
          class: "ac-price-view-btn",
          "aria-label": "View details for " + watch.name,
        })
          .attr("data-product-id", watch.id)
          .text("View Details");

        $("<td>").append($viewButton).appendTo($row);
        $tableBody.append($row);
      });

      $("#acPriceCount").text(albertoWatches.length + " Watches Available");
    }

    /* =========================================
       PRODUCT QUICK VIEW MODAL
       These functions are intentionally outside
       renderCatalogue() so they are defined once.
       ========================================= */

    function openWatchModal(productId) {
      const watch = albertoWatches.find(function (item) {
        return String(item.id) === String(productId);
      });

      if (!watch) {
        console.error("Product not found:", productId);
        return;
      }

      if (!$productModal.length) {
        console.error("Product modal #acProductModal was not found.");
        return;
      }

      const imageURL = new URL(watch.image, document.baseURI).href;

      $("#acModalImage").attr({
        src: imageURL,
        alt: watch.name + " Alberto watch",
      });

      $("#acModalCollection").text(
        [watch.brand || "Alberto", watch.collection || "", watch.category || ""]
          .filter(Boolean)
          .join(" · "),
      );

      $("#acModalName").text(watch.name);
      $("#acModalReference").text(
        "REFERENCE " + (watch.reference || watch.model || "N/A"),
      );
      $("#acModalPrice").text(formatWatchPrice(watch));
      $("#acModalDescription").text(
        watch.description || "Product details unavailable.",
      );

      const $specifications = $("#acModalSpecifications").empty();

      if (Array.isArray(watch.specifications) && watch.specifications.length) {
        watch.specifications.forEach(function (spec) {
          if (!spec || !spec.label || !spec.value) return;
          $("<dt>").text(spec.label).appendTo($specifications);
          $("<dd>").text(spec.value).appendTo($specifications);
        });
      } else {
        $("<dt>").text("Specifications").appendTo($specifications);
        $("<dd>")
          .text("Specifications currently unavailable.")
          .appendTo($specifications);
      }

      previousBodyOverflow = $("body").css("overflow");
      $("body").css("overflow", "hidden");

      $productModal.addClass("ac-open").attr("aria-hidden", "false");

      $("#acProductModalClose").trigger("focus");
    }

    function closeWatchModal() {
      if (!$productModal.hasClass("ac-open")) return;

      $productModal.removeClass("ac-open").attr("aria-hidden", "true");

      $("body").css("overflow", previousBodyOverflow);

      window.setTimeout(function () {
        if (!$productModal.hasClass("ac-open")) {
          $("#acModalImage").attr("src", "");
        }
      }, 320);

      if (
        lastModalTrigger &&
        document.documentElement.contains(lastModalTrigger)
      ) {
        $(lastModalTrigger).trigger("focus");
      }
      lastModalTrigger = null;
    }

    /*
       IMPORTANT FIX:
       Event delegation is attached to document because product
       cards are created dynamically after watches.json loads.
       This handler is registered once, not during each render.
    */
    $(document)
      .off(
        "click.acWatchModal",
        ".ac-quick-view-btn, .ac-btn-card, .ac-price-view-btn",
      )
      .on(
        "click.acWatchModal",
        ".ac-quick-view-btn, .ac-btn-card, .ac-price-view-btn",
        function (event) {
          event.preventDefault();
          const productId = $(this).attr("data-product-id");

          if (!productId) {
            console.error(
              "Product ID is missing from the clicked product button.",
            );
            return;
          }

          lastModalTrigger = this;
          openWatchModal(productId);
        },
      );

    $("#acProductModalClose")
      .off("click.acWatchModal")
      .on("click.acWatchModal", closeWatchModal);

    $productModal
      .off("click.acWatchModal")
      .on("click.acWatchModal", function (event) {
        if (event.target === this) closeWatchModal();
      });

    $(document)
      .off("keydown.acWatchModal")
      .on("keydown.acWatchModal", function (event) {
        if (!$productModal.hasClass("ac-open")) return;

        if (event.key === "Escape") {
          event.preventDefault();
          closeWatchModal();
          return;
        }

        if (event.key === "Tab") {
          const focusable = $productModal
            .find(
              "button:not([disabled]), a[href], input:not([disabled]), " +
                "select:not([disabled]), textarea:not([disabled]), " +
                '[tabindex]:not([tabindex="-1"])',
            )
            .filter(":visible");

          if (!focusable.length) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      });

    /* =========================================
       CATEGORY AND SORT CONTROL EVENTS
       ========================================= */

    $categoryFilters.on("click", ".ac-category-filter", function () {
      activeCategory = String(
        $(this).attr("data-category") || "all",
      ).toLowerCase();

      $categoryFilters
        .find(".ac-category-filter")
        .removeClass("ac-selected")
        .attr("aria-pressed", "false");

      $(this).addClass("ac-selected").attr("aria-pressed", "true");

      renderCatalogue();
    });

    $("#acProductSort").on("change", function () {
      activeSort = $(this).val() || "featured";
      renderCatalogue();
    });

    /* =========================================
       LOAD JSON PRODUCT DATABASE
       ========================================= */

    fetch("./data/watches.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error(
            "Unable to load watches.json (HTTP " + response.status + ")",
          );
        }
        return response.json();
      })
      .then(function (data) {
        if (!Array.isArray(data)) {
          throw new Error("Product data must be a JSON array.");
        }

        albertoWatches = data;
        renderCatalogue();
        renderPriceList();

        console.log(
          "Alberto products successfully loaded:",
          albertoWatches.length,
        );
      })
      .catch(function (error) {
        console.error("Product loading error:", error);

        $productGrid
          .empty()
          .append(
            $("<div>", { class: "col-12 text-center" }).text(
              "Unable to load products. Please check the product database.",
            ),
          );

        const $tableBody = $("#acPriceTableBody");
        if ($tableBody.length) {
          $tableBody.empty().append(
            $("<tr>").append(
              $("<td>", {
                colspan: 6,
                class: "ac-price-table-empty",
              }).text("Unable to load watch prices."),
            ),
          );
        }
      });
  })();

  /* =========================================
   STEP 8: LIVE DATE, TIME AND GEOLOCATION
   ========================================= */

  (function () {
    // Find all repeated ticker elements.
    const dateElements = document.querySelectorAll(".ac-ticker-date");

    const timeElements = document.querySelectorAll(".ac-ticker-time");

    const locationElements = document.querySelectorAll(".ac-ticker-location");

    const zoneElements = document.querySelectorAll(".ac-ticker-zone");

    // Stop if ticker is not present.
    if (!dateElements.length || !timeElements.length) {
      return;
    }

    /* =====================================
       LIVE DATE AND TIME
       ===================================== */

    function updateAlbertoClock() {
      const now = new Date();

      // Current local date.
      const currentDate = now.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      // Current local time.
      const currentTime = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      // Visitor's time zone.
      const currentZone =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "Local Time";

      // Update both ticker groups.
      dateElements.forEach(function (element) {
        element.textContent = currentDate;
      });

      timeElements.forEach(function (element) {
        element.textContent = currentTime;
      });

      zoneElements.forEach(function (element) {
        element.textContent = currentZone;
      });
    }

    // Run immediately.
    updateAlbertoClock();

    // Update every second.
    window.setInterval(updateAlbertoClock, 1000);

    /* =====================================
       HTML5 GEOLOCATION
       ===================================== */

    function updateTickerLocation(message) {
      locationElements.forEach(function (element) {
        element.textContent = message;
      });
    }

    function getVisitorLocation() {
      // Check browser support.
      if (!navigator.geolocation) {
        updateTickerLocation("Geolocation not supported");

        return;
      }

      // Geolocation requires a secure context.
      if (!window.isSecureContext) {
        updateTickerLocation("Secure connection required");

        return;
      }

      updateTickerLocation("Requesting location permission...");

      navigator.geolocation.getCurrentPosition(
        // LOCATION SUCCESS
        function (position) {
          const latitude = position.coords.latitude.toFixed(4);

          const longitude = position.coords.longitude.toFixed(4);

          const locationText =
            "Latitude: " + latitude + "° | Longitude: " + longitude + "°";

          updateTickerLocation(locationText);

          console.log(
            "Alberto visitor location detected:",
            latitude,
            longitude,
          );
        },

        // LOCATION ERROR
        function (error) {
          let message;

          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "Location permission denied";

              break;

            case error.POSITION_UNAVAILABLE:
              message = "Location unavailable";

              break;

            case error.TIMEOUT:
              message = "Location request timed out";

              break;

            default:
              message = "Location could not be detected";
          }

          updateTickerLocation(message);

          console.warn("Alberto geolocation:", message);
        },

        // LOCATION OPTIONS
        {
          enableHighAccuracy: false,

          timeout: 10000,

          maximumAge: 300000,
        },
      );
    }

    // Request visitor location once.
    getVisitorLocation();
  })();

  /* =========================================
   STEP 9: ALBERTO WEBSITE VISITOR COUNTER
   ========================================= */

  (function () {
    // Locate visitor counter element.
    const counterElement = document.getElementById("acVisitorCount");

    // Stop if counter is not present.
    if (!counterElement) {
      return;
    }

    // Storage keys.
    const VISITOR_KEY = "alberto_website_visitors";

    const SESSION_KEY = "alberto_session_counted";

    try {
      // Retrieve previously saved visitor count.
      let totalVisitors = Number(localStorage.getItem(VISITOR_KEY));

      // Validate stored number.
      if (!Number.isSafeInteger(totalVisitors) || totalVisitors < 0) {
        totalVisitors = 0;
      }

      // Check whether this browser tab has
      // already counted the current session.
      const alreadyCounted = sessionStorage.getItem(SESSION_KEY);

      // Only increment once per tab session.
      if (alreadyCounted !== "true") {
        totalVisitors++;

        // Save permanent browser count.
        localStorage.setItem(VISITOR_KEY, String(totalVisitors));

        // Mark current session as counted.
        sessionStorage.setItem(SESSION_KEY, "true");
      }

      // Display visitor count with formatting.
      counterElement.textContent = totalVisitors.toLocaleString("en-US");

      console.log("Alberto visitor count:", totalVisitors);
    } catch (error) {
      // Storage may be unavailable in some browsers.
      counterElement.textContent = "—";

      console.warn("Visitor counter storage unavailable:", error);
    }
  })();
})(jQuery);
