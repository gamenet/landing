define(['knockout'], function(ko){
    ko.bindingHandlers.ga = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
            var value = valueAccessor();
            var isObj = ( typeof value === 'object' && !(value instanceof Array) );
            var track = isObj ? value.track : value;
            var eventName = isObj ? value.eventName : 'click';

            var newValueAccessor = function () {
                var result = {};
                result[eventName] = function() {
                    if (!window.ga) {
                        return;
                    }
                    window.ga.apply(window.ga, ['send', 'event'].concat(track));
                };
                return result;
            };
            ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, viewModel, context);
        }
    }
});
