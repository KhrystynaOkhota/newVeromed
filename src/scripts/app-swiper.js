jQuery(function ($) {
  "use strict";

  // Глобальний об'єкт для функцій
  window._functions = window._functions || {};

  // ==========================================
  // 1. Універсальна функція перевірки та ховання Bottom Bar
  // ==========================================
  _functions.toggleSliderBar = function (swiper) {
    const $p = $(swiper.el).closest(".swiper-entry");
    const $bar = $p.find(".swiper-entry__bottom-bar");

    if (!$bar.length) return;

    // 1. Отримуємо кількість оригінальних слайдів (без дублікатів loop)
    const totalSlides = $(swiper.slides).not(".swiper-slide-duplicate").length;

    // 2. Обчислюємо реальну кількість видимих слайдів у viewport
    const slideWidth =
      swiper.slidesGrid.length > 1
        ? swiper.slidesGrid[1] - swiper.slidesGrid[0]
        : swiper.size;
    const visibleSlides = Math.round(swiper.size / slideWidth) || 1;

    // 3. Перевірка: чи є вміст більшим за видиму область
    const isOverflowing = !swiper.isLocked && totalSlides > visibleSlides;

    if (isOverflowing) {
      $bar.removeClass("d-none");
    } else {
      $bar.addClass("d-none");
    }
  };

  // ==========================================
  // 2. Функція кастомного трансформації слайдів
  // ==========================================
  _functions.applyOffersTransform = function (swiper) {
    const slides = swiper.slides;
    if (!slides || !slides.length) return;

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const $card = $(slide).find(".article, .promo-card");
      if (!$card.length) continue;

      const progress = slide.progress;
      const absProgress = Math.abs(progress);

      const scale = 1 - Math.min(absProgress * 0.35, 0.35); // scale 0.65
      const opacity = 1 - Math.min(absProgress * 0.2, 0.2);

      let translateXpx = 0;
      let translateYPercent = 0;
      let transformOrigin = "center center";

      if (progress > 0) {
        // ПОПЕРЕДНІЙ СЛАЙД (Ліворуч)
        translateYPercent = -absProgress * 18;
        translateXpx = absProgress;
        transformOrigin = "center right";
      } else if (progress < 0) {
        // НАСТУПНИЙ СЛАЙД (Праворуч)
        translateYPercent = absProgress * 18;
        translateXpx = -absProgress;
        transformOrigin = "center left";
      }

      $card.css({
        "transform-origin": transformOrigin,
        "transform": `translate(${translateXpx}px, ${translateYPercent}%) scale(${scale})`,
      });

      $(slide).css({
        opacity: opacity,
        zIndex: Math.round(10 - absProgress),
      });
    }
  };

  // ==========================================
  // 3. Формування опцій Swiper
  // ==========================================
  _functions.getSwOptions = function (swiper) {
    let options = swiper.data("options");
    options = !options || typeof options !== "object" ? {} : options;
    const $p = swiper.closest(".swiper-entry"),
      slidesLength = swiper.find(".swiper-wrapper>.swiper-slide").length;

    if (!options.pagination) {
      options.pagination = {
        el: $p.find(".swiper-pagination")[0],
        clickable: true,
        dynamicBullets: slidesLength > 6,
      };
    }

    if (options.customFraction) {
      $p.addClass("custom-fraction");
      if (slidesLength > 1) {
        $p.find(".custom-current").text("01");
        $p.find(".custom-total").text(
          slidesLength < 10 ? "0" + slidesLength : slidesLength
        );
      }
    }

    if (!options.navigation) {
      options.navigation = {
        nextEl: $p.find(".swiper-button-next")[0],
        prevEl: $p.find(".swiper-button-prev")[0],
      };
    }

    if (options.arrowsOut) {
      options.navigation = {
        nextEl: $p.closest(".section").find(".swiper-button-next")[0],
        prevEl: $p.closest(".section").find(".swiper-button-prev")[0],
      };
    }

    if (options.paginationOut) {
      options.pagination = {
        el: $p.closest(".section").find(".swiper-pagination")[0],
        clickable: true,
        dynamicBullets: slidesLength > 5,
      };
    }

    options.preloadImages = false;
    options.lazy = {
      loadPrevNext: true,
    };
    options.observer = true;
    options.observeParents = true;
    options.watchOverflow = true;
    options.centerInsufficientSlides = true;
    if (!options.speed) options.speed = 700;
    options.roundLengths = true;

    if (slidesLength <= 1) {
      options.loop = false;
    }

    // Безпечна робота з об'єктом подій
    options.on = options.on || {};
    const isOffers =
      options.offersTransform || swiper.closest(".offers-slider").length;

    if (isOffers) {
      options.watchSlidesProgress = true;
    }

    // Єдиний обробник ініціалізації
    const originalInit = options.on.init;
    options.on.init = function (sw) {
      if (typeof originalInit === "function") originalInit(sw);

      if (isOffers) {
        requestAnimationFrame(function () {
          sw.update();
          _functions.applyOffersTransform(sw);
          _functions.toggleSliderBar(sw);
        });
      } else {
        _functions.toggleSliderBar(sw);
      }
    };

    // Обробники для ресайзу та зміни брекпоінтів
    const originalBreakpoint = options.on.breakpoint;
    options.on.breakpoint = function (sw) {
      if (typeof originalBreakpoint === "function") originalBreakpoint(sw);
      _functions.toggleSliderBar(sw);
    };

    const originalResize = options.on.resize;
    options.on.resize = function (sw) {
      if (typeof originalResize === "function") originalResize(sw);
      _functions.toggleSliderBar(sw);
    };

    // Додаткові події для спец-слайдера
    if (isOffers) {
      options.on.setTranslate = function (sw) {
        _functions.applyOffersTransform(sw);
      };

      options.on.setTransition = function (sw, duration) {
        const easing = "cubic-bezier(0.25, 1, 0.5, 1)";
        $(sw.slides).css({
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: easing,
        });
        $(sw.slides)
          .find(".article, .promo-card")
          .css({
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: easing,
          });
      };
    }

    return options;
  };

  // ==========================================
  // 4. Ініціалізація всіх Swiper контейнерів
  // ==========================================
  _functions.initSwiper = function (el) {
    if (!el || !el.length) return;
    const swiper = new Swiper(el[0], _functions.getSwOptions(el));
  };

  $(".swiper-entry .swiper-container").each(function () {
    _functions.initSwiper($(this));
  });

  // ==========================================
  // 5. Product Gallery Thumbs
  // ==========================================
  $(".product-gallery").each(function () {
    if (
      $(".product-gallery__main").length &&
      $(".product-gallery__thumbs").length
    ) {
      let t = $(this);
      let topContainer = t.find(".product-gallery__main>.swiper-container")[0],
        bottomContainer = t.find(
          ".product-gallery__thumbs>.swiper-container"
        )[0];

      if (
        topContainer &&
        bottomContainer &&
        topContainer.swiper &&
        bottomContainer.swiper
      ) {
        let top = topContainer.swiper,
          bottom = bottomContainer.swiper;

        top.thumbs.swiper = bottom;
        top.thumbs.init();
        top.thumbs.update();

        if (top.slides.length < 2) {
          t.addClass("hide-bottom");
        }
      }
    }
  });

  // ==========================================
  // 6. Custom Fraction Handler
  // ==========================================
  $(".custom-fraction").each(function () {
    let $this = $(this),
      swiperEl = $(this).find(".swiper-container")[0];

    if (swiperEl && swiperEl.swiper) {
      let $thisSwiper = swiperEl.swiper;

      $thisSwiper.on("slideChange", function () {
        $this.find(".custom-current").text(function () {
          let currentSlide = $thisSwiper.realIndex + 1;
          return currentSlide < 10 ? "0" + currentSlide : currentSlide;
        });
      });
    }
  });

  // ==========================================
  // 7. Banner Slider & Custom Controls
  // ==========================================
  $(".banner-slider").each(function () {
    let swiperEl = $(this).find(".swiper-container")[0];
    if (!swiperEl || !swiperEl.swiper) return;

    let $thisSwiper = swiperEl.swiper;

    if ($thisSwiper.slides.length <= 2) {
      $(".swiper-controls-wrap").addClass("custom-btn-lock");
    } else {
      $(".swiper-controls-wrap").removeClass("custom-btn-lock");
    }

    $thisSwiper.on("slideChange", function () {
      _functions.updateCustomPagination($thisSwiper);
    });

    $thisSwiper.on("slideChangeTransitionEnd", function () {
      var $cSlides = $(".swiper-container").find(".swiper-slide");
      _functions.customSlide($thisSwiper, $cSlides);
    });

    $(".banner-btn").on("click", function () {
      const slideIndex = $(this).data("index");
      $thisSwiper.slideToLoop(slideIndex);
      if ($thisSwiper.autoplay) {
        $thisSwiper.autoplay.start();
      }
    });
  });

  // ==========================================
  // 8. Допоміжні функції для Banner
  // ==========================================
  _functions.customSlide = function (swiperObj, $customSlides) {
    var slideTo = $customSlides.eq(swiperObj.activeIndex),
      slideFrom = $customSlides.eq(swiperObj.previousIndex);

    var prevSlideVideo = slideFrom.find("video")[0],
      activeSlideVideo = slideTo.find("video")[0];

    if (prevSlideVideo && !prevSlideVideo.paused) {
      prevSlideVideo.pause();
      prevSlideVideo.currentTime = 0;
    }
    if (activeSlideVideo) {
      setTimeout(() => {
        activeSlideVideo
          .play()
          .catch((error) => console.error("Play interrupted:", error));
      }, 100);
    }
  };

  _functions.updateCustomPagination = function (swiperObj) {
    $(".banner-btn").removeClass("active");
    $(".banner-btn-progress").removeClass("active");
    $(".banner-btn").eq(swiperObj.realIndex).addClass("active");
    $(".banner-btn-progress").eq(swiperObj.realIndex).addClass("active");
  };

  // ==========================================
  // 9. General Swiper Thumbs
  // ==========================================
  $(".swiper-thumbs").each(function () {
    if ($(".swiper-thumbs-top").length && $(".swiper-thumbs-bottom").length) {
      let t = $(this);
      let topContainer = t.find(".swiper-thumbs-top>.swiper-container")[0],
        bottomContainer = t.find(".swiper-thumbs-bottom>.swiper-container")[0];

      if (
        topContainer &&
        bottomContainer &&
        topContainer.swiper &&
        bottomContainer.swiper
      ) {
        let top = topContainer.swiper,
          bottom = bottomContainer.swiper;

        top.thumbs.swiper = bottom;
        top.thumbs.init();
        top.thumbs.update();

        if (top.slides.length < 2) {
          t.addClass("hide-bottom");
        }
      }
    }
  });
});