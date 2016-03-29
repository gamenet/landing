requirejs.config({
    waitSeconds: 30,
    baseUrl: '/',
    paths: {
        'knockout': '/vendor/knockout/dist/knockout',
        'knockout-postbox': '/vendor/knockout-postbox/build/knockout-postbox.min',
        'jquery': '/components/common/require_jquery',
        'text': '/vendor/text/text',
        'page': '/vendor/page/page',
        'xsolla': '/vendor/xsolla-paystation-widget/dist/widget.min',
        'decompose-url': '/vendor/decompose-url/decompose-url',
        'mobile-detect': '/vendor/mobile-detect.js/mobile-detect.min',
        'popupTemplate': '/vendor/popupTemplate/knockout.popupTemplate',
        'moment': '/vendor/moment/min/moment-with-locales.min',
        'yandexShare': '//yastatic.net/share2/share',
        'vkApi': '//vk.com/js/api/openapi',
        'fancybox': '/common/js/libs/jquery.fancybox',
        'printelement': '/vendor/jQueryPlugins/jQuery.printElement/jquery.printElement.min',
        'scrollpane': '/vendor/jScrollPane/script/jquery.jscrollpane.min',
        'datepicker': '/vendor/bootstrap-datepicker/dist/js/bootstrap-datepicker.min',
        'datepickerru': '/vendor/bootstrap-datepicker/dist/locales/bootstrap-datepicker.ru.min'
    },
    shim: {
        yandexShare: {exports: 'Ya'},
        vkApi: {exports: 'VK'},
        fancybox: {deps: ['jquery']},
        datepickerru: {deps: ['datepicker']},
        '*': {
            jquery: {exports: 'jQuery'}
        }
    },
    map: {
        '*': {
            'css': '/vendor/require-css/css.min.js'
        }
    }
});