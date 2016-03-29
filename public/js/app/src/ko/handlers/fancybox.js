define(['knockout', 'jquery', 'fancybox', 'css!/css/libs/jquery.fancybox.css'], function(ko, $) {
    ko.bindingHandlers.fancybox = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
            var value = ko.utils.extend(valueAccessor(), {
                padding: 0,
                openEffect: 'fade',
                closeEffect: 'none',
                nextEffect : 'elastic',
                prevEffect : 'elastic',
                maxWidth: 960,
                arrows    : true,
                nextClick : true
            });

            $(element).on('focusin', function(){
                $(this)
                    .find(value.class)
                    .attr('rel', 'gallery')
                    .fancybox(value);
            });

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(document).unbind('click.fb-start');
            });
        }
    }
});