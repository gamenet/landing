define(['knockout', 'jquery', 'scrollpane'], function(ko, $) {
    ko.bindingHandlers.scrollpane = {
        init: function (element, valueAccessor) {
            var settings = ko.utils.extend( valueAccessor());
            $(element).jScrollPane(settings);
            $(window).resize(function() {
                var scroll = $(element).data("jsp");
                if (scroll) {
                    scroll.reinitialise();
                }
            });

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                var scroll = $(element).data("jsp");
                scroll.destroy();
            });
        }
    }
});