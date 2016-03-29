define(['knockout', 'jquery', 'printelement'], function(ko, $) {
    ko.bindingHandlers.printelement = {
        init: function (element, valueAccessor) {
            var value = ko.utils.extend( valueAccessor()),
                valuePrint = {
                    pageTitle: value.title,
                    printBodyOptions: { styleToAdd: value.style }
                };

            ko.utils.registerEventHandler(element, "click", function() {
                $(element)
                    .parents(value.class)
                    .printElement(valuePrint);
            });

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                $(element).unbind("click");
            });

        }
    }
});