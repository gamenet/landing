define(['knockout'], function (ko) {
    ko.extenders.captcha = function(target) {
        target.hasError = ko.observable(false);
        target.validationMessage = ko.observable('');
        target.needClean = ko.observable(false);

        target.valid = ko.pureComputed(function(){
            return target() !== '' && !target.hasError();
        });

        function validate(value) {
            target.needClean(false);

            if (value === '') {
                target.validationMessage('');
            } else if (value.match(/[^A-Za-z0-9]/) !== null) {
                target.validationMessage('Недопустимые символы в коде');
                target.needClean(true);
            } else {
                target.validationMessage('');
            }

            target.hasError(target.validationMessage() !== '');

            return !target.hasError();
        }

        target.subscribe(validate);

        return target;
    };
});