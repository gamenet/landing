define(['knockout'], function(ko){
    ko.bindingHandlers.selected = {
        update: function(element, valueAccessor) {
            var selected = ko.utils.unwrapObservable(valueAccessor());
            if (selected) element.select();
        }
    }
});
