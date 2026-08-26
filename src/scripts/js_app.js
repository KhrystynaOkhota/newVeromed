var _functions = {}, winWidth, shareButton;

jQuery(function ($) {
    // 1. ПЕРЕВІРКА ПРИСТРОЇВ ТА БРАУЗЕРІВ
    const isTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchScreen) {
        $('html').addClass('touch-screen');
    }

    const userAgent = navigator.userAgent;
    // Сучасніший спосіб перевірки платформи Mac
    const is_Mac = (navigator.userAgentData?.platform || navigator.platform).toUpperCase().indexOf('MAC') >= 0;
    const is_IE = /MSIE 9/i.test(userAgent) || /rv:11.0/i.test(userAgent) || /MSIE 10/i.test(userAgent) || /Edge\/\d+/.test(userAgent);
    const is_Chrome = userAgent.indexOf('Chrome') >= 0 && userAgent.indexOf('Edge') < 0;

    winWidth = $(window).width();
    let winHeight = $(window).height();

    if (is_Mac) $('html').addClass('mac');
    if (is_IE) $('html').addClass('ie');
    if (is_Chrome) $('html').addClass('chrome');

    // 2. МОДАЛЬНІ ВІКНА (POPUP)
    let popupTop = 0;

    _functions.removeScroll = function () {
        popupTop = $(window).scrollTop();
        $('html').css({
            "position": "fixed",
            "top": -popupTop,
            "width": "100%"
        });
    };

    _functions.addScroll = function () {
        $('html').css({ "position": "static" });
        window.scroll(0, popupTop);
    };

    _functions.openPopup = function (popup) {
        $('.popup-content').removeClass('active');
        $(popup + ', .popup-wrapper').addClass('active');
        _functions.removeScroll();
    };

    _functions.closePopup = function () {
        $('.popup-wrapper, .popup-content').removeClass('active');
        _functions.addScroll();
    };

    $(document).on('click', '.open-popup', function (e) {
        e.preventDefault();
        _functions.openPopup('.popup-content[data-rel="' + $(this).data('rel') + '"]');
    });

    $(document).on('click', '.popup-wrapper .btn-close, .popup-wrapper .layer-close, .popup-wrapper .btn-back', function (e) {
        e.preventDefault();
        _functions.closePopup();
    });

    // 3. СКРОЛ ФУНКЦІЇ (ХЕДЕР ТА АНІМАЦІЇ ЕЛЕМЕНТІВ)
    let prev_scroll = 0;

    _functions.scrollCall = function () {
        const winScr = $(window).scrollTop();

        // Поведінка класу хедера при скролі
        if (winScr > prev_scroll) {
            $("header").addClass("scrolled");
        }
        prev_scroll = winScr;

        if (winScr <= 10) {
            $("header").removeClass("scrolled");
            prev_scroll = 0;
        }

        // Запуск анімації появи елементів сайту
        scrollAnime(winScr);
    };

    function scrollAnime(winScr) {
        const $animationElements = $('.animation').not('.animated');
        if ($animationElements.length) {
            const currentWinWidth = $(window).width();
            const currentWinHeight = $(window).height();

            $animationElements.each(function () {
                const $th = $(this);
                const triggerCoef = currentWinWidth < 768 ? 0.95 : 0.85;

                if (winScr >= $th.offset().top - (currentWinHeight * triggerCoef)) {
                    $th.addClass('animated');
                }
            });
        }
    }

    // Єдиний оптимізований слухач скролу (нативний, з passive: true для швидкодії)
    window.addEventListener('scroll', _functions.scrollCall, { passive: true });

    // Первинний виклик для перевірки стану сторінки одразу при завантаженні
    _functions.scrollCall();
    window.addEventListener('load', _functions.scrollCall);

    // 4. Мобільне МЕНЮ (БУРГЕР)
    let pageScrollPosition = 0;

    $(document).on("click", ".burger", function () {
        const $html = $("html");
        const $body = $("body");
        const $header = $(this).parents("header");

        $(this).toggleClass("burger--active");
        $header.toggleClass("is-open");

        if (!$html.hasClass("overflow-menu")) {
            // Меню відкривається
            pageScrollPosition = window.scrollY || document.documentElement.scrollTop;
            $html.addClass("overflow-menu");
            $body.css({
                position: 'fixed',
                top: `-${pageScrollPosition}px`,
                left: '0',
                width: '100%'
            });
        } else {
            // Меню закривається
            $html.removeClass("overflow-menu");
            $body.css({ position: '', top: '', left: '', width: '' });
            window.scrollTo(0, pageScrollPosition);
        }
    });

    // 5. ФІЛЬТРИ (ПРИСТРОЇ Мобільні / Десктоп)
    $(document).on("click", ".fl-title", function () {
        $(this).toggleClass("is-active")
            .closest(".fl-menu-item").toggleClass("is-open")
            .find(".fl-toggle").first().slideToggle(300);
    });

    /* $(document).on("click", ".fl-menu__open", function () {
         $("body, html").addClass("overflow-hidden");
         $(this).addClass("is-open");
         $(".fl-menu__wrap").addClass("is-open");
         $(".fl-menu__overlay").addClass("is-active");
     });
   $(document).on("click", ".fl-menu__close", function () {
         $("body, html").removeClass("overflow-hidden");
         $(this).removeClass("is-open");
         $(".fl-menu__wrap").removeClass("is-open");
         $(".fl-menu__overlay").removeClass("is-active");
     });
     $(document).on("click", ".fl-menu__overlay, .fl-menu__close", function () {
         $(".fl-menu__overlay").removeClass("is-active");
         $(".fl-menu__wrap").removeClass("is-open");
         $("body, html").removeClass("overflow-hidden");
         $(".btn-filter").removeClass("is-open");
     });*/

    // 6. ПОШУК (Оболонка шапки)
    $(document).on("click", ".js-open-search", function () {
        $("header").addClass("search-open");
        setTimeout(function () {
            $(".h-search").find("input").focus();
        }, 100);
    });

    $(document).on("click", ".js-close-search", function () {
        $("header").removeClass("search-open");
        $(".h-search").find("input").val("");
        $(".cab-search, .search__results-wrap").removeClass("active");
    });

    $(document).on("input", ".search input", function () {
        const val = $(this).val();
        const $res = $(this).closest(".search").find(".search__results-wrap");
        if (val.length) {
            $res.addClass("active");
        } else {
            $res.removeClass("active");
        }
    });

    // 7. СЛАЙДЕР ЦІНИ (UI Slider)
    if ($('#slider').length) {
        $("#slider").slider({
            range: true,
            min: 0,
            max: 7000,
            values: [8, 6666],
            slide: function (event, ui) {
                $(".from").val(ui.values[0]);
                $(".to").val(ui.values[1]);
            }
        });
    }
});

