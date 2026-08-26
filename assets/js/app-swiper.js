//*===========
//*  SWIPER  =
//*===========
jQuery(function ($) {
  "use strict";
  // Options set Swiper
  _functions.getSwOptions = function (swiper) {
    let options = swiper.data("options");
    options = !options || typeof options !== "object" ? {} : options;
    const $p = swiper.closest(".swiper-entry"),
        slidesLength = swiper.find(".swiper-wrapper>.swiper-slide").length;

    if (!options.pagination)
      options.pagination = {
        el: $p.find(".swiper-pagination")[0],
        clickable: true,
       // dynamicBullets: slidesLength > 6 ? true : false,
      };
    if (options.customFraction) {

      $p.addClass('custom-fraction');
      if (slidesLength > 1 && slidesLength < 10) {
        $p.find('.custom-current').text('01');
        $p.find('.custom-total').text('0' + slidesLength);
      } else if (slidesLength > 1) {
        $p.find('.custom-current').text('01');
        $p.find('.custom-total').text('0' + slidesLength);
      }
    };
    if (!options.navigation)
      options.navigation = {
        nextEl: $p.find(".swiper-button-next")[0],
        prevEl: $p.find(".swiper-button-prev")[0],
      };
    if (options.arrowsOut)
      options.navigation = {
        nextEl: $p.closest(".section").find(".swiper-button-next")[0],
        prevEl: $p.closest(".section").find(".swiper-button-prev")[0],
      };
    if (options.paginationOut)
      options.pagination = {
        el: $p.closest(".section").find(".swiper-pagination")[0],
        clickable: true,
        dynamicBullets: slidesLength > 5 ? true : false,
      };
    options.preloadImages = false;
    options.lazy = {
      loadPrevNext: true,
    };
    options.observer = true;
    options.observeParents = true;
    options.watchOverflow = true;
    options.centerInsufficientSlides = true;
    if (!options.speed) options.speed = 1000;
    options.roundLengths = true;
    if (slidesLength <= 1) {
      options.loop = false;
    }

    return options;
  };

  // Init each Swiper
  _functions.initSwiper = function (el) {
    const swiper = new Swiper(el[0], _functions.getSwOptions(el));
  };
  $(".swiper-entry .swiper-container").each(function () {
    _functions.initSwiper($(this));
  });

  // Thumbs Swiper
  $(".product-gallery").each(function () {
    if ($(".product-gallery__main").length && $(".product-gallery__thumbs").length) {
      let t = $(this);
      let top = t.find(".product-gallery__main>.swiper-container")[0].swiper,
          bottom = t.find(".product-gallery__thumbs>.swiper-container")[0].swiper;
      top.thumbs.swiper = bottom;
      top.thumbs.init();
      top.thumbs.update();

      if (top.slides.length < 2) {
        t.addClass("hide-bottom");
      }
    }
  });

  //custom fraction
  $('.custom-fraction').each(function () {
    let $this = $(this),
        $thisSwiper = $(this).find('.swiper-container')[0].swiper,
        currentSlide = $thisSwiper.realIndex + 1;
    $thisSwiper.on('slideChange', function () {
      $this.find('.custom-current').text(
          function () {
            currentSlide = $thisSwiper.realIndex + 1;
            if ($thisSwiper.realIndex < 9) {
              return ('0' + currentSlide)
            } else {
              return '0' + currentSlide
            }
          }
      )
    });
  });


});
