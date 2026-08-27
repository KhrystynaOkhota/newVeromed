jQuery(function ($) {
  "use strict";

  // Глобальний об'єкт для функцій (якщо він використовується у вашому проекті)
  window._functions = window._functions || {};

  // ==========================================
  // 1. Функція розрахунку трансформацій слайдів
  // ==========================================
_functions.applyOffersTransform = function (swiper) {
  const slides = swiper.slides;
  if (!slides || !slides.length) return;

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const $card = $(slide).find(".article, .offer-card");
    if (!$card.length) continue;

    const progress = slide.progress;
    const absProgress = Math.abs(progress);

    const scale = 1 - Math.min(absProgress * 0.35, 0.35); // scale 0.65
    const opacity = 1 - Math.min(absProgress * 0.2, 0.2);

    let translateXpx = 0;
    let translateYPercent = 0;
    let transformOrigin = "center center"; // Дефолтне значення для центрального слайда

    if (progress < 0) {
      // ПОПЕРЕДНІЙ СЛАЙД (Ліворуч):
      // Вгору (-18%), зсув вправо та прив'язка до правої грані
      translateYPercent = -absProgress * 18;
      translateXpx = absProgress * 20;
      transformOrigin = "center left";
    } else if (progress > 0) {
      // НАСТУПНИЙ СЛАЙД (Праворуч):
      // Вниз (+18%), зсув вліво та прив'язка до лівої грані
      translateYPercent = absProgress * 18; // Замініть на -absProgress * 18, якщо треба вгору
      translateXpx = -absProgress * 20;
      transformOrigin = "center right";
    }

    $card.css({
      "transform-origin": transformOrigin, // Передаємо індивідуальну точку якіря
      "transform": `translate(${translateXpx}px, ${translateYPercent}%) scale(${scale})`,
    });

    $(slide).css({
      opacity: opacity,
      zIndex: Math.round(10 - absProgress),
    });
  }
};
  // ==========================================
  // 2. Формування опцій Swiper
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

    // --- Кастомний ефект для слайдера спецпропозицій ---
    if (options.offersTransform || swiper.closest(".offers-slider").length) {
      options.watchSlidesProgress = true;
      options.on = options.on || {};

      // Ініціалізація без стартового стрибка
      options.on.init = function (sw) {
        requestAnimationFrame(function () {
          sw.update();
          _functions.applyOffersTransform(sw);
        });
      };

      // Плавний перерахунок під час драгу / скролу
      options.on.setTranslate = function (sw) {
        _functions.applyOffersTransform(sw);
      };

      // Плавний transition при закінченні перемикання
      options.on.setTransition = function (sw, duration) {
        const easing = "cubic-bezier(0.25, 1, 0.5, 1)";
        $(sw.slides).css({
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: easing,
        });
        $(sw.slides)
          .find(".article, .offer-card")
          .css({
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: easing,
          });
      };
    }

    return options;
  };

  // ==========================================
  // 3. Ініціалізація всіх Swiper контейнерів
  // ==========================================
  _functions.initSwiper = function (el) {
    if (!el || !el.length) return;
    const swiper = new Swiper(el[0], _functions.getSwOptions(el));
  };

  $(".swiper-entry .swiper-container").each(function () {
    _functions.initSwiper($(this));
  });

  // ==========================================
  // 4. Product Gallery Thumbs
  // ==========================================
  $(".product-gallery").each(function () {
    if ($(".product-gallery__main").length && $(".product-gallery__thumbs").length) {
      let t = $(this);
      let topContainer = t.find(".product-gallery__main>.swiper-container")[0],
        bottomContainer = t.find(".product-gallery__thumbs>.swiper-container")[0];

      if (topContainer && bottomContainer && topContainer.swiper && bottomContainer.swiper) {
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
  // 5. Custom Fraction Handler
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
  // 6. Banner Slider & Custom Controls
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
  // 7. Вспоміжні функції для Banner
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
  // 8. General Swiper Thumbs
  // ==========================================
  $(".swiper-thumbs").each(function () {
    if ($(".swiper-thumbs-top").length && $(".swiper-thumbs-bottom").length) {
      let t = $(this);
      let topContainer = t.find(".swiper-thumbs-top>.swiper-container")[0],
        bottomContainer = t.find(".swiper-thumbs-bottom>.swiper-container")[0];

      if (topContainer && bottomContainer && topContainer.swiper && bottomContainer.swiper) {
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