// ==========================================================================
// НАТИВНИЙ JAVASCRIPT (ПРАЦЮЄ БЕЗ CHROME/JQUERY ОБОРУДОК)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. АКОРДЕОНИ
    $(document).on('click', '.accordeon-title', function () {
        var accordeon = $(this).closest('.accordeon');
        accordeon.find('.accordeon-title.active').not(this).removeClass('active').next().slideUp();
        $(this).toggleClass('active').next().slideToggle();
    });

    // 2. КЛІКЕР КІЛЬКОСТІ (INCREMENT / DECREMENT)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.quantity-picker__btn');
        if (!btn) return;

        const container = btn.closest('.quantity-picker');
        const input = container.querySelector('.quantity-picker__input');
        if (!input) return;

        const isIncrement = btn.classList.contains('quantity-picker__btn--increment');
        const value = parseInt(input.value, 10) || 0;
        const min = input.dataset.min ? Number(input.dataset.min) : 1;
        const max = input.dataset.max ? Number(input.dataset.max) : Infinity;

        if (isIncrement && value < max) {
            input.value = value + 1;
        } else if (!isIncrement && value > min) {
            input.value = value - 1;
        }

        input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // 3. ВІДЕОПЛЕЄР
    $(document).on('click', '.media__btn', function () {
        let $entry = $(this).closest('.media__entry');
        let videoItem = $entry.find('video').get(0);

        if (videoItem.paused) {
            videoItem.play();
            $entry.find('video').attr('controls', '');
            $(this).addClass('hide');
            $entry.find(".heading").css({ "display": "none" });
        } else {
            videoItem.pause();
            $(this).closest('.video-full').find('video').removeAttr('controls');
            $(this).closest('.btn-play').removeClass('hide');
        }
    });

    // 4. ТАБИ
    const tabs = document.querySelectorAll(".tab");
    function tabify(tab) {
        const tabList = tab.querySelector(".tab__list");
        if (tabList) {
            const tabItems = [...tabList.children];
            const tabContent = tab.querySelector(".tab__content");
            const tabContentItems = [...tabContent.children];

            let tabIndex = tabItems.findIndex(item => item.classList.contains("is--active"));
            if (tabIndex === -1) tabIndex = 0;

            function setTab(index) {
                tabItems.forEach(x => x.classList.remove("is--active"));
                tabContentItems.forEach(x => x.classList.remove("is--active"));
                tabItems[index].classList.add("is--active");
                tabContentItems[index].classList.add("is--active");
            }

            tabItems.forEach((x, index) => x.addEventListener("click", () => setTab(index)));
            setTab(tabIndex);
        }
    }
    tabs.forEach(tabify);

    // 5. АНІМАЦІЯ ЛІЧИЛЬНИКІВ (STATS)
    const obsCounter = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("animated");

            $(entry.target).find(".stats__value--number").each(function () {
                $(this).prop("Counter", 0).animate({
                    Counter: $(this).text(),
                }, {
                    duration: 1500,
                    easing: "swing",
                    step: function (now) {
                        $(this).text(Math.ceil(now));
                    },
                });
            });
            observer.unobserve(entry.target);
        });
    });
    document.querySelectorAll(".stats__grid").forEach(block => obsCounter.observe(block));

    // 6. ЗАВАНТАЖЕННЯ ФАЙЛУ (ДЛЯ ФОРМ)
    $(document).on('change', '.upload-file', function () {
        const format = $(this).val();
        const fileName = format.substring(format.lastIndexOf("\\") + 1);
        const $nameLabel = $('.upload-file__name');

        if (format === '') {
            $nameLabel.text($nameLabel.data('placeholder-text'));
        } else {
            $nameLabel.text(fileName);
        }
    });

    // 7. СЕО БЛОК (SEO Блок з плавною висотою)
    document.querySelectorAll('.info-block').forEach(function (infoBlock) {
        const content = infoBlock.querySelector('.info-block__content');
        const text = content ? content.querySelector('.info-block__text') : null;
        const button = infoBlock.querySelector('.btn-more');

        if (!content || !text || !button) return;

        const fullHeight = text.scrollHeight;
        const minHeight = parseInt(window.getComputedStyle(content).minHeight) || 0;

        if (fullHeight <= minHeight) {
            button.style.display = 'none';
            return;
        }

        button.addEventListener('click', function () {
            const isActive = this.classList.toggle('is-active');
            const targetHeight = isActive ? fullHeight : minHeight;

            content.style.transition = 'height .5s ease';
            content.style.height = targetHeight + 'px';

            if (isActive) {
                setTimeout(() => { content.style.height = 'auto'; }, 600);
            }
        });
    });

    // 8. ПЕРЕМИКАЧ МОВ (LANG SWITCHER)
    const langWrap = document.querySelector('.lang__wrap');
    if (langWrap) {
        const langBtn = langWrap.querySelector('.lang__current');

        const toggleLang = () => {
            const isExpanded = langBtn.getAttribute('aria-expanded') === 'true';
            langBtn.setAttribute('aria-expanded', !isExpanded);
        };

        langBtn.addEventListener('click', (e) => {
            if (window.matchMedia('(pointer: coarse)').matches) {
                e.preventDefault();
                e.stopPropagation();
                toggleLang();
            }
        });

        document.addEventListener('click', (e) => {
            if (!langWrap.contains(e.target)) {
                langBtn.setAttribute('aria-expanded', 'false');
            }
        });

        langWrap.addEventListener('mouseenter', () => {
            if (window.matchMedia('(hover: hover)').matches) {
                langBtn.setAttribute('aria-expanded', 'true');
            }
        });

        langWrap.addEventListener('mouseleave', () => {
            if (window.matchMedia('(hover: hover)').matches) {
                langBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
});