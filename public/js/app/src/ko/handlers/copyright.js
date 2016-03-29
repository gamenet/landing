define(['knockout'], function(ko){
    ko.bindingHandlers.copyright = {
        update: function(element, valueAccessor) {
            var firstYear = ko.utils.unwrapObservable(valueAccessor()),
                $element = $(element),
                newDate = new Date(),
                secondYear = newDate.getFullYear(),
                year;

            year = firstYear != secondYear ? firstYear + '&#160;&#8211;&#160;' + secondYear : firstYear;
            $element.html( '&#169;&#160;' + year + '&#160;' );
        }
    }
});
