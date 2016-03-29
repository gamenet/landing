define(['knockout', 'jquery', 'datepicker', 'datepickerru','css!/vendor/bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css'], function(ko, $) {
    ko.bindingHandlers.datepicker = {
        init: function (element, valueAccessor, allBindingsAccessor) {

            var options = allBindingsAccessor().datepickerOptions || {};
            $(element).datepicker(options);

            ko.utils.registerEventHandler(element, "change", function () {
                var observable = valueAccessor();
                observable($(element).datepicker("getDate"));
            });

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                $(element).datepicker("destroy");
            });

        },
        update: function(element, valueAccessor) {
            
            var value = ko.utils.unwrapObservable(valueAccessor()),
                current = $(element).datepicker("getDate");

            if (value - current !== 0) {
                $(element).datepicker("setDate", value);
            }
        }
    }
});