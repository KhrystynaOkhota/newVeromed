/*jQuery(function ($) {
    // ініціалізація SumoSelect
    if ($('.orderby').length) {
        $('.orderby').each(function () {
            $(this).SumoSelect({
                floatWidth: 0,
                nativeOnDevice: [], // вимикаємо нативне меню пристрою
                forceCustomRendering: true, // змушуємо плагін малювати свій HTML на мобільних
                isFullScreen: false // вимикаємо перекриття всього екрану модалкою
            });
        });
    }
});*/

jQuery(document).ready(function () {
    jQuery('.orderby').each(function() {
        // Беремо текст першої опції як плейсхолдер (для підтримки багатомовності)
        var placeholderText = jQuery(this).find('option:first').text();
        
        jQuery(this).SumoSelect({
            placeholder: placeholderText,
            forceCustomRendering: true,
            csvDispCount: 3
        });
    });
});