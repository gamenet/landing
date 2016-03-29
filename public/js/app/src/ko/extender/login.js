define(['knockout'], function (ko) {
    ko.extenders.login = function(target) {
        target.hasError = ko.observable(false);
        target.validationMessage = ko.observable('');
        target.needClean = ko.observable(false);

        target.valid = ko.pureComputed(function(){
            return target() !== '' && !target.hasError();
        });

        function validate(value) {
            var at = value.indexOf('@'),
                name = (at === -1) ? '' : value.substr(0, at),
                domain = (at === -1) ? '' : value.substr(at + 1);

            target.needClean(false);

            if (value.match(/[^A-Za-z0-9@\._\-]/) !== null) {
                target.validationMessage('Недопустимые символы в почте');
                target.needClean(true);
            } else if (value === '') {
                target.validationMessage('');
            } else if (at === -1) {
                target.validationMessage('Похоже, вы забыли собаку (@)');
            } else if (name === '' || domain === '') {
                target.validationMessage('Не похоже, что это почта');
            } else if (domain.indexOf('.') === -1) {
                target.validationMessage('Похоже, вы забыли точку');
            } else if (/[@.]{2,}/.test(value) || value.match(/^[A-Za-z0-9._\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/) === null) {
                target.validationMessage('Не похоже, что это почта');
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